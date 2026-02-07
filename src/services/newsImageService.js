/**
 * News Image Service
 * Handles Firebase Storage upload/delete for news article images
 * All images are auto-converted to WebP before upload
 */

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';
import { convertToWebP } from '../utils/imageConverter';

/**
 * Upload a single news image to Firebase Storage
 * Converts to WebP automatically before uploading
 * @param {string} articleId - Firestore document ID of the article
 * @param {File} file - Image file to upload
 * @param {number} order - Display order in gallery
 * @returns {Promise<{url: string, storagePath: string, width: number, height: number, order: number}>}
 */
export async function uploadNewsImage(articleId, file, order = 0) {
  // Convert to WebP
  const converted = await convertToWebP(file, 1600, 0.82);

  // Generate unique filename
  const timestamp = Date.now();
  const storagePath = `news/${articleId}/${timestamp}.${converted.format}`;
  const storageRef = ref(storage, storagePath);

  // Upload to Firebase Storage
  const metadata = {
    contentType: converted.mimeType,
    customMetadata: {
      originalName: file.name,
      originalSize: String(converted.originalSize),
      convertedSize: String(converted.convertedSize),
    },
  };

  await uploadBytes(storageRef, converted.blob, metadata);
  const url = await getDownloadURL(storageRef);

  return {
    url,
    storagePath,
    width: converted.width,
    height: converted.height,
    order,
  };
}

/**
 * Upload multiple news images in parallel
 * @param {string} articleId
 * @param {File[]} files - Array of image files
 * @param {function} onProgress - Callback (completed, total)
 * @returns {Promise<Array<{url, storagePath, width, height, order}>>}
 */
export async function uploadMultipleNewsImages(articleId, files, onProgress) {
  const results = [];
  for (let i = 0; i < files.length; i++) {
    const result = await uploadNewsImage(articleId, files[i], i);
    results.push(result);
    if (onProgress) onProgress(i + 1, files.length);
  }
  return results;
}

/**
 * Delete a single news image from Firebase Storage
 * @param {string} storagePath - The storage path of the image
 */
export async function deleteNewsImage(storagePath) {
  if (!storagePath) return;
  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
  } catch (error) {
    // Ignore "object-not-found" errors (already deleted)
    if (error.code !== 'storage/object-not-found') {
      console.error('Failed to delete news image:', error);
      throw error;
    }
  }
}

/**
 * Delete multiple news images from Firebase Storage
 * @param {Array<{storagePath: string}>} images
 */
export async function deleteAllNewsImages(images) {
  if (!images || images.length === 0) return;
  const promises = images
    .filter(img => img.storagePath)
    .map(img => deleteNewsImage(img.storagePath));
  await Promise.allSettled(promises);
}
