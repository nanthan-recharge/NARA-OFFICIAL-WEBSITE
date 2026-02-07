import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useLibraryUser } from '../../contexts/LibraryUserContext';
import { db, auth } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, limit } from 'firebase/firestore';

/**
 * Download Manager Component
 * Handles authentication-gated downloads with role-based permissions
 */
const DownloadManager = ({ book, className = '' }) => {
  const { user, userProfile } = useLibraryUser();
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  /**
   * Check if user has download permissions
   */
  const checkDownloadPermissions = async () => {
    if (!user || !userProfile) {
      return { allowed: false, reason: 'authentication_required' };
    }

    const role = userProfile.role;

    // Researchers have unlimited downloads
    if (role === 'researcher') {
      return { allowed: true, limit: -1 };
    }

    // Students have monthly limits
    if (role === 'student') {
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      // Count downloads this month
      const downloadsRef = collection(db, 'library_downloads');
      const q = query(
        downloadsRef,
        where('userId', '==', user.uid),
        where('downloadedAt', '>=', monthStart)
      );

      const snapshot = await getDocs(q);
      const downloadCount = snapshot.size;
      const monthlyLimit = 10;

      if (downloadCount >= monthlyLimit) {
        return {
          allowed: false,
          reason: 'limit_exceeded',
          current: downloadCount,
          limit: monthlyLimit
        };
      }

      return {
        allowed: true,
        limit: monthlyLimit,
        remaining: monthlyLimit - downloadCount
      };
    }

    // Public users need to register
    if (role === 'public') {
      return {
        allowed: true,
        limit: 3,
        message: 'Limited access - Register for full benefits'
      };
    }

    return { allowed: false, reason: 'unknown_role' };
  };

  /**
   * Log download activity
   */
  const logDownload = async (book, downloadType = 'pdf') => {
    try {
      const downloadsRef = collection(db, 'library_downloads');
      await addDoc(downloadsRef, {
        userId: user.uid,
        userEmail: user.email,
        userName: userProfile.profile?.displayName || 'Anonymous',
        userRole: userProfile.role,
        bookId: book.id,
        bookTitle: book.title,
        bookBarcode: book.barcode,
        materialType: book.material_type_code,
        downloadType,
        downloadedAt: serverTimestamp(),
        ipAddress: null, // Could be added via backend
        userAgent: navigator.userAgent
      });
    } catch (error) {
      console.error('Failed to log download:', error);
    }
  };

  /**
   * Handle download with authentication check
   */
  const handleDownload = async (e) => {
    e.preventDefault();
    setDownloadError(null);

    // Check authentication
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Check permissions
    const permissions = await checkDownloadPermissions();

    if (!permissions.allowed) {
      if (permissions.reason === 'limit_exceeded') {
        setDownloadError(
          `Download limit reached! You've downloaded ${permissions.current}/${permissions.limit} books this month. ` +
          `Upgrade to Researcher account for unlimited downloads.`
        );
        return;
      }

      if (permissions.reason === 'authentication_required') {
        setShowAuthModal(true);
        return;
      }
    }

    // Proceed with download
    setIsDownloading(true);
    try {
      // Log the download
      await logDownload(book, 'pdf');

      // Download the file
      const response = await fetch(book.url);
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${book.barcode}-${book.title.substring(0, 50)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show success message with remaining downloads
      if (permissions.remaining !== undefined) {
        alert(`✅ Download successful! You have ${permissions.remaining} downloads remaining this month.`);
      }
    } catch (error) {
      console.error('Download failed:', error);
      setDownloadError('Download failed. Please try again or contact support.');
    } finally {
      setIsDownloading(false);
    }
  };

  /**
   * Handle print (also requires authentication)
   */
  const handlePrint = async (e) => {
    e.preventDefault();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Log print activity
    await logDownload(book, 'print');

    // Open PDF in new window for printing
    window.open(book.url, '_blank');
  };

  /**
   * Redirect to registration
   */
  const handleRegister = () => {
    navigate('/register', { state: { returnTo: `/library/item/${book.id}` } });
  };

  /**
   * Redirect to login
   */
  const handleLogin = () => {
    navigate('/library-login', { state: { returnTo: `/library/item/${book.id}` } });
  };

  return (
    <div className={className}>
      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDownloading ? (
          <>
            <Icons.Loader2 className="w-5 h-5 animate-spin" />
            Downloading...
          </>
        ) : (
          <>
            <Icons.Download className="w-5 h-5" />
            {!user ? 'Register to Download' : 'Download PDF'}
            {book.page_count && ` (${book.page_count} pages)`}
          </>
        )}
      </button>

      {/* Print Button */}
      <button
        onClick={handlePrint}
        disabled={!user}
        className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        <Icons.Printer className="w-5 h-5" />
        {!user ? 'Register to Print' : 'Print PDF'}
      </button>

      {/* Error Message */}
      {downloadError && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          <div className="flex items-start gap-2">
            <Icons.AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Download Error</p>
              <p>{downloadError}</p>
            </div>
          </div>
        </div>
      )}

      {/* User Info */}
      {user && userProfile && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
          <div className="flex items-start gap-2">
            <Icons.Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Your Account</p>
              <p>Role: {userProfile.role}</p>
              {userProfile.role === 'student' && (
                <p className="text-xs mt-1">💡 Upgrade to Researcher for unlimited downloads</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icons.Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Registration Required
              </h2>
              <p className="text-gray-600">
                Create a free account to download this book and access our digital library
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 mb-6">
              <p className="font-semibold text-gray-900 mb-3">With a free account you get:</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <Icons.CheckCircle className="w-4 h-4 text-green-600" />
                  Download up to 10 books per month
                </li>
                <li className="flex items-center gap-2">
                  <Icons.CheckCircle className="w-4 h-4 text-green-600" />
                  Print PDFs with proper citations
                </li>
                <li className="flex items-center gap-2">
                  <Icons.CheckCircle className="w-4 h-4 text-green-600" />
                  Save bookmarks and reading progress
                </li>
                <li className="flex items-center gap-2">
                  <Icons.CheckCircle className="w-4 h-4 text-green-600" />
                  Access reading history and statistics
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleRegister}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition font-semibold flex items-center justify-center gap-2"
              >
                <Icons.UserPlus className="w-5 h-5" />
                Create Free Account
              </button>

              <button
                onClick={handleLogin}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Already have an account? Sign In
              </button>

              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full px-6 py-2 text-gray-600 hover:text-gray-800 transition text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadManager;
