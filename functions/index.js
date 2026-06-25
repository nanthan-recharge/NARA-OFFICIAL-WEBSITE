const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');
const researchDataPool = require('./researchDataPool');

admin.initializeApp();

const db = admin.firestore();

const ADMIN_BOOTSTRAP_ALLOWED_DOMAINS = ['nara.gov.lk', 'gov.lk'];
const ADMIN_BOOTSTRAP_ROLES = ['system_admin', 'director_general'];

function getBootstrapSecret() {
  return process.env.ADMIN_BOOTSTRAP_TOKEN || functions.config()?.admin?.bootstrap_token;
}

function safeTokenEqual(provided, expected) {
  if (!provided || !expected) return false;
  const providedBuffer = Buffer.from(String(provided));
  const expectedBuffer = Buffer.from(String(expected));
  return providedBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(providedBuffer, expectedBuffer);
}

function isAllowedAdminEmail(email) {
  const domain = String(email || '').split('@')[1]?.toLowerCase();
  return ADMIN_BOOTSTRAP_ALLOWED_DOMAINS.some((allowed) =>
    domain === allowed || domain?.endsWith(`.${allowed}`)
  );
}

/**
 * Token-gated first-admin bootstrap.
 * POST JSON: { "email": "user@nara.gov.lk", "token": "...", "role": "system_admin" }
 */
exports.makeFirstAdmin = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', 'https://nara-web-73384.web.app');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Bootstrap-Token');
    return res.status(204).send('');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const requiredToken = getBootstrapSecret();
  const providedToken = req.get('X-Admin-Bootstrap-Token') || req.body?.token || req.query?.token;

  if (!requiredToken || !safeTokenEqual(providedToken, requiredToken)) {
    return res.status(403).json({ error: 'Admin bootstrap is not authorized.' });
  }

  const email = String(req.body?.email || req.query?.email || '').trim().toLowerCase();
  const role = ADMIN_BOOTSTRAP_ROLES.includes(req.body?.role) ? req.body.role : 'system_admin';

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  if (!isAllowedAdminEmail(email)) {
    return res.status(400).json({ error: 'Email must use an approved government domain.' });
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    const claims = { ...(user.customClaims || {}), admin: true, role };

    await admin.auth().setCustomUserClaims(user.uid, claims);

    const now = admin.firestore.FieldValue.serverTimestamp();
    const displayName = user.displayName || email.split('@')[0];
    const profile = {
      uid: user.uid,
      email,
      displayName,
      role,
      status: 'active',
      is_active: true,
      permissions: role === 'system_admin' ? ['*'] : [],
      updatedAt: now,
      bootstrappedAt: now,
      bootstrappedBy: 'makeFirstAdmin'
    };

    await Promise.all([
      db.collection('adminProfiles').doc(user.uid).set(profile, { merge: true }),
      db.collection('adminUsers').doc(user.uid).set({
        uid: user.uid,
        email,
        displayName,
        role,
        status: 'active',
        updatedAt: now,
        createdAt: now
      }, { merge: true })
    ]);

    console.log(`Admin bootstrap completed for ${email} (${user.uid})`);
    return res.status(200).json({ success: true, uid: user.uid, email, role });
  } catch (error) {
    console.error('Error bootstrapping admin:', error);

    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({ error: 'User not found. Create the Firebase Auth user first.' });
    }

    if (error.code === 'auth/invalid-email') {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    return res.status(500).json({ error: 'Admin bootstrap failed.' });
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
