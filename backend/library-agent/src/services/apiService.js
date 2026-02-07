const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const config = require('../config');
const logger = require('../config/logger');
const { MARINE_KEYWORDS } = require('../utils/categories');

// Configure axios with retries
axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
           error.response?.status === 429;
  }
});

class APIService {
  constructor() {
    this.delay = config.api.delayMs;
    this.timeout = config.api.timeout;
  }

  // Helper: Add delay between requests
  async wait() {
    await new Promise(resolve => setTimeout(resolve, this.delay));
  }

  // CORE API - Best for academic papers
  async searchCORE(query, limit = 10) {
    try {
      await this.wait();
      const response = await axios.get('https://api.core.ac.uk/v3/search/works', {
        params: { q: query, limit },
        timeout: this.timeout
      });

      const results = response.data.results || [];
      return results.map(item => ({
        title: item.title || 'Untitled',
        author: item.authors?.[0] || 'Unknown Author',
        downloadUrl: item.downloadUrl,
        sourceUrl: item.sourceUrl,
        abstract: item.abstract,
        year: item.yearPublished,
        source: 'CORE'
      })).filter(item => item.downloadUrl);

    } catch (error) {
      logger.error('CORE API search failed:', error.message);
      return [];
    }
  }

  // Internet Archive - Broadest coverage
  async searchInternetArchive(query, mediatype = 'texts', limit = 10) {
    try {
      await this.wait();
      const searchUrl = 'https://archive.org/advancedsearch.php';
      const response = await axios.get(searchUrl, {
        params: {
          q: `${query} AND mediatype:${mediatype}`,
          fl: ['identifier', 'title', 'creator', 'year', 'downloads'].join(','),
          rows: limit,
          output: 'json'
        },
        timeout: this.timeout
      });

      const docs = response.data.response?.docs || [];
      return docs.map(doc => ({
        title: doc.title || 'Untitled',
        author: doc.creator || 'Unknown Author',
        downloadUrl: `https://archive.org/download/${doc.identifier}/${doc.identifier}.pdf`,
        sourceUrl: `https://archive.org/details/${doc.identifier}`,
        year: doc.year,
        source: 'Internet Archive',
        sourceId: doc.identifier
      }));

    } catch (error) {
      logger.error('Internet Archive search failed:', error.message);
      return [];
    }
  }

  // DOAJ - Open access journals
  async searchDOAJ(query, limit = 10) {
    try {
      await this.wait();
      const response = await axios.get(`https://doaj.org/api/v4/search/articles/${encodeURIComponent(query)}`, {
        params: { pageSize: limit },
        timeout: this.timeout
      });

      const results = response.data.results || [];
      return results.map(item => {
        const fullTextLink = item.bibjson?.link?.find(l => l.type === 'fulltext');
        return {
          title: item.bibjson?.title || 'Untitled',
          author: item.bibjson?.author?.[0]?.name || 'Unknown Author',
          downloadUrl: fullTextLink?.url,
          sourceUrl: fullTextLink?.url,
          abstract: item.bibjson?.abstract,
          year: item.bibjson?.year,
          source: 'DOAJ'
        };
      }).filter(item => item.downloadUrl && item.downloadUrl.includes('.pdf'));

    } catch (error) {
      logger.error('DOAJ search failed:', error.message);
      return [];
    }
  }

  // Open Library
  async searchOpenLibrary(query, limit = 10) {
    try {
      await this.wait();
      const response = await axios.get('https://openlibrary.org/search.json', {
        params: {
          q: query,
          limit,
          fields: 'key,title,author_name,first_publish_year,ia'
        },
        timeout: this.timeout
      });

      const docs = response.data.docs || [];
      return docs
        .filter(doc => doc.ia && doc.ia.length > 0) // Has Internet Archive ID
        .map(doc => ({
          title: doc.title || 'Untitled',
          author: doc.author_name?.[0] || 'Unknown Author',
          downloadUrl: `https://archive.org/download/${doc.ia[0]}/${doc.ia[0]}.pdf`,
          sourceUrl: `https://openlibrary.org${doc.key}`,
          year: doc.first_publish_year,
          source: 'Open Library',
          sourceId: doc.ia[0]
        }));

    } catch (error) {
      logger.error('Open Library search failed:', error.message);
      return [];
    }
  }

  // Master search function
  async searchBooks(category, limit = 10) {
    const keywords = MARINE_KEYWORDS[category] || ['marine', 'aquatic'];
    const query = keywords.join(' OR ');

    logger.info(`Searching for books: category="${category}", query="${query}"`);

    let allResults = [];

    // Try multiple APIs
    try {
      const [coreResults, iaResults, doajResults, olResults] = await Promise.all([
        this.searchCORE(query, limit),
        this.searchInternetArchive(query, 'texts', limit),
        this.searchDOAJ(query, limit),
        this.searchOpenLibrary(query, limit)
      ]);

      allResults = [...coreResults, ...iaResults, ...doajResults, ...olResults];
      
      // Remove duplicates by title
      const seen = new Set();
      allResults = allResults.filter(result => {
        const normalized = result.title.toLowerCase().trim();
        if (seen.has(normalized)) return false;
        seen.add(normalized);
        return true;
      });

      logger.info(`Found ${allResults.length} books for category "${category}"`);
      return allResults.slice(0, limit);

    } catch (error) {
      logger.error('Master search failed:', error);
      return allResults;
    }
  }
}

module.exports = new APIService();

