import React, { useState, useEffect } from 'react';
import libraryService from '../../services/libraryService';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import { LogIn, LogOut, RotateCcw, Clock, AlertTriangle, Search, DollarSign } from 'lucide-react';

const CirculationManager = () => {
  const { user } = useFirebaseAuth();
  const [activeTab, setActiveTab] = useState('checkout'); // checkout, checkin, active, overdue, holds, fines
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Check-out state
  const [checkoutBarcode, setCheckoutBarcode] = useState('');
  const [checkoutPatronNumber, setCheckoutPatronNumber] = useState('');
  const [checkoutDueDate, setCheckoutDueDate] = useState('');

  // Check-in state
  const [checkinBarcode, setCheckinBarcode] = useState('');

  // Active loans
  const [activeLoans, setActiveLoans] = useState([]);
  
  // Overdue items
  const [overdueItems, setOverdueItems] = useState([]);
  
  // Holds
  const [holds, setHolds] = useState([]);
  
  // Fines
  const [fines, setFines] = useState([]);

  useEffect(() => {
    if (activeTab === 'active') {
      fetchActiveLoans();
    } else if (activeTab === 'overdue') {
      fetchOverdueItems();
    } else if (activeTab === 'holds') {
      fetchHolds();
    } else if (activeTab === 'fines') {
      fetchFines();
    }
  }, [activeTab]);

  const fetchActiveLoans = async () => {
    try {
      setLoading(true);
      const token = await user?.getIdToken();
      const res = await libraryService.getActiveLoans(token);
      setActiveLoans(res.data);
    } catch (err) {
      console.error('Failed to fetch active loans:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOverdueItems = async () => {
    try {
      setLoading(true);
      const token = await user?.getIdToken();
      const res = await libraryService.getOverdueItems(token);
      setOverdueItems(res.data);
    } catch (err) {
      console.error('Failed to fetch overdue items:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHolds = async () => {
    try {
      setLoading(true);
      const token = await user?.getIdToken();
      const res = await libraryService.getAllHolds(token);
      setHolds(res.data);
    } catch (err) {
      console.error('Failed to fetch holds:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFines = async () => {
    try {
      setLoading(true);
      const token = await user?.getIdToken();
      const res = await libraryService.getAllFines(token);
      setFines(res.data);
    } catch (err) {
      console.error('Failed to fetch fines:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      setLoading(true);
      const token = await user?.getIdToken();
      
      const data = {
        patron_number: checkoutPatronNumber,
        barcode: checkoutBarcode,
        due_date: checkoutDueDate || undefined
      };
      
      await libraryService.checkoutItem(data, token);
      setSuccess('Item checked out successfully!');
      setCheckoutBarcode('');
      setCheckoutPatronNumber('');
      setCheckoutDueDate('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check out item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      setLoading(true);
      const token = await user?.getIdToken();
      
      const res = await libraryService.checkinItem({ barcode: checkinBarcode }, token);
      
      if (res.data.fine_amount && res.data.fine_amount > 0) {
        setSuccess(`Item checked in. Fine calculated: Rs. ${res.data.fine_amount.toFixed(2)}`);
      } else {
        setSuccess('Item checked in successfully!');
      }
      
      setCheckinBarcode('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check in item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async (transactionId) => {
    try {
      const token = await user?.getIdToken();
      await libraryService.renewItem(transactionId, token);
      alert('Item renewed successfully!');
      fetchActiveLoans();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to renew item');
      console.error(err);
    }
  };

  const handlePayFine = async (fineId) => {
    const amount = prompt('Enter payment amount:');
    if (!amount) return;
    
    try {
      const token = await user?.getIdToken();
      await libraryService.payFine(fineId, { amount: parseFloat(amount) }, token);
      alert('Fine payment recorded successfully!');
      fetchFines();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to record payment');
      console.error(err);
    }
  };

  const handleWaiveFine = async (fineId) => {
    if (!window.confirm('Are you sure you want to waive this fine?')) return;
    
    try {
      const token = await user?.getIdToken();
      await libraryService.waiveFine(fineId, token);
      alert('Fine waived successfully!');
      fetchFines();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to waive fine');
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

  const getDaysOverdue = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Circulation Manager</h1>
          <p className="text-gray-600 mt-1">Check-out, check-in, renewals, and manage circulation</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('checkout')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'checkout'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <LogIn size={18} />
                  Check-Out
                </div>
              </button>
              <button
                onClick={() => setActiveTab('checkin')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'checkin'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <LogOut size={18} />
                  Check-In
                </div>
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'active'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <RotateCcw size={18} />
                  Active Loans
                </div>
              </button>
              <button
                onClick={() => setActiveTab('overdue')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'overdue'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle size={18} />
                  Overdue ({overdueItems.length})
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
                  Holds
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
            {/* Check-Out Tab */}
            {activeTab === 'checkout' && (
              <div className="max-w-2xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Check-Out Item</h2>
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patron Number *
                    </label>
                    <input
                      type="text"
                      value={checkoutPatronNumber}
                      onChange={(e) => setCheckoutPatronNumber(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter patron number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Barcode *
                    </label>
                    <input
                      type="text"
                      value={checkoutBarcode}
                      onChange={(e) => setCheckoutBarcode(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Scan or enter barcode"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date (Optional - auto-calculated if empty)
                    </label>
                    <input
                      type="date"
                      value={checkoutDueDate}
                      onChange={(e) => setCheckoutDueDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <LogIn size={20} />
                    Check-Out Item
                  </button>
                </form>
              </div>
            )}

            {/* Check-In Tab */}
            {activeTab === 'checkin' && (
              <div className="max-w-2xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Check-In Item</h2>
                <form onSubmit={handleCheckin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Barcode *
                    </label>
                    <input
                      type="text"
                      value={checkinBarcode}
                      onChange={(e) => setCheckinBarcode(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Scan or enter barcode"
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <LogOut size={20} />
                    Check-In Item
                  </button>
                </form>
              </div>
            )}

            {/* Active Loans Tab */}
            {activeTab === 'active' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Loans</h2>
                {loading ? (
                  <div className="text-center py-8">Loading active loans...</div>
                ) : activeLoans.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No active loans</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patron</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Barcode</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Checkout Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {activeLoans.map(loan => (
                          <tr key={loan.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm">
                              <div className="font-medium text-gray-900">{loan.patron_name}</div>
                              <div className="text-gray-500 text-xs">{loan.patron_number}</div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{loan.item_title}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{loan.barcode}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{formatDate(loan.checkout_date)}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{formatDate(loan.due_date)}</td>
                            <td className="px-4 py-3 text-sm">
                              {new Date(loan.due_date) < new Date() ? (
                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                  Overdue
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                  Active
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-right">
                              <button
                                onClick={() => handleRenew(loan.id)}
                                className="text-blue-600 hover:text-blue-900 font-medium"
                              >
                                Renew
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Overdue Tab */}
            {activeTab === 'overdue' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Overdue Items</h2>
                {loading ? (
                  <div className="text-center py-8">Loading overdue items...</div>
                ) : overdueItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No overdue items</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patron</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Overdue</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fine</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {overdueItems.map(item => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm">
                              <div className="font-medium text-gray-900">{item.patron_name}</div>
                              <div className="text-gray-500 text-xs">{item.patron_number}</div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.item_title}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{formatDate(item.due_date)}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                {getDaysOverdue(item.due_date)} days
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              Rs. {(getDaysOverdue(item.due_date) * 10).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Holds Tab */}
            {activeTab === 'holds' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Holds & Reservations</h2>
                {loading ? (
                  <div className="text-center py-8">Loading holds...</div>
                ) : holds.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No active holds</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patron</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hold Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {holds.map(hold => (
                          <tr key={hold.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm">
                              <div className="font-medium text-gray-900">{hold.patron_name}</div>
                              <div className="text-gray-500 text-xs">{hold.patron_number}</div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{hold.item_title}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{formatDate(hold.hold_date)}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                hold.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                                hold.status === 'ready' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {hold.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {hold.expiry_date ? formatDate(hold.expiry_date) : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Fines Tab */}
            {activeTab === 'fines' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Fines Management</h2>
                {loading ? (
                  <div className="text-center py-8">Loading fines...</div>
                ) : fines.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No fines recorded</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patron</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fine Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount Paid</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {fines.map(fine => (
                          <tr key={fine.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm">
                              <div className="font-medium text-gray-900">{fine.patron_name}</div>
                              <div className="text-gray-500 text-xs">{fine.patron_number}</div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{fine.item_title}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">Rs. {fine.fine_amount?.toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">Rs. {fine.amount_paid?.toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                fine.status === 'paid' ? 'bg-green-100 text-green-800' :
                                fine.status === 'waived' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {fine.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-right space-x-2">
                              {fine.status === 'unpaid' && (
                                <>
                                  <button
                                    onClick={() => handlePayFine(fine.id)}
                                    className="text-green-600 hover:text-green-900 font-medium"
                                  >
                                    Pay
                                  </button>
                                  <button
                                    onClick={() => handleWaiveFine(fine.id)}
                                    className="text-blue-600 hover:text-blue-900 font-medium"
                                  >
                                    Waive
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

export default CirculationManager;

