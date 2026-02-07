const { testConnection } = require('../config/database');
const logger = require('../config/logger');
const { worker, queueEvents } = require('./bookDownloadWorker');
const { getMetrics } = require('../queue/bookQueue');

async function startWorker() {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      logger.error('Database connection failed. Exiting...');
      process.exit(1);
    }
    
    logger.info('='.repeat(50));
    logger.info('NARA Library Background Agent Started');
    logger.info('='.repeat(50));
    logger.info(`Worker concurrency: ${worker.opts.concurrency}`);
    logger.info(`Max retries: ${worker.opts.settings?.attempts || 3}`);
    
    // Log queue metrics every 60 seconds
    setInterval(async () => {
      try {
        const metrics = await getMetrics();
        logger.info('Queue Status:', metrics);
      } catch (error) {
        logger.error('Failed to get metrics:', error);
      }
    }, 60000);

  } catch (error) {
    logger.error('Failed to start worker:', error);
    process.exit(1);
  }
}

// Graceful shutdown
async function gracefulShutdown(signal) {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  try {
    // Close worker (waits for active jobs to complete)
    await worker.close();
    logger.info('Worker closed');

    // Close queue events
    await queueEvents.close();
    logger.info('Queue events closed');

    // Disconnect from database
    const { close } = require('../config/database');
    await close();
    logger.info('Database disconnected');

    logger.info('Graceful shutdown complete');
    process.exit(0);

  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
}

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the worker
startWorker();

