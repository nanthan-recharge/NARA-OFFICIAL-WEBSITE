const { pool } = require('../config/database');
const fs = require('fs').promises;
const path = require('path');

/**
 * Run the offline library database migration
 */
async function runMigration() {
  console.log('🚀 Starting NARA Offline Library Database Migration...\n');

  try {
    // Read the SQL migration file
    const migrationPath = path.join(__dirname, '001_create_offline_library_schema.sql');
    const migrationSQL = await fs.readFile(migrationPath, 'utf8');

    console.log('📄 Migration file loaded successfully');
    console.log('⏳ Executing migration...\n');

    // Execute the migration
    await pool.query(migrationSQL);

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📊 Database tables created:');
    console.log('   ✓ categories');
    console.log('   ✓ authors');
    console.log('   ✓ publishers');
    console.log('   ✓ offline_books (main table)');
    console.log('   ✓ book_authors (junction)');
    console.log('   ✓ book_categories (junction)');
    console.log('   ✓ book_publishers (junction)');
    console.log('   ✓ book_copies');
    console.log('   ✓ book_reviews');
    console.log('   ✓ checkout_history');
    console.log('   ✓ reservations');
    console.log('   ✓ book_series');
    console.log('   ✓ book_series_items');
    console.log('   ✓ tags');
    console.log('   ✓ book_tags');
    console.log('   ✓ activity_log');

    console.log('\n🎯 Views created:');
    console.log('   ✓ books_complete_view');
    console.log('   ✓ popular_books_view');

    console.log('\n⚡ Triggers created:');
    console.log('   ✓ Auto-update timestamps');
    console.log('   ✓ Auto-update search vectors');
    console.log('   ✓ Auto-update available copies');

    console.log('\n🎉 Database is ready for offline library data!');
    console.log('\n📝 Next steps:');
    console.log('   1. Run the CSV import script');
    console.log('   2. Verify data with: node verify-import.js');
    console.log('   3. Start using the library API\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\nError details:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migration
runMigration();
