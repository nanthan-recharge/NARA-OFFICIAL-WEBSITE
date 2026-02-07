import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db, storage } from '../../lib/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useTranslation } from 'react-i18next';

const LibraryMembershipRegister = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    full_name: '',
    nic: '',
    phone: '',
    address: '',
    occupation: '',
    organization: '',
    member_type: 'public',
  });

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError('Photo size must be less than 2MB');
        return;
      }

      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const generateMemberId = async () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `NARA-LIB-${year}-${randomNum}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setError('You must be logged in to register for library membership');
      return;
    }

    if (!photo) {
      setError('Please upload your photo');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Upload photo to Firebase Storage
      const photoRef = ref(storage, `library_members/${currentUser.uid}/profile.jpg`);
      await uploadBytes(photoRef, photo);
      const photoURL = await getDownloadURL(photoRef);

      // Generate member ID
      const memberId = await generateMemberId();

      // Calculate membership expiry (1 year from now)
      const membershipDate = new Date();
      const membershipExpiry = new Date();
      membershipExpiry.setFullYear(membershipExpiry.getFullYear() + 1);

      // Create member document
      const memberData = {
        member_id: memberId,
        uid: currentUser.uid,
        email: currentUser.email,
        full_name: formData.full_name,
        nic: formData.nic,
        phone: formData.phone,
        address: formData.address,
        occupation: formData.occupation,
        organization: formData.organization,
        member_type: formData.member_type,
        membership_date: membershipDate.toISOString(),
        membership_expiry: membershipExpiry.toISOString(),
        status: 'active',
        photo_url: photoURL,
        max_books_allowed: 5,
        current_books_borrowed: 0,
        total_books_borrowed_lifetime: 0,
        overdue_count: 0,
        fine_balance: 0,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      };

      // Save to Firestore
      await setDoc(doc(db, 'library_members', currentUser.uid), memberData);

      setSuccess(true);
      setTimeout(() => {
        navigate('/library-dashboard');
      }, 2000);

    } catch (err) {
      console.error('Error registering for library membership:', err);
      setError(err.message || 'Failed to register for library membership. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t('Library Membership Registration')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('Register to borrow physical books from NARA Library')}
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-green-900">Registration Successful!</h3>
                <p className="text-green-700 mt-1">Your library membership has been created. Redirecting to dashboard...</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-6">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-full border-4 border-blue-100"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-100 rounded-full border-4 border-gray-200 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Maximum file size: 2MB</p>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter your full name as per NIC"
                  required
                />
              </div>

              {/* NIC */}
              <div>
                <label htmlFor="nic" className="block text-sm font-medium text-gray-700 mb-2">
                  National Identity Card (NIC) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nic"
                  name="nic"
                  value={formData.nic}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="e.g., 199512345678 or 951234567V"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="+94771234567"
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter your complete address"
                  required
                />
              </div>

              {/* Occupation */}
              <div>
                <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-2">
                  Occupation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="e.g., Researcher, Student, Teacher"
                  required
                />
              </div>

              {/* Organization */}
              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                  Organization/Institution
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="e.g., University of Colombo"
                />
              </div>

              {/* Member Type */}
              <div>
                <label htmlFor="member_type" className="block text-sm font-medium text-gray-700 mb-2">
                  Member Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="member_type"
                  name="member_type"
                  value={formData.member_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                >
                  <option value="public">Public</option>
                  <option value="student">Student</option>
                  <option value="researcher">Researcher</option>
                  <option value="staff">NARA Staff</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Register for Library Membership'
                  )}
                </button>
              </div>

              {/* Terms */}
              <div className="text-sm text-gray-600 text-center">
                By registering, you agree to follow NARA Library policies and regulations.
              </div>
            </form>
          </div>
        )}

        {/* Benefits Section */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Membership Benefits</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">Borrow up to 5 books at a time</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">14-day loan period with renewal options</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">Online reservation system</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">Access to rare marine research publications</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">12-month membership validity</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LibraryMembershipRegister;
