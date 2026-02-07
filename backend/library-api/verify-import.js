const { pool } = require('./config/database');

/**
 * Verify the offline library database import
 */
async function verifyImport() {
  console.log('🔍 NARA Offline Library - Import Verification\n');
  console.log('='.repeat(60));

  try {
    // Check total books
    const books = await pool.query('SELECT COUNT(*) FROM offline_books');
    console.log(`📚 Total Books:       ${books.rows[0].count.toLocaleString()}`);

    // Check available books
    const available = await pool.query(`
      SELECT COUNT(*) FROM offline_books
      WHERE status = 'available' AND is_archived = FALSE
    `);
    console.log(`✅ Available Books:   ${available.rows[0].count.toLocaleString()}`);

    // Check authors
    const authors = await pool.query('SELECT COUNT(*) FROM authors');
    console.log(`✍️  Total Authors:     ${authors.rows[0].count.toLocaleString()}`);

    // Check categories
    const categories = await pool.query('SELECT COUNT(*) FROM categories');
    console.log(`📁 Total Categories:  ${categories.rows[0].count.toLocaleString()}`);

    // Check publishers
    const publishers = await pool.query('SELECT COUNT(*) FROM publishers');
    console.log(`🏢 Total Publishers:  ${publishers.rows[0].count.toLocaleString()}`);

    // Check tags
    const tags = await pool.query('SELECT COUNT(*) FROM tags');
    console.log(`🏷️  Total Tags:        ${tags.rows[0].count.toLocaleString()}`);

    // Check series
    const series = await pool.query('SELECT COUNT(*) FROM book_series');
    console.log(`📖 Total Series:      ${series.rows[0].count.toLocaleString()}`);

    console.log('='.repeat(60));

    // Language distribution
    console.log('\n📊 Language Distribution:');
    const languages = await pool.query(`
      SELECT language, COUNT(*) as count
      FROM offline_books
      GROUP BY language
      ORDER BY count DESC
    `);
    languages.rows.forEach(lang => {
      console.log(`   ${lang.language || 'Unknown'}: ${lang.count.toLocaleString()} books`);
    });

    // Top categories
    console.log('\n📁 Top 10 Categories:');
    const topCategories = await pool.query(`
      SELECT c.name, COUNT(bc.book_id) as book_count
      FROM categories c
      LEFT JOIN book_categories bc ON c.id = bc.category_id
      GROUP BY c.id, c.name
      ORDER BY book_count DESC
      LIMIT 10
    `);
    topCategories.rows.forEach((cat, i) => {
      console.log(`   ${i + 1}. ${cat.name}: ${cat.book_count.toLocaleString()} books`);
    });

    // Top authors
    console.log('\n✍️  Top 10 Authors:');
    const topAuthors = await pool.query(`
      SELECT a.name, COUNT(ba.book_id) as book_count
      FROM authors a
      LEFT JOIN book_authors ba ON a.id = ba.author_id
      GROUP BY a.id, a.name
      ORDER BY book_count DESC
      LIMIT 10
    `);
    topAuthors.rows.forEach((author, i) => {
      console.log(`   ${i + 1}. ${author.name}: ${author.book_count.toLocaleString()} books`);
    });

    // Publication year range
    console.log('\n📅 Publication Year Range:');
    const yearRange = await pool.query(`
      SELECT
        MIN(publication_year) as oldest,
        MAX(publication_year) as newest,
        AVG(publication_year)::int as average
      FROM offline_books
      WHERE publication_year IS NOT NULL
    `);
    if (yearRange.rows[0].oldest) {
      console.log(`   Oldest: ${yearRange.rows[0].oldest}`);
      console.log(`   Newest: ${yearRange.rows[0].newest}`);
      console.log(`   Average: ${yearRange.rows[0].average}`);
    }

    // Sample books
    console.log('\n📖 Sample Books (Random 5):');
    const sample = await pool.query(`
      SELECT
        b.title,
        b.publication_year,
        string_agg(DISTINCT a.name, '; ') as authors,
        string_agg(DISTINCT c.name, '; ') as categories
      FROM offline_books b
      LEFT JOIN book_authors ba ON b.id = ba.book_id
      LEFT JOIN authors a ON ba.author_id = a.id
      LEFT JOIN book_categories bc ON b.id = bc.book_id
      LEFT JOIN categories c ON bc.category_id = c.id
      GROUP BY b.id, b.title, b.publication_year
      ORDER BY RANDOM()
      LIMIT 5
    `);

    sample.rows.forEach((book, i) => {
      console.log(`\n   ${i + 1}. ${book.title}`);
      if (book.publication_year) console.log(`      Year: ${book.publication_year}`);
      if (book.authors) console.log(`      Authors: ${book.authors}`);
      if (book.categories) console.log(`      Categories: ${book.categories}`);
    });

    // Database health check
    console.log('\n💚 Database Health Check:');

    // Books without authors
    const noAuthors = await pool.query(`
      SELECT COUNT(*) FROM offline_books b
      WHERE NOT EXISTS (
        SELECT 1 FROM book_authors ba WHERE ba.book_id = b.id
      )
    `);
    console.log(`   Books without authors: ${noAuthors.rows[0].count}`);

    // Books without categories
    const noCategories = await pool.query(`
      SELECT COUNT(*) FROM offline_books b
      WHERE NOT EXISTS (
        SELECT 1 FROM book_categories bc WHERE bc.book_id = b.id
      )
    `);
    console.log(`   Books without categories: ${noCategories.rows[0].count}`);

    // Orphaned authors
    const orphanedAuthors = await pool.query(`
      SELECT COUNT(*) FROM authors a
      WHERE NOT EXISTS (
        SELECT 1 FROM book_authors ba WHERE ba.author_id = a.id
      )
    `);
    console.log(`   Orphaned authors: ${orphanedAuthors.rows[0].count}`);

    console.log('\n' + '='.repeat(60));
    console.log('✅ Verification Complete!\n');

  } catch (error) {
    console.error('\n❌ Error during verification:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

// Run verification
verifyImport();
