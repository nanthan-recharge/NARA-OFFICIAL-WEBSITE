import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { uploadResearchContent } from '../../services/researchContentService';
import { translateWithGemini } from '../../services/translationService';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

/**
 * 📤 RESEARCH UPLOAD ADMIN PANEL
 * Standalone admin page for uploading research papers with auto-translation
 * No login required - Direct access from admin panel
 */
const ResearchUploadAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  
  const [formData, setFormData] = useState({
    title: { en: '', si: '', ta: '' },
    description: { en: '', si: '', ta: '' },
    abstract: { en: '', si: '', ta: '' },
    authors: '',
    category: 'Marine Ecology',
    keywords: '',
    publicationDate: '',
    doi: '',
    journal: '',
    volume: '',
    issue: '',
    pages: '',
    language: 'en',
    status: 'published'
  });

  const categories = [
    'Marine Ecology',
    'Oceanography',
    'Fisheries',
    'Climate Change',
    'Conservation',
    'Biotechnology',
    'Blue Economy',
    'Aquaculture',
    'Marine Pollution',
    'Policy & Governance',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultilingualChange = (field, lang, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value }
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        setMessage({ type: 'error', text: '❌ File too large! Maximum size is 50MB' });
        return;
      }
      setPdfFile(file);
      setMessage(null);
    } else {
      setMessage({ type: 'error', text: '❌ Please select a valid PDF file' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setTranslationProgress(0);

    try {
      const contentData = {
        ...formData,
        authors: formData.authors.split(',').map(a => a.trim()).filter(Boolean),
        tags: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
      };

      // Auto-translate if enabled
      if (autoTranslate) {
        console.log('🌐 Starting auto-translation...');
        console.log('English content:', {
          title: formData.title.en,
          description: formData.description.en,
          abstract: formData.abstract.en
        });
        
        setTranslating(true);
        setMessage({ type: 'info', text: '🌐 Translating to Sinhala & Tamil...' });
        
        try {
          // Translate title to Sinhala
          console.log('📝 Translating title to Sinhala...');
          if (!formData.title.si) {
            const titleSi = await translateWithGemini(formData.title.en, 'si');
            contentData.title.si = titleSi;
            setTranslationProgress(20);
          }
          
          // Translate title to Tamil
          if (!formData.title.ta) {
            const titleTa = await translateWithGemini(formData.title.en, 'ta');
            contentData.title.ta = titleTa;
            setTranslationProgress(40);
          }
          
          // Translate description to Sinhala
          if (formData.description.en && !formData.description.si) {
            const descSi = await translateWithGemini(formData.description.en, 'si');
            contentData.description.si = descSi;
            setTranslationProgress(60);
          }
          
          // Translate description to Tamil
          if (formData.description.en && !formData.description.ta) {
            const descTa = await translateWithGemini(formData.description.en, 'ta');
            contentData.description.ta = descTa;
            setTranslationProgress(80);
          }
          
          // Translate abstract if provided
          if (formData.abstract.en) {
            if (!formData.abstract.si) {
              const absSi = await translateWithGemini(formData.abstract.en, 'si');
              contentData.abstract.si = absSi;
            }
            if (!formData.abstract.ta) {
              const absTa = await translateWithGemini(formData.abstract.en, 'ta');
              contentData.abstract.ta = absTa;
            }
          }
          
          setTranslationProgress(100);
          setMessage({ type: 'success', text: '✅ Translation complete! Uploading to database...' });
        } catch (translationError) {
          console.error('❌ TRANSLATION ERROR:', translationError);
          console.error('Error details:', {
            message: translationError.message,
            stack: translationError.stack,
            name: translationError.name
          });
          setMessage({ 
            type: 'error', 
            text: `❌ Translation failed: ${translationError.message}. Check console for details.` 
          });
          // Don't continue upload if translation was expected
          throw translationError;
        } finally {
          setTranslating(false);
        }
      }

      // Upload to Firebase
      setMessage({ type: 'info', text: '📤 Uploading to database...' });
      await uploadResearchContent(contentData, pdfFile, 'admin_upload');
      
      setMessage({ 
        type: 'success', 
        text: autoTranslate 
          ? '🎉 Success! Paper uploaded in all 3 languages (EN, SI, TA)!' 
          : '✅ Success! Paper uploaded successfully!' 
      });
      
      setUploadedCount(prev => prev + 1);

      // Reset form
      setFormData({
        title: { en: '', si: '', ta: '' },
        description: { en: '', si: '', ta: '' },
        abstract: { en: '', si: '', ta: '' },
        authors: '',
        category: 'Marine Ecology',
        keywords: '',
        publicationDate: '',
        doi: '',
        journal: '',
        volume: '',
        issue: '',
        pages: '',
        language: 'en',
        status: 'published'
      });
      setPdfFile(null);
      
      // Clear file input
      document.getElementById('pdf-file-input').value = '';

    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: `❌ Upload failed: ${error.message}` });
    } finally {
      setLoading(false);
      setTranslating(false);
      setTranslationProgress(0);
    }
  };

  const loadStats = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'researchContent'));
      setUploadedCount(snapshot.size);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  React.useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                <Icons.FileUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Research Paper Upload</h1>
                <p className="text-sm text-gray-600">Auto-translate & publish research papers</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{uploadedCount}</div>
                <div className="text-xs text-gray-600">Total Papers</div>
              </div>
              <button
                onClick={() => window.location.href = '/admin/research-bulk-upload'}
                className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Icons.Layers className="w-4 h-4" />
                Bulk Upload
              </button>
              <button
                onClick={() => window.location.href = '/admin/master'}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Icons.ArrowLeft className="w-4 h-4" />
                Back to Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Alert Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg border-2 ${
                message.type === 'success' 
                  ? 'bg-green-50 border-green-300 text-green-800' 
                  : message.type === 'error'
                  ? 'bg-red-50 border-red-300 text-red-800'
                  : message.type === 'warning'
                  ? 'bg-yellow-50 border-yellow-300 text-yellow-800'
                  : 'bg-blue-50 border-blue-300 text-blue-800'
              }`}
            >
              <div className="flex items-start gap-3">
                {message.type === 'success' && <Icons.CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                {message.type === 'error' && <Icons.XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                {message.type === 'warning' && <Icons.AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                {message.type === 'info' && <Icons.Info className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Section */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-900">
                Title <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="English Title (Required)"
                  value={formData.title.en}
                  onChange={(e) => handleMultilingualChange('title', 'en', e.target.value)}
                  required
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
                <input
                  type="text"
                  placeholder="සිංහල මාතෘකාව (Optional)"
                  value={formData.title.si}
                  onChange={(e) => handleMultilingualChange('title', 'si', e.target.value)}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
                <input
                  type="text"
                  placeholder="தமிழ் தலைப்பு (Optional)"
                  value={formData.title.ta}
                  onChange={(e) => handleMultilingualChange('title', 'ta', e.target.value)}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-900">
                Description <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <textarea
                  placeholder="English Description"
                  value={formData.description.en}
                  onChange={(e) => handleMultilingualChange('description', 'en', e.target.value)}
                  required
                  rows={3}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 bg-white"
                />
                <textarea
                  placeholder="සිංහල විස්තරය"
                  value={formData.description.si}
                  onChange={(e) => handleMultilingualChange('description', 'si', e.target.value)}
                  rows={3}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 bg-white"
                />
                <textarea
                  placeholder="தமிழ் விளக்கம்"
                  value={formData.description.ta}
                  onChange={(e) => handleMultilingualChange('description', 'ta', e.target.value)}
                  rows={3}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 bg-white"
                />
              </div>
            </div>

            {/* Abstract */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-900">Abstract</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <textarea
                  placeholder="English Abstract"
                  value={formData.abstract.en}
                  onChange={(e) => handleMultilingualChange('abstract', 'en', e.target.value)}
                  rows={4}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 bg-white"
                />
                <textarea
                  placeholder="සිංහල සාරාංශය"
                  value={formData.abstract.si}
                  onChange={(e) => handleMultilingualChange('abstract', 'si', e.target.value)}
                  rows={4}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 bg-white"
                />
                <textarea
                  placeholder="தமிழ் சுருக்கம்"
                  value={formData.abstract.ta}
                  onChange={(e) => handleMultilingualChange('abstract', 'ta', e.target.value)}
                  rows={4}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 bg-white"
                />
              </div>
            </div>

            {/* Authors & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Authors <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="authors"
                  value={formData.authors}
                  onChange={handleChange}
                  required
                  placeholder="Dr. Silva, Dr. Fernando (comma-separated)"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Keywords & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Keywords/Tags</label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  placeholder="coral, reef, climate (comma-separated)"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Publication Date</label>
                <input
                  type="date"
                  name="publicationDate"
                  value={formData.publicationDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
            </div>

            {/* Journal Details */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-900 mb-2">Journal</label>
                <input
                  type="text"
                  name="journal"
                  value={formData.journal}
                  onChange={handleChange}
                  placeholder="Journal name"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Volume</label>
                <input
                  type="text"
                  name="volume"
                  value={formData.volume}
                  onChange={handleChange}
                  placeholder="Vol."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Issue</label>
                <input
                  type="text"
                  name="issue"
                  value={formData.issue}
                  onChange={handleChange}
                  placeholder="Issue"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
            </div>

            {/* DOI & Pages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">DOI</label>
                <input
                  type="text"
                  name="doi"
                  value={formData.doi}
                  onChange={handleChange}
                  placeholder="10.1000/xyz123"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Pages</label>
                <input
                  type="text"
                  name="pages"
                  value={formData.pages}
                  onChange={handleChange}
                  placeholder="1-10"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
            </div>

            {/* Auto-Translate Option */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <Icons.Languages className="w-6 h-6 text-blue-600" />
                <h3 className="font-bold text-gray-900 text-lg">AI-Powered Auto-Translation</h3>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  id="auto-translate"
                  checked={autoTranslate}
                  onChange={(e) => setAutoTranslate(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="auto-translate" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Automatically translate English content to Sinhala & Tamil using Gemini AI
                </label>
              </div>
              {autoTranslate && (
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-800 mb-2">
                    💡 <strong>How it works:</strong> Fill in the English fields only. AI will automatically translate to සිංහල & தமிழ் in ~30 seconds!
                  </p>
                  <p className="text-xs text-gray-600">
                    ⚡ Powered by Google Gemini AI • Fallback to Google Translate if needed
                  </p>
                </div>
              )}
              {translating && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-blue-700">Translating...</span>
                    <span className="text-sm font-bold text-blue-700">{translationProgress}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${translationProgress}%` }}
                      className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* PDF Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">PDF File</label>
              <div className="flex items-center gap-4">
                <label className="flex-1 flex items-center justify-center gap-3 px-6 py-8 border-2 border-dashed border-blue-300 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                  <Icons.Upload className="w-6 h-6 text-blue-500" />
                  <div className="text-center">
                    <span className="text-sm font-semibold text-gray-700">
                      {pdfFile ? pdfFile.name : 'Click to upload PDF file'}
                    </span>
                    {pdfFile && (
                      <p className="text-xs text-gray-500 mt-1">
                        {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                    {!pdfFile && (
                      <p className="text-xs text-gray-500 mt-1">Max 50MB</p>
                    )}
                  </div>
                  {pdfFile && <Icons.CheckCircle className="w-6 h-6 text-green-600" />}
                  <input
                    id="pdf-file-input"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {pdfFile && (
                  <button
                    type="button"
                    onClick={() => {
                      setPdfFile(null);
                      document.getElementById('pdf-file-input').value = '';
                    }}
                    className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Icons.X className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading || translating}
                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold rounded-xl shadow-lg transition-all disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
              >
                {loading || translating ? (
                  <>
                    <Icons.Loader2 className="w-6 h-6 animate-spin" />
                    {translating ? 'Translating...' : 'Uploading...'}
                  </>
                ) : (
                  <>
                    <Icons.Upload className="w-6 h-6" />
                    Upload & Publish Research Paper
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Icons.Lightbulb className="w-5 h-5 text-yellow-500" />
            Quick Tips
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <Icons.CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>Auto-translate enabled:</strong> Just fill English fields, AI handles the rest!</span>
            </li>
            <li className="flex items-start gap-2">
              <Icons.CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>Authors:</strong> Separate multiple authors with commas</span>
            </li>
            <li className="flex items-start gap-2">
              <Icons.CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>Keywords:</strong> Add 5-10 relevant tags for better searchability</span>
            </li>
            <li className="flex items-start gap-2">
              <Icons.CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>PDF:</strong> Maximum file size is 50MB</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default ResearchUploadAdmin;
