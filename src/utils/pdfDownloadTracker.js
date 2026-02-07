/**
 * PDF Download Tracking and Analytics
 * Tracks PDF downloads and provides analytics for division resources
 */

import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Track PDF download event
 * @param {string} divisionId - Division identifier
 * @param {string} divisionName - Division name
 * @param {string} filename - PDF filename
 * @param {string} language - Current language
 */
export const trackPDFDownload = async (divisionId, divisionName, filename, language = 'en') => {
  try {
    const downloadData = {
      divisionId,
      divisionName,
      filename,
      language,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      referrer: document.referrer || 'direct'
    };

    // Add to Firestore
    await addDoc(collection(db, 'pdfDownloads'), downloadData);

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('PDF Download Tracked:', downloadData);
    }

    // Store in localStorage for local analytics
    const localDownloads = JSON.parse(localStorage.getItem('nara_pdf_downloads') || '[]');
    localDownloads.push({
      ...downloadData,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('nara_pdf_downloads', JSON.stringify(localDownloads));

    return { success: true };
  } catch (error) {
    console.error('Error tracking PDF download:', error);
    return { success: false, error };
  }
};

/**
 * Get download statistics for a division
 * @param {string} divisionId - Division identifier
 */
export const getDivisionDownloadStats = async (divisionId) => {
  try {
    const q = query(
      collection(db, 'pdfDownloads'),
      where('divisionId', '==', divisionId)
    );
    
    const querySnapshot = await getDocs(q);
    const downloads = [];
    
    querySnapshot.forEach((doc) => {
      downloads.push({ id: doc.id, ...doc.data() });
    });

    return {
      total: downloads.length,
      downloads,
      byLanguage: downloads.reduce((acc, d) => {
        acc[d.language] = (acc[d.language] || 0) + 1;
        return acc;
      }, {})
    };
  } catch (error) {
    console.error('Error fetching download stats:', error);
    return { total: 0, downloads: [], byLanguage: {} };
  }
};

/**
 * Get all PDF download statistics
 */
export const getAllDownloadStats = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'pdfDownloads'));
    const downloads = [];
    
    querySnapshot.forEach((doc) => {
      downloads.push({ id: doc.id, ...doc.data() });
    });

    const stats = {
      totalDownloads: downloads.length,
      byDivision: downloads.reduce((acc, d) => {
        acc[d.divisionId] = (acc[d.divisionId] || 0) + 1;
        return acc;
      }, {}),
      byLanguage: downloads.reduce((acc, d) => {
        acc[d.language] = (acc[d.language] || 0) + 1;
        return acc;
      }, {}),
      recentDownloads: downloads
        .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0))
        .slice(0, 10)
    };

    return stats;
  } catch (error) {
    console.error('Error fetching all download stats:', error);
    return {
      totalDownloads: 0,
      byDivision: {},
      byLanguage: {},
      recentDownloads: []
    };
  }
};

/**
 * Get local download history
 */
export const getLocalDownloadHistory = () => {
  try {
    const downloads = JSON.parse(localStorage.getItem('nara_pdf_downloads') || '[]');
    return downloads;
  } catch (error) {
    console.error('Error reading local download history:', error);
    return [];
  }
};

/**
 * Clear local download history
 */
export const clearLocalDownloadHistory = () => {
  try {
    localStorage.removeItem('nara_pdf_downloads');
    return { success: true };
  } catch (error) {
    console.error('Error clearing local download history:', error);
    return { success: false, error };
  }
};

