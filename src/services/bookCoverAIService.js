/**
 * AI Book Cover Generation Service
 * Free AI-powered book cover creation using Pollinations.ai
 * No API key required - completely free service
 */

/**
 * Generate book cover image URL using Pollinations.ai
 * @param {string} title - Book title
 * @param {string} author - Book author
 * @param {string} materialType - Material type (EBOOK, LBOOK, etc.)
 * @param {object} options - Additional options
 * @returns {Promise<object>} - Generated image URL and metadata
 */
export const generateBookCoverImage = async (title, author = '', materialType = 'BOOK', options = {}) => {
  try {
    // Create a professional book cover prompt
    const prompt = createBookCoverPrompt(title, author, materialType, options);

    // Pollinations.ai free API endpoint
    // No API key required, completely free
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=1200&nologo=true&enhance=true`;

    return {
      success: true,
      imageUrl,
      prompt,
      metadata: {
        title,
        author,
        materialType,
        timestamp: new Date().toISOString(),
        service: 'pollinations.ai',
        free: true
      }
    };
  } catch (error) {
    console.error('Error generating book cover:', error);
    return {
      success: false,
      error: error.message,
      imageUrl: null
    };
  }
};

/**
 * Create optimized prompt for book cover generation
 * @param {string} title - Book title
 * @param {string} author - Book author
 * @param {string} materialType - Material type
 * @param {object} options - Additional options
 * @returns {string} - Optimized prompt
 */
const createBookCoverPrompt = (title, author, materialType, options = {}) => {
  const {
    subject = '',
    year = '',
    language = 'English'
  } = options;

  // Determine cover style based on material type
  const styleMap = {
    'EBOOK': 'modern digital book cover',
    'LBOOK': 'classic library book cover',
    'THESIS': 'academic thesis book cover with university style',
    'RNARA': 'scientific research report cover with marine theme',
    'RPAPER': 'academic research paper cover',
    'JR': 'professional journal cover',
    'RBOOK': 'reference book cover with scholarly design',
    'PREF': 'premium reference book cover',
    'SLBOOK': 'Sri Lankan collection book cover with cultural elements',
    'WFISH': 'marine biology book cover with ocean theme',
    'THESIS': 'graduate thesis cover with academic styling',
    'PROC': 'conference proceedings cover',
    'MAP': 'cartographic map cover with nautical theme',
    'DMAP': 'digital map book cover with modern GIS style',
    'BOBP': 'technical fisheries report cover',
    'FAO': 'FAO publication style cover',
    'IOC': 'oceanographic commission report cover',
    'IWMI': 'water management institute publication cover',
    'ACT': 'legal document cover with formal design',
    'NEWS': 'newspaper archive cover',
    'EJART': 'digital journal article cover',
    'EREP': 'electronic report cover with tech theme',
    'CD': 'multimedia CD cover design',
    'ATC': 'archival collection cover with vintage style',
    'UACOL': 'special collection book cover with prestigious design',
    'SLREP': 'Sri Lankan government report cover',
    'SREF': 'special reference book cover with premium quality'
  };

  const coverStyle = styleMap[materialType] || 'professional book cover';

  // Create comprehensive prompt
  let prompt = `Create a professional ${coverStyle} design for a book titled "${title}"`;

  if (author) {
    prompt += ` by ${author}`;
  }

  if (subject) {
    prompt += `, about ${subject}`;
  }

  // Add style specifications
  prompt += `. Design requirements:
    - Clean, professional book cover layout
    - Title prominently displayed in elegant typography
    ${author ? `- Author name "${author}" clearly visible` : ''}
    - Suitable imagery related to: ${subject || title}
    - Marine science, oceanography, or fisheries theme if relevant
    - Sri Lankan context where applicable
    - Modern, high-quality design
    - No watermarks or logos
    - Portrait orientation (800x1200)
    - Colors: professional blues, teals, and ocean colors for marine topics
    ${materialType.includes('NARA') || materialType.includes('RNARA') ? '- Include subtle NARA branding colors (cyan/blue)' : ''}
    - Typography: clean, readable font for title
    - Premium, library-quality appearance
  `;

  return prompt;
};

/**
 * Generate book covers for multiple books in bulk
 * @param {Array} books - Array of book objects with title, author, material_type
 * @param {function} progressCallback - Optional callback for progress updates
 * @returns {Promise<Array>} - Array of results
 */
export const generateBulkBookCovers = async (books, progressCallback = null) => {
  const results = [];
  const total = books.length;

  for (let i = 0; i < books.length; i++) {
    const book = books[i];

    try {
      const result = await generateBookCoverImage(
        book.title,
        book.author,
        book.material_type_code || book.material_type || 'BOOK',
        {
          subject: book.subject_headings?.[0] || book.keywords?.[0] || '',
          year: book.publication_year,
          language: book.language
        }
      );

      results.push({
        id: book.id,
        title: book.title,
        ...result
      });

      // Call progress callback if provided
      if (progressCallback) {
        progressCallback({
          current: i + 1,
          total,
          percentage: Math.round(((i + 1) / total) * 100),
          currentBook: book.title
        });
      }

      // Small delay to avoid rate limiting (though Pollinations is very generous)
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Error generating cover for "${book.title}":`, error);
      results.push({
        id: book.id,
        title: book.title,
        success: false,
        error: error.message
      });
    }
  }

  return results;
};

/**
 * Get preview of book cover without generating
 * Useful for showing users what prompt will be used
 * @param {string} title - Book title
 * @param {string} author - Book author
 * @param {string} materialType - Material type
 * @returns {object} - Prompt and preview info
 */
export const getBookCoverPreview = (title, author, materialType) => {
  const prompt = createBookCoverPrompt(title, author, materialType);

  return {
    prompt,
    estimatedTime: '2-5 seconds',
    free: true,
    service: 'Pollinations.ai',
    dimensions: '800x1200',
    format: 'JPEG'
  };
};

/**
 * Filter books that need covers
 * @param {Array} books - Array of all books
 * @returns {Array} - Books without cover images
 */
export const getBooksWithoutCovers = (books) => {
  return books.filter(book =>
    !book.cover_image_url ||
    book.cover_image_url === '' ||
    book.cover_image_url === null
  );
};

/**
 * Alternative free AI image generation services
 * In case Pollinations.ai is unavailable
 */
export const ALTERNATIVE_AI_SERVICES = {
  pollinations: {
    name: 'Pollinations.ai',
    endpoint: 'https://image.pollinations.ai/prompt/',
    free: true,
    apiKeyRequired: false,
    format: (prompt) => `${encodeURIComponent(prompt)}?width=800&height=1200&nologo=true`
  },
  craiyon: {
    name: 'Craiyon (formerly DALL-E mini)',
    free: true,
    apiKeyRequired: false,
    note: 'Requires separate API integration'
  },
  huggingface: {
    name: 'HuggingFace Stable Diffusion',
    free: true,
    apiKeyRequired: true,
    note: 'Free tier available with API key'
  }
};

export default {
  generateBookCoverImage,
  generateBulkBookCovers,
  getBookCoverPreview,
  getBooksWithoutCovers,
  ALTERNATIVE_AI_SERVICES
};
