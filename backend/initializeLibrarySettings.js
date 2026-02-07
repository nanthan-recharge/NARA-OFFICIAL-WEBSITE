const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = require('./library-agent/serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'nara-web-73384.firebasestorage.app'
  });
}

const db = admin.firestore();

async function initializeLibrarySettings() {
  console.log('🔧 Initializing Library Settings...\n');

  const settings = {
    setting_id: 'library_settings',
    loan_period_days: 14,
    max_renewals: 2,
    renewal_period_days: 14,
    max_books_per_member: 5,
    reservation_expiry_days: 7,
    overdue_fine_per_day: 10, // LKR
    damage_fine: 500, // LKR
    lost_book_fine: 2000, // LKR
    membership_validity_days: 365,
    operating_hours: {
      monday: '09:00-17:00',
      tuesday: '09:00-17:00',
      wednesday: '09:00-17:00',
      thursday: '09:00-17:00',
      friday: '09:00-17:00',
      saturday: '09:00-13:00',
      sunday: 'Closed'
    },
    contact_info: {
      phone: '+94-11-2694184',
      email: 'library@nara.ac.lk',
      address: 'National Aquatic Resources Research and Development Agency (NARA), Crow Island, Colombo 15, Sri Lanka'
    },
    updated_at: admin.firestore.FieldValue.serverTimestamp(),
    created_at: admin.firestore.FieldValue.serverTimestamp()
  };

  try {
    await db.collection('library_settings').doc('library_settings').set(settings);
    console.log('✅ Library settings initialized successfully!');
    console.log('\nSettings:');
    console.log(`  - Loan Period: ${settings.loan_period_days} days`);
    console.log(`  - Max Renewals: ${settings.max_renewals}`);
    console.log(`  - Max Books Per Member: ${settings.max_books_per_member}`);
    console.log(`  - Reservation Expiry: ${settings.reservation_expiry_days} days`);
    console.log(`  - Overdue Fine: LKR ${settings.overdue_fine_per_day}/day`);
    console.log(`  - Damage Fine: LKR ${settings.damage_fine}`);
    console.log(`  - Lost Book Fine: LKR ${settings.lost_book_fine}`);
    console.log(`  - Membership Validity: ${settings.membership_validity_days} days\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing library settings:', error);
    process.exit(1);
  }
}

initializeLibrarySettings();
