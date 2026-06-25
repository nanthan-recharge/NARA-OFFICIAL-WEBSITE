/**
 * ChatGPT Prompt Enhancement Service adapter.
 * Browser-side API keys are not allowed; route this through a secured backend.
 */

const BACKEND_REQUIRED_ERROR =
  'ChatGPT prompt enhancement must run through a secured backend endpoint. Configure a server function with secret-managed credentials before enabling this feature.';

export const enhancePromptsWithChatGPT = async (prompts = [], divisionName = '') => {
  if (!Array.isArray(prompts) || prompts.length === 0) {
    return [];
  }

  console.warn('ChatGPT prompt enhancement blocked in browser:', divisionName);
  console.warn(BACKEND_REQUIRED_ERROR);
  return prompts;
};

export default {
  enhancePromptsWithChatGPT
};
