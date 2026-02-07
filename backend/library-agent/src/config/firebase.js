const admin = require('firebase-admin');
const config = require('./index');
const logger = require('./logger');
const path = require('path');

// Try to load service account key from parent directory (library-api)
let serviceAccount;
const serviceAccountPath = path.join(__dirname, '../../../library-api/serviceAccountKey.json');

try {
  serviceAccount = require(serviceAccountPath);
  logger.info('Loaded Firebase service account from library-api');
} catch (error) {
  // Try current directory
  try {
    serviceAccount = require(path.join(__dirname, '../../serviceAccountKey.json'));
    logger.info('Loaded Firebase service account from library-agent');
  } catch (err) {
    logger.error('Firebase service account key not found. Please add serviceAccountKey.json');
    throw new Error('Firebase service account key not found');
  }
}

// Initialize Firebase Admin SDK (only if not already initialized)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: config.firebase.storageBucket
  });
  logger.info('Firebase initialized successfully');
} else {
  logger.info('Using existing Firebase app');
}

const bucket = admin.storage().bucket();

module.exports = { admin, bucket };

