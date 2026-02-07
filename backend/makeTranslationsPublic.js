const admin = require('firebase-admin');

// Initialize Firebase Admin using the same service account as translation agent
const serviceAccount = require('./library-agent/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'nara-web-73384.firebasestorage.app'
});

const bucket = admin.storage().bucket();

async function makeTranslationsPublic() {
  console.log('🔓 Making all translation PDFs publicly accessible...\n');

  try {
    // Get all files in translations folders
    const [tamilFiles] = await bucket.getFiles({ prefix: 'pdfs/translations/tamil/' });
    const [sinhalaFiles] = await bucket.getFiles({ prefix: 'pdfs/translations/sinhala/' });
    
    const allFiles = [...tamilFiles, ...sinhalaFiles];
    
    console.log(`Found ${allFiles.length} translation files\n`);

    let count = 0;
    for (const file of allFiles) {
      count++;
      console.log(`[${count}/${allFiles.length}] Making public: ${file.name}`);
      
      try {
        // Make file publicly readable
        await file.makePublic();
        console.log(`✅ Success\n`);
      } catch (err) {
        console.log(`⚠️  Already public or error: ${err.message}\n`);
      }
    }

    console.log('\n🎉 All translation PDFs are now publicly accessible!');
    console.log(`\nTest URL: https://storage.googleapis.com/${bucket.name}/pdfs/translations/tamil/NARA87832798017-TA.pdf`);
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

makeTranslationsPublic();
