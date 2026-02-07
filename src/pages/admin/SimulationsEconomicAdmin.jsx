import React, { useState, useEffect } from 'react';
import SEOHead from '../../components/shared/SEOHead';
import { Link } from 'react-router-dom';
import {
  Activity,
  DollarSign,
  ArrowLeft,
  Plus,
  Trash2,
  Download,
  RefreshCw,
  Search,
  Eye,
  BarChart3,
  TrendingUp,
  Users,
  Fish,
  Building
} from 'lucide-react';
import { collection, getDocs, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

const SimulationsEconomicAdmin = () => {
  const [activeTab, setActiveTab] = useState('simulations');
  const [loading, setLoading] = useState(true);
  const [simulations, setSimulations] = useState([]);
  const [economicData, setEconomicData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load simulations
      const simulationsSnap = await getDocs(
        query(collection(db, 'policy_simulations'), orderBy('createdAt', 'desc'))
      );
      const simulationsData = simulationsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setSimulations(simulationsData);

      // Load economic valuations
      const economicSnap = await getDocs(
        query(collection(db, 'economic_valuations'), orderBy('createdAt', 'desc'))
      );
      const economicDataList = economicSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setEconomicData(economicDataList);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const deleteSimulation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this simulation?')) return;

    try {
      await deleteDoc(doc(db, 'policy_simulations', id));
      setSimulations(simulations.filter(s => s.id !== id));
      alert('Simulation deleted successfully');
    } catch (error) {
      console.error('Error deleting simulation:', error);
      alert('Failed to delete simulation');
    }
  };

  const deleteEconomicRecord = async (id) => {
    if (!window.confirm('Are you sure you want to delete this economic record?')) return;

    try {
      await deleteDoc(doc(db, 'economic_valuations', id));
      setEconomicData(economicData.filter(e => e.id !== id));
      alert('Economic record deleted successfully');
    } catch (error) {
      console.error('Error deleting economic record:', error);
      alert('Failed to delete economic record');
    }
  };

  const viewDetails = (item) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  const exportData = () => {
    const data = activeTab === 'simulations' ? simulations : economicData;
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      archived: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredSimulations = simulations.filter(s =>
    s.policyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.scenarioId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEconomic = economicData.filter(e =>
    e.year?.toString().includes(searchTerm) ||
    e.valuationId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
        <SEOHead
          title="Simulations & Economic Admin"
          description="Simulations and economic data management panel."
          path="/admin/analytics/simulations"
          noindex
        />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/admin/analytics"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Analytics Admin
            </Link>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <BarChart3 className="w-10 h-10 text-blue-400" />
                <div>
                  <h1 className="text-4xl font-bold">Simulations & Economic Data</h1>
                  <p className="text-gray-300 mt-1">Manage policy scenarios and economic valuations</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={exportData}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>

                <button
                  onClick={loadData}
                  disabled={loading}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-6 h-6 text-orange-600" />
                    <span className="text-sm text-gray-600 font-semibold">Policy Simulations</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{simulations.length}</div>
                  <div className="text-sm text-gray-500 mt-1">Total scenarios</div>
                </div>
                <Link
                  to="/analytics/policy-simulator"
                  className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  New
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    <span className="text-sm text-gray-600 font-semibold">Economic Valuations</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{economicData.length}</div>
                  <div className="text-sm text-gray-500 mt-1">Total records</div>
                </div>
                <Link
                  to="/analytics/economic-valuation"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  New
                </Link>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-lg p-2 mb-8">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('simulations')}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all flex-1 ${
                  activeTab === 'simulations'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Activity className="w-5 h-5" />
                <span className="font-medium">Policy Simulations ({simulations.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('economic')}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all flex-1 ${
                  activeTab === 'economic'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <DollarSign className="w-5 h-5" />
                <span className="font-medium">Economic Data ({economicData.length})</span>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={activeTab === 'simulations' ? 'Search simulations...' : 'Search economic data...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-3 text-gray-600">Loading data...</span>
            </div>
          ) : (
            <>
              {/* Simulations Table */}
              {activeTab === 'simulations' && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {filteredSimulations.length === 0 ? (
                    <div className="p-12 text-center">
                      <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Simulations Found</h3>
                      <p className="text-gray-600 mb-6">Create your first policy simulation</p>
                      <Link
                        to="/analytics/policy-simulator"
                        className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                      >
                        <Plus className="w-4 h-4" />
                        Create Simulation
                      </Link>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                            Policy Name
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                            Type
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                            Created
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredSimulations.map((sim) => (
                          <tr key={sim.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-medium text-gray-900">{sim.policyName}</div>
                              <div className="text-xs text-gray-500 font-mono">{sim.scenarioId}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm capitalize">{sim.policyType?.replace('_', ' ')}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(sim.status)}`}>
                                {sim.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{sim.createdAt?.toLocaleDateString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => viewDetails(sim)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteSimulation(sim.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* Economic Data Table */}
              {activeTab === 'economic' && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {filteredEconomic.length === 0 ? (
                    <div className="p-12 text-center">
                      <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Economic Data Found</h3>
                      <p className="text-gray-600 mb-6">Create your first economic valuation</p>
                      <Link
                        to="/analytics/economic-valuation"
                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                      >
                        <Plus className="w-4 h-4" />
                        Create Valuation
                      </Link>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                            Year
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                            Total Value
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                            GDP %
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                            Created
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredEconomic.map((econ) => (
                          <tr key={econ.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-medium text-gray-900">{econ.year}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-green-600">
                                LKR {(econ.totalValue / 1000000000).toFixed(2)}B
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-semibold">{econ.gdpContribution}%</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{econ.createdAt?.toLocaleDateString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => viewDetails(econ)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteEconomicRecord(econ.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Details Modal */}
        {showDetails && selectedItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Details</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-4 max-h-[60vh] overflow-y-auto">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(selectedItem, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SimulationsEconomicAdmin;
