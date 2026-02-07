import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { uploadResearchContent } from '../../services/researchContentService';
import { translateWithGemini } from '../../services/translationService';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

/**
 * 📦 BULK RESEARCH UPLOAD ADMIN
 * Upload multiple research papers at once with auto-translation
 */
const BulkResearchUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [currentFile, setCurrentFile] = useState(0);
  const [results, setResults] = useState([]);
  const [autoTranslate, setAutoTranslate] = useState(true);
  
  // Common metadata for all papers
  const [commonData, setCommonData] = useState({
    category: 'Marine Ecology',
    language: 'en',
    status: 'published',
    defaultAuthors: '',
    defaultKeywords: ''
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

  const handleFilesSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== selectedFiles.length) {
      alert(`⚠️ Only PDF files accepted. ${selectedFiles.length - pdfFiles.length} files skipped.`);
    }

    // Create file objects with metadata
    const fileObjects = pdfFiles.map(file => ({
      file,
      title: file.name.replace('.pdf', '').replace(/_/g, ' '),
      description: '',
      abstract: '',
      authors: commonData.defaultAuthors,
      keywords: commonData.defaultKeywords,
      status: 'pending',
      error: null
    }));

    setFiles(fileObjects);
  };

  const updateFileData = (index, field, value) => {
    setFiles(prev => prev.map((f, i) => 
      i === index ? { ...f, [field]: value } : f
    ));
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadAll = async () => {
    setUploading(true);
    setResults([]);
    
    for (let i = 0; i < files.length; i++) {
      setCurrentFile(i);
      const fileData = files[i];
      
      try {
        // Update status
        updateFileData(i, 'status', 'uploading');

        // Prepare content data
        let contentData = {
          title: { en: fileData.title, si: '', ta: '' },
          description: { en: fileData.description || fileData.title, si: '', ta: '' },
          abstract: { en: fileData.abstract || '', si: '', ta: '' },
          authors: fileData.authors ? fileData.authors.split(',').map(a => a.trim()) : [],
          tags: fileData.keywords ? fileData.keywords.split(',').map(k => k.trim()) : [],
          category: commonData.category,
          language: 'en',
          status: 'published',
          publicationDate: new Date()
        };

        // Auto-translate if enabled
        if (autoTranslate) {
          updateFileData(i, 'status', 'translating');
          
          try {
            // Translate title
            const titleSi = await translateWithGemini(contentData.title.en, 'si');
            const titleTa = await translateWithGemini(contentData.title.en, 'ta');
            contentData.title.si = titleSi;
            contentData.title.ta = titleTa;

            // Translate description
            if (contentData.description.en) {
              const descSi = await translateWithGemini(contentData.description.en, 'si');
              const descTa = await translateWithGemini(contentData.description.en, 'ta');
              contentData.description.si = descSi;
              contentData.description.ta = descTa;
            }
          } catch (translationError) {
            console.warn('Translation failed for', fileData.title, translationError);
          }
        }

        // Upload to Firebase
        updateFileData(i, 'status', 'saving');
        await uploadResearchContent(contentData, fileData.file, 'bulk_upload_admin');

        // Success
        updateFileData(i, 'status', 'success');
        setResults(prev => [...prev, {
          file: fileData.title,
          status: 'success',
          message: '✅ Uploaded successfully'
        }]);

      } catch (error) {
        console.error('Upload failed for', fileData.title, error);
        updateFileData(i, 'status', 'error');
        updateFileData(i, 'error', error.message);
        setResults(prev => [...prev, {
          file: fileData.title,
          status: 'error',
          message: `❌ Failed: ${error.message}`
        }]);
      }

      // Small delay between uploads
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setUploading(false);
    setCurrentFile(files.length);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Icons.Clock className="w-5 h-5 text-gray-400" />;
      case 'uploading': return <Icons.Upload className="w-5 h-5 text-blue-600 animate-pulse" />;
      case 'translating': return <Icons.Languages className="w-5 h-5 text-purple-600 animate-pulse" />;
      case 'saving': return <Icons.Save className="w-5 h-5 text-indigo-600 animate-pulse" />;
      case 'success': return <Icons.CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error': return <Icons.XCircle className="w-5 h-5 text-red-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-gray-50 border-gray-200';
      case 'uploading': return 'bg-blue-50 border-blue-300';
      case 'translating': return 'bg-purple-50 border-purple-300';
      case 'saving': return 'bg-indigo-50 border-indigo-300';
      case 'success': return 'bg-green-50 border-green-300';
      case 'error': return 'bg-red-50 border-red-300';
      default: return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
                <Icons.Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Bulk Research Upload</h1>
                <p className="text-sm text-gray-600">Upload multiple research papers at once</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{files.length}</div>
                <div className="text-xs text-gray-600">Files Selected</div>
              </div>
              <button
                onClick={() => window.location.href = '/admin/research-upload'}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Icons.FileText className="w-4 h-4" />
                Single Upload
              </button>
              <button
                onClick={() => window.location.href = '/admin/master'}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Icons.ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Upload Area */}
        {files.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-12"
          >
            <div className="text-center">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
                <Icons.Upload className="w-12 h-12 text-purple-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Select Multiple PDF Files</h2>
              <p className="text-gray-600 mb-8">Upload multiple research papers in one go</p>

              {/* File Input */}
              <label className="inline-block cursor-pointer">
                <div className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-3">
                  <Icons.FolderOpen className="w-6 h-6" />
                  Choose PDF Files
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFilesSelect}
                  className="hidden"
                />
              </label>

              <p className="text-sm text-gray-500 mt-4">
                You can select multiple PDF files at once (Ctrl/Cmd + Click)
              </p>
            </div>

            {/* Common Settings */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Common Settings (Apply to All Papers)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={commonData.category}
                    onChange={(e) => setCommonData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Authors</label>
                  <input
                    type="text"
                    value={commonData.defaultAuthors}
                    onChange={(e) => setCommonData(prev => ({ ...prev, defaultAuthors: e.target.value }))}
                    placeholder="Dr. Silva, Dr. Fernando"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Keywords</label>
                  <input
                    type="text"
                    value={commonData.defaultKeywords}
                    onChange={(e) => setCommonData(prev => ({ ...prev, defaultKeywords: e.target.value }))}
                    placeholder="marine, research, sri lanka"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Files List */}
        {files.length > 0 && (
          <div className="space-y-6">
            {/* Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {files.length} Files Ready to Upload
                  </h2>
                  <p className="text-sm text-gray-600">Review and edit before uploading</p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Auto-translate Toggle */}
                  <div className="flex items-center gap-3 px-4 py-2 bg-purple-50 rounded-lg border border-purple-200">
                    <input
                      type="checkbox"
                      id="bulk-auto-translate"
                      checked={autoTranslate}
                      onChange={(e) => setAutoTranslate(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <label htmlFor="bulk-auto-translate" className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2">
                      <Icons.Languages className="w-4 h-4" />
                      Auto-translate
                    </label>
                  </div>

                  {/* Add More Files */}
                  <label className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer flex items-center gap-2 transition-colors">
                    <Icons.Plus className="w-4 h-4" />
                    Add More
                    <input
                      type="file"
                      accept=".pdf"
                      multiple
                      onChange={(e) => {
                        const newFiles = Array.from(e.target.files)
                          .filter(f => f.type === 'application/pdf')
                          .map(file => ({
                            file,
                            title: file.name.replace('.pdf', '').replace(/_/g, ' '),
                            description: '',
                            abstract: '',
                            authors: commonData.defaultAuthors,
                            keywords: commonData.defaultKeywords,
                            status: 'pending',
                            error: null
                          }));
                        setFiles(prev => [...prev, ...newFiles]);
                      }}
                      className="hidden"
                    />
                  </label>

                  {/* Upload All Button */}
                  <button
                    onClick={uploadAll}
                    disabled={uploading || files.length === 0}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold rounded-xl shadow-lg transition-all disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <Icons.Loader2 className="w-5 h-5 animate-spin" />
                        Uploading {currentFile + 1}/{files.length}
                      </>
                    ) : (
                      <>
                        <Icons.Upload className="w-5 h-5" />
                        Upload All ({files.length})
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              {uploading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Overall Progress
                    </span>
                    <span className="text-sm font-bold text-purple-600">
                      {Math.round((currentFile / files.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentFile / files.length) * 100}%` }}
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                    />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Files List */}
            <div className="space-y-3">
              <AnimatePresence>
                {files.map((fileData, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white rounded-xl shadow-lg p-6 border-2 ${getStatusColor(fileData.status)}`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Status Icon */}
                      <div className="flex-shrink-0 pt-1">
                        {getStatusIcon(fileData.status)}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={fileData.title}
                              onChange={(e) => updateFileData(index, 'title', e.target.value)}
                              disabled={uploading}
                              className="w-full font-semibold text-gray-900 bg-white border-b-2 border-transparent hover:border-gray-300 focus:border-purple-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed px-2 py-1"
                              placeholder="Paper title..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          
                          {!uploading && (
                            <button
                              onClick={() => removeFile(index)}
                              className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                            >
                              <Icons.Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={fileData.description}
                            onChange={(e) => updateFileData(index, 'description', e.target.value)}
                            disabled={uploading}
                            placeholder="Description (optional)"
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 bg-white"
                          />
                          <input
                            type="text"
                            value={fileData.authors}
                            onChange={(e) => updateFileData(index, 'authors', e.target.value)}
                            disabled={uploading}
                            placeholder="Authors (comma-separated)"
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 bg-white"
                          />
                        </div>

                        {fileData.error && (
                          <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                            ❌ {fileData.error}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Results Summary */}
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Icons.BarChart3 className="w-5 h-5" />
                  Upload Results
                </h3>
                <div className="space-y-2">
                  {results.map((result, i) => (
                    <div key={i} className="flex items-center justify-between py-2 px-4 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{result.file}</span>
                      <span className="text-sm">{result.message}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <strong>{results.filter(r => r.status === 'success').length}</strong> successful,{' '}
                    <strong>{results.filter(r => r.status === 'error').length}</strong> failed
                  </div>
                  <button
                    onClick={() => window.location.href = '/research-excellence-portal'}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Icons.ExternalLink className="w-4 h-4" />
                    View Portal
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkResearchUpload;
