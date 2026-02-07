import React, { useState, useEffect } from 'react';
import libraryService from '../../services/libraryService';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import { ShoppingCart, Package, TrendingUp, DollarSign, Plus, Edit, Trash2, Search, X, Save } from 'lucide-react';

const AcquisitionsManager = () => {
  const { user } = useFirebaseAuth();
  const [activeTab, setActiveTab] = useState('orders'); // orders, suppliers, budget
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(null);

  // Data
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [budgetReport, setBudgetReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Order form state
  const [orderForm, setOrderForm] = useState({
    supplier_id: '',
    order_date: new Date().toISOString().split('T')[0],
    expected_date: '',
    total_cost: '',
    budget_code: '',
    notes: '',
    status: 'ordered'
  });

  // Supplier form state
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab, searchTerm, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (activeTab === 'orders') {
        const params = { search: searchTerm, status: statusFilter };
        const ordersRes = await libraryService.acquisitions.getAllAcquisitions(params);
        setOrders(ordersRes.data || []);
      } else if (activeTab === 'suppliers') {
        const suppliersRes = await libraryService.acquisitions.getAllSuppliers();
        setSuppliers(suppliersRes.data || []);
      } else if (activeTab === 'budget') {
        const budgetRes = await libraryService.acquisitions.getBudgetReport();
        setBudgetReport(budgetRes.data || null);
      }
    } catch (err) {
      setError('Failed to fetch acquisitions data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOrder) {
        await libraryService.acquisitions.updateAcquisition(editingOrder.id, orderForm);
        alert('Order updated successfully!');
      } else {
        await libraryService.acquisitions.createAcquisition(orderForm);
        alert('Order created successfully!');
      }

      resetOrderForm();
      fetchData();
    } catch (err) {
      alert('Failed to save order: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  const handleSupplierSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await libraryService.acquisitions.updateSupplier(editingSupplier.id, supplierForm);
        alert('Supplier updated successfully!');
      } else {
        await libraryService.acquisitions.createSupplier(supplierForm);
        alert('Supplier created successfully!');
      }

      resetSupplierForm();
      fetchData();
    } catch (err) {
      alert('Failed to save supplier: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setOrderForm({
      supplier_id: order.supplier_id || '',
      order_date: order.order_date?.split('T')[0] || '',
      expected_date: order.expected_date?.split('T')[0] || '',
      total_cost: order.total_cost || '',
      budget_code: order.budget_code || '',
      notes: order.notes || '',
      status: order.status || 'ordered'
    });
    setShowOrderForm(true);
  };

  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier);
    setSupplierForm({
      name: supplier.name || '',
      contact_person: supplier.contact_person || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
      website: supplier.website || '',
      notes: supplier.notes || ''
    });
    setShowSupplierForm(true);
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      await libraryService.acquisitions.deleteAcquisition(id);
      alert('Order deleted successfully!');
      fetchData();
    } catch (err) {
      alert('Failed to delete order: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  const handleDeleteSupplier = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;

    try {
      await libraryService.acquisitions.deleteSupplier(id);
      alert('Supplier deleted successfully!');
      fetchData();
    } catch (err) {
      alert('Failed to delete supplier: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  const resetOrderForm = () => {
    setOrderForm({
      supplier_id: '',
      order_date: new Date().toISOString().split('T')[0],
      expected_date: '',
      total_cost: '',
      budget_code: '',
      notes: '',
      status: 'ordered'
    });
    setEditingOrder(null);
    setShowOrderForm(false);
  };

  const resetSupplierForm = () => {
    setSupplierForm({
      name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
      website: '',
      notes: ''
    });
    setEditingSupplier(null);
    setShowSupplierForm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `Rs. ${parseFloat(amount).toFixed(2)}`;
  };

  // Fetch suppliers for dropdown
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const suppliersRes = await libraryService.acquisitions.getAllSuppliers();
        setSuppliers(suppliersRes.data || []);
      } catch (err) {
        console.error('Failed to fetch suppliers:', err);
      }
    };
    if (showOrderForm) {
      fetchSuppliers();
    }
  }, [showOrderForm]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Acquisitions Manager</h1>
            <p className="text-gray-600 mt-1">Manage orders, suppliers, and budgets</p>
          </div>
          {activeTab === 'orders' && (
            <button
              onClick={() => setShowOrderForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              New Order
            </button>
          )}
          {activeTab === 'suppliers' && (
            <button
              onClick={() => setShowSupplierForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              New Supplier
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Order Form Modal */}
        {showOrderForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <ShoppingCart size={24} />
                  {editingOrder ? 'Edit Order' : 'New Order'}
                </h2>
                <button onClick={resetOrderForm} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleOrderSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supplier *
                    </label>
                    <select
                      value={orderForm.supplier_id}
                      onChange={(e) => setOrderForm({ ...orderForm, supplier_id: e.target.value })}
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Supplier</option>
                      {suppliers.map(supplier => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Date *
                    </label>
                    <input
                      type="date"
                      value={orderForm.order_date}
                      onChange={(e) => setOrderForm({ ...orderForm, order_date: e.target.value })}
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Delivery Date
                    </label>
                    <input
                      type="date"
                      value={orderForm.expected_date}
                      onChange={(e) => setOrderForm({ ...orderForm, expected_date: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Cost *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={orderForm.total_cost}
                      onChange={(e) => setOrderForm({ ...orderForm, total_cost: e.target.value })}
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget Code
                    </label>
                    <input
                      type="text"
                      value={orderForm.budget_code}
                      onChange={(e) => setOrderForm({ ...orderForm, budget_code: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., LIB-2025-001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      value={orderForm.status}
                      onChange={(e) => setOrderForm({ ...orderForm, status: e.target.value })}
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="ordered">Ordered</option>
                      <option value="received">Received</option>
                      <option value="catalogued">Catalogued</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={orderForm.notes}
                      onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                      rows="3"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Additional notes about this order"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetOrderForm}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Save size={18} />
                    {editingOrder ? 'Update Order' : 'Create Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Supplier Form Modal */}
        {showSupplierForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Package size={24} />
                  {editingSupplier ? 'Edit Supplier' : 'New Supplier'}
                </h2>
                <button onClick={resetSupplierForm} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSupplierSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supplier Name *
                    </label>
                    <input
                      type="text"
                      value={supplierForm.name}
                      onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter supplier name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      value={supplierForm.contact_person}
                      onChange={(e) => setSupplierForm({ ...supplierForm, contact_person: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Contact person name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={supplierForm.email}
                      onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="supplier@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={supplierForm.phone}
                      onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+94 XX XXX XXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      value={supplierForm.website}
                      onChange={(e) => setSupplierForm({ ...supplierForm, website: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      value={supplierForm.address}
                      onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                      rows="2"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Supplier address"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={supplierForm.notes}
                      onChange={(e) => setSupplierForm({ ...supplierForm, notes: e.target.value })}
                      rows="2"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Additional notes"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetSupplierForm}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Save size={18} />
                    {editingSupplier ? 'Update Supplier' : 'Create Supplier'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'orders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart size={18} />
                  Orders
                </div>
              </button>
              <button
                onClick={() => setActiveTab('suppliers')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'suppliers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Package size={18} />
                  Suppliers
                </div>
              </button>
              <button
                onClick={() => setActiveTab('budget')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'budget'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} />
                  Budget
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                {/* Search and Filter */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Statuses</option>
                    <option value="ordered">Ordered</option>
                    <option value="received">Received</option>
                    <option value="catalogued">Catalogued</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {loading ? (
                  <div className="text-center py-8">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No orders found. Click "New Order" to create one.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expected Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Cost</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map(order => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">#{order.id}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{order.supplier_name}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{formatDate(order.order_date)}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {order.expected_date ? formatDate(order.expected_date) : 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(order.total_cost)}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'catalogued' ? 'bg-green-100 text-green-800' :
                                order.status === 'received' ? 'bg-blue-100 text-blue-800' :
                                  order.status === 'ordered' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-right space-x-2">
                              <button
                                onClick={() => handleEditOrder(order)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <Trash2 size={18} />
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

            {/* Suppliers Tab */}
            {activeTab === 'suppliers' && (
              <div>
                {loading ? (
                  <div className="text-center py-8">Loading suppliers...</div>
                ) : suppliers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No suppliers found. Click "New Supplier" to add one.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suppliers.map(supplier => (
                      <div key={supplier.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-gray-800">{supplier.name}</h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditSupplier(supplier)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteSupplier(supplier.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        {supplier.contact_person && (
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Contact:</strong> {supplier.contact_person}
                          </p>
                        )}
                        {supplier.email && (
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Email:</strong> {supplier.email}
                          </p>
                        )}
                        {supplier.phone && (
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Phone:</strong> {supplier.phone}
                          </p>
                        )}
                        {supplier.website && (
                          <p className="text-sm text-blue-600 hover:text-blue-800">
                            <a href={supplier.website} target="_blank" rel="noopener noreferrer">
                              Visit Website
                            </a>
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Budget Tab */}
            {activeTab === 'budget' && (
              <div>
                {loading ? (
                  <div className="text-center py-8">Loading budget report...</div>
                ) : budgetReport ? (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-blue-50 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Total Budget</p>
                            <h3 className="text-3xl font-bold text-blue-600">
                              {formatCurrency(budgetReport.total_budget || 0)}
                            </h3>
                          </div>
                          <DollarSign size={40} className="text-blue-400" />
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Spent</p>
                            <h3 className="text-3xl font-bold text-green-600">
                              {formatCurrency(budgetReport.total_spent || 0)}
                            </h3>
                          </div>
                          <TrendingUp size={40} className="text-green-400" />
                        </div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Remaining</p>
                            <h3 className="text-3xl font-bold text-purple-600">
                              {formatCurrency(budgetReport.remaining || 0)}
                            </h3>
                          </div>
                          <Package size={40} className="text-purple-400" />
                        </div>
                      </div>
                    </div>

                    {budgetReport.by_category && budgetReport.by_category.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Budget by Category</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allocated</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spent</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remaining</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">% Used</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {budgetReport.by_category.map((cat, index) => {
                                const percentUsed = (cat.spent / cat.allocated * 100).toFixed(1);
                                return (
                                  <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{cat.category}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(cat.allocated)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(cat.spent)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(cat.remaining)}</td>
                                    <td className="px-4 py-3 text-sm">
                                      <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                          <div
                                            className={`h-2 rounded-full ${percentUsed > 90 ? 'bg-red-500' :
                                              percentUsed > 75 ? 'bg-yellow-500' :
                                                'bg-green-500'
                                              }`}
                                            style={{ width: `${Math.min(percentUsed, 100)}%` }}
                                          />
                                        </div>
                                        <span className="text-xs text-gray-600">{percentUsed}%</span>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No budget data available.
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

export default AcquisitionsManager;

