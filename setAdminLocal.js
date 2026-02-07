#!/usr/bin/env node

/**
 * Local script to set admin privileges
 * Run: node setAdminLocal.js
 */

const admin = require('firebase-admin');

// Initialize with your service account
// Download service account key from Firebase Console first
try {
  const serviceAccount = require('./serviceAccountKey.json');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  const email = 'nanthan77@gmail.com'; // Your admin email
  const uid = '5ozxIin8XHPhz97MUih5VP7vZVa2'; // Your UID from earlier
  
  admin.auth().setCustomUserClaims(uid, { admin: true })
    .then(() => {
      console.log('✅ SUCCESS!');
      console.log(`Admin privileges granted to: ${email}`);
      console.log(`UID: ${uid}`);
      console.log('\n🎉 You can now login at:');
      console.log('https://nara-web-73384.web.app/admin/login');
      console.log('\nEmail: nanthan77@gmail.com');
      console.log('Password: london77');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error.message);
      process.exit(1);
    });
    
} catch (error) {
  console.error('\n❌ Error: serviceAccountKey.json not found!');
  console.log('\n📋 To fix this:');
  console.log('1. Go to: https://console.firebase.google.com/project/nara-web-73384/settings/serviceaccounts');
  console.log('2. Click "Generate New Private Key"');
  console.log('3. Save as "serviceAccountKey.json" in this directory');
  console.log('4. Run this script again: node setAdminLocal.js');
  process.exit(1);
}
