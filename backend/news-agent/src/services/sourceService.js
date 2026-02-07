const Parser = require('rss-parser');
const axios = require('axios');
const { DateTime } = require('luxon');
const { URL } = require('url');
const config = require('../config');
const logger = require('../config/logger');
const sources = require('../config/sources');
const { containsAnyKeyword, normalizeWhitespace, sanitiseRichText } = require('../utils/text');

const rssParser = new Parser({
  timeout: 15000,
  maxRedirects: 4
});

const readArticleBody = async (url) => {
  try {
    const response = await axios.get(url, { timeout: 15000 });
    if (typeof response.data === 'string') {
      return response.data;
    }
  } catch (error) {
    logger.warn({ url, err: error.message }, 'Failed to fetch full article body');
  }
  return null;
};

const extractMeaningfulContent = (item, articleHtml) => {
  if (item['content:encoded']) {
    return item['content:encoded'];
  }
  if (item.content) {
    return item.content;
  }
  if (item.summary) {
    return item.summary;
  }
  if (item.contentSnippet) {
    return item.contentSnippet;
  }
  if (articleHtml) {
    return articleHtml;
  }
  return '';
};

const isWithinLookback = (dateIso) => {
  if (!dateIso) return true; // If no date, allow but log
  const published = DateTime.fromISO(dateIso, { zone: 'utc' });
  if (!published.isValid) return true;
  const threshold = DateTime.utc().minus({ days: config.scraper.lookbackDays });
  return published >= threshold;
};

const toIsoDate = (value) => {
  if (!value) return null;
  const parsed = DateTime.fromISO(value, { zone: 'utc' });
  if (parsed.isValid) return parsed.toISO();
  const asDate = DateTime.fromJSDate(new Date(value));
  return asDate.isValid ? asDate.toISO() : null;
};

const domainFromUrl = (link) => {
  try {
    const hostname = new URL(link).hostname;
    return hostname.replace('www.', '');
  } catch (error) {
    return null;
  }
};

const shouldAcceptArticle = (article, sourceDefinition) => {
  const { sriLankaKeywords, allowedSources } = config.scraper;

  if (allowedSources.length) {
    const domain = domainFromUrl(article.link);
    if (!domain || !allowedSources.includes(domain)) {
      logger.debug({ domain }, 'Article skipped: domain not in allow-list');
      return false;
    }
  }

  const unifiedContent = [article.title, article.summary, article.rawContent]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (sourceDefinition.topicFilters?.length) {
    const hasTopicMatch = containsAnyKeyword(unifiedContent, sourceDefinition.topicFilters);
    if (!hasTopicMatch) {
      logger.debug({ title: article.title }, 'Article skipped: no topic filter match');
      return false;
    }
  }

  if (sriLankaKeywords.length) {
    const hasKeyword = containsAnyKeyword(unifiedContent, sriLankaKeywords);
    if (!hasKeyword) {
      logger.debug({ title: article.title }, 'Article skipped: no Sri Lanka keyword match');
      return false;
    }
  }

  return true;
};

const mapItemToArticle = async (sourceDefinition, item) => {
  const link = item.link || item.guid;
  if (!link) {
    logger.debug('Skipping RSS item without link');
    return null;
  }

  const articleHtml = await readArticleBody(link);
  const rawContent = extractMeaningfulContent(item, articleHtml);
  const cleanContent = sanitiseRichText(rawContent);
  const summary = normalizeWhitespace(item.summary || item.contentSnippet || '');

  const article = {
    sourceId: item.guid || link,
    sourceUrl: link,
    source: sourceDefinition.name,
    sourceDomain: domainFromUrl(link),
    sourceLanguage: sourceDefinition.language,
    title: normalizeWhitespace(item.title),
    summary,
    rawContent,
    content: cleanContent,
    publishedAt: toIsoDate(item.isoDate || item.pubDate || item.published || item.date),
    createdAt: toIsoDate(item.isoDate || item.pubDate || item.published || item.date),
    tags: Array.isArray(item.categories) ? item.categories : item.categories ? [item.categories] : (sourceDefinition.tags || []),
    author: normalizeWhitespace(item.author || item.creator || '')
  };

  if (!isWithinLookback(article.publishedAt)) {
    logger.debug({ title: article.title }, 'Skipping article outside lookback window');
    return null;
  }

  if (!shouldAcceptArticle(article, sourceDefinition)) {
    return null;
  }

  return article;
};

const fetchFromSource = async (sourceDefinition) => {
  try {
    const feed = await rssParser.parseURL(sourceDefinition.url);
    const items = feed.items || [];

    const accepted = [];
    for (const item of items.slice(0, config.scraper.maxArticlesPerSource)) {
      const article = await mapItemToArticle(sourceDefinition, item);
      if (article) {
        accepted.push(article);
      }
    }

    logger.info({ source: sourceDefinition.id, count: accepted.length }, 'Fetched articles');
    return accepted;
  } catch (error) {
    logger.error({ source: sourceDefinition.id, err: error.message }, 'Failed to fetch source');
    return [];
  }
};

const collectArticles = async () => {
  const results = [];
  for (const source of sources) {
    const articles = await fetchFromSource(source);
    results.push(...articles);
  }
  return results;
};

module.exports = {
  collectArticles
};
