const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with error handling for development
let firebaseInitialized = false;

try {
  if (!admin.apps.length) {
    // Check if we have valid credentials
    if (process.env.FIREBASE_PROJECT_ID && 
        process.env.FIREBASE_CLIENT_EMAIL && 
        process.env.FIREBASE_PRIVATE_KEY &&
        process.env.FIREBASE_PRIVATE_KEY.includes('BEGIN PRIVATE KEY')) {
      
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
      firebaseInitialized = true;
      console.log('✓ Firebase Admin SDK initialized');
    } else {
      console.warn('⚠️  Firebase credentials not configured - Running in MOCK MODE');
      console.warn('⚠️  Authentication is disabled for testing');
    }
  }
} catch (error) {
  console.error('⚠️  Firebase initialization failed:', error.message);
  console.warn('⚠️  Running in MOCK MODE - Authentication disabled');
  firebaseInitialized = false;
}

/**
 * Middleware to verify Firebase ID token
 */
const verifyToken = async (req, res, next) => {
  // MOCK MODE: If Firebase not initialized, use mock user
  if (!firebaseInitialized) {
    req.user = {
      uid: 'mock-admin-user',
      email: 'admin@nara.ac.lk',
      name: 'Mock Admin User',
      emailVerified: true,
      customClaims: { 
        admin: true,
        library_admin: true,
        librarian: true 
      }
    };
    return next();
  }
  
  // PRODUCTION MODE: Verify actual Firebase token
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - No token provided'
      });
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    // Verify the token with Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email,
      emailVerified: decodedToken.email_verified
    };
    
    // Get custom claims (roles)
    const userRecord = await admin.auth().getUser(decodedToken.uid);
    req.user.customClaims = userRecord.customClaims || {};
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - Invalid token'
    });
  }
};

/**
 * Middleware to check if user has required role
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - Authentication required'
      });
    }
    
    const userRoles = req.user.customClaims || {};
    
    // Check if user has any of the allowed roles
    const hasRole = allowedRoles.some(role => {
      if (role === 'admin' && userRoles.admin === true) return true;
      if (role === 'librarian' && (userRoles.librarian === true || userRoles.library_admin === true)) return true;
      if (role === 'library_admin' && userRoles.library_admin === true) return true;
      return false;
    });
    
    if (!hasRole) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden - Insufficient permissions'
      });
    }
    
    next();
  };
};

/**
 * Middleware to check if user has specific permission
 */
const requirePermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - Authentication required'
      });
    }
    
    const userClaims = req.user.customClaims || {};
    
    // Admins have all permissions
    if (userClaims.admin === true) {
      return next();
    }
    
    // Library admins have all library permissions
    if (userClaims.library_admin === true) {
      return next();
    }
    
    // Check specific permissions
    const userPermissions = userClaims.permissions || [];
    const hasPermission = permissions.some(perm => userPermissions.includes(perm));
    
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden - Insufficient permissions'
      });
    }
    
    next();
  };
};

/**
 * Optional authentication - adds user info if token is present but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  // MOCK MODE: If Firebase not initialized, add mock user (optional)
  if (!firebaseInitialized) {
    // Don't add user in optional auth for mock mode
    return next();
  }
  
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email,
      emailVerified: decodedToken.email_verified
    };
    
    const userRecord = await admin.auth().getUser(decodedToken.uid);
    req.user.customClaims = userRecord.customClaims || {};
    
    next();
  } catch (error) {
    // If token is invalid, just continue without user info
    next();
  }
};

/**
 * Middleware to log audit trail
 */
const auditLog = (action, entityType) => {
  return async (req, res, next) => {
    // Store original json method
    const originalJson = res.json.bind(res);
    
    // Override json method to capture response
    res.json = function(data) {
      // Log the action after successful response
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const { query } = require('../config/database');
        
        query(
          `INSERT INTO audit_log (user_uid, user_name, action, entity_type, entity_id, new_values, ip_address, user_agent)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            req.user?.uid || 'anonymous',
            req.user?.name || 'Anonymous',
            action,
            entityType,
            data?.data?.id || null,
            JSON.stringify(data?.data || {}),
            req.ip,
            req.get('user-agent')
          ]
        ).catch(err => console.error('Audit log error:', err));
      }
      
      return originalJson(data);
    };
    
    next();
  };
};

module.exports = {
  verifyToken,
  requireRole,
  requirePermission,
  optionalAuth,
  auditLog,
  admin
};

