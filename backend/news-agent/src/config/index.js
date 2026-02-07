const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const bool = (value, fallback = false) => {
  if (value === undefined) return fallback;
  return ['true', '1', 'yes', 'y'].includes(String(value).toLowerCase());
};

const splitList = (value, separator = ',') => {
  if (!value) return [];
  return value
    .split(separator)
    .map(item => item.trim())
    .filter(Boolean);
};

const resolveServiceAccount = () => {
  const rawValue = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!rawValue) return null;

  // Accept inline JSON
  if (rawValue.trim().startsWith('{')) {
    try {
      return JSON.parse(rawValue);
    } catch (error) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT contains invalid JSON');
    }
  }

  // Accept relative/absolute path
  const candidatePaths = [
    rawValue,
    path.resolve(process.cwd(), rawValue),
    path.resolve(__dirname, '..', '..', rawValue)
  ];

  for (const candidate of candidatePaths) {
    if (fs.existsSync(candidate)) {
      const data = fs.readFileSync(candidate, 'utf-8');
      try {
        return JSON.parse(data);
      } catch (error) {
        throw new Error(`Unable to parse Firebase service account JSON at ${candidate}`);
      }
    }
  }

  throw new Error(`Firebase service account not found using value: ${rawValue}`);
};

const firebaseServiceAccount = resolveServiceAccount();

const deriveProjectId = () => {
  return (
    process.env.GCP_PROJECT_ID ||
    firebaseServiceAccount?.project_id ||
    firebaseServiceAccount?.projectId ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.FIRESTORE_PROJECT_ID ||
    null
  );
};

const vertexProjectId = deriveProjectId();
if (!vertexProjectId) {
  throw new Error(
    'Missing Vertex project id. Set GCP_PROJECT_ID or ensure FIREBASE_SERVICE_ACCOUNT includes project_id.'
  );
}

const vertexLocation =
  process.env.GCP_LOCATION || process.env.GOOGLE_CLOUD_REGION || 'asia-southeast1';
const vertexModel = process.env.VERTEX_MODEL_NAME || 'gemini-1.5-pro';

module.exports = {
  env: process.env.NODE_ENV || 'development',
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  },
  scheduler: {
    cronExpression: process.env.CRON_EXPRESSION || '0 3 * * *'
  },
  scraper: {
    allowedSources: splitList(process.env.SCRAPER_ALLOWED_SOURCES),
    sriLankaKeywords: splitList(process.env.SCRAPER_SRI_LANKA_KEYWORDS),
    maxArticlesPerSource:
      Number.parseInt(process.env.SCRAPER_MAX_ARTICLES_PER_SOURCE, 10) || 12,
    lookbackDays: Number.parseInt(process.env.SCRAPER_LOOKBACK_DAYS, 10) || 7,
    maxConcurrentRequests:
      Number.parseInt(process.env.SCRAPER_MAX_CONCURRENT_REQUESTS, 10) || 3,
    enforceSriLankaOrigin: bool(process.env.SCRAPER_ENFORCE_LOCAL || 'true', true)
  },
  vertex: {
    projectId: vertexProjectId,
    location: vertexLocation,
    model: vertexModel,
    safetyCategory: process.env.VERTEX_SAFETY_CATEGORY,
    safetyThreshold: process.env.VERTEX_SAFETY_THRESHOLD || 'BLOCK_NONE'
  },
  translations: {
    languages: splitList(process.env.TRANSLATION_LANGUAGES || 'si,ta')
  },
  firestore: {
    collection: process.env.FIRESTORE_COLLECTION || 'newsArticles',
    serviceAccount: firebaseServiceAccount
  }
};
