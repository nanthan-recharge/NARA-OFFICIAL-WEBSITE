/**
 * Enhanced Fish Market Data Service
 *
 * Provides realistic Sri Lankan fish market data based on research from:
 * - Department of Fisheries Sri Lanka
 * - Ceylon Fisheries Corporation
 * - Peliyagoda Fish Market trends
 * - FAO fisheries statistics
 *
 * Key Species: Skipjack Tuna, Yellowfin Tuna, Sardinella, Barracuda, Seer Fish, etc.
 * Main Markets: Peliyagoda, Negombo, Galle, Trincomalee, Jaffna
 */

// Sri Lankan Fish Species Database with realistic price ranges (LKR per kg)
const SRI_LANKAN_FISH_SPECIES = {
  // Tuna Species (Major Export Species)
  skipjack_tuna: {
    name: 'Skipjack Tuna (Balaya)',
    scientificName: 'Katsuwonus pelamis',
    category: 'Tuna',
    basePrice: 850,
    priceRange: [600, 1200],
    seasonal: { peak: [6, 7, 8, 9], low: [12, 1, 2] }, // Jun-Sep peak
    exportDemand: 'very_high',
    description: '21% of marine production, major export species'
  },
  yellowfin_tuna: {
    name: 'Yellowfin Tuna (Kelawalla)',
    scientificName: 'Thunnus albacares',
    category: 'Tuna',
    basePrice: 1200,
    priceRange: [900, 1800],
    seasonal: { peak: [5, 6, 7, 8], low: [11, 12, 1] },
    exportDemand: 'very_high',
    description: '15% of marine production, premium export species'
  },

  // Sardine/Small Pelagics (Most Consumed)
  sardinella: {
    name: 'Sardinella (Salaya)',
    scientificName: 'Sardinella longiceps',
    category: 'Small Pelagic',
    basePrice: 380,
    priceRange: [250, 550],
    seasonal: { peak: [3, 4, 5, 10, 11], low: [7, 8] },
    exportDemand: 'medium',
    description: 'Most consumed fish in Sri Lanka - 93% of population'
  },
  sprats: {
    name: 'Sprats (Halmassa)',
    scientificName: 'Spratelloides delicatulus',
    category: 'Small Pelagic',
    basePrice: 420,
    priceRange: [300, 600],
    seasonal: { peak: [4, 5, 6, 10, 11], low: [1, 2] },
    exportDemand: 'low',
    description: 'Locally consumed, dried fish production'
  },

  // Large Game Fish
  seer_fish: {
    name: 'Seer Fish (Thora)',
    scientificName: 'Scomberomorus commerson',
    category: 'Large Pelagic',
    basePrice: 1450,
    priceRange: [1100, 2000],
    seasonal: { peak: [7, 8, 9], low: [1, 2, 3] },
    exportDemand: 'high',
    description: 'Premium quality fish, high local and export demand'
  },
  barracuda: {
    name: 'Barracuda (Talapath)',
    scientificName: 'Sphyraena jello',
    category: 'Large Pelagic',
    basePrice: 680,
    priceRange: [450, 950],
    seasonal: { peak: [6, 7, 8, 9], low: [12, 1] },
    exportDemand: 'medium',
    description: 'Popular local fish with seasonal availability'
  },

  // Reef Fish
  grouper: {
    name: 'Grouper (Gurulla)',
    scientificName: 'Epinephelus spp.',
    category: 'Reef Fish',
    basePrice: 1850,
    priceRange: [1400, 2500],
    seasonal: { peak: [5, 6, 7, 8, 9], low: [11, 12, 1] },
    exportDemand: 'high',
    description: 'High-value reef fish for export markets'
  },
  red_snapper: {
    name: 'Red Snapper (Rathambala)',
    scientificName: 'Lutjanus argentimaculatus',
    category: 'Reef Fish',
    basePrice: 1620,
    priceRange: [1200, 2200],
    seasonal: { peak: [6, 7, 8], low: [12, 1, 2] },
    exportDemand: 'high',
    description: 'Premium quality, high export value'
  },

  // Shellfish & Crustaceans
  prawns_large: {
    name: 'Large Prawns (Isso)',
    scientificName: 'Penaeus monodon',
    category: 'Crustacean',
    basePrice: 2800,
    priceRange: [2200, 3800],
    seasonal: { peak: [4, 5, 6, 7, 8, 9], low: [12, 1, 2] },
    exportDemand: 'very_high',
    description: 'Top export commodity, aquaculture production'
  },
  crab: {
    name: 'Mud Crab (Kakuluwo)',
    scientificName: 'Scylla serrata',
    category: 'Crustacean',
    basePrice: 3200,
    priceRange: [2500, 4500],
    seasonal: { peak: [5, 6, 7, 8, 9, 10], low: [1, 2] },
    exportDemand: 'very_high',
    description: 'High-value export, lagoon fishery'
  },
  squid: {
    name: 'Squid (Dhello)',
    scientificName: 'Loligo duvauceli',
    category: 'Cephalopod',
    basePrice: 950,
    priceRange: [700, 1400],
    seasonal: { peak: [7, 8, 9, 10], low: [2, 3] },
    exportDemand: 'high',
    description: 'Major export species, dried and frozen'
  },

  // Other Commercial Species
  mackerel: {
    name: 'Mackerel (Kumbalawa)',
    scientificName: 'Rastrelliger kanagurta',
    category: 'Small Pelagic',
    basePrice: 520,
    priceRange: [350, 750],
    seasonal: { peak: [4, 5, 10, 11], low: [7, 8] },
    exportDemand: 'medium',
    description: 'Common local fish, canned production'
  },
  herring: {
    name: 'Herring (Salaya)',
    scientificName: 'Sardinella spp.',
    category: 'Small Pelagic',
    basePrice: 390,
    priceRange: [280, 580],
    seasonal: { peak: [3, 4, 5, 11], low: [8, 9] },
    exportDemand: 'low',
    description: 'Dried fish production, local markets'
  }
};

// Major Sri Lankan Fish Markets
const SRI_LANKAN_MARKETS = {
  peliyagoda: {
    name: 'Peliyagoda Fish Market',
    location: 'Colombo District',
    type: 'wholesale',
    tradingHours: '2:00 AM - 10:30 AM',
    description: 'Largest wholesale fish market in Sri Lanka',
    priceMultiplier: 1.0 // Base reference
  },
  negombo: {
    name: 'Negombo Fish Market',
    location: 'Negombo',
    type: 'wholesale_retail',
    tradingHours: '5:00 AM - 12:00 PM',
    description: 'Major coastal fishing hub',
    priceMultiplier: 0.95 // 5% lower (direct from boats)
  },
  galle: {
    name: 'Galle Fish Market',
    location: 'Southern Province',
    type: 'wholesale_retail',
    tradingHours: '5:00 AM - 11:00 AM',
    description: 'Southern coastal market',
    priceMultiplier: 0.98
  },
  trincomalee: {
    name: 'Trincomalee Fish Market',
    location: 'Eastern Province',
    type: 'wholesale_retail',
    tradingHours: '4:00 AM - 11:00 AM',
    description: 'Eastern deep-sea fishing port',
    priceMultiplier: 0.92 // Lower due to direct access
  },
  jaffna: {
    name: 'Jaffna Fish Market',
    location: 'Northern Province',
    type: 'wholesale_retail',
    tradingHours: '5:00 AM - 12:00 PM',
    description: 'Northern region main market',
    priceMultiplier: 1.05 // Higher transport costs
  },
  beruwala: {
    name: 'Beruwala Fish Market',
    location: 'Western Province',
    type: 'wholesale',
    tradingHours: '3:00 AM - 10:00 AM',
    description: 'Major multiday fishing harbor',
    priceMultiplier: 0.93
  }
};

/**
 * Generate realistic current price for a species at a specific market
 */
function generateCurrentPrice(speciesKey, marketKey, date = new Date()) {
  const species = SRI_LANKAN_FISH_SPECIES[speciesKey];
  const market = SRI_LANKAN_MARKETS[marketKey];

  if (!species || !market) return null;

  const currentMonth = date.getMonth() + 1;

  // Seasonal adjustment
  let seasonalMultiplier = 1.0;
  if (species.seasonal.peak.includes(currentMonth)) {
    seasonalMultiplier = 0.85; // 15% lower in peak season (more supply)
  } else if (species.seasonal.low.includes(currentMonth)) {
    seasonalMultiplier = 1.25; // 25% higher in low season (less supply)
  }

  // Market location multiplier
  const marketMultiplier = market.priceMultiplier;

  // Random daily variation (-5% to +5%)
  const dailyVariation = 0.95 + Math.random() * 0.1;

  // Calculate final price
  const basePrice = species.basePrice;
  const finalPrice = Math.round(basePrice * seasonalMultiplier * marketMultiplier * dailyVariation);

  // Ensure within realistic range
  return Math.max(species.priceRange[0], Math.min(species.priceRange[1], finalPrice));
}

/**
 * Generate historical price data for trend analysis
 */
function generateHistoricalPrices(speciesKey, marketKey, days = 90) {
  const history = [];
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const price = generateCurrentPrice(speciesKey, marketKey, date);

    history.push({
      date: date.toISOString(),
      price,
      formattedDate: date.toLocaleDateString('en-LK')
    });
  }

  return history;
}

/**
 * Calculate price trend (percentage change over period)
 */
function calculateTrend(historicalPrices, days = 7) {
  if (historicalPrices.length < days) return 0;

  const recentPrices = historicalPrices.slice(-days);
  const oldPrice = recentPrices[0].price;
  const newPrice = recentPrices[recentPrices.length - 1].price;

  const percentChange = ((newPrice - oldPrice) / oldPrice) * 100;
  return parseFloat(percentChange.toFixed(2));
}

/**
 * Get seasonal forecast for next 3 months
 */
function getSeasonalForecast(speciesKey) {
  const species = SRI_LANKAN_FISH_SPECIES[speciesKey];
  if (!species) return null;

  const currentMonth = new Date().getMonth() + 1;
  const forecast = [];

  for (let i = 0; i < 3; i++) {
    const futureMonth = ((currentMonth + i - 1) % 12) + 1;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let outlook = 'stable';
    let priceExpectation = 'normal';

    if (species.seasonal.peak.includes(futureMonth)) {
      outlook = 'high_supply';
      priceExpectation = 'lower';
    } else if (species.seasonal.low.includes(futureMonth)) {
      outlook = 'low_supply';
      priceExpectation = 'higher';
    }

    forecast.push({
      month: monthNames[futureMonth - 1],
      outlook,
      priceExpectation
    });
  }

  return forecast;
}

/**
 * Enhanced Market Data Service
 */
export const enhancedFishMarketService = {
  /**
   * Get all current market prices across all markets and species
   */
  getAllCurrentPrices: () => {
    const allPrices = [];

    Object.keys(SRI_LANKAN_FISH_SPECIES).forEach(speciesKey => {
      Object.keys(SRI_LANKAN_MARKETS).forEach(marketKey => {
        const species = SRI_LANKAN_FISH_SPECIES[speciesKey];
        const market = SRI_LANKAN_MARKETS[marketKey];
        const price = generateCurrentPrice(speciesKey, marketKey);
        const history = generateHistoricalPrices(speciesKey, marketKey, 30);
        const trend = calculateTrend(history, 7);

        allPrices.push({
          id: `${speciesKey}_${marketKey}_${Date.now()}`,
          speciesKey,
          speciesName: species.name,
          scientificName: species.scientificName,
          category: species.category,
          marketKey,
          marketName: market.name,
          marketLocation: market.location,
          currentPrice: price,
          priceUnit: 'LKR/kg',
          trend7days: trend,
          lastUpdated: new Date().toISOString(),
          exportDemand: species.exportDemand,
          description: species.description
        });
      });
    });

    return {
      success: true,
      data: allPrices,
      timestamp: new Date().toISOString(),
      dataSource: 'Enhanced Fish Market Service - Sri Lanka'
    };
  },

  /**
   * Get detailed information for a specific species
   */
  getSpeciesDetail: (speciesKey) => {
    const species = SRI_LANKAN_FISH_SPECIES[speciesKey];
    if (!species) {
      return { success: false, error: 'Species not found' };
    }

    // Get prices across all markets
    const marketPrices = Object.keys(SRI_LANKAN_MARKETS).map(marketKey => {
      const market = SRI_LANKAN_MARKETS[marketKey];
      const price = generateCurrentPrice(speciesKey, marketKey);
      const history = generateHistoricalPrices(speciesKey, marketKey, 90);
      const trend30days = calculateTrend(history, 30);

      return {
        marketKey,
        marketName: market.name,
        location: market.location,
        currentPrice: price,
        trend30days,
        historicalPrices: history
      };
    });

    const forecast = getSeasonalForecast(speciesKey);

    return {
      success: true,
      data: {
        ...species,
        speciesKey,
        marketPrices,
        seasonalForecast: forecast,
        lastUpdated: new Date().toISOString()
      }
    };
  },

  /**
   * Get market overview for a specific market
   */
  getMarketOverview: (marketKey) => {
    const market = SRI_LANKAN_MARKETS[marketKey];
    if (!market) {
      return { success: false, error: 'Market not found' };
    }

    const speciesPrices = Object.keys(SRI_LANKAN_FISH_SPECIES).map(speciesKey => {
      const species = SRI_LANKAN_FISH_SPECIES[speciesKey];
      const price = generateCurrentPrice(speciesKey, marketKey);
      const history = generateHistoricalPrices(speciesKey, marketKey, 7);
      const trend = calculateTrend(history, 7);

      return {
        speciesKey,
        speciesName: species.name,
        category: species.category,
        currentPrice: price,
        trend7days: trend,
        exportDemand: species.exportDemand
      };
    });

    return {
      success: true,
      data: {
        ...market,
        marketKey,
        species: speciesPrices,
        lastUpdated: new Date().toISOString()
      }
    };
  },

  /**
   * Get price trends for specific species over time periods
   */
  getPriceTrends: (speciesKey, marketKey, days = 90) => {
    const species = SRI_LANKAN_FISH_SPECIES[speciesKey];
    const market = SRI_LANKAN_MARKETS[marketKey];

    if (!species || !market) {
      return { success: false, error: 'Invalid species or market' };
    }

    const history = generateHistoricalPrices(speciesKey, marketKey, days);
    const trend7days = calculateTrend(history, 7);
    const trend30days = calculateTrend(history, 30);
    const trend90days = calculateTrend(history, 90);

    // Calculate average price
    const avgPrice = Math.round(
      history.reduce((sum, item) => sum + item.price, 0) / history.length
    );

    // Find min and max
    const prices = history.map(h => h.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return {
      success: true,
      data: {
        speciesKey,
        speciesName: species.name,
        marketKey,
        marketName: market.name,
        historicalPrices: history,
        statistics: {
          currentPrice: history[history.length - 1].price,
          averagePrice: avgPrice,
          minPrice,
          maxPrice,
          priceRange: maxPrice - minPrice
        },
        trends: {
          trend7days,
          trend30days,
          trend90days
        },
        lastUpdated: new Date().toISOString()
      }
    };
  },

  /**
   * Get export market intelligence
   */
  getExportIntelligence: () => {
    const topExportSpecies = Object.entries(SRI_LANKAN_FISH_SPECIES)
      .filter(([key, species]) =>
        species.exportDemand === 'very_high' || species.exportDemand === 'high'
      )
      .map(([key, species]) => {
        // Get average price across all markets
        const marketPrices = Object.keys(SRI_LANKAN_MARKETS).map(marketKey =>
          generateCurrentPrice(key, marketKey)
        );
        const avgPrice = Math.round(
          marketPrices.reduce((sum, p) => sum + p, 0) / marketPrices.length
        );

        return {
          speciesKey: key,
          speciesName: species.name,
          category: species.category,
          exportDemand: species.exportDemand,
          averagePrice: avgPrice,
          priceRange: species.priceRange,
          description: species.description
        };
      })
      .sort((a, b) => b.averagePrice - a.averagePrice);

    return {
      success: true,
      data: {
        topExportSpecies,
        totalExportSpecies: topExportSpecies.length,
        lastUpdated: new Date().toISOString()
      }
    };
  },

  /**
   * Get all species list
   */
  getAllSpecies: () => {
    return {
      success: true,
      data: Object.entries(SRI_LANKAN_FISH_SPECIES).map(([key, species]) => ({
        speciesKey: key,
        ...species
      }))
    };
  },

  /**
   * Get all markets list
   */
  getAllMarkets: () => {
    return {
      success: true,
      data: Object.entries(SRI_LANKAN_MARKETS).map(([key, market]) => ({
        marketKey: key,
        ...market
      }))
    };
  }
};

export default enhancedFishMarketService;
