#!/usr/bin/env node

/**
 * Upload translations_catalogue.json to Firebase Storage
 * Makes it publicly accessible for the frontend
 */

const admin = require('firebase-admin');
const fs = require('fs').promises;
const path = require('path');

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const serviceAccount = require('./library-agent/serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: 'nara-web-73384.firebasestorage.app'
    });
    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
    process.exit(1);
  }
}

const bucket = admin.storage().bucket();

async function uploadTranslationsCatalogue() {
  try {
    console.log('📤 Uploading translations_catalogue.json to Firebase Storage...\n');

    const cataloguePath = path.join(__dirname, '../public/translations_catalogue.json');
    const firebasePath = 'public/translations_catalogue.json';

    // Check if file exists
    try {
      await fs.access(cataloguePath);
    } catch (error) {
      console.error('❌ File not found:', cataloguePath);
      process.exit(1);
    }

    // Read file to verify it's valid JSON
    const catalogueData = await fs.readFile(cataloguePath, 'utf8');
    const parsed = JSON.parse(catalogueData);
    console.log(`📊 Found ${parsed.length} translation entries`);

    // Upload to Firebase Storage
    console.log('☁️  Uploading to Firebase Storage...');
    await bucket.upload(cataloguePath, {
      destination: firebasePath,
      metadata: {
        contentType: 'application/json',
        cacheControl: 'public, max-age=300', // 5 minutes cache
      }
    });

    // Note: File is already public via Firebase Storage rules
    console.log('✅ File uploaded (public via Storage rules)');

    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(firebasePath)}?alt=media`;

    console.log('✅ Upload successful!\n');
    console.log('📍 Public URL:', publicUrl);
    console.log('\n✨ Translations catalogue is now publicly accessible!');
    console.log('\nNext steps:');
    console.log('1. The .env file has been updated with the correct URL');
    console.log('2. Rebuild the app: npm run build');
    console.log('3. Deploy to Firebase: firebase deploy');
    console.log('4. Visit https://nara-web-73384.web.app/library?type=digital to see translations\n');

  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    process.exit(1);
  }
}

// Run
uploadTranslationsCatalogue()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
