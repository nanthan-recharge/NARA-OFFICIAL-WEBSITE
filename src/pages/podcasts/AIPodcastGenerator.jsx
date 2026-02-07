import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';

/**
 * AI Podcast Generator - Notebook-style interface
 * Create video podcasts from text content, documents, or pasted notes
 */
const AIPodcastGenerator = ({ onClose, onGenerate }) => {
  const { t, i18n } = useTranslation('common');
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('write'); // 'write', 'upload', 'paste'
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [podcastSettings, setPodcastSettings] = useState({
    voice: 'professional', // 'professional', 'friendly', 'energetic'
    language: 'en',
    duration: 'auto', // 'auto', 'short', 'medium', 'long'
    style: 'educational', // 'educational', 'storytelling', 'interview', 'news'
    includeMusic: true,
    includeVisuals: true
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [generationStep, setGenerationStep] = useState(null); // null, 'processing', 'generating', 'complete'
  const [progress, setProgress] = useState(0);
  const [generatedPodcast, setGeneratedPodcast] = useState(null);

  const tabs = [
    { id: 'write', label: 'Write Content', icon: Icons.Edit3 },
    { id: 'upload', label: 'Upload Documents', icon: Icons.Upload },
    { id: 'paste', label: 'Paste Notes', icon: Icons.Clipboard }
  ];

  const voiceOptions = [
    { id: 'professional', label: 'Professional', description: 'Clear, authoritative voice', icon: Icons.Briefcase },
    { id: 'friendly', label: 'Friendly', description: 'Warm, conversational tone', icon: Icons.Smile },
    { id: 'energetic', label: 'Energetic', description: 'Dynamic, enthusiastic delivery', icon: Icons.Zap }
  ];

  const styleOptions = [
    { id: 'educational', label: 'Educational', description: 'Informative teaching style', icon: Icons.GraduationCap },
    { id: 'storytelling', label: 'Storytelling', description: 'Narrative-driven approach', icon: Icons.BookOpen },
    { id: 'interview', label: 'Interview', description: 'Q&A conversation format', icon: Icons.MessageCircle },
    { id: 'news', label: 'News Report', description: 'Journalistic reporting style', icon: Icons.Newspaper }
  ];

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    // Simulate AI generation process
    setGenerationStep('processing');
    setProgress(0);

    // Step 1: Process content
    await simulateProgress('processing', 30);

    // Step 2: Generate script
    setGenerationStep('generating');
    await simulateProgress('generating', 60);

    // Step 3: Create video
    await simulateProgress('complete', 100);

    // Simulate generated podcast result
    setGeneratedPodcast({
      id: Date.now(),
      title: title || 'AI Generated Podcast',
      duration: '5:30',
      thumbnail: '/api/placeholder/400/300',
      script: content.substring(0, 200) + '...',
      videoUrl: '/videos/generated-podcast-' + Date.now() + '.mp4'
    });

    setGenerationStep('complete');
  };

  const simulateProgress = (step, targetProgress) => {
    return new Promise((resolve) => {
      let current = progress;
      const interval = setInterval(() => {
        current += 2;
        setProgress(current);
        if (current >= targetProgress) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf': return Icons.FileText;
      case 'doc':
      case 'docx': return Icons.FileText;
      case 'txt': return Icons.File;
      case 'md': return Icons.FileCode;
      default: return Icons.File;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden border-2 border-cyan-500/30"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Icons.Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">AI Podcast Generator</h2>
              <p className="text-blue-100 text-sm">Create professional video podcasts from your content</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Icons.X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-6 p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Left Panel - Content Input */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 bg-slate-800/50 p-2 rounded-xl">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Podcast Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your podcast title..."
                className="w-full px-4 py-3 bg-slate-800/50 border-2 border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Content Area */}
            <div className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-6 min-h-[400px]">
              <AnimatePresence mode="wait">
                {/* Write Tab */}
                {activeTab === 'write' && (
                  <motion.div
                    key="write"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="h-full"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Icons.Edit3 className="w-5 h-5 text-cyan-400" />
                        Write Your Content
                      </h3>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="Bold">
                          <Icons.Bold className="w-4 h-4 text-slate-400" />
                        </button>
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="Italic">
                          <Icons.Italic className="w-4 h-4 text-slate-400" />
                        </button>
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="List">
                          <Icons.List className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Start writing your podcast content here... You can write about research findings, ocean conservation, marine biology, or any topic you want to share."
                      className="w-full h-[350px] bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none font-mono text-sm leading-relaxed"
                    />
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>{content.length} characters</span>
                      <span>~{Math.ceil(content.length / 150)} min read time</span>
                    </div>
                  </motion.div>
                )}

                {/* Upload Tab */}
                {activeTab === 'upload' && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="h-full"
                  >
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Icons.Upload className="w-5 h-5 text-cyan-400" />
                      Upload Documents
                    </h3>

                    {/* Drop Zone */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-600 rounded-xl p-12 text-center hover:border-cyan-500 transition-colors cursor-pointer mb-4"
                    >
                      <Icons.CloudUpload className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-white font-medium mb-2">Click to upload or drag and drop</p>
                      <p className="text-sm text-slate-400">PDF, DOC, DOCX, TXT, MD files supported</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.txt,.md"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>

                    {/* Uploaded Files List */}
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">Uploaded Files ({uploadedFiles.length})</h4>
                        {uploadedFiles.map((file, index) => {
                          const FileIcon = getFileIcon(file.name);
                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg border border-slate-700"
                            >
                              <div className="flex items-center gap-3">
                                <FileIcon className="w-5 h-5 text-cyan-400" />
                                <div>
                                  <p className="text-white text-sm font-medium">{file.name}</p>
                                  <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                              </div>
                              <button
                                onClick={() => removeFile(index)}
                                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                              >
                                <Icons.Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Paste Tab */}
                {activeTab === 'paste' && (
                  <motion.div
                    key="paste"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="h-full"
                  >
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Icons.Clipboard className="w-5 h-5 text-cyan-400" />
                      Paste Your Notes
                    </h3>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Paste your notes, research findings, article content, or any text you want to convert into a podcast..."
                      className="w-full h-[350px] bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                    />
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm transition-colors">
                        <Icons.Copy className="w-4 h-4 inline mr-2" />
                        Clear Content
                      </button>
                      <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white text-sm transition-colors">
                        <Icons.Check className="w-4 h-4 inline mr-2" />
                        Process Content
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Panel - Settings & Generation */}
          <div className="space-y-6">
            {/* Voice Selection */}
            <div className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-4">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Icons.Mic className="w-5 h-5 text-cyan-400" />
                Voice Style
              </h3>
              <div className="space-y-2">
                {voiceOptions.map((voice) => {
                  const Icon = voice.icon;
                  return (
                    <button
                      key={voice.id}
                      onClick={() => setPodcastSettings({ ...podcastSettings, voice: voice.id })}
                      className={`w-full p-3 rounded-lg transition-all flex items-start gap-3 ${
                        podcastSettings.voice === voice.id
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500'
                          : 'bg-slate-900/50 border border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mt-0.5 ${podcastSettings.voice === voice.id ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <div className="text-left">
                        <p className={`font-medium text-sm ${podcastSettings.voice === voice.id ? 'text-white' : 'text-slate-300'}`}>
                          {voice.label}
                        </p>
                        <p className="text-xs text-slate-500">{voice.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Podcast Style */}
            <div className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-4">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Icons.Palette className="w-5 h-5 text-cyan-400" />
                Podcast Style
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {styleOptions.map((style) => {
                  const Icon = style.icon;
                  return (
                    <button
                      key={style.id}
                      onClick={() => setPodcastSettings({ ...podcastSettings, style: style.id })}
                      className={`p-3 rounded-lg transition-all ${
                        podcastSettings.style === style.id
                          ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500'
                          : 'bg-slate-900/50 border border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mx-auto mb-1 ${podcastSettings.style === style.id ? 'text-purple-400' : 'text-slate-400'}`} />
                      <p className={`text-xs font-medium ${podcastSettings.style === style.id ? 'text-white' : 'text-slate-400'}`}>
                        {style.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional Options */}
            <div className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-4">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Icons.Settings className="w-5 h-5 text-cyan-400" />
                Options
              </h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Include Background Music</span>
                  <input
                    type="checkbox"
                    checked={podcastSettings.includeMusic}
                    onChange={(e) => setPodcastSettings({ ...podcastSettings, includeMusic: e.target.checked })}
                    className="w-5 h-5 rounded bg-slate-700 border-slate-600"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Include Visuals & Graphics</span>
                  <input
                    type="checkbox"
                    checked={podcastSettings.includeVisuals}
                    onChange={(e) => setPodcastSettings({ ...podcastSettings, includeVisuals: e.target.checked })}
                    className="w-5 h-5 rounded bg-slate-700 border-slate-600"
                  />
                </label>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Language</label>
                  <select
                    value={podcastSettings.language}
                    onChange={(e) => setPodcastSettings({ ...podcastSettings, language: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
                  >
                    <option value="en">English</option>
                    <option value="si">Sinhala (සිංහල)</option>
                    <option value="ta">Tamil (தமிழ்)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!content && uploadedFiles.length === 0}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-700 disabled:to-slate-700 rounded-xl text-white font-bold text-lg shadow-lg shadow-cyan-500/50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <Icons.Sparkles className="w-6 h-6" />
              Generate AI Podcast
            </button>
          </div>
        </div>

        {/* Generation Progress Modal */}
        <AnimatePresence>
          {generationStep && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center"
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
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {generationStep === 'processing' ? 'Processing Content...' :
                         generationStep === 'generating' ? 'Generating Podcast...' : 'Creating Video...'}
                      </h3>
                      <p className="text-slate-400 mb-6">
                        {generationStep === 'processing' ? 'Analyzing your content with AI' :
                         generationStep === 'generating' ? 'Creating script and voice narration' : 'Rendering video with visuals'}
                      </p>
                      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-cyan-400 font-bold mt-3">{progress}%</p>
                    </>
                  ) : (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center"
                      >
                        <Icons.Check className="w-12 h-12 text-white" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white mb-2">Podcast Generated!</h3>
                      <p className="text-slate-400 mb-6">Your AI podcast is ready to publish</p>
                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            setGenerationStep(null);
                            setProgress(0);
                          }}
                          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg text-white font-bold transition-all"
                        >
                          View Podcast
                        </button>
                        <button
                          onClick={() => {
                            setGenerationStep(null);
                            setProgress(0);
                            onClose();
                          }}
                          className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition-all"
                        >
                          Close
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

export default AIPodcastGenerator;
