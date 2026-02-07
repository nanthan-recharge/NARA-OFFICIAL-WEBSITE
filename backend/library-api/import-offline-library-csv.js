const { pool, getClient } = require('./config/database');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

/**
 * Import NARA offline library data from CSV file
 * Handles the 33-column structure from your scraper
 */

let importStats = {
  total: 0,
  success: 0,
  failed: 0,
  duplicates: 0,
  errors: []
};

/**
 * Parse authors from semicolon-separated string
 */
function parseAuthors(authorsString) {
  if (!authorsString) return [];
  return authorsString
    .split(';')
    .map(a => a.trim())
    .filter(a => a.length > 0);
}

/**
 * Parse subjects from semicolon-separated string
 */
function parseSubjects(subjectsString) {
  if (!subjectsString) return [];
  return subjectsString
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

/**
 * Get or create author
 */
async function getOrCreateAuthor(client, authorName) {
  if (!authorName) return null;

  // Check if author exists
  const checkResult = await client.query(
    'SELECT id FROM authors WHERE name = $1',
    [authorName]
  );

  if (checkResult.rows.length > 0) {
    return checkResult.rows[0].id;
  }

  // Create new author
  const insertResult = await client.query(
    'INSERT INTO authors (name) VALUES ($1) RETURNING id',
    [authorName]
  );

  return insertResult.rows[0].id;
}

/**
 * Get or create category
 */
async function getOrCreateCategory(client, subject) {
  if (!subject) return null;

  const slug = subject.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  // Check if category exists
  const checkResult = await client.query(
    'SELECT id FROM categories WHERE slug = $1',
    [slug]
  );

  if (checkResult.rows.length > 0) {
    return checkResult.rows[0].id;
  }

  // Create new category
  const insertResult = await client.query(
    'INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING id',
    [subject, slug]
  );

  return insertResult.rows[0].id;
}

/**
 * Get or create publisher
 */
async function getOrCreatePublisher(client, publisherName) {
  if (!publisherName) return null;

  // Check if publisher exists
  const checkResult = await client.query(
    'SELECT id FROM publishers WHERE name = $1',
    [publisherName]
  );

  if (checkResult.rows.length > 0) {
    return checkResult.rows[0].id;
  }

  // Create new publisher
  const insertResult = await client.query(
    'INSERT INTO publishers (name) VALUES ($1) RETURNING id',
    [publisherName]
  );

  return insertResult.rows[0].id;
}

/**
 * Import a single book record
 */
async function importBook(row) {
  const client = await getClient();

  try {
    await client.query('BEGIN');

    // Check if book already exists
    const existingBook = await client.query(
      'SELECT id FROM offline_books WHERE accession_number = $1 OR barcode = $2',
      [row.biblionumber, row.barcode]
    );

    if (existingBook.rows.length > 0) {
      importStats.duplicates++;
      await client.query('ROLLBACK');
      return;
    }

    // Parse physical description for pages
    let pages = null;
    if (row.physical_description) {
      const pagesMatch = row.physical_description.match(/(\d+)\s*p/i);
      if (pagesMatch) {
        pages = parseInt(pagesMatch[1]);
      }
    }

    // Insert main book record
    const bookInsert = await client.query(`
      INSERT INTO offline_books (
        accession_number, barcode, title, subtitle,
        isbn, publication_year, pages, physical_description,
        description, language, call_number, dewey_decimal,
        status, location, shelf_location,
        available_copies, total_copies,
        notes, source
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING id
    `, [
      row.biblionumber,
      row.barcode,
      row.title,
      row.subtitle || null,
      row.isbn || null,
      row.publication_year ? parseInt(row.publication_year) : null,
      pages,
      row.physical_description || null,
      row.summary || row.notes || null,
      row.language || 'en',
      row.call_number || null,
      row.ddc_classification || null,
      row.availability_status === 'Available' ? 'available' : 'checked_out',
      row.location || 'NARA Main Library',
      row.shelf_location || null,
      row.number_of_copies ? parseInt(row.number_of_copies) : 1,
      row.number_of_copies ? parseInt(row.number_of_copies) : 1,
      row.notes || null,
      'Koha Library System'
    ]);

    const bookId = bookInsert.rows[0].id;

    // Handle authors
    const authors = parseAuthors(row.authors_contributors || row.author_primary);
    for (let i = 0; i < authors.length; i++) {
      const authorId = await getOrCreateAuthor(client, authors[i]);
      if (authorId) {
        await client.query(`
          INSERT INTO book_authors (book_id, author_id, author_role, display_order)
          VALUES ($1, $2, $3, $4)
        `, [bookId, authorId, 'author', i]);
      }
    }

    // Handle categories/subjects
    const subjects = parseSubjects(row.subjects);
    for (let i = 0; i < subjects.length; i++) {
      const categoryId = await getOrCreateCategory(client, subjects[i]);
      if (categoryId) {
        await client.query(`
          INSERT INTO book_categories (book_id, category_id, is_primary)
          VALUES ($1, $2, $3)
        `, [bookId, categoryId, i === 0]);
      }
    }

    // Handle publisher
    if (row.publisher) {
      const publisherId = await getOrCreatePublisher(client, row.publisher);
      if (publisherId) {
        await client.query(`
          INSERT INTO book_publishers (book_id, publisher_id, publisher_role)
          VALUES ($1, $2, $3)
        `, [bookId, publisherId, 'publisher']);
      }
    }

    // Handle series
    if (row.series) {
      const seriesCheck = await client.query(
        'SELECT id FROM book_series WHERE name = $1',
        [row.series]
      );

      let seriesId;
      if (seriesCheck.rows.length > 0) {
        seriesId = seriesCheck.rows[0].id;
      } else {
        const seriesInsert = await client.query(
          'INSERT INTO book_series (name) VALUES ($1) RETURNING id',
          [row.series]
        );
        seriesId = seriesInsert.rows[0].id;
      }

      await client.query(`
        INSERT INTO book_series_items (series_id, book_id, volume_number, volume_title)
        VALUES ($1, $2, $3, $4)
      `, [seriesId, bookId, row.series_volume || null, row.title]);
    }

    // Handle tags
    if (row.tags) {
      const tags = row.tags.split(';').map(t => t.trim()).filter(t => t);
      for (const tagName of tags) {
        const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        const tagCheck = await client.query(
          'SELECT id FROM tags WHERE slug = $1',
          [slug]
        );

        let tagId;
        if (tagCheck.rows.length > 0) {
          tagId = tagCheck.rows[0].id;
        } else {
          const tagInsert = await client.query(
            'INSERT INTO tags (name, slug) VALUES ($1, $2) RETURNING id',
            [tagName, slug]
          );
          tagId = tagInsert.rows[0].id;
        }

        await client.query(
          'INSERT INTO book_tags (book_id, tag_id) VALUES ($1, $2)',
          [bookId, tagId]
        );
      }
    }

    await client.query('COMMIT');
    importStats.success++;

    if (importStats.success % 100 === 0) {
      console.log(`✅ Imported ${importStats.success} books...`);
    }

  } catch (error) {
    await client.query('ROLLBACK');
    importStats.failed++;
    importStats.errors.push({
      book: row.title,
      error: error.message
    });
    console.error(`❌ Failed to import: ${row.title}`, error.message);
  } finally {
    client.release();
  }
}

/**
 * Main import function
 */
async function importCSV(csvFilePath) {
  console.log('📚 NARA Offline Library CSV Import\n');
  console.log(`📄 Reading CSV file: ${csvFilePath}\n`);

  if (!fs.existsSync(csvFilePath)) {
    console.error(`❌ CSV file not found: ${csvFilePath}`);
    process.exit(1);
  }

  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const books = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        books.push(row);
        importStats.total++;
      })
      .on('end', async () => {
        console.log(`📊 Found ${books.length} books in CSV file\n`);
        console.log('⏳ Starting import...\n');

        // Process books in batches
        const batchSize = 10; // Process 10 books concurrently
        for (let i = 0; i < books.length; i += batchSize) {
          const batch = books.slice(i, i + batchSize);
          await Promise.all(batch.map(book => importBook(book)));
        }

        const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(2);

        console.log('\n' + '='.repeat(60));
        console.log('📊 IMPORT COMPLETE!');
        console.log('='.repeat(60));
        console.log(`✅ Successfully imported: ${importStats.success} books`);
        console.log(`⏭️  Skipped (duplicates):  ${importStats.duplicates} books`);
        console.log(`❌ Failed:                ${importStats.failed} books`);
        console.log(`📈 Total processed:       ${importStats.total} books`);
        console.log(`⏱️  Duration:              ${duration} minutes`);
        console.log('='.repeat(60));

        if (importStats.errors.length > 0 && importStats.errors.length <= 10) {
          console.log('\n⚠️  Errors encountered:');
          importStats.errors.forEach((err, index) => {
            console.log(`   ${index + 1}. ${err.book}: ${err.error}`);
          });
        }

        console.log('\n✨ Next steps:');
        console.log('   1. Verify import: node verify-import.js');
        console.log('   2. Start the API server: npm start');
        console.log('   3. Test the library system\n');

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
const csvFilePath = process.argv[2] || path.join(__dirname, 'NARA_Library_Complete_Catalog.csv');

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
