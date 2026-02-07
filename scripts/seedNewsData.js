/**
 * News Data Seeder
 * Seeds the Firestore 'news' collection with NARA articles.
 *
 * Supports two data sources:
 *   --latest   Use src/data/naraNewsLatest.json  (22 articles, default)
 *   --legacy   Use src/data/naraNewsDatabase.json (18 articles with si/ta)
 *
 * Options:
 *   --clear    Delete ALL existing docs in 'news' collection before seeding
 *
 * Run:  node scripts/seedNewsData.js --clear
 */

import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp,
} from 'firebase/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* ── CLI flags ── */
const args = process.argv.slice(2);
const CLEAR = args.includes('--clear');
const USE_LEGACY = args.includes('--legacy');

/* ── Firebase config (same as src/firebase.js) ── */
const firebaseConfig = {
  apiKey: "AIzaSyAm7WGzLY7qM1i3pLgLhkceS1LTplYh6Lo",
  authDomain: "nara-web-73384.firebaseapp.com",
  projectId: "nara-web-73384",
  storageBucket: "nara-web-73384.firebasestorage.app",
  messagingSenderId: "455192505259",
  appId: "1:455192505259:web:760c764d5e7d7da3b140ee",
  measurementId: "G-8MLEKN8HP2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ── Category mapping: latest scrape categories → news system ── */
const CATEGORY_MAP_LATEST = {
  'Research & Collaboration': 'research',
  'International Collaboration': 'research',
  'Education & Outreach': 'events',
  'Partnership & Development': 'research',
  'Workshop & Training': 'events',
  'Technology Partnership': 'research',
  'Environmental Management': 'general',
  'Awareness & Conservation': 'general',
  'Community Development': 'general',
  'Capacity Building': 'events',
  'Digital Innovation': 'research',
  'Event': 'events',
  'Equipment Donation': 'announcements',
  'Education Partnership': 'events',
  'Livelihood Development': 'general',
  'International Project': 'announcements',
  'Industry Meeting': 'press',
  'Anniversary': 'achievements',
  'Partnership': 'research',
  'Industry Development': 'press',
  'Official Visit': 'announcements',
  'Planning': 'announcements',
};

/* ── Category mapping: legacy naraNewsDatabase categories → news system ── */
const CATEGORY_MAP_LEGACY = {
  'Education & Outreach': 'events',
  'Research & Development': 'research',
  'Policy & Management': 'announcements',
  'Technology & Innovation': 'research',
  'Environmental Initiatives': 'research',
  'Conservation & Awareness': 'general',
  'Community Development': 'general',
  'Capacity Building': 'events',
  'International Cooperation': 'announcements',
  'Cultural Events': 'events',
  'Industry Support': 'press',
  'Institutional Milestones': 'achievements',
  'Conservation Partnerships': 'research',
};

/* ── Permanent Unsplash image URLs (ocean/marine themed) ── */
const UNSPLASH_IMAGES = [
  'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1534766555764-ce878a4e947d?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1468413253725-0d5181091126?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1498623116890-37e912163d5d?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1484291150605-0860ed671c39?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1513553404607-988bf2703777?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1497290756760-23ac55edf36f?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=1200&h=800&fit=crop',
];

/* ── Parse flexible date strings to YYYY-MM-DD ── */
function parseDate(dateStr) {
  if (!dateStr || dateStr === 'Not specified') {
    return '2025-06-01'; // default for unspecified dates
  }

  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

  // "2025" alone
  if (/^\d{4}$/.test(dateStr.trim())) return `${dateStr.trim()}-06-01`;

  // "April 2025" or "End of August 2025"
  const monthYear = dateStr.match(/(?:of\s+)?(\w+)\s+(\d{4})/);
  if (monthYear) {
    const months = {
      january: '01', february: '02', march: '03', april: '04',
      may: '05', june: '06', july: '07', august: '08',
      september: '09', october: '10', november: '11', december: '12',
    };
    const m = months[monthYear[1].toLowerCase()];
    if (m) return `${monthYear[2]}-${m}-15`;
  }

  // "August 4-6, 2025" or "March 14, 2025" or "17-21 February 2025"
  const fullDate1 = dateStr.match(/(\w+)\s+(\d{1,2})(?:-\d{1,2})?,?\s+(\d{4})/);
  if (fullDate1) {
    const months = {
      january: '01', february: '02', march: '03', april: '04',
      may: '05', june: '06', july: '07', august: '08',
      september: '09', october: '10', november: '11', december: '12',
    };
    const m = months[fullDate1[1].toLowerCase()];
    if (m) return `${fullDate1[3]}-${m}-${fullDate1[2].padStart(2, '0')}`;
  }

  // "17-21 February 2025"
  const fullDate2 = dateStr.match(/(\d{1,2})(?:-\d{1,2})?\s+(\w+)\s+(\d{4})/);
  if (fullDate2) {
    const months = {
      january: '01', february: '02', march: '03', april: '04',
      may: '05', june: '06', july: '07', august: '08',
      september: '09', october: '10', november: '11', december: '12',
    };
    const m = months[fullDate2[2].toLowerCase()];
    if (m) return `${fullDate2[3]}-${m}-${fullDate2[1].padStart(2, '0')}`;
  }

  // "9th July 2025" or "26th July 2025"  or "21st August to 21st September 2025"
  const ordinal = dateStr.match(/(\d{1,2})(?:st|nd|rd|th)\s+(\w+)(?:\s+to\s+\d{1,2}(?:st|nd|rd|th)\s+\w+)?\s+(\d{4})/);
  if (ordinal) {
    const months = {
      january: '01', february: '02', march: '03', april: '04',
      may: '05', june: '06', july: '07', august: '08',
      september: '09', october: '10', november: '11', december: '12',
    };
    const m = months[ordinal[2].toLowerCase()];
    if (m) return `${ordinal[3]}-${m}-${ordinal[1].padStart(2, '0')}`;
  }

  // "January 20, 2025"
  const usFormat = dateStr.match(/(\w+)\s+(\d{1,2}),?\s+(\d{4})/);
  if (usFormat) {
    const months = {
      january: '01', february: '02', march: '03', april: '04',
      may: '05', june: '06', july: '07', august: '08',
      september: '09', october: '10', november: '11', december: '12',
    };
    const m = months[usFormat[1].toLowerCase()];
    if (m) return `${usFormat[3]}-${m}-${usFormat[2].padStart(2, '0')}`;
  }

  // Fallback
  return '2025-06-01';
}

/* ── Generate tags from title and content ── */
function generateTags(article) {
  const keywords = [
    'nara', 'fisheries', 'marine', 'research', 'aquaculture', 'conservation',
    'mangrove', 'workshop', 'partnership', 'technology', 'sustainable',
    'ocean', 'fishing', 'biodiversity', 'coral', 'lagoon', 'shrimp',
    'tuna', 'environmental', 'education', 'livelihood', 'ornamental',
  ];
  const text = `${article.title} ${article.content}`.toLowerCase();
  return keywords.filter(k => text.includes(k));
}

/* ── Build Firestore doc from LATEST format article ── */
function buildLatestDocument(article, index) {
  const categoryMap = CATEGORY_MAP_LATEST;
  const category = categoryMap[article.category] || 'general';
  const publishDate = parseDate(article.date);
  const year = parseInt(publishDate.substring(0, 4), 10) || 2025;
  const excerpt = article.content.substring(0, 200) + (article.content.length > 200 ? '...' : '');
  const tags = generateTags(article);

  return {
    title: {
      en: article.title,
      si: article.title,
      ta: article.title,
    },
    excerpt: {
      en: excerpt,
      si: excerpt,
      ta: excerpt,
    },
    content: {
      en: article.content,
      si: article.content,
      ta: article.content,
    },
    category,
    status: 'published',
    featuredImage: UNSPLASH_IMAGES[index % UNSPLASH_IMAGES.length],
    images: [],
    tags,
    publishDate,
    year,
    views: Math.floor(Math.random() * 300) + 20,
    isFeatured: index < 3,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

/* ── Build Firestore doc from LEGACY format article ── */
function buildLegacyDocument(article, index) {
  const categoryMap = CATEGORY_MAP_LEGACY;
  const category = categoryMap[article.category] || 'general';
  const year = parseInt(article.date.substring(0, 4), 10);
  const si = article.translations?.si || {};
  const ta = article.translations?.ta || {};

  return {
    title: {
      en: article.title,
      si: si.title || article.title,
      ta: ta.title || article.title,
    },
    excerpt: {
      en: article.summary,
      si: si.summary || article.summary,
      ta: ta.summary || article.summary,
    },
    content: {
      en: article.content,
      si: si.content || article.content,
      ta: ta.content || article.content,
    },
    category,
    status: 'published',
    featuredImage: UNSPLASH_IMAGES[index % UNSPLASH_IMAGES.length],
    images: [],
    tags: (article.tags || []).map(t => t.toLowerCase()),
    publishDate: article.date,
    year,
    views: Math.floor(Math.random() * 300) + 20,
    isFeatured: index < 3,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

/* ── Delete all docs in a collection ── */
async function clearCollection(collectionName) {
  console.log(`🗑️  Clearing '${collectionName}' collection...`);
  const snap = await getDocs(collection(db, collectionName));
  let count = 0;
  for (const d of snap.docs) {
    await deleteDoc(doc(db, collectionName, d.id));
    count++;
  }
  console.log(`  Deleted ${count} documents\n`);
  return count;
}

/* ── Main ── */
async function main() {
  console.log('📰 NARA News Data Seeder');
  console.log('========================');
  if (CLEAR) console.log('🗑️  --clear flag: will delete existing news docs first');
  console.log(`📄 Source: ${USE_LEGACY ? 'naraNewsDatabase.json (legacy)' : 'naraNewsLatest.json (22 articles)'}\n`);

  // Clear existing if requested
  if (CLEAR) {
    await clearCollection('news');
  }

  // Read the JSON data file
  const jsonFile = USE_LEGACY ? 'naraNewsDatabase.json' : 'naraNewsLatest.json';
  const jsonPath = join(__dirname, '..', 'src', 'data', jsonFile);
  const raw = readFileSync(jsonPath, 'utf-8');
  const database = JSON.parse(raw);

  const articles = database.articles;
  console.log(`Found ${articles.length} articles in ${jsonFile}`);
  if (database.metadata?.scraped_date) {
    console.log(`Scraped: ${database.metadata.scraped_date}`);
  }
  if (database.metadata?.date_range) {
    console.log(`Date range: ${database.metadata.date_range.from} to ${database.metadata.date_range.to}`);
  }
  console.log('');

  const newsRef = collection(db, 'news');
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    const docData = USE_LEGACY
      ? buildLegacyDocument(article, i)
      : buildLatestDocument(article, i);

    try {
      const docRef = await addDoc(newsRef, docData);
      const featured = docData.isFeatured ? ' ⭐ FEATURED' : '';
      console.log(`  ✅ [${i + 1}/${articles.length}] "${article.title.substring(0, 60)}..." → ${docData.category}${featured}`);
      console.log(`     ID: ${docRef.id} | Date: ${docData.publishDate} | Year: ${docData.year}`);
      successCount++;
    } catch (err) {
      console.error(`  ❌ [${i + 1}/${articles.length}] "${article.title}" — ${err.message}`);
      errorCount++;
    }
  }

  console.log('\n========================');
  console.log(`✅ Seeded: ${successCount} articles`);
  if (errorCount > 0) console.log(`❌ Failed: ${errorCount} articles`);
  console.log('\nDone! Articles are now in the Firestore "news" collection.');
  console.log('They should appear on:');
  console.log('  • Home page carousel (http://localhost:4028)');
  console.log('  • News page (http://localhost:4028/news) — under 2025 tab');
  console.log('  • Admin panel (http://localhost:4028/admin/news)');
  console.log('\n📷 To add images: go to /admin/news, click each article, and upload images.');

  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
