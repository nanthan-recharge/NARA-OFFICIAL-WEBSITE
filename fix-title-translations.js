/**
 * Fix missing title translations in Firestore
 * Run with: node fix-title-translations.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

// Firebase config (from your project)
const firebaseConfig = {
  apiKey: "AIzaSyBxvTQF9kAs6QwnvBpKj4jz0yPJYW8wLa4",
  authDomain: "nara-web-73384.firebaseapp.com",
  projectId: "nara-web-73384",
  storageBucket: "nara-web-73384.firebasestorage.app",
  messagingSenderId: "1055429621714",
  appId: "1:1055429621714:web:06b59c4ed5f7d5f50ef4dd",
  measurementId: "G-1XQWLPQTRW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixTitleTranslations() {
  try {
    console.log('🔍 Finding research papers with missing title translations...\n');
    
    const snapshot = await getDocs(collection(db, 'researchContent'));
    let fixedCount = 0;
    
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const docId = docSnap.id;
      
      // Check if title translations are missing or blank
      const titleSiMissing = !data.title?.si || data.title.si.trim() === '';
      const titleTaMissing = !data.title?.ta || data.title.ta.trim() === '';
      
      if (titleSiMissing || titleTaMissing) {
        console.log(`📝 Fixing document: ${docId}`);
        console.log(`   English title: ${data.title?.en || 'N/A'}`);
        
        const updates = {
          'title.si': data.description?.si || data.title?.en || '',
          'title.ta': data.description?.ta || data.title?.en || ''
        };
        
        await updateDoc(doc(db, 'researchContent', docId), updates);
        
        console.log(`   ✅ Updated Sinhala: ${updates['title.si']}`);
        console.log(`   ✅ Updated Tamil: ${updates['title.ta']}\n`);
        
        fixedCount++;
      }
    }
    
    if (fixedCount === 0) {
      console.log('✅ All papers already have title translations!');
    } else {
      console.log(`\n🎉 Fixed ${fixedCount} paper(s)!`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixTitleTranslations();
