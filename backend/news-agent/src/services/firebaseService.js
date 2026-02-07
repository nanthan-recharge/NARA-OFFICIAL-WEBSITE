const admin = require('firebase-admin');
const { DateTime } = require('luxon');
const config = require('../config');
const logger = require('../config/logger');

let firestoreInstance;

const init = () => {
  if (firestoreInstance) return firestoreInstance;

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(config.firestore.serviceAccount),
      projectId: config.firestore.serviceAccount.project_id || config.vertex.projectId
    });
  }

  firestoreInstance = admin.firestore();
  firestoreInstance.settings({ ignoreUndefinedProperties: true });
  return firestoreInstance;
};

const formatFirestoreDate = isoDate => {
  if (!isoDate) return null;
  const dt = DateTime.fromISO(isoDate, { zone: 'utc' });
  if (!dt.isValid) return null;
  return admin.firestore.Timestamp.fromDate(dt.toJSDate());
};

const buildDocumentPayload = article => {
  const base = {
    title: article.title,
    summary: article.summary,
    content: article.content,
    category: article.category,
    author: article.author,
    author_position: article.authorPosition || null,
    location: article.location || null,
    read_time: article.readTime || null,
    views: article.views || 0,
    social_shares: article.socialShares || 0,
    tags: article.tags || [],
    publishedAt: formatFirestoreDate(article.publishedAt),
    createdAt: formatFirestoreDate(article.createdAt) || admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    is_featured: Boolean(article.isFeatured),
    heroImage: article.heroImage || null,
    coverImage: article.coverImage || null,
    source: article.source,
    sourceUrl: article.sourceUrl,
    sourceDomain: article.sourceDomain,
    sourceId: article.sourceId,
    sourceLanguage: article.sourceLanguage,
    contentHash: article.contentHash,
    slug: article.slug || article.documentId,
    attachments: article.attachments || [],
    translations: article.translations || null,
    key_points: article.keyPoints || [],
    autoSummary: article.autoSummary || null,
    ingestionMetadata: {
      ingestedAt: admin.firestore.FieldValue.serverTimestamp(),
      classifier: 'news-agent',
      classifierVersion: '2024-12-22',
      geminiModel: config.vertex.model
    }
  };

  if (article.highlight) {
    base.highlight = article.highlight;
  }

  return base;
};

const saveArticles = async articles => {
  const db = init();
  const batch = db.batch();
  const collection = db.collection(config.firestore.collection);

  articles.forEach(article => {
    const docRef = collection.doc(article.documentId);
    batch.set(docRef, buildDocumentPayload(article), { merge: true });
  });

  await batch.commit();
  logger.info({ count: articles.length }, 'Persisted articles to Firestore');
};

module.exports = {
  init,
  saveArticles
};
