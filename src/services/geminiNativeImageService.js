/**
 * Gemini 2.5 Flash native image generation adapter.
 * Browser-side API keys are not allowed; route this through a secured backend.
 */

const backendRequiredError =
  'Gemini image generation must run through a secured backend endpoint. Configure a server function with secret-managed credentials before enabling this feature.';

/**
 * Generate image using Gemini 2.5 Flash Image model
 * @param {string} prompt - Detailed image description
 * @returns {Promise} Image data as blob URL
 */
export const generateImageWithGeminiNative = async (prompt) => {
  try {
    console.warn('Gemini Native blocked in browser:', prompt?.substring?.(0, 100) || '');
    return {
      success: false,
      error: backendRequiredError
    };
  } catch (error) {
    console.error('❌ Gemini Native error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Generate 4 images for a division using Gemini Native
 * @param {array} prompts - Array of 4 prompts
 * @param {string} divisionName - Division name for logging
 */
export const generateDivisionImagesWithGemini = async (prompts, divisionName) => {
  const results = [];
  
  console.log(`🎨 Generating ${prompts.length} images for ${divisionName} with Gemini...`);
  
  for (let i = 0; i < prompts.length; i++) {
    console.log(`\n🖼️ Image ${i + 1}/${prompts.length}:`);
    
    const result = await generateImageWithGeminiNative(prompts[i]);
    results.push(result);
    
    if (!result.success) {
      console.warn(`⚠️ Failed to generate image ${i + 1}:`, result.error);
    }
    
    // Delay between requests to avoid rate limiting
    if (i < prompts.length - 1) {
      console.log('⏳ Waiting 2 seconds before next image...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  const successCount = results.filter(r => r.success).length;
  console.log(`\n✅ Successfully generated ${successCount}/${prompts.length} images`);
  
  return results;
};

/**
 * Save Gemini-generated image to Firebase Storage (optional)
 * @param {string} base64Data - Image base64 data
 * @param {string} divisionId - Division identifier
 * @param {string} filename - Filename
 */
export const saveGeminiImageToStorage = async (base64Data, divisionId, filename) => {
  try {
    // Convert base64 to blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    
    // Create File object
    const file = new File([blob], filename, { type: 'image/png' });
    
    return {
      success: true,
      file: file
    };
  } catch (error) {
    console.error('Error preparing image for upload:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  generateImageWithGeminiNative,
  generateDivisionImagesWithGemini,
  saveGeminiImageToStorage
};
