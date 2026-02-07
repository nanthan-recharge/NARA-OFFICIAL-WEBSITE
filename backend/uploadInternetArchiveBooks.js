/**
 * Internet Archive PDF Uploader for NARA Library
 * Downloads PDFs from Internet Archive and uploads to Firebase Storage
 */

const admin = require('firebase-admin');
const axios = require('axios');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const { createWriteStream } = require('fs');

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
    console.error('❌ Firebase Admin initialization failed:', error.message);
    console.log('💡 Tip: Check serviceAccountKey.json exists');
    process.exit(1);
  }
}

const bucket = admin.storage().bucket();

class InternetArchiveUploader {
  constructor() {
    this.cataloguePath = path.join(__dirname, '../public/library_catalogue.json');
    this.tempDir = path.join(__dirname, 'temp/pdfs');
    this.successCount = 0;
    this.failCount = 0;
    this.uploadedBooks = [];
  }

  async init() {
    await fs.mkdir(this.tempDir, { recursive: true });
    console.log(`📁 Temp directory: ${this.tempDir}\n`);
  }

  /**
   * Get Internet Archive item identifier from URL
   */
  getArchiveIdentifier(url) {
    const match = url.match(/archive\.org\/details\/([^\/]+)/);
    return match ? match[1] : null;
  }

  /**
   * Fetch Internet Archive metadata to find PDF download URL
   */
  async getArchivePdfUrl(identifier) {
    try {
      const metadataUrl = `https://archive.org/metadata/${identifier}`;
      const response = await axios.get(metadataUrl);
      const files = response.data.files || [];

      // Find PDF file
      const pdfFile = files.find(f =>
        f.name && f.name.toLowerCase().endsWith('.pdf') &&
        f.format === 'Text PDF'
      );

      if (pdfFile) {
        return `https://archive.org/download/${identifier}/${pdfFile.name}`;
      }

      // If no PDF, try looking for any PDF file
      const anyPdf = files.find(f => f.name && f.name.toLowerCase().endsWith('.pdf'));
      if (anyPdf) {
        return `https://archive.org/download/${identifier}/${anyPdf.name}`;
      }

      throw new Error('No PDF file found in Internet Archive item');
    } catch (error) {
      throw new Error(`Failed to get Archive metadata: ${error.message}`);
    }
  }

  /**
   * Download PDF from URL
   */
  async downloadPDF(url, outputPath) {
    try {
      console.log(`      📥 Downloading from: ${url.substring(0, 80)}...`);

      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream',
        timeout: 120000, // 2 minutes timeout for large files
        maxRedirects: 5,
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

      // Files are publicly accessible via Firebase Storage Rules
      // No need to call makePublic() with uniform bucket-level access

      // Get public URL
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(firebasePath)}?alt=media`;

      return publicUrl;
    } catch (error) {
      throw new Error(`Firebase upload failed: ${error.message}`);
    }
  }

  /**
   * Generate safe filename
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
   * Get Firebase Storage path
   */
  getFirebasePath(book) {
    const category = book.material_type_name || 'General';
    const filename = this.generateFilename(book);
    return `pdfs/${category}/${filename}`;
  }

  /**
   * Process a single book
   */
  async processBook(book, index, total) {
    console.log(`\n[${index + 1}/${total}] ${book.title.substring(0, 60)}...`);
    console.log(`   Material: ${book.material_type_name}`);
    console.log(`   Archive URL: ${book.source_url}`);

    try {
      // Step 1: Get Archive identifier
      const identifier = this.getArchiveIdentifier(book.source_url);
      if (!identifier) {
        throw new Error('Could not extract Archive identifier from URL');
      }
      console.log(`   📖 Archive ID: ${identifier}`);

      // Step 2: Get PDF download URL from Archive metadata
      console.log('   🔍 Fetching Archive metadata...');
      const pdfUrl = await this.getArchivePdfUrl(identifier);
      console.log(`   ✅ Found PDF URL`);

      // Step 3: Download PDF
      const tempFile = path.join(this.tempDir, this.generateFilename(book));
      await this.downloadPDF(pdfUrl, tempFile);

      const stats = await fs.stat(tempFile);
      if (stats.size < 1000) {
        throw new Error('Downloaded file too small, likely not a valid PDF');
      }
      console.log(`   ✅ Downloaded: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

      // Step 4: Upload to Firebase
      console.log('   ☁️  Uploading to Firebase Storage...');
      const firebasePath = this.getFirebasePath(book);
      const publicUrl = await this.uploadToFirebase(tempFile, firebasePath);
      console.log(`   ✅ Uploaded to Firebase`);

      // Step 5: Clean up temp file
      await fs.unlink(tempFile);

      // Update book record
      book.url = publicUrl;
      book.firebase_path = firebasePath;
      book.uploaded_at = new Date().toISOString();
      book.pdf_size_mb = (stats.size / 1024 / 1024).toFixed(2);

      this.successCount++;
      this.uploadedBooks.push({
        id: book.id,
        title: book.title,
        url: publicUrl,
        size: stats.size
      });

      console.log(`   🎉 SUCCESS!`);
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
   * Main process - upload Internet Archive PDFs
   */
  async uploadAll() {
    console.log('📚 NARA Library - Internet Archive PDF Uploader');
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
    console.log(`💾 Backup saved: ${path.basename(backupPath)}\n`);

    // Filter books with Internet Archive source URLs
    const archiveBooks = catalogueData.filter(book =>
      book.source_url &&
      book.source_url.includes('archive.org') &&
      (!book.url || !book.firebase_path)
    );

    console.log(`📊 Found ${archiveBooks.length} Internet Archive books to process`);
    console.log(`⏭️  Skipping ${catalogueData.length - archiveBooks.length} books\n`);

    if (archiveBooks.length === 0) {
      console.log('✅ No books to process!');
      return { success: 0, failed: 0, total: catalogueData.length };
    }

    // Process books in batches
    const batchSize = 5; // Smaller batches for large files
    for (let i = 0; i < archiveBooks.length; i += batchSize) {
      const batch = archiveBooks.slice(i, Math.min(i + batchSize, archiveBooks.length));

      console.log(`\n${'='.repeat(60)}`);
      console.log(`BATCH ${Math.floor(i / batchSize) + 1}/${Math.ceil(archiveBooks.length / batchSize)}`);
      console.log('='.repeat(60));

      for (let j = 0; j < batch.length; j++) {
        await this.processBook(batch[j], i + j, archiveBooks.length);

        // Small delay between downloads
        if (j < batch.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // Save progress after each batch
      await fs.writeFile(this.cataloguePath, JSON.stringify(catalogueData, null, 2));
      console.log(`\n💾 Progress saved (${this.successCount} uploaded, ${this.failCount} failed so far)`);

      // Longer delay between batches
      if (i + batchSize < archiveBooks.length) {
        console.log('⏸️  Pausing 5 seconds before next batch...');
        await new Promise(resolve => setTimeout(resolve, 5000));
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
    console.log(`📝 Total:   ${archiveBooks.length} Internet Archive books`);
    console.log();

    if (this.successCount > 0) {
      console.log('🎉 Successfully uploaded PDFs to Firebase Storage!');
      console.log();
      console.log('Next steps:');
      console.log('1. Deploy updated catalogue: cd .. && npm run build && firebase deploy');
      console.log('2. Test library: https://nara-web-73384.web.app/library');
      console.log();
      console.log('Sample uploaded books:');
      this.uploadedBooks.slice(0, 3).forEach(book => {
        console.log(`  - ${book.title.substring(0, 60)}...`);
      });
    }

    if (this.failCount > 0) {
      console.log('\n⚠️  Some PDFs failed to upload. Check the catalogue for upload_error field.');
    }

    return {
      success: this.successCount,
      failed: this.failCount,
      total: archiveBooks.length
    };
  }
}

// Run if executed directly
if (require.main === module) {
  const uploader = new InternetArchiveUploader();
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

module.exports = InternetArchiveUploader;
