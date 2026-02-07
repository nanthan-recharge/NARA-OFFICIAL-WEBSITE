/**
 * AWS Polly Podcast Generation Service
 * Real AI-powered NotebookLM-style podcast generation using AWS Polly
 */

import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
import { db, storage } from '../config/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// ========== MULTILINGUAL VOICE SYSTEM =========
// Comprehensive voice support for English, Tamil, and Sinhala

const MULTILINGUAL_VOICES = {
  'en-US': {
    name: 'English (US)',
    voices: {
      host: {
        voice: 'Joanna',      // Female, professional, warm
        engine: 'neural',
        language: 'en-US',
        gender: 'Female'
      },
      guest: {
        voice: 'Matthew',     // Male, friendly, engaging  
        engine: 'neural',
        language: 'en-US',
        gender: 'Male'
      },
      alternatives: [
        { voice: 'Kendra', engine: 'neural', gender: 'Female', style: 'friendly' },
        { voice: 'Joey', engine: 'neural', gender: 'Male', style: 'energetic' },
        { voice: 'Ruth', engine: 'neural', gender: 'Female', style: 'soothing' },
        { voice: 'Stephen', engine: 'neural', gender: 'Male', style: 'authoritative' }
      ]
    }
  },
  'ta-IN': {
    name: 'Tamil (India)',
    voices: {
      host: {
        voice: 'Aditi',       // Female, Indian English with Tamil support
        engine: 'standard',   // Note: Neural not available for Tamil yet
        language: 'ta-IN',
        gender: 'Female'
      },
      guest: {
        voice: 'Raveena',     // Female, Indian English (alternative)
        engine: 'standard',
        language: 'ta-IN',
        gender: 'Female'
      },
      alternatives: [
        { voice: 'Aditi', engine: 'standard', gender: 'Female', style: 'clear' }
      ]
    }
  },
  'si-LK': {
    name: 'Sinhala (Sri Lanka)',
    voices: {
      host: {
        voice: 'Aditi',       // Best available for Sinhala
        engine: 'standard',
        language: 'en-IN',    // Using Indian English as base
        gender: 'Female'
      },
      guest: {
        voice: 'Raveena',
        engine: 'standard',
        language: 'en-IN',
        gender: 'Female'
      },
      alternatives: []
    }
  }
};

// Legacy support - defaults to English
const CONVERSATION_VOICES = MULTILINGUAL_VOICES['en-US'].voices;

// Enhanced voice library with all options
const VOICE_LIBRARY = {
  // English Voices
  professional: { voice: 'Joanna', engine: 'neural', gender: 'Female', language: 'en-US' },
  friendly: { voice: 'Kendra', engine: 'neural', gender: 'Female', language: 'en-US' },
  energetic: { voice: 'Joey', engine: 'neural', gender: 'Male', language: 'en-US' },
  authoritative: { voice: 'Matthew', engine: 'neural', gender: 'Male', language: 'en-US' },
  soothing: { voice: 'Ruth', engine: 'neural', gender: 'Female', language: 'en-US' },
  // International
  british: { voice: 'Amy', engine: 'neural', gender: 'Female', language: 'en-GB' },
  australian: { voice: 'Nicole', engine: 'neural', gender: 'Female', language: 'en-AU' },
  indian: { voice: 'Aditi', engine: 'standard', gender: 'Female', language: 'en-IN' },
  // Tamil
  tamil: { voice: 'Aditi', engine: 'standard', gender: 'Female', language: 'ta-IN' },
  // Sinhala (using Indian English as best approximation)
  sinhala: { voice: 'Aditi', engine: 'standard', gender: 'Female', language: 'en-IN' }
};

/**
 * Get voice configuration based on language
 * @param {string} language - Language code (en-US, ta-IN, si-LK)
 * @returns {object} Voice configuration for host and guest
 */
function getVoicesForLanguage(language = 'en-US') {
  const langConfig = MULTILINGUAL_VOICES[language] || MULTILINGUAL_VOICES['en-US'];
  console.log(`🌍 Selected language: ${langConfig.name}`);
  console.log(`🎤 Host voice: ${langConfig.voices.host.voice}`);
  console.log(`🎤 Guest voice: ${langConfig.voices.guest.voice}`);
  return langConfig.voices;
}

/**
 * Export available languages for UI
 */
export function getAvailableLanguages() {
  return Object.keys(MULTILINGUAL_VOICES).map(code => ({
    code,
    name: MULTILINGUAL_VOICES[code].name,
    voices: MULTILINGUAL_VOICES[code].voices
  }));
}

/**
 * Split text into chunks to avoid AWS Polly character limit
 * @param {string} text - Text to split
 * @param {number} maxLength - Maximum characters per chunk
 * @returns {string[]} - Array of text chunks
 */
function splitTextIntoChunks(text, maxLength) {
  if (text.length <= maxLength) {
    return [text];
  }

  const chunks = [];
  const sentences = text.split(/(?<=[.!?])\s+/); // Split on sentence boundaries
  let currentChunk = '';

  for (const sentence of sentences) {
    // If single sentence is too long, split by paragraphs or force split
    if (sentence.length > maxLength) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }
      // Force split long sentence
      for (let i = 0; i < sentence.length; i += maxLength) {
        chunks.push(sentence.substring(i, i + maxLength));
      }
      continue;
    }

    // Add sentence to current chunk if it fits
    if ((currentChunk + ' ' + sentence).length <= maxLength) {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    } else {
      // Current chunk is full, start new one
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = sentence;
    }
  }

  // Add remaining chunk
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter(chunk => chunk.length > 0);
}

/**
 * Create AWS Polly client with credentials from Firebase
 */
async function createPollyClient() {
  try {
    // Get AWS credentials from Firebase
    const configRef = doc(db, 'admin_config', 'ai_api_keys');
    const configSnap = await getDoc(configRef);

    if (!configSnap.exists()) {
      throw new Error('AWS API configuration not found. Please configure AWS credentials in Admin Panel.');
    }

    const config = configSnap.data();
    const awsConfig = config.aws;

    if (!awsConfig || !awsConfig.enabled) {
      throw new Error('AWS Polly is not enabled. Please enable it in Admin Panel.');
    }

    if (!awsConfig.accessKeyId || !awsConfig.secretAccessKey) {
      throw new Error('AWS credentials are missing. Please add them in Admin Panel.');
    }

    // ========== ENHANCED: Better credential validation ==========
    console.log('🔐 AWS Config:', {
      hasAccessKey: !!awsConfig.accessKeyId,
      hasSecretKey: !!awsConfig.secretAccessKey,
      region: awsConfig.region || 'us-east-1',
      accessKeyStart: awsConfig.accessKeyId?.substring(0, 8)
    });

    // Validate credentials format
    if (!awsConfig.accessKeyId.startsWith('AKIA')) {
      throw new Error('Invalid AWS Access Key format. Must start with "AKIA"');
    }

    // Force us-east-1 region for better compatibility
    const region = 'us-east-1'; // Most reliable region for Polly
    console.log(`🌍 Using AWS region: ${region}`);

    // Create Polly client
    const client = new PollyClient({
      region: region,
      credentials: {
        accessKeyId: awsConfig.accessKeyId.trim(),
        secretAccessKey: awsConfig.secretAccessKey.trim()
      }
    });

    console.log('✅ AWS Polly client created successfully');
    return client;
  } catch (error) {
    console.error('❌ Error creating Polly client:', error);
    
    // Check for specific errors
    if (error.message.includes('configuration not found')) {
      throw new Error('AWS API not configured. Please go to Admin Panel → AI API Configuration and add your AWS credentials.');
    } else if (error.message.includes('not enabled')) {
      throw new Error('AWS Polly is not enabled. Please enable it in Admin Panel → AI API Configuration.');
    } else if (error.name === 'CredentialsProviderError') {
      throw new Error('Invalid AWS credentials. Please check your Access Key ID and Secret Access Key in Admin Panel.');
    } else if (error.name === 'ThrottlingException') {
      throw new Error('AWS rate limit exceeded. Please wait a moment and try again.');
    } else {
      throw new Error(`AWS Polly error: ${error.message}`);
    }
  }
}

/**
 * Convert text to SSML with natural pauses and emphasis (Neural-voice compatible)
 * Adds casual speech patterns for realistic conversation
 */
function textToConversationalSSML(text, speaker = 'host') {
  // Escape special XML characters
  text = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  let ssml = `<speak>`;
  
  // Add natural thinking pauses for casual words
  text = text.replace(/\bHmm\b/g, 'Hmm<break time="400ms"/>');
  text = text.replace(/\bUh\b/g, 'Uh<break time="300ms"/>');
  text = text.replace(/\bUm\b/g, 'Um<break time="300ms"/>');
  text = text.replace(/\bWell\b/g, 'Well<break time="350ms"/>');
  text = text.replace(/\bSo\b/g, 'So<break time="250ms"/>');
  text = text.replace(/\bOkay\b/g, 'Okay<break time="300ms"/>');
  text = text.replace(/\bAlright\b/g, 'Alright<break time="300ms"/>');
  text = text.replace(/\bYeah\b/g, 'Yeah<break time="250ms"/>');
  text = text.replace(/\bRight\?\b/g, 'Right?<break time="500ms"/>');
  text = text.replace(/\bI know!\b/g, 'I know!<break time="400ms"/>');
  text = text.replace(/\bWow\b/g, 'Wow<break time="450ms"/>');
  
  // Add natural pauses at punctuation
  ssml += text;
  ssml = ssml.replace(/[.!]/g, '$& <break time="550ms"/> ');
  ssml = ssml.replace(/[,;]/g, '$& <break time="350ms"/> ');
  ssml = ssml.replace(/[:]/g, '$& <break time="300ms"/> ');
  ssml = ssml.replace(/\?/g, '$& <break time="700ms"/> '); // Longer pause after questions
  ssml = ssml.replace(/\n/g, ' <break time="500ms"/> ');
  
  // Add pauses before important transitions
  ssml = ssml.replace(/\bbasically\b/gi, '<break time="250ms"/>basically');
  ssml = ssml.replace(/\bactually\b/gi, '<break time="250ms"/>actually');
  ssml = ssml.replace(/\bhonestly\b/gi, '<break time="250ms"/>honestly');
  ssml = ssml.replace(/\binteresting\b/gi, '<break time="200ms"/>interesting');

  ssml += `</speak>`;

  console.log('✅ Generated Natural SSML with casual speech patterns');
  return ssml;
}

/**
 * Auto-generate NotebookLM-style conversation from content
 * Creates NATURAL, CASUAL dialogue like real people talking
 * @param {string} title - Podcast title
 * @param {string} content - Content to convert
 * @param {string} style - Conversation style: 'conversational' (default), 'interview', 'debate', 'storytelling'
 */
export function generateConversationalScript(title, content, style = 'conversational') {
  // Route to appropriate template
  switch(style) {
    case 'interview':
      return generateInterviewScript(title, content);
    case 'debate':
      return generateDebateScript(title, content);
    case 'storytelling':
      return generateStorytellingScript(title, content);
    case 'conversational':
    default:
      return generateConversationalStyleScript(title, content);
  }
}

/**
 * TEMPLATE 1: CONVERSATIONAL STYLE (Default)
 * Casual, friendly discussion between two people
 */
function generateConversationalStyleScript(title, content) {
  // Natural conversation starters
  const intros = [
    `Host: Hey everyone! Welcome back to the show. Today we're diving into something really interesting - ${title}. I've got our expert here to break it down for us.\n\nGuest: Hey! Thanks for having me. Yeah, I'm really excited to talk about this.\n\n`,
    `Host: Alright, so today we're talking about ${title}, and honestly, I've been looking forward to this one.\n\nGuest: Right? It's fascinating stuff. Where do you want to start?\n\n`,
    `Host: Welcome! Today's topic is ${title}. I have to say, when I first read about this, I was like "wow, this is huge."\n\nGuest: Oh absolutely! It's one of those things that sounds simple but there's so much depth to it.\n\n`
  ];

  let script = intros[Math.floor(Math.random() * intros.length)];

  // Split content intelligently
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 20);
  
  // Natural conversational elements
  const transitions = [
    "Host: So, tell me more about that.\n\nGuest: ",
    "Host: Wait, that's interesting. Can you elaborate?\n\nGuest: Yeah, so ",
    "Host: Hmm, okay. What else should people know?\n\nGuest: ",
    "Host: Right, right. And how does that work exactly?\n\nGuest: ",
    "Host: I see. So basically...\n\nGuest: Exactly! ",
  ];

  const reactions = [
    "Host: Wow, that's actually pretty cool.\n\nGuest: Right? ",
    "Host: Okay, hold on. That's mind-blowing.\n\nGuest: I know! ",
    "Host: No way! Really?\n\nGuest: Yeah! ",
    "Host: Interesting... I never thought about it that way.\n\nGuest: ",
    "Host: Makes sense. So...\n\nGuest: ",
  ];

  const questions = [
    "Host: So what does that mean for people?\n\nGuest: ",
    "Host: Why is that important?\n\nGuest: ",
    "Host: How does that actually work?\n\nGuest: ",
    "Host: What's the big deal about that?\n\nGuest: ",
    "Host: Can you give us an example?\n\nGuest: ",
  ];

  // Build natural conversation
  paragraphs.forEach((para, index) => {
    // Summarize/rephrase content naturally
    const sentences = para.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    if (index === 0) {
      // First paragraph - set the scene
      script += `Host: So, let's start with the basics. What are we talking about here?\n\n`;
      script += `Guest: Okay, so basically, ${sentences[0].trim().toLowerCase()}. ${sentences[1] || ''}\n\n`;
    } else {
      // Use variety of transitions
      const transType = index % 4;
      
      if (transType === 0 && questions.length > 0) {
        // Ask a question
        const q = questions[index % questions.length];
        script += q + sentences.slice(0, 2).join('. ').trim() + '.\n\n';
      } else if (transType === 1 && reactions.length > 0) {
        // React naturally
        const r = reactions[index % reactions.length];
        script += r + sentences.slice(0, 2).join('. ').trim() + '.\n\n';
      } else {
        // Natural transition
        const t = transitions[index % transitions.length];
        script += t + sentences.slice(0, 2).join('. ').trim() + '.\n\n';
      }

      // Add occasional back-and-forth
      if (index % 3 === 0 && sentences.length > 2) {
        script += `Host: Oh, interesting. So you're saying ${sentences[2].trim().toLowerCase()}?\n\n`;
        script += `Guest: Exactly! That's the key point here.\n\n`;
      }
    }
  });

  // Natural endings
  const endings = [
    `Host: This has been awesome. Thanks so much for breaking this down for us!\n\nGuest: My pleasure! Happy to chat about this anytime.\n\nHost: And hey, if you enjoyed this, don't forget to subscribe. We've got more great content coming up!\n\n`,
    `Host: Wow, I learned so much today. Thanks for joining us!\n\nGuest: Thanks for having me! This was fun.\n\nHost: Alright everyone, that's it for today. Catch you next time!\n\n`,
    `Host: This was really insightful. Appreciate you taking the time!\n\nGuest: Anytime! Thanks for the great questions.\n\nHost: See you all next episode!\n\n`
  ];

  script += endings[Math.floor(Math.random() * endings.length)];

  return script;
}

/**
 * TEMPLATE 2: INTERVIEW STYLE
 * Professional Q&A format with thoughtful questions
 */
function generateInterviewScript(title, content) {
  let script = `Host: Welcome to NARA Podcasts. I'm your host, and today I'm thrilled to have an expert joining us to discuss ${title}. Welcome to the show!\n\nGuest: Thank you for having me. It's a pleasure to be here.\n\nHost: Let's dive right in. For our listeners who might be unfamiliar, can you give us an overview of what we're discussing today?\n\n`;

  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 20);
  
  const interviewQuestions = [
    "Host: That's fascinating. Can you tell us more about",
    "Host: I'd love to hear your perspective on",
    "Host: What led you to study",
    "Host: How does this impact",
    "Host: What's the most important thing people should understand about",
    "Host: Can you walk us through",
    "Host: What are the implications of",
    "Host: How do you see this developing in the future",
  ];

  paragraphs.forEach((para, index) => {
    const sentences = para.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    if (index === 0) {
      script += `Guest: ${sentences.slice(0, 2).join('. ')}.\n\n`;
    } else {
      const question = interviewQuestions[index % interviewQuestions.length];
      script += `${question} ${sentences[0].trim().toLowerCase()}?\n\n`;
      script += `Guest: That's an excellent question. ${sentences.slice(0, 2).join('. ')}.\n\n`;
      
      // Add follow-up occasionally
      if (index % 2 === 0 && sentences.length > 2) {
        script += `Host: Could you elaborate on that last point?\n\n`;
        script += `Guest: Certainly. ${sentences[2] || ''}\n\n`;
      }
    }
  });

  script += `Host: This has been incredibly informative. Thank you so much for sharing your expertise with us today.\n\nGuest: My pleasure. Thank you for having me and for asking such thoughtful questions.\n\nHost: And thank you to our listeners for joining us. Until next time!\n\n`;
  
  return script;
}

/**
 * TEMPLATE 3: DEBATE STYLE
 * Presenting multiple perspectives with respectful discourse
 */
function generateDebateScript(title, content) {
  let script = `Host: Welcome to NARA Podcasts. Today we're exploring different perspectives on ${title}. This is a complex topic with valid viewpoints on multiple sides.\n\nGuest: Thanks for having me. I think it's important we have these thoughtful discussions.\n\nHost: Absolutely. Let's start by establishing the key questions at stake here.\n\n`;

  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 20);
  
  const debateFrames = [
    { host: "Host: One perspective holds that", guest: "Guest: While I see that argument, consider this:" },
    { host: "Host: But what about the concern that", guest: "Guest: That's a fair point. However," },
    { host: "Host: Some might argue", guest: "Guest: I understand that view, but" },
    { host: "Host: The counterargument would be", guest: "Guest: That's true, yet we must also consider" },
    { host: "Host: Critics often point out that", guest: "Guest: Valid criticism. At the same time," },
  ];

  paragraphs.forEach((para, index) => {
    const sentences = para.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const frame = debateFrames[index % debateFrames.length];
    
    script += `${frame.host} ${sentences[0].trim().toLowerCase()}.\n\n`;
    script += `${frame.guest} ${sentences.slice(1, 3).join('. ')}.\n\n`;
    
    // Add clarification occasionally
    if (index % 2 === 0 && sentences.length > 3) {
      script += `Host: So you're saying there's a balance to be struck here?\n\nGuest: Exactly. ${sentences[3] || 'We need to consider all angles.'}\n\n`;
    }
  });

  script += `Host: I think we've explored this from multiple angles today. It's clear this is a nuanced issue.\n\nGuest: Absolutely. I appreciate the opportunity to have this balanced discussion.\n\nHost: Thank you for joining us and helping our listeners think critically about ${title}.\n\n`;
  
  return script;
}

/**
 * TEMPLATE 4: STORYTELLING STYLE
 * Narrative format with dramatic structure
 */
function generateStorytellingScript(title, content) {
  let script = `Host: Welcome to NARA Podcasts. Today's episode is special. We're going to tell you a story about ${title}. A story that might surprise you.\n\nGuest: I've been looking forward to sharing this.\n\nHost: So, where does our story begin?\n\n`;

  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 20);
  
  const narrativeTransitions = [
    "Guest: It started with",
    "Guest: And then,",
    "Guest: But here's where it gets interesting.",
    "Guest: What happened next was unexpected.",
    "Guest: This is the turning point.",
    "Guest: As time went on,",
    "Guest: The crucial moment came when",
  ];

  const hostReactions = [
    "Host: No way. What happened next?",
    "Host: I can't believe that. Tell me more.",
    "Host: That's incredible. And then?",
    "Host: Wait, so what did that mean?",
    "Host: This is fascinating. Continue.",
  ];

  paragraphs.forEach((para, index) => {
    const sentences = para.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    if (index < narrativeTransitions.length) {
      script += `${narrativeTransitions[index]} ${sentences.slice(0, 2).join('. ')}.\n\n`;
    } else {
      script += `Guest: ${sentences.slice(0, 2).join('. ')}.\n\n`;
    }
    
    // Add host reactions to maintain engagement
    if (index % 2 === 1 && index < paragraphs.length - 1) {
      const reaction = hostReactions[Math.floor(Math.random() * hostReactions.length)];
      script += `${reaction}\n\n`;
    }
  });

  script += `Host: Wow. That's an amazing story. I think our listeners will find this as compelling as I do.\n\nGuest: I hope so. It's a story that needed to be told.\n\nHost: Thank you for sharing it with us. And to our listeners, thank you for joining us on this journey today.\n\n`;
  
  return script;
}

/**
 * Parse script into segments with speaker identification
 */
function parseConversationalScript(script) {
  const lines = script.split('\n').filter(line => line.trim().length > 0);
  const segments = [];

  lines.forEach(line => {
    // Check if line starts with "Host:" or "Guest:"
    const hostMatch = line.match(/^Host:\s*(.+)/i);
    const guestMatch = line.match(/^Guest:\s*(.+)/i);

    if (hostMatch) {
      segments.push({
        speaker: 'host',
        text: hostMatch[1].trim()
      });
    } else if (guestMatch) {
      segments.push({
        speaker: 'guest',
        text: guestMatch[1].trim()
      });
    } else if (line.trim().length > 0) {
      // If no speaker specified, default to host
      segments.push({
        speaker: 'host',
        text: line.trim()
      });
    }
  });

  return segments;
}

/**
 * Generate audio for a single segment using AWS Polly
 * @param {PollyClient} client - AWS Polly client
 * @param {object} segment - Segment with speaker and text
 * @param {object} voices - Voice configuration (host and guest)
 */
async function generateSegmentAudio(client, segment, voices = CONVERSATION_VOICES) {
  // ========== FIX: Use language-specific voices ==========
  const voiceConfig = voices[segment.speaker] || voices.host;
  
  // Log which voice is being used
  console.log(`🎤 Generating audio for ${segment.speaker}: ${voiceConfig.voice} (${voiceConfig.language})`);
  
  const ssml = textToConversationalSSML(segment.text, segment.speaker);

  const command = new SynthesizeSpeechCommand({
    Text: ssml,
    TextType: 'ssml',
    OutputFormat: 'mp3',
    VoiceId: voiceConfig.voice,
    Engine: voiceConfig.engine,
    LanguageCode: voiceConfig.language
  });

  try {
    const response = await client.send(command);

    // Convert audio stream to buffer
    const audioStream = response.AudioStream;
    const chunks = [];

    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }

    // Browser-compatible: Convert chunks to Uint8Array
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    
    console.log(`✅ Generated ${result.length} bytes for ${segment.speaker}`);
    return result;
  } catch (error) {
    console.error(`❌ Error generating audio for ${segment.speaker} (${voiceConfig.voice}):`, error);
    throw error;
  }
}

/**
 * Combine multiple audio segments into one file
 * Note: This is a simple concatenation. For professional production,
 * you might want to add crossfades and background music using ffmpeg
 */
function combineAudioSegments(audioSegments) {
  // Simple concatenation - Browser-compatible
  const totalLength = audioSegments.reduce((acc, segment) => acc + segment.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const segment of audioSegments) {
    result.set(segment, offset);
    offset += segment.length;
  }
  return result;
}

/**
 * Add intro/outro music (placeholder for future implementation)
 */
function addIntroOutroMusic(audioBuffer, settings) {
  // TODO: Implement music overlay using ffmpeg or similar
  // For now, just return the audio as-is
  return audioBuffer;
}

/**
 * Main function: Generate NotebookLM-style podcast using AWS Polly
 */
export async function generateNotebookLMPodcast(podcastData, onProgress) {
  try {
    const { title, content, script, settings = {} } = podcastData;

    // Progress callback helper
    const updateProgress = (stage, progress, message) => {
      if (onProgress) {
        onProgress({ stage, progress, message });
      }
    };

    updateProgress('init', 5, 'Initializing AWS Polly...');

    // 1. Create AWS Polly client
    const client = await createPollyClient();
    updateProgress('init', 10, 'Connected to AWS Polly');

    // ========== FIX: Get language-specific voices ==========
    const language = settings?.language || 'en-US';
    const voices = getVoicesForLanguage(language);
    console.log(`🌍 Using language: ${language}`);
    console.log(`🎤 Host voice: ${voices.host.voice}`);
    console.log(`🎤 Guest voice: ${voices.guest.voice}`);

    // 2. Generate conversational script if not provided
    updateProgress('script', 15, 'Generating conversational script...');
    let finalScript = script;

    if (!finalScript || !finalScript.includes('Host:')) {
      // Get conversation style from settings (conversational, interview, debate, storytelling)
      const conversationStyle = settings?.style || settings?.conversationStyle || 'conversational';
      console.log(`📝 Generating script with style: ${conversationStyle}`);
      finalScript = generateConversationalScript(title, content || 'Welcome to this NARA podcast.', conversationStyle);
    }

    updateProgress('script', 20, 'Script prepared');

    // 3. Parse script into segments
    const segments = parseConversationalScript(finalScript);
    console.log(`📊 Parsed ${segments.length} segments:`);
    segments.slice(0, 5).forEach((seg, i) => {
      console.log(`  ${i + 1}. ${seg.speaker}: ${seg.text.substring(0, 50)}...`);
    });
    updateProgress('script', 25, `Parsed ${segments.length} conversation segments`);

    // 4. Generate audio for each segment with DIFFERENT VOICES
    updateProgress('voice', 30, 'Generating AI voices with alternating speakers...');
    const audioSegments = [];

    for (let i = 0; i < segments.length; i++) {
      const segmentProgress = 30 + (i / segments.length) * 40; // 30-70%
      updateProgress('voice', segmentProgress, `${segments[i].speaker} speaking (${i + 1}/${segments.length})...`);

      // ========== FIX: Pass voices parameter for language-specific voices ==========
      const audioBuffer = await generateSegmentAudio(client, segments[i], voices);
      audioSegments.push(audioBuffer);

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    updateProgress('voice', 70, 'All voices generated');

    // 5. Combine audio segments
    updateProgress('rendering', 75, 'Combining audio segments...');
    let finalAudio = combineAudioSegments(audioSegments);

    // 6. Add intro/outro music if enabled
    if (settings.includeMusic) {
      updateProgress('rendering', 80, 'Adding background music...');
      finalAudio = addIntroOutroMusic(finalAudio, settings);
    }

    updateProgress('rendering', 85, 'Processing final audio...');

    // 7. Upload to Firebase Storage
    updateProgress('upload', 90, 'Uploading to cloud storage...');
    const filename = `${Date.now()}_${title.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`;
    const storageRef = ref(storage, `podcasts/ai-generated/${filename}`);
    const audioBlob = new Blob([finalAudio], { type: 'audio/mp3' });

    // Upload with proper metadata
    await uploadBytes(storageRef, audioBlob, {
      contentType: 'audio/mp3',
      customMetadata: {
        'generatedBy': 'aws-polly',
        'originalName': filename
      }
    });
    const audioUrl = await getDownloadURL(storageRef);

    updateProgress('upload', 95, 'Audio uploaded successfully');

    // 8. Calculate duration (approximate)
    const durationSeconds = Math.ceil(finalAudio.length / 4000); // Rough estimate
    const durationFormatted = formatDuration(durationSeconds);

    // 9. Save podcast metadata to Firestore
    updateProgress('save', 97, 'Saving podcast metadata...');
    
    // Clean settings object - remove any non-serializable data
    const cleanSettings = {
      host: settings?.host || 'Joanna',
      guest: settings?.guest || 'Matthew',
      hostName: settings?.hostName || 'Alex',
      guestName: settings?.guestName || 'Jordan',
      language: settings?.language || 'en-US',
      conversationStyle: settings?.conversationStyle || 'balanced'
    };
    
    // Detect language from settings
    const langCode = language || settings?.language || 'en-US';
    const langKey = langCode === 'ta-IN' ? 'ta' : langCode === 'si-LK' ? 'si' : 'en';
    
    // ========== FIX: Save title as multilingual object ==========
    const podcastTitle = title || 'AI Generated Podcast';
    const podcastDesc = (content?.substring(0, 300) || 'AI-generated podcast').trim();
    
    const podcastRef = await addDoc(collection(db, 'podcasts'), {
      // ✅ FIX: Multilingual title/description format
      title: {
        en: langKey === 'en' ? podcastTitle : `${podcastTitle} (${langKey.toUpperCase()})`,
        [langKey]: podcastTitle
      },
      description: {
        en: langKey === 'en' ? podcastDesc : `${podcastDesc} (${langKey.toUpperCase()})`,
        [langKey]: podcastDesc
      },
      audioUrl: audioUrl,
      duration: durationSeconds,
      durationFormatted: durationFormatted,
      script: finalScript || '',
      segments: segments?.length || 0,
      generatedBy: 'ai',
      aiEngine: 'aws-polly',
      aiStyle: 'notebooklm-conversational',
      settings: cleanSettings,
      status: 'published',
      language: langKey, // ✅ Language tag for filtering
      languages: [langKey], // ✅ Array format for multi-language support
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: serverTimestamp(), // ✅ REQUIRED for display
      plays: 0,
      likes: 0,
      likedBy: [],
      views: 0,
      featured: false,
      category: 'ai-generated',
      tags: ['ai', 'polly', 'conversational', langKey]
    });
    
    console.log(`✅ Podcast saved with multilingual title (${langKey})`);
    console.log(`📝 Title: ${podcastTitle}`);
    console.log(`🌍 Language: ${langCode} → ${langKey}`);

    updateProgress('complete', 100, 'Podcast created successfully!');

    return {
      success: true,
      podcastId: podcastRef.id,
      audioUrl: audioUrl,
      duration: durationSeconds,
      durationFormatted: durationFormatted,
      segments: segments.length,
      message: 'Podcast generated successfully with AWS Polly!'
    };

  } catch (error) {
    console.error('Error generating podcast:', error);

    // Check for specific errors
    if (error.message.includes('configuration not found')) {
      throw new Error('AWS API not configured. Please go to Admin Panel → AI API Configuration and add your AWS credentials.');
    } else if (error.message.includes('not enabled')) {
      throw new Error('AWS Polly is not enabled. Please enable it in Admin Panel → AI API Configuration.');
    } else if (error.name === 'CredentialsProviderError') {
      throw new Error('Invalid AWS credentials. Please check your Access Key ID and Secret Access Key in Admin Panel.');
    } else if (error.name === 'ThrottlingException') {
      throw new Error('AWS rate limit exceeded. Please wait a moment and try again.');
    } else {
      throw new Error(`Failed to generate podcast: ${error.message}`);
    }
  }
}

/**
 * Generate single-voice podcast (simpler version)
 */
export async function generateSingleVoicePodcast(podcastData, onProgress) {
  try {
    const { title, content, settings = {} } = podcastData;

    const updateProgress = (stage, progress, message) => {
      if (onProgress) {
        onProgress({ stage, progress, message });
      }
    };

    updateProgress('init', 10, 'Initializing AWS Polly...');
    const client = await createPollyClient();

    // Select voice based on settings
    const voiceConfig = VOICE_LIBRARY[settings.voice || 'professional'];

    updateProgress('voice', 30, 'Generating AI voice...');

    // ========== FIX: Split content into chunks to avoid text length limit ==========
    // AWS Polly limits: Standard=3000 chars, Neural=6000 chars
    const MAX_CHARS = voiceConfig.engine === 'neural' ? 5000 : 2500; // Leave buffer
    const contentChunks = splitTextIntoChunks(content, MAX_CHARS);
    
    console.log(`📝 Split content into ${contentChunks.length} chunks`);
    
    // Generate audio for each chunk
    const audioBuffers = [];
    
    for (let i = 0; i < contentChunks.length; i++) {
      updateProgress('rendering', 30 + (i / contentChunks.length) * 50, 
        `Generating audio ${i + 1}/${contentChunks.length}...`);
      
      // Create SSML for this chunk
      const ssml = textToConversationalSSML(contentChunks[i]);
      
      const command = new SynthesizeSpeechCommand({
        Text: ssml,
        TextType: 'ssml',
        OutputFormat: 'mp3',
        VoiceId: voiceConfig.voice,
        Engine: voiceConfig.engine,
        LanguageCode: 'en-US'
      });

      const response = await client.send(command);

      // Convert to buffer
      const chunks = [];
      for await (const chunk of response.AudioStream) {
        chunks.push(chunk);
      }
      
      // Browser-compatible: Combine chunks
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const chunkBuffer = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        chunkBuffer.set(chunk, offset);
        offset += chunk.length;
      }
      
      audioBuffers.push(chunkBuffer);
      
      console.log(`✅ Chunk ${i + 1}/${contentChunks.length} generated`);
    }
    
    // Merge all audio buffers
    updateProgress('rendering', 80, 'Merging audio segments...');
    const totalLength = audioBuffers.reduce((acc, buf) => acc + buf.length, 0);
    const audioBuffer = new Uint8Array(totalLength);
    let bufferOffset = 0;
    for (const buf of audioBuffers) {
      audioBuffer.set(buf, bufferOffset);
      bufferOffset += buf.length;
    }
    
    console.log(`✅ Merged ${audioBuffers.length} audio segments`);

    // Upload
    updateProgress('upload', 80, 'Uploading to cloud...');
    const filename = `${Date.now()}_${title.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`;
    const storageRef = ref(storage, `podcasts/ai-generated/${filename}`);
    const audioBlob = new Blob([audioBuffer], { type: 'audio/mp3' });
    
    await uploadBytes(storageRef, audioBlob, {
      contentType: 'audio/mp3',
      customMetadata: {
        'generatedBy': 'aws-polly',
        'originalName': filename
      }
    });
    const audioUrl = await getDownloadURL(storageRef);

    // Save metadata
    updateProgress('save', 95, 'Saving podcast...');
    const durationSeconds = Math.ceil(audioBuffer.length / 4000);
    
    const podcastRef = await addDoc(collection(db, 'podcasts'), {
      title: title || 'AI Generated Podcast',
      description: (content?.substring(0, 300) || 'AI-generated podcast').trim(),
      audioUrl: audioUrl,
      duration: durationSeconds,
      durationFormatted: formatDuration(durationSeconds),
      generatedBy: 'ai',
      aiEngine: 'aws-polly',
      aiStyle: 'single-voice',
      status: 'published',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: serverTimestamp(), // ✅ REQUIRED for display
      plays: 0,
      likes: 0,
      likedBy: [],
      views: 0,
      featured: false,
      category: 'ai-generated',
      tags: ['ai', 'polly', 'single-voice']
    });

    updateProgress('complete', 100, 'Done!');

    return {
      success: true,
      podcastId: podcastRef.id,
      audioUrl
    };

  } catch (error) {
    console.error('Error generating single-voice podcast:', error);
    throw error;
  }
}

/**
 * Test AWS Polly connection
 */
export async function testAWSPollyConnection() {
  try {
    const client = await createPollyClient();

    // Try a simple synthesis
    const command = new SynthesizeSpeechCommand({
      Text: 'Hello from NARA Podcasts. AWS Polly is working correctly.',
      OutputFormat: 'mp3',
      VoiceId: 'Joanna',
      Engine: 'neural'
    });

    await client.send(command);

    return {
      success: true,
      message: 'AWS Polly connection successful!'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

/**
 * Helper: Format duration in seconds to MM:SS or HH:MM:SS
 */
function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

/**
 * Get available voices list
 */
export function getAvailableVoices() {
  return VOICE_LIBRARY;
}

/**
 * Get conversation voice pairs
 */
export function getConversationVoices() {
  return CONVERSATION_VOICES;
}
