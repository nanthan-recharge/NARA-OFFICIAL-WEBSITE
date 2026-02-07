/**
 * 🤖 AUTO-TRANSLATE RESEARCH PAPERS
 * Automatically translates 5 papers per day that don't have translations
 * Run with: node scripts/auto-translate-daily.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, query, where, limit } from 'firebase/firestore';
import fetch from 'node-fetch';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBxvTQF9kAs6QwnvBpKj4jz0yPJYW8wLa4",
  authDomain: "nara-web-73384.firebaseapp.com",
  projectId: "nara-web-73384",
  storageBucket: "nara-web-73384.firebasestorage.app",
  messagingSenderId: "1055429621714",
  appId: "1:1055429621714:web:06b59c4ed5f7d5f50ef4dd",
  measurementId: "G-1XQWLPQTRW"
};

// Your Gemini API Key
const GEMINI_API_KEY = 'AIzaSyD1fb8vPW6MkEtAt_tK2OGKLqPZu-z6FAE';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Translate text using Google Translate API (free, no key needed)
 */
async function translateText(text, targetLang) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();
    
    // Extract translated text
    let translated = '';
    if (data && data[0]) {
      data[0].forEach(item => {
        if (item[0]) translated += item[0];
      });
    }
    
    return translated || text;
  } catch (error) {
    console.error(`Translation error for ${targetLang}:`, error);
    return text; // Return original if translation fails
  }
}

/**
 * Check if paper needs translation
 */
function needsTranslation(paper) {
  // Check if title, description, or abstract is missing in Sinhala or Tamil
  const titleSiMissing = !paper.title?.si || paper.title.si.trim() === '' || paper.title.si === ' ';
  const titleTaMissing = !paper.title?.ta || paper.title.ta.trim() === '' || paper.title.ta === ' ';
  const descSiMissing = !paper.description?.si || paper.description.si.trim() === '';
  const descTaMissing = !paper.description?.ta || paper.description.ta.trim() === '';
  const absSiMissing = !paper.abstract?.si || paper.abstract.si.trim() === '';
  const absTaMissing = !paper.abstract?.ta || paper.abstract.ta.trim() === '';
  
  return titleSiMissing || titleTaMissing || descSiMissing || descTaMissing || absSiMissing || absTaMissing;
}

/**
 * Translate a single paper
 */
async function translatePaper(paper, docId) {
  console.log(`\n📄 Translating: ${paper.title?.en || 'Untitled'}`);
  
  const updates = {};
  
  // Translate title
  if (!paper.title?.si || paper.title.si.trim() === '' || paper.title.si === ' ') {
    console.log('  🇱🇰 Translating title to Sinhala...');
    const titleSi = await translateText(paper.title?.en || '', 'si');
    updates['title.si'] = titleSi;
    await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit
  }
  
  if (!paper.title?.ta || paper.title.ta.trim() === '' || paper.title.ta === ' ') {
    console.log('  🇱🇰 Translating title to Tamil...');
    const titleTa = await translateText(paper.title?.en || '', 'ta');
    updates['title.ta'] = titleTa;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Translate description
  if (!paper.description?.si || paper.description.si.trim() === '') {
    console.log('  🇱🇰 Translating description to Sinhala...');
    const descSi = await translateText(paper.description?.en || '', 'si');
    updates['description.si'] = descSi;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  if (!paper.description?.ta || paper.description.ta.trim() === '') {
    console.log('  🇱🇰 Translating description to Tamil...');
    const descTa = await translateText(paper.description?.en || '', 'ta');
    updates['description.ta'] = descTa;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Translate abstract
  if (!paper.abstract?.si || paper.abstract.si.trim() === '') {
    console.log('  🇱🇰 Translating abstract to Sinhala...');
    const absSi = await translateText(paper.abstract?.en || '', 'si');
    updates['abstract.si'] = absSi;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  if (!paper.abstract?.ta || paper.abstract.ta.trim() === '') {
    console.log('  🇱🇰 Translating abstract to Tamil...');
    const absTa = await translateText(paper.abstract?.en || '', 'ta');
    updates['abstract.ta'] = absTa;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Update Firestore
  if (Object.keys(updates).length > 0) {
    await updateDoc(doc(db, 'researchContent', docId), updates);
    console.log(`  ✅ Updated ${Object.keys(updates).length} fields`);
    return true;
  } else {
    console.log('  ⏭️  Already translated, skipping');
    return false;
  }
}

/**
 * Main function - Translate 5 papers
 */
async function autoTranslateDaily() {
  try {
    console.log('🤖 AUTO-TRANSLATE RESEARCH PAPERS');
    console.log('=' .repeat(50));
    console.log('📅 Date:', new Date().toLocaleString());
    console.log('🎯 Target: Translate up to 5 papers');
    console.log('=' .repeat(50));
    
    // Get all papers
    const snapshot = await getDocs(collection(db, 'researchContent'));
    const papers = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      if (needsTranslation(data)) {
        papers.push({ id: doc.id, data });
      }
    });
    
    console.log(`\n📊 Found ${papers.length} papers needing translation`);
    
    if (papers.length === 0) {
      console.log('✅ All papers are already translated! 🎉');
      process.exit(0);
    }
    
    // Translate up to 5 papers
    const papersToTranslate = papers.slice(0, 5);
    console.log(`\n🔄 Translating ${papersToTranslate.length} papers...\n`);
    
    let translated = 0;
    
    for (const paper of papersToTranslate) {
      try {
        const success = await translatePaper(paper.data, paper.id);
        if (success) translated++;
      } catch (error) {
        console.error(`❌ Error translating paper ${paper.id}:`, error);
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`✅ Translation Complete!`);
    console.log(`📊 Papers translated: ${translated}/${papersToTranslate.length}`);
    console.log(`📊 Papers remaining: ${papers.length - translated}`);
    console.log('=' .repeat(50));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
autoTranslateDaily();
