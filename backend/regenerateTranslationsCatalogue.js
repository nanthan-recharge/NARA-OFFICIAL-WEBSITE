/**
 * Regenerate translations_catalogue.json based on ACTUAL files in Firebase Storage
 * This ensures the catalogue only lists translations that actually exist
 */

const admin = require('firebase-admin');
const fs = require('fs').promises;
const path = require('path');

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = require('./library-agent/serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'nara-web-73384.firebasestorage.app'
  });
}

const bucket = admin.storage().bucket();

async function regenerateCatalogue() {
  console.log('🔄 Regenerating Translations Catalogue...\n');

  // Load main catalogue to get book details
  const mainCataloguePath = path.join(__dirname, '../public/library_catalogue.json');
  const mainCatalogue = JSON.parse(await fs.readFile(mainCataloguePath, 'utf8'));
  console.log(`📖 Loaded ${mainCatalogue.length} books from main catalogue\n`);

  const translationsCatalogue = [];

  // Get all Tamil translation files
  console.log('🔍 Scanning Tamil translations...');
  const [tamilFiles] = await bucket.getFiles({ prefix: 'pdfs_tamil/' });
  const tamilTxtFiles = tamilFiles.filter(f => !f.name.endsWith('/') && f.name.endsWith('.txt'));
  console.log(`✅ Found ${tamilTxtFiles.length} Tamil translation files\n`);

  // Get all Sinhala translation files
  console.log('🔍 Scanning Sinhala translations...');
  const [sinhalaFiles] = await bucket.getFiles({ prefix: 'pdfs_sinhala/' });
  const sinhalaTxtFiles = sinhalaFiles.filter(f => !f.name.endsWith('/') && f.name.endsWith('.txt'));
  console.log(`✅ Found ${sinhalaTxtFiles.length} Sinhala translation files\n`);

  // Process Tamil files
  console.log('📝 Processing Tamil translations...');
  for (const file of tamilTxtFiles) {
    const fileName = path.basename(file.name, '.txt');
    const barcode = fileName; // e.g., NARA13975883023-...
    const barcodePrefix = barcode.split('-')[0]; // e.g., NARA13975883023

    // Find the original book by barcode
    const originalBook = mainCatalogue.find(b => b.barcode === barcodePrefix);

    if (originalBook) {
      // Use Firebase Storage URL format with download token
      const encodedPath = encodeURIComponent(file.name);
      const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media`;

      const translationEntry = {
        id: `${originalBook.id}-tamil`,
        original_id: originalBook.id,
        title: originalBook.title,
        author: originalBook.author,
        publication_year: originalBook.publication_year,
        publisher: originalBook.publisher,
        pages: originalBook.pages,
        language: 'Tamil',
        material_type_code: originalBook.material_type_code,
        material_type_name: originalBook.material_type_name,
        abstract: originalBook.abstract ? originalBook.abstract.substring(0, 200) : null,
        barcode: `${barcodePrefix}-TA`,
        url: url,
        qr_code_url: originalBook.qr_code_url,
        status: 'available',
        translations_available: ['tamil'],
        translations: {
          tamil: {
            url: url,
            translated_at: new Date().toISOString()
          }
        }
      };

      translationsCatalogue.push(translationEntry);
      console.log(`  ✅ ${originalBook.id}-tamil: ${originalBook.title.substring(0, 50)}...`);
    } else {
      console.log(`  ⚠️  No matching book for barcode: ${barcodePrefix}`);
    }
  }

  console.log();

  // Process Sinhala files
  console.log('📝 Processing Sinhala translations...');
  for (const file of sinhalaTxtFiles) {
    const fileName = path.basename(file.name, '.txt');
    const barcode = fileName;
    const barcodePrefix = barcode.split('-')[0];

    // Find the original book by barcode
    const originalBook = mainCatalogue.find(b => b.barcode === barcodePrefix);

    if (originalBook) {
      // Use Firebase Storage URL format with download token
      const encodedPath = encodeURIComponent(file.name);
      const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media`;

      const translationEntry = {
        id: `${originalBook.id}-sinhala`,
        original_id: originalBook.id,
        title: originalBook.title,
        author: originalBook.author,
        publication_year: originalBook.publication_year,
        publisher: originalBook.publisher,
        pages: originalBook.pages,
        language: 'Sinhala',
        material_type_code: originalBook.material_type_code,
        material_type_name: originalBook.material_type_name,
        abstract: originalBook.abstract ? originalBook.abstract.substring(0, 200) : null,
        barcode: `${barcodePrefix}-SI`,
        url: url,
        qr_code_url: originalBook.qr_code_url,
        status: 'available',
        translations_available: ['sinhala'],
        translations: {
          sinhala: {
            url: url,
            translated_at: new Date().toISOString()
          }
        }
      };

      translationsCatalogue.push(translationEntry);
      console.log(`  ✅ ${originalBook.id}-sinhala: ${originalBook.title.substring(0, 50)}...`);
    } else {
      console.log(`  ⚠️  No matching book for barcode: ${barcodePrefix}`);
    }
  }

  console.log();

  // Sort by ID
  translationsCatalogue.sort((a, b) => {
    const aId = parseInt(a.id.split('-')[0]);
    const bId = parseInt(b.id.split('-')[0]);
    if (aId !== bId) return aId - bId;
    return a.language.localeCompare(b.language);
  });

  // Save the catalogue
  const outputPath = path.join(__dirname, '../public/translations_catalogue.json');

  // Create backup of old file
  try {
    const oldContent = await fs.readFile(outputPath, 'utf8');
    const backupPath = outputPath.replace('.json', `.backup-${Date.now()}.json`);
    await fs.writeFile(backupPath, oldContent);
    console.log(`💾 Backed up old catalogue to: ${path.basename(backupPath)}\n`);
  } catch (error) {
    console.log('ℹ️  No existing catalogue to backup\n');
  }

  // Write new catalogue
  await fs.writeFile(outputPath, JSON.stringify(translationsCatalogue, null, 2));

  // Summary
  console.log('='.repeat(60));
  console.log('📊 REGENERATION COMPLETE');
  console.log('='.repeat(60));
  console.log(`✅ Total translation entries: ${translationsCatalogue.length}`);
  console.log(`✅ Tamil translations: ${tamilTxtFiles.length}`);
  console.log(`✅ Sinhala translations: ${sinhalaTxtFiles.length}`);
  console.log(`✅ Saved to: ${outputPath}\n`);

  console.log('🎉 Translations catalogue updated successfully!');
}

// Run
regenerateCatalogue()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
