/**
 * Real Fish Market Data Service
 * Fetches REAL scraped data from Firestore
 */

import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Fetch all current fish market prices from Firestore
 */
export const getRealMarketPrices = async () => {
  try {
    const pricesRef = collection(db, 'fish_market_prices');
    const snapshot = await getDocs(pricesRef);

    const prices = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      prices.push({
        id: doc.id,
        speciesKey: data.species?.toLowerCase().replace(/\s+/g, '_') || doc.id,
        speciesName: data.species || 'Unknown',
        scientificName: data.scientific_name || '',
        category: data.category || 'Fish',
        marketKey: data.market?.toLowerCase().replace(/\s+/g, '_') || 'unknown',
        marketName: data.market || 'Unknown Market',
        marketLocation: data.market || '',
        currentPrice: parseFloat(data.price) || 0,
        priceUnit: data.unit || 'LKR/kg',
        trend7days: 0, // Can be calculated from historical data
        lastUpdated: data.timestamp || new Date().toISOString(),
        exportDemand: data.export_demand || 'medium',
        description: data.description || '',
        source: data.source || 'Unknown',
        dataType: data.data_type || 'current'
      });
    });

    return {
      success: true,
      data: prices,
      timestamp: new Date().toISOString(),
      dataSource: 'Firestore - Real Scraped Data',
      count: prices.length
    };
  } catch (error) {
    console.error('Error fetching real market prices:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

/**
 * Get scraper metadata (last run info)
 */
export const getScraperMetadata = async () => {
  try {
    const metaRef = collection(db, 'scraper_metadata');
    const snapshot = await getDocs(metaRef);

    let metadata = null;
    snapshot.forEach((doc) => {
      if (doc.id === 'latest_run') {
        metadata = {
          ...doc.data(),
          id: doc.id
        };
      }
    });

    return {
      success: true,
      data: metadata
    };
  } catch (error) {
    console.error('Error fetching scraper metadata:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get prices by species
 */
export const getPricesBySpecies = async (speciesName) => {
  try {
    const pricesRef = collection(db, 'fish_market_prices');
    const snapshot = await getDocs(pricesRef);

    const prices = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.species?.toLowerCase().includes(speciesName.toLowerCase())) {
        prices.push({
          id: doc.id,
          ...data,
          price: parseFloat(data.price) || 0
        });
      }
    });

    return {
      success: true,
      data: prices
    };
  } catch (error) {
    console.error('Error fetching prices by species:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

/**
 * Get prices by market
 */
export const getPricesByMarket = async (marketName) => {
  try {
    const pricesRef = collection(db, 'fish_market_prices');
    const snapshot = await getDocs(pricesRef);

    const prices = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.market?.toLowerCase().includes(marketName.toLowerCase())) {
        prices.push({
          id: doc.id,
          ...data,
          price: parseFloat(data.price) || 0
        });
      }
    });

    return {
      success: true,
      data: prices
    };
  } catch (error) {
    console.error('Error fetching prices by market:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

/**
 * Get unique species list
 */
export const getAllSpecies = async () => {
  try {
    const pricesRef = collection(db, 'fish_market_prices');
    const snapshot = await getDocs(pricesRef);

    const speciesSet = new Set();
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.species) {
        speciesSet.add(data.species);
      }
    });

    const species = Array.from(speciesSet).map(name => ({
      speciesKey: name.toLowerCase().replace(/\s+/g, '_'),
      name: name,
      category: 'Fish' // Can be enhanced with categorization
    }));

    return {
      success: true,
      data: species
    };
  } catch (error) {
    console.error('Error fetching species list:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

/**
 * Get unique markets list
 */
export const getAllMarkets = async () => {
  try {
    const pricesRef = collection(db, 'fish_market_prices');
    const snapshot = await getDocs(pricesRef);

    const marketsSet = new Set();
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.market) {
        marketsSet.add(data.market);
      }
    });

    const markets = Array.from(marketsSet).map(name => ({
      marketKey: name.toLowerCase().replace(/\s+/g, '_'),
      name: name,
      location: name,
      type: 'wholesale' // Can be enhanced
    }));

    return {
      success: true,
      data: markets
    };
  } catch (error) {
    console.error('Error fetching markets list:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

export default {
  getRealMarketPrices,
  getScraperMetadata,
  getPricesBySpecies,
  getPricesByMarket,
  getAllSpecies,
  getAllMarkets
};
