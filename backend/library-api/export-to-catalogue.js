const { pool } = require('./config/database');
const fs = require('fs');
const path = require('path');

/**
 * Export offline library books from PostgreSQL to library_catalogue.json format
 */

async function exportToCatalogue() {
  console.log('📚 Exporting 257 NARA Offline Books to Library Catalogue\n');

  try {
    // Read current library catalogue
    const cataloguePath = path.join(__dirname, '../../public/library_catalogue.json');
    const currentCatalogue = JSON.parse(fs.readFileSync(cataloguePath, 'utf8'));

    console.log(`📖 Current catalogue has ${currentCatalogue.length} books`);

    // Get all offline books with authors and publishers
    const query = `
      SELECT
        ob.id,
        ob.accession_number,
        ob.title,
        ob.publication_year,
        ob.language,
        ob.shelf_location,
        ob.status,
        string_agg(DISTINCT a.name, ', ') as authors,
        string_agg(DISTINCT p.name, ', ') as publishers,
        string_agg(DISTINCT c.name, ', ') as categories
      FROM offline_books ob
      LEFT JOIN book_authors ba ON ob.id = ba.book_id
      LEFT JOIN authors a ON ba.author_id = a.id
      LEFT JOIN book_publishers bp ON ob.id = bp.book_id
      LEFT JOIN publishers p ON bp.publisher_id = p.id
      LEFT JOIN book_categories bc ON ob.id = bc.book_id
      LEFT JOIN categories c ON bc.category_id = c.id
      GROUP BY ob.id, ob.accession_number, ob.title, ob.publication_year,
               ob.language, ob.shelf_location, ob.status
      ORDER BY ob.id
    `;

    const result = await pool.query(query);
    console.log(`📊 Retrieved ${result.rows.length} offline books from database\n`);

    // Find the highest ID in current catalogue
    const maxId = Math.max(...currentCatalogue.map(book => parseInt(book.id) || 0));
    console.log(`🔢 Highest current ID: ${maxId}`);
    console.log(`🆕 New books will start from ID: ${maxId + 1}\n`);

    // Convert database records to catalogue format
    let newBooksAdded = 0;
    let skippedDuplicates = 0;

    result.rows.forEach((row, index) => {
      // Check if book already exists by title or accession number
      const exists = currentCatalogue.some(book =>
        book.title === row.title ||
        book.accessionNumber === row.accession_number
      );

      if (exists) {
        skippedDuplicates++;
        return;
      }

      const newBook = {
        id: String(maxId + newBooksAdded + 1),
        title: row.title,
        titleSi: row.language === 'si' ? row.title : '',
        titleTa: '',
        author: row.authors || 'National Aquatic Resources Agency',
        authorSi: row.language === 'si' ? (row.authors || 'ජාතික ජලජ සම්පත් පර්යේෂණ හා සංවර්ධන ආයතනය') : '',
        authorTa: '',
        publisher: row.publishers || 'NARA',
        publisherSi: row.language === 'si' ? (row.publishers || 'නාරා') : '',
        publisherTa: '',
        year: row.publication_year ? String(row.publication_year) : '',
        category: row.categories || 'NARA Research Reports',
        categorySi: row.language === 'si' ? 'නාරා පර්යේෂණ වාර්තා' : '',
        categoryTa: '',
        description: `${row.title} - NARA Research Publication`,
        descriptionSi: row.language === 'si' ? `${row.title} - නාරා පර්යේෂණ ප්‍රකාශනය` : '',
        descriptionTa: '',
        accessionNumber: row.accession_number,
        location: row.shelf_location || 'NARA Main Library',
        locationSi: 'නාරා ප්‍රධාන පුස්තකාලය',
        locationTa: '',
        status: row.status === 'available' ? 'Available' : 'Not Available',
        type: 'Physical',
        language: row.language === 'si' ? 'Sinhala' : row.language === 'ta' ? 'Tamil' : 'English',
        pages: '',
        isbn: '',
        deweyDecimal: '',
        subjectHeadings: [row.categories || 'Marine Research', 'NARA Publications'],
        keywords: ['NARA', 'Marine Research', 'Sri Lanka'],
        coverImage: '',
        pdfUrl: '',
        addedDate: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0]
      };

      currentCatalogue.push(newBook);
      newBooksAdded++;

      if ((newBooksAdded) % 50 === 0) {
        console.log(`✅ Added ${newBooksAdded} books...`);
      }
    });

    // Sort catalogue by ID
    currentCatalogue.sort((a, b) => parseInt(a.id) - parseInt(b.id));

    // Create backup of original catalogue
    const backupPath = path.join(__dirname, `../../public/library_catalogue.backup-${Date.now()}.json`);
    fs.writeFileSync(backupPath, JSON.stringify(currentCatalogue.slice(0, currentCatalogue.length - newBooksAdded), null, 2));
    console.log(`\n💾 Backup created: ${path.basename(backupPath)}`);

    // Write updated catalogue
    fs.writeFileSync(cataloguePath, JSON.stringify(currentCatalogue, null, 2));

    console.log('\n' + '='.repeat(60));
    console.log('✅ EXPORT COMPLETE!');
    console.log('='.repeat(60));
    console.log(`📚 Original catalogue: ${currentCatalogue.length - newBooksAdded} books`);
    console.log(`➕ New books added:    ${newBooksAdded} books`);
    console.log(`⏭️  Skipped duplicates: ${skippedDuplicates} books`);
    console.log(`📊 Total books now:    ${currentCatalogue.length} books`);
    console.log('='.repeat(60));
    console.log('\n✨ Next steps:');
    console.log('   1. Check library_catalogue.json');
    console.log('   2. Rebuild: npm run build');
    console.log('   3. Deploy: firebase deploy --only hosting');
    console.log('   4. Visit: https://nara-web-73384.web.app/library\n');

    await pool.end();
    process.exit(0);

  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  }
}

// Run export
exportToCatalogue();
