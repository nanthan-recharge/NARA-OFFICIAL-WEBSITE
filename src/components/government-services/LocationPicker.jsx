import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { motion } from 'framer-motion';
import { MapPin, X, Check, Navigation2 } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/**
 * Map Click Handler
 */
const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      });
    }
  });
  return null;
};

/**
 * Location Picker Component
 * Modal with interactive map for selecting coordinates
 */
const LocationPicker = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  initialLocation = null,
  title = "Select Location on Map"
}) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || {
    lat: 7.8731,
    lng: 80.7718
  });
  const [mapCenter] = useState(initialLocation || [7.8731, 80.7718]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleConfirm = () => {
    if (onConfirm && selectedLocation) {
      onConfirm(selectedLocation);
    }
    onClose();
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not get your current location. Please select manually on the map.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-cyan-600 to-blue-600 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              {title}
            </h2>
            <p className="text-cyan-100 text-sm mt-1">Click anywhere on the map to select coordinates</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Map Container */}
        <div className="relative h-[500px]">
          <MapContainer
            center={mapCenter}
            zoom={8}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapClickHandler onLocationSelect={handleLocationSelect} />
            
            {selectedLocation && (
              <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
            )}
          </MapContainer>

          {/* Current Location Button */}
          <button
            onClick={useCurrentLocation}
            className="absolute top-4 right-4 z-[1000] p-3 rounded-lg bg-white hover:bg-gray-50 shadow-lg transition-colors flex items-center gap-2"
            title="Use Current Location"
          >
            <Navigation2 className="w-5 h-5 text-slate-700" />
            <span className="text-sm font-medium text-slate-700">Use My Location</span>
          </button>
        </div>

        {/* Selected Coordinates Display */}
        <div className="p-6 bg-white/5 border-t border-white/10">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white mb-2">Selected Coordinates:</h3>
            {selectedLocation ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-slate-400 mb-1">Latitude</div>
                  <div className="text-lg font-mono font-bold text-white">
                    {selectedLocation.lat.toFixed(6)}°
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-slate-400 mb-1">Longitude</div>
                  <div className="text-lg font-mono font-bold text-white">
                    {selectedLocation.lng.toFixed(6)}°
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">Click on the map to select a location</p>
            )}
          </div>

          {/* Formatted Coordinates */}
          {selectedLocation && (
            <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 mb-4">
              <div className="text-xs text-cyan-300 mb-1">Copy this format:</div>
              <div className="font-mono text-sm text-white">
                {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedLocation}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-5 h-5" />
              Confirm Location
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LocationPicker;
