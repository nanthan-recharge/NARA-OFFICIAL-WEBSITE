const admin = require('firebase-admin');
const serviceAccount = require('./library-agent/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'nara-web-73384.firebasestorage.app'
});

const bucket = admin.storage().bucket();

async function listFiles() {
  console.log('📁 Listing all files in storage...\n');

  const [files] = await bucket.getFiles();
  
  const translationFiles = files.filter(f => 
    f.name.includes('translation') || 
    f.name.includes('TA.pdf') || 
    f.name.includes('SI.pdf')
  );

  console.log(`Found ${translationFiles.length} translation files:\n`);
  
  translationFiles.forEach(file => {
    console.log(`- ${file.name}`);
  });

  process.exit(0);
}

listFiles();
