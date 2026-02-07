#!/usr/bin/env node

/**
 * Quick Admin Setup Script
 * Run: node setupAdmin.js
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔐 NARA Admin Panel - Quick Setup\n');
console.log('This script will guide you through creating an admin user.\n');

const setup = {
  email: '',
  password: '',
  uid: ''
};

// Step 1: Get email
rl.question('📧 Enter admin email (e.g., admin@nara.gov.lk): ', (email) => {
  setup.email = email;
  
  // Step 2: Get password
  rl.question('🔑 Enter admin password (min 6 characters): ', (password) => {
    setup.password = password;
    
    console.log('\n\n✅ Admin Setup Information:\n');
    console.log('═══════════════════════════════════════════\n');
    console.log(`Email:    ${setup.email}`);
    console.log(`Password: ${setup.password}`);
    console.log('\n═══════════════════════════════════════════\n');
    
    console.log('\n📋 NEXT STEPS:\n');
    console.log('1. Go to Firebase Console:');
    console.log('   https://console.firebase.google.com/project/nara-web-73384/authentication\n');
    
    console.log('2. Click "Add User" and enter:');
    console.log(`   - Email: ${setup.email}`);
    console.log(`   - Password: ${setup.password}\n`);
    
    console.log('3. Copy the User UID from the user list\n');
    
    rl.question('4. Paste the User UID here: ', (uid) => {
      setup.uid = uid.trim();
      
      console.log('\n\n🚀 FINAL SETUP COMMAND:\n');
      console.log('═══════════════════════════════════════════\n');
      console.log('Run this in Firebase Functions or Cloud Shell:\n');
      console.log('```javascript');
      console.log(`admin.auth().setCustomUserClaims('${setup.uid}', { admin: true })`);
      console.log('  .then(() => console.log("Admin created!"));');
      console.log('```\n');
      console.log('═══════════════════════════════════════════\n');
      
      console.log('\n✨ OR use this Cloud Function:\n');
      console.log('1. Deploy function:');
      console.log('   firebase deploy --only functions\n');
      console.log('2. Call URL:');
      console.log(`   https://us-central1-nara-web-73384.cloudfunctions.net/makeFirstAdmin?email=${setup.email}\n`);
      
      console.log('\n🎉 After setup, login at:\n');
      console.log('   https://nara-web-73384.web.app/admin/login\n');
      console.log('   OR');
      console.log('   http://localhost:4029/admin/login\n');
      
      rl.close();
    });
  });
});
