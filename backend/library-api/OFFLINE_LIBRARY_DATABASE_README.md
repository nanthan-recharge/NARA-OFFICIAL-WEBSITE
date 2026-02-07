# NARA Offline Library Database System

Complete database setup for the NARA offline library with 4,687+ books.

## 📋 Database Structure

The system includes **15 tables** with full relational structure:

### Main Tables
- **offline_books** - Main book records (33+ fields)
- **authors** - Book authors/contributors
- **publishers** - Publishing companies
- **categories** - Subject categories

### Junction Tables (Many-to-Many Relationships)
- **book_authors** - Links books to authors
- **book_categories** - Links books to categories
- **book_publishers** - Links books to publishers
- **book_tags** - Flexible tagging system

### Supporting Tables
- **book_copies** - Individual physical copies
- **book_reviews** - User ratings and reviews
- **checkout_history** - Borrowing records
- **reservations** - Book reservations
- **book_series** - Book series/collections
- **book_series_items** - Books in series
- **tags** - Tag definitions
- **activity_log** - All system activities

## 🚀 Setup Instructions

### Step 1: Install Dependencies

```bash
cd backend/library-api
npm install csv-parser
```

### Step 2: Configure Database

Edit `.env` file in the backend folder:

```env
# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nara_library
DB_USER=postgres
DB_PASSWORD=your_password_here
```

### Step 3: Create Database

```bash
# Using psql
createdb nara_library

# Or via PostgreSQL client
psql -U postgres
CREATE DATABASE nara_library;
\q
```

### Step 4: Run Migration (Create Tables)

```bash
cd backend/library-api/migrations
node run-offline-library-migration.js
```

This will create:
- ✅ 15 database tables
- ✅ All indexes for fast searching
- ✅ Triggers for auto-updates
- ✅ Views for common queries
- ✅ Full-text search support

### Step 5: Import Your CSV Data

Place your CSV file in the `backend/library-api` folder, then run:

```bash
cd backend/library-api

# If your file is named NARA_Library_Complete_Catalog.csv
node import-offline-library-csv.js

# Or specify a custom file path
node import-offline-library-csv.js /path/to/your/library_data.csv
```

**Import Features:**
- Processes 10 books concurrently for speed
- Auto-creates authors, publishers, categories
- Handles duplicates gracefully
- Shows progress every 100 books
- Complete error reporting

**Expected Time:**
- 1,000 books: ~5 minutes
- 4,687 books: ~15-20 minutes

## 📊 CSV File Format

Your CSV should have these 33 columns:

```csv
biblionumber,title,subtitle,author_primary,authors_contributors,publication_place,publisher,publication_year,physical_description,isbn,series,series_volume,subjects,ddc_classification,call_number,item_type,location,collection,shelf_location,barcode,availability_status,loan_type,number_of_copies,language,notes,summary,contents,online_resources,lists,tags,date_added,rating,url_detail_page
```

**Example Row:**
```csv
"BK1234","Marine Biology Fundamentals","An Introduction","John Smith","John Smith; Jane Doe","Colombo","NARA Press","2023","250p. 24cm","978-1234567890","Marine Science Series","Vol. 1","Marine Biology;Oceanography;Research","574.92","QH91.S65 2023","Book","NARA Main Library","Sri Lanka Collection","Shelf A-12","3912000001234","Available","For loan","2","English","New arrival","Comprehensive guide to marine biology...","Chapter 1: Introduction; Chapter 2: Ocean Life...","http://nara.gov.lk/book/1234","New Arrivals;Featured","marine;biology;ocean","2024-01-15","4.5","http://koha.nara.gov.lk/cgi-bin/koha/opac-detail.pl?biblionumber=1234"
```

## 🔍 Verifying the Import

Create a verification script:

```javascript
// backend/library-api/verify-import.js
const { pool } = require('./config/database');

async function verifyImport() {
  try {
    // Check total books
    const books = await pool.query('SELECT COUNT(*) FROM offline_books');
    console.log(`📚 Total Books: ${books.rows[0].count}`);

    // Check authors
    const authors = await pool.query('SELECT COUNT(*) FROM authors');
    console.log(`✍️  Total Authors: ${authors.rows[0].count}`);

    // Check categories
    const categories = await pool.query('SELECT COUNT(*) FROM categories');
    console.log(`📁 Total Categories: ${categories.rows[0].count}`);

    // Check publishers
    const publishers = await pool.query('SELECT COUNT(*) FROM publishers');
    console.log(`🏢 Total Publishers: ${publishers.rows[0].count}`);

    // Sample books
    const sample = await pool.query(`
      SELECT b.title, a.name as author, c.name as category
      FROM offline_books b
      LEFT JOIN book_authors ba ON b.id = ba.book_id
      LEFT JOIN authors a ON ba.author_id = a.id
      LEFT JOIN book_categories bc ON b.id = bc.book_id
      LEFT JOIN categories c ON bc.category_id = c.id
      LIMIT 5
    `);

    console.log('\n📖 Sample Books:');
    sample.rows.forEach((book, i) => {
      console.log(`   ${i + 1}. ${book.title} by ${book.author || 'Unknown'} [${book.category || 'Uncategorized'}]`);
    });

    await pool.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

verifyImport();
```

Run verification:
```bash
node verify-import.js
```

## 📡 Using the Database in Your App

### Example: Get All Books with Full Details

```javascript
const { pool } = require('./config/database');

async function getAllBooks() {
  const result = await pool.query(`
    SELECT * FROM books_complete_view
    WHERE is_archived = FALSE
    ORDER BY created_at DESC
    LIMIT 50
  `);

  return result.rows;
}
```

### Example: Search Books

```javascript
async function searchBooks(searchTerm) {
  const result = await pool.query(`
    SELECT b.*, ts_rank(b.search_vector, query) AS rank
    FROM offline_books b,
         to_tsquery('english', $1) query
    WHERE b.search_vector @@ query
    ORDER BY rank DESC
    LIMIT 20
  `, [searchTerm.replace(/\s+/g, ' & ')]);

  return result.rows;
}
```

### Example: Get Books by Category

```javascript
async function getBooksByCategory(categorySlug) {
  const result = await pool.query(`
    SELECT b.*, c.name as category_name
    FROM offline_books b
    JOIN book_categories bc ON b.id = bc.book_id
    JOIN categories c ON bc.category_id = c.id
    WHERE c.slug = $1 AND b.is_archived = FALSE
    ORDER BY b.title
  `, [categorySlug]);

  return result.rows;
}
```

### Example: Get Popular Books

```javascript
async function getPopularBooks(limit = 10) {
  const result = await pool.query(`
    SELECT * FROM popular_books_view
    LIMIT $1
  `, [limit]);

  return result.rows;
}
```

## 🎯 API Endpoints to Create

Recommended endpoints for your library system:

```javascript
// GET /api/library/books - List all books with pagination
// GET /api/library/books/:id - Get single book details
// GET /api/library/books/search?q=marine - Search books
// GET /api/library/categories - List all categories
// GET /api/library/categories/:slug/books - Books in category
// GET /api/library/authors - List all authors
// GET /api/library/authors/:id/books - Books by author
// GET /api/library/popular - Popular/trending books
// GET /api/library/new-arrivals - Recently added books
// GET /api/library/featured - Featured books
// POST /api/library/books/:id/checkout - Checkout a book
// POST /api/library/books/:id/return - Return a book
// POST /api/library/books/:id/reserve - Reserve a book
// POST /api/library/books/:id/review - Add review/rating
```

## 🔒 Database Backup

Always backup your data:

```bash
# Backup entire database
pg_dump -U postgres nara_library > nara_library_backup.sql

# Backup only offline library tables
pg_dump -U postgres -t offline_books -t authors -t publishers -t categories nara_library > offline_library_backup.sql

# Restore from backup
psql -U postgres nara_library < nara_library_backup.sql
```

## 📈 Performance Tips

1. **Indexes are already created** for common queries
2. **Use the views** (`books_complete_view`, `popular_books_view`) for optimized queries
3. **Full-text search** is enabled on books (title, description, keywords)
4. **Connection pooling** is configured (max 20 connections)

## 🐛 Troubleshooting

### Import fails with "column does not exist"
- Check your CSV column names match exactly
- Ensure no extra spaces in column headers

### "relation does not exist" error
- Run the migration first: `node run-offline-library-migration.js`

### Slow imports
- Check PostgreSQL is running
- Increase `max_connections` in postgresql.conf if needed
- Run `VACUUM ANALYZE offline_books` after large imports

### Duplicate books
- The import script skips duplicates based on `accession_number` and `barcode`
- Check import stats for number of duplicates skipped

## 📞 Support

Database schema created for NARA offline library system.
All tables, relationships, and indexes are optimized for performance.

**Database Features:**
✅ Multi-language support (English, Sinhala, Tamil)
✅ Full-text search
✅ Advanced categorization
✅ Checkout/return tracking
✅ Review and rating system
✅ Activity logging
✅ Automated triggers
✅ Optimized indexes

Ready to import your 4,687+ books! 🚀
