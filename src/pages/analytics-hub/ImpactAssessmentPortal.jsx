import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  Target,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Download,
  RefreshCw,
  BarChart3,
  FileText,
  Award,
  AlertCircle
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  policyImpactTrackingService,
  projectOutcomeMeasurementService,
  roiCalculationService,
  metricsAggregationService,
  reportGenerationService
} from '../../services/impactAssessmentService';

const ImpactAssessmentPortal = () => {
  const [activeTab, setActiveTab] = useState('policy-impact');
  const [loading, setLoading] = useState(false);
  const [policyData, setPolicyData] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [roiData, setRoiData] = useState(null);
  const [metricsData, setMetricsData] = useState(null);

  useEffect(() => {
    loadMetrics();
  }, []);

  useEffect(() => {
    if (activeTab === 'policy-impact') {
      loadPolicyImpact();
    } else if (activeTab === 'project-outcomes') {
      loadProjectOutcomes();
    } else if (activeTab === 'roi-analysis') {
      loadROIAnalysis();
    }
  }, [activeTab]);

  const loadMetrics = async () => {
    const { data } = await metricsAggregationService.aggregateAll();
    if (data) {
      setMetricsData(data);
    }
  };

  const loadPolicyImpact = async () => {
    setLoading(true);

    // Sample policy data
    const baseline = {
      fishStockHealth: 65,
      economicGrowth: 3.2,
      employmentRate: 72,
      environmentalScore: 70
    };

    const current = {
      fishStockHealth: 78,
      economicGrowth: 4.8,
      employmentRate: 76,
      environmentalScore: 82
    };

    const { data } = await policyImpactTrackingService.trackImpact(
      'Marine Conservation Policy 2024',
      'marine_conservation',
      baseline,
      current
    );

    if (data) {
      // Create comparison chart data
      const chartData = Object.keys(baseline).map(key => ({
        metric: key.replace(/([A-Z])/g, ' $1').trim(),
        baseline: baseline[key],
        current: current[key],
        change: ((current[key] - baseline[key]) / baseline[key] * 100).toFixed(1)
      }));
      setPolicyData({ ...data, chartData });
    }
    setLoading(false);
  };

  const loadProjectOutcomes = async () => {
    setLoading(true);

    const outcomes = [
      { metric: 'Fish Stock Recovery', value: 85, target: 80 },
      { metric: 'Coral Reef Health', value: 72, target: 75 },
      { metric: 'Water Quality', value: 90, target: 85 },
      { metric: 'Community Engagement', value: 95, target: 90 },
      { metric: 'Economic Impact', value: 88, target: 85 }
    ];

    const { data } = await projectOutcomeMeasurementService.measureOutcome(
      'Coastal Restoration Project',
      outcomes
    );

    if (data) {
      const chartData = outcomes.map(o => ({
        ...o,
        achievement: ((o.value / o.target) * 100).toFixed(1)
      }));
      setProjectData({ ...data, chartData });
    }
    setLoading(false);
  };

  const loadROIAnalysis = async () => {
    setLoading(true);

    const { data } = await roiCalculationService.calculate(
      'Marine Research Investment',
      15000000, // 15M investment
      18500000  // 18.5M returns
    );

    if (data) {
      // Create monthly ROI trend data
      const monthlyData = Array.from({ length: 12 }, (_, i) => ({
        month: `Month ${i + 1}`,
        roi: ((data.roi / 12) * (i + 1)).toFixed(2),
        cumulative: ((data.netReturn / 12) * (i + 1)).toFixed(0)
      }));
      setRoiData({ ...data, monthlyData });
    }
    setLoading(false);
  };

  const generateReport = async () => {
    setLoading(true);
    const { data, error } = await reportGenerationService.generateImpactReport({
      policyData,
      projectData,
      roiData,
      metricsData
    });

    if (data) {
      // Download CSV
      const blob = new Blob([data.csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `impact-assessment-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'policy-impact', name: 'Policy Impact', icon: Target },
    { id: 'project-outcomes', name: 'Project Outcomes', icon: CheckCircle },
    { id: 'roi-analysis', name: 'ROI Analysis', icon: DollarSign },
    { id: 'overview', name: 'Overview', icon: BarChart3 }
  ];

  const getImpactColor = (score) => {
    if (score > 20) return 'text-green-600 bg-green-100';
    if (score > 0) return 'text-blue-600 bg-blue-100';
    if (score === 0) return 'text-gray-600 bg-gray-100';
    return 'text-red-600 bg-red-100';
  };

  const getSuccessColor = (rate) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 70) return 'text-blue-600';
    if (rate >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <>
      <Helmet>
        <title>Impact Assessment Portal - NARA Digital Ocean</title>
        <meta name="description" content="Measure policy effectiveness and project outcomes with data-driven insights" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/analytics"
              className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Analytics Hub
            </Link>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-10 h-10 text-blue-300" />
                <div>
                  <h1 className="text-4xl font-bold">Impact Assessment Portal</h1>
                  <p className="text-blue-200 mt-1">Evidence-based policy and project evaluation</p>
                </div>
              </div>

              <button
                onClick={generateReport}
                disabled={loading}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Generate Report
              </button>
            </div>

            {/* Quick Metrics */}
            {metricsData && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-sm text-blue-200 mb-1">Avg Policy Score</div>
                  <div className="text-3xl font-bold">{metricsData.policyImpact.avgScore}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-sm text-blue-200 mb-1">Project Success</div>
                  <div className="text-3xl font-bold">{metricsData.projectOutcomes.avgSuccessScore}%</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-sm text-blue-200 mb-1">Average ROI</div>
                  <div className="text-3xl font-bold">{metricsData.roi.avgROI}%</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-sm text-blue-200 mb-1">Health Score</div>
                  <div className="text-3xl font-bold">{metricsData.overall.healthScore}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-lg p-2 mb-8">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-3 text-gray-600">Loading assessment data...</span>
            </div>
          )}

          {/* Policy Impact */}
          {!loading && activeTab === 'policy-impact' && policyData && (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{policyData.policyName}</h3>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getImpactColor(parseFloat(policyData.impactScore))}`}>
                    {policyData.effectiveness}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Impact Score</div>
                    <div className="text-3xl font-bold text-gray-900">{policyData.impactScore}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Policy Type</div>
                    <div className="text-xl font-semibold text-gray-900 capitalize">
                      {policyData.policyType.replace('_', ' ')}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Assessment Date</div>
                    <div className="text-xl font-semibold text-gray-900">
                      {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Before/After Comparison Chart */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Metric Comparison: Baseline vs Current</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={policyData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="baseline" fill="#94a3b8" name="Baseline" />
                    <Bar dataKey="current" fill="#3b82f6" name="Current" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Metric Changes */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Detailed Metric Changes</h3>
                <div className="space-y-4">
                  {Object.entries(policyData.metricChanges).map(([key, value]) => (
                    <div key={key} className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        {value.direction === 'improved' ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : value.direction === 'declined' ? (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Baseline: </span>
                          <span className="font-semibold">{value.baseline}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Current: </span>
                          <span className="font-semibold">{value.current}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Change: </span>
                          <span className={`font-semibold ${
                            parseFloat(value.change) > 0 ? 'text-green-600' :
                            parseFloat(value.change) < 0 ? 'text-red-600' :
                            'text-gray-600'
                          }`}>
                            {value.change > 0 ? '+' : ''}{value.change}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analysis */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Impact Analysis</h3>
                <p className="text-gray-700 leading-relaxed">{policyData.analysis}</p>
              </div>
            </div>
          )}

          {/* Project Outcomes */}
          {!loading && activeTab === 'project-outcomes' && projectData && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="w-6 h-6 text-blue-600" />
                    <span className="text-sm text-gray-600">Success Score</span>
                  </div>
                  <div className={`text-3xl font-bold ${getSuccessColor(projectData.successScore)}`}>
                    {projectData.successScore}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-sm text-gray-600">Success Rate</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{projectData.successRate}%</div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-6 h-6 text-purple-600" />
                    <span className="text-sm text-gray-600">Targets Met</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{projectData.targetsMet}/{projectData.totalTargets}</div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                    <span className="text-sm text-gray-600">Performance</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 capitalize">{projectData.performance}</div>
                </div>
              </div>

              {/* Outcomes Chart */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Target Achievement Analysis</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={projectData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="target" fill="#94a3b8" name="Target" />
                    <Bar dataKey="value" fill="#3b82f6" name="Achieved" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Radar Chart */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Radar</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={projectData.chartData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Target" dataKey="target" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.3} />
                    <Radar name="Achieved" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ROI Analysis */}
          {!loading && activeTab === 'roi-analysis' && roiData && (
            <div className="space-y-6">
              {/* ROI Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    <span className="text-sm text-gray-600">ROI</span>
                  </div>
                  <div className="text-3xl font-bold text-green-600">{roiData.roi.toFixed(2)}%</div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                    <span className="text-sm text-gray-600">Net Return</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    LKR {(roiData.netReturn / 1000000).toFixed(1)}M
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-6 h-6 text-purple-600" />
                    <span className="text-sm text-gray-600">Investment</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    LKR {(roiData.investment / 1000000).toFixed(1)}M
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-6 h-6 text-orange-600" />
                    <span className="text-sm text-gray-600">Payback Period</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{roiData.paybackPeriod} months</div>
                </div>
              </div>

              {/* ROI Trend */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">ROI Growth Over Time</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={roiData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="roi" stroke="#10b981" strokeWidth={2} name="ROI %" />
                    <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#3b82f6" strokeWidth={2} name="Cumulative Return (LKR)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Financial Details */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Financial Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Initial Investment</span>
                      <span className="font-bold text-gray-900">LKR {roiData.investment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Total Returns</span>
                      <span className="font-bold text-gray-900">LKR {roiData.returns.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                      <span className="text-gray-700">Net Profit</span>
                      <span className="font-bold text-green-600">LKR {roiData.netReturn.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">ROI Percentage</span>
                      <span className="font-bold text-green-600">{roiData.roi.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Payback Period</span>
                      <span className="font-bold text-gray-900">{roiData.paybackPeriod} months</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                      <span className="text-gray-700">Project Name</span>
                      <span className="font-bold text-gray-900">{roiData.projectName}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Overview */}
          {!loading && activeTab === 'overview' && metricsData && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Platform-Wide Impact Metrics</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {metricsData.overall.healthScore}
                    </div>
                    <div className="text-gray-700 font-semibold">Overall Health Score</div>
                    <div className="text-sm text-gray-600 mt-1">Excellent Performance</div>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {metricsData.policyImpact.totalPolicies}
                    </div>
                    <div className="text-gray-700 font-semibold">Policies Tracked</div>
                    <div className="text-sm text-gray-600 mt-1">Avg Score: {metricsData.policyImpact.avgScore}</div>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {metricsData.projectOutcomes.totalProjects}
                    </div>
                    <div className="text-gray-700 font-semibold">Projects Measured</div>
                    <div className="text-sm text-gray-600 mt-1">Success: {metricsData.projectOutcomes.avgSuccessScore}%</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h4 className="font-bold text-gray-900 mb-3">Policy Impact</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Score:</span>
                        <span className="font-semibold">{metricsData.policyImpact.avgScore}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Highly Effective:</span>
                        <span className="font-semibold">{metricsData.policyImpact.highlyEffective}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Effective:</span>
                        <span className="font-semibold">{metricsData.policyImpact.effective}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-4 border-green-500 pl-6">
                    <h4 className="font-bold text-gray-900 mb-3">Financial Performance</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average ROI:</span>
                        <span className="font-semibold text-green-600">{metricsData.roi.avgROI}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Investment:</span>
                        <span className="font-semibold">LKR {(metricsData.roi.totalInvestment / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Net Value:</span>
                        <span className="font-semibold text-green-600">LKR {(metricsData.roi.netValue / 1000000).toFixed(1)}M</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ImpactAssessmentPortal;
