/**
 * Gemini 2.5 Flash IMAGE Generation Service
 * Uses Gemini native image generation with your API key
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with your API key
const genAI = new GoogleGenerativeAI('AIzaSyBuK3N924LRtseewgj_PNjdEOarlkax2pI');

/**
 * Generate image directly with Gemini 2.5 Flash Image model
 * @param {string} prompt - Image generation prompt
 */
export const generateImageWithGemini = async (prompt) => {
  try {
    console.log('🤖 Generating image with Gemini 2.5 Flash Image model...');
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp-image-generation"
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Extract image data from response
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        // Convert base64 to blob URL for browser display
        const imageData = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'image/png';
        
        // Create blob URL for display
        const byteCharacters = atob(imageData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);
        
        console.log('✅ Gemini image generated successfully!');
        
        return {
          success: true,
          imageUrl: blobUrl,
          imageData: imageData, // base64
          mimeType: mimeType
        };
      }
    }
    
    // If no image in response, return error
    return {
      success: false,
      error: 'No image data in Gemini response'
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
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 600
      }
    });

    const enhancementPrompt = `
You are an expert at creating ultra-detailed, photorealistic image generation prompts for Gemini 2.5 Flash Image AI.

MANDATORY REQUIREMENTS FOR ALL IMAGES:
- Setting: Sri Lankan marine/coastal environment
- People: Sri Lankan scientists, researchers, or fishermen (South Asian features, appropriate skin tones)
- Branding: NARA (National Aquatic Resources Research & Development Agency) visible context
- Quality: 8K ultra-HD, photorealistic, professional documentary photography
- Style: Government official documentation, National Geographic quality
- Atmosphere: Professional, authoritative, scientific excellence

Original description: "${basePrompt}"
Division context: ${divisionContext}

Create an incredibly detailed prompt that includes:

MANDATORY SRI LANKAN BRANDING:
- Sri Lankan national emblem or NARA logo visible (on equipment, buildings, uniforms, or banners)
- Sri Lankan flag colors (maroon/yellow/green/orange) subtly incorporated
- Tropical Sri Lankan coastal/marine environment (coconut palms, tropical waters, local architecture)
- South Asian people (Sri Lankan scientists, researchers, fishermen - authentic skin tones and features)
- Local context (Sinhala/Tamil/English signage if text visible, traditional boats alongside modern equipment)

VISUAL ULTRA-REALISM:
- 8K ultra-HD photorealistic quality, razor-sharp focus
- Exact equipment with visible brand names and model numbers
- Specific colors with RGB accuracy (e.g., "NARA navy blue #003366," "safety orange #FF6600")
- Materials: brushed stainless steel, polished glass, weathered wood, clear tropical water
- Scale: Precise measurements (e.g., "2.5 meter CTD rosette," "15cm Niskin bottles")
- Numbers: Specific counts (e.g., "3 scientists," "12 sample containers," "5 monitoring instruments")

PROFESSIONAL COMPOSITION:
- Camera: Full-frame DSLR with 24-70mm f/2.8 lens at f/5.6
- Shot Type: MEDIUM to WIDE environmental shots showing people in context (NOT close-ups or tight portraits)
- Camera Distance: 3-8 meters away from subjects to capture full scene and team interactions
- Framing: Rule of thirds with human subjects as PART of the scene, not the primary focus
- Depth of field: Selective focus with natural bokeh background blur
- Angle: Eye-level or slightly elevated for authority and clarity
- People Placement: Subjects working in midground with equipment in foreground and Sri Lankan environment in background
- Group Dynamics: Show team collaboration and interaction, multiple people visible at different depths
- Elements: Foreground (detailed equipment), midground (diverse team in action - 60-70% male, always include 1-2 females), background (Sri Lankan coastal landscape)

SRI LANKAN ENVIRONMENTAL CONTEXT:
- Time: Golden hour (warm tropical sunlight) or bright midday (harsh equatorial light with deep shadows)
- Weather: Clear tropical skies with cumulus clouds OR monsoon atmosphere with dramatic clouds
- Water: Turquoise Indian Ocean, brown river estuaries, or green lagoon waters characteristic of Sri Lanka
- Vegetation: Coconut palms, mangroves, tropical coastal flora
- Architecture: White colonial buildings, modern research facilities, traditional fishing villages

HUMAN SUBJECTS (MUST BE SRI LANKAN):
- Ethnicity: South Asian (Sinhalese, Tamil, Burgher) with authentic Sri Lankan features and skin tones
- Group Composition: ALWAYS include 3-5 people with diverse gender representation (e.g., 3 males and 1-2 females, or 4 males and 1 female)
- Female Presence: MANDATORY - at least ONE female scientist/researcher MUST be visible in every image
- Male to Female Ratio: More males than females (approximately 60-70% male, 30-40% female)
- Camera Distance: IMPORTANT - Keep people at MEDIUM to WIDE shot distance (3-8 meters away from camera)
- Framing: NEVER close-up of faces - always show full body or 3/4 body shots in environmental context
- Face Visibility: Faces should be clearly visible but NOT the main focus - keep them as part of the scene
- Attire: White lab coats with NARA patches, safety vests with NARA logo, traditional sarongs for fishermen
- Activities: Professional scientific work with proper technique and posture, team collaboration
- Expressions: Focused, concentrated, professional (showing scientific dedication)
- Details: Safety glasses, gloves, clipboards with NARA letterhead, ID badges
- Natural Poses: People working together, discussing, examining equipment (not posed for camera)

GOVERNMENT/OFFICIAL AESTHETIC:
- Professional, authoritative, trustworthy appearance
- Clean, organized, well-maintained facilities and equipment
- Official government research institution branding
- Scientific rigor and excellence visible
- International standards compliance evident

TECHNICAL PHOTOGRAPHY SPECIFICATIONS:
- Resolution: 8K (7680x4320), ultra-high definition
- Color space: Adobe RGB, professionally color-graded
- Sharpness: Tack-sharp main subject, natural bokeh background
- Noise: Zero digital noise, clean image
- Dynamic range: HDR-like with preserved highlights and shadow detail
- Style: National Geographic expedition photography meets official government documentation
- Post-processing: Natural color correction, professional retouching, enhanced clarity

OUTPUT FORMAT: Return ONLY the ultra-detailed, ultra-realistic enhanced prompt as ONE comprehensive paragraph (5-8 sentences). Include ALL mandatory Sri Lankan branding requirements, photorealistic details, and government official aesthetic. No explanations, just the perfect prompt.
`;

    const result = await model.generateContent(enhancementPrompt);
    const response = await result.response;
    const enhancedPrompt = response.text().trim();
    
    console.log('✅ Gemini enhanced prompt:', enhancedPrompt.substring(0, 100) + '...');
    
    return {
      success: true,
      enhancedPrompt,
      originalPrompt: basePrompt
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
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1000
      }
    });

    const suggestionPrompt = `
You are helping create image prompts for a marine research institute's website.

Division: ${divisionName}
Focus Area: ${focusArea}

Generate 4 detailed, specific image prompts for AI image generation that would be perfect for this division's hero section carousel.

Each prompt should:
- Be 2-3 sentences long
- Include specific equipment, tools, and activities
- Mention relevant species, technologies, or methodologies
- Include professional photography style details
- Be visually striking and professional
- Relate to actual marine research work

Format: Return 4 prompts numbered 1-4, one per line.
`;

    const result = await model.generateContent(suggestionPrompt);
    const response = await result.response;
    const suggestions = response.text();
    
    return {
      success: true,
      suggestions
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

