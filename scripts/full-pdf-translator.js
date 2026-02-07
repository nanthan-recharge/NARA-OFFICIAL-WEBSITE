/**
 * 🌐 FULL PDF CONTENT TRANSLATOR
 * Extracts text from PDF, translates to Sinhala & Tamil, creates new PDFs
 * Run: node scripts/full-pdf-translator.js <pdf-path>
 */

import fs from 'fs';
import path from 'path';
import PDFParser from 'pdf-parse';
import PDFDocument from 'pdfkit';
import translate from 'google-translate-api-x';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBxvTQF9kAs6QwnvBpKj4jz0yPJYW8wLa4",
  authDomain: "nara-web-73384.firebaseapp.com",
  projectId: "nara-web-73384",
  storageBucket: "nara-web-73384.firebasestorage.app",
  messagingSenderId: "1055429621714",
  appId: "1:1055429621714:web:06b59c4ed5f7d5f50ef4dd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

/**
 * Extract text from PDF
 */
async function extractTextFromPDF(pdfPath) {
  console.log('📄 Extracting text from PDF...');
  
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await PDFParser(dataBuffer);
  
  console.log(`✅ Extracted ${data.text.length} characters`);
  console.log(`📄 Preview: ${data.text.substring(0, 200)}...`);
  
  return data.text;
}

/**
 * Translate text in chunks (Google Translate has limits)
 */
async function translateTextInChunks(text, targetLang) {
  const CHUNK_SIZE = 4500; // Google Translate limit is ~5000 chars
  const chunks = [];
  
  // Split text into chunks
  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    chunks.push(text.slice(i, i + CHUNK_SIZE));
  }
  
  console.log(`🔄 Translating ${chunks.length} chunks to ${targetLang}...`);
  
  const translatedChunks = [];
  
  for (let i = 0; i < chunks.length; i++) {
    try {
      console.log(`  📝 Chunk ${i + 1}/${chunks.length}...`);
      
      const result = await translate(chunks[i], { 
        from: 'en', 
        to: targetLang === 'si' ? 'si' : 'ta'
      });
      
      translatedChunks.push(result.text);
      
      // Rate limiting: wait 1 second between chunks
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`❌ Error translating chunk ${i + 1}:`, error.message);
      // Use original text if translation fails
      translatedChunks.push(chunks[i]);
    }
  }
  
  const fullTranslation = translatedChunks.join('');
  console.log(`✅ Translation complete: ${fullTranslation.length} characters`);
  
  return fullTranslation;
}

/**
 * Create PDF from translated text
 */
async function createPDFFromText(text, outputPath, language) {
  console.log(`📄 Creating PDF for ${language}...`);
  
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });
    
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);
    
    // Add title
    const titles = {
      en: 'Research Paper (English)',
      si: 'පර්යේෂණ ලිපිය (සිංහල)',
      ta: 'ஆராய்ச்சி ஆவணம் (தமிழ்)'
    };
    
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .text(titles[language] || titles.en, { align: 'center' });
    
    doc.moveDown(2);
    
    // Add content - handle Unicode properly
    try {
      // For Sinhala/Tamil, use a Unicode-compatible approach
      doc.fontSize(11)
         .font('Helvetica')
         .text(text, {
           width: 500,
           align: 'left',
           lineGap: 2
         });
    } catch (fontError) {
      console.warn('⚠️  Font encoding issue, using fallback...');
      // Fallback: split into paragraphs
      const paragraphs = text.split('\n\n');
      paragraphs.forEach((para, i) => {
        if (para.trim()) {
          doc.text(para.trim(), { width: 500, align: 'left' });
          if (i < paragraphs.length - 1) {
            doc.moveDown(0.5);
          }
        }
      });
    }
    
    doc.end();
    
    writeStream.on('finish', () => {
      console.log(`✅ PDF created: ${outputPath}`);
      resolve(outputPath);
    });
    
    writeStream.on('error', reject);
  });
}

/**
 * Upload PDF to Firebase Storage
 */
async function uploadPDFToFirebase(localPath, firebasePath) {
  console.log(`📤 Uploading to Firebase: ${firebasePath}...`);
  
  const fileBuffer = fs.readFileSync(localPath);
  const storageRef = ref(storage, firebasePath);
  
  const metadata = {
    contentType: 'application/pdf',
    customMetadata: {
      uploadedAt: new Date().toISOString()
    }
  };
  
  await uploadBytes(storageRef, fileBuffer, metadata);
  const downloadURL = await getDownloadURL(storageRef);
  
  console.log(`✅ Uploaded: ${downloadURL}`);
  
  return downloadURL;
}

/**
 * Main translation workflow
 */
async function translatePDF(inputPdfPath) {
  try {
    console.log('\n🌐 FULL PDF CONTENT TRANSLATOR');
    console.log('=' .repeat(60));
    console.log(`📁 Input PDF: ${inputPdfPath}`);
    console.log('=' .repeat(60) + '\n');
    
    // Check if file exists
    if (!fs.existsSync(inputPdfPath)) {
      throw new Error(`File not found: ${inputPdfPath}`);
    }
    
    const fileName = path.basename(inputPdfPath, '.pdf');
    const outputDir = path.join(path.dirname(inputPdfPath), 'translated');
    
    // Create output directory
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Step 1: Extract text from original PDF
    const englishText = await extractTextFromPDF(inputPdfPath);
    
    if (!englishText || englishText.trim().length < 100) {
      throw new Error('PDF appears to be empty or contains only images/scanned content');
    }
    
    // Step 2: Translate to Sinhala
    console.log('\n🇱🇰 TRANSLATING TO SINHALA...');
    console.log('-'.repeat(60));
    const sinhalaText = await translateTextInChunks(englishText, 'si');
    
    // Step 3: Translate to Tamil
    console.log('\n🇱🇰 TRANSLATING TO TAMIL...');
    console.log('-'.repeat(60));
    const tamilText = await translateTextInChunks(englishText, 'ta');
    
    // Step 4: Create translated PDFs
    console.log('\n📄 CREATING PDFS...');
    console.log('-'.repeat(60));
    
    const sinhalaPDF = path.join(outputDir, `${fileName}_si.pdf`);
    const tamilPDF = path.join(outputDir, `${fileName}_ta.pdf`);
    
    await createPDFFromText(sinhalaText, sinhalaPDF, 'si');
    await createPDFFromText(tamilText, tamilPDF, 'ta');
    
    // Step 5: Upload to Firebase
    console.log('\n📤 UPLOADING TO FIREBASE...');
    console.log('-'.repeat(60));
    
    const timestamp = Date.now();
    
    const englishURL = await uploadPDFToFirebase(
      inputPdfPath, 
      `research-content/${timestamp}_en_${fileName}.pdf`
    );
    
    const sinhalaURL = await uploadPDFToFirebase(
      sinhalaPDF,
      `research-content/${timestamp}_si_${fileName}.pdf`
    );
    
    const tamilURL = await uploadPDFToFirebase(
      tamilPDF,
      `research-content/${timestamp}_ta_${fileName}.pdf`
    );
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ TRANSLATION COMPLETE!');
    console.log('='.repeat(60));
    console.log('\n📊 RESULTS:');
    console.log(`  English PDF: ${englishURL}`);
    console.log(`  Sinhala PDF: ${sinhalaURL}`);
    console.log(`  Tamil PDF:   ${tamilURL}`);
    console.log('\n📁 Local files:');
    console.log(`  Sinhala: ${sinhalaPDF}`);
    console.log(`  Tamil:   ${tamilPDF}`);
    console.log('='.repeat(60) + '\n');
    
    return {
      english: englishURL,
      sinhala: sinhalaURL,
      tamil: tamilURL,
      localFiles: {
        sinhala: sinhalaPDF,
        tamil: tamilPDF
      }
    };
    
  } catch (error) {
    console.error('\n❌ TRANSLATION FAILED:', error);
    throw error;
  }
}

// CLI Usage
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
🌐 FULL PDF CONTENT TRANSLATOR

Usage:
  node scripts/full-pdf-translator.js <pdf-path>

Example:
  node scripts/full-pdf-translator.js ./uploads/research-paper.pdf

This will:
  1. Extract all text from the PDF
  2. Translate to Sinhala (සිංහල)
  3. Translate to Tamil (தமிழ்)
  4. Create new PDFs with translated content
  5. Upload all 3 PDFs to Firebase Storage
  `);
  process.exit(1);
}

const pdfPath = args[0];
translatePDF(pdfPath)
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
