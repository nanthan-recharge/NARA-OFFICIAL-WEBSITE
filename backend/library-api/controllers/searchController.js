const { query } = require('../config/database');

exports.searchCatalogue = async (req, res) => {
  const { q, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  if (!q || q.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Search query is required'
    });
  }

  const searchQuery = q.trim();

  const result = await query(
    `SELECT br.*, mt.name as material_type_name,
            ts_rank(search_vector, plainto_tsquery('english', $1)) as rank
     FROM bibliographic_records br
     LEFT JOIN material_types mt ON br.material_type_id = mt.id
     WHERE search_vector @@ plainto_tsquery('english', $1)
     ORDER BY rank DESC, br.title
     LIMIT $2 OFFSET $3`,
    [searchQuery, limit, offset]
  );

  const countResult = await query(
    `SELECT COUNT(*) FROM bibliographic_records
     WHERE search_vector @@ plainto_tsquery('english', $1)`,
    [searchQuery]
  );

  res.json({
    success: true,
    data: result.rows,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(countResult.rows[0].count),
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    }
  });
};

exports.advancedSearch = async (req, res) => {
  const {
    title, author, isbn, issn, publisher, subject, keyword,
    material_type_id, year_from, year_to, language,
    page = 1, limit = 20
  } = req.body;

  const offset = (page - 1) * limit;
  let whereConditions = [];
  let params = [];
  let paramIndex = 1;

  if (title) {
    whereConditions.push(`title ILIKE $${paramIndex++}`);
    params.push(`%${title}%`);
  }
  if (author) {
    whereConditions.push(`author ILIKE $${paramIndex++}`);
    params.push(`%${author}%`);
  }
  if (isbn) {
    whereConditions.push(`isbn = $${paramIndex++}`);
    params.push(isbn);
  }
  if (issn) {
    whereConditions.push(`issn = $${paramIndex++}`);
    params.push(issn);
  }
  if (publisher) {
    whereConditions.push(`publisher ILIKE $${paramIndex++}`);
    params.push(`%${publisher}%`);
  }
  if (subject) {
    whereConditions.push(`$${paramIndex++} = ANY(subject_headings)`);
    params.push(subject);
  }
  if (keyword) {
    whereConditions.push(`$${paramIndex++} = ANY(keywords)`);
    params.push(keyword);
  }
  if (material_type_id) {
    whereConditions.push(`material_type_id = $${paramIndex++}`);
    params.push(material_type_id);
  }
  if (year_from) {
    whereConditions.push(`publication_year >= $${paramIndex++}`);
    params.push(year_from);
  }
  if (year_to) {
    whereConditions.push(`publication_year <= $${paramIndex++}`);
    params.push(year_to);
  }
  if (language) {
    whereConditions.push(`language = $${paramIndex++}`);
    params.push(language);
  }

  if (whereConditions.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'At least one search criterion is required'
    });
  }

  const whereClause = 'WHERE ' + whereConditions.join(' AND ');

  params.push(limit, offset);

  const result = await query(
    `SELECT br.*, mt.name as material_type_name
     FROM bibliographic_records br
     LEFT JOIN material_types mt ON br.material_type_id = mt.id
     ${whereClause}
     ORDER BY br.title
     LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
    params
  );

  const countResult = await query(
    `SELECT COUNT(*) FROM bibliographic_records ${whereClause}`,
    params.slice(0, -2)
  );

  res.json({
    success: true,
    data: result.rows,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(countResult.rows[0].count),
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    }
  });
};

exports.getFacets = async (req, res) => {
  const [materialTypes, years, languages] = await Promise.all([
    query(`SELECT mt.id, mt.name, COUNT(br.id) as count
           FROM material_types mt
           LEFT JOIN bibliographic_records br ON mt.id = br.material_type_id
           GROUP BY mt.id, mt.name
           ORDER BY count DESC`),
    query(`SELECT publication_year, COUNT(*) as count
           FROM bibliographic_records
           WHERE publication_year IS NOT NULL
           GROUP BY publication_year
           ORDER BY publication_year DESC
           LIMIT 50`),
    query(`SELECT language, COUNT(*) as count
           FROM bibliographic_records
           WHERE language IS NOT NULL
           GROUP BY language
           ORDER BY count DESC`)
  ]);

  res.json({
    success: true,
    data: {
      material_types: materialTypes.rows,
      years: years.rows,
      languages: languages.rows
    }
  });
};

exports.getSuggestions = async (req, res) => {
  const { q, limit = 10 } = req.query;

  if (!q || q.trim().length < 2) {
    return res.json({ success: true, data: [] });
  }

  const result = await query(
    `SELECT DISTINCT title FROM bibliographic_records
     WHERE title ILIKE $1
     ORDER BY title
     LIMIT $2`,
    [`${q}%`, limit]
  );

  res.json({
    success: true,
    data: result.rows.map(row => row.title)
  });
};

exports.getPopularItems = async (req, res) => {
  const { limit = 10 } = req.query;

  const result = await query(
    `SELECT br.*, mt.name as material_type_name, COUNT(ct.id) as checkout_count
     FROM bibliographic_records br
     LEFT JOIN material_types mt ON br.material_type_id = mt.id
     LEFT JOIN circulation_transactions ct ON br.id = ct.item_id
     WHERE ct.checkout_date >= CURRENT_DATE - INTERVAL '90 days'
     GROUP BY br.id, mt.name
     ORDER BY checkout_count DESC
     LIMIT $1`,
    [limit]
  );

  res.json({
    success: true,
    data: result.rows
  });
};

exports.getNewArrivals = async (req, res) => {
  const { limit = 20 } = req.query;

  const result = await query(
    `SELECT br.*, mt.name as material_type_name
     FROM bibliographic_records br
     LEFT JOIN material_types mt ON br.material_type_id = mt.id
     WHERE br.acquisition_date >= CURRENT_DATE - INTERVAL '30 days'
     ORDER BY br.acquisition_date DESC
     LIMIT $1`,
    [limit]
  );

  res.json({
    success: true,
    data: result.rows
  });
};

exports.getRelatedItems = async (req, res) => {
  const { itemId } = req.params;
  const { limit = 5 } = req.query;

  const itemResult = await query(
    'SELECT author, subject_headings, keywords FROM bibliographic_records WHERE id = $1',
    [itemId]
  );

  if (itemResult.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Item not found'
    });
  }

  const item = itemResult.rows[0];

  const result = await query(
    `SELECT br.*, mt.name as material_type_name
     FROM bibliographic_records br
     LEFT JOIN material_types mt ON br.material_type_id = mt.id
     WHERE br.id != $1
     AND (
       br.author ILIKE $2
       OR br.subject_headings && $3
       OR br.keywords && $4
     )
     ORDER BY RANDOM()
     LIMIT $5`,
    [itemId, `%${item.author}%`, item.subject_headings || [], item.keywords || [], limit]
  );

  res.json({
    success: true,
    data: result.rows
  });
};

