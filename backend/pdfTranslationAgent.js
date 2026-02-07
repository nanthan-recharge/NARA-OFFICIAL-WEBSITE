/**
 * PDF Translation Agent for NARA Library
 * Translates English PDFs to Tamil and Sinhala using Google Gemini AI
 * Automated background agent - COMPLETELY FREE!
 */

const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs').promises;
const path = require('path');
const pdfParse = require('pdf-parse');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

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
    console.error('❌ Firebase initialization failed:', error.message);
    process.exit(1);
  }
}

const bucket = admin.storage().bucket();

class PDFTranslationAgent {
  constructor() {
    this.cataloguePath = path.join(__dirname, '../public/library_catalogue.json');
    this.tempDir = path.join(__dirname, 'temp/translations');
    this.successCount = 0;
    this.failCount = 0;

    // Google Gemini API - FREE!
    // Your API key (already configured)
    this.geminiAPIKey = 'AIzaSyD1fb8vPW6MkEtAt_tK2OGKLqPZu-z6FAE';

    // Initialize Gemini
    this.genAI = new GoogleGenerativeAI(this.geminiAPIKey);
    this.model = this.genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });

    // Supported languages
    this.languages = {
      tamil: { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', folder: 'pdfs_tamil' },
      sinhala: { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', folder: 'pdfs_sinhala' }
    };
  }

  async init() {
    await fs.mkdir(this.tempDir, { recursive: true });
    console.log(`📁 Temp directory: ${this.tempDir}\n`);
    console.log('🤖 Using Google Gemini AI for translation (FREE & High Quality!)');
    console.log(`✅ Gemini API initialized\n`);
  }

  /**
   * Extract text from PDF
   */
  async extractTextFromPDF(pdfPath) {
    try {
      const dataBuffer = await fs.readFile(pdfPath);
      const data = await pdfParse(dataBuffer);

      return {
        text: data.text,
        pages: data.numpages,
        info: data.info
      };
    } catch (error) {
      throw new Error(`PDF extraction failed: ${error.message}`);
    }
  }

  /**
   * Translate text using Google Gemini AI (FREE & High Quality!)
   */
  async translateText(text, targetLanguage, languageName) {
    try {
      // Split text into chunks (Gemini can handle larger chunks, but we'll be safe)
      const chunks = this.splitTextIntoChunks(text, 8000);
      const translatedChunks = [];

      for (let i = 0; i < chunks.length; i++) {
        console.log(`      Translating chunk ${i + 1}/${chunks.length} with Gemini AI...`);

        // Create a detailed prompt for Gemini
        const prompt = `You are a professional translator specializing in academic and scientific texts.

Task: Translate the following English text to ${languageName} (${targetLanguage}).

Important instructions:
1. Maintain the academic and formal tone
2. Preserve technical terms accuracy
3. Keep paragraph structure
4. Translate naturally, not word-for-word
5. Do not add any explanations or notes
6. Only output the translated text

English text to translate:
${chunks[i]}

${languageName} translation:`;

        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const translatedText = response.text();

        translatedChunks.push(translatedText.trim());

        // Small delay to respect API rate limits (15 requests/min = 4 seconds between)
        if (i < chunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 4000));
        }
      }

      return translatedChunks.join('\n\n');
    } catch (error) {
      throw new Error(`Gemini translation failed: ${error.message}`);
    }
  }

  /**
   * Split text into chunks for Gemini AI (larger chunks supported)
   */
  splitTextIntoChunks(text, maxChunkSize = 8000) {
    const chunks = [];
    const paragraphs = text.split('\n\n');
    let currentChunk = '';

    for (const paragraph of paragraphs) {
      if (currentChunk.length + paragraph.length < maxChunkSize) {
        currentChunk += paragraph + '\n\n';
      } else {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = paragraph + '\n\n';
      }
    }

    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks;
  }

  /**
   * Create text file from translated text (simpler than PDF for Unicode)
   */
  async createTranslatedPDF(translatedText, originalInfo, language) {
    try {
      // For now, save as plain text file since pdf-lib doesn't support Tamil/Sinhala easily
      // We'll create a simple text file with proper formatting
      let content = '';

      // Add header
      content += '='.repeat(80) + '\n';
      content += `Translated to ${language} by NARA Digital Library\n`;
      content += 'AI Translation using Google Gemini\n';
      content += '='.repeat(80) + '\n\n';

      // Add original title if available
      if (originalInfo && originalInfo.Title) {
        content += `Original Title: ${originalInfo.Title}\n`;
        content += `Translated: ${new Date().toLocaleDateString()}\n`;
        content += '\n' + '-'.repeat(80) + '\n\n';
      }

      // Add translated content
      content += translatedText;

      content += '\n\n' + '='.repeat(80) + '\n';
      content += 'End of Translation\n';
      content += '='.repeat(80) + '\n';

      // Return as Buffer (will be saved as .txt instead of .pdf)
      return Buffer.from(content, 'utf-8');
    } catch (error) {
      throw new Error(`Text file creation failed: ${error.message}`);
    }
  }

  /**
   * Wrap text to fit page width
   */
  wrapText(text, font, fontSize, maxWidth) {
    const lines = [];
    const paragraphs = text.split('\n');

    for (const paragraph of paragraphs) {
      if (!paragraph.trim()) {
        lines.push('');
        continue;
      }

      const words = paragraph.split(' ');
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const width = font.widthOfTextAtSize(testLine, fontSize);

        if (width <= maxWidth) {
          currentLine = testLine;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      }

      if (currentLine) lines.push(currentLine);
    }

    return lines;
  }

  /**
   * Download PDF from Firebase Storage
   */
  async downloadPDF(firebasePath, localPath) {
    try {
      const file = bucket.file(firebasePath);
      await file.download({ destination: localPath });
      return true;
    } catch (error) {
      throw new Error(`Download failed: ${error.message}`);
    }
  }

  /**
   * Upload translated file to Firebase Storage
   */
  async uploadTranslatedPDF(localPath, firebasePath) {
    try {
      // Determine content type based on file extension
      const contentType = firebasePath.endsWith('.txt') ? 'text/plain; charset=utf-8' : 'application/pdf';

      await bucket.upload(localPath, {
        destination: firebasePath,
        metadata: {
          contentType: contentType,
          cacheControl: 'public, max-age=31536000',
        }
      });

      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(firebasePath)}?alt=media`;
      return publicUrl;
    } catch (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  /**
   * Process a single book translation
   */
  async translateBook(book, index, total) {
    console.log(`\n[${index + 1}/${total}] ${book.title.substring(0, 60)}...`);

    if (!book.firebase_path) {
      console.log('   ⏭️  Skipped: No PDF uploaded yet');
      return false;
    }

    try {
      // Step 1: Download original PDF
      console.log('   📥 Downloading original PDF...');
      const originalPath = path.join(this.tempDir, `original_${book.id}.pdf`);
      await this.downloadPDF(book.firebase_path, originalPath);
      console.log('   ✅ Downloaded');

      // Step 2: Extract text
      console.log('   📄 Extracting text...');
      const extracted = await this.extractTextFromPDF(originalPath);
      console.log(`   ✅ Extracted ${extracted.pages} pages, ${extracted.text.length} characters`);

      // Limit text for testing/cost (remove this limit in production)
      const textToTranslate = extracted.text.substring(0, 10000); // First 10,000 chars for testing
      if (extracted.text.length > 10000) {
        console.log(`   ⚠️  Limited to first 10,000 characters for testing`);
      }

      const results = {};

      // Step 3: Translate to each language
      for (const [langKey, langConfig] of Object.entries(this.languages)) {
        console.log(`   🌐 Translating to ${langConfig.name} (${langConfig.nativeName})...`);

        try {
          const translatedText = await this.translateText(textToTranslate, langConfig.code, langConfig.name);
          console.log(`   ✅ Translated to ${langConfig.name} (${langConfig.nativeName})`);

          // Step 4: Create translated text file
          console.log(`   📝 Creating ${langConfig.name} text file...`);
          const textBytes = await this.createTranslatedPDF(translatedText, extracted.info, langConfig.name);

          const translatedPath = path.join(this.tempDir, `${book.id}_${langKey}.txt`);
          await fs.writeFile(translatedPath, textBytes);
          console.log(`   ✅ Created text file`);

          // Step 5: Upload to Firebase
          console.log(`   ☁️  Uploading ${langConfig.name} translation...`);
          const originalBasename = path.basename(book.firebase_path, '.pdf');
          const firebasePath = `${langConfig.folder}/${book.material_type_name}/${originalBasename}.txt`;
          const publicUrl = await this.uploadTranslatedPDF(translatedPath, firebasePath);
          console.log(`   ✅ Uploaded`);

          results[langKey] = {
            url: publicUrl,
            firebase_path: firebasePath,
            translated_at: new Date().toISOString()
          };

          // Clean up
          await fs.unlink(translatedPath);
        } catch (error) {
          console.log(`   ❌ ${langConfig.name} failed: ${error.message}`);
          results[langKey] = { error: error.message };
        }
      }

      // Clean up original
      await fs.unlink(originalPath);

      // Step 6: Update book record
      book.translations = results;
      book.translations_available = Object.keys(results).filter(k => !results[k].error);

      if (book.translations_available.length > 0) {
        this.successCount++;
        console.log(`   🎉 SUCCESS! Translated to ${book.translations_available.length} language(s)`);
        return true;
      } else {
        this.failCount++;
        return false;
      }

    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
      this.failCount++;
      book.translation_error = error.message;
      return false;
    }
  }

  /**
   * Main process - translate all books
   */
  async translateAll(options = {}) {
    console.log('🌐 NARA Library - PDF Translation Agent');
    console.log('='.repeat(60));
    console.log();

    await this.init();

    // Load catalogue
    console.log('📖 Loading catalogue...');
    const catalogueData = JSON.parse(await fs.readFile(this.cataloguePath, 'utf8'));
    console.log(`✅ Loaded ${catalogueData.length} books\n`);

    // Create backup
    const backupPath = this.cataloguePath.replace('.json', `.backup-translation-${Date.now()}.json`);
    await fs.writeFile(backupPath, JSON.stringify(catalogueData, null, 2));
    console.log(`💾 Backup saved: ${path.basename(backupPath)}\n`);

    // Filter books that need translation
    const booksToTranslate = catalogueData.filter(book =>
      book.firebase_path && !book.translations
    );

    // Limit for testing
    const limit = options.limit || 5;
    const limitedBooks = booksToTranslate.slice(0, limit);

    console.log(`📊 Found ${booksToTranslate.length} books with PDFs`);
    console.log(`🧪 Processing ${limitedBooks.length} books for testing\n`);

    if (limitedBooks.length === 0) {
      console.log('✅ No books to translate!');
      return { success: 0, failed: 0, total: 0 };
    }

    // Process books
    for (let i = 0; i < limitedBooks.length; i++) {
      await this.translateBook(limitedBooks[i], i, limitedBooks.length);

      // Save progress after each book
      await fs.writeFile(this.cataloguePath, JSON.stringify(catalogueData, null, 2));

      // Delay between books
      if (i < limitedBooks.length - 1) {
        console.log('\n⏸️  Pausing 3 seconds...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    // Final save
    await fs.writeFile(this.cataloguePath, JSON.stringify(catalogueData, null, 2));

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TRANSLATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Success: ${this.successCount} books translated`);
    console.log(`❌ Failed:  ${this.failCount} books`);
    console.log(`📝 Total:   ${limitedBooks.length} books processed`);
    console.log();

    if (this.successCount > 0) {
      console.log('🎉 Translations uploaded to Firebase Storage!');
      console.log();
      console.log('Next steps:');
      console.log('1. Test translated PDFs in Firebase Console');
      console.log('2. Update UI with language selector');
      console.log('3. Deploy: cd .. && npm run build && firebase deploy');
    }

    return {
      success: this.successCount,
      failed: this.failCount,
      total: limitedBooks.length
    };
  }
}

// Run if executed directly
if (require.main === module) {
  const agent = new PDFTranslationAgent();

  // Get limit from command line args
  const limit = process.argv[2] ? parseInt(process.argv[2]) : 5;

  agent.translateAll({ limit })
    .then(result => {
      console.log('\n✨ Translation process complete!');
      process.exit(result.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('\n❌ Fatal error:', error);
      process.exit(1);
    });
}

module.exports = PDFTranslationAgent;
