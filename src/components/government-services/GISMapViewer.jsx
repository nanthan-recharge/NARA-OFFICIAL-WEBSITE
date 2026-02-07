import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, useMapEvents } from 'react-leaflet';
import { motion } from 'framer-motion';
import { MapPin, Layers, Filter, Eye, EyeOff, Maximize2, Navigation } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/**
 * Custom marker icons for different types
 */
const createCustomIcon = (color, icon) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-size: 16px;
        ">${icon}</span>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const markerIcons = {
  eia: createCustomIcon('#06b6d4', '📋'),
  license: createCustomIcon('#a855f7', '⚓'),
  emergency: createCustomIcon('#ef4444', '🚨'),
  compliance: createCustomIcon('#10b981', '✓'),
  selected: createCustomIcon('#f59e0b', '📍')
};

/**
 * Sri Lanka Marine Zones (example coordinates)
 */
const sriLankaMarineZones = [
  {
    name: 'Colombo Coastal Zone',
    type: 'protected',
    coordinates: [
      [6.9271, 79.8612],
      [6.9500, 79.8400],
      [6.9000, 79.8400],
      [6.9000, 79.8600]
    ],
    color: '#3b82f6',
    opacity: 0.2
  },
  {
    name: 'Trincomalee Harbor Zone',
    type: 'commercial',
    coordinates: [
      [8.5874, 81.2152],
      [8.6000, 81.2000],
      [8.5700, 81.2000],
      [8.5700, 81.2200]
    ],
    color: '#10b981',
    opacity: 0.2
  },
  {
    name: 'Galle Protected Area',
    type: 'conservation',
    coordinates: [
      [6.0535, 80.2210],
      [6.0700, 80.2100],
      [6.0400, 80.2100],
      [6.0400, 80.2300]
    ],
    color: '#f59e0b',
    opacity: 0.2
  }
];

/**
 * Location Click Handler Component
 */
const LocationSelector = ({ onLocationSelect, enabled }) => {
  useMapEvents({
    click(e) {
      if (enabled && onLocationSelect) {
        onLocationSelect({
          lat: e.latlng.lat,
          lng: e.latlng.lng
        });
      }
    }
  });
  return null;
};

/**
 * GIS Map Viewer Component
 * Interactive map for government services
 */
const GISMapViewer = ({
  eiaApplications = [],
  licenses = [],
  emergencies = [],
  complianceRecords = [],
  onLocationSelect = null,
  selectionMode = false,
  selectedLocation = null,
  showZones = true,
  height = '600px'
}) => {
  const [mapCenter, setMapCenter] = useState([7.8731, 80.7718]); // Sri Lanka center
  const [mapZoom, setMapZoom] = useState(7);
  const [activeFilters, setActiveFilters] = useState({
    eia: true,
    license: true,
    emergency: true,
    compliance: true,
    zones: true
  });
  const [fullscreen, setFullscreen] = useState(false);

  // Prepare markers from data
  const markers = useMemo(() => {
    const allMarkers = [];

    // EIA Applications
    if (activeFilters.eia) {
      eiaApplications.forEach(app => {
        if (app.coordinates) {
          const [lat, lng] = app.coordinates.split(',').map(c => parseFloat(c.trim()));
          allMarkers.push({
            id: `eia-${app.id}`,
            type: 'eia',
            position: [lat, lng],
            data: app,
            title: app.projectName,
            subtitle: `EIA - ${app.status}`,
            icon: markerIcons.eia
          });
        }
      });
    }

    // Licenses
    if (activeFilters.license) {
      licenses.forEach(license => {
        if (license.coordinates) {
          const [lat, lng] = license.coordinates.split(',').map(c => parseFloat(c.trim()));
          allMarkers.push({
            id: `license-${license.id}`,
            type: 'license',
            position: [lat, lng],
            data: license,
            title: license.vesselName || license.businessName,
            subtitle: `License - ${license.licenseType}`,
            icon: markerIcons.license
          });
        }
      });
    }

    // Emergencies
    if (activeFilters.emergency) {
      emergencies.forEach(emergency => {
        if (emergency.coordinates) {
          const [lat, lng] = emergency.coordinates.split(',').map(c => parseFloat(c.trim()));
          allMarkers.push({
            id: `emergency-${emergency.id}`,
            type: 'emergency',
            position: [lat, lng],
            data: emergency,
            title: emergency.title,
            subtitle: `${emergency.severity.toUpperCase()} - ${emergency.status}`,
            icon: markerIcons.emergency,
            severity: emergency.severity
          });
        }
      });
    }

    // Compliance Records
    if (activeFilters.compliance) {
      complianceRecords.forEach(record => {
        if (record.coordinates) {
          const [lat, lng] = record.coordinates.split(',').map(c => parseFloat(c.trim()));
          allMarkers.push({
            id: `compliance-${record.id}`,
            type: 'compliance',
            position: [lat, lng],
            data: record,
            title: record.entityName,
            subtitle: `Compliance - ${record.status}`,
            icon: markerIcons.compliance
          });
        }
      });
    }

    return allMarkers;
  }, [eiaApplications, licenses, emergencies, complianceRecords, activeFilters]);

  const toggleFilter = (filter) => {
    setActiveFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const centerOnSriLanka = () => {
    setMapCenter([7.8731, 80.7718]);
    setMapZoom(7);
  };

  return (
    <div className={`relative ${fullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl overflow-hidden border border-white/10 shadow-2xl ${fullscreen ? 'h-screen' : ''}`}
        style={{ height: fullscreen ? '100vh' : height }}
      >
        {/* Map Controls */}
        <div className="absolute top-4 right-4 z-[1000] space-y-2">
          {/* Fullscreen Toggle */}
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="p-3 rounded-lg bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg transition-colors"
            title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            <Maximize2 className="w-5 h-5 text-slate-700" />
          </button>

          {/* Recenter Button */}
          <button
            onClick={centerOnSriLanka}
            className="p-3 rounded-lg bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg transition-colors"
            title="Center on Sri Lanka"
          >
            <Navigation className="w-5 h-5 text-slate-700" />
          </button>

          {/* Filter Panel */}
          <div className="p-4 rounded-lg bg-white/90 backdrop-blur-sm shadow-lg space-y-2 min-w-[180px]">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
              <Layers className="w-4 h-4 text-slate-700" />
              <span className="text-sm font-semibold text-slate-700">Layers</span>
            </div>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={activeFilters.eia}
                onChange={() => toggleFilter('eia')}
                className="rounded text-cyan-500"
              />
              <span className="flex items-center gap-1 text-sm text-slate-700">
                <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
                EIA ({eiaApplications.length})
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={activeFilters.license}
                onChange={() => toggleFilter('license')}
                className="rounded text-purple-500"
              />
              <span className="flex items-center gap-1 text-sm text-slate-700">
                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                Licenses ({licenses.length})
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={activeFilters.emergency}
                onChange={() => toggleFilter('emergency')}
                className="rounded text-red-500"
              />
              <span className="flex items-center gap-1 text-sm text-slate-700">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                Emergencies ({emergencies.length})
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={activeFilters.compliance}
                onChange={() => toggleFilter('compliance')}
                className="rounded text-green-500"
              />
              <span className="flex items-center gap-1 text-sm text-slate-700">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                Compliance ({complianceRecords.length})
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={activeFilters.zones}
                onChange={() => toggleFilter('zones')}
                className="rounded text-blue-500"
              />
              <span className="flex items-center gap-1 text-sm text-slate-700">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                Marine Zones
              </span>
            </label>
          </div>

          {/* Selection Mode Indicator */}
          {selectionMode && (
            <div className="p-3 rounded-lg bg-amber-500 text-white shadow-lg">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-semibold">Click to Select</span>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-[1000] p-3 rounded-lg bg-white/90 backdrop-blur-sm shadow-lg">
          <div className="text-xs font-semibold text-slate-700 mb-2">Map Legend</div>
          <div className="space-y-1 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="text-lg">📋</span>
              <span>EIA Project</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">⚓</span>
              <span>License</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🚨</span>
              <span>Emergency</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">✓</span>
              <span>Compliance</span>
            </div>
          </div>
        </div>

        {/* Map */}
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Location Selector */}
          {selectionMode && (
            <LocationSelector
              enabled={selectionMode}
              onLocationSelect={onLocationSelect}
            />
          )}

          {/* Marine Zones */}
          {showZones && activeFilters.zones && sriLankaMarineZones.map((zone, idx) => (
            <Polygon
              key={idx}
              positions={zone.coordinates}
              pathOptions={{
                color: zone.color,
                fillColor: zone.color,
                fillOpacity: zone.opacity,
                weight: 2
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-sm">{zone.name}</h3>
                  <p className="text-xs text-slate-600">Type: {zone.type}</p>
                </div>
              </Popup>
            </Polygon>
          ))}

          {/* Markers */}
          {markers.map(marker => (
            <Marker
              key={marker.id}
              position={marker.position}
              icon={marker.icon}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-sm mb-1">{marker.title}</h3>
                  <p className="text-xs text-slate-600 mb-2">{marker.subtitle}</p>
                  
                  {marker.type === 'eia' && (
                    <div className="text-xs space-y-1">
                      <p><strong>Type:</strong> {marker.data.projectType}</p>
                      <p><strong>Budget:</strong> LKR {Number(marker.data.estimatedBudget || 0).toLocaleString()}</p>
                      <p><strong>Location:</strong> {marker.data.location}</p>
                    </div>
                  )}
                  
                  {marker.type === 'license' && (
                    <div className="text-xs space-y-1">
                      <p><strong>Type:</strong> {marker.data.licenseType}</p>
                      <p><strong>Area:</strong> {marker.data.operationArea}</p>
                      <p><strong>Status:</strong> {marker.data.status}</p>
                    </div>
                  )}
                  
                  {marker.type === 'emergency' && (
                    <div className="text-xs space-y-1">
                      <p><strong>Type:</strong> {marker.data.incidentType}</p>
                      <p><strong>Severity:</strong> {marker.data.severity}</p>
                      <p><strong>Status:</strong> {marker.data.status}</p>
                      {marker.severity === 'critical' && (
                        <p className="text-red-600 font-bold mt-2">⚠️ CRITICAL</p>
                      )}
                    </div>
                  )}

                  {marker.type === 'compliance' && (
                    <div className="text-xs space-y-1">
                      <p><strong>Entity:</strong> {marker.data.entityName}</p>
                      <p><strong>Status:</strong> {marker.data.status}</p>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Selected Location Marker */}
          {selectedLocation && (
            <Marker
              position={[selectedLocation.lat, selectedLocation.lng]}
              icon={markerIcons.selected}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-sm mb-1">Selected Location</h3>
                  <p className="text-xs">Lat: {selectedLocation.lat.toFixed(6)}</p>
                  <p className="text-xs">Lng: {selectedLocation.lng.toFixed(6)}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Emergency Circles (for critical incidents) */}
          {markers
            .filter(m => m.type === 'emergency' && m.severity === 'critical')
            .map(marker => (
              <Circle
                key={`circle-${marker.id}`}
                center={marker.position}
                radius={5000}
                pathOptions={{
                  color: '#ef4444',
                  fillColor: '#ef4444',
                  fillOpacity: 0.1,
                  weight: 2,
                  dashArray: '5, 5'
                }}
              />
            ))}
        </MapContainer>
      </motion.div>

      {/* Map Info */}
      {!fullscreen && (
        <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-cyan-400">{markers.filter(m => m.type === 'eia').length}</div>
              <div className="text-xs text-slate-400">EIA Projects</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{markers.filter(m => m.type === 'license').length}</div>
              <div className="text-xs text-slate-400">Licenses</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{markers.filter(m => m.type === 'emergency').length}</div>
              <div className="text-xs text-slate-400">Emergencies</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{markers.filter(m => m.type === 'compliance').length}</div>
              <div className="text-xs text-slate-400">Compliance</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GISMapViewer;
