const { pool, getClient } = require('./config/database');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

/**
 * Import 257 NARA research reports from simplified CSV
 * Format: No, Title, Author, Publisher, Year
 */

let importStats = {
  total: 0,
  success: 0,
  failed: 0,
  duplicates: 0,
  errors: []
};

/**
 * Get or create author
 */
async function getOrCreateAuthor(client, authorName) {
  if (!authorName) return null;

  const checkResult = await client.query(
    'SELECT id FROM authors WHERE name = $1',
    [authorName]
  );

  if (checkResult.rows.length > 0) {
    return checkResult.rows[0].id;
  }

  const insertResult = await client.query(
    'INSERT INTO authors (name) VALUES ($1) RETURNING id',
    [authorName]
  );

  return insertResult.rows[0].id;
}

/**
 * Get or create publisher
 */
async function getOrCreatePublisher(client, publisherName) {
  if (!publisherName) return null;

  const checkResult = await client.query(
    'SELECT id FROM publishers WHERE name = $1',
    [publisherName]
  );

  if (checkResult.rows.length > 0) {
    return checkResult.rows[0].id;
  }

  const insertResult = await client.query(
    'INSERT INTO publishers (name) VALUES ($1) RETURNING id',
    [publisherName]
  );

  return insertResult.rows[0].id;
}

/**
 * Get or create default category for NARA research reports
 */
async function getOrCreateCategory(client, categoryName = 'NARA Research Reports') {
  const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const checkResult = await client.query(
    'SELECT id FROM categories WHERE slug = $1',
    [slug]
  );

  if (checkResult.rows.length > 0) {
    return checkResult.rows[0].id;
  }

  const insertResult = await client.query(
    'INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) RETURNING id',
    [categoryName, slug, 'Official research publications from the National Aquatic Resources Agency']
  );

  return insertResult.rows[0].id;
}

/**
 * Detect language from title (checks for Sinhala Unicode characters)
 */
function detectLanguage(title) {
  // Sinhala Unicode range: 0D80-0DFF
  const sinhalaPattern = /[\u0D80-\u0DFF]/;
  // Tamil Unicode range: 0B80-0BFF
  const tamilPattern = /[\u0B80-\u0BFF]/;

  if (sinhalaPattern.test(title)) return 'si';
  if (tamilPattern.test(title)) return 'ta';
  return 'en';
}

/**
 * Import a single book record
 */
async function importBook(row, categoryId) {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    // Generate accession number from book number
    const accessionNumber = `NARA-${String(row.No).padStart(5, '0')}`;

    // Check if book already exists
    const existingBook = await client.query(
      'SELECT id FROM offline_books WHERE accession_number = $1 OR title = $2',
      [accessionNumber, row.Title]
    );

    if (existingBook.rows.length > 0) {
      importStats.duplicates++;
      await client.query('ROLLBACK');
      return;
    }

    // Detect language
    const language = detectLanguage(row.Title);

    // Parse year
    const publicationYear = row.Year && row.Year.trim() ? parseInt(row.Year) : null;

    // Insert main book record
    const bookInsert = await client.query(`
      INSERT INTO offline_books (
        accession_number, title, publication_year,
        language, status, shelf_location,
        available_copies, total_copies, source
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `, [
      accessionNumber,
      row.Title,
      publicationYear,
      language,
      'available',
      'NARA Main Library',
      1,
      1,
      'NARA Research Reports Collection'
    ]);

    const bookId = bookInsert.rows[0].id;

    // Handle author
    if (row.Author) {
      const authorId = await getOrCreateAuthor(client, row.Author);
      if (authorId) {
        await client.query(`
          INSERT INTO book_authors (book_id, author_id, author_role, display_order)
          VALUES ($1, $2, $3, $4)
        `, [bookId, authorId, 'author', 0]);
      }
    }

    // Handle publisher
    if (row.Publisher) {
      const publisherId = await getOrCreatePublisher(client, row.Publisher);
      if (publisherId) {
        await client.query(`
          INSERT INTO book_publishers (book_id, publisher_id, publisher_role)
          VALUES ($1, $2, $3)
        `, [bookId, publisherId, 'publisher']);
      }
    }

    // Add to NARA Research Reports category
    await client.query(`
      INSERT INTO book_categories (book_id, category_id, is_primary)
      VALUES ($1, $2, $3)
    `, [bookId, categoryId, true]);

    await client.query('COMMIT');
    importStats.success++;

    if (importStats.success % 50 === 0) {
      console.log(`✅ Imported ${importStats.success} books...`);
    }

  } catch (error) {
    await client.query('ROLLBACK');
    importStats.failed++;
    importStats.errors.push({
      book: row.Title,
      error: error.message
    });
    console.error(`❌ Failed to import: ${row.Title}`, error.message);
  } finally {
    client.release();
  }
}

/**
 * Main import function
 */
async function importCSV(csvFilePath) {
  console.log('📚 NARA Research Reports Import (257 Books)\\n');
  console.log(`📄 Reading CSV file: ${csvFilePath}\\n`);

  if (!fs.existsSync(csvFilePath)) {
    console.error(`❌ CSV file not found: ${csvFilePath}`);
    process.exit(1);
  }

  const startTime = Date.now();

  // Get or create category
  const client = await getClient();
  const categoryId = await getOrCreateCategory(client, 'NARA Research Reports');
  client.release();
  console.log(`📁 Category created/found: NARA Research Reports (ID: ${categoryId})\\n`);

  return new Promise((resolve, reject) => {
    const books = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        books.push(row);
        importStats.total++;
      })
      .on('end', async () => {
        console.log(`📊 Found ${books.length} books in CSV file\\n`);
        console.log('⏳ Starting import...\\n');

        // Process books sequentially for reliability
        for (const book of books) {
          await importBook(book, categoryId);
        }

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log('\\n' + '='.repeat(60));
        console.log('📊 IMPORT COMPLETE!');
        console.log('='.repeat(60));
        console.log(`✅ Successfully imported: ${importStats.success} books`);
        console.log(`⏭️  Skipped (duplicates):  ${importStats.duplicates} books`);
        console.log(`❌ Failed:                ${importStats.failed} books`);
        console.log(`📈 Total processed:       ${importStats.total} books`);
        console.log(`⏱️  Duration:              ${duration} seconds`);
        console.log('='.repeat(60));

        if (importStats.errors.length > 0 && importStats.errors.length <= 20) {
          console.log('\\n⚠️  Errors encountered:');
          importStats.errors.forEach((err, index) => {
            console.log(`   ${index + 1}. ${err.book}: ${err.error}`);
          });
        }

        console.log('\\n✨ Next steps:');
        console.log('   1. Verify import: node verify-import.js');
        console.log('   2. View in database: SELECT * FROM offline_books LIMIT 10;');
        console.log('   3. Test the library API\\n');

        await pool.end();
        resolve();
      })
      .on('error', (error) => {
        console.error('❌ Error reading CSV:', error);
        reject(error);
      });
  });
}

// Get CSV file path from command line or use default
const csvFilePath = process.argv[2] || path.join(__dirname, 'NARA_Research_Reports_257.csv');

// Run import
importCSV(csvFilePath)
  .then(() => {
    console.log('✅ Import process completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Import failed:', error);
    process.exit(1);
  });
