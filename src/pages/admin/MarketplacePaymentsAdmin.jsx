import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, CreditCard, TrendingUp, Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

const MarketplacePaymentsAdmin = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'marketplace_payments'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const paymentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPayments(paymentsData);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-300',
      completed: 'bg-green-500/20 text-green-300',
      failed: 'bg-red-500/20 text-red-300',
      refunded: 'bg-purple-500/20 text-purple-300'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300';
  };

  const filteredPayments = payments.filter(payment =>
    payment.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.orderId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: payments.length,
    completed: payments.filter(p => p.status === 'completed').length,
    pending: payments.filter(p => p.status === 'pending').length,
    totalAmount: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 text-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#003366] to-[#0066CC]">
            Payments & Transactions
          </h1>
          <p className="text-slate-500 mt-2">Monitor payment gateway transactions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 border border-blue-200 rounded-xl p-6">
            <p className="text-slate-500 text-sm">Total Transactions</p>
            <h3 className="text-3xl font-bold text-[#0066CC] mt-2">{stats.total}</h3>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50/50 border border-green-200 rounded-xl p-6">
            <p className="text-slate-500 text-sm">Completed</p>
            <h3 className="text-3xl font-bold text-green-400 mt-2">{stats.completed}</h3>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50/50 border border-yellow-200 rounded-xl p-6">
            <p className="text-slate-500 text-sm">Pending</p>
            <h3 className="text-3xl font-bold text-yellow-400 mt-2">{stats.pending}</h3>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50/50 border border-purple-200 rounded-xl p-6">
            <p className="text-slate-500 text-sm">Total Amount</p>
            <h3 className="text-3xl font-bold text-purple-400 mt-2">LKR {stats.totalAmount.toLocaleString()}</h3>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search payments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-300 rounded-lg focus:border-[#0066CC] focus:outline-none"
          />
        </div>

        {/* Payments Table */}
        <div className="bg-white/50 border border-slate-300 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Transaction ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Method</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">Loading payments...</td>
                  </tr>
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">No payments found</td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-100/30 transition">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-[#0066CC]">#{payment.id.slice(0, 8)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-slate-600">{payment.orderId?.slice(0, 8) || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-[#0066CC]" />
                          <span className="text-slate-900">{payment.method || 'govpay'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-green-400">LKR {(payment.amount || 0).toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm">
                        {payment.createdAt?.toDate ? payment.createdAt.toDate().toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePaymentsAdmin;
