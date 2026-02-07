import OpenAI from 'openai';

/**
 * ChatGPT-Powered Podcast Script Generator
 * Creates natural, engaging conversations using GPT-4
 */

/**
 * Initialize OpenAI client
 */
function getOpenAIClient(apiKey) {
  if (!apiKey) {
    throw new Error('OpenAI API key is required. Please configure it in Admin → AI API Configuration.');
  }

  return new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // For client-side use (consider moving to backend for production)
  });
}

/**
 * Generate intelligent podcast script using ChatGPT
 * @param {string} title - Podcast title
 * @param {string} content - Source content to convert to conversation
 * @param {object} options - Generation options
 * @returns {Promise<string>} - Generated script
 */
export async function generateIntelligentScript(title, content, options = {}) {
  const {
    apiKey,
    style = 'conversational', // conversational, interview, storytelling, debate
    length = 'medium', // short (5min), medium (7-10min), long (15min+)
    casualness = 'high', // low (formal), medium (professional-friendly), high (casual)
    technicalDepth = 'medium', // low (simple), medium (accessible), high (detailed)
    hostName = 'Alex',
    guestName = 'Sam'
  } = options;

  console.log('🤖 Generating intelligent script with ChatGPT...');
  console.log('🔑 API Key present:', apiKey ? `Yes (${apiKey.substring(0, 7)}...)` : 'NO!');
  console.log('📊 Settings:', { style, length, casualness, technicalDepth });
  
  try {
    const client = getOpenAIClient(apiKey);

    // Build context-aware system prompt
    const systemPrompt = buildSystemPrompt(style, casualness, technicalDepth, hostName, guestName);
    
    // Build user prompt with content
    const userPrompt = buildUserPrompt(title, content, length);

    console.log('📝 Sending to ChatGPT...');
    
    console.log('📤 Sending request to OpenAI API...');
    
    const response = await client.chat.completions.create({
      model: 'gpt-4-turbo', // ✅ Using stable GPT-4 Turbo (GPT-5 requires tier 5 access)
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: getTemperatureForStyle(style, casualness),
      max_tokens: getMaxTokensForLength(length),
      presence_penalty: 0.6, // Encourage variety
      frequency_penalty: 0.3 // Reduce repetition
    });
    
    console.log('📥 Received response from OpenAI');

    const script = response.choices[0].message.content;
    
    console.log('✅ ChatGPT script generated!');
    console.log(`📊 Tokens used: ${response.usage.total_tokens}`);
    console.log(`💰 Estimated cost: $${(response.usage.total_tokens / 1000 * 0.03).toFixed(4)}`);

    return script;

  } catch (error) {
    console.error('❌ ChatGPT error details:', {
      message: error.message,
      status: error.status,
      type: error.type,
      code: error.code,
      fullError: error
    });
    
    // Handle specific OpenAI errors
    if (error.status === 401 || error.message?.includes('Incorrect API key') || error.message?.includes('invalid_api_key')) {
      throw new Error('❌ Invalid OpenAI API key!\n\nPlease configure your API key:\n1. Go to https://platform.openai.com/api-keys\n2. Create a new key\n3. Save it in Admin → AI API Configuration');
    } else if (error.status === 429 || error.message?.includes('rate_limit')) {
      throw new Error('⏳ Rate limit exceeded! Please wait a minute and try again.');
    } else if (error.message?.includes('quota') || error.message?.includes('insufficient_quota')) {
      throw new Error('💳 OpenAI quota exceeded! Please add credits to your OpenAI account at https://platform.openai.com/account/billing');
    } else if (error.message?.includes('model_not_found')) {
      throw new Error('🤖 Model not available. Your OpenAI account may not have access to GPT-4. Try upgrading your OpenAI plan.');
    } else if (!navigator.onLine) {
      throw new Error('📡 No internet connection! Please check your connection.');
    } else {
      throw new Error(`ChatGPT API Error: ${error.message || 'Unknown error'}\n\nFull details logged to console.`);
    }
  }
}

/**
 * Build system prompt based on style and parameters
 */
function buildSystemPrompt(style, casualness, technicalDepth, hostName, guestName) {
  const basePrompt = `You are an elite podcast scriptwriter who creates captivating, authentic conversations that sound indistinguishable from real human dialogue. Your scripts have won awards for their natural flow and engagement.

**🎯 YOUR MISSION:** Create a mesmerizing conversation that listeners won't want to pause.

**👥 CHARACTERS:**
- **Host (${hostName}):** Curious, enthusiastic, asks great questions, reacts authentically, builds rapport, makes listeners feel included
- **Guest (${guestName}):** Knowledgeable expert with personality, shares insights through stories, explains complex ideas simply, genuinely passionate

**📝 CRITICAL FORMATTING:**
Format: "Host: [dialogue]" and "Guest: [dialogue]"
- Each line = one natural speaking turn
- NO parentheticals like (laughs) or [pause]
- Let the words convey emotion

**🎭 NATURAL CONVERSATION TECHNIQUES:**
1. **Use Conversational Connectors:**
   - "You know what's interesting?"
   - "Here's the thing though..."
   - "So get this..."
   - "And here's why that matters..."

2. **Include Authentic Reactions:**
   - Surprise: "Wait, really?", "No way!", "Seriously?"
   - Agreement: "Exactly!", "Right!", "Absolutely"
   - Thinking: "Hmm...", "Well...", "Let me think..."
   - Excitement: "Wow!", "That's amazing!", "I love that!"

3. **Build Rapport:**
   - Host references previous points: "Like you mentioned earlier..."
   - They finish each other's thoughts occasionally
   - Share brief personal connections: "I've always wondered about that"

4. **Vary Speech Patterns:**
   - Mix short punchy statements with longer explanations
   - Use questions to maintain engagement
   - Include rhetorical questions: "Right?", "You know?"

5. **Show Don't Tell:**
   - Use specific examples and analogies
   - Paint mental pictures: "Imagine if...", "Picture this..."
   - Share mini-stories, not just facts

**🚫 AVOID:**
- Robotic turn-taking
- Perfect, scripted speeches
- Listing facts without context
- Using "interesting" or "fascinating" too much
- Obvious transitions like "Let's talk about..."

`;

  // Style-specific instructions
  const styleInstructions = {
    conversational: `**🎨 STYLE: Conversational (Like Friends at Coffee)**
- Create that "two friends discovering something cool together" vibe
- Lots of back-and-forth, building on each other's ideas
- Use collaborative language: "Yeah, and also...", "Oh! That reminds me..."
- Natural interruptions (polite ones): "Wait, before you continue..."
- Clarifying questions: "So what you're saying is..."
- Shared excitement: Both get enthusiastic about discoveries
- Use "we" language: "So we're seeing that...", "What we're talking about here..."
- Include moments of realization: "Ohhh, that makes sense now!"`,

    interview: `**🎤 STYLE: Interview (Joe Rogan / Lex Fridman)**
- Host: Ask thoughtful, open-ended questions that let guest shine
- Guest: Provide rich, detailed answers with examples and stories
- Host: Active listening - "That's fascinating because...", "Walk me through..."
- Build depth progressively - start broad, dive deeper
- Host occasionally plays devil's advocate or asks clarifying questions
- Use phrases like: "Help me understand...", "What's the bigger picture here?"
- Guest should feel comfortable taking time to explain thoroughly
- Host shows genuine curiosity and follow-up questions`,

    storytelling: `**📖 STYLE: Storytelling (This American Life / Radiolab)**
- Guest leads with a narrative arc (beginning → tension → resolution)
- Use vivid, sensory details: "Picture this...", "There we were..."
- Build suspense: Reveal information gradually
- Host: React with genuine surprise, curiosity, anticipation
- Use pacing: Slow down for important moments, speed up for transitions
- Include specific details that make it real: dates, names, locations
- Host interrupts occasionally: "Wait, what?", "How did you feel?"
- Create emotional connection - this isn't just facts, it's an experience`,

    debate: `**⚖️ STYLE: Friendly Debate (Smartly Disagree)**
- Present genuinely different perspectives on the topic
- Respectful disagreement: "I hear you, but have you considered..."
- Use evidence and reasoning, not just opinions
- Find common ground: "We both agree that X, but where we differ is..."
- Host/Guest challenge each other constructively
- Use phrases: "Devil's advocate here...", "Here's another way to look at it..."
- Acknowledge good points: "That's a fair point", "You're right about that"
- End by synthesizing both views into a richer understanding`
  };

  // Casualness level
  const casualnessInstructions = {
    low: `**Tone: Professional & Formal**
- Polished language
- Minimal casual words
- Clear, articulate speech`,

    medium: `**Tone: Professional & Friendly**
- Mix of formal and casual
- Some "Yeah", "Right", "Interesting"
- Accessible but professional`,

    high: `**Tone: Casual & Natural**
- Lots of casual words: "Wow", "Yeah", "Right?", "Hmm"
- Natural speech patterns
- Like friends talking over coffee`
  };

  // Technical depth
  const technicalInstructions = {
    low: `**Complexity: Simple & Accessible**
- Explain everything in simple terms
- Use analogies
- Avoid jargon
- "Think of it like..." explanations`,

    medium: `**Complexity: Accessible with Detail**
- Balance technical and simple language
- Explain complex concepts clearly
- Some terminology with explanations`,

    high: `**Complexity: Detailed & Technical**
- Use proper terminology
- Detailed explanations
- Assume some background knowledge`
  };

  return basePrompt +
    styleInstructions[style] + '\n\n' +
    casualnessInstructions[casualness] + '\n\n' +
    technicalInstructions[technicalDepth] + '\n\n' +
    `**Important:**
- Make it sound NATURAL, not scripted
- Include emotional reactions
- Vary sentence length
- Add thinking pauses
- Make them sound excited about the topic
- NO robotic or report-reading style`;
}

/**
 * Build user prompt with content
 */
function buildUserPrompt(title, content, length) {
  const lengthInstructions = {
    short: '**Target:** 800-1000 words (~5-6 minutes). Focus on key insights only. Punchy and energetic.',
    medium: '**Target:** 1200-1500 words (~8-10 minutes). Good depth with examples. Well-paced exploration.',
    long: '**Target:** 2000-2500 words (~15-18 minutes). Deep dive with stories, examples, implications. Rich discussion.'
  };

  return `🎙️ **PODCAST TOPIC:** "${title}"

📚 **SOURCE MATERIAL TO DISCUSS:**
${content}

⏱️ **LENGTH REQUIREMENT:**
${lengthInstructions[length]}

🎯 **ESSENTIAL STRUCTURE:**

**1. HOOK (First 30 seconds):**
- Start with something attention-grabbing
- Maybe a surprising fact, question, or bold statement
- NO boring intros like "Hey everyone, today we're talking about..."
- Examples: "You know what blew my mind?", "So I just learned something wild...", "Okay, this is fascinating..."

**2. INTRODUCTION (Context Setting):**
- Briefly establish what you're discussing and why it matters
- Host and Guest establish their relationship naturally
- Create listener buy-in: Why should they care?

**3. MAIN CONTENT (The Meat):**
- Break complex ideas into digestible chunks
- Use the "explain → example → implication" pattern
- Host asks questions that listeners would ask
- Guest provides insights through stories and analogies
- Build progressively - don't dump everything at once
- Include "aha moments" where things click into place

**4. PRACTICAL TAKEAWAYS:**
- What does this mean for the listener?
- Any actionable insights?
- Real-world applications or implications

**5. MEMORABLE CONCLUSION:**
- Synthesize the key insight(s)
- End on a thought-provoking note or call-to-action
- Natural sign-off that feels complete
- NO abrupt endings - wrap it up satisfyingly

💡 **PRO TIPS:**
- Lead with your best material, not background info
- Use callbacks: Reference earlier points to show continuity
- Vary energy levels: Mix high-energy moments with thoughtful reflection
- Include at least one memorable analogy or example
- Make listeners feel smarter, not confused
- If explaining technical concepts, use the "ELI5" approach first, then layer complexity

⚡ **ENGAGEMENT TECHNIQUES:**
- Pose questions to the listener: "Have you ever wondered..."
- Create anticipation: "Here's what's really interesting..."
- Use pattern interrupts: Surprise, contradiction, unexpected connections
- Include mini-cliffhangers before revealing insights

🎭 **NOW CREATE THE CONVERSATION:**
Write the complete podcast script following ALL guidelines above. Make it sound like two real people having an authentic, engaging conversation about this fascinating topic. Every line should feel natural and purposeful.

Start now:`;
}

/**
 * Get temperature based on style - Higher temp = more creative/varied output
 */
function getTemperatureForStyle(style, casualness) {
  const baseTemp = {
    conversational: 0.85,  // High creativity for natural flow
    interview: 0.75,       // Balanced - thoughtful but varied
    storytelling: 0.95,    // Very high for engaging narratives
    debate: 0.8           // Creative for arguments, but coherent
  }[style] || 0.85;

  // Adjust for casualness (casual = more creative/natural)
  const casualnessAdjustment = {
    low: -0.05,   // Slightly lower for formal
    medium: 0,    // Baseline
    high: 0.1
  }[casualness] || 0;

  return Math.min(1, Math.max(0, baseTemp + casualnessAdjustment));
}

/**
 * Get max tokens based on length - Generous limits for complete, quality output
 */
function getMaxTokensForLength(length) {
  return {
    short: 2000,    // ~5-6 mins → need room for natural conversation
    medium: 3000,   // ~8-10 mins → detailed with examples
    long: 5000      // ~15-18 mins → comprehensive deep dive
  }[length] || 3000;
}

/**
 * Estimate cost for generation
 */
export function estimateCost(contentLength) {
  // GPT-4 Turbo pricing (as of 2024):
  // Input: $0.01 per 1K tokens
  // Output: $0.03 per 1K tokens
  
  const estimatedInputTokens = Math.ceil(contentLength / 3); // rough estimate
  const estimatedOutputTokens = 2000; // average podcast script
  
  const inputCost = (estimatedInputTokens / 1000) * 0.01;
  const outputCost = (estimatedOutputTokens / 1000) * 0.03;
  
  return {
    total: inputCost + outputCost,
    input: inputCost,
    output: outputCost,
    tokens: estimatedInputTokens + estimatedOutputTokens
  };
}

export default {
  generateIntelligentScript,
  estimateCost
};
