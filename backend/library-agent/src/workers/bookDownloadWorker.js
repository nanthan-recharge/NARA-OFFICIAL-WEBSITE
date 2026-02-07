const { Worker, QueueEvents } = require('bullmq');
const connection = require('../config/redis');
const config = require('../config');
const logger = require('../config/logger');
const apiService = require('../services/apiService');
const downloadService = require('../services/downloadService');
const storageService = require('../services/storageService');
const bookService = require('../services/bookService');
const qrService = require('../services/qrService');
const BarcodeGenerator = require('../utils/barcodeGenerator');

// Worker processor function
async function processBookDownload(job) {
  const { category, book, index } = job.data;

  logger.info(`Processing job ${job.id}: ${book.title} (${category})`);
  
  try {
    // Update progress: Started
    await job.updateProgress(10);

    // Check if book already exists
    const exists = await bookService.exists(book.title, book.author);
    if (exists) {
      logger.info(`Book already exists: ${book.title}`);
      return { skipped: true, reason: 'duplicate' };
    }

    await job.updateProgress(20);

    // Generate unique barcode
    const barcode = await BarcodeGenerator.generateUnique();
    logger.info(`Generated barcode: ${barcode}`);

    await job.updateProgress(25);

    // Download PDF
    const { buffer, validation } = await downloadService.downloadAndValidate(book.downloadUrl);
    await job.updateProgress(50);

    // Generate storage path
    const storagePath = storageService.generatePath(barcode, category, book.title);

    // Upload to Firebase
    await storageService.uploadPDF(buffer, storagePath);
    await job.updateProgress(65);

    // Generate signed URL
    const signedUrl = await storageService.generateSignedUrl(storagePath);
    await job.updateProgress(70);

    // Generate and upload QR code
    const qrResult = await qrService.generateAndUpload(barcode);
    await job.updateProgress(80);

    // Get material type ID
    const materialTypeId = await bookService.getMaterialTypeId(category);
    await job.updateProgress(85);

    // Save to database
    const bookData = {
      barcode,
      title: book.title,
      subtitle: null,
      author: book.author,
      additional_authors: null,
      isbn: book.isbn || null,
      issn: null,
      publisher: book.source,
      publication_year: book.year || null,
      edition: null,
      pages: validation.metadata.pages,
      language: 'English',
      material_type_id: materialTypeId,
      subject_headings: null,
      keywords: null,
      abstract: book.abstract || null,
      call_number: null,
      location: 'Main Library',
      shelf_location: 'Digital Collection',
      total_copies: 1,
      available_copies: 1,
      cover_image_url: null,
      notes: `Auto-downloaded by NARA Library Agent from ${book.source}`,
      acquisition_date: new Date(),
      price: null,
      status: 'available',
      url: signedUrl,
      download_source: book.source,
      source_url: book.sourceUrl,
      file_hash: validation.hash,
      page_count: validation.metadata.pages,
      qr_code_url: qrResult.url
    };

    await bookService.createBook(bookData);
    await job.updateProgress(100);

    logger.info(`✓ Successfully processed: ${book.title}`);

    return {
      success: true,
      barcode,
      title: book.title,
      category,
      size: buffer.length,
      pages: validation.metadata.pages
    };

  } catch (error) {
    logger.error(`✗ Failed to process ${book.title}:`, error.message);
    throw error;
  }
}

// Create worker
const worker = new Worker('bookDownloads', processBookDownload, {
  connection,
  concurrency: config.worker.concurrency,
  limiter: {
    max: 10, // Max 10 jobs
    duration: 1000 // per second
  }
});

// Event handlers
worker.on('completed', (job, result) => {
  if (result.skipped) {
    logger.info(`Job ${job.id} skipped: ${result.reason}`);
  } else {
    logger.info(`Job ${job.id} completed: ${result.title}`);
  }
});

worker.on('failed', (job, error) => {
  logger.error(`Job ${job.id} failed after ${job.attemptsMade} attempts: ${error.message}`);
});

worker.on('progress', (job, progress) => {
  logger.debug(`Job ${job.id}: ${progress}% complete`);
});

worker.on('error', (error) => {
  logger.error('Worker error:', error);
});

// Queue events for monitoring
const queueEvents = new QueueEvents('bookDownloads', { connection });

let completedCount = 0;
let failedCount = 0;

queueEvents.on('completed', ({ jobId }) => {
  completedCount++;
});

queueEvents.on('failed', ({ jobId }) => {
  failedCount++;
});

// Log statistics every 30 seconds
setInterval(() => {
  logger.info('Worker statistics:', {
    completed: completedCount,
    failed: failedCount
  });
}, 30000);

module.exports = { worker, queueEvents };

