/**
 * ChatGPT Image Generation Service adapter.
 * Browser-side API keys are not allowed; route this through a secured backend.
 */

const BACKEND_REQUIRED_ERROR =
  'ChatGPT image generation must run through a secured backend endpoint. Configure a server function with secret-managed credentials before enabling this feature.';

export const generateImageWithChatGPT = async (prompt, divisionName) => {
  console.warn('ChatGPT image generation blocked in browser:', {
    divisionName,
    promptPreview: prompt?.substring?.(0, 100) || ''
  });

  return {
    success: false,
    error: BACKEND_REQUIRED_ERROR
  };
};

export const generateDivisionImagesWithChatGPT = async (prompts = [], divisionName = '') => {
  const results = [];

  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i];
    if (!prompt || prompt.trim() === '') {
      results.push({ success: false, error: 'Empty prompt' });
      continue;
    }

    const result = await generateImageWithChatGPT(prompt, divisionName);
    results.push(result);

    if (i < prompts.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }

  return results;
};

export default {
  generateImageWithChatGPT,
  generateDivisionImagesWithChatGPT
};
