const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

async function exportToJson() {
  try {
    console.log('📊 Exporting library catalogue from database...');

    const result = await pool.query(`
      SELECT
        br.id,
        br.title,
        br.subtitle,
        br.author,
        br.additional_authors,
        br.isbn,
        br.issn,
        br.publication_year,
        br.publisher,
        br.edition,
        br.pages,
        br.language,
        br.material_type_id,
        mt.code as material_type_code,
        mt.name as material_type_name,
        br.subject_headings,
        br.keywords,
        br.abstract,
        br.call_number,
        br.location,
        br.shelf_location,
        br.barcode,
        br.acquisition_date,
        br.url,
        br.qr_code_url,
        br.download_source,
        br.source_url,
        br.file_hash,
        br.page_count,
        br.status,
        br.created_at,
        br.updated_at
      FROM bibliographic_records br
      LEFT JOIN material_types mt ON br.material_type_id = mt.id
      ORDER BY br.id ASC
    `);

    console.log(`📚 Found ${result.rows.length} books`);

    const jsonData = JSON.stringify(result.rows, null, 2);
    const outputPath = '/tmp/library_catalogue.json';

    fs.writeFileSync(outputPath, jsonData);

    console.log(`✅ Exported ${result.rows.length} books to ${outputPath}`);
    console.log(`📦 File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  }
}

exportToJson();
