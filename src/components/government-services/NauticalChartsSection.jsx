import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Download, FileText, Search, DollarSign, Ship } from 'lucide-react';
import toast from 'react-hot-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

/**
 * Nautical Charts Section
 * Moved from Maritime Services Hub - Chart catalog and requests
 */
const NauticalChartsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState({
    chartNumber: '',
    chartName: '',
    format: 'digital',
    quantity: 1,
    organization: '',
    contactName: '',
    email: '',
    phone: '',
    purpose: '',
    deliveryAddress: ''
  });

  // Sample chart catalog
  const charts = [
    {
      id: 'chart-colombo',
      chartNumber: 'SL-101',
      title: 'Colombo Harbour Approaches',
      scale: '1:50,000',
      coverage: 'Western Province · Colombo Port to Kalutara',
      format: ['digital', 'print'],
      priceLKR: 8500,
      status: 'available'
    },
    {
      id: 'chart-trinco',
      chartNumber: 'SL-214',
      title: 'Trincomalee Bay and Approaches',
      scale: '1:25,000',
      coverage: 'Eastern Province · Trincomalee Port limits',
      format: ['digital', 'print'],
      priceLKR: 9100,
      status: 'available'
    },
    {
      id: 'chart-north',
      chartNumber: 'SL-305',
      title: 'Jaffna Peninsula to Palk Strait',
      scale: '1:150,000',
      coverage: 'Northern Province · Delft Island to Puttalam',
      format: ['digital', 'print'],
      priceLKR: 7600,
      status: 'available'
    },
    {
      id: 'chart-offshore',
      chartNumber: 'SL-410',
      title: 'Sri Lanka Offshore Energy Blocks',
      scale: '1:500,000',
      coverage: 'Exclusive Economic Zone',
      format: ['digital'],
      priceLKR: 11200,
      status: 'available'
    }
  ];

  const filteredCharts = charts.filter(chart => {
    const matchesSearch = chart.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chart.chartNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFormat = selectedFormat === 'all' || chart.format.includes(selectedFormat);
    return matchesSearch && matchesFormat;
  });

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await addDoc(collection(db, 'nautical_chart_requests'), {
        ...requestForm,
        status: 'pending',
        submittedAt: serverTimestamp(),
        requestType: 'chart_request'
      });

      toast.success('Chart request submitted successfully!');
      setShowRequestForm(false);
      setRequestForm({
        chartNumber: '',
        chartName: '',
        format: 'digital',
        quantity: 1,
        organization: '',
        contactName: '',
        email: '',
        phone: '',
        purpose: '',
        deliveryAddress: ''
      });
    } catch (error) {
      console.error('Error submitting chart request:', error);
      toast.error('Failed to submit request. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-blue-500/10 border border-blue-500/30">
          <Map className="w-6 h-6 text-blue-400" />
          <span className="text-blue-400 font-semibold">Nautical Charts Service</span>
        </div>
        
        <h2 className="text-4xl font-bold text-white">
          Nautical Charts Catalog
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Official nautical charts for Sri Lankan waters. Digital and print formats available.
        </p>
      </motion.div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search charts by name or number..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
        
        <select
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
          className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500 transition-colors"
        >
          <option value="all">All Formats</option>
          <option value="digital">Digital Only</option>
          <option value="print">Print Only</option>
        </select>

        <button
          onClick={() => setShowRequestForm(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <FileText className="w-5 h-5" />
          Request Chart
        </button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCharts.map((chart, index) => (
          <motion.div
            key={chart.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-cyan-500/50 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-cyan-400 font-mono text-sm mb-1">{chart.chartNumber}</div>
                <h3 className="text-xl font-bold text-white mb-2">{chart.title}</h3>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                chart.status === 'available' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              }`}>
                {chart.status}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Map className="w-4 h-4" />
                <span>Scale: {chart.scale}</span>
              </div>
              <div className="text-sm text-slate-300">{chart.coverage}</div>
              <div className="flex items-center gap-2">
                {chart.format.map(fmt => (
                  <span key={fmt} className="px-3 py-1 rounded-lg bg-white/5 text-xs text-slate-300">
                    {fmt}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-white font-bold">
                <DollarSign className="w-5 h-5 text-green-400" />
                LKR {chart.priceLKR.toLocaleString()}
              </div>
              <button
                onClick={() => {
                  setRequestForm(prev => ({
                    ...prev,
                    chartNumber: chart.chartNumber,
                    chartName: chart.title
                  }));
                  setShowRequestForm(true);
                }}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-sm transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Request
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-white/10 p-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Request Nautical Chart</h3>
              <button
                onClick={() => setShowRequestForm(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="text-2xl text-slate-400">×</span>
              </button>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Chart Number
                  </label>
                  <input
                    type="text"
                    value={requestForm.chartNumber}
                    onChange={(e) => setRequestForm({ ...requestForm, chartNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Format
                  </label>
                  <select
                    value={requestForm.format}
                    onChange={(e) => setRequestForm({ ...requestForm, format: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    required
                  >
                    <option value="digital">Digital</option>
                    <option value="print">Print</option>
                    <option value="bundle">Both (Bundle)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={requestForm.quantity}
                    onChange={(e) => setRequestForm({ ...requestForm, quantity: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={requestForm.organization}
                    onChange={(e) => setRequestForm({ ...requestForm, organization: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={requestForm.contactName}
                    onChange={(e) => setRequestForm({ ...requestForm, contactName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={requestForm.email}
                    onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={requestForm.phone}
                    onChange={(e) => setRequestForm({ ...requestForm, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Purpose
                  </label>
                  <select
                    value={requestForm.purpose}
                    onChange={(e) => setRequestForm({ ...requestForm, purpose: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    required
                  >
                    <option value="">Select purpose</option>
                    <option value="commercial">Commercial Navigation</option>
                    <option value="research">Research</option>
                    <option value="education">Education</option>
                    <option value="government">Government Use</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {requestForm.format !== 'digital' && (
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    value={requestForm.deliveryAddress}
                    onChange={(e) => setRequestForm({ ...requestForm, deliveryAddress: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    required={requestForm.format !== 'digital'}
                  />
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="flex-1 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold transition-all"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-blue-500/20">
            <Ship className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Chart Information</h4>
            <p className="text-slate-300 text-sm mb-3">
              All nautical charts are produced according to IHO standards and regularly updated. 
              Digital charts include GeoTIFF and S-57 formats. Print charts are delivered within 5-7 business days.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="text-slate-400">📧 charts@nara.gov.lk</span>
              <span className="text-slate-400">📞 +94 11 234 5678</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NauticalChartsSection;
