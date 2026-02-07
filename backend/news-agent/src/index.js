const cron = require('node-cron');
const config = require('./config');
const logger = require('./config/logger');
const { runAgent } = require('./services/newsAgentService');
const firebaseService = require('./services/firebaseService');

process.on('unhandledRejection', reason => {
  logger.error({ err: reason }, 'Unhandled promise rejection');
});

process.on('uncaughtException', error => {
  logger.error({ err: error }, 'Uncaught exception');
  process.exitCode = 1;
});

const runOnce = async () => {
  await firebaseService.init();
  await runAgent();
};

const schedule = () => {
  logger.info({ cron: config.scheduler.cronExpression }, 'Scheduling news agent');
  firebaseService.init();

  cron.schedule(config.scheduler.cronExpression, async () => {
    logger.info('Scheduled run triggered');
    try {
      await runAgent();
    } catch (error) {
      logger.error({ err: error }, 'Scheduled run failed');
    }
  });
};

const cmd = process.argv[2];

switch (cmd) {
  case 'run-once':
    runOnce()
      .then(() => {
        logger.info('Run complete');
        process.exit(0);
      })
      .catch(error => {
        logger.error({ err: error }, 'Run failed');
        process.exit(1);
      });
    break;
  case 'schedule':
    schedule();
    break;
  default:
    console.log('Usage: node src/index.js [run-once|schedule]');
    process.exit(1);
}
