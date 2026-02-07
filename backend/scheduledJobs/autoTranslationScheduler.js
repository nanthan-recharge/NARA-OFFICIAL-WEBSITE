#!/usr/bin/env node

/**
 * NARA Library - Automated PDF Translation Scheduler
 *
 * Runs twice daily (every 12 hours) to translate books to Tamil and Sinhala
 * Uses Google Gemini AI for free high-quality translations
 *
 * Schedule: 6:00 AM and 6:00 PM daily
 */

const { spawn } = require('child_process');
const path = require('path');

// Configuration
const TRANSLATION_BATCH_SIZE = 5; // Translate 5 books per run
const AGENT_PATH = path.join(__dirname, '..', 'pdfTranslationAgent.js');

console.log('============================================================');
console.log('🤖 NARA Automated Translation Scheduler');
console.log('============================================================');
console.log(`📅 Started at: ${new Date().toLocaleString()}`);
console.log(`📚 Batch size: ${TRANSLATION_BATCH_SIZE} books`);
console.log(`🔄 Schedule: Every 12 hours (6 AM & 6 PM)`);
console.log('============================================================\n');

/**
 * Run translation agent
 */
function runTranslationAgent() {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 Starting translation of ${TRANSLATION_BATCH_SIZE} books...`);
    console.log(`⏰ Time: ${new Date().toLocaleString()}\n`);

    const agent = spawn('node', [AGENT_PATH, TRANSLATION_BATCH_SIZE.toString()], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });

    agent.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ Translation batch completed successfully!');
        console.log(`📊 ${TRANSLATION_BATCH_SIZE} books processed`);
        console.log(`⏰ Finished at: ${new Date().toLocaleString()}`);
        console.log('============================================================\n');
        resolve();
      } else {
        console.error(`\n❌ Translation failed with exit code ${code}`);
        reject(new Error(`Translation agent exited with code ${code}`));
      }
    });

    agent.on('error', (error) => {
      console.error('\n❌ Failed to start translation agent:', error);
      reject(error);
    });
  });
}

/**
 * Main execution
 */
async function main() {
  try {
    await runTranslationAgent();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Scheduler error:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { runTranslationAgent };
