#!/usr/bin/env node

/**
 * Merge MCP-fetched catalogue with main NARA catalogue
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateMetadataHash, generateBarcode, logger } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MCP_CATALOGUE_PATH = path.resolve(__dirname, '../public/library_catalogue.json');
const MAIN_CATALOGUE_PATH = path.resolve(__dirname, '../../public/library_catalogue.json');

async function loadJSON(filepath) {
  try {
    const data = await fs.readFile(filepath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`File not found: ${filepath}`);
      return [];
    }
    throw error;
  }
}

async function saveJSON(filepath, data) {
  // Create backup first
  try {
    const backupPath = filepath.replace('.json', `.backup-${Date.now()}.json`);
    await fs.copyFile(filepath, backupPath);
    console.log(`Created backup: ${backupPath}`);
  } catch {
    // No backup needed if file doesn't exist
  }

  await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8');
}

function isDuplicate(item, existingItems, hashIndex) {
  // Check by metadata hash
  const hash = generateMetadataHash(item);
  if (hashIndex.has(hash)) return true;

  // Check by title similarity
  const itemTitle = (item.title || '').toLowerCase().trim();
  for (const existing of existingItems) {
    const existingTitle = (existing.title || '').toLowerCase().trim();
    if (itemTitle === existingTitle) return true;
  }

  return false;
}

async function mergeCatalogues() {
  console.log('\n🔄 Merging MCP catalogue with main NARA catalogue...\n');

  // Load both catalogues
  const mcpCatalogue = await loadJSON(MCP_CATALOGUE_PATH);
  const mainCatalogue = await loadJSON(MAIN_CATALOGUE_PATH);

  console.log(`📂 MCP Catalogue: ${mcpCatalogue.length} items`);
  console.log(`📂 Main Catalogue: ${mainCatalogue.length} items`);

  // Build hash index from main catalogue
  const hashIndex = new Map();
  for (const item of mainCatalogue) {
    const hash = generateMetadataHash(item);
    hashIndex.set(hash, item.id);
  }

  // Get next ID
  const maxId = Math.max(
    ...mainCatalogue.map(item => typeof item.id === 'number' ? item.id : parseInt(item.id) || 0),
    0
  );
  let nextId = maxId + 1;

  // Merge new items
  const addedItems = [];
  const skippedItems = [];

  for (const item of mcpCatalogue) {
    if (isDuplicate(item, mainCatalogue, hashIndex)) {
      skippedItems.push(item.title);
      continue;
    }

    // Assign new ID
    const newItem = {
      ...item,
      id: nextId++
    };

    addedItems.push(newItem);
    mainCatalogue.push(newItem);

    // Update hash index
    const hash = generateMetadataHash(newItem);
    hashIndex.set(hash, newItem.id);
  }

  // Save merged catalogue
  await saveJSON(MAIN_CATALOGUE_PATH, mainCatalogue);

  console.log('\n========================================');
  console.log('✅ MERGE COMPLETE');
  console.log('========================================');
  console.log(`   New items added: ${addedItems.length}`);
  console.log(`   Duplicates skipped: ${skippedItems.length}`);
  console.log(`   Total catalogue items: ${mainCatalogue.length}`);
  console.log('========================================\n');

  // Print some sample added items
  if (addedItems.length > 0) {
    console.log('📚 Sample of newly added books:');
    addedItems.slice(0, 5).forEach((item, i) => {
      console.log(`   ${i + 1}. ${item.title} (${item.download_source})`);
    });
    if (addedItems.length > 5) {
      console.log(`   ... and ${addedItems.length - 5} more`);
    }
  }

  return {
    added: addedItems.length,
    skipped: skippedItems.length,
    total: mainCatalogue.length
  };
}

// Run
mergeCatalogues().catch(console.error);
