/**
 * Fix PDF URL Encoding - Properly encode paths for Firebase Storage
 */

const fs = require('fs');
const path = require('path');

const cataloguePath = path.join(__dirname, 'public', 'library_catalogue.json');
const backupPath = path.join(__dirname, 'public', 'library_catalogue.backup3.json');

console.log('🔧 Fixing PDF URL Encoding...\n');

// Read catalogue
const catalogueData = JSON.parse(fs.readFileSync(cataloguePath, 'utf8'));
console.log(`📚 Found ${catalogueData.length} books\n`);

// Create backup
fs.writeFileSync(backupPath, JSON.stringify(catalogueData, null, 2));
console.log(`💾 Backup saved to: ${backupPath}\n`);

/**
 * Properly encode Firebase Storage path
 */
function encodeStoragePath(filePath) {
  // Split path into segments, encode each, then join
  const segments = filePath.split('/').map(segment => encodeURIComponent(segment));
  return segments.join('%2F');
}

/**
 * Extract path from Firebase Storage URL
 */
function extractPath(url) {
  // Extract the path between /o/ and ?alt=media
  const match = url.match(/\/o\/(.+?)\?alt=media/);
  if (match) {
    // Decode the path to get actual file path
    return decodeURIComponent(match[1].replace(/%2F/g, '/'));
  }
  return null;
}

/**
 * Rebuild Firebase Storage URL with proper encoding
 */
function rebuildUrl(url) {
  const filePath = extractPath(url);
  if (!filePath) {
    console.error('Could not extract path from URL:', url);
    return url;
  }

  const encodedPath = encodeStoragePath(filePath);
  return `https://firebasestorage.googleapis.com/v0/b/nara-web-73384.appspot.com/o/${encodedPath}?alt=media`;
}

let fixedCount = 0;
const sampleUrls = [];

// Fix URLs
catalogueData.forEach((book, index) => {
  let bookFixed = false;

  // Fix PDF URL
  if (book.url) {
    const oldUrl = book.url;
    book.url = rebuildUrl(book.url);
    if (oldUrl !== book.url) {
      bookFixed = true;
    }

    // Store first 3 samples
    if (sampleUrls.length < 3) {
      sampleUrls.push({
        title: book.title.substring(0, 50),
        url: book.url
      });
    }
  }

  // Fix QR code URL
  if (book.qr_code_url) {
    const oldUrl = book.qr_code_url;
    book.qr_code_url = rebuildUrl(book.qr_code_url);
    if (oldUrl !== book.qr_code_url) {
      bookFixed = true;
    }
  }

  if (bookFixed) {
    fixedCount++;
  }

  if ((index + 1) % 100 === 0) {
    console.log(`   Processed ${index + 1}/${catalogueData.length} books...`);
  }
});

console.log(`\n✅ Rebuilt ${fixedCount} book URLs\n`);

// Save updated catalogue
fs.writeFileSync(cataloguePath, JSON.stringify(catalogueData, null, 2));
console.log(`💾 Catalogue updated successfully!\n`);

// Show samples
console.log('📋 Sample URLs (properly encoded):');
sampleUrls.forEach((sample, i) => {
  console.log(`\n${i + 1}. ${sample.title}...`);
  console.log(`   ${sample.url}`);
});

console.log('\n✨ URLs fixed with proper encoding!\n');
console.log('⚠️  NOTE: These URLs will only work if the PDFs actually exist in Firebase Storage.');
console.log('   If you see 404 errors, the PDFs need to be uploaded first.\n');
