/**
 * ChatGPT Image Generation Service
 * Generates photorealistic division imagery using OpenAI's image endpoint.
 */

const OPENAI_IMAGE_URL = 'https://api.openai.com/v1/images/generations';
const DEFAULT_IMAGE_MODEL = 'gpt-image-1';

const getApiKey = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OpenAI API key. Set VITE_OPENAI_API_KEY in your env config.');
  }
  return apiKey;
};

const FALLBACK_IMAGE_MODEL = 'gpt-image-1-mini';

const getModel = () => import.meta.env.VITE_OPENAI_IMAGE_MODEL || DEFAULT_IMAGE_MODEL;

const buildPrompt = (basePrompt, divisionName = '') => {
  return `Create a photorealistic, 8K-quality documentary photograph for Sri Lanka's National Aquatic Resources Research & Development Agency (NARA).

Division: ${divisionName || 'NARA Division'}
Scene focus: ${basePrompt}

Mandatory requirements:
- Authentic Sri Lankan marine or coastal environment (tropical waters, coconut palms, local infrastructure)
- 3-5 Sri Lankan scientists or fisheries experts (South Asian features, natural skin tones, professional attire with NARA branding)
- At least one female scientist visible collaborating with the team
- Government research aesthetic, National Geographic documentary quality, medium-to-wide shot composition
- Advanced oceanographic equipment with visible NARA insignia, field notebooks, data tablets
- Golden hour or bright tropical daylight, balanced color grading, cinematic depth of field
- No text overlays, no watermarks, no AI distortion artifacts`;
};

const requestImage = async (model, prompt, divisionName) => {
  const apiKey = getApiKey();
  const response = await fetch(OPENAI_IMAGE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      prompt: buildPrompt(prompt, divisionName),
      size: '1024x1024',
      quality: 'high',
      n: 1
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const message = error?.error?.message || `status ${response.status}`;

    if (typeof message === 'string' && message.toLowerCase().includes('must be verified')) {
      const verificationMessage =
        'Organization verification required for gpt-image-1. Visit https://platform.openai.com/settings/organization/general, complete verification, wait ~15 minutes, then try again.';
      throw new Error(`${verificationMessage}::verification-required`);
    }

    throw new Error(message);
  }

  const data = await response.json();
  const base64 = data?.data?.[0]?.b64_json;

  if (!base64) {
    return { success: false, error: 'ChatGPT returned no image data.' };
  }

  return {
    success: true,
    base64Data: base64,
    mimeType: 'image/png',
    modelUsed: model
  };
};

export const generateImageWithChatGPT = async (prompt, divisionName) => {
  const preferredModel = getModel();

  try {
    return await requestImage(preferredModel, prompt, divisionName);
  } catch (error) {
    const needsVerification =
      typeof error.message === 'string' && error.message.includes('::verification-required');

    if (needsVerification) {
      if (preferredModel === DEFAULT_IMAGE_MODEL) {
        console.log('⚠️ gpt-image-1 requires org verification. Falling back to gpt-image-1-mini.');
        try {
          const fallbackResult = await requestImage(FALLBACK_IMAGE_MODEL, prompt, divisionName);
          if (fallbackResult.success) {
            fallbackResult.fallbackNotice =
              'Used gpt-image-1-mini automatically because gpt-image-1 requires verification.';
          }
          return fallbackResult;
        } catch (fallbackError) {
          console.error('Fallback image generation failed:', fallbackError);
          return { success: false, error: fallbackError.message.replace('::verification-required', '') };
        }
      }

      return { success: false, error: error.message.replace('::verification-required', '') };
    }

    console.error('ChatGPT image generation error:', error);
    return { success: false, error: error.message };
  }
};

export const generateDivisionImagesWithChatGPT = async (prompts = [], divisionName = '') => {
  const results = [];

  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i];
    if (!prompt || prompt.trim() === '') {
      results.push({ success: false, error: 'Empty prompt' });
      continue;
    }

    console.log(`🧠 ChatGPT Image ${i + 1}/${prompts.length}...`);
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
