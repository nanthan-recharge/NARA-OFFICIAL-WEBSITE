#!/usr/bin/env node

/**
 * NARA Library Book Fetcher
 * Fetches ocean science books from multiple open sources
 */

import { fetchOceanScienceBooks as fetchFromOpenLibrary } from './sources/openLibrary.js';
import { fetchOceanScienceMaterials as fetchFromInternetArchive } from './sources/internetArchive.js';
import { fetchOceanScienceWorks as fetchFromOpenAlex } from './sources/openAlex.js';
import { fetchOceanScienceBooks as fetchFromDOAB } from './sources/doab.js';
import { loadCatalogue, saveCatalogue, mergeCatalogue, getCatalogueStats } from './catalogueUpdater.js';
import { logger } from './utils.js';

/**
 * Fetch from all sources
 */
async function fetchFromAllSources() {
  logger.info('========================================');
  logger.info('NARA Library MCP Agent - Book Fetcher');
  logger.info('========================================');
  logger.info('Starting to fetch ocean science publications...\n');

  const results = {
    sources: {},
    totalFetched: 0,
    errors: []
  };

  // Fetch from Open Library
  try {
    logger.info('📚 Fetching from Open Library...');
    const openLibraryBooks = await fetchFromOpenLibrary();
    results.sources.openLibrary = openLibraryBooks;
    results.totalFetched += openLibraryBooks.length;
    logger.success(`Open Library: ${openLibraryBooks.length} books fetched`);
  } catch (error) {
    logger.error('Open Library fetch failed:', error.message);
    results.errors.push({ source: 'OpenLibrary', error: error.message });
    results.sources.openLibrary = [];
  }

  // Fetch from Internet Archive
  try {
    logger.info('\n📖 Fetching from Internet Archive...');
    const archiveItems = await fetchFromInternetArchive();
    results.sources.internetArchive = archiveItems;
    results.totalFetched += archiveItems.length;
    logger.success(`Internet Archive: ${archiveItems.length} items fetched`);
  } catch (error) {
    logger.error('Internet Archive fetch failed:', error.message);
    results.errors.push({ source: 'InternetArchive', error: error.message });
    results.sources.internetArchive = [];
  }

  // Fetch from OpenAlex
  try {
    logger.info('\n🔬 Fetching from OpenAlex...');
    const openAlexWorks = await fetchFromOpenAlex();
    results.sources.openAlex = openAlexWorks;
    results.totalFetched += openAlexWorks.length;
    logger.success(`OpenAlex: ${openAlexWorks.length} works fetched`);
  } catch (error) {
    logger.error('OpenAlex fetch failed:', error.message);
    results.errors.push({ source: 'OpenAlex', error: error.message });
    results.sources.openAlex = [];
  }

  // Fetch from DOAB
  try {
    logger.info('\n📕 Fetching from DOAB...');
    const doabBooks = await fetchFromDOAB();
    results.sources.doab = doabBooks;
    results.totalFetched += doabBooks.length;
    logger.success(`DOAB: ${doabBooks.length} books fetched`);
  } catch (error) {
    logger.error('DOAB fetch failed:', error.message);
    results.errors.push({ source: 'DOAB', error: error.message });
    results.sources.doab = [];
  }

  logger.info('\n========================================');
  logger.info(`Total items fetched: ${results.totalFetched}`);
  logger.info('========================================\n');

  return results;
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('\n🌊 NARA Ocean Science Library Agent 🌊\n');

    // Load existing catalogue
    const existingCatalogue = await loadCatalogue();
    console.log(`📂 Current catalogue has ${existingCatalogue.length} items\n`);

    // Fetch new items
    const fetchResults = await fetchFromAllSources();

    // Combine all fetched items
    const allNewItems = [
      ...fetchResults.sources.openLibrary,
      ...fetchResults.sources.internetArchive,
      ...fetchResults.sources.openAlex,
      ...fetchResults.sources.doab
    ];

    console.log(`\n📥 Total new items to process: ${allNewItems.length}`);

    // Merge with existing catalogue
    const mergeResult = await mergeCatalogue(existingCatalogue, allNewItems);

    // Save updated catalogue
    await saveCatalogue(mergeResult.catalogue);

    // Print statistics
    const stats = getCatalogueStats(mergeResult.catalogue);

    console.log('\n========================================');
    console.log('📊 CATALOGUE STATISTICS');
    console.log('========================================');
    console.log(`Total items: ${stats.total}`);
    console.log(`Open access: ${stats.openAccess}`);
    console.log(`With PDF: ${stats.withPdf}`);
    console.log('\nBy Material Type:');
    Object.entries(stats.byMaterialType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
    console.log('\nBy Source:');
    Object.entries(stats.bySource).forEach(([source, count]) => {
      console.log(`  ${source}: ${count}`);
    });
    console.log('========================================\n');

    // Summary
    console.log('✅ SUMMARY');
    console.log(`   New items added: ${mergeResult.added.length}`);
    console.log(`   Duplicates skipped: ${mergeResult.skipped.length}`);
    console.log(`   Total catalogue items: ${mergeResult.catalogue.length}`);

    if (fetchResults.errors.length > 0) {
      console.log('\n⚠️ ERRORS:');
      fetchResults.errors.forEach(err => {
        console.log(`   ${err.source}: ${err.error}`);
      });
    }

    console.log('\n🎉 Catalogue update complete!\n');

    return {
      success: true,
      added: mergeResult.added.length,
      skipped: mergeResult.skipped.length,
      total: mergeResult.catalogue.length,
      stats
    };
  } catch (error) {
    logger.error('Fatal error:', error);
    console.error('\n❌ Catalogue update failed:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
main();

export { fetchFromAllSources, main };
