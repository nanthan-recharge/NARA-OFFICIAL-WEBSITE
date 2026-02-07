import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Seed Sample Export Market Price Data
 * Run this to add realistic fish export prices to Firebase
 */
export const seedExportMarketPrices = async () => {
  const samplePrices = [
    // Yellowfin Tuna
    { species: 'Yellowfin Tuna', market: 'Japan', price: 15.50, grade: 'Grade A', recordDate: new Date() },
    { species: 'Yellowfin Tuna', market: 'USA', price: 12.30, grade: 'Grade A', recordDate: new Date() },
    { species: 'Yellowfin Tuna', market: 'EU', price: 14.20, grade: 'Grade A', recordDate: new Date() },
    { species: 'Yellowfin Tuna', market: 'Japan', price: 11.80, grade: 'Grade B', recordDate: new Date() },
    { species: 'Yellowfin Tuna', market: 'Thailand', price: 10.50, grade: 'Grade B', recordDate: new Date() },
    
    // Skipjack Tuna
    { species: 'Skipjack Tuna', market: 'Thailand', price: 8.50, grade: 'Grade A', recordDate: new Date() },
    { species: 'Skipjack Tuna', market: 'Philippines', price: 7.80, grade: 'Grade A', recordDate: new Date() },
    { species: 'Skipjack Tuna', market: 'Japan', price: 9.20, grade: 'Grade A', recordDate: new Date() },
    { species: 'Skipjack Tuna', market: 'Maldives', price: 6.50, grade: 'Grade B', recordDate: new Date() },
    
    // Bigeye Tuna
    { species: 'Bigeye Tuna', market: 'Japan', price: 18.50, grade: 'Grade A', recordDate: new Date() },
    { species: 'Bigeye Tuna', market: 'USA', price: 16.20, grade: 'Grade A', recordDate: new Date() },
    { species: 'Bigeye Tuna', market: 'EU', price: 17.80, grade: 'Grade A', recordDate: new Date() },
    { species: 'Bigeye Tuna', market: 'South Korea', price: 15.50, grade: 'Grade B', recordDate: new Date() },
    
    // Swordfish
    { species: 'Swordfish', market: 'USA', price: 14.50, grade: 'Grade A', recordDate: new Date() },
    { species: 'Swordfish', market: 'EU', price: 13.80, grade: 'Grade A', recordDate: new Date() },
    { species: 'Swordfish', market: 'Japan', price: 16.20, grade: 'Grade A', recordDate: new Date() },
    { species: 'Swordfish', market: 'Australia', price: 12.50, grade: 'Grade B', recordDate: new Date() },
    
    // Albacore Tuna
    { species: 'Albacore Tuna', market: 'USA', price: 11.50, grade: 'Grade A', recordDate: new Date() },
    { species: 'Albacore Tuna', market: 'EU', price: 10.80, grade: 'Grade A', recordDate: new Date() },
    { species: 'Albacore Tuna', market: 'Canada', price: 9.50, grade: 'Grade B', recordDate: new Date() },
    
    // Barramundi
    { species: 'Barramundi', market: 'Singapore', price: 13.50, grade: 'Grade A', recordDate: new Date() },
    { species: 'Barramundi', market: 'USA', price: 14.20, grade: 'Grade A', recordDate: new Date() },
    { species: 'Barramundi', market: 'Australia', price: 12.80, grade: 'Grade B', recordDate: new Date() },
    
    // King Mackerel
    { species: 'King Mackerel', market: 'Japan', price: 9.50, grade: 'Grade A', recordDate: new Date() },
    { species: 'King Mackerel', market: 'South Korea', price: 8.80, grade: 'Grade A', recordDate: new Date() },
    { species: 'King Mackerel', market: 'China', price: 7.50, grade: 'Grade B', recordDate: new Date() },
    
    // Mahi Mahi
    { species: 'Mahi Mahi', market: 'USA', price: 12.50, grade: 'Grade A', recordDate: new Date() },
    { species: 'Mahi Mahi', market: 'EU', price: 11.80, grade: 'Grade A', recordDate: new Date() },
    { species: 'Mahi Mahi', market: 'Mexico', price: 9.50, grade: 'Grade B', recordDate: new Date() },
    
    // Prawns
    { species: 'Tiger Prawns', market: 'Japan', price: 22.50, grade: 'Grade A', recordDate: new Date() },
    { species: 'Tiger Prawns', market: 'USA', price: 20.80, grade: 'Grade A', recordDate: new Date() },
    { species: 'Tiger Prawns', market: 'EU', price: 21.50, grade: 'Grade A', recordDate: new Date() },
    { species: 'Tiger Prawns', market: 'China', price: 18.50, grade: 'Grade B', recordDate: new Date() },
    
    // Cuttlefish
    { species: 'Cuttlefish', market: 'EU', price: 8.50, grade: 'Grade A', recordDate: new Date() },
    { species: 'Cuttlefish', market: 'Japan', price: 9.20, grade: 'Grade A', recordDate: new Date() },
    { species: 'Cuttlefish', market: 'China', price: 6.80, grade: 'Grade B', recordDate: new Date() },
    
    // Squid
    { species: 'Squid', market: 'Japan', price: 7.50, grade: 'Grade A', recordDate: new Date() },
    { species: 'Squid', market: 'South Korea', price: 6.80, grade: 'Grade A', recordDate: new Date() },
    { species: 'Squid', market: 'China', price: 5.50, grade: 'Grade B', recordDate: new Date() },
    
    // Crab
    { species: 'Blue Swimming Crab', market: 'USA', price: 16.50, grade: 'Grade A', recordDate: new Date() },
    { species: 'Blue Swimming Crab', market: 'EU', price: 15.80, grade: 'Grade A', recordDate: new Date() },
    { species: 'Blue Swimming Crab', market: 'Singapore', price: 14.50, grade: 'Grade B', recordDate: new Date() },
    
    // Lobster
    { species: 'Rock Lobster', market: 'USA', price: 35.50, grade: 'Grade A', recordDate: new Date() },
    { species: 'Rock Lobster', market: 'EU', price: 38.20, grade: 'Grade A', recordDate: new Date() },
    { species: 'Rock Lobster', market: 'Japan', price: 42.50, grade: 'Grade A', recordDate: new Date() },
    { species: 'Rock Lobster', market: 'China', price: 32.50, grade: 'Grade B', recordDate: new Date() }
  ];

  try {
    console.log('Starting to seed export market prices...');
    
    const promises = samplePrices.map(price => 
      addDoc(collection(db, 'export_market_prices'), {
        ...price,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    );

    await Promise.all(promises);
    
    console.log(`✅ Successfully seeded ${samplePrices.length} export market prices!`);
    return { success: true, count: samplePrices.length };
  } catch (error) {
    console.error('❌ Error seeding export market prices:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Seed Export Opportunities
 */
export const seedExportOpportunities = async () => {
  const opportunities = [
    {
      title: 'Fresh Tuna Export to Tokyo Fish Market',
      targetMarket: 'Japan',
      description: 'High demand for premium grade yellowfin and bigeye tuna. Weekly shipments needed.',
      requirements: [
        'Grade A quality certification',
        'Flash-frozen within 4 hours',
        'HACCP compliance',
        'Minimum 500kg per shipment'
      ],
      estimatedValue: 50000,
      status: 'active',
      postedDate: new Date(),
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
    },
    {
      title: 'Sustainable Seafood Program - EU Markets',
      targetMarket: 'European Union',
      description: 'MSC-certified sustainable fish for premium European retailers.',
      requirements: [
        'MSC certification required',
        'Full traceability documentation',
        'Monthly shipments of 2-5 tons',
        'Direct supplier contract'
      ],
      estimatedValue: 120000,
      status: 'active',
      postedDate: new Date(),
      expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Premium Prawns for US Restaurant Chains',
      targetMarket: 'USA',
      description: 'Upscale restaurant chain seeks reliable supplier of tiger prawns.',
      requirements: [
        'Size: 16-20 count per pound',
        'IQF (Individually Quick Frozen)',
        'FDA approved facility',
        'Weekly deliveries of 1000kg'
      ],
      estimatedValue: 80000,
      status: 'active',
      postedDate: new Date(),
      expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Canned Tuna for Middle East Distribution',
      targetMarket: 'UAE',
      description: 'Large distributor seeks skipjack tuna for canning operations.',
      requirements: [
        'Whole round or loin form',
        'Minimum 10 tons per month',
        'Halal certification',
        'Competitive pricing'
      ],
      estimatedValue: 45000,
      status: 'active',
      postedDate: new Date(),
      expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000)
    }
  ];

  try {
    console.log('Starting to seed export opportunities...');
    
    const promises = opportunities.map(opp => 
      addDoc(collection(db, 'export_opportunities'), {
        ...opp,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    );

    await Promise.all(promises);
    
    console.log(`✅ Successfully seeded ${opportunities.length} export opportunities!`);
    return { success: true, count: opportunities.length };
  } catch (error) {
    console.error('❌ Error seeding opportunities:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Seed all export market data at once
 */
export const seedAllExportMarketData = async () => {
  console.log('🌊 Starting to seed all export market data...\n');
  
  const pricesResult = await seedExportMarketPrices();
  const oppsResult = await seedExportOpportunities();
  
  const totalCount = (pricesResult.count || 0) + (oppsResult.count || 0);
  
  console.log(`\n🎉 Seeding complete! Added ${totalCount} records to Firebase.`);
  console.log('📊 Visit http://localhost:4028/export-market-intelligence to see the data!\n');
  
  return {
    success: pricesResult.success && oppsResult.success,
    prices: pricesResult.count || 0,
    opportunities: oppsResult.count || 0,
    total: totalCount
  };
};
