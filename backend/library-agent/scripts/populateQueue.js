const { testConnection } = require('../src/config/database');
const logger = require('../src/config/logger');
const config = require('../src/config');
const apiService = require('../src/services/apiService');
const { addCategoryJobs } = require('../src/queue/bookQueue');
const { NARA_CATEGORIES } = require('../src/utils/categories');
const cliProgress = require('cli-progress');

async function populateQueue() {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      logger.error('Database connection failed. Exiting...');
      process.exit(1);
    }
    
    logger.info('='.repeat(60));
    logger.info('Populating Job Queue with Book Download Tasks');
    logger.info('='.repeat(60));

    const booksPerCategory = config.download.booksPerCategory;
    let totalJobs = 0;

    const progressBar = new cliProgress.SingleBar({
      format: 'Progress |{bar}| {percentage}% | {value}/{total} Categories',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591'
    }, cliProgress.Presets.shades_classic);

    progressBar.start(NARA_CATEGORIES.length, 0);

    for (let i = 0; i < NARA_CATEGORIES.length; i++) {
      const category = NARA_CATEGORIES[i];
      
      logger.info(`\nSearching for books: ${category}`);

      // Search for books
      const books = await apiService.searchBooks(category, booksPerCategory);

      if (books.length === 0) {
        logger.warn(`No books found for category: ${category}`);
        progressBar.increment();
        continue;
      }

      // Add jobs to queue
      const jobCount = await addCategoryJobs(category, books);
      totalJobs += jobCount;

      logger.info(`✓ Added ${jobCount} jobs for ${category}`);
      progressBar.increment();

      // Add delay between categories
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    progressBar.stop();

    logger.info('\n' + '='.repeat(60));
    logger.info(`Queue Population Complete!`);
    logger.info(`Total jobs added: ${totalJobs}`);
    logger.info(`Categories processed: ${NARA_CATEGORIES.length}`);
    logger.info('='.repeat(60));
    logger.info('\nStart the worker with: npm run worker');

    // Close database connection
    const { close } = require('../src/config/database');
    await close();
    
    process.exit(0);

  } catch (error) {
    logger.error('Failed to populate queue:', error);
    process.exit(1);
  }
}

populateQueue();

