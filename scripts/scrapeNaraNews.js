/**
 * NARA Website News Scraper
 * Scrapes news articles from http://www.nara.ac.lk/?page_id=20299
 * Downloads images, converts to WebP, uploads to Firebase Storage,
 * and creates Firestore documents in the 'news' collection.
 *
 * Prerequisites:
 *   npm install axios cheerio sharp firebase-admin
 *
 * Run:
 *   node scripts/scrapeNaraNews.js
 *
 * Options:
 *   --dry-run     Preview what would be scraped without writing to Firestore
 *   --limit=N     Only scrape first N articles
 *   --skip-images Skip image download/upload (use placeholder)
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import sharp from 'sharp';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* ── Configuration ── */
const CONFIG = {
  baseUrl: 'http://www.nara.ac.lk',
  newsPageUrl: 'http://www.nara.ac.lk/?page_id=20299',
  storageBucket: 'nara-web-73384.firebasestorage.app',
  firestoreCollection: 'news',
  imageOutputDir: join(__dirname, '..', 'temp', 'scraped-images'),
  maxRetries: 3,
  retryDelay: 2000,     // ms
  requestTimeout: 15000, // ms
  imageMaxWidth: 1200,
  imageQuality: 80,      // WebP quality (0-100)
  userAgent: 'Mozilla/5.0 (compatible; NARA-Scraper/1.0)',
};

/* ── CLI flags ── */
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const SKIP_IMAGES = args.includes('--skip-images');
const LIMIT = (() => {
  const f = args.find(a => a.startsWith('--limit='));
  return f ? parseInt(f.split('=')[1], 10) : Infinity;
})();

/* ── Firebase Admin init ── */
let db, bucket;

function initFirebase() {
  // Try service account file first, then fall back to default credentials
  const serviceAccountPath = join(__dirname, '..', 'serviceAccountKey.json');

  let credential;
  if (existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));
    credential = cert(serviceAccount);
    console.log('  Using service account key file');
  } else {
    console.log('  Using default credentials (GOOGLE_APPLICATION_CREDENTIALS)');
    console.log('  If this fails, place serviceAccountKey.json in project root');
    console.log('  Download from: Firebase Console → Project Settings → Service Accounts');
  }

  const app = initializeApp({
    ...(credential ? { credential } : {}),
    storageBucket: CONFIG.storageBucket,
  });

  db = getFirestore(app);
  bucket = getStorage(app).bucket();
}

/* ── HTTP client with retry ── */
async function fetchWithRetry(url, options = {}, retries = CONFIG.maxRetries) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(url, {
        timeout: CONFIG.requestTimeout,
        headers: { 'User-Agent': CONFIG.userAgent },
        ...options,
      });
      return response;
    } catch (err) {
      const isRetryable = err.code === 'ECONNREFUSED' ||
                          err.code === 'ECONNRESET' ||
                          err.code === 'ETIMEDOUT' ||
                          (err.response && err.response.status >= 500);

      if (attempt === retries || !isRetryable) {
        throw err;
      }

      console.log(`    ⏳ Retry ${attempt}/${retries} for ${url} (${err.code || err.message})`);
      await sleep(CONFIG.retryDelay * attempt);
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ── Scrape the news listing page ── */
async function scrapeNewsListing() {
  console.log(`\n📡 Fetching news listing: ${CONFIG.newsPageUrl}`);

  const { data: html } = await fetchWithRetry(CONFIG.newsPageUrl);
  const $ = cheerio.load(html);

  const articles = [];

  // NARA website typically uses WordPress-style article listings
  // Try multiple selectors for compatibility
  const selectors = [
    'article',
    '.post',
    '.entry',
    '.news-item',
    '.blog-post',
    '.type-post',
    '.hentry',
    '.wp-block-post',
    'div[id^="post-"]',
  ];

  let $articles = $([]);

  for (const sel of selectors) {
    $articles = $(sel);
    if ($articles.length > 0) {
      console.log(`  Found ${$articles.length} articles using selector: "${sel}"`);
      break;
    }
  }

  // Fallback: scan for links that look like article URLs
  if ($articles.length === 0) {
    console.log('  No articles found via standard selectors, scanning links...');
    const linkArticles = new Map();

    $('a[href*="nara.ac.lk"]').each((_, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      if (href && text && text.length > 20 && !linkArticles.has(href)) {
        linkArticles.set(href, { url: href, title: text });
      }
    });

    linkArticles.forEach((art) => articles.push(art));
    console.log(`  Found ${articles.length} potential articles from links`);
    return articles.slice(0, LIMIT);
  }

  $articles.each((index, el) => {
    if (index >= LIMIT) return false;

    const $el = $(el);

    // Extract title
    const $titleLink = $el.find('h2 a, h3 a, .entry-title a, .post-title a').first();
    const title = $titleLink.text().trim() || $el.find('h2, h3, .entry-title').first().text().trim();

    // Extract URL
    const url = $titleLink.attr('href') || $el.find('a').first().attr('href') || '';

    // Extract date
    const dateText = $el.find('time, .entry-date, .post-date, .date, .published').first().text().trim()
      || $el.find('[datetime]').first().attr('datetime') || '';

    // Extract excerpt
    const excerpt = $el.find('.entry-summary, .excerpt, .post-excerpt, p').first().text().trim();

    // Extract featured image
    const imgSrc = $el.find('img').first().attr('src')
      || $el.find('img').first().attr('data-src')
      || '';

    if (title) {
      articles.push({
        title,
        url: url.startsWith('http') ? url : `${CONFIG.baseUrl}${url}`,
        date: parseDate(dateText),
        excerpt: excerpt.substring(0, 300),
        featuredImageUrl: imgSrc.startsWith('http') ? imgSrc : (imgSrc ? `${CONFIG.baseUrl}${imgSrc}` : ''),
      });
    }
  });

  console.log(`  Extracted ${articles.length} articles from listing`);

  // Check for pagination
  const nextPage = $('a.next, .nav-next a, .pagination a:contains("Next")').attr('href');
  if (nextPage && articles.length < LIMIT) {
    console.log(`  Found next page: ${nextPage}`);
    // Could recursively scrape more pages here
  }

  return articles;
}

/* ── Scrape individual article page ── */
async function scrapeArticleContent(articleUrl) {
  try {
    const { data: html } = await fetchWithRetry(articleUrl);
    const $ = cheerio.load(html);

    // Extract full content
    const contentSelectors = [
      '.entry-content',
      '.post-content',
      '.article-content',
      '.single-content',
      '#content .post',
      'article .content',
    ];

    let content = '';
    for (const sel of contentSelectors) {
      const $content = $(sel);
      if ($content.length > 0) {
        // Remove scripts, styles, nav elements
        $content.find('script, style, nav, .social-share, .comments, .related-posts').remove();
        content = $content.text().trim().replace(/\s+/g, ' ');
        break;
      }
    }

    // Extract all images from article
    const images = [];
    $('article img, .entry-content img, .post-content img').each((_, img) => {
      const src = $(img).attr('src') || $(img).attr('data-src');
      if (src && !src.includes('gravatar') && !src.includes('icon')) {
        images.push(src.startsWith('http') ? src : `${CONFIG.baseUrl}${src}`);
      }
    });

    // Extract tags/categories
    const tags = [];
    $('.tags a, .tag-links a, .post-tags a, .cat-links a').each((_, el) => {
      tags.push($(el).text().trim().toLowerCase());
    });

    // Extract date if not already found
    const dateStr = $('time[datetime]').attr('datetime')
      || $('meta[property="article:published_time"]').attr('content')
      || '';

    return { content, images, tags, date: dateStr };
  } catch (err) {
    console.log(`    ⚠️  Could not fetch article: ${err.message}`);
    return { content: '', images: [], tags: [], date: '' };
  }
}

/* ── Parse date string to YYYY-MM-DD ── */
function parseDate(dateStr) {
  if (!dateStr) return new Date().toISOString().split('T')[0];

  // Already ISO format
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    return dateStr.substring(0, 10);
  }

  try {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0];
    }
  } catch {
    // fall through
  }

  return new Date().toISOString().split('T')[0];
}

/* ── Download and convert image to WebP ── */
async function downloadAndConvertImage(imageUrl, articleIndex) {
  if (SKIP_IMAGES || !imageUrl) return null;

  try {
    const response = await fetchWithRetry(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 30000,
    });

    const inputBuffer = Buffer.from(response.data);

    // Convert to WebP with sharp
    const webpBuffer = await sharp(inputBuffer)
      .resize({ width: CONFIG.imageMaxWidth, withoutEnlargement: true })
      .webp({ quality: CONFIG.imageQuality })
      .toBuffer();

    // Save locally for reference
    if (!existsSync(CONFIG.imageOutputDir)) {
      mkdirSync(CONFIG.imageOutputDir, { recursive: true });
    }
    const localPath = join(CONFIG.imageOutputDir, `article-${articleIndex}.webp`);
    writeFileSync(localPath, webpBuffer);

    return { buffer: webpBuffer, localPath, originalUrl: imageUrl };
  } catch (err) {
    console.log(`    ⚠️  Image download failed: ${err.message}`);
    return null;
  }
}

/* ── Upload image to Firebase Storage ── */
async function uploadToStorage(imageBuffer, articleIndex) {
  if (DRY_RUN || !imageBuffer) return null;

  const timestamp = Date.now();
  const storagePath = `news/scraped/article-${articleIndex}-${timestamp}.webp`;

  try {
    const file = bucket.file(storagePath);
    await file.save(imageBuffer, {
      metadata: {
        contentType: 'image/webp',
        metadata: {
          source: 'nara-scraper',
          scrapedAt: new Date().toISOString(),
        },
      },
    });

    // Make publicly accessible
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${CONFIG.storageBucket}/${storagePath}`;

    return { url: publicUrl, storagePath };
  } catch (err) {
    console.log(`    ⚠️  Storage upload failed: ${err.message}`);
    return null;
  }
}

/* ── Guess category from article content/title ── */
function guessCategory(title, content, tags) {
  const text = `${title} ${content} ${tags.join(' ')}`.toLowerCase();

  if (/research|study|scientific|data|survey|species/.test(text)) return 'research';
  if (/event|workshop|seminar|conference|training|exhibition/.test(text)) return 'events';
  if (/announce|policy|regulation|guideline|gazette|ministry/.test(text)) return 'announcements';
  if (/press|media|release|statement/.test(text)) return 'press';
  if (/award|achievement|milestone|success|recognition/.test(text)) return 'achievements';
  return 'general';
}

/* ── Unsplash fallback images (ocean-themed) ── */
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1534766555764-ce878a4e947d?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop',
];

/* ── Build Firestore document ── */
function buildDocument(article, imageUrl, index) {
  const category = guessCategory(article.title, article.content || '', article.tags || []);
  const year = parseInt(article.date.substring(0, 4), 10) || new Date().getFullYear();

  return {
    title: {
      en: article.title,
      si: article.title,  // Machine translation can be added later
      ta: article.title,
    },
    excerpt: {
      en: article.excerpt || article.title,
      si: article.excerpt || article.title,
      ta: article.excerpt || article.title,
    },
    content: {
      en: article.content || article.excerpt || '',
      si: article.content || article.excerpt || '',
      ta: article.content || article.excerpt || '',
    },
    category,
    status: 'published',
    featuredImage: imageUrl || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
    images: [],
    tags: (article.tags || []).map(t => t.toLowerCase()),
    publishDate: article.date,
    year,
    views: 0,
    isFeatured: index < 3,  // First 3 articles are featured
    sourceUrl: article.url || '',
    scrapedAt: new Date().toISOString(),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
}

/* ── Main ── */
async function main() {
  console.log('🕷️  NARA News Scraper');
  console.log('=====================');
  if (DRY_RUN) console.log('🔍 DRY RUN — no data will be written to Firestore\n');
  if (SKIP_IMAGES) console.log('🖼️  Skipping image downloads\n');
  if (LIMIT < Infinity) console.log(`📊 Limiting to ${LIMIT} articles\n`);

  // Step 1: Initialize Firebase (unless dry-run)
  if (!DRY_RUN) {
    console.log('\n🔥 Initializing Firebase Admin...');
    try {
      initFirebase();
      console.log('  ✅ Firebase initialized\n');
    } catch (err) {
      console.error('  ❌ Firebase init failed:', err.message);
      console.error('\n  To use this scraper:');
      console.error('  1. Go to Firebase Console → Project Settings → Service Accounts');
      console.error('  2. Click "Generate new private key"');
      console.error('  3. Save as "serviceAccountKey.json" in the project root');
      console.error('  OR set GOOGLE_APPLICATION_CREDENTIALS env var\n');
      process.exit(1);
    }
  }

  // Step 2: Scrape the news listing
  let articles;
  try {
    articles = await scrapeNewsListing();
  } catch (err) {
    console.error(`\n❌ Could not reach NARA website: ${err.message}`);
    console.error('   The site may be temporarily down. Try again later.');
    console.error('   Alternatively, run: node scripts/seedNewsData.js');
    console.error('   to seed from the local naraNewsDatabase.json\n');
    process.exit(1);
  }

  if (articles.length === 0) {
    console.log('\n⚠️  No articles found. The page structure may have changed.');
    console.log('   Run: node scripts/seedNewsData.js for local data instead.\n');
    process.exit(0);
  }

  // Step 3: Process each article
  console.log(`\n📝 Processing ${articles.length} articles...\n`);
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    console.log(`  [${i + 1}/${articles.length}] "${article.title.substring(0, 60)}..."`);

    // Fetch full article content
    if (article.url) {
      console.log(`    Fetching content from: ${article.url}`);
      const details = await scrapeArticleContent(article.url);
      article.content = details.content || article.excerpt;
      article.tags = details.tags.length > 0 ? details.tags : [];
      if (details.date) article.date = parseDate(details.date);
      if (details.images.length > 0 && !article.featuredImageUrl) {
        article.featuredImageUrl = details.images[0];
      }
    }

    // Download & convert image
    let imageUrl = null;
    if (article.featuredImageUrl) {
      console.log(`    Downloading image...`);
      const imageResult = await downloadAndConvertImage(article.featuredImageUrl, i);

      if (imageResult && !DRY_RUN) {
        console.log(`    Uploading to Firebase Storage...`);
        const uploaded = await uploadToStorage(imageResult.buffer, i);
        if (uploaded) {
          imageUrl = uploaded.url;
          console.log(`    ✅ Image: ${uploaded.storagePath}`);
        }
      } else if (imageResult) {
        console.log(`    📁 Saved locally: ${imageResult.localPath}`);
      }
    }

    // Build and write Firestore document
    const doc = buildDocument(article, imageUrl, i);

    if (DRY_RUN) {
      console.log(`    📋 Category: ${doc.category} | Date: ${doc.publishDate} | Year: ${doc.year}`);
      console.log(`    📋 Image: ${doc.featuredImage.substring(0, 80)}...`);
      successCount++;
    } else {
      try {
        const docRef = await db.collection(CONFIG.firestoreCollection).add(doc);
        console.log(`    ✅ Firestore ID: ${docRef.id} | ${doc.category} | ${doc.publishDate}`);
        successCount++;
      } catch (err) {
        console.error(`    ❌ Firestore write failed: ${err.message}`);
        errorCount++;
      }
    }

    // Small delay between articles to be polite
    if (i < articles.length - 1) {
      await sleep(500);
    }
  }

  // Summary
  console.log('\n=====================');
  console.log(`✅ Processed: ${successCount} articles`);
  if (errorCount > 0) console.log(`❌ Failed: ${errorCount} articles`);

  if (DRY_RUN) {
    console.log('\n🔍 This was a dry run. No data was written.');
    console.log('   Remove --dry-run to write to Firestore.');
  } else {
    console.log('\nDone! Scraped articles are now in the Firestore "news" collection.');
    console.log('They should appear on:');
    console.log('  - Home page carousel (http://localhost:4028)');
    console.log('  - News page (http://localhost:4028/news)');
    console.log('  - Admin panel (http://localhost:4028/admin/news)');
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('\nFatal error:', err);
  process.exit(1);
});
