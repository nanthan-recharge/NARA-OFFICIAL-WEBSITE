import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { podcastService, podcastAnalyticsService } from '../../services/podcastService';
import * as Icons from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Timestamp } from 'firebase/firestore';
import { storage } from '../../config/firebase';

const PodcastAnalyticsDashboard = lazy(() => import('./PodcastAnalyticsDashboard'));
const EnhancedAIPodcastGenerator = lazy(() => import('../podcasts/EnhancedAIPodcastGenerator'));

const PodcastAdmin = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState(null);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('manage'); // 'manage' or 'analytics'
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoFile, setVideoFile] = useState(null);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'compact', 'grid'

  const [formData, setFormData] = useState({
    title: { en: '', si: '', ta: '' },
    description: { en: '', si: '', ta: '' },
    category: 'marine-research',
    languages: ['en'], // Available languages for this podcast
    youtubeId: '',
    youtubeUrl: '',
    audioUrl: '',
    notebooklmUrl: '',
    duration: '',
    thumbnail: '',
    tags: [],
    featured: false,
    status: 'published',
    publishedAt: new Date()
  });

  const categories = [
    { value: 'marine-research', label: 'Marine Research' },
    { value: 'ocean-science', label: 'Ocean Science' },
    { value: 'conservation', label: 'Conservation' },
    { value: 'interviews', label: 'Interviews' },
    { value: 'live', label: 'Live Sessions' }
  ];

  const availableLanguages = [
    { value: 'en', label: 'English', flag: '🇬🇧' },
    { value: 'si', label: 'Sinhala', flag: '🇱🇰' },
    { value: 'ta', label: 'Tamil', flag: '🇱🇰' }
  ];

  useEffect(() => {
    loadPodcasts();
    loadStatistics();
  }, []);

  const loadPodcasts = async () => {
    setLoading(true);
    const { data, error } = await podcastService.getAll({});
    if (!error && data) {
      setPodcasts(data);
    }
    setLoading(false);
  };

  const loadStatistics = async () => {
    const { data } = await podcastAnalyticsService.getStatistics();
    setStats(data);
  };

  const extractYoutubeId = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  const handleYoutubeUrlChange = (url) => {
    const youtubeId = extractYoutubeId(url);
    setFormData(prev => ({
      ...prev,
      youtubeUrl: url,
      youtubeId: youtubeId
    }));
  };

  const handleInputChange = (field, value, lang = null) => {
    if (lang) {
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const toggleLanguage = (langCode) => {
    setFormData(prev => {
      const currentLangs = prev.languages || [];
      const hasLang = currentLangs.includes(langCode);

      if (hasLang) {
        // Remove language (but keep at least one)
        if (currentLangs.length > 1) {
          return { ...prev, languages: currentLangs.filter(l => l !== langCode) };
        }
        return prev; // Don't remove if it's the only language
      } else {
        // Add language
        return { ...prev, languages: [...currentLangs, langCode] };
      }
    });
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is a video
      if (!file.type.startsWith('video/')) {
        alert('Please select a valid video file');
        return;
      }
      // Check file size (max 500MB)
      if (file.size > 500 * 1024 * 1024) {
        alert('Video file size must be less than 500MB');
        return;
      }
      setVideoFile(file);
    }
  };

  const uploadVideoToFirebase = async () => {
    if (!videoFile) {
      alert('Please select a video file first');
      return;
    }

    setUploadingVideo(true);
    setUploadProgress(0);

    try {
      // Create a unique filename
      const timestamp = Date.now();
      const fileName = `podcasts/${timestamp}_${videoFile.name}`;
      const storageRef = ref(storage, fileName);

      // Upload file with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, videoFile);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Track upload progress
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(Math.round(progress));
          },
          (error) => {
            console.error('Upload error:', error);
            setUploadingVideo(false);
            alert('Error uploading video: ' + error.message);
            reject(error);
          },
          async () => {
            // Upload completed successfully
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setUploadingVideo(false);
            setUploadProgress(0);
            setVideoFile(null);

            // Set the video URL in form data
            setFormData(prev => ({
              ...prev,
              youtubeUrl: downloadURL,
              youtubeId: '' // Clear YouTube ID when using uploaded video
            }));

            alert('Video uploaded successfully!');
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      setUploadingVideo(false);
      alert('Error uploading video: ' + error.message);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate that we have either a YouTube URL or uploaded video
      if (!formData.youtubeUrl && !formData.youtubeId) {
        alert('Please either upload a video or provide a YouTube URL');
        setLoading(false);
        return;
      }

      // Convert publishedAt to Firestore Timestamp
      const publishedAtDate = formData.publishedAt || new Date();
      const publishedAtTimestamp = publishedAtDate instanceof Date
        ? Timestamp.fromDate(publishedAtDate)
        : publishedAtDate;

      // Clean the data - remove any undefined/null values and ensure proper types
      const podcastData = {
        title: formData.title || { en: '', si: '', ta: '' },
        description: formData.description || { en: '', si: '', ta: '' },
        category: formData.category || 'marine-research',
        languages: Array.isArray(formData.languages) ? formData.languages : ['en'],
        youtubeId: formData.youtubeId || '',
        youtubeUrl: formData.youtubeUrl || '',
        audioUrl: formData.audioUrl || '',
        notebooklmUrl: formData.notebooklmUrl || '',
        duration: formData.duration || '',
        thumbnail: formData.thumbnail || '',
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        featured: Boolean(formData.featured),
        status: formData.status || 'published',
        publishedAt: publishedAtTimestamp
      };

      console.log('💾 Saving podcast data:', JSON.stringify(podcastData, null, 2));
      console.log('📹 Video URL:', podcastData.youtubeUrl);
      console.log('🌐 Languages:', podcastData.languages);
      console.log('📅 PublishedAt:', publishedAtTimestamp);

      if (editingPodcast) {
        const result = await podcastService.update(editingPodcast.id, podcastData);
        if (result.error) {
          console.error('❌ Update failed:', result.error);
          alert('Error updating podcast: ' + result.error);
          return;
        }
        alert('Podcast updated successfully! ✅');
      } else {
        const result = await podcastService.create(podcastData);
        if (result.error) {
          console.error('❌ Create failed:', result.error);
          alert('Error creating podcast: ' + result.error);
          return;
        }
        alert('Podcast created successfully! ✅ Your video is now live!');
      }

      resetForm();
      await loadPodcasts();
      await loadStatistics();
    } catch (error) {
      console.error('Error saving podcast:', error);
      alert('Error saving podcast: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (podcast) => {
    setEditingPodcast(podcast);
    setFormData({
      title: podcast.title || { en: '', si: '', ta: '' },
      description: podcast.description || { en: '', si: '', ta: '' },
      category: podcast.category || 'marine-research',
      languages: podcast.languages || ['en'],
      youtubeId: podcast.youtubeId || '',
      youtubeUrl: podcast.youtubeUrl || '',
      audioUrl: podcast.audioUrl || '',
      notebooklmUrl: podcast.notebooklmUrl || '',
      duration: podcast.duration || '',
      thumbnail: podcast.thumbnail || '',
      tags: podcast.tags || [],
      featured: podcast.featured || false,
      status: podcast.status || 'published',
      publishedAt: podcast.publishedAt || new Date()
    });
    setShowForm(true);
  };

  const handleDelete = async (podcastId) => {
    if (!confirm('Are you sure you want to delete this podcast?')) return;

    setLoading(true);
    await podcastService.delete(podcastId);
    await loadPodcasts();
    await loadStatistics();
    setLoading(false);
  };

  const resetForm = () => {
    setEditingPodcast(null);
    setFormData({
      title: { en: '', si: '', ta: '' },
      description: { en: '', si: '', ta: '' },
      category: 'marine-research',
      languages: ['en'],
      youtubeId: '',
      youtubeUrl: '',
      audioUrl: '',
      notebooklmUrl: '',
      duration: '',
      thumbnail: '',
      tags: [],
      featured: false,
      status: 'published',
      publishedAt: new Date()
    });
    setShowForm(false);
  };

  const handleAIGenerate = async (result) => {
    // Refresh podcast list after AI generation
    await loadPodcasts();
    await loadStatistics();
    setShowAIGenerator(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#003366] to-[#0066CC] mb-4">
            Podcast Management
          </h1>
          <p className="text-slate-500 mb-6">Manage NARA podcast episodes and NotebookLM integrations</p>

          {/* Tab Navigation */}
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 ${
                activeTab === 'manage'
                  ? 'bg-gradient-to-r from-[#003366] to-[#0066CC] text-white shadow-lg shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icons.Settings className="w-5 h-5" />
              Manage Episodes
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-[#003366] to-[#0066CC] text-white shadow-lg shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icons.BarChart3 className="w-5 h-5" />
              Analytics Dashboard
            </button>
          </div>
        </motion.div>

        {/* Analytics Tab */}
        {activeTab === 'analytics' ? (
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Icons.BarChart3 className="w-16 h-16 text-[#0066CC]" />
              </motion.div>
            </div>
          }>
            <PodcastAnalyticsDashboard />
          </Suspense>
        ) : (
          <>
        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 backdrop-blur-lg rounded-2xl p-6 border border-blue-200"
            >
              <Icons.Radio className="w-8 h-8 text-[#0066CC] mb-2" />
              <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
              <div className="text-sm text-slate-600">Total Episodes</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-green-50 to-emerald-100 backdrop-blur-lg rounded-2xl p-6 border border-green-200"
            >
              <Icons.CheckCircle className="w-8 h-8 text-green-600 mb-2" />
              <div className="text-3xl font-bold text-slate-900">{stats.published}</div>
              <div className="text-sm text-slate-600">Published</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-50 to-pink-100 backdrop-blur-lg rounded-2xl p-6 border border-purple-200"
            >
              <Icons.Eye className="w-8 h-8 text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-slate-900">{stats.totalViews}</div>
              <div className="text-sm text-slate-600">Total Views</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-red-50 to-orange-100 backdrop-blur-lg rounded-2xl p-6 border border-red-200"
            >
              <Icons.Heart className="w-8 h-8 text-red-500 mb-2" />
              <div className="text-3xl font-bold text-slate-900">{stats.totalLikes}</div>
              <div className="text-sm text-slate-600">Total Likes</div>
            </motion.div>
          </div>
        )}

        {/* Add New Button, AI Generator Button & View Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-4">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="px-8 py-4 bg-gradient-to-r from-[#003366] to-[#0066CC] text-white rounded-2xl font-bold shadow-lg hover:shadow-sm transition-all flex items-center gap-3"
          >
            <Icons.Plus className="w-6 h-6" />
            {showForm ? 'Close Form' : 'Add New Podcast'}
          </motion.button>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAIGenerator(true)}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-3"
          >
            <Icons.Sparkles className="w-6 h-6" />
            AI Podcast Generator
          </motion.button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-slate-100 backdrop-blur-lg rounded-xl p-1 border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                viewMode === 'list' ? 'bg-[#0066CC] text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="List View"
            >
              <Icons.List className="w-4 h-4" />
              List
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                viewMode === 'compact' ? 'bg-[#0066CC] text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Compact View"
            >
              <Icons.AlignJustify className="w-4 h-4" />
              Compact
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                viewMode === 'grid' ? 'bg-[#0066CC] text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <Icons.Grid3x3 className="w-4 h-4" />
              Grid
            </button>
          </div>
        </div>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="mb-8 bg-white backdrop-blur-lg rounded-3xl p-8 border border-slate-200 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {editingPodcast ? 'Edit Podcast' : 'Create New Podcast'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title Fields */}
                <div className="md:col-span-2">
                  <label className="block text-slate-900 font-semibold mb-3">Title</label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="English Title"
                      value={formData.title.en}
                      onChange={(e) => handleInputChange('title', e.target.value, 'en')}
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0066CC]"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Sinhala Title (සිංහල)"
                      value={formData.title.si}
                      onChange={(e) => handleInputChange('title', e.target.value, 'si')}
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0066CC]"
                    />
                    <input
                      type="text"
                      placeholder="Tamil Title (தமிழ்)"
                      value={formData.title.ta}
                      onChange={(e) => handleInputChange('title', e.target.value, 'ta')}
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0066CC]"
                    />
                  </div>
                </div>

                {/* Description Fields */}
                <div className="md:col-span-2">
                  <label className="block text-slate-900 font-semibold mb-3">Description</label>
                  <div className="space-y-3">
                    <textarea
                      placeholder="English Description"
                      value={formData.description.en}
                      onChange={(e) => handleInputChange('description', e.target.value, 'en')}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0066CC]"
                      required
                    />
                    <textarea
                      placeholder="Sinhala Description (සිංහල)"
                      value={formData.description.si}
                      onChange={(e) => handleInputChange('description', e.target.value, 'si')}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0066CC]"
                    />
                    <textarea
                      placeholder="Tamil Description (தமிழ்)"
                      value={formData.description.ta}
                      onChange={(e) => handleInputChange('description', e.target.value, 'ta')}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0066CC]"
                    />
                  </div>
                </div>

                {/* YouTube URL */}
                <div className="md:col-span-2">
                  <label className="block text-slate-900 font-semibold mb-2">YouTube URL</label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={formData.youtubeUrl}
                    onChange={(e) => handleYoutubeUrlChange(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0066CC]"
                  />
                  {formData.youtubeId && (
                    <p className="mt-2 text-sm text-green-400">
                      Extracted Video ID: {formData.youtubeId}
                    </p>
                  )}
                </div>

                {/* OR DIVIDER */}
                <div className="md:col-span-2 flex items-center gap-4">
                  <div className="flex-1 h-px bg-slate-300"></div>
                  <span className="text-slate-500 font-semibold">OR</span>
                  <div className="flex-1 h-px bg-slate-300"></div>
                </div>

                {/* Video Upload Section */}
                <div className="md:col-span-2">
                  <label className="block text-slate-900 font-semibold mb-3">Upload Video File to Firebase Storage</label>

                  {/* File Input */}
                  <div className="mb-4">
                    <label className="flex items-center justify-center w-full px-6 py-8 bg-gradient-to-br from-blue-50 to-blue-50 border-2 border-dashed border-[#0066CC]/50 rounded-2xl cursor-pointer hover:border-[#0066CC] hover:bg-blue-100 transition-all group">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoFileChange}
                        className="hidden"
                        disabled={uploadingVideo}
                      />
                      <div className="text-center">
                        <Icons.Upload className="w-12 h-12 text-[#0066CC] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <p className="text-slate-900 font-semibold mb-1">
                          {videoFile ? videoFile.name : 'Click to select video file'}
                        </p>
                        <p className="text-slate-500 text-sm">
                          MP4, MOV, AVI (Max 500MB)
                        </p>
                        {videoFile && (
                          <p className="text-[#0066CC] text-sm mt-2">
                            Size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* Upload Button */}
                  {videoFile && !uploadingVideo && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      type="button"
                      onClick={uploadVideoToFirebase}
                      className="w-full px-6 py-4 bg-gradient-to-r from-[#003366] to-[#0066CC] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-sm transition-all flex items-center justify-center gap-3"
                    >
                      <Icons.CloudUpload className="w-5 h-5" />
                      Upload Video to Firebase
                    </motion.button>
                  )}

                  {/* Upload Progress */}
                  {uploadingVideo && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 space-y-3"
                    >
                      <div className="flex items-center justify-between text-slate-900">
                        <span className="font-semibold">Uploading...</span>
                        <span className="text-[#0066CC] font-bold">{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          className="h-full bg-gradient-to-r from-[#003366] to-[#0066CC]"
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Icons.Loader className="w-4 h-4 animate-spin" />
                        <span>Please wait while your video is being uploaded...</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Success Message */}
                  {formData.youtubeUrl && !formData.youtubeId && !uploadingVideo && (
                    <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Icons.CheckCircle className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-green-400 font-semibold">Video uploaded successfully!</p>
                          <p className="text-green-300 text-sm mt-1 break-all">
                            {formData.youtubeUrl}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* NotebookLM URL */}
                <div className="md:col-span-2">
                  <label className="block text-slate-900 font-semibold mb-2">NotebookLM URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://notebooklm.google.com/..."
                    value={formData.notebooklmUrl}
                    onChange={(e) => handleInputChange('notebooklmUrl', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0066CC]"
                  />
                </div>

                {/* Audio URL */}
                <div>
                  <label className="block text-slate-900 font-semibold mb-2">Audio URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.audioUrl}
                    onChange={(e) => handleInputChange('audioUrl', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0066CC]"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-slate-900 font-semibold mb-2">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g., 45:30"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0066CC]"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-slate-900 font-semibold mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#0066CC]"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value} className="bg-white">
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-slate-900 font-semibold mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#0066CC]"
                    required
                  >
                    <option value="published" className="bg-white">Published</option>
                    <option value="draft" className="bg-white">Draft</option>
                  </select>
                </div>

                {/* Available Languages */}
                <div className="md:col-span-2">
                  <label className="block text-slate-900 font-semibold mb-3">Available Languages</label>
                  <div className="flex gap-4 flex-wrap">
                    {availableLanguages.map(lang => (
                      <motion.button
                        key={lang.value}
                        type="button"
                        onClick={() => toggleLanguage(lang.value)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                          formData.languages.includes(lang.value)
                            ? 'bg-gradient-to-r from-[#003366] to-[#0066CC] text-white shadow-lg shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <span>{lang.label}</span>
                        {formData.languages.includes(lang.value) && (
                          <Icons.CheckCircle className="w-5 h-5" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-slate-500 text-sm mt-2">
                    Select all languages in which this podcast is available
                  </p>
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label className="block text-slate-900 font-semibold mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="marine, research, ocean"
                    value={formData.tags.join(', ')}
                    onChange={handleTagsChange}
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0066CC]"
                  />
                </div>

                {/* Featured Toggle */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="w-6 h-6 rounded bg-slate-100 border-2 border-slate-300 checked:bg-[#0066CC]"
                    />
                    <span className="text-slate-900 font-semibold">Featured Podcast</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-[#003366] to-[#0066CC] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-sm transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingPodcast ? 'Update Podcast' : 'Create Podcast'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-4 bg-slate-200 text-slate-900 rounded-xl font-bold hover:bg-slate-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Podcasts List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">All Podcasts</h2>

          {loading && !showForm ? (
            <div className="flex justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Icons.Radio className="w-12 h-12 text-[#0066CC]" />
              </motion.div>
            </div>
          ) : viewMode === 'compact' ? (
            // COMPACT TABLE VIEW
            <div className="bg-white backdrop-blur-lg rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr className="border-b border-slate-200">
                    <th className="text-left p-3 text-slate-900 font-semibold text-sm">Title</th>
                    <th className="text-left p-3 text-slate-900 font-semibold text-sm">Category</th>
                    <th className="text-center p-3 text-slate-900 font-semibold text-sm">Views</th>
                    <th className="text-center p-3 text-slate-900 font-semibold text-sm">Likes</th>
                    <th className="text-center p-3 text-slate-900 font-semibold text-sm">Status</th>
                    <th className="text-center p-3 text-slate-900 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {podcasts.map((podcast) => (
                    <motion.tr
                      key={podcast.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-10 rounded-lg overflow-hidden bg-white flex-shrink-0">
                            {podcast.youtubeId ? (
                              <img
                                src={`https://img.youtube.com/vi/${podcast.youtubeId}/mqdefault.jpg`}
                                alt={podcast.title?.en}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Icons.Radio className="w-4 h-4 text-slate-700" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-900 font-semibold text-sm truncate">{podcast.title?.en}</p>
                            <p className="text-slate-500 text-xs truncate">{podcast.description?.en}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-slate-600 text-sm">{podcast.category}</span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="text-slate-600 text-sm">{podcast.views || 0}</span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="text-slate-600 text-sm">{podcast.likes || 0}</span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                          podcast.status === 'published'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-slate-500/20 text-slate-500'
                        }`}>
                          {podcast.status?.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(podcast)}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                            title="Edit"
                          >
                            <Icons.Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(podcast.id)}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                            title="Delete"
                          >
                            <Icons.Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : viewMode === 'grid' ? (
            // SMALL GRID VIEW
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {podcasts.map((podcast) => (
                <motion.div
                  key={podcast.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white backdrop-blur-lg rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:border-[#0066CC]/50 transition-all"
                >
                  {/* Thumbnail */}
                  <div className="w-full h-32 bg-white">
                    {podcast.youtubeId ? (
                      <img
                        src={`https://img.youtube.com/vi/${podcast.youtubeId}/mqdefault.jpg`}
                        alt={podcast.title?.en}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icons.Radio className="w-12 h-12 text-slate-700" />
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-slate-900 font-bold text-sm mb-1 truncate">
                      {podcast.title?.en}
                    </h3>
                    <p className="text-slate-500 text-xs mb-3 line-clamp-2">
                      {podcast.description?.en}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Icons.Eye className="w-3 h-3" />
                        {podcast.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icons.Heart className="w-3 h-3" />
                        {podcast.likes || 0}
                      </span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(podcast)}
                        className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-semibold hover:bg-blue-500/30 transition-all flex items-center justify-center gap-1"
                      >
                        <Icons.Edit className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(podcast.id)}
                        className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold hover:bg-red-500/30 transition-all flex items-center justify-center gap-1"
                      >
                        <Icons.Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // DEFAULT LIST VIEW
            <div className="grid gap-4">
              {podcasts.map((podcast) => (
                <motion.div
                  key={podcast.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white backdrop-blur-lg rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-[#0066CC]/50 transition-all"
                >
                  <div className="flex items-start gap-6">
                    {/* Thumbnail */}
                    <div className="w-48 h-32 rounded-xl overflow-hidden bg-white flex-shrink-0">
                      {podcast.youtubeId ? (
                        <img
                          src={`https://img.youtube.com/vi/${podcast.youtubeId}/mqdefault.jpg`}
                          alt={podcast.title?.en}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icons.Radio className="w-12 h-12 text-slate-700" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-1">
                            {podcast.title?.en}
                          </h3>
                          <p className="text-slate-500 text-sm line-clamp-2">
                            {podcast.description?.en}
                          </p>
                        </div>

                        {/* Badges */}
                        <div className="flex gap-2">
                          {podcast.featured && (
                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full border border-yellow-500/30">
                              FEATURED
                            </span>
                          )}
                          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                            podcast.status === 'published'
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : 'bg-slate-500/20 text-slate-500 border-slate-500/30'
                          }`}>
                            {podcast.status?.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center gap-6 text-sm text-slate-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Icons.FolderOpen className="w-4 h-4" />
                          {podcast.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icons.Eye className="w-4 h-4" />
                          {podcast.views || 0} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Icons.Heart className="w-4 h-4" />
                          {podcast.likes || 0} likes
                        </span>
                        {podcast.duration && (
                          <span className="flex items-center gap-1">
                            <Icons.Clock className="w-4 h-4" />
                            {podcast.duration}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(podcast)}
                          className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg font-semibold hover:bg-blue-500/30 transition-all flex items-center gap-2"
                        >
                          <Icons.Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(podcast.id)}
                          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-semibold hover:bg-red-500/30 transition-all flex items-center gap-2"
                        >
                          <Icons.Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && podcasts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <Icons.Radio className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-500 mb-2">No podcasts yet</h3>
              <p className="text-slate-500">Create your first podcast to get started</p>
            </div>
          )}
        </div>
        </>
        )}

        {/* AI Podcast Generator Modal */}
        <AnimatePresence>
          {showAIGenerator && (
            <Suspense fallback={
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-3xl border border-slate-200"
                >
                  <Icons.Loader className="w-12 h-12 text-[#0066CC] animate-spin mx-auto" />
                  <p className="text-slate-900 mt-4">Loading AI Podcast Generator...</p>
                </motion.div>
              </div>
            }>
              <EnhancedAIPodcastGenerator
                onClose={() => setShowAIGenerator(false)}
                onGenerate={handleAIGenerate}
              />
            </Suspense>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PodcastAdmin;
