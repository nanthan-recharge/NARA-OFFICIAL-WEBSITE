const { v4: uuidv4 } = require('uuid');
const { DateTime } = require('luxon');
const logger = require('../config/logger');
const { collectArticles } = require('./sourceService');
const geminiService = require('./geminiService');
const firebaseService = require('./firebaseService');
const { ensureCategory } = require('./categoryService');
const {
  normalizeWhitespace,
  stripHtml,
  createContentHash,
  estimateReadTime
} = require('../utils/text');

const dedupeArticles = articles => {
  const seen = new Map();
  for (const article of articles) {
    const hash = createContentHash(article.sourceUrl, article.title, stripHtml(article.content));
    if (!seen.has(hash)) {
      seen.set(hash, { ...article, contentHash: hash });
    }
  }
  return Array.from(seen.values());
};

const buildArticlePayload = async article => {
  const base = {
    ...article,
    title: normalizeWhitespace(article.title),
    summary:
      normalizeWhitespace(article.summary) ||
      normalizeWhitespace(stripHtml(article.content).slice(0, 280)),
    content: article.content,
    readTime: estimateReadTime(article.content),
    keyPoints: [],
    autoSummary: null,
    translations: {}
  };

  if (!Array.isArray(base.tags)) {
    base.tags = base.tags ? [base.tags] : [];
  }

  try {
    const enriched = await geminiService.enrichArticle({
      title: base.title,
      summary: base.summary,
      content: stripHtml(base.content),
      publishedAt: base.publishedAt,
      source: base.source,
      sourceUrl: base.sourceUrl
    });

    base.autoSummary = enriched.summary;
    base.keyPoints = enriched.keyPoints || [];
    if (enriched.tags?.length) {
      base.tags = enriched.tags;
    }
    base.category = ensureCategory(base, enriched.category);
    base.translations = enriched.translations || {};
  } catch (error) {
    logger.warn({ title: base.title }, 'Falling back to heuristic classification');
    base.category = ensureCategory(base, null);
  }

  if (!base.category) {
    base.category = ensureCategory(base, null);
  }

  const nowIso = DateTime.utc().toISO();
  return {
    ...base,
    documentId: base.contentHash?.slice(0, 32) || uuidv4().replace(/-/g, ''),
    createdAt: base.createdAt || nowIso,
    updatedAt: nowIso
  };
};

const runAgent = async () => {
  logger.info('News agent run started');

  const collected = await collectArticles();
  logger.info({ count: collected.length }, 'Raw articles collected');

  const uniqueArticles = dedupeArticles(collected);
  logger.info({ count: uniqueArticles.length }, 'Articles after dedupe');

  const enrichedArticles = [];

  for (const article of uniqueArticles) {
    try {
      const payload = await buildArticlePayload(article);
      enrichedArticles.push(payload);
    } catch (error) {
      logger.error({ err: error, title: article.title }, 'Failed to prepare article');
    }
  }

  if (!enrichedArticles.length) {
    logger.warn('No articles to persist this run');
    return [];
  }

  await firebaseService.saveArticles(enrichedArticles);
  logger.info('News agent run completed');
  return enrichedArticles;
};

module.exports = {
  runAgent
};
