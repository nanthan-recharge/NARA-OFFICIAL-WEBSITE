/**
 * Cron Scheduler for Daily Ebook Agent
 * Runs the agent at configured times automatically
 */

const cron = require('node-cron');
const DailyEbookAgent = require('./dailyEbookAgent');

class AgentScheduler {
  constructor() {
    this.task = null;
    this.isRunning = false;
  }

  /**
   * Start the scheduler
   */
  start() {
    console.log('🚀 Starting Daily Ebook Agent Scheduler...');
    console.log('📅 Schedule: Every day at 2:00 AM UTC (7:30 AM Sri Lanka Time)');

    // Schedule: Every day at 2:00 AM UTC
    this.task = cron.schedule('0 2 * * *', async () => {
      if (this.isRunning) {
        console.log('⚠️  Previous agent run still in progress, skipping...');
        return;
      }

      this.isRunning = true;

      try {
        console.log('\n' + '='.repeat(60));
        console.log('🤖 Starting Daily Ebook Agent Run');
        console.log('='.repeat(60));

        const agent = new DailyEbookAgent();
        await agent.run();

        console.log('='.repeat(60));
        console.log('✅ Daily Ebook Agent Run Completed');
        console.log('='.repeat(60) + '\n');
      } catch (error) {
        console.error('❌ Agent run failed:', error);
      } finally {
        this.isRunning = false;
      }
    }, {
      scheduled: true,
      timezone: "UTC"
    });

    console.log('✅ Scheduler started successfully');
    console.log('💡 Next run: Tomorrow at 2:00 AM UTC\n');
    console.log('To run manually: npm run agent:manual\n');
  }

  /**
   * Stop the scheduler
   */
  stop() {
    if (this.task) {
      this.task.stop();
      console.log('🛑 Scheduler stopped');
    }
  }

  /**
   * Run agent manually (for testing)
   */
  async runManually() {
    console.log('🔧 Running agent manually...\n');

    const agent = new DailyEbookAgent();
    await agent.run();

    console.log('\n✅ Manual run completed');
  }
}

// Export for use in server
module.exports = AgentScheduler;

// Run if executed directly
if (require.main === module) {
  const scheduler = new AgentScheduler();

  // Check for manual run flag
  const isManual = process.argv.includes('--manual');

  if (isManual) {
    scheduler.runManually()
      .then(() => process.exit(0))
      .catch((error) => {
        console.error('Manual run failed:', error);
        process.exit(1);
      });
  } else {
    scheduler.start();

    // Keep process alive
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down scheduler...');
      scheduler.stop();
      process.exit(0);
    });
  }
}
