/**
 * ChatGPT Prompt Enhancement Service
 * Adds an alternative to Gemini for refining image prompts via OpenAI's API.
 */

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_CHATGPT_MODEL = 'gpt-4.1-mini';

const getApiKey = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OpenAI API key. Set VITE_OPENAI_API_KEY in your env config.');
  }
  return apiKey;
};

const getModel = () => import.meta.env.VITE_OPENAI_CHATGPT5_MODEL || DEFAULT_CHATGPT_MODEL;

const systemPrompt = `You are ChatGPT 5, an elite creative director preparing ultra-detailed, photorealistic AI image prompts for Sri Lanka's National Aquatic Resources Research & Development Agency (NARA).

MANDATORY IN EVERY PROMPT:
- Location: Sri Lankan marine or coastal environments with authentic tropical details
- People: Sri Lankan scientists, researchers, or fisheries experts (South Asian features, realistic skin tones)
- Branding: Visible NARA logos, Sri Lankan national colors or emblem when appropriate
- Style: 8K documentary photography, National Geographic quality, professional government communications aesthetic
- Composition: Medium-to-wide shots capturing teams in action with scientific equipment, never portrait close-ups
- Team: 3-5 people, always include at least one female scientist, collaborative body language, natural interaction
- Equipment: Precise technical instrumentation with model names, oceanographic gear, data dashboards, or field kits
- Lighting: Golden hour or bright tropical daylight, cinematic depth, realistic shadows and highlights
- Tone: Authoritative, inspiring, future-focused marine innovation led by Sri Lanka

Deliver concise but information-dense prompts (5-8 sentences) that production teams can use directly.`;

const buildRequestBody = (prompt, divisionName) => ({
  model: getModel(),
  temperature: 0.85,
  top_p: 0.95,
  messages: [
    {
      role: 'system',
      content: systemPrompt
    },
    {
      role: 'user',
      content: `Division: ${divisionName || 'NARA Division'}
Original prompt: ${prompt}

Rewrite this prompt so it satisfies every requirement above while staying true to the division's mission.`
    }
  ]
});

const callOpenAI = async (payload) => {
  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getApiKey()}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let message = `status ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData?.error?.message) {
        message = errorData.error.message;
      }
    } catch (parseError) {
      // Ignore JSON parse failures and keep default message
    }
    throw new Error(message);
  }

  const data = await response.json();
  const enhanced = data?.choices?.[0]?.message?.content?.trim();

  if (!enhanced) {
    throw new Error('ChatGPT returned an empty response.');
  }

  return enhanced;
};

export const enhancePromptsWithChatGPT = async (prompts = [], divisionName = '') => {
  if (!Array.isArray(prompts) || prompts.length === 0) {
    return [];
  }

  const enhanced = [];

  for (let i = 0; i < prompts.length; i++) {
    const basePrompt = prompts[i];
    if (!basePrompt || basePrompt.trim() === '') {
      enhanced.push(basePrompt);
      continue;
    }

    console.log(`🧠 ChatGPT 5 enhancing prompt ${i + 1}/${prompts.length}...`);
    const payload = buildRequestBody(basePrompt, divisionName);
    const result = await callOpenAI(payload);
    enhanced.push(result);

    if (i < prompts.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  }

  return enhanced;
};

export default {
  enhancePromptsWithChatGPT
};
