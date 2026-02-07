import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, File, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase';
import toast from 'react-hot-toast';

/**
 * Document Uploader Component
 * Drag & drop file upload with Firebase Storage integration
 */
const DocumentUploader = ({ 
  onUploadComplete, 
  category = 'general',
  maxFiles = 5,
  maxSizeMB = 10,
  acceptedFormats = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png']
  }
}) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach(error => {
          if (error.code === 'file-too-large') {
            toast.error(`${file.name} is too large (max ${maxSizeMB}MB)`);
          } else if (error.code === 'file-invalid-type') {
            toast.error(`${file.name} has invalid format`);
          } else {
            toast.error(`Error with ${file.name}: ${error.message}`);
          }
        });
      });
      return;
    }

    // Check max files
    if (files.length + acceptedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Add files to state with metadata
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
      progress: 0,
      url: null,
      error: null
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Start upload
    uploadFiles(newFiles);
  }, [files, maxFiles, maxSizeMB]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats,
    maxSize: maxSizeMB * 1024 * 1024,
    multiple: maxFiles > 1
  });

  const uploadFiles = async (filesToUpload) => {
    setUploading(true);

    for (const fileObj of filesToUpload) {
      try {
        // Update status to uploading
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: 'uploading' } : f
        ));

        // Create storage reference
        const timestamp = Date.now();
        const fileName = `${category}/${timestamp}_${fileObj.file.name}`;
        const storageRef = ref(storage, fileName);

        // Upload file with progress tracking
        const uploadTask = uploadBytesResumable(storageRef, fileObj.file);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setFiles(prev => prev.map(f => 
                f.id === fileObj.id ? { ...f, progress: Math.round(progress) } : f
              ));
            },
            (error) => {
              console.error('Upload error:', error);
              setFiles(prev => prev.map(f => 
                f.id === fileObj.id ? { ...f, status: 'error', error: error.message } : f
              ));
              toast.error(`Failed to upload ${fileObj.name}`);
              reject(error);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                setFiles(prev => prev.map(f => 
                  f.id === fileObj.id ? { 
                    ...f, 
                    status: 'complete', 
                    url: downloadURL,
                    progress: 100 
                  } : f
                ));
                toast.success(`${fileObj.name} uploaded successfully`);
                resolve();
              } catch (error) {
                reject(error);
              }
            }
          );
        });
      } catch (error) {
        console.error('Upload error:', error);
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: 'error', error: error.message } : f
        ));
      }
    }

    setUploading(false);

    // Notify parent component
    const completedFiles = files.filter(f => f.status === 'complete');
    if (onUploadComplete && completedFiles.length > 0) {
      onUploadComplete(completedFiles.map(f => ({
        name: f.name,
        url: f.url,
        type: f.type,
        size: f.size
      })));
    }
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('image')) return '🖼️';
    return '📎';
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer ${
          isDragActive
            ? 'border-cyan-500 bg-cyan-500/10'
            : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          <Upload className={`w-12 h-12 mb-4 ${isDragActive ? 'text-cyan-400' : 'text-white/60'}`} />
          <p className="text-lg font-semibold text-white mb-2">
            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-sm text-slate-400 mb-4">
            or click to browse
          </p>
          <div className="text-xs text-slate-500 space-y-1">
            <p>Accepted: PDF, DOC, DOCX, JPG, PNG</p>
            <p>Max size: {maxSizeMB}MB per file | Max {maxFiles} files</p>
          </div>
        </div>
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            <h4 className="text-sm font-semibold text-white mb-2">
              Uploaded Files ({files.length}/{maxFiles})
            </h4>
            {files.map((fileObj) => (
              <motion.div
                key={fileObj.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10"
              >
                {/* File Icon */}
                <div className="text-2xl">{getFileIcon(fileObj.type)}</div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {fileObj.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatFileSize(fileObj.size)}
                  </p>

                  {/* Progress Bar */}
                  {fileObj.status === 'uploading' && (
                    <div className="mt-2">
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-cyan-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${fileObj.progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{fileObj.progress}%</p>
                    </div>
                  )}

                  {/* Error Message */}
                  {fileObj.status === 'error' && (
                    <p className="text-xs text-red-400 mt-1">
                      {fileObj.error || 'Upload failed'}
                    </p>
                  )}
                </div>

                {/* Status Icon */}
                <div>
                  {fileObj.status === 'pending' && (
                    <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    </div>
                  )}
                  {fileObj.status === 'uploading' && (
                    <Loader className="w-6 h-6 text-cyan-400 animate-spin" />
                  )}
                  {fileObj.status === 'complete' && (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  )}
                  {fileObj.status === 'error' && (
                    <AlertCircle className="w-6 h-6 text-red-400" />
                  )}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFile(fileObj.id)}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                  disabled={fileObj.status === 'uploading'}
                >
                  <X className="w-5 h-5 text-slate-400 hover:text-white" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Summary */}
      {files.length > 0 && (
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>
            {files.filter(f => f.status === 'complete').length} of {files.length} uploaded
          </span>
          {uploading && (
            <span className="text-cyan-400">Uploading...</span>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
