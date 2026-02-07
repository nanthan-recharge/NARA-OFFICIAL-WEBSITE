/**
 * Script to upload school list Excel file to Firebase Storage
 * 
 * Usage:
 * node scripts/uploadSchoolList.js path/to/school_list.xlsx
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { basename } from 'path';

// Initialize Firebase Admin
const serviceAccount = {
  projectId: "nara-web-73384",
  // Add your service account key here or set GOOGLE_APPLICATION_CREDENTIALS env var
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "nara-web-73384.firebasestorage.app"
});

const bucket = admin.storage().bucket();

async function uploadSchoolList(filePath) {
  try {
    console.log('📤 Uploading school list to Firebase Storage...');
    
    const fileName = basename(filePath);
    const destination = `data/school_list/${fileName}`;
    
    // Upload file
    await bucket.upload(filePath, {
      destination: destination,
      metadata: {
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        cacheControl: 'public, max-age=86400', // Cache for 24 hours
      }
    });

    // Make it publicly readable
    await bucket.file(destination).makePublic();

    // Get public URL
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(destination)}?alt=media`;

    console.log('✅ School list uploaded successfully!');
    console.log('📍 Public URL:', publicUrl);
    console.log('\n📝 Add this URL to your .env file:');
    console.log(`VITE_SCHOOL_LIST_URL=${publicUrl}`);
    
    return publicUrl;
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
}

// Run if called directly
const filePath = process.argv[2];
if (!filePath) {
  console.error('❌ Please provide a file path');
  console.log('Usage: node scripts/uploadSchoolList.js path/to/school_list.xlsx');
  process.exit(1);
}

uploadSchoolList(filePath)
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
