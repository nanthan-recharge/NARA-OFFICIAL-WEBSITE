import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLibraryUser } from '../../contexts/LibraryUserContext';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import BasicInfoStep from './BasicInfoStep';
import UploadStep from './UploadStep';
import AuthorsStep from './AuthorsStep';
import ReviewStep from './ReviewStep';

const LibraryResearchSubmit = () => {
  const navigate = useNavigate();
  const { userProfile } = useLibraryUser();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    keywords: '',
    researchArea: userProfile?.profile?.researchArea || '',
    documentType: 'journal_article',
    language: 'en',
    mainDocument: null,
    supplementaryFiles: [],
    authors: [{
      name: userProfile?.profile?.displayName || '',
      affiliation: userProfile?.profile?.institution || '',
      email: userProfile?.email || '',
      isCorresponding: true
    }],
    publicationDate: '',
    journal: '',
    doi: '',
    visibility: 'institutional'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'mainDocument') {
      setFormData(prev => ({ ...prev, mainDocument: files[0] }));
    } else if (name === 'supplementaryFiles') {
      setFormData(prev => ({ 
        ...prev, 
        supplementaryFiles: [...prev.supplementaryFiles, ...Array.from(files)] 
      }));
    }
  };

  const handleAuthorChange = (index, field, value) => {
    const newAuthors = [...formData.authors];
    newAuthors[index][field] = value;
    setFormData(prev => ({ ...prev, authors: newAuthors }));
  };

  const addAuthor = () => {
    setFormData(prev => ({
      ...prev,
      authors: [...prev.authors, { name: '', affiliation: '', email: '', isCorresponding: false }]
    }));
  };

  const removeAuthor = (index) => {
    setFormData(prev => ({
      ...prev,
      authors: prev.authors.filter((_, i) => i !== index)
    }));
  };

  const removeSuppFile = (index) => {
    setFormData(prev => ({
      ...prev,
      supplementaryFiles: prev.supplementaryFiles.filter((_, i) => i !== index)
    }));
  };

  const uploadFile = async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.mainDocument) {
        throw new Error('Please upload the main document');
      }

      setUploadProgress(20);
      const mainDocPath = `research/${userProfile.uid}/${Date.now()}_${formData.mainDocument.name}`;
      const mainDocURL = await uploadFile(formData.mainDocument, mainDocPath);

      setUploadProgress(50);
      const suppFilesURLs = [];
      for (let i = 0; i < formData.supplementaryFiles.length; i++) {
        const file = formData.supplementaryFiles[i];
        const suppPath = `research/${userProfile.uid}/supplementary/${Date.now()}_${file.name}`;
        const url = await uploadFile(file, suppPath);
        suppFilesURLs.push({
          fileName: file.name,
          fileURL: url,
          fileSize: file.size
        });
      }

      setUploadProgress(80);
      const submissionData = {
        submissionId: `RS-${Date.now()}`,
        authorId: userProfile.uid,
        authorName: userProfile.profile.displayName,
        authorEmail: userProfile.email,
        manuscript: {
          title: formData.title,
          abstract: formData.abstract,
          keywords: formData.keywords.split(',').map(k => k.trim()),
          researchArea: formData.researchArea,
          documentType: formData.documentType,
          mainDocument: {
            fileURL: mainDocURL,
            fileName: formData.mainDocument.name,
            fileSize: formData.mainDocument.size,
            uploadedAt: serverTimestamp()
          },
          supplementaryFiles: suppFilesURLs,
          language: formData.language,
          publicationDate: formData.publicationDate || null,
          journal: formData.journal || null,
          doi: formData.doi || null
        },
        authors: formData.authors,
        submission: {
          submittedAt: serverTimestamp(),
          status: 'pending',
          reviewedBy: null,
          reviewedAt: null,
          reviewComments: '',
          revisionRequested: false,
          revisionComments: ''
        },
        visibility: formData.visibility,
        downloadCount: 0,
        viewCount: 0
      };

      await addDoc(collection(db, 'researchSubmissions'), submissionData);
      setUploadProgress(100);
      
      await updateDoc(doc(db, 'libraryUsers', userProfile.uid), {
        'statistics.researchSubmissions': (userProfile.statistics?.researchSubmissions || 0) + 1
      });

      navigate('/library-dashboard?submission=success');
      
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Information', icon: Icons.FileText },
    { number: 2, title: 'Upload Documents', icon: Icons.Upload },
    { number: 3, title: 'Authors & Details', icon: Icons.Users },
    { number: 4, title: 'Review & Submit', icon: Icons.CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Icons.Microscope className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Submit Research Paper
          </h1>
          <p className="text-slate-600">
            Share your research with the NARA community
          </p>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                      isCompleted ? 'bg-green-500 text-white' :
                      isActive ? 'bg-purple-600 text-white' :
                      'bg-slate-200 text-slate-400'
                    }`}>
                      {isCompleted ? <Icons.Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <p className={`text-xs mt-2 font-medium text-center ${
                      isActive ? 'text-purple-600' : 'text-slate-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded ${
                      isCompleted ? 'bg-green-500' : 'bg-slate-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <Icons.AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {uploadProgress > 0 && loading && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Uploading...</span>
                <span className="text-sm font-medium text-purple-600">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <BasicInfoStep
                formData={formData}
                onChange={handleChange}
                onNext={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 2 && (
              <UploadStep
                formData={formData}
                onFileChange={handleFileChange}
                removeSuppFile={removeSuppFile}
                onBack={() => setCurrentStep(1)}
                onNext={() => setCurrentStep(3)}
              />
            )}

            {currentStep === 3 && (
              <AuthorsStep
                formData={formData}
                onChange={handleChange}
                onAuthorChange={handleAuthorChange}
                addAuthor={addAuthor}
                removeAuthor={removeAuthor}
                onBack={() => setCurrentStep(2)}
                onNext={() => setCurrentStep(4)}
              />
            )}

            {currentStep === 4 && (
              <ReviewStep
                formData={formData}
                loading={loading}
                onBack={() => setCurrentStep(3)}
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LibraryResearchSubmit;
