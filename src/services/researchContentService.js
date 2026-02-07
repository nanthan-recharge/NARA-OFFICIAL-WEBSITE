import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  query, 
  where, 
  orderBy, 
  limit,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../firebase';

const COLLECTION_NAME = 'researchContent';

// Upload research content with multiple language PDFs
export const uploadResearchContent = async (contentData, files, userId) => {
  try {
    const fileURLs = {};
    const fileNames = {};
    
    // Handle single file (backward compatible) or multiple files object
    if (files instanceof File) {
      // Single file - English only
      const fileRef = ref(storage, `research-content/${Date.now()}_${files.name}`);
      await uploadBytes(fileRef, files);
      fileURLs.en = await getDownloadURL(fileRef);
      fileNames.en = files.name;
    } else if (files && typeof files === 'object') {
      // Multiple files object: { en: File, si: File, ta: File }
      for (const [lang, file] of Object.entries(files)) {
        if (file instanceof File) {
          const timestamp = Date.now();
          const fileRef = ref(storage, `research-content/${timestamp}_${lang}_${file.name}`);
          await uploadBytes(fileRef, file);
          fileURLs[lang] = await getDownloadURL(fileRef);
          fileNames[lang] = file.name;
        }
      }
    }

    // Create content document with language-specific URLs
    const docData = {
      ...contentData,
      fileURL: fileURLs.en || fileURLs, // Backward compatible
      fileURLs, // New: URLs for each language
      fileName: fileNames.en || fileNames, // Backward compatible
      fileNames, // New: Filenames for each language
      availableLanguages: Object.keys(fileURLs), // Track which PDFs exist
      uploadedBy: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      views: 0,
      downloads: 0,
      bookmarks: 0,
      status: 'published'
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), docData);
    return { id: docRef.id, ...docData };
  } catch (error) {
    console.error('Error uploading research content:', error);
    throw error;
  }
};

// Get all research content with filters
export const getResearchContent = async (filters = {}) => {
  try {
    let q = collection(db, COLLECTION_NAME);
    const constraints = [];

    // Only add status filter to avoid index requirement
    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    }

    if (constraints.length > 0) {
      q = query(q, ...constraints);
    }

    const snapshot = await getDocs(q);
    let results = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Client-side filtering and sorting
    if (filters.category) {
      results = results.filter(item => item.category === filters.category);
    }

    if (filters.language) {
      results = results.filter(item => item.language === filters.language);
    }

    // Sort by createdAt (client-side)
    results.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return bTime - aTime; // Descending order (newest first)
    });

    // Apply limit if specified
    if (filters.limit) {
      results = results.slice(0, filters.limit);
    }

    return results;
  } catch (error) {
    console.error('Error getting research content:', error);
    throw error;
  }
};

// Get single research content by ID
export const getResearchContentById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Increment view count
      await updateDoc(docRef, {
        views: increment(1)
      });
      
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting research content:', error);
    throw error;
  }
};

// Search research content
export const searchResearchContent = async (searchTerm, language = null) => {
  try {
    const allContent = await getResearchContent({ language });
    
    if (!searchTerm) return allContent;

    const lowerSearch = searchTerm.toLowerCase();
    
    return allContent.filter(item => {
      const titleMatch = item.title?.toLowerCase().includes(lowerSearch);
      const descMatch = item.description?.toLowerCase().includes(lowerSearch);
      const authorsMatch = item.authors?.some(author => 
        author.toLowerCase().includes(lowerSearch)
      );
      const tagsMatch = item.tags?.some(tag => 
        tag.toLowerCase().includes(lowerSearch)
      );
      const abstractMatch = item.abstract?.toLowerCase().includes(lowerSearch);
      
      return titleMatch || descMatch || authorsMatch || tagsMatch || abstractMatch;
    });
  } catch (error) {
    console.error('Error searching research content:', error);
    throw error;
  }
};

// Update research content
export const updateResearchContent = async (id, updates) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating research content:', error);
    throw error;
  }
};

// Delete research content
export const deleteResearchContent = async (id, fileURL) => {
  try {
    // Delete file from storage if exists
    if (fileURL) {
      const fileRef = ref(storage, fileURL);
      await deleteObject(fileRef);
    }

    // Delete document
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error('Error deleting research content:', error);
    throw error;
  }
};

// Increment download count
export const incrementDownloads = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      downloads: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing downloads:', error);
    throw error;
  }
};

// Toggle bookmark
export const toggleBookmark = async (id, userId, isBookmarked) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      bookmarks: increment(isBookmarked ? -1 : 1)
    });
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    throw error;
  }
};
