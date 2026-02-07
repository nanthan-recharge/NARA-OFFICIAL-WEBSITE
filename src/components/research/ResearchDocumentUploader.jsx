import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';
import { translateResearchPaper } from '../../services/translationService';
import { uploadResearchContent } from '../../services/researchContentService';
import { useAuth } from '../../hooks/useAuth';

/**
 * 📤 RESEARCH DOCUMENT UPLOADER WITH AUTO-TRANSLATION
 * Upload research papers and automatically translate to Sinhala & Tamil
 */
const ResearchDocumentUploader = ({ onUploadComplete }) => {
  const { user } = useAuth();
  const { t } = useTranslation('common');
  const [uploading, setUploading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    authors: '',
    category: '',
    tags: '',
    autoTranslate: true, // Auto-translate by default
    targetLanguages: ['si', 'ta']
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(selectedFile.type)) {
        alert('❌ Please upload PDF or Word document only');
        return;
      }

      // Validate file size (max 50MB)
      if (selectedFile.size > 50 * 1024 * 1024) {
        alert('❌ File too large! Maximum size is 50MB');
        return;
      }

      setFile(selectedFile);
      console.log('✅ File selected:', selectedFile.name);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLanguageToggle = (lang) => {
    setFormData(prev => ({
      ...prev,
      targetLanguages: prev.targetLanguages.includes(lang)
        ? prev.targetLanguages.filter(l => l !== lang)
        : [...prev.targetLanguages, lang]
    }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert('❌ Please select a file to upload');
      return;
    }

    if (!formData.title.trim()) {
      alert('❌ Please enter a title');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Step 1: Upload file to Firebase Storage (30%)
      console.log('📤 Step 1: Uploading file...');
      setProgress(10);

      const paperData = {
        title: { en: formData.title },
        description: { en: formData.description },
        authors: formData.authors.split(',').map(a => a.trim()),
        category: formData.category,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        language: 'en',
        publicationDate: new Date()
      };

      const uploadedPaper = await uploadResearchContent(paperData, file, user.uid);
      setProgress(30);
      console.log('✅ File uploaded successfully');

      // Step 2: Auto-translate if enabled (60%)
      if (formData.autoTranslate && formData.targetLanguages.length > 0) {
        setTranslating(true);
        console.log('🌐 Step 2: Translating to', formData.targetLanguages.join(', '));
        setProgress(40);

        for (const lang of formData.targetLanguages) {
          try {
            console.log(`🌐 Translating to ${lang}...`);
            const translated = await translateResearchPaper(uploadedPaper, lang);
            
            // Update Firestore with translation
            await uploadResearchContent(
              {
                ...translated,
                originalId: uploadedPaper.id,
                translatedFrom: 'en',
                translationType: 'auto'
              },
              null,
              user.uid
            );
            
            setProgress(prev => prev + (60 / formData.targetLanguages.length));
            console.log(`✅ ${lang.toUpperCase()} translation complete`);
            
          } catch (error) {
            console.error(`❌ Translation to ${lang} failed:`, error);
            // Continue with other languages even if one fails
          }
        }
        
        setTranslating(false);
      }

      // Step 3: Complete (100%)
      setProgress(100);
      console.log('🎉 Upload and translation complete!');

      // Show success message
      const translationMsg = formData.autoTranslate 
        ? `\n\n✅ Translated to: ${formData.targetLanguages.map(l => l.toUpperCase()).join(', ')}` 
        : '';
        
      alert(`🎉 Success!\n\n📄 ${formData.title}\n📤 Uploaded successfully${translationMsg}`);

      // Reset form
      setFile(null);
      setFormData({
        title: '',
        description: '',
        authors: '',
        category: '',
        tags: '',
        autoTranslate: true,
        targetLanguages: ['si', 'ta']
      });

      // Callback
      onUploadComplete?.();

    } catch (error) {
      console.error('❌ Upload failed:', error);
      alert(`❌ Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      setTranslating(false);
      setProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
            <Icons.FileUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upload Research Paper</h2>
            <p className="text-gray-600">Auto-translate to Sinhala & Tamil</p>
          </div>
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Document File *
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center gap-3 px-6 py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                {file ? (
                  <>
                    <Icons.File className="w-8 h-8 text-blue-600" />
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-600">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Icons.CheckCircle className="w-6 h-6 text-green-600 ml-auto" />
                  </>
                ) : (
                  <>
                    <Icons.Upload className="w-8 h-8 text-gray-400" />
                    <div className="text-center">
                      <p className="font-semibold text-gray-700">Click to upload document</p>
                      <p className="text-sm text-gray-500">PDF, DOC, DOCX (Max 50MB)</p>
                    </div>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title (English) *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder={t('researchForms.titlePlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Abstract / Description (English)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder={t('researchForms.descriptionPlaceholder')}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Authors */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Authors (comma-separated)
            </label>
            <input
              type="text"
              name="authors"
              value={formData.authors}
              onChange={handleInputChange}
              placeholder={t('researchForms.authorsPlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="Fisheries">Fisheries</option>
                <option value="Marine Ecology">Marine Ecology</option>
                <option value="Conservation">Conservation</option>
                <option value="Aquaculture">Aquaculture</option>
                <option value="Oceanography">Oceanography</option>
                <option value="Biotechnology">Biotechnology</option>
                <option value="Blue Economy">Blue Economy</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder={t('researchForms.keywordsPlaceholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Auto-Translation Options */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <Icons.Languages className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-gray-900">Auto-Translation</h3>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                name="autoTranslate"
                checked={formData.autoTranslate}
                onChange={handleInputChange}
                id="auto-translate"
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="auto-translate" className="text-sm font-medium text-gray-700">
                Automatically translate to other languages using Gemini AI
              </label>
            </div>

            {formData.autoTranslate && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleLanguageToggle('si')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    formData.targetLanguages.includes('si')
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
                  }`}
                >
                  <span className="mr-2">🇱🇰</span> Sinhala (සිංහල)
                </button>

                <button
                  type="button"
                  onClick={() => handleLanguageToggle('ta')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    formData.targetLanguages.includes('ta')
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-500'
                  }`}
                >
                  <span className="mr-2">🇱🇰</span> Tamil (தமிழ்)
                </button>
              </div>
            )}

            <p className="text-xs text-gray-600 mt-3">
              ⚡ Powered by Google Gemini AI • Fallback to Google Translate if limit reached
            </p>
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  {translating ? '🌐 Translating...' : '📤 Uploading...'}
                </span>
                <span className="text-sm font-bold text-blue-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold rounded-xl shadow-lg transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Icons.Loader2 className="w-5 h-5 animate-spin" />
                {translating ? 'Translating...' : 'Uploading...'}
              </>
            ) : (
              <>
                <Icons.Upload className="w-5 h-5" />
                Upload & Translate
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResearchDocumentUploader;
