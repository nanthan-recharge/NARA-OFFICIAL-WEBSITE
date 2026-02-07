import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { DIVISIONS_CONFIG } from '../../data/divisionsConfig';
import {
  getDivisionImages,
  uploadDivisionImage,
  setPrimaryImage,
  deleteDivisionImage,
  saveAIGeneratedImage
} from '../../services/divisionImagesService';
import {
  generateDivisionImagePrompts,
  DIVISION_IMAGE_PROMPTS
} from '../../services/geminiImageService';
import {
  saveLocalDivisionImages,
  getLocalDivisionImages,
  removeLocalDivisionImage,
  clearLocalDivisionImages
} from '../../utils/localImageStorage';
import {
  enhanceAllPrompts,
  suggestImagePrompts
} from '../../services/vertexAIService';
import { enhancePromptsWithChatGPT } from '../../services/chatgptPromptService';
import {
  generateDivisionImagesWithGemini
} from '../../services/geminiNativeImageService';
import {
  generateDivisionImagesWithChatGPT
} from '../../services/chatgptImageService';
import { storage, auth } from '../../firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

const DivisionImagesAdmin = () => {
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [divisionImages, setDivisionImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState(null);
  const [customPrompts, setCustomPrompts] = useState(['', '', '', '']);
  const [useCustomPrompts, setUseCustomPrompts] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [generatingGemini, setGeneratingGemini] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [enhancingChatGPT, setEnhancingChatGPT] = useState(false);
  const [generatingChatGPTImages, setGeneratingChatGPTImages] = useState(false);
  const isDataUrl = (url) => typeof url === 'string' && url.startsWith('data:');

  const optimizeDataUrlForStorage = (dataUrl, quality = 0.65, maxWidth = 1200) => {
    return new Promise((resolve) => {
      if (!dataUrl || !dataUrl.startsWith('data:')) {
        resolve(dataUrl);
        return;
      }

      // Always optimize to save localStorage quota
      // Smaller images for small originals
      if (dataUrl.length <= 200000) {
        quality = 0.75;
      }

      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, maxWidth / image.width);
        const width = Math.round(image.width * scale);
        const height = Math.round(image.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, width, height);

        try {
          const optimized = canvas.toDataURL('image/jpeg', quality);
          resolve(optimized);
        } catch (canvasError) {
          console.log('Image optimization failed, using original data URL:', canvasError);
          resolve(dataUrl);
        }
      };
      image.onerror = () => resolve(dataUrl);
      image.src = dataUrl;
    });
  };

  const optimizeImagesForStorage = async (urls) => {
    const optimized = [];
    for (const url of urls) {
      if (isDataUrl(url)) {
        const optimizedUrl = await optimizeDataUrlForStorage(url);
        optimized.push(optimizedUrl);
      } else {
        optimized.push(url);
      }
    }
    return optimized;
  };

  useEffect(() => {
    if (selectedDivision) {
      loadDivisionImages();
    }
  }, [selectedDivision]);

  const loadDivisionImages = async () => {
    setLoading(true);

    try {
      // PRIORITY 1: Try localStorage first (contains base64 data URLs that always work!)
      console.log('🔍 Checking localStorage first (base64 data URLs)...');
      const localImages = getLocalDivisionImages(selectedDivision.id);

      if (localImages && localImages.length > 0) {
        console.log('✅ Loaded', localImages.length, 'images from localStorage (base64 data URLs)');
        setDivisionImages(localImages.map((url, idx) => ({
          id: `local_${idx}`,
          url,
          aiGenerated: url.startsWith('data:'),
          uploadedAt: new Date().toISOString(),
          filename: `${url.startsWith('data:') ? 'AI Generated' : 'Uploaded'} Image ${idx + 1}`
        })));
        setLoading(false);
        return;
      }
    } catch (error) {
      console.log('localStorage check failed:', error.message);
    }

    try {
      // PRIORITY 2: Try Firebase as fallback (but DO NOT sync Firebase URLs to localStorage!)
      console.log('🔍 Checking Firebase for images...');
      const result = await getDivisionImages(selectedDivision.id);

      if (result.success && result.images.length > 0) {
        console.log('✅ Loaded', result.images.length, 'images from Firebase');
        console.log('⚠️  WARNING: Firebase URLs may have auth issues. Use admin panel to regenerate as base64.');

        const imageData = result.images.map(img => ({
          id: img.id || `fb_${Date.now()}_${Math.random()}`,
          url: img.url,
          aiGenerated: img.aiGenerated || false,
          uploadedAt: img.uploadedAt || new Date().toISOString(),
          filename: img.filename || 'Division Image'
        }));
        setDivisionImages(imageData);

        // DO NOT sync Firebase URLs to localStorage - they may fail with 403!
        // Only base64 data URLs should be in localStorage
        console.log('⚠️  NOT syncing Firebase URLs to localStorage (auth issues)');

        setLoading(false);
        return;
      }
    } catch (error) {
      console.log('Firebase check failed:', error.message);
    }

    console.log('No images found in localStorage or Firebase');
    setDivisionImages([]);
    setLoading(false);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage({ type: 'info', text: '☁️ Uploading to Firebase Storage...' });

    try {
      console.log('%c📤 UPLOADING TO FIREBASE STORAGE', 'background: #ff6b00; color: white; padding: 8px; font-size: 14px; font-weight: bold;');
      console.log('   Division:', selectedDivision.name);
      console.log('   File:', file.name);
      console.log('   Size:', (file.size / 1024).toFixed(2), 'KB');
      
      // Upload directly to Firebase Storage
      const result = await uploadDivisionImage(selectedDivision.id, file, {
        uploadedBy: 'admin',
        source: 'manual_upload'
      });

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      console.log('✅ Firebase upload successful!');
      console.log('   URL:', result.image.url);
      
      // Auto-set as primary if it's the first image for this division
      if (divisionImages.length === 0) {
        const imageId = `${selectedDivision.id}_${Date.now()}`;
        await setPrimaryImage(imageId, selectedDivision.id);
        console.log('🌟 Set as primary image (first upload)');
      }
      
      // Add to display
      const newImage = {
        id: result.image.uploadedAt,
        url: result.image.url,
        aiGenerated: false,
        uploadedAt: result.image.uploadedAt,
        filename: file.name,
        isPrimary: divisionImages.length === 0
      };
      
      const updatedImages = [...divisionImages, newImage];
      setDivisionImages(updatedImages);
      
      // Reload images to get updated data
      await loadDivisionImages();
      
      // Notify homepage to reload images
      window.dispatchEvent(new Event('divisionImagesUpdated'));
      console.log('📢 Dispatched divisionImagesUpdated event');
      
      setMessage({ 
        type: 'success', 
        text: `✅ Image uploaded to Firebase & live on homepage! ${divisionImages.length === 0 ? '(Set as primary)' : ''}` 
      });
      setUploading(false);
      
    } catch (error) {
      console.error('❌ Firebase upload failed:', error);
      setMessage({ type: 'error', text: `Upload failed: ${error.message}` });
      setUploading(false);
    }
  };

  const handleSetPrimary = async (imageId) => {
    const result = await setPrimaryImage(imageId, selectedDivision.id);
    if (result.success) {
      setMessage({ type: 'success', text: 'Primary image updated!' });
      loadDivisionImages();
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  const handleDelete = async (imageId, imageIndex) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    // If it's a localStorage image (starts with 'local_')
    if (imageId.startsWith('local_')) {
      const result = removeLocalDivisionImage(selectedDivision.id, imageIndex);
      if (result.success) {
        setMessage({ type: 'success', text: 'Image deleted successfully!' });
        loadDivisionImages();
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } else {
      // Firebase image
      const result = await deleteDivisionImage(imageId);
      if (result.success) {
        setMessage({ type: 'success', text: 'Image deleted successfully!' });
        loadDivisionImages();
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    }
  };

  const getPromptsForEnhancement = () => {
    if (!selectedDivision) return [];
    return useCustomPrompts
      ? customPrompts.filter(p => p.trim() !== '')
      : DIVISION_IMAGE_PROMPTS[selectedDivision.id] || [];
  };

  const handleEnhanceWithGemini = async () => {
    setEnhancing(true);
    setMessage({ type: 'info', text: 'Enhancing prompts with Gemini 2.5 Flash...' });

    try {
      const basePrompts = getPromptsForEnhancement();

      if (basePrompts.length === 0) {
        setMessage({ type: 'error', text: 'No prompts to enhance!' });
        setEnhancing(false);
        return;
      }

      const enhanced = await enhanceAllPrompts(basePrompts, selectedDivision.name.en);
      
      // Update custom prompts with enhanced versions
      const newPrompts = ['', '', '', ''];
      enhanced.forEach((prompt, idx) => {
        if (idx < 4) newPrompts[idx] = prompt;
      });
      
      setCustomPrompts(newPrompts);
      setUseCustomPrompts(true);
      setMessage({ type: 'success', text: `✅ Gemini enhanced ${enhanced.length} prompts! Review and generate.` });
    } catch (error) {
      setMessage({ type: 'error', text: `Gemini error: ${error.message}` });
    }
    
    setEnhancing(false);
  };

  const handleEnhanceWithChatGPT = async () => {
    setEnhancingChatGPT(true);
    setMessage({ type: 'info', text: 'Enhancing prompts with ChatGPT 5...' });

    try {
      const basePrompts = getPromptsForEnhancement();

      if (basePrompts.length === 0) {
        setMessage({ type: 'error', text: 'No prompts to enhance!' });
        setEnhancingChatGPT(false);
        return;
      }

      const enhanced = await enhancePromptsWithChatGPT(basePrompts, selectedDivision?.name?.en || '');

      const newPrompts = ['', '', '', ''];
      enhanced.forEach((prompt, idx) => {
        if (idx < 4) newPrompts[idx] = prompt;
      });
      
      setCustomPrompts(newPrompts);
      setUseCustomPrompts(true);
      setMessage({ type: 'success', text: `✅ ChatGPT enhanced ${enhanced.length} prompts! Review and generate.` });
    } catch (error) {
      setMessage({ type: 'error', text: `ChatGPT error: ${error.message}` });
    }

    setEnhancingChatGPT(false);
  };

  const handleClearBadImages = () => {
    if (!confirm('Clear all images for this division from localStorage? You will need to regenerate them.')) return;

    clearLocalDivisionImages(selectedDivision.id);
    setMessage({ type: 'success', text: 'localStorage cleared! Generate new images with Gemini.' });
    loadDivisionImages();
  };

  const handleClearAllPollinations = () => {
    if (!confirm('Remove ALL Pollinations.ai URLs from localStorage across ALL divisions? This will fix CSP errors but you may need to regenerate some images.')) return;

    try {
      const data = JSON.parse(localStorage.getItem('nara_division_images') || '{}');
      let cleanedCount = 0;
      let divisionsCleaned = 0;

      for (const [divisionId, divisionData] of Object.entries(data)) {
        if (divisionData.images && Array.isArray(divisionData.images)) {
          const originalCount = divisionData.images.length;
          // Remove Pollinations.ai and Firebase Storage URLs, keep only base64 data URLs
          divisionData.images = divisionData.images.filter(url => url.startsWith('data:'));
          const removedCount = originalCount - divisionData.images.length;

          if (removedCount > 0) {
            cleanedCount += removedCount;
            divisionsCleaned++;
          }
        }
      }

      localStorage.setItem('nara_division_images', JSON.stringify(data));

      setMessage({
        type: 'success',
        text: `✅ Cleaned ${cleanedCount} external URLs from ${divisionsCleaned} divisions. Only base64 data URLs remain.`
      });

      console.log('%c🧹 CLEANUP COMPLETE', 'background: #10b981; color: white; padding: 8px; font-size: 14px; font-weight: bold;');
      console.log(`   Removed: ${cleanedCount} external URLs`);
      console.log(`   Divisions affected: ${divisionsCleaned}`);
      console.log('   Only base64 data URLs remain (no CSP issues!)');

      if (selectedDivision) {
        loadDivisionImages();
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Cleanup failed: ${error.message}` });
    }
  };

  const handleClearAllDivisionImages = () => {
    if (!confirm('⚠️ CLEAR ALL DIVISION IMAGES from localStorage? This will free up storage quota. You can regenerate images after.')) return;

    try {
      localStorage.removeItem('nara_division_images');
      console.log('🗑️ Cleared ALL division images from localStorage');

      setMessage({
        type: 'success',
        text: '✅ All division images cleared! Storage quota freed. Generate new images for each division.'
      });

      if (selectedDivision) {
        loadDivisionImages();
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Clear all failed: ${error.message}` });
    }
  };

  const handleSyncToHero = async () => {
    if (!selectedDivision) {
      setMessage({ type: 'error', text: 'Select a division first!' });
      return;
    }

    const originalUrls = divisionImages
      .map((img) => img.url)
      .filter((url) => typeof url === 'string' && url.trim().length > 0);

    if (originalUrls.length === 0) {
      setMessage({ type: 'error', text: 'No images available to sync.' });
      return;
    }

    console.log('🔄 Syncing hero images for division:', selectedDivision.id);
    clearLocalDivisionImages(selectedDivision.id);

    let urlsToStore = originalUrls;
    let result = saveLocalDivisionImages(selectedDivision.id, urlsToStore);

    if (!result.success) {
      if (result.error === 'quota-exceeded') {
        setMessage({ type: 'info', text: 'Images are large. Optimizing quality for hero carousel...' });
        urlsToStore = await optimizeImagesForStorage(originalUrls);
        clearLocalDivisionImages(selectedDivision.id);
        result = saveLocalDivisionImages(selectedDivision.id, urlsToStore);
      }

      if (!result.success) {
        setMessage({ type: 'error', text: `Failed to sync images: ${result.error}` });
        return;
      }
    }

    const verified = getLocalDivisionImages(selectedDivision.id);
    console.log('✅ Hero sync complete. Stored images:', verified.length, verified);
    console.log('📦 Storage key:', 'nara_division_images');

    if (urlsToStore !== originalUrls) {
      setDivisionImages((prev) =>
        prev.map((img, idx) => {
          if (idx >= urlsToStore.length) return img;
          return { ...img, url: urlsToStore[idx] };
        })
      );
    }

    setMessage({
      type: 'success',
      text: `✅ Synced ${verified.length} images! Refresh the division page to see the new hero carousel.`
    });
  };

  const handleGenerateWithGeminiNative = async () => {
    setGeneratingGemini(true);
    setMessage({ type: 'info', text: 'Generating images with Gemini 2.5 Flash Image... This may take 30-60 seconds.' });

    try {
      // Get prompts
      const prompts = useCustomPrompts 
        ? customPrompts.filter(p => p.trim() !== '')
        : DIVISION_IMAGE_PROMPTS[selectedDivision.id] || [];

      if (prompts.length === 0) {
        setMessage({ type: 'error', text: 'No prompts available!' });
        setGeneratingGemini(false);
        return;
      }

      // Generate images with Gemini Native
      const results = await generateDivisionImagesWithGemini(prompts, selectedDivision.name.en);
      
      // Filter successful results
      const successfulImages = results.filter(r => r.success);
      
      if (successfulImages.length === 0) {
        setMessage({ type: 'error', text: 'Failed to generate images. Check console for details.' });
        setGeneratingGemini(false);
        return;
      }

      // Try uploading to Firebase Storage first (avoids localStorage quota issues)
      // If that fails, fallback to optimized base64 in localStorage
      setMessage({ type: 'info', text: `Uploading ${successfulImages.length} images to Firebase Storage...` });

      const imageUrls = [];
      let uploadsFailed = 0;
      let uploadsSucceeded = 0;
      let usingFirebase = true;

      // Try Firebase Storage first
      for (let i = 0; i < successfulImages.length; i++) {
        const result = successfulImages[i];

        try {
          const timestamp = Date.now();
          const filename = `${selectedDivision.id}_gemini_${timestamp}_${i}.png`;
          const storageRef = ref(storage, `divisions/${selectedDivision.id}/${filename}`);

          console.log(`📤 Uploading image ${i + 1}/${successfulImages.length} to Firebase Storage...`);
          
          // Clean base64 string (remove data URL prefix if present)
          let cleanBase64 = result.base64Data;
          if (cleanBase64.includes(',')) {
            cleanBase64 = cleanBase64.split(',')[1];
          }
          
          console.log('Base64 length:', cleanBase64.length);

          const uploadResult = await uploadString(storageRef, cleanBase64, 'base64', {
            contentType: result.mimeType || 'image/png',
            customMetadata: {
              generatedBy: 'gemini-2.5-flash',
              divisionId: selectedDivision.id,
              prompt: 'AI generated',
              timestamp: timestamp.toString()
            }
          });

          const downloadURL = await getDownloadURL(uploadResult.ref);
          imageUrls.push(downloadURL); // Store Firebase URL (tiny string, no quota issues!)
          console.log(`✅ Image ${i + 1} uploaded: ${downloadURL.substring(0, 80)}...`);
          uploadsSucceeded++;

          // Save metadata to Firestore
          try {
            const docId = `${selectedDivision.id}_ai_${timestamp}`;
            const saveResult = await saveAIGeneratedImage(selectedDivision.id, downloadURL, {
              prompt: 'Gemini 2.5 Flash Generated',
              model: 'gemini-2.5-flash',
              generatedAt: new Date().toISOString(),
              storagePath: uploadResult.ref.fullPath
            });
            console.log('📝 Firestore save result:', saveResult);
            
            // Set FIRST image as primary for homepage carousel
            if (i === 0) {
              console.log('🎯 Attempting to set as primary:', docId);
              const primaryResult = await setPrimaryImage(docId, selectedDivision.id);
              console.log('🌟 Primary image result:', primaryResult);
              if (primaryResult.success) {
                console.log('✅ Successfully set as PRIMARY image for homepage carousel!');
              } else {
                console.error('❌ Failed to set primary:', primaryResult.error);
              }
            }
          } catch (firestoreError) {
            console.error('❌ Firestore error:', firestoreError);
            console.log('⚠️ Firestore metadata save skipped:', firestoreError.message);
          }
        } catch (uploadError) {
          uploadsFailed++;
          console.error(`❌ Firebase upload failed for image ${i + 1}:`, uploadError);
          console.error('Error details:', {
            message: uploadError.message,
            code: uploadError.code,
            stack: uploadError.stack
          });
        }
      }

      // If all Firebase uploads failed, fallback to optimized base64 in localStorage
      if (imageUrls.length === 0) {
        console.log('⚠️ All Firebase uploads failed. Falling back to optimized base64 in localStorage...');
        usingFirebase = false;
        setMessage({ type: 'info', text: 'Firebase upload failed. Using optimized localStorage (1 image to avoid quota)...' });

        // Only store FIRST image to avoid quota issues
        const firstImage = successfulImages[0];
        const dataUrl = `data:${firstImage.mimeType || 'image/png'};base64,${firstImage.base64Data}`;
        const optimizedUrl = await optimizeDataUrlForStorage(dataUrl);
        imageUrls.push(optimizedUrl);
        console.log('✅ Created optimized base64 data URL as fallback');
      }
      
      // Save to localStorage
      const storageType = usingFirebase ? 'Firebase URLs' : 'optimized base64';
      console.log(`%c💾 SAVING ${storageType.toUpperCase()} TO LOCALSTORAGE`, 'background: #8b5cf6; color: white; padding: 8px; font-size: 14px; font-weight: bold;');
      console.log('   Division ID:', selectedDivision.id);
      console.log('   Images:', imageUrls.length);
      console.log('   Format:', storageType);

      const saveResult = saveLocalDivisionImages(selectedDivision.id, imageUrls);
      console.log('   Save result:', saveResult);

      if (!saveResult.success) {
        setMessage({ type: 'error', text: `Failed to save images: ${saveResult.error}` });
        setGeneratingGemini(false);
        return;
      }

      // VERIFY it was saved using correct function
      const verifyImages = getLocalDivisionImages(selectedDivision.id);
      console.log('   ✅ VERIFICATION: Retrieved', verifyImages.length, 'images from localStorage');
      console.log('   Storage key: nara_division_images');
      console.log('   📸 First image:', imageUrls[0]?.substring(0, 100) + '...');
      console.log(`%c🎉 ${storageType.toUpperCase()} SAVED TO LOCALSTORAGE!`, 'background: #10b981; color: white; padding: 8px; font-size: 16px; font-weight: bold;');
      
      // Notify homepage to reload images
      window.dispatchEvent(new Event('divisionImagesUpdated'));
      console.log('📢 Dispatched divisionImagesUpdated event');

      // Update display
      setDivisionImages(imageUrls.map((url, idx) => ({
        id: `gemini_${Date.now()}_${idx}`,
        url,
        aiGenerated: true,
        uploadedAt: new Date().toISOString(),
        filename: `Gemini ${usingFirebase ? 'Firebase' : 'Base64'} Image ${idx + 1}`
      })));

      // Build success message
      let successMsg;
      if (usingFirebase) {
        successMsg = `✅ ${imageUrls.length} images uploaded to Firebase Storage!`;
        if (uploadsFailed > 0) {
          successMsg += ` (${uploadsFailed} failed)`;
        }
        successMsg += ` No quota issues - using Firebase URLs!`;
      } else {
        successMsg = `✅ ${imageUrls.length} optimized image saved! (Firebase failed, using localStorage fallback)`;
      }
      successMsg += ` Refresh homepage to see them!`;

      setMessage({
        type: 'success',
        text: successMsg
      });

      console.log('%c✅ GEMINI GENERATION COMPLETE!', 'background: #8b5cf6; color: white; padding: 8px; font-size: 16px; font-weight: bold;');
      console.log('━'.repeat(80));
      console.log('📌 Division:', selectedDivision.name.en);
      console.log('📌 Division ID:', selectedDivision.id);
      console.log('📌 Division Slug:', selectedDivision.slug);
      console.log('📌 Model:', 'Gemini 2.5 Flash (Vertex AI)');
      console.log('📌 Images Generated:', successfulImages.length);
      if (usingFirebase) {
        console.log('📌 Firebase Storage:', `${uploadsSucceeded} uploaded${uploadsFailed > 0 ? ` (${uploadsFailed} failed)` : ''}`);
        console.log('📌 localStorage:', `${imageUrls.length} Firebase URLs stored (NO quota issues!)`);
      } else {
        console.log('📌 Firebase Storage:', 'Upload failed - using localStorage fallback');
        console.log('📌 localStorage:', `${imageUrls.length} optimized base64 image(s) stored`);
      }
      console.log('━'.repeat(80));
      console.log('🔗 VIEW AT:', `https://nara-web-73384.web.app/`);
      console.log('⚠️  IMPORTANT: REFRESH the homepage to see new images!');
      console.log('━'.repeat(80));
    } catch (error) {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
      console.error('Gemini Native error:', error);
    }
    
    setGeneratingGemini(false);
  };

  const handleGenerateWithChatGPTImages = async () => {
    if (!selectedDivision) {
      setMessage({ type: 'error', text: 'Select a division first!' });
      return;
    }

    setGeneratingChatGPTImages(true);
    setMessage({ type: 'info', text: 'Generating images with ChatGPT gpt-image-1... This may take 20-40 seconds.' });

    try {
      const prompts = useCustomPrompts
        ? customPrompts.filter((p) => p.trim() !== '')
        : DIVISION_IMAGE_PROMPTS[selectedDivision.id] || [];

      if (prompts.length === 0) {
        setMessage({ type: 'error', text: 'No prompts available!' });
        setGeneratingChatGPTImages(false);
        return;
      }

      const results = await generateDivisionImagesWithChatGPT(prompts, selectedDivision.name.en);
      const successfulImages = results.filter((r) => r.success && r.base64Data);

      if (successfulImages.length === 0) {
        const firstError = results.find((r) => !r.success)?.error || 'ChatGPT returned no images.';
        setMessage({ type: 'error', text: `ChatGPT image error: ${firstError}` });
        setGeneratingChatGPTImages(false);
        return;
      }

      const usedFallback = successfulImages.some((result) => result.fallbackNotice);

      const dataUrls = successfulImages.map((result, idx) => {
        console.log(`✅ ChatGPT image ready ${idx + 1}/${successfulImages.length}`);
        if (result.fallbackNotice) {
          console.log(`   ↳ ${result.fallbackNotice}`);
        }
        return `data:${result.mimeType || 'image/png'};base64,${result.base64Data}`;
      });

      console.log('%c💾 SAVING CHATGPT IMAGES TO LOCALSTORAGE', 'background: #2563eb; color: white; padding: 8px; font-size: 14px; font-weight: bold;');
      console.log('   Division ID:', selectedDivision.id);
      console.log('   Number of images:', dataUrls.length);

      let storageReadyImages = await optimizeImagesForStorage(dataUrls);
      let saveResult = saveLocalDivisionImages(selectedDivision.id, storageReadyImages);

      if (!saveResult.success && saveResult.error === 'quota-exceeded') {
        console.log('   ⚠️ LocalStorage quota exceeded after optimization. Reducing quality further...');
        storageReadyImages = await optimizeImagesForStorage(storageReadyImages.map((url) => url));
        clearLocalDivisionImages(selectedDivision.id);
        saveResult = saveLocalDivisionImages(selectedDivision.id, storageReadyImages);
      }

      if (!saveResult.success) {
        setMessage({ type: 'error', text: `Failed to save ChatGPT images: ${saveResult.error}` });
        setGeneratingChatGPTImages(false);
        return;
      }

      const verifyImages = getLocalDivisionImages(selectedDivision.id);
      console.log('   ✅ Stored images:', verifyImages.length);
      console.log('   Storage key: nara_division_images');

      setDivisionImages(storageReadyImages.map((url, idx) => ({
        id: `chatgpt_${Date.now()}_${idx}`,
        url,
        aiGenerated: true,
        uploadedAt: new Date().toISOString(),
        filename: `ChatGPT Image ${idx + 1}`
      })));

      setMessage({
        type: 'success',
        text: `✅ ${storageReadyImages.length} ChatGPT images saved! Refresh /divisions/${selectedDivision.slug} to preview them.${usedFallback ? ' (Used gpt-image-1-mini fallback automatically.)' : ''}`
      });

      console.log('%c🎉 CHATGPT IMAGE GENERATION COMPLETE!', 'background: #2563eb; color: white; padding: 8px; font-size: 16px; font-weight: bold;');
      console.log('   Model:', import.meta.env.VITE_OPENAI_IMAGE_MODEL || 'gpt-image-1');
    } catch (error) {
      setMessage({ type: 'error', text: `ChatGPT image error: ${error.message}` });
      console.error('ChatGPT image generation error:', error);
    }

    setGeneratingChatGPTImages(false);
  };

  const handleDownloadAllImages = async () => {
    if (divisionImages.length === 0) {
      setMessage({ type: 'error', text: 'No images to download!' });
      return;
    }

    setDownloading(true);
    setMessage({ type: 'info', text: `Downloading ${divisionImages.length} images...` });

    try {
      // Download each image
      for (let i = 0; i < divisionImages.length; i++) {
        const image = divisionImages[i];
        const filename = `${selectedDivision.id}_image_${i + 1}.png`;
        
        // Fetch and download
        const response = await fetch(image.url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setMessage({ type: 'success', text: `✅ Downloaded ${divisionImages.length} images successfully!` });
    } catch (error) {
      setMessage({ type: 'error', text: `Download failed: ${error.message}` });
    }
    
    setDownloading(false);
  };

  const handleGenerateAIImages = async () => {
    setGenerating(true);
    
    // Use custom prompts if provided, otherwise use default prompts
    let prompts = [];
    if (useCustomPrompts) {
      prompts = customPrompts.filter(p => p.trim() !== '');
      if (prompts.length === 0) {
        setMessage({ type: 'error', text: 'Please enter at least one custom prompt!' });
        setGenerating(false);
        return;
      }
    } else {
      prompts = DIVISION_IMAGE_PROMPTS[selectedDivision.id] || [];
    }
    
    setMessage({ type: 'info', text: `Generating ${prompts.length} unique AI images with Pollinations.ai...` });
    
    // Use Pollinations.ai for REAL AI image generation
    // Each prompt creates a UNIQUE image!
    const generatedUrls = [];
    
    for (let i = 0; i < prompts.length; i++) {
      const basePrompt = prompts[i];
      
      // ENHANCE PROMPT for Pollinations.ai with Sri Lankan specifications
      const enhancedPrompt = `Professional documentary photography, WIDE environmental shot. ${basePrompt}. 
      MANDATORY: Show 3-5 SRI LANKAN people (South Asian features, authentic Sri Lankan skin tones, 60-70% male, ALWAYS include at least 1 female scientist/researcher). 
      CAMERA DISTANCE: Medium to wide shot, people 5-10 meters away from camera, NEVER close-up faces. 
      FRAMING: Full body or 3/4 body shots showing team working in environment, faces visible but NOT the main focus. 
      SETTING: Sri Lankan coastal/marine environment with coconut palms, tropical waters, NARA branding visible. 
      PEOPLE: Team collaboration, natural poses, professional scientific work, white lab coats or safety vests with NARA patches. 
      STYLE: 8K photorealistic, National Geographic quality, government research documentation aesthetic.`;
      
      // Pollinations.ai API - generates unique images from text prompts
      // Add timestamp + index to ensure different images each time
      const seed = Date.now() + (i * 1000);
      const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1920&height=1080&seed=${seed}&enhance=true&model=flux`;
      
      generatedUrls.push(pollinationsUrl);
      
      console.log(`🎨 Generating image ${i + 1}/${prompts.length}:`);
      console.log('   Base:', basePrompt.substring(0, 60) + '...');
      console.log('   Enhanced with: SRI LANKAN people, wide shot, team collaboration');
    }
    
    // Save to localStorage (works immediately!)
    console.log('%c💾 SAVING TO LOCALSTORAGE', 'background: #3b82f6; color: white; padding: 8px; font-size: 14px; font-weight: bold;');
    console.log('   Division ID:', selectedDivision.id);
    console.log('   Number of images:', generatedUrls.length);
    console.log('   URLs:', generatedUrls);
    
    const saveResult = saveLocalDivisionImages(selectedDivision.id, generatedUrls);
    console.log('   Save result:', saveResult);
    
    // VERIFY it was saved
    const verifyImages = getLocalDivisionImages(selectedDivision.id);
    console.log('   ✅ VERIFICATION: Retrieved', verifyImages.length, 'images from localStorage');
    console.log('   Storage key: nara_division_images');
    console.log('%c🎉 POLLINATIONS IMAGES SAVED TO LOCALSTORAGE!', 'background: #10b981; color: white; padding: 8px; font-size: 16px; font-weight: bold;');
    
    // Notify homepage to reload images
    window.dispatchEvent(new Event('divisionImagesUpdated'));
    console.log('📢 Dispatched divisionImagesUpdated event');

    // Try to save to Firebase too (for future when permissions are fixed)
    for (let i = 0; i < generatedUrls.length; i++) {
      try {
        await saveAIGeneratedImage(selectedDivision.id, generatedUrls[i], {
          prompt: prompts[i],
          model: 'pollinations-ai-flux',
          generatedAt: new Date().toISOString()
        });
      } catch (error) {
        console.log('Firebase save failed (permissions), using localStorage instead');
      }
    }

    // Show success with action button
    setMessage({ 
      type: 'success', 
      text: `✅ ${generatedUrls.length} POLLINATIONS images saved! Visit /divisions/${selectedDivision.slug} and REFRESH page to see them in hero carousel.` 
    });
    
    // Update local display with actual image objects
    setDivisionImages(generatedUrls.map((url, idx) => ({
      id: `local_${Date.now()}_${idx}`,
      url,
      aiGenerated: true,
      uploadedAt: new Date().toISOString(),
      filename: `AI Generated Image ${idx + 1}`
    })));
    
    setGenerating(false);
    
    // Log confirmation
    console.log('%c✅ POLLINATIONS GENERATION COMPLETE!', 'background: #8b5cf6; color: white; padding: 8px; font-size: 16px; font-weight: bold;');
    console.log('━'.repeat(80));
    console.log('📌 Division:', selectedDivision.name.en);
    console.log('📌 Division ID:', selectedDivision.id);
    console.log('📌 Division Slug:', selectedDivision.slug);
    console.log('📌 Model:', 'Pollinations.ai Flux');
    console.log('📌 Images Generated:', generatedUrls.length);
    console.log('📌 Storage:', 'localStorage (key: nara_division_images)');
    console.log('━'.repeat(80));
    console.log('🔗 VIEW AT:', `http://localhost:4028/divisions/${selectedDivision.slug}`);
    console.log('⚠️  IMPORTANT: REFRESH the division page to see new images!');
    console.log('━'.repeat(80));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <LucideIcons.Images size={40} className="text-[#0066CC]" />
            Division Images Management
          </h1>
          <p className="text-slate-600">Upload, manage, and generate AI images for division pages</p>
        </div>

        {/* Global Cleanup Buttons */}
        <div className="mb-6 flex justify-end gap-4">
          <button
            onClick={handleClearAllDivisionImages}
            className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 border-2 border-red-400"
          >
            <LucideIcons.Trash2 size={20} />
            Clear ALL Division Images (Free Quota)
          </button>
          <button
            onClick={handleClearAllPollinations}
            className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 border-2 border-yellow-400"
          >
            <LucideIcons.Eraser size={20} />
            Clean All External URLs (Fix CSP Errors)
          </button>
        </div>

        {/* Messages */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl flex items-center justify-between ${
              message.type === 'success' ? 'bg-green-100 text-green-800' :
              message.type === 'error' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}
          >
            <div className="flex items-center gap-3">
              {message.type === 'success' && <LucideIcons.CheckCircle size={24} />}
              {message.type === 'error' && <LucideIcons.AlertCircle size={24} />}
              {message.type === 'info' && <LucideIcons.Info size={24} />}
              <span>{message.text}</span>
            </div>
            {message.type === 'success' && selectedDivision && (
              <a
                href={`/divisions/${selectedDivision.slug}`}
                target="_blank"
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center gap-2"
              >
                <LucideIcons.ExternalLink size={18} />
                View in Hero Section
              </a>
            )}
          </motion.div>
        )}

        {/* Division Selector */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 mb-8 border border-slate-200">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900">
            <LucideIcons.FolderOpen size={28} className="text-[#0066CC]" />
            Select Division
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {DIVISIONS_CONFIG.map((division) => {
              const IconComponent = LucideIcons[division.icon];
              return (
                <motion.button
                  key={division.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDivision(division)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedDivision?.id === division.id
                      ? `bg-gradient-to-r ${division.gradient} text-white border-white/30`
                      : 'border-slate-300 hover:border-slate-400 bg-slate-100/50 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <IconComponent size={32} className="mx-auto mb-2" />
                  <div className="text-sm font-semibold text-center line-clamp-2">
                    {division.name.en}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Image Management Section */}
        {selectedDivision && (
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                <LucideIcons.Image size={28} className="text-[#0066CC]" />
                {selectedDivision.name.en} Images
              </h2>
              <div className="flex gap-3 flex-wrap">
                {/* Gemini Native Image Generation - PREMIUM */}
                <button
                  onClick={handleGenerateWithGeminiNative}
                  disabled={generatingGemini}
                  className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50 border-2 border-white/20"
                >
                  {generatingGemini ? (
                    <>
                      <LucideIcons.Loader2 size={20} className="animate-spin" />
                      Gemini Creating...
                    </>
                  ) : (
                    <>
                      <LucideIcons.Stars size={20} />
                      Generate with Gemini Native
                    </>
                  )}
                </button>

                {/* ChatGPT Image Generation */}
                <button
                  onClick={handleGenerateWithChatGPTImages}
                  disabled={generatingChatGPTImages}
                  className="bg-gradient-to-r from-sky-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 border-2 border-white/10"
                >
                  {generatingChatGPTImages ? (
                    <>
                      <LucideIcons.Loader2 size={20} className="animate-spin" />
                      ChatGPT Rendering...
                    </>
                  ) : (
                    <>
                      <LucideIcons.ImagePlus size={20} />
                      Generate with ChatGPT Images
                    </>
                  )}
                </button>

                {/* Enhance Prompts with ChatGPT 5 */}
                <button
                  onClick={handleEnhanceWithChatGPT}
                  disabled={enhancingChatGPT}
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {enhancingChatGPT ? (
                    <>
                      <LucideIcons.Loader2 size={20} className="animate-spin" />
                      ChatGPT Enhancing...
                    </>
                  ) : (
                    <>
                      <LucideIcons.Bot size={20} />
                      Enhance w/ ChatGPT 5
                    </>
                  )}
                </button>

                {/* Enhance Prompts with Gemini */}
                <button
                  onClick={handleEnhanceWithGemini}
                  disabled={enhancing}
                  className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {enhancing ? (
                    <>
                      <LucideIcons.Loader2 size={20} className="animate-spin" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <LucideIcons.Wand2 size={20} />
                      Enhance Prompts
                    </>
                  )}
                </button>

                {/* Clear Bad Images from localStorage */}
                <button
                  onClick={handleClearBadImages}
                  className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 border-2 border-red-400"
                >
                  <LucideIcons.Trash2 size={20} />
                  Clear localStorage (Fix 403 Errors)
                </button>

                {/* Generate with Pollinations (Fast & Free) */}
                <button
                  onClick={handleGenerateAIImages}
                  disabled={generating}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <LucideIcons.Loader2 size={20} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <LucideIcons.Sparkles size={20} />
                      Generate (Pollinations)
                    </>
                  )}
                </button>

                {/* Upload Button */}
                <label className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center gap-2">
                  <LucideIcons.Upload size={20} />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>

                {/* Sync to Hero Section Button */}
                {divisionImages.length > 0 && (
                  <button
                    onClick={handleSyncToHero}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
                  >
                    <LucideIcons.RefreshCw size={20} />
                    Sync to Hero ({divisionImages.length})
                  </button>
                )}

                {/* Download All Images Button */}
                {divisionImages.length > 0 && (
                  <button
                    onClick={handleDownloadAllImages}
                    disabled={downloading}
                    className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {downloading ? (
                      <>
                        <LucideIcons.Loader2 size={20} className="animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <LucideIcons.Download size={20} />
                        Download All ({divisionImages.length})
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Custom Prompts Toggle */}
            <div className="mb-6 flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3">
                <LucideIcons.Wand2 size={24} className="text-[#0066CC]" />
                <div>
                  <h3 className="font-bold text-[#0066CC]">Custom Prompts Mode</h3>
                  <p className="text-sm text-blue-700">Write your own prompts or use pre-configured ones</p>
                </div>
              </div>
              <button
                onClick={() => setUseCustomPrompts(!useCustomPrompts)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  useCustomPrompts
                    ? 'bg-[#0066CC] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {useCustomPrompts ? '✓ Custom Mode' : 'Use Custom Prompts'}
              </button>
            </div>

            {/* Custom Prompts Input */}
            {useCustomPrompts ? (
              <div className="mb-6 p-6 bg-slate-100/50 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <LucideIcons.Edit3 size={20} className="text-[#0066CC]" />
                  Enter Your Custom Prompts (4 images)
                </h3>
                <div className="space-y-4">
                  {[0, 1, 2, 3].map((idx) => (
                    <div key={idx}>
                      <label className="block text-sm font-medium text-slate-600 mb-2">
                        Image {idx + 1} Prompt:
                      </label>
                      <textarea
                        value={customPrompts[idx]}
                        onChange={(e) => {
                          const newPrompts = [...customPrompts];
                          newPrompts[idx] = e.target.value;
                          setCustomPrompts(newPrompts);
                        }}
                        placeholder={`Enter detailed description for image ${idx + 1}...`}
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-100 text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent placeholder-slate-400"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 flex items-start gap-2">
                    <LucideIcons.Info size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Be specific! Mention equipment, activities, locations, and technical details for best results.</span>
                  </p>
                </div>
              </div>
            ) : (
              // Default AI Prompts Info
              <div className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
                <h3 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
                  <LucideIcons.Lightbulb size={20} />
                  Pre-Configured AI Prompts ({DIVISION_IMAGE_PROMPTS[selectedDivision.id]?.length || 0})
                </h3>
                <div className="space-y-2">
                  {DIVISION_IMAGE_PROMPTS[selectedDivision.id]?.map((prompt, idx) => (
                    <div key={idx} className="text-sm text-purple-600 flex items-start gap-2">
                      <span className="font-bold text-purple-600">{idx + 1}.</span>
                      <span>{prompt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Images Grid */}
            {loading ? (
              <div className="text-center py-12">
                <LucideIcons.Loader2 size={48} className="animate-spin mx-auto text-cyan-400" />
                <p className="mt-4 text-blue-700">Loading images...</p>
              </div>
            ) : divisionImages.length === 0 ? (
              <div className="text-center py-12 bg-slate-100/50 rounded-xl border border-slate-200">
                <LucideIcons.ImageOff size={64} className="mx-auto text-slate-500 mb-4" />
                <p className="text-slate-600 font-semibold">No images uploaded yet</p>
                <p className="text-sm text-slate-500 mt-2">Upload or generate AI images to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {divisionImages.map((image, imageIndex) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group"
                  >
                    <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={image.url}
                        alt="Division"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Image Badges */}
                    <div className="absolute top-2 left-2 flex gap-2">
                      {image.isPrimary && (
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <LucideIcons.Star size={12} />
                          Primary
                        </span>
                      )}
                      {image.aiGenerated && (
                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <LucideIcons.Sparkles size={12} />
                          AI
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                      {!image.isPrimary && (
                        <button
                          onClick={() => handleSetPrimary(image.id)}
                          className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 transition-all"
                          title="Set as primary"
                        >
                          <LucideIcons.Star size={20} />
                        </button>
                      )}
                      <a
                        href={image.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all"
                        title="View full size"
                      >
                        <LucideIcons.Eye size={20} />
                      </a>
                      <button
                        onClick={() => handleDelete(image.id, imageIndex)}
                        className="bg-red-600 text-white p-3 rounded-xl hover:bg-red-700 transition-all"
                        title="Delete"
                      >
                        <LucideIcons.Trash2 size={20} />
                      </button>
                    </div>

                    {/* Image Info */}
                    <div className="mt-2 text-sm">
                      <p className="truncate text-slate-700 font-medium">{image.filename || 'AI Generated'}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(image.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DivisionImagesAdmin;
