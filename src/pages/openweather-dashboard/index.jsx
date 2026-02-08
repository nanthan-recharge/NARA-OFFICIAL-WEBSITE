import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  fetchForecast,
  fetchMultipleLocations,
  LOCATIONS
} from '../../services/openWeatherService';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SEOHead from '../../components/shared/SEOHead';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function OpenWeatherDashboard() {
  const { t, i18n } = useTranslation('openWeather');
  const [allLocationsData, setAllLocationsData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const selectLocation = useCallback(async (locationData) => {
    setSelectedLocation(locationData);

    // Fetch 5-day forecast for selected location
    try {
      const forecastData = await fetchForecast(
        locationData.location.lat,
        locationData.location.lon
      );
      if (forecastData.success) {
        setForecast(forecastData.data);
      }
    } catch (err) {
      console.error('Forecast fetch error:', err);
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await fetchMultipleLocations();
      setAllLocationsData(results);

      // Select first location by default
      if (results.length > 0 && results[0].success) {
        await selectLocation(results[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectLocation]);

  useEffect(() => {
    fetchAllData();

    if (autoRefresh) {
      const interval = setInterval(fetchAllData, 10 * 60 * 1000); // 10 minutes
      return () => clearInterval(interval);
    }
    return undefined;
  }, [autoRefresh, fetchAllData]);

  const getWeatherIcon = (description) => {
    const desc = description?.toLowerCase() || '';
    if (desc.includes('clear')) return '☀️';
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('rain')) return '🌧️';
    if (desc.includes('thunder')) return '⛈️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('mist') || desc.includes('fog')) return '🌫️';
    return '🌤️';
  };

  const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  const locale = i18n.language === 'si' ? 'si-LK' : i18n.language === 'ta' ? 'ta-LK' : 'en-US';

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <SEOHead
        title={t('meta.title')}
        description={t('meta.description')}
        path="/weather-dashboard"
        keywords={t('meta.keywords')}
      />
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-6xl">🌤️</div>
              <div>
                <h1 className="text-4xl font-bold">{t('hero.title')}</h1>
                <p className="text-xl text-sky-100 mt-2">
                  {t('hero.subtitle')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('controls.title')}</h3>
              <p className="text-sm text-gray-600">{t('controls.monitoring', { count: Object.keys(LOCATIONS).length })}</p>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{t('controls.autoRefresh')}</span>
              </label>

              <button
                onClick={fetchAllData}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {loading ? t('controls.loading') : t('controls.refresh')}
              </button>
            </div>
          </div>
        </motion.div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
            <p className="font-semibold">{t('errors.loadTitle')}</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Map Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('map.title')}</h2>

          <div className="h-96 rounded-lg overflow-hidden">
            <MapContainer
              center={[7.8731, 80.7718]}
              zoom={7}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {allLocationsData.map((locData, idx) => (
                <Marker
                  key={idx}
                  position={[locData.location.lat, locData.location.lon]}
                  eventHandlers={{
                    click: () => selectLocation(locData)
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-lg flex items-center space-x-2">
                        <span>{getWeatherIcon(locData.data?.description)}</span>
                        <span>{locData.location.name}</span>
                      </h3>
                      {locData.success && locData.data && (
                        <div className="mt-2 space-y-1 text-sm">
                          <p className="capitalize">{locData.data.description}</p>
                          <p>{t('popup.temperature')}: {locData.data.temp}°C</p>
                          <p>{t('popup.feelsLike')}: {locData.data.feelsLike}°C</p>
                          <p>{t('popup.humidity')}: {locData.data.humidity}%</p>
                          <p>{t('popup.wind')}: {locData.data.windSpeed} m/s {getWindDirection(locData.data.windDirection)}</p>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </motion.div>

        {/* Current Weather Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('currentConditions.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allLocationsData.map((locData, idx) => (
              <WeatherCard
                key={idx}
                locationData={locData}
                isSelected={selectedLocation?.location.name === locData.location.name}
                onClick={() => selectLocation(locData)}
                getWeatherIcon={getWeatherIcon}
                getWindDirection={getWindDirection}
                t={t}
              />
            ))}
          </div>
        </motion.div>

        {/* Detailed View for Selected Location */}
        {selectedLocation && selectedLocation.success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
              <span className="text-5xl">{getWeatherIcon(selectedLocation.data.description)}</span>
              <span>{t('detail.title', { location: selectedLocation.location.name })}</span>
            </h2>

            {/* Current Conditions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              <DetailCard
                icon="🌡️"
                label={t('detail.cards.temperature')}
                value={`${selectedLocation.data.temp}°C`}
                sublabel={t('detail.cards.feelsLike', { value: selectedLocation.data.feelsLike })}
              />
              <DetailCard
                icon="💧"
                label={t('detail.cards.humidity')}
                value={`${selectedLocation.data.humidity}%`}
              />
              <DetailCard
                icon="🌪️"
                label={t('detail.cards.pressure')}
                value={`${selectedLocation.data.pressure} hPa`}
              />
              <DetailCard
                icon="💨"
                label={t('detail.cards.windSpeed')}
                value={`${selectedLocation.data.windSpeed} m/s`}
                sublabel={getWindDirection(selectedLocation.data.windDirection)}
              />
              <DetailCard
                icon="☁️"
                label={t('detail.cards.cloudCover')}
                value={`${selectedLocation.data.clouds}%`}
              />
              <DetailCard
                icon="🧭"
                label={t('detail.cards.windDirection')}
                value={`${selectedLocation.data.windDirection}°`}
                sublabel={getWindDirection(selectedLocation.data.windDirection)}
              />
              <DetailCard
                icon="🌤️"
                label={t('detail.cards.conditions')}
                value={selectedLocation.data.description}
                capitalize
              />
              <DetailCard
                icon="📍"
                label={t('detail.cards.location')}
                value={`${selectedLocation.location.lat.toFixed(2)}°N, ${selectedLocation.location.lon.toFixed(2)}°E`}
              />
            </div>

            {/* 5-Day Forecast */}
            {forecast && forecast.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('forecast.title')}</h3>
                <div className="overflow-x-auto">
                  <ForecastTable forecast={forecast} getWeatherIcon={getWeatherIcon} t={t} locale={locale} />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function WeatherCard({ locationData, isSelected, onClick, getWeatherIcon, getWindDirection, t }) {
  const { location, success, data, error } = locationData;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-gradient-to-br from-white to-sky-50 rounded-lg shadow-lg p-6 cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500 shadow-xl' : 'hover:shadow-xl'
      }`}
    >
      {success && data ? (
        <>
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">{location.name}</h3>
            <span className="text-4xl">{getWeatherIcon(data.description)}</span>
          </div>

          <div className="space-y-3">
            <div className="text-3xl font-bold text-blue-600">
              {data.temp}°C
            </div>
            <div className="text-sm text-gray-600 capitalize">
              {data.description}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">{t('weatherCard.feelsLike')}</span>
                <div className="font-semibold">{data.feelsLike}°C</div>
              </div>
              <div>
                <span className="text-gray-500">{t('weatherCard.humidity')}</span>
                <div className="font-semibold">{data.humidity}%</div>
              </div>
              <div>
                <span className="text-gray-500">{t('weatherCard.wind')}</span>
                <div className="font-semibold">
                  {data.windSpeed} m/s {getWindDirection(data.windDirection)}
                </div>
              </div>
              <div>
                <span className="text-gray-500">{t('weatherCard.pressure')}</span>
                <div className="font-semibold">{data.pressure} hPa</div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-red-500 text-sm">
          {error || t('errors.noData')}
        </div>
      )}
    </motion.div>
  );
}

function DetailCard({ icon, label, value, sublabel, capitalize }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg p-4">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className={`text-xl font-bold text-gray-800 ${capitalize ? 'capitalize' : ''}`}>
        {value}
      </div>
      {sublabel && (
        <div className="text-xs text-gray-500 mt-1">{sublabel}</div>
      )}
    </div>
  );
}

function ForecastTable({ forecast, getWeatherIcon, t, locale }) {
  // Group forecast by day
  const groupedByDay = forecast.reduce((acc, item) => {
    const date = new Date(item.time).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(groupedByDay).map(([, items], idx) => (
        <div key={idx} className="border rounded-lg overflow-hidden">
          <div className="bg-blue-100 px-4 py-2 font-semibold text-gray-800">
            {new Date(items[0].time).toLocaleDateString(locale, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-700">{t('forecast.table.time')}</th>
                  <th className="px-4 py-3 text-left text-gray-700">{t('forecast.table.conditions')}</th>
                  <th className="px-4 py-3 text-left text-gray-700">{t('forecast.table.temperature')}</th>
                  <th className="px-4 py-3 text-left text-gray-700">{t('forecast.table.humidity')}</th>
                  <th className="px-4 py-3 text-left text-gray-700">{t('forecast.table.wind')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item, itemIdx) => (
                  <tr key={itemIdx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">
                      {new Date(item.time).toLocaleTimeString(locale, {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{getWeatherIcon(item.description)}</span>
                        <span className="capitalize">{item.description}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{item.temp}°C</td>
                    <td className="px-4 py-3 text-gray-800">{item.humidity}%</td>
                    <td className="px-4 py-3 text-gray-800">{item.windSpeed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
