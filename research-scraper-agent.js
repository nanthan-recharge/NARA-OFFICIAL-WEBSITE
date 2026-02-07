/**
 * 🤖 NARA RESEARCH PAPER SCRAPER AGENT
 * 
 * This agent automatically downloads research papers from NARA and other marine research sources
 * Saves them in organized format with metadata
 * 
 * REQUIREMENTS:
 * npm install puppeteer axios cheerio pdf-parse
 * 
 * RUN:
 * node research-scraper-agent.js
 */

const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  downloadFolder: './downloaded-research-papers',
  sources: [
    'https://www.nara.ac.lk/publications',
    'https://aquadocs.org/results?q=sri+lanka+marine',
    'https://scholar.google.com/scholar?q=sri+lanka+marine+research+NARA',
    'https://www.researchgate.net/search.Search.html?type=publication&query=NARA%20Sri%20Lanka%20marine'
  ],
  dailyLimit: 5,
  formats: ['pdf', 'doc', 'docx']
};

// Create download folder
if (!fs.existsSync(CONFIG.downloadFolder)) {
  fs.mkdirSync(CONFIG.downloadFolder, { recursive: true });
}

/**
 * Main scraper function
 */
async function scrapeResearchPapers() {
  console.log('🤖 Starting NARA Research Paper Scraper Agent...\n');
  
  const browser = await puppeteer.launch({
    headless: false, // Set to true for background operation
    defaultViewport: null,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();
  
  // Set download behavior
  const downloadPath = path.resolve(CONFIG.downloadFolder);
  await page._client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadPath
  });

  let totalDownloaded = 0;
  const papers = [];

  try {
    // Source 1: NARA Official Website
    console.log('📚 Searching NARA Official Website...');
    await scrapeNARAWebsite(page, papers);

    // Source 2: Google Scholar
    console.log('\n📖 Searching Google Scholar...');
    await scrapeGoogleScholar(page, papers);

    // Source 3: ResearchGate
    console.log('\n🔬 Searching ResearchGate...');
    await scrapeResearchGate(page, papers);

    // Source 4: AquaDocs
    console.log('\n🌊 Searching AquaDocs...');
    await scrapeAquaDocs(page, papers);

    // Download papers
    console.log('\n⬇️  Downloading papers...');
    for (const paper of papers.slice(0, CONFIG.dailyLimit)) {
      await downloadPaper(page, paper);
      totalDownloaded++;
    }

    // Save metadata
    saveMetadata(papers);

    console.log(`\n✅ COMPLETE! Downloaded ${totalDownloaded} papers`);
    console.log(`📁 Saved to: ${CONFIG.downloadFolder}`);
    console.log(`📊 Total found: ${papers.length} papers`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

/**
 * Scrape NARA Official Website
 */
async function scrapeNARAWebsite(page, papers) {
  try {
    await page.goto('https://www.nara.ac.lk', { waitUntil: 'networkidle2' });
    
    // Look for publication links
    const links = await page.evaluate(() => {
      const results = [];
      const anchors = document.querySelectorAll('a[href*="publication"], a[href*="research"], a[href*=".pdf"]');
      
      anchors.forEach(a => {
        const href = a.href;
        const text = a.textContent.trim();
        if (href && text) {
          results.push({ url: href, title: text });
        }
      });
      
      return results;
    });

    links.forEach(link => {
      if (link.url.endsWith('.pdf')) {
        papers.push({
          title: link.title,
          url: link.url,
          source: 'NARA Official',
          type: 'pdf',
          date: new Date().toISOString()
        });
      }
    });

    console.log(`   ✅ Found ${links.length} items from NARA website`);
  } catch (error) {
    console.log(`   ⚠️  Could not access NARA website: ${error.message}`);
  }
}

/**
 * Scrape Google Scholar
 */
async function scrapeGoogleScholar(page, papers) {
  try {
    await page.goto('https://scholar.google.com/scholar?q=NARA+Sri+Lanka+marine+fisheries+research', {
      waitUntil: 'networkidle2'
    });

    await page.waitForSelector('.gs_r', { timeout: 5000 });

    const results = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll('.gs_r').forEach((result, index) => {
        if (index >= 5) return; // Limit to 5 results
        
        const titleEl = result.querySelector('.gs_rt a');
        const snippetEl = result.querySelector('.gs_rs');
        const authorsEl = result.querySelector('.gs_a');
        const pdfLink = result.querySelector('a[href$=".pdf"]');
        
        if (titleEl) {
          items.push({
            title: titleEl.textContent,
            url: pdfLink ? pdfLink.href : titleEl.href,
            snippet: snippetEl ? snippetEl.textContent : '',
            authors: authorsEl ? authorsEl.textContent : '',
            isPdf: !!pdfLink
          });
        }
      });
      return items;
    });

    results.forEach(result => {
      papers.push({
        title: result.title,
        url: result.url,
        source: 'Google Scholar',
        type: result.isPdf ? 'pdf' : 'link',
        authors: result.authors,
        snippet: result.snippet,
        date: new Date().toISOString()
      });
    });

    console.log(`   ✅ Found ${results.length} papers from Google Scholar`);
  } catch (error) {
    console.log(`   ⚠️  Error with Google Scholar: ${error.message}`);
  }
}

/**
 * Scrape ResearchGate
 */
async function scrapeResearchGate(page, papers) {
  try {
    await page.goto('https://www.researchgate.net/search/publication?q=NARA%20Sri%20Lanka%20marine', {
      waitUntil: 'networkidle2'
    });

    await page.waitForTimeout(2000);

    const results = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll('.nova-legacy-e-text--spacing-none').forEach((el, index) => {
        if (index >= 5) return;
        
        const link = el.querySelector('a');
        if (link) {
          items.push({
            title: link.textContent.trim(),
            url: link.href
          });
        }
      });
      return items;
    });

    results.forEach(result => {
      papers.push({
        title: result.title,
        url: result.url,
        source: 'ResearchGate',
        type: 'link',
        date: new Date().toISOString()
      });
    });

    console.log(`   ✅ Found ${results.length} papers from ResearchGate`);
  } catch (error) {
    console.log(`   ⚠️  Error with ResearchGate: ${error.message}`);
  }
}

/**
 * Scrape AquaDocs
 */
async function scrapeAquaDocs(page, papers) {
  try {
    await page.goto('https://aquadocs.org/discover?query=sri+lanka+marine', {
      waitUntil: 'networkidle2'
    });

    const results = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll('.artifact-title a').forEach((link, index) => {
        if (index >= 5) return;
        items.push({
          title: link.textContent.trim(),
          url: link.href
        });
      });
      return items;
    });

    results.forEach(result => {
      papers.push({
        title: result.title,
        url: result.url,
        source: 'AquaDocs',
        type: 'repository',
        date: new Date().toISOString()
      });
    });

    console.log(`   ✅ Found ${results.length} papers from AquaDocs`);
  } catch (error) {
    console.log(`   ⚠️  Error with AquaDocs: ${error.message}`);
  }
}

/**
 * Download individual paper
 */
async function downloadPaper(page, paper) {
  try {
    console.log(`   ⬇️  Downloading: ${paper.title.substring(0, 50)}...`);
    
    if (paper.type === 'pdf') {
      // Direct PDF download
      const response = await axios.get(paper.url, {
        responseType: 'arraybuffer',
        timeout: 30000
      });
      
      const filename = sanitizeFilename(paper.title) + '.pdf';
      const filepath = path.join(CONFIG.downloadFolder, filename);
      
      fs.writeFileSync(filepath, response.data);
      console.log(`      ✅ Saved: ${filename}`);
      
    } else {
      // Navigate and try to find PDF
      await page.goto(paper.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.waitForTimeout(2000);
      
      // Look for PDF download button
      const pdfButton = await page.$('a[href$=".pdf"], button:has-text("Download"), a:has-text("PDF")');
      
      if (pdfButton) {
        await pdfButton.click();
        await page.waitForTimeout(3000);
        console.log(`      ✅ Initiated download`);
      } else {
        // Save as HTML
        const html = await page.content();
        const filename = sanitizeFilename(paper.title) + '.html';
        const filepath = path.join(CONFIG.downloadFolder, filename);
        fs.writeFileSync(filepath, html);
        console.log(`      ✅ Saved as HTML: ${filename}`);
      }
    }
    
  } catch (error) {
    console.log(`      ❌ Failed: ${error.message}`);
  }
}

/**
 * Save metadata JSON
 */
function saveMetadata(papers) {
  const metadata = {
    downloadDate: new Date().toISOString(),
    totalPapers: papers.length,
    papers: papers.map(p => ({
      title: p.title,
      source: p.source,
      url: p.url,
      type: p.type,
      authors: p.authors || 'Unknown',
      snippet: p.snippet || ''
    }))
  };

  const filepath = path.join(CONFIG.downloadFolder, 'metadata.json');
  fs.writeFileSync(filepath, JSON.stringify(metadata, null, 2));
  console.log(`\n📋 Metadata saved to: metadata.json`);
}

/**
 * Sanitize filename
 */
function sanitizeFilename(title) {
  return title
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .substring(0, 100)
    .toLowerCase();
}

// Run the scraper
scrapeResearchPapers().catch(console.error);
