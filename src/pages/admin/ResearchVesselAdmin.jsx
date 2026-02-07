import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import {
  researchVesselsService,
  vesselBookingsService,
  vesselDashboardService,
  vesselImageService
} from '../../services/researchVesselService';

const ResearchVesselAdmin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [vessels, setVessels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsResult, vesselsResult, bookingsResult] = await Promise.all([
        vesselDashboardService.getStatistics(),
        researchVesselsService.getAll(),
        vesselBookingsService.getAll({ limit: 100 })
      ]);

      if (statsResult.data) setStatistics(statsResult.data);
      if (vesselsResult.data) setVessels(vesselsResult.data);
      if (bookingsResult.data) setBookings(bookingsResult.data);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingItem(null);
  };

  const handleVesselSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const vesselData = {
        name: data.name,
        description: data.description,
        length: parseFloat(data.length) || 0,
        capacity: parseInt(data.capacity) || 0,
        maxSpeed: parseFloat(data.maxSpeed) || 0,
        status: data.status,
        equipmentAvailable: data.equipmentAvailable ? data.equipmentAvailable.split(',').map(e => e.trim()) : [],
        specifications: data.specifications || '',
        imageUrl: data.imageUrl || ''
      };

      let result;
      if (editingItem) {
        result = await researchVesselsService.update(editingItem.id, vesselData);
      } else {
        result = await researchVesselsService.create(vesselData);
      }

      if (result.error) {
        alert(`Error: ${result.error.message}`);
      } else {
        alert(`Vessel ${editingItem ? 'updated' : 'created'} successfully!`);
        closeModal();
        loadData();
      }
    } catch (error) {
      console.error('Error submitting vessel:', error);
      alert('Failed to submit vessel');
    }
  };

  const handleBookingStatusUpdate = async (bookingId, newStatus, adminNotes = '') => {
    try {
      const result = await vesselBookingsService.updateStatus(bookingId, newStatus, adminNotes, 'Admin User');

      if (result.error) {
        alert(`Error: ${result.error.message}`);
      } else {
        alert(`Booking status updated to ${newStatus}!`);
        loadData();
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
    }
  };

  const handleDeleteVessel = async (id) => {
    if (!confirm('Are you sure you want to delete this vessel?')) return;

    try {
      const result = await researchVesselsService.delete(id);
      if (result.error) {
        alert(`Error: ${result.error.message}`);
      } else {
        alert('Vessel deleted successfully!');
        loadData();
      }
    } catch (error) {
      console.error('Error deleting vessel:', error);
      alert('Failed to delete vessel');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      const result = await vesselBookingsService.delete(id);
      if (result.error) {
        alert(`Error: ${result.error.message}`);
      } else {
        alert('Booking deleted successfully!');
        loadData();
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
      completed: 'bg-purple-100 text-purple-800 border-purple-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getVesselStatusColor = (status) => {
    const colors = {
      available: 'bg-green-100 text-green-800 border-green-300',
      in_use: 'bg-blue-100 text-blue-800 border-blue-300',
      maintenance: 'bg-orange-100 text-orange-800 border-orange-300',
      unavailable: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.LayoutDashboard },
    { id: 'vessels', label: 'Research Vessels', icon: Icons.Ship },
    { id: 'bookings', label: 'Bookings', icon: Icons.Calendar }
  ];

  const filteredBookings = filterStatus === 'all'
    ? bookings
    : bookings.filter(b => b.status === filterStatus);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <div className="text-slate-900 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-8 px-6 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Icons.Ship className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold">Research Vessel Admin</h1>
              <p className="text-blue-100 mt-2">Manage research vessels and booking requests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-[#0066CC] border-b-4 border-[#0066CC] bg-blue-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Statistics Cards */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <Icons.Ship className="w-8 h-8 opacity-80" />
                    <div className="text-3xl font-bold">{statistics?.vessels?.total || 0}</div>
                  </div>
                  <div className="text-sm opacity-90">Total Vessels</div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <Icons.CheckCircle className="w-8 h-8 opacity-80" />
                    <div className="text-3xl font-bold">{statistics?.vessels?.available || 0}</div>
                  </div>
                  <div className="text-sm opacity-90">Available</div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <Icons.Clock className="w-8 h-8 opacity-80" />
                    <div className="text-3xl font-bold">{statistics?.bookings?.pending || 0}</div>
                  </div>
                  <div className="text-sm opacity-90">Pending Bookings</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <Icons.Calendar className="w-8 h-8 opacity-80" />
                    <div className="text-3xl font-bold">{statistics?.bookings?.confirmed || 0}</div>
                  </div>
                  <div className="text-sm opacity-90">Confirmed Bookings</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Recent Bookings */}
                <div className="bg-white rounded-xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Icons.Activity className="w-6 h-6 text-[#0066CC]" />
                    Recent Bookings
                  </h3>
                  <div className="space-y-3">
                    {statistics?.recentBookings?.slice(0, 5).map((booking, idx) => (
                      <div key={idx} className="bg-slate-100 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="text-slate-900 font-medium">{booking.vesselName}</div>
                            <div className="text-sm text-slate-500 mt-1">{booking.organizationName}</div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {booking.startDate?.toDate?.()?.toLocaleDateString()} - {booking.endDate?.toDate?.()?.toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                    {(!statistics?.recentBookings || statistics.recentBookings.length === 0) && (
                      <div className="text-slate-500 text-center py-8">No recent bookings</div>
                    )}
                  </div>
                </div>

                {/* Vessel Status Overview */}
                <div className="bg-white rounded-xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Icons.Ship className="w-6 h-6 text-[#0066CC]" />
                    Vessel Status Overview
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-100 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-slate-900">Available</span>
                      </div>
                      <span className="text-2xl font-bold text-slate-900">{statistics?.vessels?.available || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-100 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-slate-900">In Use</span>
                      </div>
                      <span className="text-2xl font-bold text-slate-900">{statistics?.vessels?.inUse || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-100 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span className="text-slate-900">Maintenance</span>
                      </div>
                      <span className="text-2xl font-bold text-slate-900">{statistics?.vessels?.maintenance || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Vessels View */}
          {activeTab === 'vessels' && (
            <motion.div
              key="vessels"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Research Vessels</h2>
                <button
                  onClick={() => openModal('vessel')}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <Icons.Plus className="w-5 h-5" />
                  Add Vessel
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vessels.map((vessel) => (
                  <div key={vessel.id} className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all">
                    <div className="relative h-48 bg-gradient-to-br from-blue-500 to-cyan-600">
                      {vessel.imageUrl ? (
                        <img src={vessel.imageUrl} alt={vessel.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icons.Ship className="w-16 h-16 text-white opacity-50" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getVesselStatusColor(vessel.status)}`}>
                          {vessel.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{vessel.name}</h3>
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2">{vessel.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Icons.Ruler className="w-4 h-4" />
                          <span>Length: {vessel.length}m</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Icons.Users className="w-4 h-4" />
                          <span>Capacity: {vessel.capacity}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Icons.Gauge className="w-4 h-4" />
                          <span>Max Speed: {vessel.maxSpeed} knots</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
                        <button
                          onClick={() => openModal('vessel', vessel)}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Icons.Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteVessel(vessel.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Icons.Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {vessels.length === 0 && (
                <div className="text-center py-16 text-slate-500">
                  <Icons.Ship className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>No vessels found. Click "Add Vessel" to create one.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Bookings View */}
          {activeTab === 'bookings' && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Vessel Bookings</h2>
                <div className="flex items-center gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 bg-slate-100 text-slate-900 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Booking ID</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Vessel</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Organization</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Dates</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">Status</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-slate-100/50 transition-colors">
                          <td className="px-6 py-4 text-sm text-slate-900 font-mono">{booking.bookingId}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{booking.vesselName}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{booking.organizationName}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            <div>{booking.startDate?.toDate?.()?.toLocaleDateString()}</div>
                            <div className="text-xs text-slate-500">to {booking.endDate?.toDate?.()?.toLocaleDateString()}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {booking.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => {
                                      const notes = prompt('Enter approval notes (optional):');
                                      handleBookingStatusUpdate(booking.id, 'approved', notes || '');
                                    }}
                                    className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                                    title="Approve"
                                  >
                                    <Icons.CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      const reason = prompt('Enter rejection reason:');
                                      if (reason) handleBookingStatusUpdate(booking.id, 'rejected', reason);
                                    }}
                                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                    title="Reject"
                                  >
                                    <Icons.XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              {booking.status === 'approved' && (
                                <button
                                  onClick={() => handleBookingStatusUpdate(booking.id, 'confirmed', 'Booking confirmed')}
                                  className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                                  title="Confirm"
                                >
                                  <Icons.CheckSquare className="w-4 h-4" />
                                </button>
                              )}
                              {booking.status === 'confirmed' && (
                                <button
                                  onClick={() => handleBookingStatusUpdate(booking.id, 'completed', 'Cruise completed')}
                                  className="p-2 text-purple-400 hover:bg-purple-400/10 rounded-lg transition-colors"
                                  title="Mark Complete"
                                >
                                  <Icons.Flag className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  alert(`
Booking Details:
- Vessel: ${booking.vesselName}
- Organization: ${booking.organizationName}
- PI: ${booking.principalInvestigator}
- Email: ${booking.contactEmail}
- Phone: ${booking.contactPhone}
- Project: ${booking.researchProject}
- Purpose: ${booking.purposeOfCruise}
- Departure: ${booking.departurePort}
- Destination: ${booking.destinationArea}
- Scientists: ${booking.numberOfScientists}
- Equipment: ${booking.equipmentRequired || 'None'}
- Special Requests: ${booking.specialRequests || 'None'}
                                  `.trim());
                                }}
                                className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Icons.Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteBooking(booking.id)}
                                className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Icons.Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredBookings.length === 0 && (
                        <tr>
                          <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                            No bookings found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Vessel Modal */}
      <AnimatePresence>
        {showModal && modalType === 'vessel' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">
                  {editingItem ? 'Edit' : 'Add'} Vessel
                </h3>
                <button onClick={closeModal} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
                  <Icons.X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleVesselSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Vessel Name *</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingItem?.name || ''}
                    required
                    className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g., RV Samudrika"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Description *</label>
                  <textarea
                    name="description"
                    defaultValue={editingItem?.description || ''}
                    required
                    rows="4"
                    className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Vessel description and capabilities..."
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Length (m) *</label>
                    <input
                      type="number"
                      name="length"
                      defaultValue={editingItem?.length || ''}
                      required
                      step="0.1"
                      min="0"
                      className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="25.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Capacity *</label>
                    <input
                      type="number"
                      name="capacity"
                      defaultValue={editingItem?.capacity || ''}
                      required
                      min="1"
                      className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="15"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Max Speed (knots) *</label>
                    <input
                      type="number"
                      name="maxSpeed"
                      defaultValue={editingItem?.maxSpeed || ''}
                      required
                      step="0.1"
                      min="0"
                      className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="12"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Status *</label>
                  <select
                    name="status"
                    defaultValue={editingItem?.status || 'available'}
                    required
                    className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="available">Available</option>
                    <option value="in_use">In Use</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Equipment Available (comma-separated)</label>
                  <input
                    type="text"
                    name="equipmentAvailable"
                    defaultValue={editingItem?.equipmentAvailable?.join(', ') || ''}
                    className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="CTD, Plankton Net, GPS, Sonar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Specifications</label>
                  <textarea
                    name="specifications"
                    defaultValue={editingItem?.specifications || ''}
                    rows="3"
                    className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Additional technical specifications..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    defaultValue={editingItem?.imageUrl || ''}
                    className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="https://example.com/vessel-image.jpg"
                  />
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResearchVesselAdmin;
