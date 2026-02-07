const functions = require('firebase-functions');
const admin = require('firebase-admin');
const researchDataPool = require('./researchDataPool');

admin.initializeApp();

const db = admin.firestore();

/**
 * Cloud Function to grant admin privileges to a user
 * Call via: https://us-central1-nara-web-73384.cloudfunctions.net/makeFirstAdmin?email=user@example.com
 */
exports.makeFirstAdmin = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }

  const email = req.query.email;
  
  if (!email) {
    return res.status(400).send('❌ Error: Email parameter required. Usage: ?email=user@example.com');
  }

  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    
    // Set custom admin claim
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    
    // Return success
    res.status(200).send(`
      <html>
        <head>
          <title>Admin Created</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .card {
              background: white;
              padding: 2rem;
              border-radius: 1rem;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              max-width: 500px;
              text-align: center;
            }
            .success {
              font-size: 4rem;
              margin-bottom: 1rem;
            }
            h1 {
              color: #10b981;
              margin: 0 0 1rem 0;
            }
            p {
              color: #666;
              margin: 0.5rem 0;
            }
            .email {
              background: #f3f4f6;
              padding: 0.5rem 1rem;
              border-radius: 0.5rem;
              font-family: monospace;
              color: #1f2937;
              margin: 1rem 0;
            }
            .link {
              display: inline-block;
              margin-top: 1.5rem;
              padding: 0.75rem 1.5rem;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 0.5rem;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="success">✅</div>
            <h1>Admin Privileges Granted!</h1>
            <p>User has been granted admin access:</p>
            <div class="email">${email}</div>
            <p><strong>UID:</strong> ${user.uid}</p>
            <p style="margin-top: 1.5rem; color: #059669;">
              <strong>✨ User can now login to the admin panel!</strong>
            </p>
            <a href="https://nara-web-73384.web.app/admin/login" class="link">
              Go to Admin Login →
            </a>
          </div>
        </body>
      </html>
    `);
    
    console.log(`✅ Admin privileges granted to: ${email} (UID: ${user.uid})`);
    
  } catch (error) {
    console.error('Error granting admin privileges:', error);
    
    let errorMessage = 'Unknown error';
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'User not found. Please create the user in Firebase Authentication first.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email format.';
    } else {
      errorMessage = error.message;
    }
    
    res.status(500).send(`
      <html>
        <head>
          <title>Error</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #f87171 0%, #dc2626 100%);
            }
            .card {
              background: white;
              padding: 2rem;
              border-radius: 1rem;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              max-width: 500px;
              text-align: center;
            }
            .error {
              font-size: 4rem;
              margin-bottom: 1rem;
            }
            h1 {
              color: #dc2626;
              margin: 0 0 1rem 0;
            }
            p {
              color: #666;
              margin: 0.5rem 0;
            }
            .message {
              background: #fef2f2;
              padding: 1rem;
              border-radius: 0.5rem;
              color: #991b1b;
              margin: 1rem 0;
              border: 1px solid #fecaca;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="error">❌</div>
            <h1>Error</h1>
            <div class="message">${errorMessage}</div>
            <p><strong>Email:</strong> ${email}</p>
          </div>
        </body>
      </html>
    `);
  }
});

/**
 * 🤖 AUTOMATED DAILY RESEARCH PAPER UPLOAD
 * Runs every day at midnight (Sri Lanka Time - UTC+5:30)
 * Automatically uploads 5 random research papers from the pool
 */
exports.dailyResearchUpload = functions.pubsub
  .schedule('0 0 * * *') // Every day at midnight
  .timeZone('Asia/Colombo') // Sri Lanka timezone
  .onRun(async (context) => {
    console.log('🌊 Starting daily research paper upload...');
    
    try {
      const researchCollection = db.collection('researchContent');
      
      // Get already uploaded paper IDs to avoid duplicates
      const existingDocs = await researchCollection.get();
      const existingIds = new Set(existingDocs.docs.map(doc => doc.data().researchId || doc.id));
      
      // Filter out already uploaded papers
      const availablePapers = researchDataPool.filter(paper => !existingIds.has(paper.id));
      
      if (availablePapers.length === 0) {
        console.log('⚠️  All papers from pool have been uploaded!');
        return null;
      }
      
      // Shuffle and select 5 random papers
      const shuffled = availablePapers.sort(() => 0.5 - Math.random());
      const selectedPapers = shuffled.slice(0, Math.min(5, availablePapers.length));
      
      console.log(`📚 Uploading ${selectedPapers.length} papers...`);
      
      // Upload each paper
      const uploadPromises = selectedPapers.map(async (paper) => {
        const docData = {
          researchId: paper.id,
          title: paper.title,
          description: paper.description,
          authors: paper.authors,
          category: paper.category,
          tags: paper.tags,
          publicationDate: admin.firestore.Timestamp.fromDate(paper.publicationDate),
          language: paper.language,
          uploadedBy: 'auto_agent',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          views: Math.floor(Math.random() * 500) + 100, // Random initial views
          downloads: Math.floor(Math.random() * 100) + 20, // Random initial downloads
          bookmarks: Math.floor(Math.random() * 50) + 10, // Random initial bookmarks
          status: 'published',
          fileURL: null,
          fileName: null,
          autoUploaded: true,
          uploadDate: new Date().toISOString()
        };
        
        await researchCollection.add(docData);
        console.log(`✅ Uploaded: ${paper.title.en}`);
        return paper.title.en;
      });
      
      const uploaded = await Promise.all(uploadPromises);
      
      console.log(`🎉 Successfully uploaded ${uploaded.length} papers:`);
      uploaded.forEach((title, i) => console.log(`  ${i + 1}. ${title}`));
      
      // Log to a tracking collection
      await db.collection('researchUploadLogs').add({
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        papersUploaded: uploaded.length,
        paperTitles: uploaded,
        totalInPool: researchDataPool.length,
        remainingInPool: availablePapers.length - selectedPapers.length
      });
      
      return null;
      
    } catch (error) {
      console.error('❌ Error in daily upload:', error);
      
      // Log error to Firestore
      await db.collection('researchUploadLogs').add({
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        error: error.message,
        stack: error.stack,
        status: 'failed'
      });
      
      throw error;
    }
  });

/**
 * Manual trigger for testing the auto-upload
 * Call via: https://us-central1-nara-web-73384.cloudfunctions.net/manualResearchUpload
 */
exports.manualResearchUpload = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  
  console.log('🚀 Manual research upload triggered...');
  
  try {
    const researchCollection = db.collection('researchContent');
    
    // Get already uploaded paper IDs
    const existingDocs = await researchCollection.get();
    const existingIds = new Set(existingDocs.docs.map(doc => doc.data().researchId || doc.id));
    
    // Filter available papers
    const availablePapers = researchDataPool.filter(paper => !existingIds.has(paper.id));
    
    if (availablePapers.length === 0) {
      return res.status(200).send(`
        <html>
          <head><title>All Papers Uploaded</title></head>
          <body style="font-family: sans-serif; padding: 2rem; text-align: center;">
            <h1>⚠️ All Papers Already Uploaded</h1>
            <p>All ${researchDataPool.length} papers from the pool have been uploaded!</p>
            <p>Total papers in database: ${existingDocs.size}</p>
          </body>
        </html>
      `);
    }
    
    // Select 5 random papers
    const shuffled = availablePapers.sort(() => 0.5 - Math.random());
    const selectedPapers = shuffled.slice(0, Math.min(5, availablePapers.length));
    
    // Upload papers
    const uploadedTitles = [];
    for (const paper of selectedPapers) {
      const docData = {
        researchId: paper.id,
        title: paper.title,
        description: paper.description,
        authors: paper.authors,
        category: paper.category,
        tags: paper.tags,
        publicationDate: admin.firestore.Timestamp.fromDate(paper.publicationDate),
        language: paper.language,
        uploadedBy: 'manual_admin',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        views: Math.floor(Math.random() * 500) + 100,
        downloads: Math.floor(Math.random() * 100) + 20,
        bookmarks: Math.floor(Math.random() * 50) + 10,
        status: 'published',
        fileURL: null,
        fileName: null,
        manualUpload: true,
        uploadDate: new Date().toISOString()
      };
      
      await researchCollection.add(docData);
      uploadedTitles.push(paper.title.en);
    }
    
    // Log the upload
    await db.collection('researchUploadLogs').add({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      papersUploaded: uploadedTitles.length,
      paperTitles: uploadedTitles,
      trigger: 'manual',
      totalInPool: researchDataPool.length,
      remainingInPool: availablePapers.length - selectedPapers.length
    });
    
    res.status(200).send(`
      <html>
        <head>
          <title>Research Upload Success</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
              padding: 2rem;
              max-width: 800px;
              margin: 0 auto;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
            }
            .card {
              background: white;
              padding: 2rem;
              border-radius: 1rem;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            h1 { color: #10b981; margin-top: 0; }
            .paper-list {
              background: #f3f4f6;
              padding: 1rem;
              border-radius: 0.5rem;
              margin: 1rem 0;
            }
            .paper-item {
              padding: 0.5rem;
              border-bottom: 1px solid #e5e7eb;
            }
            .stats {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 1rem;
              margin-top: 1.5rem;
            }
            .stat {
              background: #eff6ff;
              padding: 1rem;
              border-radius: 0.5rem;
              text-align: center;
            }
            .stat-number {
              font-size: 2rem;
              font-weight: bold;
              color: #1d4ed8;
            }
            .stat-label {
              font-size: 0.875rem;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>✅ Research Papers Uploaded Successfully!</h1>
            <p><strong>${uploadedTitles.length} papers</strong> have been added to the Research Excellence Portal:</p>
            
            <div class="paper-list">
              ${uploadedTitles.map((title, i) => `
                <div class="paper-item">
                  <strong>${i + 1}.</strong> ${title}
                </div>
              `).join('')}
            </div>
            
            <div class="stats">
              <div class="stat">
                <div class="stat-number">${uploadedTitles.length}</div>
                <div class="stat-label">Just Uploaded</div>
              </div>
              <div class="stat">
                <div class="stat-number">${existingDocs.size + uploadedTitles.length}</div>
                <div class="stat-label">Total in Database</div>
              </div>
              <div class="stat">
                <div class="stat-number">${availablePapers.length - selectedPapers.length}</div>
                <div class="stat-label">Remaining in Pool</div>
              </div>
            </div>
            
            <div style="margin-top: 2rem; text-align: center;">
              <a href="https://nara-web-73384.web.app/research-excellence-portal" 
                 style="display: inline-block; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 0.5rem; font-weight: 600;">
                View Research Portal →
              </a>
            </div>
          </div>
        </body>
      </html>
    `);
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).send(`
      <html>
        <head><title>Error</title></head>
        <body style="font-family: sans-serif; padding: 2rem; text-align: center;">
          <h1 style="color: #dc2626;">❌ Error</h1>
          <p>${error.message}</p>
        </body>
      </html>
    `);
  }
});
