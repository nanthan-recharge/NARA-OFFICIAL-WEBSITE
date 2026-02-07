import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Download, CheckCircle, XCircle, Clock, Search, Filter } from 'lucide-react';
import { collection, getDocs, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

const MarketplaceOrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'marketplace_orders'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, 'marketplace_orders', orderId);
      await updateDoc(orderRef, { status: newStatus, updatedAt: new Date() });
      alert('Order status updated!');
      loadOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-300',
      paid: 'bg-green-500/20 text-green-300',
      processing: 'bg-blue-500/20 text-blue-300',
      completed: 'bg-purple-500/20 text-purple-300',
      cancelled: 'bg-red-500/20 text-red-300'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300';
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.userId?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    paid: orders.filter(o => o.status === 'paid').length,
    totalRevenue: orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + (o.total || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 text-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#003366] to-[#0066CC]">
            Orders Management
          </h1>
          <p className="text-slate-500 mt-2">Monitor and manage marketplace orders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 border border-blue-200 rounded-xl p-6">
            <p className="text-slate-500 text-sm">Total Orders</p>
            <h3 className="text-3xl font-bold text-[#0066CC] mt-2">{stats.total}</h3>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50/50 border border-yellow-200 rounded-xl p-6">
            <p className="text-slate-500 text-sm">Pending</p>
            <h3 className="text-3xl font-bold text-yellow-400 mt-2">{stats.pending}</h3>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50/50 border border-green-200 rounded-xl p-6">
            <p className="text-slate-500 text-sm">Paid</p>
            <h3 className="text-3xl font-bold text-green-400 mt-2">{stats.paid}</h3>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50/50 border border-purple-200 rounded-xl p-6">
            <p className="text-slate-500 text-sm">Revenue</p>
            <h3 className="text-3xl font-bold text-purple-400 mt-2">LKR {stats.totalRevenue.toLocaleString()}</h3>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-300 rounded-lg focus:border-[#0066CC] focus:outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-white/50 border border-slate-300 rounded-lg focus:border-[#0066CC] focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="bg-white/50 border border-slate-300 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Items</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Date</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500">Loading orders...</td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500">No orders found</td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-100/30 transition">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-[#0066CC]">#{order.id.slice(0, 8)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-slate-900 font-medium">{order.customerName || 'N/A'}</p>
                          <p className="text-sm text-slate-500">{order.customerEmail || order.userId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-900">{order.items?.length || 0} items</td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-green-400">LKR {(order.total || 0).toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm">
                        {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="px-3 py-1 bg-slate-100 border border-slate-300 rounded text-sm focus:border-[#0066CC] focus:outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
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

export default MarketplaceOrdersAdmin;
