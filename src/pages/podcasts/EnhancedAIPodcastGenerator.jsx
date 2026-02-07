import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';
import { generateNotebookLMPodcast, generateSingleVoicePodcast, testAWSPollyConnection } from '../../services/awsPollyPodcastService';
import { generateIntelligentScript, estimateCost } from '../../services/chatgptPodcastService';

/**
 * ENHANCED AI Podcast Generator
 * Advanced features for professional podcast creation
 */
const EnhancedAIPodcastGenerator = ({ onClose, onGenerate }) => {
  const { t, i18n } = useTranslation('common');
  const fileInputRef = useRef(null);
  const voiceUploadRef = useRef(null);

  const [activeStep, setActiveStep] = useState(1); // 1: Content, 2: Script, 3: Voice, 4: Visuals, 5: Music, 6: Review
  const [activeTab, setActiveTab] = useState('write');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [aiGeneratedScript, setAiGeneratedScript] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [generationStep, setGenerationStep] = useState(null);
  const [progress, setProgress] = useState(0);

  // Enhanced Settings
  const [podcastSettings, setPodcastSettings] = useState({
    // AI Settings
    useAI: 'basic', // 'basic' (free), 'chatgpt' (intelligent), 'custom'
    aiCasualness: 'high', // 'low', 'medium', 'high'
    aiTechnicalDepth: 'medium', // 'low', 'medium', 'high'
    conversationLength: 'medium', // 'short', 'medium', 'long'
    
    // Voice Settings
    voice: 'professional',
    voiceGender: 'neutral',
    voiceSpeed: 1.0,
    voicePitch: 1.0,
    customVoiceFile: null,

    // Podcast Format
    language: 'en',
    duration: 'auto',
    style: 'educational',
    format: 'single', // 'single', 'conversation', 'interview', 'panel'

    // Multi-speaker settings (for conversations)
    speakers: [
      { id: 1, name: 'Host', voice: 'professional', role: 'host' }
    ],

    // Visual Settings
    includeVisuals: true,
    visualTheme: 'ocean', // 'ocean', 'modern', 'minimal', 'professional'
    brandingPosition: 'bottom-right',
    showSubtitles: true,
    showChapters: true,

    // Music & Audio
    includeMusic: true,
    musicGenre: 'ambient',
    musicVolume: 0.2,
    soundEffects: true,
    introOutro: true,

    // Advanced Features
    autoTranslate: false,
    targetLanguages: [],
    generateChapters: true,
    generateTranscript: true,
    generateSummary: true,
    seoOptimize: true,

    // Series Settings
    isPartOfSeries: false,
    seriesName: '',
    episodeNumber: 1
  });

  const [chapters, setChapters] = useState([]);
  const [selectedMusicTrack, setSelectedMusicTrack] = useState(null);
  const [visualTemplateCustomization, setVisualTemplateCustomization] = useState({
    primaryColor: '#06b6d4',
    secondaryColor: '#3b82f6',
    fontFamily: 'Inter',
    logoPosition: 'top-left'
  });

  const steps = [
    { id: 1, label: 'Content Input', icon: Icons.FileText, completed: false },
    { id: 2, label: 'AI Script Enhancement', icon: Icons.Sparkles, completed: false },
    { id: 3, label: 'Voice Configuration', icon: Icons.Mic, completed: false },
    { id: 4, label: 'Visual Design', icon: Icons.Palette, completed: false },
    { id: 5, label: 'Audio & Music', icon: Icons.Music, completed: false },
    { id: 6, label: 'Review & Generate', icon: Icons.Play, completed: false }
  ];

  const voiceOptions = [
    { id: 'professional', label: 'Professional', gender: 'neutral', sample: '🎙️' },
    { id: 'friendly', label: 'Friendly', gender: 'warm', sample: '😊' },
    { id: 'energetic', label: 'Energetic', gender: 'dynamic', sample: '⚡' },
    { id: 'authoritative', label: 'Authoritative', gender: 'strong', sample: '💼' },
    { id: 'soothing', label: 'Soothing', gender: 'calm', sample: '🌊' },
    { id: 'custom', label: 'Clone Your Voice', gender: 'custom', sample: '🎤' }
  ];

  const formatOptions = [
    { id: 'single', label: 'Solo Narration', icon: Icons.User, description: 'Single voice narration' },
    { id: 'conversation', label: 'Conversation', icon: Icons.Users, description: 'Two-way dialogue' },
    { id: 'interview', label: 'Interview', icon: Icons.MessageCircle, description: 'Q&A format' },
    { id: 'panel', label: 'Panel Discussion', icon: Icons.Users2, description: 'Multiple speakers' }
  ];

  const visualThemes = [
    { id: 'ocean', label: 'Ocean Wave', preview: '🌊', colors: ['#06b6d4', '#0ea5e9', '#0284c7'] },
    { id: 'modern', label: 'Modern Tech', preview: '💎', colors: ['#8b5cf6', '#ec4899', '#f59e0b'] },
    { id: 'minimal', label: 'Minimal Clean', preview: '⬜', colors: ['#64748b', '#94a3b8', '#cbd5e1'] },
    { id: 'professional', label: 'Professional', preview: '👔', colors: ['#1e293b', '#334155', '#475569'] },
    { id: 'nature', label: 'Nature Green', preview: '🌿', colors: ['#10b981', '#059669', '#047857'] },
    { id: 'sunset', label: 'Sunset Glow', preview: '🌅', colors: ['#f97316', '#fb923c', '#fdba74'] }
  ];

  const musicLibrary = [
    { id: 'ambient1', name: 'Ocean Ambience', genre: 'ambient', duration: '3:45', mood: 'Calm' },
    { id: 'corporate1', name: 'Corporate Upbeat', genre: 'corporate', duration: '2:30', mood: 'Professional' },
    { id: 'tech1', name: 'Tech Innovation', genre: 'electronic', duration: '3:20', mood: 'Modern' },
    { id: 'nature1', name: 'Nature Sounds', genre: 'ambient', duration: '4:00', mood: 'Peaceful' },
    { id: 'upbeat1', name: 'Upbeat Energy', genre: 'pop', duration: '2:45', mood: 'Energetic' },
    { id: 'dramatic1', name: 'Dramatic Cinematic', genre: 'cinematic', duration: '3:15', mood: 'Intense' }
  ];

  // Add speaker to multi-speaker podcast
  const addSpeaker = () => {
    const newSpeaker = {
      id: Date.now(),
      name: `Speaker ${podcastSettings.speakers.length + 1}`,
      voice: 'friendly',
      role: 'guest'
    };
    setPodcastSettings({
      ...podcastSettings,
      speakers: [...podcastSettings.speakers, newSpeaker]
    });
  };

  // Remove speaker
  const removeSpeaker = (speakerId) => {
    setPodcastSettings({
      ...podcastSettings,
      speakers: podcastSettings.speakers.filter(s => s.id !== speakerId)
    });
  };

  // AI Script Enhancement
  const enhanceScript = async () => {
    setGenerationStep('enhancing');
    setProgress(0);

    // Simulate AI enhancement
    await new Promise(resolve => setTimeout(resolve, 2000));

    const enhanced = `
# ${title || 'Untitled Podcast'}

## Introduction
Welcome to NARA Podcasts! Today we're exploring ${title?.toLowerCase() || 'an exciting topic'}.

## Main Content
${content}

## Key Points
- Comprehensive analysis of the subject matter
- Expert insights and research findings
- Practical applications and implications

## Conclusion
Thank you for listening to this episode. Don't forget to subscribe for more ocean research insights!
    `.trim();

    setAiGeneratedScript(enhanced);
    setProgress(100);
    setGenerationStep(null);
    setActiveStep(2);
  };

  // Auto-generate chapters
  const generateChapters = () => {
    const autoChapters = [
      { timestamp: '0:00', title: 'Introduction', duration: 30 },
      { timestamp: '0:30', title: 'Main Topic Overview', duration: 120 },
      { timestamp: '2:30', title: 'Deep Dive Analysis', duration: 180 },
      { timestamp: '5:30', title: 'Key Insights', duration: 90 },
      { timestamp: '7:00', title: 'Conclusion & Next Steps', duration: 60 }
    ];
    setChapters(autoChapters);
  };

  const handleVoiceUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPodcastSettings({
        ...podcastSettings,
        customVoiceFile: file
      });
    }
  };

  const handleGenerate = async () => {
    console.log('🎬 Starting podcast generation...');
    console.log('📋 Title:', title);
    console.log('📝 Content length:', content?.length);
    console.log('🎛️ Format:', podcastSettings.format);

    setGenerationStep('processing');
    setProgress(0);

    try {
      // Validate inputs
      if (!title || title.trim() === '') {
        alert('❌ Please enter a podcast title!');
        return;
      }

      if (!content || content.trim() === '') {
        alert('❌ Please enter podcast content!');
        return;
      }

      // ========== STEP 1: Generate Script with AI (if ChatGPT selected) ==========
      let finalScript = aiGeneratedScript || content;
      
      if (podcastSettings.useAI === 'chatgpt' && podcastSettings.format === 'conversation') {
        try {
          console.log('🤖 Using ChatGPT for intelligent script generation...');
          setGenerationStep('ai-script');
          setProgress(10);

          // Get OpenAI API key from localStorage
          const apiConfig = JSON.parse(localStorage.getItem('nara-ai-api-config') || '{}');
          const openaiApiKey = apiConfig.openaiKey;

          if (!openaiApiKey) {
            throw new Error('OpenAI API key not configured. Please add it in Admin → AI API Configuration');
          }

          // Generate intelligent script with ChatGPT
          finalScript = await generateIntelligentScript(title, content, {
            apiKey: openaiApiKey,
            style: podcastSettings.style || 'conversational',
            length: podcastSettings.conversationLength,
            casualness: podcastSettings.aiCasualness,
            technicalDepth: podcastSettings.aiTechnicalDepth,
            hostName: 'Alex',
            guestName: 'Sam'
          });

          console.log('✅ ChatGPT script generated!');
          console.log('📝 Script preview:', finalScript.substring(0, 200) + '...');
          setProgress(25);
          
        } catch (error) {
          console.error('❌ ChatGPT error:', error);
          alert(`⚠️ ChatGPT Error: ${error.message}\n\nFalling back to basic script generation.`);
          // Fall back to basic generation
          finalScript = content;
        }
      }

      // Prepare podcast data
      const podcastData = {
        title: title || 'Untitled NARA Podcast',
        content: content,
        script: finalScript,
        settings: podcastSettings
      };

      console.log('📦 Podcast data prepared:', {
        title: podcastData.title,
        contentLength: podcastData.content.length,
        scriptLength: finalScript.length,
        aiMode: podcastSettings.useAI,
        format: podcastData.settings.format
      });

      // Progress callback
      const onProgress = ({ stage, progress: prog, message }) => {
        setGenerationStep(stage);
        setProgress(Math.max(prog, progress)); // Don't go backwards
        console.log(`[${stage}] ${prog}% - ${message}`);
      };

      // ========== STEP 2: Generate Audio with AWS Polly ==========
      console.log('🚀 Calling generation function...');
      let result;
      if (podcastSettings.format === 'conversation') {
        console.log('💬 Using NotebookLM-style conversation format');
        result = await generateNotebookLMPodcast(podcastData, onProgress);
      } else {
        console.log('🎙️ Using single voice format');
        result = await generateSingleVoicePodcast(podcastData, onProgress);
      }

      console.log('✅ Generation result:', result);

      if (result.success) {
        setGenerationStep('complete');
        setProgress(100);

        // Show success message with details
        alert(`✅ Podcast Created Successfully!\n\nTitle: ${title}\nDuration: ${result.durationFormatted || 'N/A'}\nSegments: ${result.segments || 1}\n\nAudio URL: ${result.audioUrl}\n\nThe podcast has been saved to Firebase and is ready to play!`);

        // Call parent callback if provided
        if (onGenerate) {
          onGenerate(result);
        }
      }
    } catch (error) {
      console.error('❌ FULL ERROR DETAILS:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);

      setGenerationStep('error');

      let errorMessage = error.message;
      if (error.message.includes('not found')) {
        errorMessage = `${error.message}\n\n💡 Quick Fix:\n1. Run: node save-aws-credentials.js\n2. Hard refresh browser (Ctrl+Shift+R)\n3. Try again`;
      }

      alert(`❌ Error Generating Podcast:\n\n${errorMessage}\n\nPlease check browser console (F12) for detailed logs.`);
    }
  };

  const handleTestConnection = async () => {
    try {
      console.log('🧪 Testing AWS Polly connection...');
      const result = await testAWSPollyConnection();

      if (result.success) {
        alert(`✅ AWS Polly Connection Successful!\n\n${result.message}\n\nYour AI Podcast Generator is ready to use!`);
      } else {
        alert(`❌ AWS Polly Connection Failed!\n\n${result.message}\n\nPlease check:\n1. AWS credentials in Firebase (admin_config/ai_api_keys)\n2. Access Key ID: Should start with AKIA...\n3. Secret Access Key: Check for typos\n4. Region is set to: us-east-1\n5. 'enabled' field is set to true`);
      }
    } catch (error) {
      alert(`❌ Connection Test Error:\n\n${error.message}\n\nThis usually means:\n- AWS credentials not found in Firebase\n- Invalid credentials\n- Network connection issue`);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return renderContentInput();
      case 2:
        return renderScriptEnhancement();
      case 3:
        return renderVoiceConfiguration();
      case 4:
        return renderVisualDesign();
      case 5:
        return renderAudioMusic();
      case 6:
        return renderReviewGenerate();
      default:
        return renderContentInput();
    }
  };

  const renderContentInput = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-cyan-500/20 rounded-xl">
          <Icons.FileText className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">Input Your Content</h3>
          <p className="text-slate-400">Write, upload, or paste your podcast content</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-800/50 p-2 rounded-xl">
        {['write', 'upload', 'paste'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-3 rounded-lg capitalize transition-all ${
              activeTab === tab
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter podcast title..."
        className="w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
      />

      {/* Content Area */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing your content here..."
        className="w-full h-[400px] bg-slate-800/50 border-2 border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
      />

      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">{content.length} characters • ~{Math.ceil(content.length / 1000)} min podcast</span>
        <button
          onClick={enhanceScript}
          disabled={!content}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-slate-700 disabled:to-slate-700 rounded-xl text-white font-bold transition-all flex items-center gap-2"
        >
          <Icons.Wand2 className="w-5 h-5" />
          Enhance with AI
          <Icons.ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderScriptEnhancement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <Icons.Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">AI-Enhanced Script</h3>
            <p className="text-slate-400">Edit and refine your podcast script</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors" title="Regenerate">
            <Icons.RefreshCw className="w-5 h-5 text-white" />
          </button>
          <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors" title="Format">
            <Icons.Type className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <textarea
        value={aiGeneratedScript}
        onChange={(e) => setAiGeneratedScript(e.target.value)}
        className="w-full h-[450px] bg-slate-800/50 border-2 border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 resize-none font-mono text-sm"
      />

      {/* Chapter Generation */}
      <div className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            <Icons.ListOrdered className="w-5 h-5 text-cyan-400" />
            Auto-Generate Chapters
          </h4>
          <button
            onClick={generateChapters}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
          >
            <Icons.Sparkles className="w-4 h-4" />
            Generate
          </button>
        </div>
        {chapters.length > 0 && (
          <div className="space-y-2">
            {chapters.map((chapter, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-cyan-400 font-mono text-sm">{chapter.timestamp}</span>
                  <span className="text-white">{chapter.title}</span>
                </div>
                <span className="text-slate-400 text-sm">{chapter.duration}s</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setActiveStep(1)}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors flex items-center gap-2"
        >
          <Icons.ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={() => setActiveStep(3)}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl text-white font-bold transition-all flex items-center gap-2"
        >
          Configure Voice
          <Icons.ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderVoiceConfiguration = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-pink-500/20 rounded-xl">
          <Icons.Mic className="w-6 h-6 text-pink-400" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">Voice Configuration</h3>
          <p className="text-slate-400">Choose voice style and configure audio settings</p>
        </div>
      </div>

      {/* AI MODE SELECTOR - ChatGPT vs Basic */}
      <div className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 border-2 border-purple-500/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Icons.Brain className="w-5 h-5 text-purple-400" />
              AI Intelligence Mode
            </h4>
            <p className="text-sm text-slate-400 mt-1">Choose script generation engine</p>
          </div>
          <div className="text-sm text-cyan-400 font-semibold">
            {podcastSettings.useAI === 'chatgpt' ? '~$0.10/podcast' : 'FREE'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* BASIC MODE (FREE) */}
          <button
            onClick={() => setPodcastSettings({ ...podcastSettings, useAI: 'basic' })}
            className={`p-5 rounded-xl transition-all text-left ${
              podcastSettings.useAI === 'basic'
                ? 'bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-2 border-green-500'
                : 'bg-slate-800/50 border-2 border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icons.Zap className={`w-5 h-5 ${podcastSettings.useAI === 'basic' ? 'text-green-400' : 'text-slate-400'}`} />
                <span className={`font-bold ${podcastSettings.useAI === 'basic' ? 'text-white' : 'text-slate-300'}`}>
                  Basic (FREE)
                </span>
              </div>
              {podcastSettings.useAI === 'basic' && (
                <div className="px-2 py-1 bg-green-500 rounded-full text-xs font-bold">ACTIVE</div>
              )}
            </div>
            <p className={`text-sm ${podcastSettings.useAI === 'basic' ? 'text-slate-300' : 'text-slate-500'}`}>
              ✓ Natural conversations<br/>
              ✓ 4 conversation styles<br/>
              ✓ Casual speech patterns<br/>
              ✓ Unlimited use
            </p>
          </button>

          {/* CHATGPT MODE (INTELLIGENT) */}
          <button
            onClick={() => setPodcastSettings({ ...podcastSettings, useAI: 'chatgpt' })}
            className={`p-5 rounded-xl transition-all text-left ${
              podcastSettings.useAI === 'chatgpt'
                ? 'bg-gradient-to-br from-purple-500/30 to-cyan-500/30 border-2 border-purple-500'
                : 'bg-slate-800/50 border-2 border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icons.Sparkles className={`w-5 h-5 ${podcastSettings.useAI === 'chatgpt' ? 'text-purple-400' : 'text-slate-400'}`} />
                <span className={`font-bold ${podcastSettings.useAI === 'chatgpt' ? 'text-white' : 'text-slate-300'}`}>
                  GPT-5 (Intelligent) 🚀
                </span>
              </div>
              {podcastSettings.useAI === 'chatgpt' && (
                <div className="px-2 py-1 bg-purple-500 rounded-full text-xs font-bold">ACTIVE</div>
              )}
            </div>
            <p className={`text-sm ${podcastSettings.useAI === 'chatgpt' ? 'text-slate-300' : 'text-slate-500'}`}>
              ✓ GPT-5 powered scripts ⭐<br/>
              ✓ Deep context understanding<br/>
              ✓ Creative dialogue<br/>
              ✓ Professional quality
            </p>
          </button>
        </div>

        {/* ChatGPT Advanced Settings */}
        {podcastSettings.useAI === 'chatgpt' && podcastSettings.format === 'conversation' && (
          <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-2">Casualness</label>
                <select
                  value={podcastSettings.aiCasualness}
                  onChange={(e) => setPodcastSettings({ ...podcastSettings, aiCasualness: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
                >
                  <option value="low">Low (Formal)</option>
                  <option value="medium">Medium (Balanced)</option>
                  <option value="high">High (Casual) ⭐</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-2">Technical Depth</label>
                <select
                  value={podcastSettings.aiTechnicalDepth}
                  onChange={(e) => setPodcastSettings({ ...podcastSettings, aiTechnicalDepth: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
                >
                  <option value="low">Low (Simple)</option>
                  <option value="medium">Medium (Balanced) ⭐</option>
                  <option value="high">High (Detailed)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-2">Length</label>
                <select
                  value={podcastSettings.conversationLength}
                  onChange={(e) => setPodcastSettings({ ...podcastSettings, conversationLength: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
                >
                  <option value="short">Short (5-6 min)</option>
                  <option value="medium">Medium (7-10 min) ⭐</option>
                  <option value="long">Long (15+ min)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Podcast Format */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-3">Podcast Format</label>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {formatOptions.map((format) => {
            const Icon = format.icon;
            return (
              <button
                key={format.id}
                onClick={() => setPodcastSettings({ ...podcastSettings, format: format.id })}
                className={`p-4 rounded-xl transition-all ${
                  podcastSettings.format === format.id
                    ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-2 border-pink-500'
                    : 'bg-slate-800/50 border-2 border-slate-700 hover:border-slate-600'
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${podcastSettings.format === format.id ? 'text-pink-400' : 'text-slate-400'}`} />
                <p className={`text-sm font-medium ${podcastSettings.format === format.id ? 'text-white' : 'text-slate-400'}`}>
                  {format.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Multi-Speaker Setup (if conversation/interview/panel) */}
      {podcastSettings.format !== 'single' && (
        <div className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-white">Speakers</h4>
            <button
              onClick={addSpeaker}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-medium flex items-center gap-2"
            >
              <Icons.Plus className="w-4 h-4" />
              Add Speaker
            </button>
          </div>
          <div className="space-y-3">
            {podcastSettings.speakers.map((speaker, index) => (
              <div key={speaker.id} className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                <Icons.User className="w-5 h-5 text-cyan-400" />
                <input
                  value={speaker.name}
                  onChange={(e) => {
                    const updated = [...podcastSettings.speakers];
                    updated[index].name = e.target.value;
                    setPodcastSettings({ ...podcastSettings, speakers: updated });
                  }}
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
                />
                <select
                  value={speaker.voice}
                  onChange={(e) => {
                    const updated = [...podcastSettings.speakers];
                    updated[index].voice = e.target.value;
                    setPodcastSettings({ ...podcastSettings, speakers: updated });
                  }}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  {voiceOptions.filter(v => v.id !== 'custom').map(v => (
                    <option key={v.id} value={v.id}>{v.label}</option>
                  ))}
                </select>
                {index > 0 && (
                  <button
                    onClick={() => removeSpeaker(speaker.id)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                  >
                    <Icons.Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Voice Selection (for single speaker) */}
      {podcastSettings.format === 'single' && (
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">Voice Style</label>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {voiceOptions.map((voice) => (
              <button
                key={voice.id}
                onClick={() => {
                  if (voice.id === 'custom') {
                    voiceUploadRef.current?.click();
                  } else {
                    setPodcastSettings({ ...podcastSettings, voice: voice.id });
                  }
                }}
                className={`p-4 rounded-xl transition-all text-left ${
                  podcastSettings.voice === voice.id
                    ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-2 border-pink-500'
                    : 'bg-slate-800/50 border-2 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="text-3xl mb-2">{voice.sample}</div>
                <p className={`font-medium ${podcastSettings.voice === voice.id ? 'text-white' : 'text-slate-400'}`}>
                  {voice.label}
                </p>
                <p className="text-xs text-slate-500">{voice.gender}</p>
              </button>
            ))}
          </div>
          <input
            ref={voiceUploadRef}
            type="file"
            accept="audio/*"
            onChange={handleVoiceUpload}
            className="hidden"
          />
        </div>
      )}

      {/* Voice Controls */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Speaking Speed</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={podcastSettings.voiceSpeed}
            onChange={(e) => setPodcastSettings({ ...podcastSettings, voiceSpeed: parseFloat(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>Slow</span>
            <span>{podcastSettings.voiceSpeed}x</span>
            <span>Fast</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Voice Pitch</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={podcastSettings.voicePitch}
            onChange={(e) => setPodcastSettings({ ...podcastSettings, voicePitch: parseFloat(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>Low</span>
            <span>{podcastSettings.voicePitch}x</span>
            <span>High</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setActiveStep(2)}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors flex items-center gap-2"
        >
          <Icons.ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={() => setActiveStep(4)}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl text-white font-bold transition-all flex items-center gap-2"
        >
          Design Visuals
          <Icons.ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderVisualDesign = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-500/20 rounded-xl">
          <Icons.Palette className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">Visual Design</h3>
          <p className="text-slate-400">Customize the look of your video podcast</p>
        </div>
      </div>

      {/* Visual Themes */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-3">Choose Theme</label>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {visualThemes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setPodcastSettings({ ...podcastSettings, visualTheme: theme.id })}
              className={`p-4 rounded-xl transition-all ${
                podcastSettings.visualTheme === theme.id
                  ? 'border-2 border-purple-500 shadow-lg'
                  : 'bg-slate-800/50 border-2 border-slate-700 hover:border-slate-600'
              }`}
              style={{
                background: podcastSettings.visualTheme === theme.id
                  ? `linear-gradient(135deg, ${theme.colors[0]}33, ${theme.colors[1]}33)`
                  : undefined
              }}
            >
              <div className="text-4xl mb-2">{theme.preview}</div>
              <p className="text-white font-medium mb-2">{theme.label}</p>
              <div className="flex gap-1">
                {theme.colors.map((color, i) => (
                  <div key={i} className="w-6 h-6 rounded" style={{ backgroundColor: color }} />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Visual Options */}
      <div className="grid md:grid-cols-2 gap-4">
        <label className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-xl cursor-pointer hover:border-slate-600">
          <span className="text-white font-medium">Show Subtitles</span>
          <input
            type="checkbox"
            checked={podcastSettings.showSubtitles}
            onChange={(e) => setPodcastSettings({ ...podcastSettings, showSubtitles: e.target.checked })}
            className="w-5 h-5 rounded"
          />
        </label>
        <label className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-xl cursor-pointer hover:border-slate-600">
          <span className="text-white font-medium">Show Chapters</span>
          <input
            type="checkbox"
            checked={podcastSettings.showChapters}
            onChange={(e) => setPodcastSettings({ ...podcastSettings, showChapters: e.target.checked })}
            className="w-5 h-5 rounded"
          />
        </label>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setActiveStep(3)}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors flex items-center gap-2"
        >
          <Icons.ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={() => setActiveStep(5)}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl text-white font-bold transition-all flex items-center gap-2"
        >
          Add Music
          <Icons.ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderAudioMusic = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-500/20 rounded-xl">
          <Icons.Music className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">Audio & Music</h3>
          <p className="text-slate-400">Add background music and sound effects</p>
        </div>
      </div>

      {/* Music Library */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-3">Background Music</label>
        <div className="space-y-2">
          {musicLibrary.map((track) => (
            <button
              key={track.id}
              onClick={() => setSelectedMusicTrack(track.id)}
              className={`w-full p-4 rounded-xl transition-all text-left ${
                selectedMusicTrack === track.id
                  ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 border-2 border-green-500'
                  : 'bg-slate-800/50 border border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icons.Music className={`w-5 h-5 ${selectedMusicTrack === track.id ? 'text-green-400' : 'text-slate-400'}`} />
                  <div>
                    <p className="text-white font-medium">{track.name}</p>
                    <p className="text-xs text-slate-400">{track.genre} • {track.mood}</p>
                  </div>
                </div>
                <span className="text-sm text-slate-400">{track.duration}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Music Controls */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">Music Volume</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={podcastSettings.musicVolume}
          onChange={(e) => setPodcastSettings({ ...podcastSettings, musicVolume: parseFloat(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Quiet</span>
          <span>{Math.round(podcastSettings.musicVolume * 100)}%</span>
          <span>Loud</span>
        </div>
      </div>

      {/* Additional Audio Options */}
      <div className="space-y-3">
        <label className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-xl cursor-pointer hover:border-slate-600">
          <span className="text-white font-medium">Sound Effects</span>
          <input
            type="checkbox"
            checked={podcastSettings.soundEffects}
            onChange={(e) => setPodcastSettings({ ...podcastSettings, soundEffects: e.target.checked })}
            className="w-5 h-5 rounded"
          />
        </label>
        <label className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-xl cursor-pointer hover:border-slate-600">
          <span className="text-white font-medium">Intro/Outro Music</span>
          <input
            type="checkbox"
            checked={podcastSettings.introOutro}
            onChange={(e) => setPodcastSettings({ ...podcastSettings, introOutro: e.target.checked })}
            className="w-5 h-5 rounded"
          />
        </label>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setActiveStep(4)}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors flex items-center gap-2"
        >
          <Icons.ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={() => setActiveStep(6)}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl text-white font-bold transition-all flex items-center gap-2"
        >
          Review & Generate
          <Icons.ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderReviewGenerate = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-500/20 rounded-xl">
          <Icons.CheckCircle className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">Review & Generate</h3>
          <p className="text-slate-400">Review your settings and generate the podcast</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <h4 className="text-white font-bold mb-3 flex items-center gap-2">
            <Icons.FileText className="w-4 h-4 text-cyan-400" />
            Content
          </h4>
          <p className="text-slate-400 text-sm mb-2">Title: {title || 'Untitled'}</p>
          <p className="text-slate-400 text-sm">Length: ~{Math.ceil(content.length / 1000)} minutes</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <h4 className="text-white font-bold mb-3 flex items-center gap-2">
            <Icons.Mic className="w-4 h-4 text-pink-400" />
            Voice
          </h4>
          <p className="text-slate-400 text-sm mb-2">Format: {podcastSettings.format}</p>
          <p className="text-slate-400 text-sm">
            {podcastSettings.format === 'single' ? `Voice: ${podcastSettings.voice}` : `Speakers: ${podcastSettings.speakers.length}`}
          </p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <h4 className="text-white font-bold mb-3 flex items-center gap-2">
            <Icons.Palette className="w-4 h-4 text-purple-400" />
            Visuals
          </h4>
          <p className="text-slate-400 text-sm mb-2">Theme: {podcastSettings.visualTheme}</p>
          <p className="text-slate-400 text-sm">Subtitles: {podcastSettings.showSubtitles ? 'Yes' : 'No'}</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <h4 className="text-white font-bold mb-3 flex items-center gap-2">
            <Icons.Music className="w-4 h-4 text-green-400" />
            Audio
          </h4>
          <p className="text-slate-400 text-sm mb-2">Music: {selectedMusicTrack ? 'Selected' : 'None'}</p>
          <p className="text-slate-400 text-sm">Volume: {Math.round(podcastSettings.musicVolume * 100)}%</p>
        </div>
      </div>

      {/* Test AWS Connection Button */}
      <button
        onClick={handleTestConnection}
        className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl text-white font-bold shadow-lg shadow-cyan-500/30 transition-all flex items-center justify-center gap-3"
      >
        <Icons.Zap className="w-6 h-6" />
        Test AWS Polly Connection
        <Icons.CheckCircle className="w-6 h-6" />
      </button>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className="w-full py-6 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 hover:from-purple-600 hover:via-pink-600 hover:to-purple-600 rounded-2xl text-white font-bold text-xl shadow-lg shadow-purple-500/50 transition-all flex items-center justify-center gap-3"
      >
        <Icons.Sparkles className="w-8 h-8" />
        Generate AI Podcast
        <Icons.Play className="w-8 h-8" />
      </button>

      <button
        onClick={() => setActiveStep(5)}
        className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Icons.ArrowLeft className="w-4 h-4" />
        Back to Editing
      </button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl shadow-2xl max-w-7xl w-full border-2 border-cyan-500/30 my-8"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 p-6 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Icons.Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Enhanced AI Podcast Studio</h2>
              <p className="text-blue-100">Professional podcast creation with advanced AI features</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <Icons.X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 bg-slate-900/50 border-b border-slate-800">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;
              const isCompleted = activeStep > step.id;

              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => setActiveStep(step.id)}
                    className={`flex flex-col items-center gap-2 transition-all ${
                      isActive ? 'scale-110' : isCompleted ? 'opacity-70' : 'opacity-40'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-500' :
                      isActive ? 'bg-gradient-to-r from-cyan-500 to-purple-500' :
                      'bg-slate-700'
                    }`}>
                      {isCompleted ? (
                        <Icons.Check className="w-6 h-6 text-white" />
                      ) : (
                        <Icon className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <span className={`text-xs font-medium hidden md:block ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}>
                      {step.label}
                    </span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded ${
                      isCompleted ? 'bg-green-500' : 'bg-slate-700'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Generation Progress Modal */}
        <AnimatePresence>
          {generationStep && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-sm rounded-3xl flex items-center justify-center"
            >
              <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl p-8 max-w-md w-full mx-4 border-2 border-cyan-500/30">
                <div className="text-center">
                  {generationStep !== 'complete' ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-6"
                      />
                      <h3 className="text-2xl font-bold text-white mb-2">Creating Your Podcast...</h3>
                      <p className="text-slate-400 mb-6">
                        {generationStep === 'processing' ? 'Processing content' :
                         generationStep === 'script' ? 'Generating script' :
                         generationStep === 'voice' ? 'Creating voice narration' :
                         generationStep === 'visuals' ? 'Designing visuals' :
                         'Rendering final video'}
                      </p>
                      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden mb-3">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-cyan-400 font-bold">{progress}%</p>
                    </>
                  ) : (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center"
                      >
                        <Icons.Check className="w-12 h-12 text-white" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white mb-2">Podcast Created!</h3>
                      <p className="text-slate-400 mb-6">Your AI-generated podcast is ready</p>
                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            setGenerationStep(null);
                            onClose();
                          }}
                          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-xl text-white font-bold"
                        >
                          View Podcast
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedAIPodcastGenerator;
