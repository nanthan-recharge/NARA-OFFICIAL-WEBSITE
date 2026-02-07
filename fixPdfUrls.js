/**
 * Fix PDF URLs - Update bucket name from .firebasestorage.app to .appspot.com
 */

const fs = require('fs');
const path = require('path');

const cataloguePath = path.join(__dirname, 'public', 'library_catalogue.json');
const backupPath = path.join(__dirname, 'public', 'library_catalogue.backup2.json');

console.log('🔧 Fixing PDF URLs...\n');

// Read catalogue
const catalogueData = JSON.parse(fs.readFileSync(cataloguePath, 'utf8'));
console.log(`📚 Found ${catalogueData.length} books\n`);

// Create backup
fs.writeFileSync(backupPath, JSON.stringify(catalogueData, null, 2));
console.log(`💾 Backup saved to: ${backupPath}\n`);

let fixedCount = 0;

// Fix URLs
catalogueData.forEach((book, index) => {
  let bookFixed = false;

  // Fix PDF URL
  if (book.url && book.url.includes('.firebasestorage.app')) {
    book.url = book.url.replace('.firebasestorage.app', '.appspot.com');
    bookFixed = true;
  }

  // Fix QR code URL
  if (book.qr_code_url && book.qr_code_url.includes('.firebasestorage.app')) {
    book.qr_code_url = book.qr_code_url.replace('.firebasestorage.app', '.appspot.com');
    bookFixed = true;
  }

  if (bookFixed) {
    fixedCount++;
  }

  if ((index + 1) % 100 === 0) {
    console.log(`   Processed ${index + 1}/${catalogueData.length} books...`);
  }
});

console.log(`\n✅ Fixed ${fixedCount} book URLs\n`);

// Save updated catalogue
fs.writeFileSync(cataloguePath, JSON.stringify(catalogueData, null, 2));
console.log(`💾 Catalogue updated successfully!\n`);

// Show sample
console.log('📋 Sample fixed URL:');
console.log(catalogueData[0].url);
console.log('\n✨ URLs fixed! Now deploy to Firebase.\n');
