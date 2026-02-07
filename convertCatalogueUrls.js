/**
 * Convert signed URLs to permanent public URLs in library catalogue
 *
 * This script converts expiring signed URLs to permanent public URLs
 * since Firebase Storage rules already allow public read access to PDFs.
 */

const fs = require('fs');
const path = require('path');

// Firebase Storage bucket name
const BUCKET_NAME = 'nara-web-73384.firebasestorage.app';

/**
 * Convert a signed URL to a permanent public URL
 * @param {string} signedUrl - The expiring signed URL
 * @returns {string} - The permanent public URL
 */
function convertToPublicUrl(signedUrl) {
  try {
    // Extract the path from the signed URL
    // Format: https://storage.googleapis.com/{bucket}/o/{encodedPath}?...
    const url = new URL(signedUrl);
    const pathMatch = url.pathname.match(/\/([^/]+)\/(.+)/);

    if (!pathMatch) {
      console.warn('Could not parse URL:', signedUrl);
      return signedUrl;
    }

    const encodedPath = pathMatch[2];

    // Create permanent public URL
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${BUCKET_NAME}/o/${encodedPath}?alt=media`;

    return publicUrl;
  } catch (error) {
    console.error('Error converting URL:', error.message);
    return signedUrl;
  }
}

/**
 * Main function to process the catalogue
 */
async function main() {
  const cataloguePath = path.join(__dirname, 'public', 'library_catalogue.json');
  const backupPath = path.join(__dirname, 'public', 'library_catalogue.backup.json');

  console.log('📚 Library Catalogue URL Converter');
  console.log('=====================================\n');

  // Read the catalogue
  console.log('📖 Reading catalogue file...');
  const catalogueData = JSON.parse(fs.readFileSync(cataloguePath, 'utf8'));
  console.log(`✅ Found ${catalogueData.length} books\n`);

  // Create backup
  console.log('💾 Creating backup...');
  fs.writeFileSync(backupPath, JSON.stringify(catalogueData, null, 2));
  console.log(`✅ Backup saved to: ${backupPath}\n`);

  // Convert URLs
  console.log('🔄 Converting signed URLs to permanent public URLs...');
  let convertedCount = 0;
  let skippedCount = 0;

  catalogueData.forEach((book, index) => {
    // Convert PDF URL
    if (book.url && book.url.includes('X-Goog-Algorithm')) {
      book.url = convertToPublicUrl(book.url);
      convertedCount++;
    } else {
      skippedCount++;
    }

    // Convert QR code URL
    if (book.qr_code_url && book.qr_code_url.includes('X-Goog-Algorithm')) {
      book.qr_code_url = convertToPublicUrl(book.qr_code_url);
    }

    // Show progress
    if ((index + 1) % 100 === 0) {
      console.log(`   Processed ${index + 1}/${catalogueData.length} books...`);
    }
  });

  console.log(`✅ Converted ${convertedCount} URLs`);
  console.log(`⏭️  Skipped ${skippedCount} URLs (already permanent)\n`);

  // Save updated catalogue
  console.log('💾 Saving updated catalogue...');
  fs.writeFileSync(cataloguePath, JSON.stringify(catalogueData, null, 2));
  console.log(`✅ Catalogue updated successfully!\n`);

  // Summary
  console.log('📊 Summary');
  console.log('=====================================');
  console.log(`Total books:        ${catalogueData.length}`);
  console.log(`URLs converted:     ${convertedCount}`);
  console.log(`URLs skipped:       ${skippedCount}`);
  console.log(`Backup location:    ${backupPath}`);
  console.log(`\n✨ All done! Your library catalogue is now ready with permanent URLs.\n`);
  console.log(`🚀 Next steps:`);
  console.log(`   1. Deploy to Firebase: npm run build && firebase deploy`);
  console.log(`   2. Test the library at: https://your-site.web.app/library\n`);
}

// Run the script
main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
