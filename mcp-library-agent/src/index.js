#!/usr/bin/env node

/**
 * NARA Library MCP Agent
 * Main entry point - runs the library updater on schedule
 */

import cron from 'node-cron';
import { config } from './config.js';
import { main as runFetcher } from './fetchBooks.js';
import { loadCatalogue, getCatalogueStats } from './catalogueUpdater.js';
import { logger } from './utils.js';

// Banner
console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║    🌊 NARA Digital Library MCP Agent 🌊                     ║
║                                                              ║
║    Automatically updating ocean science publications         ║
║    National Aquatic Resources Research & Development Agency  ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);

/**
 * Display current status
 */
async function displayStatus() {
  try {
    const catalogue = await loadCatalogue();
    const stats = getCatalogueStats(catalogue);

    console.log('\n📊 Current Library Status:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  Total items:      ${stats.total}`);
    console.log(`  Open access:      ${stats.openAccess}`);
    console.log(`  With PDF:         ${stats.withPdf}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('  Material Types:');
    Object.entries(stats.byMaterialType)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([type, count]) => {
        console.log(`    ${type.padEnd(10)} ${count}`);
      });

    console.log('\n  Sources:');
    Object.entries(stats.bySource)
      .sort((a, b) => b[1] - a[1])
      .forEach(([source, count]) => {
        console.log(`    ${source.padEnd(20)} ${count}`);
      });

    console.log('\n');
  } catch (error) {
    console.log('  No catalogue found yet. Run fetch to initialize.\n');
  }
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const command = args[0] || 'status';

  return { command, args: args.slice(1) };
}

/**
 * Main function
 */
async function main() {
  const { command } = parseArgs();

  switch (command) {
    case 'fetch':
    case 'run':
    case 'update':
      console.log('🚀 Starting manual fetch...\n');
      await runFetcher();
      break;

    case 'schedule':
    case 'daemon':
      console.log(`📅 Starting scheduled mode...`);
      console.log(`   Schedule: ${config.schedule.cron}`);
      console.log('   Press Ctrl+C to stop\n');

      // Display initial status
      await displayStatus();

      // Schedule the job
      cron.schedule(config.schedule.cron, async () => {
        console.log('\n⏰ Scheduled run starting...');
        try {
          await runFetcher();
        } catch (error) {
          logger.error('Scheduled run failed:', error.message);
        }
      });

      console.log('✅ Scheduler active. Waiting for next run...\n');

      // Keep the process alive
      process.stdin.resume();
      break;

    case 'status':
    default:
      await displayStatus();

      console.log('📖 Available commands:');
      console.log('   node src/index.js fetch    - Run fetch immediately');
      console.log('   node src/index.js schedule - Start scheduled daemon');
      console.log('   node src/index.js status   - Show current status\n');
      break;
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down NARA Library Agent...\n');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Shutting down NARA Library Agent...\n');
  process.exit(0);
});

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
