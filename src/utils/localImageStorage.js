/**
 * Local Storage for Division Images
 * Alternative to Firebase for immediate image management
 */

const STORAGE_KEY = 'nara_division_images';

/**
 * Save division images to localStorage
 * @param {string} divisionId - Division identifier
 * @param {array} imageUrls - Array of image URLs
 */
export const saveLocalDivisionImages = (divisionId, imageUrls) => {
  try {
    const allImages = getLocalAllDivisionImages();
    allImages[divisionId] = {
      images: imageUrls,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allImages));
    return { success: true };
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    const isQuotaError =
      error?.name === 'QuotaExceededError' ||
      error?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      error?.code === 22 ||
      error?.code === 1014;

    if (isQuotaError) {
      return { success: false, error: 'quota-exceeded' };
    }

    return { success: false, error: error.message };
  }
};

/**
 * Get division images from localStorage
 * @param {string} divisionId - Division identifier
 */
export const getLocalDivisionImages = (divisionId) => {
  try {
    const allImages = getLocalAllDivisionImages();
    return allImages[divisionId]?.images || [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

/**
 * Get all division images from localStorage
 */
export const getLocalAllDivisionImages = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error parsing localStorage:', error);
    return {};
  }
};

/**
 * Add single image to division
 * @param {string} divisionId - Division identifier
 * @param {string} imageUrl - Image URL
 */
export const addLocalDivisionImage = (divisionId, imageUrl) => {
  try {
    const currentImages = getLocalDivisionImages(divisionId);
    currentImages.push(imageUrl);
    return saveLocalDivisionImages(divisionId, currentImages);
  } catch (error) {
    console.error('Error adding image:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Remove image from division
 * @param {string} divisionId - Division identifier
 * @param {number} imageIndex - Index of image to remove
 */
export const removeLocalDivisionImage = (divisionId, imageIndex) => {
  try {
    const currentImages = getLocalDivisionImages(divisionId);
    currentImages.splice(imageIndex, 1);
    return saveLocalDivisionImages(divisionId, currentImages);
  } catch (error) {
    console.error('Error removing image:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Clear all images for a division
 * @param {string} divisionId - Division identifier
 */
export const clearLocalDivisionImages = (divisionId) => {
  try {
    const allImages = getLocalAllDivisionImages();
    delete allImages[divisionId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allImages));
    return { success: true };
  } catch (error) {
    console.error('Error clearing images:', error);
    return { success: false, error: error.message };
  }
};

export default {
  saveLocalDivisionImages,
  getLocalDivisionImages,
  getLocalAllDivisionImages,
  addLocalDivisionImage,
  removeLocalDivisionImage,
  clearLocalDivisionImages
};
