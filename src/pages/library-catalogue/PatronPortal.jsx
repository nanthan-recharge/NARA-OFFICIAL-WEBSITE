import React, { useState, useEffect } from 'react';
import libraryService from '../../services/libraryService';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import { Book, Clock, AlertCircle, DollarSign, Heart, RotateCcw, Calendar, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PatronPortal = () => {
  const { user } = useFirebaseAuth();
  const [activeTab, setActiveTab] = useState('loans'); // loans, history, holds, fines, lists
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Patron data
  const [patronInfo, setPatronInfo] = useState(null);
  const [currentLoans, setCurrentLoans] = useState([]);
  const [borrowingHistory, setBorrowingHistory] = useState([]);
  const [activeHolds, setActiveHolds] = useState([]);
  const [fines, setFines] = useState([]);
  const [readingLists, setReadingLists] = useState([]);
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    if (user) {
      fetchPatronData();
    }
  }, [user, activeTab]);

  const fetchPatronData = async () => {
    try {
      setLoading(true);
      const token = await user?.getIdToken();
      
      // Fetch patron profile by Firebase UID
      const patronRes = await libraryService.getPatronByFirebaseUid(user.uid, token);
      setPatronInfo(patronRes.data);
      
      if (patronRes.data) {
        // Fetch statistics
        const statsRes = await libraryService.getPatronStatistics(patronRes.data.id, token);
        setStatistics(statsRes.data);
        
        // Fetch data based on active tab
        if (activeTab === 'loans') {
          const loansRes = await libraryService.getPatronActiveLoans(patronRes.data.id, token);
          setCurrentLoans(loansRes.data);
        } else if (activeTab === 'history') {
          const historyRes = await libraryService.getPatronBorrowingHistory(patronRes.data.id, token);
          setBorrowingHistory(historyRes.data);
        } else if (activeTab === 'holds') {
          const holdsRes = await libraryService.getPatronHolds(patronRes.data.id, token);
          setActiveHolds(holdsRes.data);
        } else if (activeTab === 'fines') {
          const finesRes = await libraryService.getPatronFines(patronRes.data.id, token);
          setFines(finesRes.data);
        }
      }
    } catch (err) {
      setError('Failed to fetch patron data. Please ensure you have a library account.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRenewItem = async (transactionId) => {
    try {
      const token = await user?.getIdToken();
      await libraryService.renewItem(transactionId, token);
      alert('Item renewed successfully!');
      fetchPatronData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to renew item');
      console.error(err);
    }
  };

  const handleCancelHold = async (holdId) => {
    if (!window.confirm('Are you sure you want to cancel this hold?')) return;
    
    try {
      const token = await user?.getIdToken();
      await libraryService.cancelHold(holdId, token);
      alert('Hold cancelled successfully!');
      fetchPatronData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel hold');
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <Book size={48} className="mx-auto text-blue-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access your patron portal.</p>
          <Link
            to="/firebase-admin-authentication-portal"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading && !patronInfo) {
    return <div className="text-center py-10">Loading your library account...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <AlertCircle size={48} className="mx-auto text-red-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/library"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Back to Catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome, {patronInfo?.first_name} {patronInfo?.last_name}
              </h1>
              <p className="text-gray-600 mt-1">Patron Number: {patronInfo?.patron_number}</p>
              <p className="text-gray-600">Category: {patronInfo?.category_name || 'N/A'}</p>
            </div>
            <div className="text-right">
              <Link
                to="/library"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Book size={18} />
                Browse Catalogue
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Current Loans</p>
                  <h3 className="text-3xl font-bold text-blue-600">{statistics.active_loans || 0}</h3>
                </div>
                <Book size={40} className="text-blue-400" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Active Holds</p>
                  <h3 className="text-3xl font-bold text-yellow-600">{statistics.active_holds || 0}</h3>
                </div>
                <Clock size={40} className="text-yellow-400" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Overdue Items</p>
                  <h3 className="text-3xl font-bold text-red-600">{statistics.overdue_items || 0}</h3>
                </div>
                <AlertCircle size={40} className="text-red-400" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Outstanding Fines</p>
                  <h3 className="text-3xl font-bold text-purple-600">
                    Rs. {statistics.total_fines?.toFixed(2) || '0.00'}
                  </h3>
                </div>
                <DollarSign size={40} className="text-purple-400" />
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('loans')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'loans'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Book size={18} />
                  Current Loans
                </div>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  Borrowing History
                </div>
              </button>
              <button
                onClick={() => setActiveTab('holds')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'holds'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  Active Holds
                </div>
              </button>
              <button
                onClick={() => setActiveTab('fines')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'fines'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <DollarSign size={18} />
                  Fines
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Current Loans Tab */}
            {activeTab === 'loans' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Loans</h2>
                {loading ? (
                  <div className="text-center py-8">Loading loans...</div>
                ) : currentLoans.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Book size={48} className="mx-auto mb-4 text-gray-400" />
                    <p>You don't have any items checked out.</p>
                    <Link
                      to="/library"
                      className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
                    >
                      Browse the catalogue
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentLoans.map(loan => {
                      const daysUntilDue = getDaysUntilDue(loan.due_date);
                      const isOverdue = daysUntilDue < 0;
                      
                      return (
                        <div key={loan.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <Link
                                to={`/library/item/${loan.bibliographic_record_id}`}
                                className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                              >
                                {loan.item_title}
                              </Link>
                              <p className="text-gray-600 text-sm mt-1">{loan.author}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <span className="text-gray-500">
                                  Checked out: {formatDate(loan.checkout_date)}
                                </span>
                                <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-700'}`}>
                                  Due: {formatDate(loan.due_date)}
                                  {isOverdue && ` (${Math.abs(daysUntilDue)} days overdue)`}
                                  {!isOverdue && daysUntilDue <= 3 && ` (${daysUntilDue} days left)`}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              {!isOverdue && (
                                <button
                                  onClick={() => handleRenewItem(loan.id)}
                                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                  <RotateCcw size={16} />
                                  Renew
                                </button>
                              )}
                              {isOverdue && (
                                <span className="bg-red-100 text-red-800 px-3 py-2 rounded-lg text-sm font-medium">
                                  Overdue
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Borrowing History Tab */}
            {activeTab === 'history' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Borrowing History</h2>
                {loading ? (
                  <div className="text-center py-8">Loading history...</div>
                ) : borrowingHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No borrowing history found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Checkout Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Return Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {borrowingHistory.map(record => (
                          <tr key={record.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm">
                              <Link
                                to={`/library/item/${record.bibliographic_record_id}`}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                              >
                                {record.item_title}
                              </Link>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{formatDate(record.checkout_date)}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {record.checkin_date ? formatDate(record.checkin_date) : 'Not returned'}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                record.status === 'returned' ? 'bg-green-100 text-green-800' :
                                record.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {record.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Active Holds Tab */}
            {activeTab === 'holds' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Holds</h2>
                {loading ? (
                  <div className="text-center py-8">Loading holds...</div>
                ) : activeHolds.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock size={48} className="mx-auto mb-4 text-gray-400" />
                    <p>You don't have any active holds.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeHolds.map(hold => (
                      <div key={hold.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Link
                              to={`/library/item/${hold.bibliographic_record_id}`}
                              className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                            >
                              {hold.item_title}
                            </Link>
                            <p className="text-gray-600 text-sm mt-1">{hold.author}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="text-gray-500">
                                Placed: {formatDate(hold.hold_date)}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                hold.status === 'ready' ? 'bg-green-100 text-green-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {hold.status === 'ready' ? 'Ready for Pickup' : 'Waiting'}
                              </span>
                              {hold.expiry_date && (
                                <span className="text-gray-500">
                                  Expires: {formatDate(hold.expiry_date)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="ml-4">
                            <button
                              onClick={() => handleCancelHold(hold.id)}
                              className="border border-red-600 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              Cancel Hold
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Fines Tab */}
            {activeTab === 'fines' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Fines</h2>
                {loading ? (
                  <div className="text-center py-8">Loading fines...</div>
                ) : fines.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle size={48} className="mx-auto mb-4 text-green-400" />
                    <p>You don't have any fines. Great job!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fine Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount Paid</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fine Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {fines.map(fine => (
                          <tr key={fine.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{fine.item_title}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">Rs. {fine.fine_amount?.toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">Rs. {fine.amount_paid?.toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{formatDate(fine.fine_date)}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                fine.status === 'paid' ? 'bg-green-100 text-green-800' :
                                fine.status === 'waived' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {fine.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> To pay fines, please visit the library or contact library staff.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatronPortal;

