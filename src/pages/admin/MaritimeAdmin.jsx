import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import {
  getVessels,
  getPorts,
  getMaritimeServices,
  getMaritimeAlerts,
  createMaritimeService,
  updateMaritimeService,
  deleteMaritimeService,
  createMaritimeAlert
} from '../../services/maritimeService';

const MaritimeAdmin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [vessels, setVessels] = useState([]);
  const [ports, setPorts] = useState([]);
  const [services, setServices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vesselsData, portsData, servicesData, alertsData] = await Promise.all([
        getVessels({ limit: 50 }),
        getPorts(),
        getMaritimeServices('en'),
        getMaritimeAlerts(true)
      ]);
      
      setVessels(vesselsData);
      setPorts(portsData);
      setServices(servicesData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error fetching maritime data:', error);
    } finally {
      setLoading(false);
    }
  };

  const seedDemoData = async () => {
    if (!window.confirm('Add demo data? This will create sample vessels, ports, services, and alerts.')) {
      return;
    }

    setLoading(true);
    try {
      const { createMaritimeService, createMaritimeAlert } = await import('../../services/maritimeService');
      const { setDoc, doc, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('../../firebase');

      // Add vessels
      const demoVessels = [
        {
          id: 'NARA-001',
          name: { en: 'RV Ocean Explorer', si: 'සාගර ගවේෂකයා', ta: 'கடல் ஆராய்ச்சி' },
          type: 'research_vessel',
          status: 'active',
          speed: 12.5,
          heading: 45,
          position: { lat: 6.9271, lon: 79.8612 },
          crew: 24,
          mission: { en: 'Deep Sea Survey', si: 'ගැඹුරු මුහුදු සමීක්ෂණය', ta: 'ஆழ் கடல் ஆய்வு' }
        },
        {
          id: 'FISH-245',
          name: { en: 'MV Blue Horizon', si: 'නිල් ක්ෂිතිජය', ta: 'நீல அடிவானம்' },
          type: 'fishing_vessel',
          status: 'in_port',
          speed: 0,
          heading: 180,
          position: { lat: 7.2906, lon: 79.8428 },
          crew: 12,
          mission: { en: 'Maintenance', si: 'නඩත්තුව', ta: 'பராமரிப்பு' }
        },
        {
          id: 'CARGO-789',
          name: { en: 'MV Sri Lanka Pride', si: 'ශ්‍රී ලංකා ආඩම්බරය', ta: 'இலங்கை பெருமை' },
          type: 'cargo',
          status: 'active',
          speed: 8.2,
          heading: 270,
          position: { lat: 6.9419, lon: 79.8433 },
          crew: 35,
          mission: { en: 'Export Transit', si: 'අපනයන ප්‍රවාහනය', ta: 'ஏற்றுமதி போக்குவரத்து' }
        }
      ];

      for (const vessel of demoVessels) {
        await setDoc(doc(db, 'maritime_vessels', vessel.id), vessel);
      }

      // Add ports
      const demoPorts = [
        {
          id: 'LKCMB',
          name: { en: 'Colombo Port', si: 'කොළඹ වරාය', ta: 'கொழும்பு துறைமுகம்' },
          code: 'LKCMB',
          vessels: 47,
          capacity: 85,
          weather: { condition: 'clear', temp: 28, wind: 12 },
          status: 'operational'
        },
        {
          id: 'LKHAM',
          name: { en: 'Hambantota Port', si: 'හම්බන්තොට වරාය', ta: 'ஹம்பாந்தோட்டை துறைமுகம்' },
          code: 'LKHAM',
          vessels: 12,
          capacity: 45,
          weather: { condition: 'cloudy', temp: 29, wind: 15 },
          status: 'operational'
        },
        {
          id: 'LKGAL',
          name: { en: 'Galle Port', si: 'ගාල්ල වරාය', ta: 'காலி துறைமுகம்' },
          code: 'LKGAL',
          vessels: 8,
          capacity: 62,
          weather: { condition: 'light_rain', temp: 27, wind: 18 },
          status: 'operational'
        }
      ];

      for (const port of demoPorts) {
        await setDoc(doc(db, 'maritime_ports', port.id), port);
      }

      // Add service
      await createMaritimeService({
        title: { en: 'Vessel Safety Inspection', si: 'යාත්‍රා ආරක්ෂණ පරීක්ෂණය', ta: 'கப்பல் பாதுகாப்பு ஆய்வு' },
        description: { en: 'Comprehensive safety inspection', si: 'සම්පූර්ණ ආරක්ෂණ පරීක්ෂණය', ta: 'விரிவான பாதுகாப்பு ஆய்வு' },
        category: 'inspection',
        price: 15000,
        duration: '2-3 hours'
      });

      // Add alert
      await createMaritimeAlert({
        severity: 'high',
        type: 'weather',
        title: { en: 'Strong Wind Warning', si: 'තද සුළං අනතුරු ඇඟවීම', ta: 'கடும் காற்று எச்சரிக்கை' },
        description: { en: 'Strong winds expected in southern waters', si: 'දකුණු ජලයේ තද සුළං අපේක්ෂා කෙරේ', ta: 'தென் கடல் பகுதியில் கடும் காற்று' },
        affectedAreas: ['South Coast', 'Galle', 'Matara']
      });

      alert('✅ Demo data added successfully! Refreshing...');
      await fetchData();
    } catch (error) {
      console.error('Error seeding data:', error);
      alert('❌ Error adding demo data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Icons.LayoutDashboard },
    { id: 'vessels', label: 'Vessels', icon: Icons.Ship },
    { id: 'ports', label: 'Ports', icon: Icons.Anchor },
    { id: 'services', label: 'Services', icon: Icons.Briefcase },
    { id: 'alerts', label: 'Alerts', icon: Icons.AlertTriangle }
  ];

  const stats = [
    { label: 'Active Vessels', value: vessels.length, icon: Icons.Ship, color: 'cyan' },
    { label: 'Operational Ports', value: ports.filter(p => p.status === 'operational').length, icon: Icons.Anchor, color: 'blue' },
    { label: 'Active Services', value: services.length, icon: Icons.Briefcase, color: 'purple' },
    { label: 'Active Alerts', value: alerts.length, icon: Icons.AlertTriangle, color: 'red' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white/50 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#003366] to-[#0066CC] rounded-xl flex items-center justify-center">
                <Icons.Waves className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Maritime Services Admin</h1>
                <p className="text-slate-500 text-sm">Manage vessels, ports, services & alerts</p>
              </div>
            </div>
            <div className="flex gap-3">
              {(vessels.length === 0 && ports.length === 0) && (
                <button
                  onClick={seedDemoData}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all shadow-lg shadow-sm flex items-center gap-2"
                >
                  <Icons.Database className="w-4 h-4" />
                  Setup Demo Data
                </button>
              )}
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-gradient-to-r from-[#003366] to-[#0066CC] hover:from-[#002244] hover:to-[#003366] text-white rounded-lg transition-all shadow-lg shadow-sm flex items-center gap-2"
              >
                <Icons.RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/50 backdrop-blur-xl rounded-xl border border-slate-200 p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-slate-500 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white/50 backdrop-blur-xl rounded-xl border border-slate-200 overflow-hidden mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#003366] to-[#0066CC] text-white'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <div className="bg-white/50 backdrop-blur-xl rounded-xl border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Vessels</h2>
                <div className="space-y-3">
                  {vessels.slice(0, 5).map((vessel) => (
                    <div key={vessel.id} className="flex items-center justify-between p-3 bg-slate-100/50 rounded-lg">
                      <div>
                        <p className="text-slate-900 font-medium">{vessel.name?.en || vessel.name}</p>
                        <p className="text-slate-500 text-sm">{vessel.type}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        vessel.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {vessel.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white/50 backdrop-blur-xl rounded-xl border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Active Alerts</h2>
                <div className="space-y-3">
                  {alerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="p-3 bg-slate-100/50 rounded-lg border-l-4 border-red-500">
                      <p className="text-slate-900 font-medium">{alert.title?.en || alert.title}</p>
                      <p className="text-slate-500 text-sm">{alert.type} - {alert.severity}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'services' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white/50 backdrop-blur-xl rounded-xl border border-slate-200 p-6"
            >
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Maritime Services</h2>
                <button
                  onClick={() => {
                    setEditingService(null);
                    setShowServiceModal(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-[#003366] to-[#0066CC] text-white rounded-lg flex items-center gap-2"
                >
                  <Icons.Plus className="w-4 h-4" />
                  Add Service
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div key={service.id} className="bg-slate-100/50 rounded-xl p-4 border border-slate-200">
                    <div className="flex justify-between mb-3">
                      <h3 className="text-slate-900 font-semibold">{service.title}</h3>
                      <button
                        onClick={() => {
                          setEditingService(service);
                          setShowServiceModal(true);
                        }}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Icons.Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-slate-500 text-sm mb-3">{service.description}</p>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                        {service.category}
                      </span>
                      <span className="px-2 py-1 bg-blue-50 text-[#0066CC] rounded text-xs">
                        LKR {service.price?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'alerts' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white/50 backdrop-blur-xl rounded-xl border border-slate-200 p-6"
            >
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Maritime Alerts</h2>
                <button
                  onClick={() => setShowAlertModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg flex items-center gap-2"
                >
                  <Icons.Plus className="w-4 h-4" />
                  Create Alert
                </button>
              </div>

              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="bg-slate-100/50 rounded-lg p-4 border-l-4 border-red-500">
                    <div className="flex justify-between mb-2">
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          alert.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                          alert.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                          {alert.type}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-slate-900 font-semibold mb-2">{alert.title?.en || alert.title}</h3>
                    <p className="text-slate-500 text-sm">{alert.description?.en || alert.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Service Modal */}
      {showServiceModal && (
        <ServiceFormModal
          service={editingService}
          onClose={() => setShowServiceModal(false)}
          onSuccess={() => {
            setShowServiceModal(false);
            fetchData();
          }}
        />
      )}

      {/* Alert Modal */}
      {showAlertModal && (
        <AlertFormModal
          onClose={() => setShowAlertModal(false)}
          onSuccess={() => {
            setShowAlertModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
};

// Service Form Modal
const ServiceFormModal = ({ service, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: { en: service?.title || '', si: '', ta: '' },
    description: { en: service?.description || '', si: '', ta: '' },
    category: service?.category || 'inspection',
    price: service?.price || 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (service) {
        await updateMaritimeService(service.id, formData);
      } else {
        await createMaritimeService(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl border border-slate-200 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">{service ? 'Edit Service' : 'Add Service'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900">
            <Icons.X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-500 mb-2">Title (English)</label>
            <input
              type="text"
              value={formData.title.en}
              onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-slate-500 mb-2">Description (English)</label>
            <textarea
              value={formData.description.en}
              onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900"
              rows="3"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-500 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900"
              >
                <option value="inspection">Inspection</option>
                <option value="permit">Permit</option>
                <option value="license">License</option>
                <option value="training">Training</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 mb-2">Price (LKR)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#003366] to-[#0066CC] text-white rounded-lg hover:from-[#002244] hover:to-[#003366] transition-all"
            >
              {service ? 'Update Service' : 'Create Service'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Alert Form Modal
const AlertFormModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: { en: '', si: '', ta: '' },
    description: { en: '', si: '', ta: '' },
    severity: 'high',
    type: 'weather',
    affectedAreas: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMaritimeAlert(formData);
      onSuccess();
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl border border-slate-200 p-6 max-w-2xl w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Create Maritime Alert</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900">
            <Icons.X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-500 mb-2">Title (English)</label>
            <input
              type="text"
              value={formData.title.en}
              onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-slate-500 mb-2">Description (English)</label>
            <textarea
              value={formData.description.en}
              onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900"
              rows="3"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-500 mb-2">Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900"
              >
                <option value="weather">Weather</option>
                <option value="security">Security</option>
                <option value="navigation">Navigation</option>
                <option value="environmental">Environmental</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg hover:from-red-600 hover:to-orange-700 transition-all"
            >
              Create Alert
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default MaritimeAdmin;
