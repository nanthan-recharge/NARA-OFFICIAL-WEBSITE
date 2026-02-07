/**
 * MSP Cloud Service - Firebase Integration
 * Handles cloud storage, collaboration, and real-time updates for Marine Spatial Planning projects
 */

import { db, storage } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll
} from 'firebase/storage';

// ==================== PROJECT MANAGEMENT ====================

/**
 * Save MSP project to cloud
 */
export const saveProjectToCloud = async (userId, projectData) => {
  try {
    const projectId = projectData.id || `msp_${Date.now()}`;
    const projectRef = doc(db, 'mspProjects', projectId);

    const cloudProject = {
      ...projectData,
      id: projectId,
      userId: userId,
      lastModified: serverTimestamp(),
      createdAt: projectData.createdAt || serverTimestamp(),
      isCloudSynced: true,
      collaborators: projectData.collaborators || [userId]
    };

    await setDoc(projectRef, cloudProject, { merge: true });

    console.log('✅ Project saved to cloud:', projectId);
    return { success: true, projectId };
  } catch (error) {
    console.error('❌ Error saving project to cloud:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Load MSP project from cloud
 */
export const loadProjectFromCloud = async (projectId) => {
  try {
    const projectRef = doc(db, 'mspProjects', projectId);
    const projectSnap = await getDoc(projectRef);

    if (projectSnap.exists()) {
      console.log('✅ Project loaded from cloud:', projectId);
      return { success: true, data: projectSnap.data() };
    } else {
      return { success: false, error: 'Project not found' };
    }
  } catch (error) {
    console.error('❌ Error loading project from cloud:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all projects for a user
 */
export const getUserProjects = async (userId) => {
  try {
    const projectsRef = collection(db, 'mspProjects');
    const q = query(
      projectsRef,
      where('collaborators', 'array-contains', userId),
      orderBy('lastModified', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const projects = [];

    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });

    console.log(`✅ Loaded ${projects.length} projects for user`);
    return { success: true, projects };
  } catch (error) {
    console.error('❌ Error getting user projects:', error);
    return { success: false, error: error.message, projects: [] };
  }
};

/**
 * Delete project from cloud
 */
export const deleteProjectFromCloud = async (projectId) => {
  try {
    // Delete project document
    await deleteDoc(doc(db, 'mspProjects', projectId));

    // Delete associated photos
    const photosRef = ref(storage, `msp-photos/${projectId}`);
    const photosList = await listAll(photosRef);

    const deletePromises = photosList.items.map(item => deleteObject(item));
    await Promise.all(deletePromises);

    console.log('✅ Project deleted from cloud:', projectId);
    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting project:', error);
    return { success: false, error: error.message };
  }
};

// ==================== REAL-TIME COLLABORATION ====================

/**
 * Subscribe to project updates (real-time)
 */
export const subscribeToProject = (projectId, callback) => {
  const projectRef = doc(db, 'mspProjects', projectId);

  const unsubscribe = onSnapshot(projectRef, (doc) => {
    if (doc.exists()) {
      console.log('🔄 Project updated:', projectId);
      callback({ success: true, data: doc.data() });
    } else {
      callback({ success: false, error: 'Project not found' });
    }
  }, (error) => {
    console.error('❌ Error subscribing to project:', error);
    callback({ success: false, error: error.message });
  });

  return unsubscribe;
};

/**
 * Add collaborator to project
 */
export const addCollaborator = async (projectId, userId, collaboratorEmail) => {
  try {
    const projectRef = doc(db, 'mspProjects', projectId);

    await updateDoc(projectRef, {
      collaborators: arrayUnion(collaboratorEmail),
      lastModified: serverTimestamp()
    });

    // Create notification
    await addNotification(collaboratorEmail, {
      type: 'collaboration_invite',
      projectId: projectId,
      invitedBy: userId,
      message: `You've been invited to collaborate on an MSP project`,
      timestamp: serverTimestamp()
    });

    console.log('✅ Collaborator added:', collaboratorEmail);
    return { success: true };
  } catch (error) {
    console.error('❌ Error adding collaborator:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Remove collaborator from project
 */
export const removeCollaborator = async (projectId, collaboratorEmail) => {
  try {
    const projectRef = doc(db, 'mspProjects', projectId);

    await updateDoc(projectRef, {
      collaborators: arrayRemove(collaboratorEmail),
      lastModified: serverTimestamp()
    });

    console.log('✅ Collaborator removed:', collaboratorEmail);
    return { success: true };
  } catch (error) {
    console.error('❌ Error removing collaborator:', error);
    return { success: false, error: error.message };
  }
};

// ==================== PHOTO ATTACHMENTS ====================

/**
 * Upload photo attachment to zone
 */
export const uploadZonePhoto = async (projectId, zoneId, file, metadata = {}) => {
  try {
    // Create unique filename
    const timestamp = Date.now();
    const filename = `${zoneId}_${timestamp}_${file.name}`;
    const photoRef = ref(storage, `msp-photos/${projectId}/${filename}`);

    // Add metadata
    const customMetadata = {
      zoneId: zoneId,
      projectId: projectId,
      uploadedAt: new Date().toISOString(),
      ...metadata
    };

    // Upload file
    await uploadBytes(photoRef, file, { customMetadata });

    // Get download URL
    const downloadURL = await getDownloadURL(photoRef);

    // Save photo metadata to project
    const projectRef = doc(db, 'mspProjects', projectId);
    await updateDoc(projectRef, {
      [`photoAttachments.${zoneId}`]: arrayUnion({
        id: filename,
        url: downloadURL,
        filename: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        ...metadata
      }),
      lastModified: serverTimestamp()
    });

    console.log('✅ Photo uploaded:', filename);
    return { success: true, url: downloadURL, id: filename };
  } catch (error) {
    console.error('❌ Error uploading photo:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all photos for a zone
 */
export const getZonePhotos = async (projectId, zoneId) => {
  try {
    const projectRef = doc(db, 'mspProjects', projectId);
    const projectSnap = await getDoc(projectRef);

    if (projectSnap.exists()) {
      const data = projectSnap.data();
      const photos = data.photoAttachments?.[zoneId] || [];
      return { success: true, photos };
    }

    return { success: true, photos: [] };
  } catch (error) {
    console.error('❌ Error getting zone photos:', error);
    return { success: false, error: error.message, photos: [] };
  }
};

/**
 * Delete photo attachment
 */
export const deleteZonePhoto = async (projectId, zoneId, photoId) => {
  try {
    // Delete from storage
    const photoRef = ref(storage, `msp-photos/${projectId}/${photoId}`);
    await deleteObject(photoRef);

    // Remove from project metadata
    const projectRef = doc(db, 'mspProjects', projectId);
    const projectSnap = await getDoc(projectRef);

    if (projectSnap.exists()) {
      const data = projectSnap.data();
      const photos = data.photoAttachments?.[zoneId] || [];
      const updatedPhotos = photos.filter(p => p.id !== photoId);

      await updateDoc(projectRef, {
        [`photoAttachments.${zoneId}`]: updatedPhotos,
        lastModified: serverTimestamp()
      });
    }

    console.log('✅ Photo deleted:', photoId);
    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting photo:', error);
    return { success: false, error: error.message };
  }
};

// ==================== COMMENTS & ANNOTATIONS ====================

/**
 * Add comment to zone
 */
export const addZoneComment = async (projectId, zoneId, userId, commentText) => {
  try {
    const projectRef = doc(db, 'mspProjects', projectId);

    const comment = {
      id: `comment_${Date.now()}`,
      zoneId: zoneId,
      userId: userId,
      text: commentText,
      timestamp: new Date().toISOString(),
      edited: false
    };

    await updateDoc(projectRef, {
      [`comments.${zoneId}`]: arrayUnion(comment),
      lastModified: serverTimestamp()
    });

    console.log('✅ Comment added to zone:', zoneId);
    return { success: true, comment };
  } catch (error) {
    console.error('❌ Error adding comment:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get comments for a zone
 */
export const getZoneComments = async (projectId, zoneId) => {
  try {
    const projectRef = doc(db, 'mspProjects', projectId);
    const projectSnap = await getDoc(projectRef);

    if (projectSnap.exists()) {
      const data = projectSnap.data();
      const comments = data.comments?.[zoneId] || [];
      return { success: true, comments };
    }

    return { success: true, comments: [] };
  } catch (error) {
    console.error('❌ Error getting comments:', error);
    return { success: false, error: error.message, comments: [] };
  }
};

// ==================== NOTIFICATIONS ====================

/**
 * Add notification for user
 */
export const addNotification = async (userId, notificationData) => {
  try {
    const notificationRef = doc(collection(db, 'notifications'));

    await setDoc(notificationRef, {
      userId: userId,
      ...notificationData,
      read: false,
      createdAt: serverTimestamp()
    });

    console.log('✅ Notification created');
    return { success: true };
  } catch (error) {
    console.error('❌ Error creating notification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user notifications
 */
export const getUserNotifications = async (userId) => {
  try {
    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', userId),
      where('read', '==', false),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const notifications = [];

    querySnapshot.forEach((doc) => {
      notifications.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, notifications };
  } catch (error) {
    console.error('❌ Error getting notifications:', error);
    return { success: false, error: error.message, notifications: [] };
  }
};

// ==================== CUSTOM TEMPLATES ====================

/**
 * Save custom template
 */
export const saveCustomTemplate = async (userId, templateData) => {
  try {
    const templateId = templateData.id || `template_${Date.now()}`;
    const templateRef = doc(db, 'mspTemplates', templateId);

    await setDoc(templateRef, {
      ...templateData,
      id: templateId,
      userId: userId,
      isCustom: true,
      createdAt: serverTimestamp(),
      isPublic: templateData.isPublic || false
    });

    console.log('✅ Custom template saved:', templateId);
    return { success: true, templateId };
  } catch (error) {
    console.error('❌ Error saving template:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user's custom templates
 */
export const getUserTemplates = async (userId) => {
  try {
    const templatesRef = collection(db, 'mspTemplates');
    const q = query(
      templatesRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const templates = [];

    querySnapshot.forEach((doc) => {
      templates.push({ id: doc.id, ...doc.data() });
    });

    console.log(`✅ Loaded ${templates.length} custom templates`);
    return { success: true, templates };
  } catch (error) {
    console.error('❌ Error getting templates:', error);
    return { success: false, error: error.message, templates: [] };
  }
};

/**
 * Get public templates (shared by other users)
 */
export const getPublicTemplates = async () => {
  try {
    const templatesRef = collection(db, 'mspTemplates');
    const q = query(
      templatesRef,
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const templates = [];

    querySnapshot.forEach((doc) => {
      templates.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, templates };
  } catch (error) {
    console.error('❌ Error getting public templates:', error);
    return { success: false, error: error.message, templates: [] };
  }
};

// ==================== ACTIVITY LOG ====================

/**
 * Log activity for project
 */
export const logProjectActivity = async (projectId, userId, activityType, details) => {
  try {
    const activityRef = doc(collection(db, 'mspActivityLog'));

    await setDoc(activityRef, {
      projectId: projectId,
      userId: userId,
      activityType: activityType, // 'zone_added', 'zone_edited', 'photo_uploaded', etc.
      details: details,
      timestamp: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('❌ Error logging activity:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get project activity log
 */
export const getProjectActivityLog = async (projectId, limit = 50) => {
  try {
    const activityRef = collection(db, 'mspActivityLog');
    const q = query(
      activityRef,
      where('projectId', '==', projectId),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const activities = [];

    querySnapshot.forEach((doc) => {
      activities.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, activities };
  } catch (error) {
    console.error('❌ Error getting activity log:', error);
    return { success: false, error: error.message, activities: [] };
  }
};

// ==================== EXPORT HELPERS ====================

/**
 * Save export to cloud (for sharing)
 */
export const saveExportToCloud = async (projectId, exportType, exportData) => {
  try {
    const exportId = `export_${Date.now()}`;
    const exportRef = ref(storage, `msp-exports/${projectId}/${exportId}.${exportType}`);

    const blob = new Blob([exportData], {
      type: exportType === 'json' ? 'application/json' :
            exportType === 'geojson' ? 'application/geo+json' :
            exportType === 'csv' ? 'text/csv' : 'text/plain'
    });

    await uploadBytes(exportRef, blob);
    const downloadURL = await getDownloadURL(exportRef);

    // Save export metadata
    const projectRef = doc(db, 'mspProjects', projectId);
    await updateDoc(projectRef, {
      exports: arrayUnion({
        id: exportId,
        type: exportType,
        url: downloadURL,
        createdAt: new Date().toISOString()
      })
    });

    console.log('✅ Export saved to cloud:', exportId);
    return { success: true, url: downloadURL };
  } catch (error) {
    console.error('❌ Error saving export:', error);
    return { success: false, error: error.message };
  }
};

export default {
  saveProjectToCloud,
  loadProjectFromCloud,
  getUserProjects,
  deleteProjectFromCloud,
  subscribeToProject,
  addCollaborator,
  removeCollaborator,
  uploadZonePhoto,
  getZonePhotos,
  deleteZonePhoto,
  addZoneComment,
  getZoneComments,
  addNotification,
  getUserNotifications,
  saveCustomTemplate,
  getUserTemplates,
  getPublicTemplates,
  logProjectActivity,
  getProjectActivityLog,
  saveExportToCloud
};
