const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'nara-web-73384.firebasestorage.app'
});

const bucket = admin.storage().bucket();

async function uploadCatalogue() {
  try {
    console.log('📤 Uploading library catalogue to Firebase Storage...');

    const filePath = '/tmp/library_catalogue.json';
    const destination = 'public/library_catalogue.json';

    // Upload file
    await bucket.upload(filePath, {
      destination: destination,
      metadata: {
        contentType: 'application/json',
        cacheControl: 'public, max-age=300', // Cache for 5 minutes
      },
    });

    // Get the public URL
    const file = bucket.file(destination);
    const [metadata] = await file.getMetadata();
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(destination)}?alt=media`;

    console.log('✅ Upload successful!');
    console.log('📍 Public URL:', publicUrl);
    console.log('\n🔧 Add this to your .env file:');
    console.log(`VITE_LIBRARY_CATALOGUE_URL=${publicUrl}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Upload failed:', error);
    process.exit(1);
  }
}

uploadCatalogue();
