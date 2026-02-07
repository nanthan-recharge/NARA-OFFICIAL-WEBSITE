import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, useMap, Polyline } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { motion } from 'framer-motion';
import { 
  MapPin, Layers, Maximize2, Navigation, TrendingUp, 
  Edit3, Ruler, Route, Trash2, Save, X
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/**
 * Heat Map Layer Component
 */
const HeatMapLayer = ({ points, intensity = 0.6, radius = 25 }) => {
  const map = useMap();
  const heatLayerRef = useRef(null);

  useEffect(() => {
    if (points && points.length > 0) {
      // Remove existing heat layer
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }

      // Create heat layer
      const heatPoints = points.map(p => [p[0], p[1], intensity]);
      heatLayerRef.current = L.heatLayer(heatPoints, {
        radius: radius,
        blur: 15,
        maxZoom: 17,
        gradient: {
          0.0: 'blue',
          0.5: 'lime',
          0.7: 'yellow',
          1.0: 'red'
        }
      }).addTo(map);
    }

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }
    };
  }, [map, points, intensity, radius]);

  return null;
};

/**
 * Draw Control Component
 */
const DrawControl = ({ onDrawCreated, onDrawDeleted, enabled }) => {
  const map = useMap();
  const drawnItemsRef = useRef(null);
  const drawControlRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    // Initialize drawn items layer
    if (!drawnItemsRef.current) {
      drawnItemsRef.current = new L.FeatureGroup();
      map.addLayer(drawnItemsRef.current);
    }

    // Initialize draw control
    if (!drawControlRef.current) {
      drawControlRef.current = new L.Control.Draw({
        edit: {
          featureGroup: drawnItemsRef.current,
          remove: true
        },
        draw: {
          polygon: true,
          polyline: true,
          rectangle: true,
          circle: true,
          marker: true,
          circlemarker: false
        }
      });
      map.addControl(drawControlRef.current);
    }

    // Event handlers
    const handleDrawCreated = (e) => {
      const layer = e.layer;
      drawnItemsRef.current.addLayer(layer);
      
      if (onDrawCreated) {
        const geoJSON = layer.toGeoJSON();
        onDrawCreated({
          type: e.layerType,
          layer: layer,
          geoJSON: geoJSON
        });
      }
    };

    const handleDrawDeleted = (e) => {
      if (onDrawDeleted) {
        onDrawDeleted(e.layers);
      }
    };

    map.on(L.Draw.Event.CREATED, handleDrawCreated);
    map.on(L.Draw.Event.DELETED, handleDrawDeleted);

    return () => {
      map.off(L.Draw.Event.CREATED, handleDrawCreated);
      map.off(L.Draw.Event.DELETED, handleDrawDeleted);
      
      if (drawControlRef.current) {
        map.removeControl(drawControlRef.current);
        drawControlRef.current = null;
      }
      
      if (drawnItemsRef.current) {
        map.removeLayer(drawnItemsRef.current);
        drawnItemsRef.current = null;
      }
    };
  }, [map, enabled, onDrawCreated, onDrawDeleted]);

  return null;
};

/**
 * Distance Measurement Component
 */
const DistanceMeasurement = ({ enabled, onDistanceCalculated }) => {
  const map = useMap();
  const [points, setPoints] = useState([]);
  const polylineRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!enabled) {
      // Clean up when disabled
      if (polylineRef.current) {
        map.removeLayer(polylineRef.current);
        polylineRef.current = null;
      }
      markersRef.current.forEach(marker => map.removeLayer(marker));
      markersRef.current = [];
      setPoints([]);
      return;
    }

    const handleMapClick = (e) => {
      const newPoint = [e.latlng.lat, e.latlng.lng];
      const newPoints = [...points, newPoint];
      setPoints(newPoints);

      // Add marker
      const marker = L.marker(newPoint, {
        icon: L.divIcon({
          html: `<div style="background: #ef4444; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">${newPoints.length}</div>`,
          iconSize: [24, 24],
          className: 'distance-marker'
        })
      }).addTo(map);
      markersRef.current.push(marker);

      // Draw polyline
      if (newPoints.length > 1) {
        if (polylineRef.current) {
          map.removeLayer(polylineRef.current);
        }
        
        polylineRef.current = L.polyline(newPoints, {
          color: '#ef4444',
          weight: 3,
          dashArray: '5, 10'
        }).addTo(map);

        // Calculate distance
        let totalDistance = 0;
        for (let i = 0; i < newPoints.length - 1; i++) {
          const latlng1 = L.latLng(newPoints[i]);
          const latlng2 = L.latLng(newPoints[i + 1]);
          totalDistance += latlng1.distanceTo(latlng2);
        }

        if (onDistanceCalculated) {
          onDistanceCalculated({
            distance: totalDistance,
            points: newPoints,
            distanceKm: (totalDistance / 1000).toFixed(2),
            distanceNm: (totalDistance / 1852).toFixed(2)
          });
        }
      }
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, enabled, points, onDistanceCalculated]);

  return null;
};

/**
 * Custom marker icons
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
  compliance: createCustomIcon('#10b981', '✓')
};

/**
 * Advanced GIS Map Viewer Component
 * With clustering, heat maps, draw tools, distance measurement
 */
const AdvancedGISMapViewer = ({
  eiaApplications = [],
  licenses = [],
  emergencies = [],
  complianceRecords = [],
  showZones = true,
  height = '700px'
}) => {
  const [mapCenter] = useState([7.8731, 80.7718]);
  const [mapZoom] = useState(7);
  const [activeFilters, setActiveFilters] = useState({
    eia: true,
    license: true,
    emergency: true,
    compliance: true,
    zones: true
  });
  const [viewMode, setViewMode] = useState('markers'); // markers, heatmap, cluster
  const [fullscreen, setFullscreen] = useState(false);
  const [drawMode, setDrawMode] = useState(false);
  const [measureMode, setMeasureMode] = useState(false);
  const [drawnShapes, setDrawnShapes] = useState([]);
  const [measurementData, setMeasurementData] = useState(null);

  // Prepare markers
  const markers = useMemo(() => {
    const allMarkers = [];

    if (activeFilters.eia) {
      eiaApplications.forEach(app => {
        if (app.coordinates) {
          const [lat, lng] = app.coordinates.split(',').map(c => parseFloat(c.trim()));
          if (!isNaN(lat) && !isNaN(lng)) {
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
        }
      });
    }

    if (activeFilters.license) {
      licenses.forEach(license => {
        if (license.coordinates) {
          const [lat, lng] = license.coordinates.split(',').map(c => parseFloat(c.trim()));
          if (!isNaN(lat) && !isNaN(lng)) {
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
        }
      });
    }

    if (activeFilters.emergency) {
      emergencies.forEach(emergency => {
        if (emergency.coordinates) {
          const [lat, lng] = emergency.coordinates.split(',').map(c => parseFloat(c.trim()));
          if (!isNaN(lat) && !isNaN(lng)) {
            allMarkers.push({
              id: `emergency-${emergency.id}`,
              type: 'emergency',
              position: [lat, lng],
              data: emergency,
              title: emergency.title,
              subtitle: `${emergency.severity?.toUpperCase() || 'N/A'} - ${emergency.status}`,
              icon: markerIcons.emergency,
              severity: emergency.severity
            });
          }
        }
      });
    }

    if (activeFilters.compliance) {
      complianceRecords.forEach(record => {
        if (record.coordinates) {
          const [lat, lng] = record.coordinates.split(',').map(c => parseFloat(c.trim()));
          if (!isNaN(lat) && !isNaN(lng)) {
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
        }
      });
    }

    return allMarkers;
  }, [eiaApplications, licenses, emergencies, complianceRecords, activeFilters]);

  // Prepare heat map points
  const heatMapPoints = useMemo(() => {
    return markers.map(m => m.position);
  }, [markers]);

  const toggleFilter = (filter) => {
    setActiveFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const handleDrawCreated = (data) => {
    setDrawnShapes(prev => [...prev, data]);
    console.log('Shape drawn:', data);
  };

  const handleDrawDeleted = (layers) => {
    console.log('Shapes deleted:', layers);
  };

  const clearMeasurement = () => {
    setMeasureMode(false);
    setMeasurementData(null);
  };

  const saveDrawings = () => {
    const drawingsData = drawnShapes.map(shape => shape.geoJSON);
    console.log('Saving drawings:', drawingsData);
    // Here you could save to Firebase or export as GeoJSON
    alert(`${drawnShapes.length} shapes ready to save!`);
  };

  return (
    <div className={`relative ${fullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl overflow-hidden border border-white/10 shadow-2xl ${fullscreen ? 'h-screen' : ''}`}
        style={{ height: fullscreen ? '100vh' : height }}
      >
        {/* Advanced Controls */}
        <div className="absolute top-4 right-4 z-[1000] space-y-2">
          {/* View Mode Selector */}
          <div className="p-3 rounded-lg bg-white/90 backdrop-blur-sm shadow-lg">
            <div className="text-xs font-semibold text-slate-700 mb-2">View Mode</div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setViewMode('markers')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  viewMode === 'markers'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                📍 Markers
              </button>
              <button
                onClick={() => setViewMode('cluster')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  viewMode === 'cluster'
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                🔵 Clusters
              </button>
              <button
                onClick={() => setViewMode('heatmap')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  viewMode === 'heatmap'
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                🔥 Heat Map
              </button>
            </div>
          </div>

          {/* Advanced Tools */}
          <div className="p-3 rounded-lg bg-white/90 backdrop-blur-sm shadow-lg">
            <div className="text-xs font-semibold text-slate-700 mb-2">Tools</div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => {
                  setDrawMode(!drawMode);
                  setMeasureMode(false);
                }}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                  drawMode
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Edit3 className="w-3 h-3" />
                Draw Zones
              </button>
              <button
                onClick={() => {
                  setMeasureMode(!measureMode);
                  setDrawMode(false);
                }}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                  measureMode
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Ruler className="w-3 h-3" />
                Measure
              </button>
              {drawnShapes.length > 0 && (
                <button
                  onClick={saveDrawings}
                  className="px-3 py-1.5 rounded text-xs font-medium bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center gap-1"
                >
                  <Save className="w-3 h-3" />
                  Save ({drawnShapes.length})
                </button>
              )}
            </div>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="w-full p-3 rounded-lg bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg transition-colors"
          >
            <Maximize2 className="w-5 h-5 text-slate-700 mx-auto" />
          </button>

          {/* Layer Filters */}
          <div className="p-3 rounded-lg bg-white/90 backdrop-blur-sm shadow-lg space-y-2 min-w-[180px]">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
              <Layers className="w-4 h-4 text-slate-700" />
              <span className="text-xs font-semibold text-slate-700">Layers</span>
            </div>
            
            {[
              { key: 'eia', label: 'EIA', color: 'bg-cyan-500', count: eiaApplications.length },
              { key: 'license', label: 'Licenses', color: 'bg-purple-500', count: licenses.length },
              { key: 'emergency', label: 'Emergencies', color: 'bg-red-500', count: emergencies.length },
              { key: 'compliance', label: 'Compliance', color: 'bg-green-500', count: complianceRecords.length }
            ].map(item => (
              <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeFilters[item.key]}
                  onChange={() => toggleFilter(item.key)}
                  className="rounded text-cyan-500"
                />
                <span className="flex items-center gap-1 text-xs text-slate-700">
                  <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
                  {item.label} ({item.count})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Measurement Display */}
        {measureMode && measurementData && (
          <div className="absolute bottom-20 left-4 z-[1000] p-4 rounded-lg bg-orange-500 text-white shadow-lg max-w-xs">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-sm">Distance Measurement</h4>
              <button onClick={clearMeasurement} className="p-1 rounded hover:bg-orange-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1 text-sm">
              <p><strong>Distance:</strong> {measurementData.distanceKm} km</p>
              <p><strong>Nautical Miles:</strong> {measurementData.distanceNm} nm</p>
              <p><strong>Points:</strong> {measurementData.points.length}</p>
            </div>
            <p className="text-xs mt-2 opacity-80">Click map to add more points</p>
          </div>
        )}

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

          {/* Draw Control */}
          {drawMode && (
            <DrawControl
              enabled={drawMode}
              onDrawCreated={handleDrawCreated}
              onDrawDeleted={handleDrawDeleted}
            />
          )}

          {/* Distance Measurement */}
          {measureMode && (
            <DistanceMeasurement
              enabled={measureMode}
              onDistanceCalculated={setMeasurementData}
            />
          )}

          {/* Heat Map Mode */}
          {viewMode === 'heatmap' && heatMapPoints.length > 0 && (
            <HeatMapLayer points={heatMapPoints} intensity={0.8} radius={30} />
          )}

          {/* Cluster Mode */}
          {viewMode === 'cluster' && (
            <MarkerClusterGroup
              chunkedLoading
              spiderfyOnMaxZoom
              showCoverageOnHover
              maxClusterRadius={50}
            >
              {markers.map(marker => (
                <Marker
                  key={marker.id}
                  position={marker.position}
                  icon={marker.icon}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-bold text-sm mb-1">{marker.title}</h3>
                      <p className="text-xs text-slate-600">{marker.subtitle}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          )}

          {/* Regular Markers Mode */}
          {viewMode === 'markers' && markers.map(marker => (
            <Marker
              key={marker.id}
              position={marker.position}
              icon={marker.icon}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-sm mb-1">{marker.title}</h3>
                  <p className="text-xs text-slate-600 mb-2">{marker.subtitle}</p>
                  {marker.severity === 'critical' && (
                    <p className="text-red-600 font-bold text-xs">⚠️ CRITICAL</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Critical Emergency Circles */}
          {viewMode !== 'heatmap' && markers
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

        {/* Info Panel */}
        {!fullscreen && (
          <div className="absolute bottom-4 left-4 z-[1000] p-3 rounded-lg bg-white/90 backdrop-blur-sm shadow-lg">
            <div className="text-xs font-semibold text-slate-700 mb-2">Statistics</div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="font-bold text-cyan-600">{markers.filter(m => m.type === 'eia').length}</div>
                <div className="text-slate-600">EIA</div>
              </div>
              <div>
                <div className="font-bold text-purple-600">{markers.filter(m => m.type === 'license').length}</div>
                <div className="text-slate-600">Licenses</div>
              </div>
              <div>
                <div className="font-bold text-red-600">{markers.filter(m => m.type === 'emergency').length}</div>
                <div className="text-slate-600">Emergencies</div>
              </div>
              <div>
                <div className="font-bold text-green-600">{markers.filter(m => m.type === 'compliance').length}</div>
                <div className="text-slate-600">Compliance</div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-slate-600">
              Mode: <span className="font-semibold">{viewMode}</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdvancedGISMapViewer;
