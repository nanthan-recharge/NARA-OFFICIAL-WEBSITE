import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  Brain,
  Fish,
  Cloud,
  TrendingUp,
  AlertTriangle,
  Calendar,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  Search,
  Filter,
  Eye
} from 'lucide-react';
import { collection, getDocs, doc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../firebase';

const PredictionsAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState([]);
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadPredictions();
  }, []);

  useEffect(() => {
    filterPredictions();
  }, [predictions, filterType, searchTerm]);

  const loadPredictions = async () => {
    setLoading(true);
    try {
      const predictionsSnap = await getDocs(
        query(collection(db, 'predictions'), orderBy('createdAt', 'desc'))
      );

      const predictionsData = predictionsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));

      setPredictions(predictionsData);
    } catch (error) {
      console.error('Error loading predictions:', error);
    }
    setLoading(false);
  };

  const filterPredictions = () => {
    let filtered = [...predictions];

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(p => p.type === filterType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p =>
        (p.species?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.predictionId?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.type?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPredictions(filtered);
  };

  const deletePrediction = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prediction?')) return;

    try {
      await deleteDoc(doc(db, 'predictions', id));
      setPredictions(predictions.filter(p => p.id !== id));
      alert('Prediction deleted successfully');
    } catch (error) {
      console.error('Error deleting prediction:', error);
      alert('Failed to delete prediction');
    }
  };

  const viewDetails = (prediction) => {
    setSelectedPrediction(prediction);
    setShowDetails(true);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(filteredPredictions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `predictions-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const predictionTypes = [
    { value: 'all', label: 'All Types', icon: Brain },
    { value: 'fish_stock', label: 'Fish Stock', icon: Fish },
    { value: 'climate_impact', label: 'Climate Impact', icon: Cloud },
    { value: 'trend_analysis', label: 'Trend Analysis', icon: TrendingUp },
    { value: 'anomaly_detection', label: 'Anomaly Detection', icon: AlertTriangle },
    { value: 'seasonal_pattern', label: 'Seasonal Pattern', icon: Calendar }
  ];

  const getTypeColor = (type) => {
    const colors = {
      fish_stock: 'bg-blue-100 text-blue-800',
      climate_impact: 'bg-green-100 text-green-800',
      trend_analysis: 'bg-purple-100 text-purple-800',
      anomaly_detection: 'bg-red-100 text-red-800',
      seasonal_pattern: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type) => {
    const icons = {
      fish_stock: Fish,
      climate_impact: Cloud,
      trend_analysis: TrendingUp,
      anomaly_detection: AlertTriangle,
      seasonal_pattern: Calendar
    };
    const Icon = icons[type] || Brain;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <>
      <Helmet>
        <title>Predictions Management - Analytics Admin</title>
        <meta name="description" content="Manage AI predictions and forecasts" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 text-white py-8">
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
                <Brain className="w-10 h-10 text-purple-300" />
                <div>
                  <h1 className="text-4xl font-bold">Predictions Management</h1>
                  <p className="text-purple-200 mt-1">Manage AI predictions and forecasting data</p>
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
                  onClick={loadPredictions}
                  disabled={loading}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>

                <Link
                  to="/analytics/predictive"
                  className="flex items-center gap-2 bg-white hover:bg-gray-100 text-purple-900 px-4 py-2 rounded-lg transition-colors font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  New Prediction
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
            {predictionTypes.map((type) => {
              const Icon = type.icon;
              const count = type.value === 'all'
                ? predictions.length
                : predictions.filter(p => p.type === type.value).length;

              return (
                <button
                  key={type.value}
                  onClick={() => setFilterType(type.value)}
                  className={`p-4 rounded-xl shadow-lg transition-all ${
                    filterType === type.value
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${
                    filterType === type.value ? 'text-white' : 'text-purple-600'
                  }`} />
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-xs mt-1">{type.label}</div>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search predictions by species, ID, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="w-4 h-4" />
                <span>{filteredPredictions.length} results</span>
              </div>
            </div>
          </div>

          {/* Predictions Table */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 text-purple-600 animate-spin" />
              <span className="ml-3 text-gray-600">Loading predictions...</span>
            </div>
          ) : filteredPredictions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Predictions Found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterType !== 'all'
                  ? 'Try adjusting your filters or search terms'
                  : 'Create your first prediction to get started'}
              </p>
              <Link
                to="/analytics/predictive"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
              >
                <Plus className="w-4 h-4" />
                Create First Prediction
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Species/Subject
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Trend
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPredictions.map((prediction) => (
                    <tr key={prediction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(prediction.type)}`}>
                          {getTypeIcon(prediction.type)}
                          {prediction.type?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {prediction.species || prediction.subject || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 font-mono">
                          {prediction.predictionId}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {prediction.trendDirection === 'increasing' ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : prediction.trendDirection === 'decreasing' ? (
                            <TrendingUp className="w-4 h-4 text-red-600 transform rotate-180" />
                          ) : (
                            <div className="w-4 h-4" />
                          )}
                          <span className="text-sm capitalize">{prediction.trendDirection || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {prediction.createdAt?.toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {prediction.createdAt?.toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => viewDetails(prediction)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deletePrediction(prediction.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showDetails && selectedPrediction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Prediction Details</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Prediction ID</label>
                  <div className="mt-1 font-mono text-sm text-gray-900">{selectedPrediction.predictionId}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Type</label>
                    <div className="mt-1 capitalize">{selectedPrediction.type?.replace('_', ' ')}</div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Created</label>
                    <div className="mt-1">{selectedPrediction.createdAt?.toLocaleString()}</div>
                  </div>
                </div>

                {selectedPrediction.species && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Species</label>
                    <div className="mt-1">{selectedPrediction.species}</div>
                  </div>
                )}

                {selectedPrediction.forecast && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Forecast Data</label>
                    <div className="mt-2 bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify(selectedPrediction.forecast, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {selectedPrediction.recommendations && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Recommendations</label>
                    <ul className="mt-2 space-y-2">
                      {selectedPrediction.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <span className="text-purple-600 font-bold">{index + 1}.</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PredictionsAdmin;
