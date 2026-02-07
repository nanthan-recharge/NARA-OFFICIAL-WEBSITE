import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { db } from '../../firebase';
import { collection, doc, setDoc, getDoc, updateDoc, getDocs } from 'firebase/firestore';

const MaritimeDataAdmin = () => {
  const [activeTab, setActiveTab] = useState('api-config');
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState({});
  const [saveStatus, setSaveStatus] = useState('');

  // API Configuration State
  const [apiConfig, setApiConfig] = useState({
    stormglassKey: '',
    weatherApiKey: '',
    openWeatherKey: '',
    copernicusUsername: '',
    copernicusPassword: '',
    nasaToken: '',
    marineTrafficKey: ''
  });

  // IOC Stations Configuration
  const [iocStations, setIocStations] = useState([
    {
      id: 'colombo',
      code: 'colo',
      name: 'Colombo',
      coordinates: { lat: 6.9271, lng: 79.8612 },
      region: 'Western Province',
      active: true,
      apiEndpoint: 'https://www.ioc-sealevelmonitoring.org/service.php?query=data&code=colo&format=json'
    },
    {
      id: 'trincomalee',
      code: 'trin',
      name: 'Trincomalee',
      coordinates: { lat: 8.5874, lng: 81.2152 },
      region: 'Eastern Province',
      active: true,
      apiEndpoint: 'https://www.ioc-sealevelmonitoring.org/service.php?query=data&code=trin&format=json'
    }
  ]);

  // Charts Data
  const [chartsData, setChartsData] = useState([
    {
      id: 'chart-001',
      chartNumber: 'SL-101',
      title: 'Colombo Harbour Approaches',
      scale: '1:50,000',
      category: 'harbour',
      format: 'digital',
      price: 8500,
      edition: 'Edition 7',
      year: 2024,
      coverage: 'Western Province · Colombo Port to Kalutara',
      status: 'available',
      stock: 50
    }
  ]);

  // Maritime Services
  const [servicesData, setServicesData] = useState([
    {
      id: 'service-001',
      name: 'Hydrographic Survey',
      icon: 'Ship',
      description: 'Professional bathymetric surveys and seafloor mapping',
      price: 500000,
      duration: '2-4 weeks',
      status: 'Available',
      features: ['Multibeam sonar', 'GPS positioning', 'Report generation']
    }
  ]);

  // Load saved configuration from Firebase
  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      setLoading(true);

      // Load API config
      const apiDoc = await getDoc(doc(db, 'maritime_config', 'api_keys'));
      if (apiDoc.exists()) {
        setApiConfig(apiDoc.data());
      }

      // Load IOC stations
      const stationsDoc = await getDoc(doc(db, 'maritime_config', 'ioc_stations'));
      if (stationsDoc.exists()) {
        setIocStations(stationsDoc.data().stations || []);
      }

      // Load charts
      const chartsSnapshot = await getDocs(collection(db, 'nautical_charts'));
      if (!chartsSnapshot.empty) {
        const charts = chartsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setChartsData(charts);
      }

      // Load services
      const servicesSnapshot = await getDocs(collection(db, 'maritime_services'));
      if (!servicesSnapshot.empty) {
        const services = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServicesData(services);
      }

    } catch (error) {
      console.error('Error loading configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save API Configuration
  const saveApiConfig = async () => {
    try {
      setLoading(true);
      await setDoc(doc(db, 'maritime_config', 'api_keys'), apiConfig);
      setSaveStatus('API keys saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error saving API config:', error);
      setSaveStatus('Error saving API keys');
    } finally {
      setLoading(false);
    }
  };

  // Test API Connection
  const testApiConnection = async (apiType) => {
    setLoading(true);
    setTestResults({ ...testResults, [apiType]: 'testing' });

    try {
      let response;
      let testUrl;

      switch (apiType) {
        case 'ioc':
          response = await fetch('https://www.ioc-sealevelmonitoring.org/service.php?query=data&code=colo&format=json');
          break;

        case 'stormglass':
          if (!apiConfig.stormglassKey) {
            throw new Error('API key not configured');
          }
          response = await fetch(
            `https://api.stormglass.io/v2/weather/point?lat=6.9271&lng=79.8612&params=waveHeight`,
            { headers: { Authorization: apiConfig.stormglassKey } }
          );
          break;

        case 'weatherapi':
          if (!apiConfig.weatherApiKey) {
            throw new Error('API key not configured');
          }
          response = await fetch(
            `https://api.weatherapi.com/v1/marine.json?key=${apiConfig.weatherApiKey}&q=6.9271,79.8612`
          );
          break;

        case 'openweather':
          if (!apiConfig.openWeatherKey) {
            throw new Error('API key not configured');
          }
          // Test OpenWeather with Colombo coordinates
          response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=6.9271&lon=79.8612&appid=${apiConfig.openWeatherKey}&units=metric`
          );
          break;

        case 'noaa':
          response = await fetch(
            'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=water_level&application=test&format=json&station=1612340&datum=MLLW&time_zone=gmt&units=metric'
          );
          break;

        case 'nasa':
          if (!apiConfig.nasaToken) {
            throw new Error('NASA token not configured');
          }
          // Test NASA Ocean Color API with the token
          testUrl = 'https://oceandata.sci.gsfc.nasa.gov/api/file_search?sensor=MODISA&dtype=L3b&addurl=1&results_as_file=1&search=*2024*';
          response = await fetch(testUrl, {
            headers: {
              'Authorization': `Bearer ${apiConfig.nasaToken}`
            }
          });
          break;

        case 'copernicus':
          if (!apiConfig.copernicusUsername || !apiConfig.copernicusPassword) {
            throw new Error('Copernicus credentials not configured');
          }
          // Test Copernicus authentication
          const authString = btoa(`${apiConfig.copernicusUsername}:${apiConfig.copernicusPassword}`);
          response = await fetch('https://my.cmems-du.eu/cas/login', {
            method: 'GET',
            headers: {
              'Authorization': `Basic ${authString}`
            }
          });
          break;
      }

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        let data;

        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }

        setTestResults({ ...testResults, [apiType]: 'success' });
        console.log(`✅ ${apiType.toUpperCase()} test successful:`, data);
        alert(`✅ ${apiType.toUpperCase()} API Connection Successful!\n\nToken/Key is valid and working.`);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`❌ ${apiType} test failed:`, error);
      setTestResults({ ...testResults, [apiType]: 'failed' });
      alert(`❌ ${apiType.toUpperCase()} API Connection Failed!\n\nError: ${error.message}\n\nPlease check:\n1. API key/token is correct\n2. Account is active\n3. API subscription is valid`);
    } finally {
      setLoading(false);
    }
  };

  // Save IOC Stations Configuration
  const saveStationsConfig = async () => {
    try {
      setLoading(true);
      await setDoc(doc(db, 'maritime_config', 'ioc_stations'), {
        stations: iocStations,
        updatedAt: new Date().toISOString()
      });
      setSaveStatus('Stations configuration saved!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error saving stations:', error);
      setSaveStatus('Error saving stations');
    } finally {
      setLoading(false);
    }
  };

  // Add New Chart
  const addChart = async (chartData) => {
    try {
      setLoading(true);
      const newChartRef = doc(collection(db, 'nautical_charts'));
      await setDoc(newChartRef, {
        ...chartData,
        createdAt: new Date().toISOString()
      });
      setChartsData([...chartsData, { id: newChartRef.id, ...chartData }]);
      setSaveStatus('Chart added successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error adding chart:', error);
      setSaveStatus('Error adding chart');
    } finally {
      setLoading(false);
    }
  };

  // Add New Service
  const addService = async (serviceData) => {
    try {
      setLoading(true);
      const newServiceRef = doc(collection(db, 'maritime_services'));
      await setDoc(newServiceRef, {
        ...serviceData,
        createdAt: new Date().toISOString()
      });
      setServicesData([...servicesData, { id: newServiceRef.id, ...serviceData }]);
      setSaveStatus('Service added successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error adding service:', error);
      setSaveStatus('Error adding service');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'api-config', label: 'API Configuration', icon: Icons.Key },
    { id: 'live-data', label: 'Live Data Test', icon: Icons.Activity },
    { id: 'stations', label: 'IOC Stations', icon: Icons.Radio },
    { id: 'charts', label: 'Chart Catalog', icon: Icons.Map },
    { id: 'services', label: 'Services', icon: Icons.Briefcase }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-cyan-800 text-white p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Icons.Waves className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Maritime Data Admin</h1>
                <p className="text-blue-200 text-sm">Configure APIs, manage data sources & content</p>
              </div>
            </div>

            {saveStatus && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="px-4 py-2 bg-green-500 rounded-lg flex items-center space-x-2"
              >
                <Icons.CheckCircle className="w-5 h-5" />
                <span>{saveStatus}</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* API Configuration Tab */}
            {activeTab === 'api-config' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">API Keys Configuration</h2>
                      <p className="text-gray-600">Configure your ocean data API credentials</p>
                    </div>
                    <button
                      onClick={saveApiConfig}
                      disabled={loading}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <Icons.Loader className="w-5 h-5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Icons.Save className="w-5 h-5" />
                          <span>Save Configuration</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Free APIs Section */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Icons.Gift className="w-5 h-5 mr-2 text-green-600" />
                        Free APIs (No Keys Required)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">IOC Sea Level</h4>
                              <p className="text-sm text-gray-600">UNESCO - Free & Open</p>
                            </div>
                            <Icons.CheckCircle className="w-6 h-6 text-green-600" />
                          </div>
                        </div>
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">NOAA Tides</h4>
                              <p className="text-sm text-gray-600">Open Access</p>
                            </div>
                            <Icons.CheckCircle className="w-6 h-6 text-green-600" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Paid APIs Section */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Icons.DollarSign className="w-5 h-5 mr-2 text-orange-600" />
                        Premium APIs (Keys Required)
                      </h3>

                      <div className="space-y-4">
                        {/* Stormglass */}
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Stormglass API Key
                          </label>
                          <p className="text-xs text-gray-600 mb-3">
                            Get your key from: <a href="https://stormglass.io" target="_blank" className="text-blue-600 hover:underline">stormglass.io</a>
                          </p>
                          <input
                            type="password"
                            value={apiConfig.stormglassKey}
                            onChange={(e) => setApiConfig({ ...apiConfig, stormglassKey: e.target.value })}
                            placeholder="Enter your Stormglass API key"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {/* WeatherAPI */}
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            WeatherAPI Key
                          </label>
                          <p className="text-xs text-gray-600 mb-3">
                            Get your key from: <a href="https://www.weatherapi.com" target="_blank" className="text-blue-600 hover:underline">weatherapi.com</a>
                          </p>
                          <input
                            type="password"
                            value={apiConfig.weatherApiKey}
                            onChange={(e) => setApiConfig({ ...apiConfig, weatherApiKey: e.target.value })}
                            placeholder="Enter your WeatherAPI key"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {/* OpenWeather */}
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            OpenWeather API Key
                          </label>
                          <p className="text-xs text-gray-600 mb-3">
                            Get your key from: <a href="https://openweathermap.org/api" target="_blank" className="text-blue-600 hover:underline">openweathermap.org</a>
                          </p>
                          <input
                            type="password"
                            value={apiConfig.openWeatherKey}
                            onChange={(e) => setApiConfig({ ...apiConfig, openWeatherKey: e.target.value })}
                            placeholder="Enter your OpenWeather API key"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            ✅ Free tier: 1,000 calls/day • Paid: $40-180/month
                          </p>
                        </div>

                        {/* Copernicus */}
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Copernicus Marine Credentials
                          </label>
                          <p className="text-xs text-gray-600 mb-3">
                            Register at: <a href="https://marine.copernicus.eu" target="_blank" className="text-blue-600 hover:underline">marine.copernicus.eu</a>
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={apiConfig.copernicusUsername}
                              onChange={(e) => setApiConfig({ ...apiConfig, copernicusUsername: e.target.value })}
                              placeholder="Username"
                              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="password"
                              value={apiConfig.copernicusPassword}
                              onChange={(e) => setApiConfig({ ...apiConfig, copernicusPassword: e.target.value })}
                              placeholder="Password"
                              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* NASA */}
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            NASA EarthData Token
                          </label>
                          <p className="text-xs text-gray-600 mb-3">
                            Register at: <a href="https://urs.earthdata.nasa.gov" target="_blank" className="text-blue-600 hover:underline">urs.earthdata.nasa.gov</a>
                          </p>
                          <input
                            type="password"
                            value={apiConfig.nasaToken}
                            onChange={(e) => setApiConfig({ ...apiConfig, nasaToken: e.target.value })}
                            placeholder="Enter your NASA EarthData token"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {/* Marine Traffic */}
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Marine Traffic API Key
                          </label>
                          <p className="text-xs text-gray-600 mb-3">
                            Enterprise subscription: <a href="https://www.marinetraffic.com" target="_blank" className="text-blue-600 hover:underline">marinetraffic.com</a>
                          </p>
                          <input
                            type="password"
                            value={apiConfig.marineTrafficKey}
                            onChange={(e) => setApiConfig({ ...apiConfig, marineTrafficKey: e.target.value })}
                            placeholder="Enter your Marine Traffic API key"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Environment Variables Guide */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <Icons.AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Environment Variables Setup</h3>
                      <p className="text-sm text-gray-700 mb-3">
                        Add these to your .env file for the frontend application:
                      </p>
                      <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto">
                        <div>VITE_OPENWEATHER_API_KEY={apiConfig.openWeatherKey || 'your_key_here'}</div>
                        <div>VITE_STORMGLASS_API_KEY={apiConfig.stormglassKey || 'your_key_here'}</div>
                        <div>VITE_WEATHERAPI_KEY={apiConfig.weatherApiKey || 'your_key_here'}</div>
                        <div>VITE_COPERNICUS_USERNAME={apiConfig.copernicusUsername || 'your_username'}</div>
                        <div>VITE_COPERNICUS_PASSWORD={apiConfig.copernicusPassword || 'your_password'}</div>
                        <div>VITE_NASA_EARTHDATA_TOKEN={apiConfig.nasaToken || 'your_token'}</div>
                        <div>VITE_MARINE_TRAFFIC_KEY={apiConfig.marineTrafficKey || 'your_key_here'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Live Data Test Tab */}
            {activeTab === 'live-data' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Test API Connections</h2>
                  <p className="text-gray-600 mb-6">Click to test each API connection and verify your credentials</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { id: 'ioc', name: 'IOC Sea Level', free: true, description: 'UNESCO tide gauges' },
                      { id: 'noaa', name: 'NOAA Tides', free: true, description: 'NOAA water levels' },
                      { id: 'nasa', name: 'NASA EarthData', free: true, description: 'Ocean color & SST' },
                      { id: 'copernicus', name: 'Copernicus Marine', free: true, description: 'EU marine service' },
                      { id: 'openweather', name: 'OpenWeather', free: false, description: 'Weather & Marine' },
                      { id: 'stormglass', name: 'Stormglass', free: false, description: 'Wave forecasts' },
                      { id: 'weatherapi', name: 'WeatherAPI', free: false, description: 'Marine weather' }
                    ].map((api) => (
                      <div key={api.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{api.name}</h3>
                            <p className="text-xs text-gray-600 mb-1">{api.description}</p>
                            <p className={`text-xs font-semibold ${api.free ? 'text-green-600' : 'text-orange-600'}`}>
                              {api.free ? '✓ Free' : '$ Premium'}
                            </p>
                          </div>
                          {testResults[api.id] === 'success' && (
                            <Icons.CheckCircle className="w-6 h-6 text-green-600" />
                          )}
                          {testResults[api.id] === 'failed' && (
                            <Icons.XCircle className="w-6 h-6 text-red-600" />
                          )}
                          {testResults[api.id] === 'testing' && (
                            <Icons.Loader className="w-6 h-6 text-blue-600 animate-spin" />
                          )}
                        </div>
                        <button
                          onClick={() => testApiConnection(api.id)}
                          disabled={loading}
                          className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          Test Connection
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* IOC Stations Tab */}
            {activeTab === 'stations' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">IOC Sea Level Stations</h2>
                      <p className="text-gray-600">Manage real-time sea level monitoring stations</p>
                    </div>
                    <button
                      onClick={saveStationsConfig}
                      disabled={loading}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Icons.Save className="w-5 h-5" />
                      <span>Save Stations</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {iocStations.map((station, index) => (
                      <div key={station.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${station.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">{station.name}</h3>
                              <p className="text-sm text-gray-600">{station.region}</p>
                            </div>
                          </div>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={station.active}
                              onChange={(e) => {
                                const updated = [...iocStations];
                                updated[index].active = e.target.checked;
                                setIocStations(updated);
                              }}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-600">Active</span>
                          </label>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Station Code</label>
                            <input
                              type="text"
                              value={station.code}
                              onChange={(e) => {
                                const updated = [...iocStations];
                                updated[index].code = e.target.value;
                                setIocStations(updated);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Coordinates</label>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="number"
                                step="0.0001"
                                value={station.coordinates.lat}
                                onChange={(e) => {
                                  const updated = [...iocStations];
                                  updated[index].coordinates.lat = parseFloat(e.target.value);
                                  setIocStations(updated);
                                }}
                                placeholder="Latitude"
                                className="px-3 py-2 border border-gray-300 rounded text-sm"
                              />
                              <input
                                type="number"
                                step="0.0001"
                                value={station.coordinates.lng}
                                onChange={(e) => {
                                  const updated = [...iocStations];
                                  updated[index].coordinates.lng = parseFloat(e.target.value);
                                  setIocStations(updated);
                                }}
                                placeholder="Longitude"
                                className="px-3 py-2 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">API Endpoint</label>
                            <input
                              type="url"
                              value={station.apiEndpoint}
                              onChange={(e) => {
                                const updated = [...iocStations];
                                updated[index].apiEndpoint = e.target.value;
                                setIocStations(updated);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                          </div>

                          <button
                            onClick={() => testApiConnection('ioc')}
                            className="w-full py-2 bg-green-600 text-white rounded text-sm font-semibold hover:bg-green-700 transition-colors"
                          >
                            Test Connection
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setIocStations([
                        ...iocStations,
                        {
                          id: `station-${Date.now()}`,
                          code: '',
                          name: 'New Station',
                          coordinates: { lat: 0, lng: 0 },
                          region: '',
                          active: false,
                          apiEndpoint: ''
                        }
                      ]);
                    }}
                    className="mt-6 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Icons.Plus className="w-5 h-5" />
                    <span className="font-semibold">Add New Station</span>
                  </button>
                </div>
              </div>
            )}

            {/* Charts Management Tab */}
            {activeTab === 'charts' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Nautical Charts Catalog</h2>
                      <p className="text-gray-600">Manage chart listings and pricing</p>
                    </div>
                    <button
                      onClick={() => {
                        const newChart = {
                          chartNumber: '',
                          title: '',
                          scale: '',
                          category: 'harbour',
                          format: 'digital',
                          price: 0,
                          edition: '',
                          year: new Date().getFullYear(),
                          coverage: '',
                          status: 'available',
                          stock: 0
                        };
                        addChart(newChart);
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Icons.Plus className="w-5 h-5" />
                      <span>Add Chart</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {chartsData.map((chart, index) => (
                      <div key={chart.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Chart Number</label>
                              <input
                                type="text"
                                value={chart.chartNumber}
                                onChange={(e) => {
                                  const updated = [...chartsData];
                                  updated[index].chartNumber = e.target.value;
                                  setChartsData(updated);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                placeholder="SL-101"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Price (LKR)</label>
                              <input
                                type="number"
                                value={chart.price}
                                onChange={(e) => {
                                  const updated = [...chartsData];
                                  updated[index].price = parseInt(e.target.value);
                                  setChartsData(updated);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                            <input
                              type="text"
                              value={chart.title}
                              onChange={(e) => {
                                const updated = [...chartsData];
                                updated[index].title = e.target.value;
                                setChartsData(updated);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Scale</label>
                              <input
                                type="text"
                                value={chart.scale}
                                onChange={(e) => {
                                  const updated = [...chartsData];
                                  updated[index].scale = e.target.value;
                                  setChartsData(updated);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                placeholder="1:50,000"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                              <select
                                value={chart.category}
                                onChange={(e) => {
                                  const updated = [...chartsData];
                                  updated[index].category = e.target.value;
                                  setChartsData(updated);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                              >
                                <option value="harbour">Harbour</option>
                                <option value="coastal">Coastal</option>
                                <option value="offshore">Offshore</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Coverage</label>
                            <textarea
                              value={chart.coverage}
                              onChange={(e) => {
                                const updated = [...chartsData];
                                updated[index].coverage = e.target.value;
                                setChartsData(updated);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Services Management Tab */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Maritime Services</h2>
                      <p className="text-gray-600">Manage service offerings and pricing</p>
                    </div>
                    <button
                      onClick={() => {
                        const newService = {
                          name: '',
                          icon: 'Ship',
                          description: '',
                          price: 0,
                          duration: '',
                          status: 'Available',
                          features: []
                        };
                        addService(newService);
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Icons.Plus className="w-5 h-5" />
                      <span>Add Service</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {servicesData.map((service, index) => (
                      <div key={service.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Service Name</label>
                            <input
                              type="text"
                              value={service.name}
                              onChange={(e) => {
                                const updated = [...servicesData];
                                updated[index].name = e.target.value;
                                setServicesData(updated);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                            <textarea
                              value={service.description}
                              onChange={(e) => {
                                const updated = [...servicesData];
                                updated[index].description = e.target.value;
                                setServicesData(updated);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                              rows={3}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Price (LKR)</label>
                              <input
                                type="number"
                                value={service.price}
                                onChange={(e) => {
                                  const updated = [...servicesData];
                                  updated[index].price = parseInt(e.target.value);
                                  setServicesData(updated);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Duration</label>
                              <input
                                type="text"
                                value={service.duration}
                                onChange={(e) => {
                                  const updated = [...servicesData];
                                  updated[index].duration = e.target.value;
                                  setServicesData(updated);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                placeholder="2-4 weeks"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                            <select
                              value={service.status}
                              onChange={(e) => {
                                const updated = [...servicesData];
                                updated[index].status = e.target.value;
                                setServicesData(updated);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            >
                              <option value="Available">Available</option>
                              <option value="Limited">Limited</option>
                              <option value="Busy">Busy</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MaritimeDataAdmin;
