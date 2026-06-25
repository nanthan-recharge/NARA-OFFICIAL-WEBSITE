/**
 * Gemini image generation service adapter.
 * Browser-side API keys are not allowed; route this through a secured backend.
 */

const backendRequiredError =
  'Gemini image generation must run through a secured backend endpoint. Configure a server function with secret-managed credentials before enabling this feature.';

/**
 * Generate image directly with Gemini 2.5 Flash Image model
 * @param {string} prompt - Image generation prompt
 */
export const generateImageWithGemini = async (prompt) => {
  try {
    console.warn('Gemini image generation blocked in browser:', prompt?.substring?.(0, 100) || '');
    return {
      success: false,
      error: backendRequiredError
    };
  } catch (error) {
    console.error('❌ Gemini image generation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Generate multiple images with Gemini
 * @param {array} prompts - Array of prompts
 */
export const generateMultipleImagesWithGemini = async (prompts) => {
  const results = [];
  
  for (let i = 0; i < prompts.length; i++) {
    console.log(`🎨 Generating Gemini image ${i + 1}/${prompts.length}...`);
    const result = await generateImageWithGemini(prompts[i]);
    results.push(result);
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
};

/**
 * Generate enhanced image prompt using Gemini 2.5 Flash
 * @param {string} basePrompt - Base prompt for image
 * @param {string} divisionContext - Division-specific context
 */
export const enhancePromptWithGemini = async (basePrompt, divisionContext = '') => {
  try {
    console.warn('Gemini prompt enhancement blocked in browser:', divisionContext);
    return {
      success: false,
      enhancedPrompt: basePrompt,
      originalPrompt: basePrompt,
      error: backendRequiredError
    };
  } catch (error) {
    console.error('Error enhancing prompt with Gemini:', error);
    // Fallback to original prompt if Gemini fails
    return {
      success: false,
      enhancedPrompt: basePrompt,
      originalPrompt: basePrompt,
      error: error.message
    };
  }
};

/**
 * Generate multiple enhanced prompts for a division
 * @param {array} prompts - Array of base prompts
 * @param {string} divisionName - Division name for context
 */
export const enhanceAllPrompts = async (prompts, divisionName) => {
  const enhanced = [];
  
  for (let i = 0; i < prompts.length; i++) {
    console.log(`🤖 Enhancing prompt ${i + 1}/${prompts.length} with Gemini...`);
    const result = await enhancePromptWithGemini(prompts[i], divisionName);
    enhanced.push(result.enhancedPrompt);
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return enhanced;
};

/**
 * Generate image description suggestions using Gemini
 * @param {string} divisionName - Division name
 * @param {string} focusArea - Specific focus area
 */
export const suggestImagePrompts = async (divisionName, focusArea) => {
  try {
    console.warn('Gemini prompt suggestions blocked in browser:', { divisionName, focusArea });
    return {
      success: false,
      suggestions: '',
      error: backendRequiredError
    };
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  enhancePromptWithGemini,
  enhanceAllPrompts,
  suggestImagePrompts
};
