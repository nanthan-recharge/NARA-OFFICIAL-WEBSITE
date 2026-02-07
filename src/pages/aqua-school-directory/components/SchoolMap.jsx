import React, { useEffect, useRef, useState } from 'react';
import { School, MapPin, Users } from 'lucide-react';

const SchoolMap = ({ schools = [], t }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY || 'AIzaSyBjDI-36r6TA4UAimHENGrK8NP8jh5d7Sg';

        // Load Google Maps if not already loaded
        if (!window.google?.maps) {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
          script.async = true;
          script.defer = true;

          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        if (!mapRef.current) return;

        // Sri Lanka center
        const sriLanka = { lat: 7.8731, lng: 80.7718 };

        // Create map
        const googleMap = new window.google.maps.Map(mapRef.current, {
          center: sriLanka,
          zoom: 7,
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#0a1929' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#001e3c' }] },
            { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#64b5f6' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e3a5f' }] }
          ],
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false
        });

        setMap(googleMap);

        // Add markers for schools
        schools.forEach((school, index) => {
          // Try to get coordinates
          const lat = parseFloat(school.Latitude || school.lat || school.latitude);
          const lng = parseFloat(school.Longitude || school.lng || school.longitude);

          if (!isNaN(lat) && !isNaN(lng)) {
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map: googleMap,
              title: school['School Name'] || school.name || school.Name,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#06b6d4',
                fillOpacity: 0.8,
                strokeColor: '#ffffff',
                strokeWeight: 2
              }
            });

            // Add click listener
            marker.addListener('click', () => {
              setSelectedSchool(school);
            });
          }
        });

      } catch (error) {
        console.error('Error loading map:', error);
      }
    };

    initMap();
  }, [schools]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-900/60 backdrop-blur">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-[600px]" />

      {/* School Info Overlay */}
      {selectedSchool && (
        <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-96 p-4 rounded-xl bg-slate-900/95 border border-cyan-500/30 backdrop-blur-sm">
          <button
            onClick={() => setSelectedSchool(null)}
            className="absolute top-2 right-2 p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            ×
          </button>
          
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
              <School className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-white font-space mb-1">
                {selectedSchool['School Name'] || selectedSchool.name || selectedSchool.Name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-slate-300 mb-2">
                <MapPin className="w-3 h-3" />
                <span>{selectedSchool.District || selectedSchool.district || selectedSchool.Location}</span>
              </div>
              {(selectedSchool.Students || selectedSchool.students) && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Users className="w-4 h-4" />
                  <span>{(selectedSchool.Students || selectedSchool.students).toLocaleString()} {t('card.students', 'Students')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute top-4 right-4 p-4 rounded-xl bg-slate-900/95 border border-slate-700/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-cyan-500 border-2 border-white" />
          <span className="text-xs text-slate-300">{t('map.schoolLocation', 'School Location')}</span>
        </div>
        <div className="text-xs text-slate-400">
          {t('map.totalShowing', 'Showing')} {schools.filter(s => s.Latitude || s.lat).length} {t('map.schools', 'schools')}
        </div>
      </div>
    </div>
  );
};

export default SchoolMap;
