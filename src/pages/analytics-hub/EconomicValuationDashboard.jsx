import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  Users,
  Ship,
  Fish,
  Anchor,
  Waves,
  Building,
  ArrowLeft,
  Download,
  RefreshCw,
  PieChart as PieChartIcon,
  BarChart3,
  Globe
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  blueEconomyCalculatorService,
  tourismRevenueTrackerService,
  fisheriesValueAssessmentService,
  employmentImpactAnalyzerService,
  investmentReturnModelerService
} from '../../services/economicValuationService';

const EconomicValuationDashboard = () => {
  const [activeTab, setActiveTab] = useState('blue-economy');
  const [loading, setLoading] = useState(false);
  const [blueEconomyData, setBlueEconomyData] = useState(null);
  const [tourismData, setTourismData] = useState(null);
  const [fisheriesData, setFisheriesData] = useState(null);
  const [employmentData, setEmploymentData] = useState(null);
  const [investmentData, setInvestmentData] = useState(null);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  useEffect(() => {
    if (activeTab === 'blue-economy') {
      loadBlueEconomy();
    } else if (activeTab === 'tourism') {
      loadTourism();
    } else if (activeTab === 'fisheries') {
      loadFisheries();
    } else if (activeTab === 'employment') {
      loadEmployment();
    } else if (activeTab === 'investment') {
      loadInvestment();
    }
  }, [activeTab]);

  const loadBlueEconomy = async () => {
    setLoading(true);

    const economicData = {
      fisheries: { directRevenue: 25000000000 }, // 25B
      tourism: { directRevenue: 18000000000 }, // 18B
      shipping: { directRevenue: 15000000000 }, // 15B
      aquaculture: { directRevenue: 8000000000 }, // 8B
      research: { directRevenue: 2000000000 }, // 2B
      conservation: {
        directRevenue: 1000000000, // 1B
        carbonValue: 500000000,
        biodiversityValue: 300000000,
        coastalProtectionValue: 200000000
      }
    };

    const { data } = await blueEconomyCalculatorService.calculate(economicData, 2024);

    if (data) {
      // Create sector breakdown chart
      const sectorData = [
        { name: 'Fisheries', value: economicData.fisheries.directRevenue, percentage: 36 },
        { name: 'Tourism', value: economicData.tourism.directRevenue, percentage: 26 },
        { name: 'Shipping', value: economicData.shipping.directRevenue, percentage: 22 },
        { name: 'Aquaculture', value: economicData.aquaculture.directRevenue, percentage: 12 },
        { name: 'Research', value: economicData.research.directRevenue, percentage: 3 },
        { name: 'Conservation', value: economicData.conservation.directRevenue, percentage: 1 }
      ];

      setBlueEconomyData({ ...data, sectorData });
    }
    setLoading(false);
  };

  const loadTourism = async () => {
    setLoading(true);

    const revenueData = {
      diving: 5000000000,
      surfing: 3000000000,
      whale_watching: 2500000000,
      beach_tourism: 4500000000,
      ecotourism: 3000000000
    };

    const { data } = await tourismRevenueTrackerService.trackRevenue(revenueData, 2024);

    if (data) {
      // Create category breakdown
      const categoryData = Object.entries(revenueData).map(([key, value]) => ({
        name: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value,
        percentage: ((value / data.totalRevenue) * 100).toFixed(1)
      }));

      setTourismData({ ...data, categoryData });
    }
    setLoading(false);
  };

  const loadFisheries = async () => {
    setLoading(true);

    const catchData = {
      yellowfin_tuna: { volume: 50000, pricePerKg: 800 },
      skipjack_tuna: { volume: 80000, pricePerKg: 450 },
      prawns: { volume: 20000, pricePerKg: 1200 },
      lobster: { volume: 5000, pricePerKg: 2500 }
    };

    const { data } = await fisheriesValueAssessmentService.assessValue(catchData, {
      totalFishers: 50000,
      processingValue: 5000000000
    });

    if (data) {
      // Create species breakdown
      const speciesData = Object.entries(catchData).map(([key, info]) => ({
        name: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        volume: info.volume,
        value: info.volume * info.pricePerKg,
        price: info.pricePerKg
      }));

      setFisheriesData({ ...data, speciesData });
    }
    setLoading(false);
  };

  const loadEmployment = async () => {
    setLoading(true);

    const jobData = {
      fishermen: { direct: 45000, avgWage: 35000 },
      aquaculture: { direct: 8000, avgWage: 30000 },
      tourism: { direct: 25000, avgWage: 40000 },
      shipping: { direct: 15000, avgWage: 50000 },
      research: { direct: 3000, avgWage: 75000 }
    };

    const { data } = await employmentImpactAnalyzerService.analyzeEmployment(jobData);

    if (data) {
      // Create sector employment chart
      const sectorData = Object.entries(jobData).map(([key, info]) => ({
        sector: key.replace(/\b\w/g, l => l.toUpperCase()),
        direct: info.direct,
        indirect: Math.round(info.direct * 1.8),
        wage: info.avgWage
      }));

      setEmploymentData({ ...data, sectorData });
    }
    setLoading(false);
  };

  const loadInvestment = async () => {
    setLoading(true);

    const { data } = await investmentReturnModelerService.modelReturns(
      'Coastal Infrastructure Development',
      50000000000, // 50B investment
      { years: 10, growthRate: 8.5, riskFreeRate: 5 }
    );

    if (data) {
      setInvestmentData(data);
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'blue-economy', name: 'Blue Economy Overview', icon: Globe },
    { id: 'tourism', name: 'Tourism Revenue', icon: Waves },
    { id: 'fisheries', name: 'Fisheries Value', icon: Fish },
    { id: 'employment', name: 'Employment Impact', icon: Users },
    { id: 'investment', name: 'Investment Returns', icon: TrendingUp }
  ];

  const exportData = () => {
    const dataToExport = {
      blueEconomy: blueEconomyData,
      tourism: tourismData,
      fisheries: fisheriesData,
      employment: employmentData,
      investment: investmentData
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `economic-valuation-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <>
      <Helmet>
        <title>Economic Valuation Dashboard - NARA Digital Ocean</title>
        <meta name="description" content="Calculate blue economy contributions and investment returns" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/analytics"
              className="inline-flex items-center gap-2 text-green-200 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Analytics Hub
            </Link>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DollarSign className="w-10 h-10 text-green-300" />
                <div>
                  <h1 className="text-4xl font-bold">Economic Valuation</h1>
                  <p className="text-green-200 mt-1">Blue economy GDP contribution and financial analysis</p>
                </div>
              </div>

              <button
                onClick={exportData}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>
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
                        ? 'bg-green-600 text-white shadow-md'
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
              <RefreshCw className="w-8 h-8 text-green-600 animate-spin" />
              <span className="ml-3 text-gray-600">Loading economic data...</span>
            </div>
          )}

          {/* Blue Economy Overview */}
          {!loading && activeTab === 'blue-economy' && blueEconomyData && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="w-6 h-6 text-green-600" />
                    <span className="text-sm text-gray-600">GDP Contribution</span>
                  </div>
                  <div className="text-3xl font-bold text-green-600">{blueEconomyData.gdpContribution}%</div>
                  <div className="text-sm text-gray-500 mt-1">of National GDP</div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                    <span className="text-sm text-gray-600">Total Value</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    LKR {(blueEconomyData.totalValue / 1000000000).toFixed(1)}B
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                    <span className="text-sm text-gray-600">Direct Value</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    LKR {(blueEconomyData.directValue / 1000000000).toFixed(1)}B
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Waves className="w-6 h-6 text-cyan-600" />
                    <span className="text-sm text-gray-600">Ecosystem Value</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    LKR {(blueEconomyData.ecosystemValue / 1000000000).toFixed(1)}B
                  </div>
                </div>
              </div>

              {/* Sector Breakdown Pie Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Sector Distribution</h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={blueEconomyData.sectorData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({name, percentage}) => `${name}: ${percentage}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {blueEconomyData.sectorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `LKR ${(value / 1000000000).toFixed(2)}B`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Sector Values</h3>
                  <div className="space-y-4">
                    {blueEconomyData.sectorData.map((sector, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span className="font-semibold text-gray-900">{sector.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">
                            LKR {(sector.value / 1000000000).toFixed(1)}B
                          </div>
                          <div className="text-sm text-gray-600">{sector.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sector Breakdown Details */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Economic Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(blueEconomyData.sectorBreakdown).map(([key, value]) => (
                    <div key={key} className="border-l-4 border-green-500 pl-4">
                      <div className="text-sm text-gray-600 capitalize mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        LKR {(value / 1000000000).toFixed(2)}B
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tourism Revenue */}
          {!loading && activeTab === 'tourism' && tourismData && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Waves className="w-6 h-6 text-blue-600" />
                    <span className="text-sm text-gray-600">Total Revenue</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    LKR {(tourismData.totalRevenue / 1000000000).toFixed(1)}B
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                    <span className="text-sm text-gray-600">Growth Rate</span>
                  </div>
                  <div className="text-3xl font-bold text-green-600">{tourismData.growthRate}%</div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                    <span className="text-sm text-gray-600">Categories</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{tourismData.categoryData.length}</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Revenue by Category</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={tourismData.categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `LKR ${(value / 1000000000).toFixed(2)}B`} />
                    <Legend />
                    <Bar dataKey="value" fill="#10b981" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Projections */}
              {tourismData.projections && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Revenue Projections</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={tourismData.projections}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="projected" stroke="#10b981" strokeWidth={2} name="Projected Revenue" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* Fisheries Value */}
          {!loading && activeTab === 'fisheries' && fisheriesData && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Fish className="w-6 h-6 text-blue-600" />
                    <span className="text-sm text-gray-600">Total Catch Value</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    LKR {(fisheriesData.totalCatchValue / 1000000000).toFixed(1)}B
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Building className="w-6 h-6 text-purple-600" />
                    <span className="text-sm text-gray-600">Economic Value</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    LKR {(fisheriesData.economicValue / 1000000000).toFixed(1)}B
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-6 h-6 text-green-600" />
                    <span className="text-sm text-gray-600">Per Fisher</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    LKR {(fisheriesData.valuePerFisher / 1000).toFixed(0)}K
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Anchor className="w-6 h-6 text-cyan-600" />
                    <span className="text-sm text-gray-600">Sustainability</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{fisheriesData.sustainabilityIndex}</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Value by Species</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={fisheriesData.speciesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="volume" fill="#3b82f6" name="Volume (tonnes)" />
                    <Bar yAxisId="right" dataKey="value" fill="#10b981" name="Value (LKR)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Employment Impact */}
          {!loading && activeTab === 'employment' && employmentData && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-6 h-6 text-blue-600" />
                    <span className="text-sm text-gray-600">Direct Jobs</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{employmentData.directJobs.toLocaleString()}</div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-6 h-6 text-green-600" />
                    <span className="text-sm text-gray-600">Total Jobs</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{employmentData.totalJobs.toLocaleString()}</div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                    <span className="text-sm text-gray-600">Wage Impact</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    LKR {(employmentData.wageImpact / 1000000000).toFixed(1)}B
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                    <span className="text-sm text-gray-600">Multiplier</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{employmentData.multiplier}x</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Employment by Sector</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={employmentData.sectorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sector" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="direct" fill="#3b82f6" name="Direct Jobs" />
                    <Bar dataKey="indirect" fill="#10b981" name="Indirect Jobs" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Sector Details</h3>
                <div className="space-y-3">
                  {employmentData.sectorData.map((sector, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-gray-900">{sector.sector}</span>
                        <span className="text-sm text-gray-600">Avg Wage: LKR {sector.wage.toLocaleString()}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Direct: </span>
                          <span className="font-semibold">{sector.direct.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Indirect: </span>
                          <span className="font-semibold">{sector.indirect.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Total: </span>
                          <span className="font-semibold">{(sector.direct + sector.indirect).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Investment Returns */}
          {!loading && activeTab === 'investment' && investmentData && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    <span className="text-sm text-gray-600">Investment</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    LKR {(investmentData.investment / 1000000000).toFixed(1)}B
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                    <span className="text-sm text-gray-600">Total Returns</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    LKR {(investmentData.totalReturns / 1000000000).toFixed(1)}B
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                    <span className="text-sm text-gray-600">Sharpe Ratio</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{investmentData.sharpeRatio}</div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <PieChartIcon className="w-6 h-6 text-orange-600" />
                    <span className="text-sm text-gray-600">Break-Even</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">Year {investmentData.breakEvenYear}</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">10-Year Return Projections</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={investmentData.yearlyReturns}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value) => `LKR ${(value / 1000000000).toFixed(2)}B`} />
                    <Legend />
                    <Area type="monotone" dataKey="cumulative" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Cumulative Returns" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Investment Recommendation</h3>
                <div className={`p-6 rounded-lg ${
                  investmentData.recommendation === 'strongly_recommended' ? 'bg-green-50 border-2 border-green-500' :
                  investmentData.recommendation === 'recommended' ? 'bg-blue-50 border-2 border-blue-500' :
                  'bg-yellow-50 border-2 border-yellow-500'
                }`}>
                  <div className="text-2xl font-bold text-gray-900 mb-2 capitalize">
                    {investmentData.recommendation.replace('_', ' ')}
                  </div>
                  <p className="text-gray-700">
                    {investmentData.recommendation === 'strongly_recommended'
                      ? 'This investment shows excellent risk-adjusted returns with strong growth potential.'
                      : investmentData.recommendation === 'recommended'
                      ? 'This investment demonstrates solid returns with acceptable risk levels.'
                      : 'This investment requires careful consideration of risk factors.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EconomicValuationDashboard;
