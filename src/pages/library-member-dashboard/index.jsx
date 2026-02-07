import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';
import SEOHead from '../../components/shared/SEOHead';

const LibraryMemberDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [memberData, setMemberData] = useState(null);
  const [currentLoans, setCurrentLoans] = useState([]);
  const [activeReservations, setActiveReservations] = useState([]);
  const [borrowingHistory, setBorrowingHistory] = useState([]);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!currentUser) {
      navigate('/library-login');
      return;
    }

    loadMemberData();
  }, [currentUser]);

  const loadMemberData = async () => {
    try {
      setLoading(true);

      // Get member data
      const memberDoc = await getDoc(doc(db, 'library_members', currentUser.uid));

      if (!memberDoc.exists()) {
        navigate('/library-membership-register');
        return;
      }

      const member = memberDoc.data();
      setMemberData(member);

      // Generate QR code
      const qrData = JSON.stringify({
        member_id: member.member_id,
        uid: member.uid,
        name: member.full_name,
        type: 'library_member'
      });
      const qrUrl = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1e40af',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(qrUrl);

      // Load current loans
      const loansQuery = query(
        collection(db, 'book_loans'),
        where('uid', '==', currentUser.uid),
        where('status', '==', 'active'),
        orderBy('due_date', 'asc')
      );
      const loansSnapshot = await getDocs(loansQuery);
      setCurrentLoans(loansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Load active reservations
      const reservationsQuery = query(
        collection(db, 'book_reservations'),
        where('uid', '==', currentUser.uid),
        where('status', 'in', ['pending', 'ready']),
        orderBy('created_at', 'desc')
      );
      const reservationsSnapshot = await getDocs(reservationsQuery);
      setActiveReservations(reservationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Load recent borrowing history
      const historyQuery = query(
        collection(db, 'borrowing_history'),
        where('uid', '==', currentUser.uid),
        orderBy('borrowed_date', 'desc'),
        limit(10)
      );
      const historySnapshot = await getDocs(historyQuery);
      setBorrowingHistory(historySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    } catch (error) {
      console.error('Error loading member data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMembershipStatus = () => {
    if (!memberData) return 'Unknown';

    const expiryDate = new Date(memberData.membership_expiry);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return { text: 'Expired', color: 'text-red-600', bgColor: 'bg-red-100' };
    if (daysUntilExpiry < 30) return { text: `Expires in ${daysUntilExpiry} days`, color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { text: 'Active', color: 'text-green-600', bgColor: 'bg-green-100' };
  };

  const getDaysOverdue = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const days = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const calculateFine = (dueDate) => {
    const daysOverdue = getDaysOverdue(dueDate);
    return daysOverdue * 10; // LKR 10 per day
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-navy-50 flex items-center justify-center">
      <SEOHead
        title="Library Member Dashboard"
        description="Your NARA Library member dashboard — loans, reservations, and history."
        path="/library-member-dashboard"
        noindex
      />
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your library dashboard...</p>
        </div>
      </div>
    );
  }

  const membershipStatus = getMembershipStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-navy-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Library Member Dashboard</h1>
          <p className="text-gray-600">Welcome back, {memberData?.full_name}</p>
        </div>

        {/* Member Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Member Info */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <img
                  src={memberData?.photo_url || '/default-avatar.png'}
                  alt={memberData?.full_name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <div className="ml-6">
                  <h2 className="text-2xl font-bold">{memberData?.full_name}</h2>
                  <p className="text-blue-100">Member ID: {memberData?.member_id}</p>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${membershipStatus.bgColor} ${membershipStatus.color}`}>
                    {membershipStatus.text}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-blue-200 text-sm">Email</p>
                  <p className="font-semibold">{memberData?.email}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Phone</p>
                  <p className="font-semibold">{memberData?.phone}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Member Type</p>
                  <p className="font-semibold capitalize">{memberData?.member_type}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Books Borrowed</p>
                  <p className="font-semibold">{memberData?.current_books_borrowed || 0} / {memberData?.max_books_allowed || 5}</p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center bg-white rounded-xl p-4">
              <p className="text-gray-700 font-semibold mb-3">Scan to Check Out</p>
              {qrCodeUrl && (
                <img src={qrCodeUrl} alt="Member QR Code" className="w-48 h-48" />
              )}
              <p className="text-gray-500 text-xs mt-2">Show this to librarian</p>
            </div>
          </div>

          {/* Fine Balance */}
          {memberData?.fine_balance > 0 && (
            <div className="mt-6 bg-red-500 bg-opacity-20 border-2 border-red-300 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-red-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="font-semibold">Outstanding Fine</p>
                    <p className="text-sm text-blue-100">Please settle your fine to continue borrowing</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">LKR {memberData?.fine_balance}</p>
                  <button className="mt-2 bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition">
                    Pay Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'loans', label: 'Current Loans', icon: '📚', badge: currentLoans.length },
                { id: 'reservations', label: 'Reservations', icon: '📖', badge: activeReservations.length },
                { id: 'history', label: 'History', icon: '📋' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                  {tab.badge > 0 && (
                    <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-bold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-700 font-semibold">Current Loans</h3>
                    <span className="text-3xl">📚</span>
                  </div>
                  <p className="text-4xl font-bold text-blue-600">{currentLoans.length}</p>
                  <p className="text-sm text-gray-600 mt-1">Active book loans</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-700 font-semibold">Reservations</h3>
                    <span className="text-3xl">📖</span>
                  </div>
                  <p className="text-4xl font-bold text-green-600">{activeReservations.length}</p>
                  <p className="text-sm text-gray-600 mt-1">Pending reservations</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-700 font-semibold">Total Borrowed</h3>
                    <span className="text-3xl">📊</span>
                  </div>
                  <p className="text-4xl font-bold text-purple-600">{memberData?.total_books_borrowed_lifetime || 0}</p>
                  <p className="text-sm text-gray-600 mt-1">Lifetime books borrowed</p>
                </div>
              </div>
            )}

            {/* Current Loans Tab */}
            {activeTab === 'loans' && (
              <div className="space-y-4">
                {currentLoans.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">You have no active loans</p>
                    <button
                      onClick={() => navigate('/library-catalogue')}
                      className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Browse Catalogue
                    </button>
                  </div>
                ) : (
                  currentLoans.map(loan => {
                    const daysOverdue = getDaysOverdue(loan.due_date);
                    const fine = calculateFine(loan.due_date);
                    const dueDate = new Date(loan.due_date);

                    return (
                      <div key={loan.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{loan.book_title || 'Book Title'}</h3>
                            <p className="text-gray-600">Barcode: {loan.barcode}</p>
                            <p className="text-sm text-gray-500 mt-2">
                              Borrowed: {new Date(loan.checkout_date).toLocaleDateString()}
                            </p>
                            <p className={`text-sm mt-1 ${daysOverdue > 0 ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                              Due: {dueDate.toLocaleDateString()}
                              {daysOverdue > 0 && ` (${daysOverdue} days overdue)`}
                            </p>
                          </div>
                          <div className="text-right">
                            {daysOverdue > 0 ? (
                              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg">
                                <p className="text-sm font-semibold">Overdue</p>
                                <p className="text-lg font-bold">LKR {fine}</p>
                              </div>
                            ) : (
                              <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                                <p className="text-sm font-semibold">On Time</p>
                              </div>
                            )}
                            {loan.renewal_count < 2 && (
                              <button className="mt-2 text-blue-600 text-sm hover:underline">
                                Renew ({2 - loan.renewal_count} left)
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Reservations Tab */}
            {activeTab === 'reservations' && (
              <div className="space-y-4">
                {activeReservations.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">You have no active reservations</p>
                    <button
                      onClick={() => navigate('/library-catalogue')}
                      className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Browse Catalogue
                    </button>
                  </div>
                ) : (
                  activeReservations.map(reservation => (
                    <div key={reservation.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{reservation.book_title || 'Book Title'}</h3>
                          <p className="text-gray-600">Barcode: {reservation.barcode}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Reserved: {new Date(reservation.created_at?.toDate()).toLocaleDateString()}
                          </p>
                          {reservation.status === 'ready' && (
                            <p className="text-sm text-green-600 font-semibold mt-1">
                              Book is ready for pickup! Valid until: {new Date(reservation.reservation_expiry).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div>
                          <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                            reservation.status === 'ready'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {reservation.status === 'ready' ? 'Ready for Pickup' : 'Pending'}
                          </span>
                          <button className="mt-2 block text-red-600 text-sm hover:underline">
                            Cancel Reservation
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                {borrowingHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No borrowing history yet</p>
                  </div>
                ) : (
                  borrowingHistory.map(record => (
                    <div key={record.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{record.book_title || 'Book Title'}</h3>
                          <p className="text-gray-600">Barcode: {record.barcode}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Borrowed: {new Date(record.borrowed_date).toLocaleDateString()} -
                            Returned: {record.returned_date ? new Date(record.returned_date).toLocaleDateString() : 'Not returned'}
                          </p>
                        </div>
                        <div className="text-right">
                          {record.rating ? (
                            <div className="text-yellow-500">
                              {'⭐'.repeat(record.rating)}
                            </div>
                          ) : (
                            <button className="text-blue-600 text-sm hover:underline">
                              Rate this book
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryMemberDashboard;
