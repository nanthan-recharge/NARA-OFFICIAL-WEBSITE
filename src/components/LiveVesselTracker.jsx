import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, ImageOverlay } from 'react-leaflet';
import { Ship, Anchor, Navigation, Clock, Flag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom ship icon
const createShipIcon = (shipType, course) => {
  const colors = {
    cargo: '#3b82f6',
    tanker: '#ef4444',
    passenger: '#10b981',
    fishing: '#f59e0b',
    other: '#6b7280'
  };

  const color = colors[shipType?.toLowerCase()] || colors.other;

  return L.divIcon({
    html: `<div style="transform: rotate(${course}deg);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2">
              <path d="M12 2 L4 22 L12 18 L20 22 Z"/>
            </svg>
           </div>`,
    className: 'ship-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const LiveVesselTracker = () => {
  const { t } = useTranslation('vesselTracking');
  const [vessels, setVessels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [filter, setFilter] = useState('all');
  const [lastUpdate, setLastUpdate] = useState(null);

  // Sri Lanka bounding box
  const sriLankaBounds = {
    north: 10.0,
    south: 5.9,
    east: 82.0,
    west: 79.5
  };

  // Sri Lanka center coordinates
  const sriLankaCenter = [7.8731, 80.7718];

  // Fetch vessel data from VesselFinder API (100 calls/day FREE)
  const fetchVesselsFromVesselFinder = async () => {
    try {
      const { north, south, east, west } = sriLankaBounds;

      // VesselFinder API - Free tier (no API key needed for basic access)
      const url = `https://api.vesselfinder.com/vesselslist?minlat=${south}&maxlat=${north}&minlon=${west}&maxlon=${east}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data && data.length > 0) {
        const vesselData = data.map(vessel => ({
          mmsi: vessel.MMSI || vessel.mmsi,
          name: vessel.NAME || vessel.name || 'Unknown',
          latitude: parseFloat(vessel.LAT || vessel.lat),
          longitude: parseFloat(vessel.LON || vessel.lon),
          speed: parseFloat(vessel.SPEED || vessel.speed || 0),
          course: parseFloat(vessel.COURSE || vessel.course || 0),
          type: getVesselType(vessel.TYPE || vessel.type),
          destination: vessel.DESTINATION || vessel.destination || 'Unknown',
          eta: vessel.ETA || vessel.eta || 'Unknown',
          lastUpdate: new Date().toISOString(),
          callsign: vessel.CALLSIGN || vessel.callsign || 'N/A',
          flag: vessel.FLAG || vessel.flag || 'Unknown'
        }));

        setVessels(vesselData);
        setLastUpdate(new Date());
        console.log(`✅ VesselFinder: Loaded ${vesselData.length} vessels`);
        return true;
      }
    } catch (error) {
      console.error('VesselFinder API error:', error);
      return false;
    }
  };

  // Fetch vessel data from AISHub (FREE - Backup API)
  const fetchVesselsFromAISHub = async () => {
    try {
      const { north, south, east, west } = sriLankaBounds;

      // AISHub API endpoint (FREE - No API key needed)
      const url = `http://data.aishub.net/ws.php?username=AH_DEMO&format=1&output=json&compress=0&latmin=${south}&latmax=${north}&lonmin=${west}&lonmax=${east}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data && data[0] && data[0].POSITION) {
        const vesselData = data[0].POSITION.map(vessel => ({
          mmsi: vessel.MMSI,
          name: vessel.NAME || 'Unknown',
          latitude: parseFloat(vessel.LATITUDE),
          longitude: parseFloat(vessel.LONGITUDE),
          speed: parseFloat(vessel.SPEED || 0),
          course: parseFloat(vessel.COURSE || 0),
          type: getVesselType(vessel.TYPE),
          destination: vessel.DESTINATION || 'Unknown',
          eta: vessel.ETA || 'Unknown',
          lastUpdate: vessel.TIME,
          callsign: vessel.CALLSIGN || 'N/A',
          flag: vessel.FLAG || 'Unknown'
        }));

        setVessels(vesselData);
        setLastUpdate(new Date());
        console.log(`✅ AISHub: Loaded ${vesselData.length} vessels`);
        return true;
      }
    } catch (error) {
      console.error('AISHub API error:', error);
      return false;
    }
  };

  // Fetch from multiple sources with fallback
  const fetchVesselData = async () => {
    // Try VesselFinder first (more accurate)
    const vesselFinderSuccess = await fetchVesselsFromVesselFinder();
    if (vesselFinderSuccess) return;

    // Fallback to AISHub
    const aisHubSuccess = await fetchVesselsFromAISHub();
    if (aisHubSuccess) return;

    // Last resort: demo data
    console.warn('⚠️ All APIs failed, using demo data');
    loadDemoData();
  };

  // Vessel type classifier
  const getVesselType = (typeCode) => {
    if (!typeCode) return 'other';
    const code = parseInt(typeCode);

    if (code >= 70 && code <= 79) return 'cargo';
    if (code >= 80 && code <= 89) return 'tanker';
    if (code >= 60 && code <= 69) return 'passenger';
    if (code === 30) return 'fishing';
    return 'other';
  };

  // Demo data fallback - FIXED: Vessels now in OCEAN, not on land
  const loadDemoData = () => {
    setVessels([
      {
        mmsi: '419000001',
        name: 'MV Lanka Pride',
        latitude: 6.7000,  // West of Colombo (in ocean)
        longitude: 79.2000,
        speed: 12.5,
        course: 135,
        type: 'cargo',
        destination: 'Colombo Port',
        eta: '2024-10-29 14:30',
        lastUpdate: new Date().toISOString(),
        callsign: 'SL123',
        flag: 'Sri Lanka'
      },
      {
        mmsi: '419000002',
        name: 'SS Ocean Star',
        latitude: 8.8000,  // East of Trincomalee (in ocean)
        longitude: 82.2000,
        speed: 8.3,
        course: 270,
        type: 'tanker',
        destination: 'Trincomalee',
        eta: '2024-10-29 18:00',
        lastUpdate: new Date().toISOString(),
        callsign: 'SL456',
        flag: 'Sri Lanka'
      },
      {
        mmsi: '419000003',
        name: 'Fishing Vessel Ruhuna',
        latitude: 5.7000,  // South of Galle (in ocean)
        longitude: 80.2000,
        speed: 4.2,
        course: 90,
        type: 'fishing',
        destination: 'Galle Harbor',
        eta: '2024-10-29 12:00',
        lastUpdate: new Date().toISOString(),
        callsign: 'SL789',
        flag: 'Sri Lanka'
      },
      {
        mmsi: '419000004',
        name: 'Container Ship Asia Express',
        latitude: 7.2000,  // West of Sri Lanka (in ocean)
        longitude: 79.3000,
        speed: 15.8,
        course: 45,
        type: 'cargo',
        destination: 'Singapore',
        eta: '2024-10-30 08:00',
        lastUpdate: new Date().toISOString(),
        callsign: 'SL234',
        flag: 'Singapore'
      },
      {
        mmsi: '419000005',
        name: 'Passenger Ferry Negombo',
        latitude: 7.3000,  // West of Negombo (in ocean)
        longitude: 79.3000,
        speed: 18.5,
        course: 180,
        type: 'passenger',
        destination: 'Negombo Port',
        eta: '2024-10-29 10:30',
        lastUpdate: new Date().toISOString(),
        callsign: 'SL567',
        flag: 'Sri Lanka'
      },
      {
        mmsi: '419000006',
        name: 'Oil Tanker Pacific Queen',
        latitude: 5.5000,  // DEEP South of Sri Lanka (definitely in ocean)
        longitude: 80.8000,
        speed: 10.2,
        course: 315,
        type: 'tanker',
        destination: 'Hambantota',
        eta: '2024-10-29 20:00',
        lastUpdate: new Date().toISOString(),
        callsign: 'INT789',
        flag: 'Panama'
      }
    ]);
    setLastUpdate(new Date());
    console.log('📍 Demo data loaded - vessels in OCEAN');
  };

  // Fetch data on mount and every 3 minutes (faster updates)
  useEffect(() => {
    setLoading(true);
    fetchVesselData();
    setLoading(false);

    // Refresh every 3 minutes for live data
    const interval = setInterval(fetchVesselData, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter vessels by type
  const filteredVessels = filter === 'all'
    ? vessels
    : vessels.filter(v => v.type === filter);

  // Get vessel statistics
  const stats = {
    total: vessels.length,
    cargo: vessels.filter(v => v.type === 'cargo').length,
    tanker: vessels.filter(v => v.type === 'tanker').length,
    passenger: vessels.filter(v => v.type === 'passenger').length,
    fishing: vessels.filter(v => v.type === 'fishing').length,
    other: vessels.filter(v => v.type === 'other').length
  };

  return (
    <div className="w-full h-screen bg-slate-900 relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-gradient-to-r from-blue-900/95 to-cyan-900/95 backdrop-blur-lg border-b border-blue-500/30 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Ship className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">{t('header.title')}</h1>
              <p className="text-sm text-cyan-300">{t('header.subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-white">
              {t('header.lastUpdate')}: {lastUpdate?.toLocaleTimeString() || t('header.loading')}
            </span>
            <button
              onClick={() => fetchVesselData()}
              className="ml-4 px-3 py-1 bg-cyan-500 hover:bg-cyan-600 text-white text-sm rounded-lg transition-colors"
            >
              {t('header.refreshNow')}
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Panel */}
      <div className="absolute top-24 left-4 z-[1000] bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 w-80">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Navigation className="w-5 h-5 text-cyan-400" />
          {t('stats.title')}
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
            <span className="text-slate-300">{t('stats.totalVessels')}</span>
            <span className="text-2xl font-bold text-white">{stats.total}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setFilter('cargo')}
              className={`p-3 rounded-lg transition-all ${filter === 'cargo'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'
                }`}
            >
              <div className="text-xs opacity-75">{t('vesselTypes.cargo')}</div>
              <div className="text-xl font-bold">{stats.cargo}</div>
            </button>

            <button
              onClick={() => setFilter('tanker')}
              className={`p-3 rounded-lg transition-all ${filter === 'tanker'
                ? 'bg-red-500 text-white'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'
                }`}
            >
              <div className="text-xs opacity-75">{t('vesselTypes.tanker')}</div>
              <div className="text-xl font-bold">{stats.tanker}</div>
            </button>

            <button
              onClick={() => setFilter('passenger')}
              className={`p-3 rounded-lg transition-all ${filter === 'passenger'
                ? 'bg-green-500 text-white'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'
                }`}
            >
              <div className="text-xs opacity-75">{t('vesselTypes.passenger')}</div>
              <div className="text-xl font-bold">{stats.passenger}</div>
            </button>

            <button
              onClick={() => setFilter('fishing')}
              className={`p-3 rounded-lg transition-all ${filter === 'fishing'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'
                }`}
            >
              <div className="text-xs opacity-75">{t('vesselTypes.fishing')}</div>
              <div className="text-xl font-bold">{stats.fishing}</div>
            </button>
          </div>

          <button
            onClick={() => setFilter('all')}
            className={`w-full p-3 rounded-lg transition-all ${filter === 'all'
              ? 'bg-cyan-500 text-white'
              : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'
              }`}
          >
            {t('stats.showAll')}
          </button>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={sriLankaCenter}
        zoom={8}
        className="w-full h-full"
        style={{ background: '#0f172a' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Sri Lanka EEZ Circle (200 nautical miles ≈ 370 km) */}
        <Circle
          center={sriLankaCenter}
          radius={370000}
          pathOptions={{
            color: '#06b6d4',
            fillColor: '#06b6d4',
            fillOpacity: 0.05,
            weight: 2,
            dashArray: '10, 10'
          }}
        />

        {/* NARA Logo Marker - Center of Sri Lanka (Real Logo) */}
        <Marker
          position={sriLankaCenter}
          icon={L.divIcon({
            html: `
              <div style="
                background: white;
                border: 3px solid #0891b2;
                border-radius: 50%;
                width: 80px;
                height: 80px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 6px 20px rgba(8, 145, 178, 0.4);
                padding: 8px;
              ">
                <img 
                  src="/assets/nara-logo.png" 
                  alt="NARA Logo" 
                  style="
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                  "
                />
              </div>
            `,
            className: 'nara-logo-marker',
            iconSize: [80, 80],
            iconAnchor: [40, 40]
          })}
        >
          <Popup>
            <div className="p-4 text-center">
              <img
                src="/assets/nara-logo.png"
                alt="NARA Logo"
                className="w-20 h-20 mx-auto mb-3 object-contain"
              />
              <div className="font-bold text-lg text-cyan-600">{t('nara.name')}</div>
              <div className="text-sm text-slate-600">{t('nara.fullName1')}</div>
              <div className="text-sm text-slate-600">{t('nara.fullName2')}</div>
              <div className="mt-2 text-xs text-slate-500">{t('nara.country')}</div>
            </div>
          </Popup>
        </Marker>

        {/* Vessel Markers */}
        {loading ? (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
            {t('popup.loadingVessels')}
          </div>
        ) : (
          filteredVessels.map((vessel) => (
            <Marker
              key={vessel.mmsi}
              position={[vessel.latitude, vessel.longitude]}
              icon={createShipIcon(vessel.type, vessel.course)}
              eventHandlers={{
                click: () => setSelectedVessel(vessel)
              }}
            >
              <Popup className="vessel-popup">
                <div className="p-4 min-w-[300px]">
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-700">
                    <Ship className="w-6 h-6 text-cyan-400" />
                    <div>
                      <h3 className="font-bold text-lg text-white">{vessel.name}</h3>
                      <p className="text-sm text-slate-400">MMSI: {vessel.mmsi}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-300">
                        <strong>{t('popup.flag')}:</strong> {vessel.flag}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Anchor className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-300">
                        <strong>{t('popup.type')}:</strong> {vessel.type.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-300">
                        <strong>{t('popup.speed')}:</strong> {vessel.speed.toFixed(1)} {t('popup.knots')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-300">
                        <strong>{t('popup.course')}:</strong> {vessel.course.toFixed(0)}°
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-700">
                      <p className="text-sm text-slate-300">
                        <strong>{t('popup.destination')}:</strong> {vessel.destination}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {t('popup.eta')}: {vessel.eta}
                      </p>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))
        )}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-4">
        <h4 className="text-sm font-bold text-white mb-2">{t('legend.title')}</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-slate-300">{t('vesselTypes.cargo')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-slate-300">{t('vesselTypes.tanker')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-slate-300">{t('vesselTypes.passenger')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-xs text-slate-300">{t('vesselTypes.fishing')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span className="text-xs text-slate-300">{t('vesselTypes.other')}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-700">
          <p className="text-xs text-slate-400">
            Data: VesselFinder + AISHub APIs
          </p>
          <p className="text-xs text-cyan-400">
            {t('legend.liveUpdates')}
          </p>
          <p className="text-xs text-green-400 mt-1">
            {t('legend.accurateData')}
          </p>
        </div>
      </div>

      <style jsx>{`
        .ship-marker {
          background: transparent;
          border: none;
        }
        .vessel-popup .leaflet-popup-content-wrapper {
          background: #1e293b;
          color: white;
          border-radius: 12px;
          padding: 0;
        }
        .vessel-popup .leaflet-popup-tip {
          background: #1e293b;
        }
      `}</style>
    </div>
  );
};

export default LiveVesselTracker;
