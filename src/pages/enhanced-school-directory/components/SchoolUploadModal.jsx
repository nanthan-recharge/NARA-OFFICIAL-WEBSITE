import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  X,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  Loader,
  Database,
  CloudUpload
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SchoolUploadModal = ({ isOpen, onClose, category, onUploadSuccess }) => {
  const { t } = useTranslation('aquaSchool');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  const [errorMessage, setErrorMessage] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];

    if (!validTypes.includes(file.type)) {
      setErrorMessage(t('upload.invalidFileType', 'Please upload an Excel (.xlsx, .xls) or CSV file'));
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage(t('upload.fileTooLarge', 'File size must be less than 10MB'));
      return;
    }

    setSelectedFile(file);
    setErrorMessage('');
    setUploadStatus(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Create FormData
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('category', category);
      formData.append('timestamp', new Date().toISOString());

      // Upload to Firebase Storage (you'll need to implement this endpoint)
      const response = await fetch('/api/upload-school-data', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        setUploadStatus('success');
        setTimeout(() => {
          onUploadSuccess();
          onClose();
        }, 2000);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setErrorMessage(t('upload.uploadFailed', 'Upload failed. Please try again.'));
    } finally {
      setUploading(false);
    }
  };

  const resetModal = () => {
    setSelectedFile(null);
    setUploading(false);
    setUploadProgress(0);
    setUploadStatus(null);
    setErrorMessage('');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{t('upload.title', 'Upload School Data')}</h2>
              <p className="text-sm text-slate-400">{t('upload.subtitle', 'Upload Excel file for')} {category}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* File Drop Zone */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragActive
                ? 'border-green-500 bg-green-500/10'
                : selectedFile
                ? 'border-green-500 bg-green-500/5'
                : 'border-slate-600 hover:border-slate-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />

            {selectedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <FileSpreadsheet className="w-8 h-8 text-green-500" />
                  <div className="text-left">
                    <p className="font-medium text-white">{selectedFile.name}</p>
                    <p className="text-sm text-slate-400">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>{t('upload.fileReady', 'File ready for upload')}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <CloudUpload className="w-12 h-12 text-slate-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-white mb-2">
                    {t('upload.dragDrop', 'Drag & drop your Excel file here')}
                  </p>
                  <p className="text-sm text-slate-400 mb-4">
                    {t('upload.orClick', 'or click to browse files')}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>{t('upload.supportedFormats', 'Supports .xlsx, .xls, .csv files')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Loader className="w-4 h-4 animate-spin" />
                <span>{t('upload.uploading', 'Uploading...')}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 text-center">{uploadProgress}%</p>
            </div>
          )}

          {/* Upload Status */}
          {uploadStatus === 'success' && (
            <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">{t('upload.success', 'Upload successful! Data will be available shortly.')}</span>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <h3 className="text-sm font-medium text-white mb-2">{t('upload.instructions', 'File Format Requirements')}</h3>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• {t('upload.instruction1', 'First row should contain column headers')}</li>
              <li>• {t('upload.instruction2', 'Required columns: School Name, District, Students')}</li>
              <li>• {t('upload.instruction3', 'Optional columns: Contact Person, Phone, Email, Partner Since')}</li>
              <li>• {t('upload.instruction4', 'Maximum file size: 10MB')}</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700/50">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            disabled={uploading}
          >
            {t('actions.cancel', 'Cancel')}
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <div className="flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                <span>{t('upload.uploading', 'Uploading...')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>{t('actions.upload', 'Upload')}</span>
              </div>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SchoolUploadModal;
