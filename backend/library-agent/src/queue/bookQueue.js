const { Queue } = require('bullmq');
const connection = require('../config/redis');
const config = require('../config');
const logger = require('../config/logger');

const bookQueue = new Queue('bookDownloads', {
  connection,
  defaultJobOptions: {
    attempts: config.worker.maxRetries,
    backoff: {
      type: 'exponential',
      delay: config.worker.retryDelay
    },
    removeOnComplete: {
      age: 86400, // 24 hours
      count: 1000
    },
    removeOnFail: {
      age: 604800 // 7 days
    }
  }
});

// Add jobs for a category
async function addCategoryJobs(category, books) {
  const jobs = books.map((book, index) => ({
    name: `download-${category}-${index}`,
    data: {
      category,
      book,
      index: index + 1
    },
    opts: {
      jobId: `${category}-${index}-${Date.now()}`
    }
  }));

  await bookQueue.addBulk(jobs);
  logger.info(`Added ${jobs.length} jobs for category: ${category}`);
  return jobs.length;
}

// Get queue metrics
async function getMetrics() {
  const [waiting, active, completed, failed] = await Promise.all([
    bookQueue.getWaitingCount(),
    bookQueue.getActiveCount(),
    bookQueue.getCompletedCount(),
    bookQueue.getFailedCount()
  ]);

  return { waiting, active, completed, failed };
}

// Clear queue (for testing)
async function clearQueue() {
  await bookQueue.obliterate({ force: true });
  logger.info('Queue cleared');
}

module.exports = { bookQueue, addCategoryJobs, getMetrics, clearQueue };

