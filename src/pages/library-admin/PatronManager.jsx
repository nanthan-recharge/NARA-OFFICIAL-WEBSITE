import React, { useState, useEffect } from 'react';
import libraryService from '../../services/libraryService';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import { Users, Search, Plus, Edit, Trash2, Eye, X, Save, BarChart } from 'lucide-react';

const PatronManager = () => {
  const { user } = useFirebaseAuth();
  const [patrons, setPatrons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [editingPatron, setEditingPatron] = useState(null);
  const [patronStats, setPatronStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  // Form state
  const [formData, setFormData] = useState({
    patron_number: '',
    firebase_uid: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    patron_category_id: '',
    notes: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, [currentPage, searchTerm, selectedCategory]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const token = await user?.getIdToken();
      
      // Fetch patron categories
      const categoriesRes = await libraryService.getPatronCategories(token);
      setCategories(categoriesRes.data);

      // Fetch patrons with pagination
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        category_id: selectedCategory
      };
      
      const patronsRes = await libraryService.getAllPatrons(params, token);
      setPatrons(patronsRes.data.patrons || patronsRes.data);
      setTotalPages(patronsRes.data.totalPages || 1);
    } catch (err) {
      setError('Failed to fetch patron data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGeneratePatronNumber = async () => {
    try {
      const token = await user?.getIdToken();
      const res = await libraryService.generatePatronNumber(token);
      setFormData(prev => ({ ...prev, patron_number: res.data.patron_number }));
    } catch (err) {
      console.error('Failed to generate patron number:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await user?.getIdToken();
      
      if (editingPatron) {
        await libraryService.updatePatron(editingPatron.id, formData, token);
        alert('Patron updated successfully!');
      } else {
        await libraryService.createPatron(formData, token);
        alert('Patron created successfully!');
      }
      
      resetForm();
      fetchInitialData();
    } catch (err) {
      alert('Failed to save patron: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  const handleEdit = (patron) => {
    setEditingPatron(patron);
    setFormData({
      patron_number: patron.patron_number || '',
      firebase_uid: patron.firebase_uid || '',
      first_name: patron.first_name || '',
      last_name: patron.last_name || '',
      email: patron.email || '',
      phone: patron.phone || '',
      address: patron.address || '',
      patron_category_id: patron.patron_category_id || '',
      notes: patron.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patron?')) return;
    
    try {
      const token = await user?.getIdToken();
      await libraryService.deletePatron(id, token);
      alert('Patron deleted successfully!');
      fetchInitialData();
    } catch (err) {
      alert('Failed to delete patron: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  const handleViewStats = async (patronId) => {
    try {
      const token = await user?.getIdToken();
      const res = await libraryService.getPatronStatistics(patronId, token);
      setPatronStats(res.data);
      setShowStats(true);
    } catch (err) {
      alert('Failed to fetch patron statistics: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      patron_number: '',
      firebase_uid: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      patron_category_id: '',
      notes: ''
    });
    setEditingPatron(null);
    setShowForm(false);
  };

  if (loading && patrons.length === 0) {
    return <div className="text-center py-10">Loading patron manager...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Patron Manager</h1>
            <p className="text-gray-600 mt-1">Manage library patrons and user profiles</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Add New Patron
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Users size={24} />
                  {editingPatron ? 'Edit Patron' : 'Add New Patron'}
                </h2>
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Patron Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patron Number *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="patron_number"
                        value={formData.patron_number}
                        onChange={handleInputChange}
                        required
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter or generate"
                      />
                      <button
                        type="button"
                        onClick={handleGeneratePatronNumber}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Generate
                      </button>
                    </div>
                  </div>

                  {/* Firebase UID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Firebase UID (Optional)
                    </label>
                    <input
                      type="text"
                      name="firebase_uid"
                      value={formData.firebase_uid}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Link to Firebase user"
                    />
                  </div>

                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter first name"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter last name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="patron@example.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+94 XX XXX XXXX"
                    />
                  </div>

                  {/* Patron Category */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patron Category *
                    </label>
                    <select
                      name="patron_category_id"
                      value={formData.patron_category_id}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name} (Max {category.max_items_allowed} items, {category.loan_period_days} days)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter address"
                    />
                  </div>

                  {/* Notes */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Internal notes"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Save size={18} />
                    {editingPatron ? 'Update Patron' : 'Create Patron'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Statistics Modal */}
        {showStats && patronStats && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <BarChart size={24} />
                  Patron Statistics
                </h2>
                <button onClick={() => setShowStats(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Loans</p>
                    <p className="text-3xl font-bold text-blue-600">{patronStats.total_loans || 0}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Active Loans</p>
                    <p className="text-3xl font-bold text-green-600">{patronStats.active_loans || 0}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Overdue Items</p>
                    <p className="text-3xl font-bold text-yellow-600">{patronStats.overdue_items || 0}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Fines</p>
                    <p className="text-3xl font-bold text-red-600">Rs. {patronStats.total_fines?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Activity</h3>
                  {patronStats.recent_loans && patronStats.recent_loans.length > 0 ? (
                    <ul className="space-y-2">
                      {patronStats.recent_loans.map((loan, index) => (
                        <li key={index} className="text-sm text-gray-700 border-b border-gray-200 pb-2">
                          <span className="font-medium">{loan.item_title}</span>
                          <span className="text-gray-500"> - {new Date(loan.checkout_date).toLocaleDateString()}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">No recent activity</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, patron number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Patrons Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patron Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patrons.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No patrons found. Click "Add New Patron" to create one.
                    </td>
                  </tr>
                ) : (
                  patrons.map(patron => (
                    <tr key={patron.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {patron.patron_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patron.first_name} {patron.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patron.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patron.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                          {patron.category_name || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          patron.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {patron.status || 'active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleViewStats(patron.id)}
                          className="text-purple-600 hover:text-purple-900"
                          title="View Statistics"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(patron)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(patron.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatronManager;

