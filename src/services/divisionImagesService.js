/**
 * Division Images Management Service
 * Firebase Storage and Firestore integration for division images
 */

import { db, storage } from '../firebase';
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';

const IMAGES_COLLECTION = 'divisionImages';
const STORAGE_PATH = 'divisions';

/**
 * Upload image to Firebase Storage
 * @param {string} divisionId - Division identifier
 * @param {File} file - Image file
 * @param {object} metadata - Image metadata
 */
export const uploadDivisionImage = async (divisionId, file, metadata = {}) => {
  try {
    // Create unique filename
    const timestamp = Date.now();
    const filename = `${divisionId}_${timestamp}_${file.name}`;
    const storageRef = ref(storage, `${STORAGE_PATH}/${divisionId}/${filename}`);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        divisionId,
        uploadedBy: metadata.uploadedBy || 'admin',
        uploadedAt: new Date().toISOString(),
        ...metadata
      }
    });

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Save metadata to Firestore
    const imageDoc = {
      divisionId,
      filename,
      url: downloadURL,
      storagePath: snapshot.ref.fullPath,
      contentType: file.type,
      size: file.size,
      metadata,
      uploadedAt: new Date().toISOString(),
      isActive: true,
      isPrimary: false,
      aiGenerated: false
    };

    await setDoc(doc(db, IMAGES_COLLECTION, `${divisionId}_${timestamp}`), imageDoc);

    return {
      success: true,
      image: imageDoc
    };
  } catch (error) {
    console.error('Error uploading division image:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get all images for a division
 * @param {string} divisionId - Division identifier
 */
export const getDivisionImages = async (divisionId) => {
  try {
    const q = query(
      collection(db, IMAGES_COLLECTION),
      where('divisionId', '==', divisionId),
      where('isActive', '==', true)
    );

    const querySnapshot = await getDocs(q);
    const images = [];

    querySnapshot.forEach((doc) => {
      images.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Sort by upload date, newest first
    images.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    return {
      success: true,
      images
    };
  } catch (error) {
    console.error('Error fetching division images:', error);
    return {
      success: false,
      error: error.message,
      images: []
    };
  }
};

/**
 * Get primary/hero image for a division
 * @param {string} divisionId - Division identifier
 */
export const getPrimaryDivisionImage = async (divisionId) => {
  try {
    const q = query(
      collection(db, IMAGES_COLLECTION),
      where('divisionId', '==', divisionId),
      where('isPrimary', '==', true),
      where('isActive', '==', true)
    );

    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        success: true,
        image: {
          id: doc.id,
          ...doc.data()
        }
      };
    }

    // If no primary image, get the most recent one
    const allImages = await getDivisionImages(divisionId);
    if (allImages.success && allImages.images.length > 0) {
      return {
        success: true,
        image: allImages.images[0]
      };
    }

    return {
      success: false,
      message: 'No images found for this division'
    };
  } catch (error) {
    console.error('Error fetching primary division image:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Set an image as primary for a division
 * @param {string} imageId - Image document ID
 * @param {string} divisionId - Division identifier
 */
export const setPrimaryImage = async (imageId, divisionId) => {
  try {
    // First, unset all primary images for this division
    const q = query(
      collection(db, IMAGES_COLLECTION),
      where('divisionId', '==', divisionId),
      where('isPrimary', '==', true)
    );

    const querySnapshot = await getDocs(q);
    const updatePromises = [];

    querySnapshot.forEach((document) => {
      updatePromises.push(
        updateDoc(doc(db, IMAGES_COLLECTION, document.id), { isPrimary: false })
      );
    });

    await Promise.all(updatePromises);

    // Set the new primary image
    await updateDoc(doc(db, IMAGES_COLLECTION, imageId), { isPrimary: true });

    return {
      success: true,
      message: 'Primary image updated successfully'
    };
  } catch (error) {
    console.error('Error setting primary image:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Delete an image
 * @param {string} imageId - Image document ID
 */
export const deleteDivisionImage = async (imageId) => {
  try {
    // Get image document
    const imageDoc = await getDoc(doc(db, IMAGES_COLLECTION, imageId));
    
    if (!imageDoc.exists()) {
      return {
        success: false,
        message: 'Image not found'
      };
    }

    const imageData = imageDoc.data();

    // Delete from Storage
    const storageRef = ref(storage, imageData.storagePath);
    await deleteObject(storageRef);

    // Delete from Firestore
    await deleteDoc(doc(db, IMAGES_COLLECTION, imageId));

    return {
      success: true,
      message: 'Image deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting division image:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Update image metadata
 * @param {string} imageId - Image document ID
 * @param {object} metadata - Updated metadata
 */
export const updateImageMetadata = async (imageId, metadata) => {
  try {
    await updateDoc(doc(db, IMAGES_COLLECTION, imageId), {
      metadata: {
        ...metadata
      },
      updatedAt: new Date().toISOString()
    });

    return {
      success: true,
      message: 'Metadata updated successfully'
    };
  } catch (error) {
    console.error('Error updating image metadata:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Save AI-generated image URL to Firestore
 * @param {string} divisionId - Division identifier
 * @param {string} imageUrl - AI-generated image URL
 * @param {object} metadata - Generation metadata
 */
export const saveAIGeneratedImage = async (divisionId, imageUrl, metadata = {}) => {
  try {
    const timestamp = Date.now();
    const imageDoc = {
      divisionId,
      url: imageUrl,
      aiGenerated: true,
      generationPrompt: metadata.prompt || '',
      generationModel: metadata.model || 'gemini-2.0-flash-exp',
      uploadedAt: new Date().toISOString(),
      isActive: true,
      isPrimary: false,
      metadata
    };

    await setDoc(doc(db, IMAGES_COLLECTION, `${divisionId}_ai_${timestamp}`), imageDoc);

    return {
      success: true,
      image: imageDoc
    };
  } catch (error) {
    console.error('Error saving AI-generated image:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get all AI-generated images for a division
 * @param {string} divisionId - Division identifier
 */
export const getAIGeneratedImages = async (divisionId) => {
  try {
    const q = query(
      collection(db, IMAGES_COLLECTION),
      where('divisionId', '==', divisionId),
      where('aiGenerated', '==', true),
      where('isActive', '==', true)
    );

    const querySnapshot = await getDocs(q);
    const images = [];

    querySnapshot.forEach((doc) => {
      images.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return {
      success: true,
      images
    };
  } catch (error) {
    console.error('Error fetching AI-generated images:', error);
    return {
      success: false,
      error: error.message,
      images: []
    };
  }
};

export default {
  uploadDivisionImage,
  getDivisionImages,
  getPrimaryDivisionImage,
  setPrimaryImage,
  deleteDivisionImage,
  updateImageMetadata,
  saveAIGeneratedImage,
  getAIGeneratedImages
};

