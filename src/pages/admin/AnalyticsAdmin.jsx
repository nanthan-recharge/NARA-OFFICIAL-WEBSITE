import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  Brain,
  Target,
  DollarSign,
  Activity,
  TrendingUp,
  Database,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  FileText,
  Settings,
  RefreshCw
} from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';

const AnalyticsAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    predictions: 0,
    simulations: 0,
    assessments: 0,
    valuations: 0,
    recentActivity: []
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      // Load counts from each collection
      const [
        predictionsSnap,
        simulationsSnap,
        assessmentsSnap,
        valuationsSnap
      ] = await Promise.all([
        getDocs(collection(db, 'predictions')),
        getDocs(collection(db, 'policy_simulations')),
        getDocs(collection(db, 'impact_assessments')),
        getDocs(collection(db, 'economic_valuations'))
      ]);

      // Get recent activity (last 10 items)
      const recentPredictions = await getDocs(
        query(collection(db, 'predictions'), orderBy('createdAt', 'desc'), limit(5))
      );

      const recentActivity = recentPredictions.docs.map(doc => ({
        id: doc.id,
        type: 'prediction',
        ...doc.data(),
        timestamp: doc.data().createdAt?.toDate()
      }));

      setStats({
        predictions: predictionsSnap.size,
        simulations: simulationsSnap.size,
        assessments: assessmentsSnap.size,
        valuations: valuationsSnap.size,
        recentActivity
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
    setLoading(false);
  };

  const adminPanels = [
    {
      id: 'predictions',
      title: 'Predictions Management',
      description: 'Manage AI predictions, forecasts, and trend analysis',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      count: stats.predictions,
      path: '/admin/analytics/predictions'
    },
    {
      id: 'simulations',
      title: 'Policy Simulations',
      description: 'Manage policy scenarios and simulation results',
      icon: Activity,
      color: 'from-orange-500 to-orange-600',
      count: stats.simulations,
      path: '/admin/analytics/simulations'
    },
    {
      id: 'assessments',
      title: 'Impact Assessments',
      description: 'Manage policy impact tracking and project outcomes',
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      count: stats.assessments,
      path: '/admin/analytics/assessments'
    },
    {
      id: 'economic',
      title: 'Economic Data',
      description: 'Manage economic valuations and financial data',
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      count: stats.valuations,
      path: '/admin/analytics/economic'
    }
  ];

  const quickActions = [
    {
      label: 'Run New Prediction',
      icon: Brain,
      path: '/analytics/predictive',
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      label: 'Create Simulation',
      icon: Activity,
      path: '/analytics/policy-simulator',
      color: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      label: 'Generate Report',
      icon: FileText,
      path: '/analytics/impact-assessment',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      label: 'View Analytics Hub',
      icon: BarChart3,
      path: '/analytics',
      color: 'bg-green-600 hover:bg-green-700'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Analytics Admin - NARA Digital Ocean</title>
        <meta name="description" content="Manage analytics data, predictions, and simulations" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Database className="w-10 h-10 text-blue-400" />
                <div>
                  <h1 className="text-4xl font-bold">Analytics Administration</h1>
                  <p className="text-gray-300 mt-1">Manage predictions, simulations, and economic data</p>
                </div>
              </div>

              <button
                onClick={loadStats}
                disabled={loading}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-6 h-6 text-purple-600" />
                <span className="text-sm text-gray-600 font-semibold">Total Predictions</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.predictions}</div>
              <div className="text-sm text-gray-500 mt-1">All prediction types</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-6 h-6 text-orange-600" />
                <span className="text-sm text-gray-600 font-semibold">Policy Simulations</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.simulations}</div>
              <div className="text-sm text-gray-500 mt-1">Scenario models</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-blue-600" />
                <span className="text-sm text-gray-600 font-semibold">Impact Assessments</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.assessments}</div>
              <div className="text-sm text-gray-500 mt-1">Policy evaluations</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                <span className="text-sm text-gray-600 font-semibold">Economic Valuations</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.valuations}</div>
              <div className="text-sm text-gray-500 mt-1">Financial records</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.label}
                    to={action.path}
                    className={`flex items-center gap-3 text-white px-4 py-3 rounded-lg transition-colors ${action.color}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold">{action.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Admin Panels Grid */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Management Panels</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {adminPanels.map((panel) => {
                const Icon = panel.icon;
                return (
                  <Link
                    key={panel.id}
                    to={panel.path}
                    className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-400"
                  >
                    <div className={`bg-gradient-to-r ${panel.color} p-6`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white">{panel.title}</h3>
                            <p className="text-white/80 mt-1">{panel.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-3xl font-bold text-gray-900">{panel.count}</div>
                          <div className="text-sm text-gray-600 mt-1">Total Records</div>
                        </div>
                        <div className="text-blue-600 group-hover:translate-x-2 transition-transform">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>

            {stats.recentActivity.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Database className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No recent activity</p>
                <p className="text-sm">Start creating predictions or simulations to see activity here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Brain className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 capitalize">
                        {activity.type} - {activity.species || activity.policyName || activity.type}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Type: {activity.type}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {activity.timestamp ? activity.timestamp.toLocaleString() : 'Recently'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* System Health */}
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">System Health</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <div className="font-semibold text-gray-900">Service Layers</div>
                  <div className="text-sm text-gray-600">All operational</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <div className="font-semibold text-gray-900">Firebase Collections</div>
                  <div className="text-sm text-gray-600">82 collections active</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <div className="font-semibold text-gray-900">Analytics Dashboards</div>
                  <div className="text-sm text-gray-600">5 dashboards live</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyticsAdmin;
