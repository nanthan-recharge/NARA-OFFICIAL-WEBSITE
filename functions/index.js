const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');
const researchDataPool = require('./researchDataPool');

admin.initializeApp();

const db = admin.firestore();

const DEFAULT_ADMIN_ALLOWED_DOMAINS = [
  'nara.gov.lk',
  'gov.lk',
  'gmail.com', // Temporary launch access until official NARA email accounts are ready.
  'safenetcreations.com' // Temporary implementation/support access during launch.
];
const ADMIN_BOOTSTRAP_ROLES = ['system_admin', 'director_general'];
const ADMIN_STAFF_ROLES = [
  'system_admin',
  'director_general',
  'deputy_director',
  'division_head',
  'senior_researcher',
  'research_officer',
  'technical_officer',
  'admin_staff',
  'support_staff'
];
const ADMIN_PERMISSION_VALUES = [
  'view_dashboard',
  'view_analytics',
  'manage_users',
  'manage_division_users',
  'manage_content',
  'create_content',
  'manage_divisions',
  'manage_hero_images',
  'manage_news',
  'manage_media',
  'manage_vacancies',
  'manage_scientist_sessions',
  'manage_applications',
  'view_applications',
  'approve_requests',
  'approve_division_requests',
  'manage_government_services',
  'manage_lda',
  'manage_public_consultation',
  'manage_research_data',
  'manage_own_research',
  'review_research',
  'manage_project_pipeline',
  'manage_research_vessels',
  'manage_library',
  'manage_catalogue',
  'manage_circulation',
  'manage_library_patrons',
  'manage_library_acquisitions',
  'manage_lab_data',
  'manage_maritime',
  'manage_bathymetry',
  'manage_fish_advisory',
  'manage_incidents',
  'manage_data_integration',
  'manage_water_quality',
  'manage_podcasts',
  'manage_records',
  'manage_departments',
  'manage_system',
  'manage_cloud_functions',
  'manage_ai_config',
  'manage_recruitment',
  'manage_marketplace',
  'manage_analytics',
  'view_logs'
];
const ADMIN_ACCOUNT_STATUSES = ['active', 'suspended', 'on_leave', 'retired', 'terminated'];

function getBootstrapSecret() {
  return process.env.ADMIN_BOOTSTRAP_TOKEN || functions.config()?.admin?.bootstrap_token;
}

function getAdminAllowedDomains() {
  const configuredDomains =
    process.env.ADMIN_ALLOWED_EMAIL_DOMAINS ||
    functions.config()?.admin?.allowed_email_domains;

  if (!configuredDomains) return DEFAULT_ADMIN_ALLOWED_DOMAINS;

  return String(configuredDomains)
    .split(',')
    .map((domain) => domain.trim().toLowerCase())
    .filter(Boolean);
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
  return getAdminAllowedDomains().some((allowed) =>
    domain === allowed || domain?.endsWith(`.${allowed}`)
  );
}

function cleanString(value, maxLength = 500) {
  if (value === undefined || value === null) return '';
  return String(value).trim().slice(0, maxLength);
}

function cleanMultilingual(value) {
  const source = value && typeof value === 'object' ? value : {};
  return {
    en: cleanString(source.en, 160),
    si: cleanString(source.si, 160),
    ta: cleanString(source.ta, 160)
  };
}

function buildSearchTerms(userData) {
  const terms = new Set();
  const addTerms = (value) => {
    const normalized = cleanString(value, 250).toLowerCase();
    if (!normalized) return;
    terms.add(normalized);
    normalized.split(/\s+/).forEach((word) => {
      if (word.length > 1) terms.add(word);
    });
  };

  addTerms(userData.displayName);
  addTerms(userData.email);
  addTerms(userData.employeeId);
  addTerms(userData.department);
  addTerms(userData.role.replace(/_/g, ' '));
  addTerms(userData.firstName?.en);
  addTerms(userData.lastName?.en);
  return Array.from(terms);
}

function createRandomPassword() {
  return crypto.randomBytes(32).toString('base64').replace(/[+/=]/g, 'A');
}

function normalizeCustomPermissions(value) {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(
    value
      .map((permission) => cleanString(permission, 120))
      .filter((permission) => ADMIN_PERMISSION_VALUES.includes(permission))
  ));
}

function normalizeStaffUserPayload(data) {
  const source = data && typeof data === 'object' ? data : {};
  const email = cleanString(source.email, 254).toLowerCase();
  const role = ADMIN_STAFF_ROLES.includes(source.role) ? source.role : 'support_staff';
  const status = ADMIN_ACCOUNT_STATUSES.includes(source.status) ? source.status : 'active';
  const firstName = cleanMultilingual(source.firstName);
  const lastName = cleanMultilingual(source.lastName);
  const fallbackDisplayName = `${firstName.en} ${lastName.en}`.trim() || email.split('@')[0];

  return {
    employeeId: cleanString(source.employeeId, 80),
    firstName,
    lastName,
    displayName: cleanString(source.displayName, 180) || fallbackDisplayName,
    email,
    phone: cleanString(source.phone, 40),
    mobile: cleanString(source.mobile, 40),
    designation: cleanMultilingual(source.designation),
    role,
    department: cleanString(source.department, 40),
    departmentCode: cleanString(source.department || source.departmentCode, 40),
    reportingTo: cleanString(source.reportingTo, 180),
    grade: cleanString(source.grade, 80),
    status,
    customPermissions: normalizeCustomPermissions(source.customPermissions),
    notes: cleanString(source.notes, 1000)
  };
}

async function requireSystemAdminContext(context) {
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'Admin authentication is required.');
  }

  const profileSnap = await db.collection('adminProfiles').doc(context.auth.uid).get();
  const profile = profileSnap.exists ? profileSnap.data() : null;
  const isActive = profile &&
    profile.email === context.auth.token.email &&
    profile.is_active !== false &&
    !['suspended', 'terminated', 'retired'].includes(profile.status);

  if (!isActive || !ADMIN_BOOTSTRAP_ROLES.includes(profile.role)) {
    throw new functions.https.HttpsError('permission-denied', 'System administrator access is required.');
  }

  return profile;
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
 * Secure staff account provisioning for the unified admin panel.
 * Callable JSON: { userId?: string, user: { email, role, department, status, customPermissions, ... } }
 */
exports.upsertAdminStaffUser = functions.https.onCall(async (data, context) => {
  const actorProfile = await requireSystemAdminContext(context);
  const staff = normalizeStaffUserPayload(data?.user || data);

  if (!staff.email) {
    throw new functions.https.HttpsError('invalid-argument', 'Staff email is required.');
  }

  if (!isAllowedAdminEmail(staff.email)) {
    throw new functions.https.HttpsError('invalid-argument', 'Staff email must use an approved government domain.');
  }

  if (!staff.employeeId) {
    throw new functions.https.HttpsError('invalid-argument', 'Employee ID is required.');
  }

  if (!staff.department) {
    throw new functions.https.HttpsError('invalid-argument', 'Department is required.');
  }

  const requestedUserId = cleanString(data?.userId || staff.uid, 160);
  const disabled = ['suspended', 'terminated', 'retired'].includes(staff.status);
  const now = admin.firestore.FieldValue.serverTimestamp();

  let authUser = null;
  let createdAuthUser = false;

  if (requestedUserId) {
    try {
      authUser = await admin.auth().getUser(requestedUserId);
    } catch (error) {
      if (error.code !== 'auth/user-not-found') throw error;
    }
  }

  if (!authUser) {
    try {
      authUser = await admin.auth().getUserByEmail(staff.email);
    } catch (error) {
      if (error.code !== 'auth/user-not-found') throw error;
    }
  }

  if (!authUser) {
    authUser = await admin.auth().createUser({
      email: staff.email,
      displayName: staff.displayName,
      disabled,
      emailVerified: false,
      password: createRandomPassword()
    });
    createdAuthUser = true;
  } else {
    await admin.auth().updateUser(authUser.uid, {
      email: staff.email,
      displayName: staff.displayName,
      disabled
    });
  }

  const claims = { ...(authUser.customClaims || {}), admin: true, role: staff.role };
  await admin.auth().setCustomUserClaims(authUser.uid, claims);

  const uid = authUser.uid;
  const profileRecord = {
    uid,
    email: staff.email,
    displayName: staff.displayName,
    role: staff.role,
    department: staff.department,
    departmentCode: staff.departmentCode,
    status: staff.status,
    is_active: !disabled,
    customPermissions: staff.customPermissions,
    updatedAt: now,
    updatedBy: context.auth.uid
  };

  const directoryRecord = {
    ...staff,
    uid,
    permissions: [],
    searchTerms: buildSearchTerms(staff),
    is_active: !disabled,
    updatedAt: now,
    updatedBy: context.auth.uid
  };

  if (createdAuthUser) {
    profileRecord.createdAt = now;
    profileRecord.createdBy = context.auth.uid;
    directoryRecord.createdAt = now;
    directoryRecord.createdBy = context.auth.uid;
  }

  await Promise.all([
    db.collection('adminProfiles').doc(uid).set(profileRecord, { merge: true }),
    db.collection('adminUsers').doc(uid).set(directoryRecord, { merge: true }),
    db.collection('userActivityLogs').add({
      userId: uid,
      action: createdAuthUser ? 'user_created' : 'user_updated',
      details: createdAuthUser ? 'Admin staff account created' : 'Admin staff account updated',
      performedBy: context.auth.uid,
      performedByEmail: actorProfile.email,
      metadata: {
        role: staff.role,
        department: staff.department,
        status: staff.status,
        customPermissions: staff.customPermissions
      },
      timestamp: now
    })
  ]);

  return {
    success: true,
    uid,
    createdAuthUser,
    inviteRequired: createdAuthUser,
    email: staff.email,
    role: staff.role,
    status: staff.status
  };
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
