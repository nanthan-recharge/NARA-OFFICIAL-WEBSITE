/**
 * Complete PDF Uploader for NARA Library
 * Downloads PDFs from source URLs and uploads to Firebase Storage
 */

const admin = require('firebase-admin');
const axios = require('axios');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const { createWriteStream } = require('fs');

// Initialize Firebase Admin (using application default credentials)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      projectId: 'nara-web-73384',
      storageBucket: 'nara-web-73384.appspot.com'
    });
    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error.message);
    console.log('💡 Tip: Run: firebase login');
    process.exit(1);
  }
}

const bucket = admin.storage().bucket();

class PDFUploader {
  constructor() {
    this.cataloguePath = path.join(__dirname, '../public/library_catalogue.json');
    this.tempDir = path.join(__dirname, 'temp/pdfs');
    this.successCount = 0;
    this.failCount = 0;
    this.skippedCount = 0;
    this.uploadedBooks = [];
  }

  async init() {
    // Create temp directory
    await fs.mkdir(this.tempDir, { recursive: true });
    console.log(`📁 Temp directory: ${this.tempDir}\n`);
  }

  /**
   * Download PDF from source URL
   */
  async downloadPDF(url, outputPath) {
    try {
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream',
        timeout: 60000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; NARA-Library-Bot/1.0)'
        }
      });

      const writer = createWriteStream(outputPath);

      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(true));
        writer.on('error', reject);
      });
    } catch (error) {
      throw new Error(`Download failed: ${error.message}`);
    }
  }

  /**
   * Upload PDF to Firebase Storage
   */
  async uploadToFirebase(localPath, firebasePath) {
    try {
      await bucket.upload(localPath, {
        destination: firebasePath,
        metadata: {
          contentType: 'application/pdf',
          cacheControl: 'public, max-age=31536000',
        }
      });

      // Make file publicly accessible
      const file = bucket.file(firebasePath);
      await file.makePublic();

      // Get public URL
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(firebasePath).replace(/%2F/g, '%2F')}?alt=media`;

      return publicUrl;
    } catch (error) {
      throw new Error(`Firebase upload failed: ${error.message}`);
    }
  }

  /**
   * Generate safe filename from book data
   */
  generateFilename(book) {
    const barcode = book.barcode || `BOOK${book.id}`;
    const title = book.title
      .substring(0, 50)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    return `${barcode}-${title}.pdf`;
  }

  /**
   * Get Firebase Storage path for book
   */
  getFirebasePath(book) {
    const category = book.material_type_name || 'General';
    const filename = this.generateFilename(book);
    return `pdfs/${category}/${filename}`;
  }

  /**
   * Try multiple sources to download PDF
   */
  async tryDownloadFromSources(book) {
    const sources = [];

    // Source 1: Direct source_url
    if (book.source_url) {
      sources.push({
        type: 'source_url',
        url: book.source_url
      });
    }

    // Source 2: Try CORE API if available
    if (book.download_source === 'CORE') {
      // Try to reconstruct CORE download URL from title/author
      // This is a fallback - we'll try to search CORE
      sources.push({
        type: 'core_search',
        title: book.title
      });
    }

    // Source 3: Internet Archive
    if (book.download_source === 'Internet Archive' && book.source_url) {
      // Internet Archive URLs need special handling
      const downloadUrl = book.source_url.replace('/details/', '/download/') + '/' + book.title.replace(/[^a-zA-Z0-9]/g, '_') + '.pdf';
      sources.push({
        type: 'internet_archive',
        url: downloadUrl
      });
    }

    // Try each source
    for (const source of sources) {
      try {
        const tempFile = path.join(this.tempDir, this.generateFilename(book));

        if (source.type === 'source_url' || source.type === 'internet_archive') {
          await this.downloadPDF(source.url, tempFile);

          // Verify it's actually a PDF
          const fileStats = await fs.stat(tempFile);
          if (fileStats.size < 1000) {
            throw new Error('Downloaded file too small, likely not a PDF');
          }

          return tempFile;
        }
      } catch (error) {
        console.log(`      ⚠️  ${source.type} failed: ${error.message}`);
        continue;
      }
    }

    throw new Error('All download sources failed');
  }

  /**
   * Process a single book
   */
  async processBook(book, index, total) {
    console.log(`\n[${index + 1}/${total}] ${book.title.substring(0, 60)}...`);
    console.log(`   Material: ${book.material_type_name}`);
    console.log(`   Source: ${book.download_source}`);

    try {
      // Step 1: Download PDF
      console.log('   📥 Downloading PDF...');
      const tempFile = await this.tryDownloadFromSources(book);

      const stats = await fs.stat(tempFile);
      console.log(`   ✅ Downloaded: ${(stats.size / 1024).toFixed(2)} KB`);

      // Step 2: Upload to Firebase
      console.log('   ☁️  Uploading to Firebase Storage...');
      const firebasePath = this.getFirebasePath(book);
      const publicUrl = await this.uploadToFirebase(tempFile, firebasePath);

      console.log(`   ✅ Uploaded: ${firebasePath}`);

      // Step 3: Clean up temp file
      await fs.unlink(tempFile);

      // Update book record
      book.url = publicUrl;
      book.firebase_path = firebasePath;
      book.uploaded_at = new Date().toISOString();

      this.successCount++;
      this.uploadedBooks.push({
        id: book.id,
        title: book.title,
        url: publicUrl,
        size: stats.size
      });

      return true;
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
      this.failCount++;

      // Mark as failed but keep in catalogue
      book.upload_error = error.message;
      book.upload_attempted_at = new Date().toISOString();

      return false;
    }
  }

  /**
   * Main process - upload all PDFs
   */
  async uploadAll() {
    console.log('📚 NARA Library - Complete PDF Upload System');
    console.log('='.repeat(60));
    console.log();

    await this.init();

    // Load catalogue
    console.log('📖 Loading catalogue...');
    const catalogueData = JSON.parse(await fs.readFile(this.cataloguePath, 'utf8'));
    console.log(`✅ Loaded ${catalogueData.length} books\n`);

    // Create backup
    const backupPath = this.cataloguePath.replace('.json', `.backup-${Date.now()}.json`);
    await fs.writeFile(backupPath, JSON.stringify(catalogueData, null, 2));
    console.log(`💾 Backup saved: ${backupPath}\n`);

    // Filter books that need PDFs
    const booksToProcess = catalogueData.filter(book =>
      !book.url || book.url.includes('X-Goog-Algorithm') || !book.firebase_path
    );

    console.log(`📊 Processing ${booksToProcess.length} books...`);
    console.log(`⏭️  Skipping ${catalogueData.length - booksToProcess.length} already uploaded\n`);

    // Process books in batches to avoid overwhelming the system
    const batchSize = 10;
    for (let i = 0; i < booksToProcess.length; i += batchSize) {
      const batch = booksToProcess.slice(i, Math.min(i + batchSize, booksToProcess.length));

      console.log(`\n${'='.repeat(60)}`);
      console.log(`BATCH ${Math.floor(i / batchSize) + 1}/${Math.ceil(booksToProcess.length / batchSize)}`);
      console.log('='.repeat(60));

      for (let j = 0; j < batch.length; j++) {
        await this.processBook(batch[j], i + j, booksToProcess.length);

        // Small delay between downloads to be respectful
        if (j < batch.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Save progress after each batch
      await fs.writeFile(this.cataloguePath, JSON.stringify(catalogueData, null, 2));
      console.log(`\n💾 Progress saved (${this.successCount} uploaded so far)`);

      // Longer delay between batches
      if (i + batchSize < booksToProcess.length) {
        console.log('⏸️  Pausing 3 seconds before next batch...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    // Final save
    await fs.writeFile(this.cataloguePath, JSON.stringify(catalogueData, null, 2));

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 UPLOAD SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Success: ${this.successCount} PDFs uploaded`);
    console.log(`❌ Failed:  ${this.failCount} PDFs`);
    console.log(`⏭️  Skipped: ${this.skippedCount} already uploaded`);
    console.log(`📝 Total:   ${catalogueData.length} books in catalogue`);
    console.log();

    if (this.successCount > 0) {
      console.log('🎉 Successfully uploaded PDFs to Firebase Storage!');
      console.log();
      console.log('Next steps:');
      console.log('1. Deploy updated catalogue: cd .. && npm run build && firebase deploy');
      console.log('2. Test library: https://nara-web-73384.web.app/library');
    }

    if (this.failCount > 0) {
      console.log('\n⚠️  Some PDFs failed to upload. Check the catalogue for upload_error field.');
    }

    return {
      success: this.successCount,
      failed: this.failCount,
      total: catalogueData.length
    };
  }
}

// Run if executed directly
if (require.main === module) {
  const uploader = new PDFUploader();
  uploader.uploadAll()
    .then(result => {
      console.log('\n✨ Upload process complete!');
      process.exit(result.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('\n❌ Fatal error:', error);
      process.exit(1);
    });
}

module.exports = PDFUploader;
