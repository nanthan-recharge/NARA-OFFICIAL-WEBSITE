import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import {
  fishAdvisoryService,
  fishingZonesService,
  fishMarketPricesService,
  seasonalRestrictionsService,
  fishAdvisoryDashboardService
} from '../../services/fishAdvisoryService';

const FishAdvisoryAdmin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [advisories, setAdvisories] = useState([]);
  const [zones, setZones] = useState([]);
  const [prices, setPrices] = useState([]);
  const [restrictions, setRestrictions] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsResult, advisoriesResult, zonesResult, pricesResult, restrictionsResult] = await Promise.all([
        fishAdvisoryDashboardService.getStatistics(),
        fishAdvisoryService.getAll({ limit: 100 }),
        fishingZonesService.getAll(),
        fishMarketPricesService.getAll({ limit: 100 }),
        seasonalRestrictionsService.getAll()
      ]);

      if (statsResult.data) setStatistics(statsResult.data);
      if (advisoriesResult.data) setAdvisories(advisoriesResult.data);
      if (zonesResult.data) setZones(zonesResult.data);
      if (pricesResult.data) setPrices(pricesResult.data);
      if (restrictionsResult.data) setRestrictions(restrictionsResult.data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      let result;

      if (modalType === 'advisory') {
        const advisoryData = {
          title: { en: data.title, si: data.title_si || '', ta: data.title_ta || '' },
          description: { en: data.description, si: data.description_si || '', ta: data.description_ta || '' },
          species: data.species,
          zone: data.zone || '',
          severity: data.severity,
          status: data.status,
          validFrom: data.validFrom ? Timestamp.fromDate(new Date(data.validFrom)) : Timestamp.now(),
          validUntil: data.validUntil ? Timestamp.fromDate(new Date(data.validUntil)) : Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
        };

        if (editingItem) {
          result = await fishAdvisoryService.update(editingItem.id, advisoryData);
        } else {
          result = await fishAdvisoryService.create(advisoryData);
        }
      } else if (modalType === 'zone') {
        const zoneData = {
          name: { en: data.name, si: data.name_si || '', ta: data.name_ta || '' },
          description: { en: data.description, si: data.description_si || '', ta: data.description_ta || '' },
          region: data.region,
          status: data.status,
          coordinates: {
            lat: parseFloat(data.lat) || 0,
            lng: parseFloat(data.lng) || 0
          }
        };

        if (editingItem) {
          result = await fishingZonesService.update(editingItem.id, zoneData);
        } else {
          result = await fishingZonesService.create(zoneData);
        }
      } else if (modalType === 'price') {
        const priceData = {
          species: { en: data.species, si: data.species_si || '', ta: data.species_ta || '' },
          market: { en: data.market, si: data.market_si || '', ta: data.market_ta || '' },
          price: parseFloat(data.price),
          priceChange: parseFloat(data.priceChange) || 0,
          date: data.date ? Timestamp.fromDate(new Date(data.date)) : Timestamp.now()
        };

        if (editingItem) {
          result = await fishMarketPricesService.update(editingItem.id, priceData);
        } else {
          result = await fishMarketPricesService.create(priceData);
        }
      } else if (modalType === 'restriction') {
        const restrictionData = {
          title: { en: data.title, si: data.title_si || '', ta: data.title_ta || '' },
          description: { en: data.description, si: data.description_si || '', ta: data.description_ta || '' },
          species: { en: data.species, si: data.species_si || '', ta: data.species_ta || '' },
          status: data.status,
          startDate: data.startDate ? Timestamp.fromDate(new Date(data.startDate)) : Timestamp.now(),
          endDate: data.endDate ? Timestamp.fromDate(new Date(data.endDate)) : Timestamp.fromDate(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000))
        };

        if (editingItem) {
          result = await seasonalRestrictionsService.update(editingItem.id, restrictionData);
        } else {
          result = await seasonalRestrictionsService.create(restrictionData);
        }
      }

      if (result.error) {
        alert('Error: ' + result.error.message);
      } else {
        alert(`${modalType} ${editingItem ? 'updated' : 'created'} successfully!`);
        closeModal();
        loadData();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form');
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      let result;
      if (type === 'advisory') result = await fishAdvisoryService.delete(id);
      else if (type === 'zone') result = await fishingZonesService.delete(id);
      else if (type === 'price') result = await fishMarketPricesService.delete(id);
      else if (type === 'restriction') result = await seasonalRestrictionsService.delete(id);

      if (result.error) {
        alert('Error: ' + result.error.message);
      } else {
        alert('Deleted successfully!');
        loadData();
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete');
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-[#0066CC]/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm mb-1">Active Advisories</p>
              <p className="text-3xl font-bold text-slate-900">{statistics?.advisories?.active || 0}</p>
            </div>
            <Icons.Fish className="w-12 h-12 text-[#0066CC]" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm mb-1">Fishing Zones</p>
              <p className="text-3xl font-bold text-slate-900">{statistics?.zones?.total || 0}</p>
            </div>
            <Icons.MapPin className="w-12 h-12 text-green-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm mb-1">Price Records</p>
              <p className="text-3xl font-bold text-slate-900">{statistics?.prices?.total || 0}</p>
            </div>
            <Icons.TrendingUp className="w-12 h-12 text-purple-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-xl p-6 border border-orange-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm mb-1">Restrictions</p>
              <p className="text-3xl font-bold text-slate-900">{statistics?.restrictions?.total || 0}</p>
            </div>
            <Icons.Calendar className="w-12 h-12 text-orange-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-100/50 rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Zone Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Open Zones</span>
              <span className="text-green-400 font-bold">{statistics?.zones?.open || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Restricted Zones</span>
              <span className="text-yellow-400 font-bold">{statistics?.zones?.restricted || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Closed Zones</span>
              <span className="text-red-400 font-bold">{statistics?.zones?.closed || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-100/50 rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Advisory Severity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Critical</span>
              <span className="text-red-400 font-bold">{statistics?.advisories?.critical || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Active</span>
              <span className="text-[#0066CC] font-bold">{statistics?.advisories?.active || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Total</span>
              <span className="text-slate-900 font-bold">{statistics?.advisories?.total || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdvisoriesManager = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Manage Advisories</h2>
        <button
          onClick={() => openModal('advisory')}
          className="px-4 py-2 bg-[#003366] hover:bg-[#002244] rounded-lg text-white font-medium transition-colors flex items-center gap-2"
        >
          <Icons.Plus className="w-5 h-5" />
          Add Advisory
        </button>
      </div>

      <div className="space-y-4">
        {advisories.map((advisory) => (
          <div key={advisory.id} className="bg-slate-100/50 rounded-xl p-6 border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    advisory.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                    advisory.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    advisory.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {advisory.severity?.toUpperCase()}
                  </span>
                  <span className="text-slate-500 text-sm">{advisory.species}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    advisory.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-500'
                  }`}>
                    {advisory.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{advisory.title?.en || advisory.title}</h3>
                <p className="text-slate-500 text-sm mb-2">{advisory.description?.en || advisory.description}</p>
                {advisory.validUntil && (
                  <p className="text-slate-500 text-xs">Valid until: {new Date(advisory.validUntil).toLocaleString()}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal('advisory', advisory)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                >
                  <Icons.Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete('advisory', advisory.id)}
                  className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                >
                  <Icons.Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {advisories.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No advisories found. Click "Add Advisory" to create one.
          </div>
        )}
      </div>
    </div>
  );

  const renderZonesManager = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Manage Fishing Zones</h2>
        <button
          onClick={() => openModal('zone')}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
        >
          <Icons.Plus className="w-5 h-5" />
          Add Zone
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {zones.map((zone) => (
          <div key={zone.id} className="bg-slate-100/50 rounded-xl p-6 border border-slate-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{zone.name?.en || zone.name}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  zone.status === 'open' ? 'bg-green-500/20 text-green-400' :
                  zone.status === 'restricted' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {zone.status?.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal('zone', zone)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                >
                  <Icons.Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete('zone', zone.id)}
                  className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                >
                  <Icons.Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-slate-500 text-sm mb-3">{zone.description?.en || zone.description}</p>
            {zone.coordinates && (
              <p className="text-slate-500 text-xs">
                Coordinates: {zone.coordinates.lat}, {zone.coordinates.lng}
              </p>
            )}
          </div>
        ))}
        {zones.length === 0 && (
          <div className="col-span-2 text-center py-12 text-slate-500">
            No zones found. Click "Add Zone" to create one.
          </div>
        )}
      </div>
    </div>
  );

  const renderPricesManager = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Manage Market Prices</h2>
        <button
          onClick={() => openModal('price')}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
        >
          <Icons.Plus className="w-5 h-5" />
          Add Price
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prices.map((price) => (
          <div key={price.id} className="bg-slate-100/50 rounded-xl p-6 border border-slate-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{price.species?.en || price.species}</h3>
                <p className="text-slate-500 text-sm">{price.market?.en || price.market}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal('price', price)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                >
                  <Icons.Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete('price', price.id)}
                  className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                >
                  <Icons.Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-400">Rs. {price.price}</p>
                <p className="text-slate-500 text-xs">per kg</p>
              </div>
              {price.priceChange && (
                <span className={`flex items-center gap-1 text-sm ${price.priceChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {price.priceChange > 0 ? <Icons.TrendingUp className="w-4 h-4" /> : <Icons.TrendingDown className="w-4 h-4" />}
                  {Math.abs(price.priceChange)}%
                </span>
              )}
            </div>
            {price.date && (
              <p className="text-slate-500 text-xs mt-3">Updated: {new Date(price.date).toLocaleDateString()}</p>
            )}
          </div>
        ))}
        {prices.length === 0 && (
          <div className="col-span-2 text-center py-12 text-slate-500">
            No prices found. Click "Add Price" to create one.
          </div>
        )}
      </div>
    </div>
  );

  const renderRestrictionsManager = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Manage Seasonal Restrictions</h2>
        <button
          onClick={() => openModal('restriction')}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
        >
          <Icons.Plus className="w-5 h-5" />
          Add Restriction
        </button>
      </div>

      <div className="space-y-4">
        {restrictions.map((restriction) => (
          <div key={restriction.id} className="bg-slate-100/50 rounded-xl p-6 border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    restriction.status === 'active' ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-500/20 text-slate-500'
                  }`}>
                    {restriction.status?.toUpperCase()}
                  </span>
                  <span className="text-slate-500 text-sm">{restriction.species?.en || restriction.species}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{restriction.title?.en || restriction.title}</h3>
                <p className="text-slate-500 text-sm mb-3">{restriction.description?.en || restriction.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>From: {restriction.startDate ? new Date(restriction.startDate).toLocaleDateString() : 'N/A'}</span>
                  <span>Until: {restriction.endDate ? new Date(restriction.endDate).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal('restriction', restriction)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                >
                  <Icons.Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete('restriction', restriction.id)}
                  className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                >
                  <Icons.Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {restrictions.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No restrictions found. Click "Add Restriction" to create one.
          </div>
        )}
      </div>
    </div>
  );

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              {editingItem ? 'Edit' : 'Add'} {modalType}
            </h3>
            <button onClick={closeModal} className="text-slate-500 hover:text-slate-900">
              <Icons.X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {modalType === 'advisory' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Title (EN)</label>
                  <input
                    name="title"
                    defaultValue={editingItem?.title?.en || ''}
                    required
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Description (EN)</label>
                  <textarea
                    name="description"
                    defaultValue={editingItem?.description?.en || ''}
                    required
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Species</label>
                    <input
                      name="species"
                      defaultValue={editingItem?.species || ''}
                      required
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Zone</label>
                    <input
                      name="zone"
                      defaultValue={editingItem?.zone || ''}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Severity</label>
                    <select
                      name="severity"
                      defaultValue={editingItem?.severity || 'low'}
                      required
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Status</label>
                    <select
                      name="status"
                      defaultValue={editingItem?.status || 'active'}
                      required
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Valid From</label>
                    <input
                      type="date"
                      name="validFrom"
                      defaultValue={editingItem?.validFrom ? new Date(editingItem.validFrom).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Valid Until</label>
                    <input
                      type="date"
                      name="validUntil"
                      defaultValue={editingItem?.validUntil ? new Date(editingItem.validUntil).toISOString().split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                    />
                  </div>
                </div>
              </>
            )}

            {modalType === 'zone' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Name (EN)</label>
                  <input
                    name="name"
                    defaultValue={editingItem?.name?.en || ''}
                    required
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Description (EN)</label>
                  <textarea
                    name="description"
                    defaultValue={editingItem?.description?.en || ''}
                    required
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Region</label>
                    <input
                      name="region"
                      defaultValue={editingItem?.region || ''}
                      required
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Status</label>
                    <select
                      name="status"
                      defaultValue={editingItem?.status || 'open'}
                      required
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                    >
                      <option value="open">Open</option>
                      <option value="restricted">Restricted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      name="lat"
                      defaultValue={editingItem?.coordinates?.lat || ''}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      name="lng"
                      defaultValue={editingItem?.coordinates?.lng || ''}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                    />
                  </div>
                </div>
              </>
            )}

            {modalType === 'price' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Species (EN)</label>
                  <input
                    name="species"
                    defaultValue={editingItem?.species?.en || ''}
                    required
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Market (EN)</label>
                  <input
                    name="market"
                    defaultValue={editingItem?.market?.en || ''}
                    required
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Price (Rs. per kg)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      defaultValue={editingItem?.price || ''}
                      required
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Price Change (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="priceChange"
                      defaultValue={editingItem?.priceChange || ''}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={editingItem?.date ? new Date(editingItem.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                  />
                </div>
              </>
            )}

            {modalType === 'restriction' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Title (EN)</label>
                  <input
                    name="title"
                    defaultValue={editingItem?.title?.en || ''}
                    required
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Description (EN)</label>
                  <textarea
                    name="description"
                    defaultValue={editingItem?.description?.en || ''}
                    required
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Species (EN)</label>
                    <input
                      name="species"
                      defaultValue={editingItem?.species?.en || ''}
                      required
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Status</label>
                    <select
                      name="status"
                      defaultValue={editingItem?.status || 'active'}
                      required
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      defaultValue={editingItem?.startDate ? new Date(editingItem.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      defaultValue={editingItem?.endDate ? new Date(editingItem.endDate).toISOString().split('T')[0] : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066CC]"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-900 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#003366] hover:bg-[#002244] rounded-lg text-white font-medium transition-colors"
              >
                {editingItem ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 text-slate-900">
      {/* Header */}
      <div className="bg-white/50 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Fish Advisory Admin</h1>
              <p className="text-slate-500">Manage advisories, zones, prices, and restrictions</p>
            </div>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-900 transition-colors flex items-center gap-2"
            >
              <Icons.ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Icons.LayoutDashboard },
              { id: 'advisories', label: 'Advisories', icon: Icons.Fish },
              { id: 'zones', label: 'Zones', icon: Icons.MapPin },
              { id: 'prices', label: 'Prices', icon: Icons.TrendingUp },
              { id: 'restrictions', label: 'Restrictions', icon: Icons.Calendar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#0066CC] text-[#0066CC]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0066CC]"></div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'advisories' && renderAdvisoriesManager()}
            {activeTab === 'zones' && renderZonesManager()}
            {activeTab === 'prices' && renderPricesManager()}
            {activeTab === 'restrictions' && renderRestrictionsManager()}
          </AnimatePresence>
        )}
      </div>

      {renderModal()}
    </div>
  );
};

export default FishAdvisoryAdmin;
