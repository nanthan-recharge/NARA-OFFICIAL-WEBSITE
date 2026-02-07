import React, { useEffect, useRef, useState } from 'react';

const SriLankaEEZMap = ({ className = '', showMarkers = true }) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let map = null;
    let eezCircle = null;

    const initMap = async () => {
      try {
        // Try to get API key from environment, fallback to hardcoded for production
        const apiKey =
          import.meta.env.VITE_GOOGLE_MAPS_KEY || 'AIzaSyBuK3N924LRtseewgj_PNjdEOarlkax2pI';
        
        console.log('🔍 DEBUG: Checking API key...');
        console.log('🔍 DEBUG: API key exists?', !!apiKey);
        console.log('🔍 DEBUG: API key length:', apiKey?.length || 0);
        console.log('🔍 DEBUG: API key first 20 chars:', apiKey?.substring(0, 20) || 'NONE');
        
        if (!apiKey) {
          console.error('❌ FATAL: Google Maps API key not found!');
          setError('Map visualization unavailable. API key not configured.');
          setMapLoaded(true);
          return;
        }
        
        console.log('🗺️ Initializing Google Maps...');
        console.log('📍 API Key configured - Length:', apiKey.length);
        
        // Check if Google Maps is already loaded
        const mapId = import.meta.env.VITE_GOOGLE_MAP_ID;
        const shouldLoadMarkerLibrary = Boolean(mapId);

        if (!window.google?.maps) {
          console.log('⏳ Loading Google Maps API...');
          const existingScript = document.querySelector('script[data-google-maps]');

          if (!existingScript) {
            const script = document.createElement('script');
            const params = new URLSearchParams({
              key: apiKey,
              loading: 'async'
            });
            if (shouldLoadMarkerLibrary) {
              params.set('libraries', 'marker');
            }
            script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
            script.async = true;
            script.defer = true;
            script.setAttribute('loading', 'async');
            script.setAttribute('data-google-maps', 'true');

            await new Promise((resolve, reject) => {
              script.onerror = (err) => {
                console.error('❌ Failed to load Google Maps API:', err);
                reject(new Error('Failed to load Google Maps. Please check your API key.'));
              };

              script.onload = () => {
                console.log('✅ Google Maps script loaded, waiting for Maps API...');
                // Wait for google.maps.Map to be available
                const checkMapsReady = setInterval(() => {
                  if (window.google?.maps?.Map) {
                    clearInterval(checkMapsReady);
                    console.log('✅ Google Maps API fully initialized');
                    resolve();
                  }
                }, 50);

                // Timeout after 10 seconds
                setTimeout(() => {
                  clearInterval(checkMapsReady);
                  if (!window.google?.maps?.Map) {
                    reject(new Error('Google Maps API initialization timeout'));
                  }
                }, 10000);
              };

              document.head.appendChild(script);
            });
          } else {
            await new Promise((resolve) => {
              if (window.google?.maps?.Map) {
                resolve();
              } else {
                // Wait for Maps API to be fully ready
                const checkMapsReady = setInterval(() => {
                  if (window.google?.maps?.Map) {
                    clearInterval(checkMapsReady);
                    resolve();
                  }
                }, 50);

                // Also listen for script load if it hasn't loaded yet
                existingScript.addEventListener('load', () => {
                  const checkAfterLoad = setInterval(() => {
                    if (window.google?.maps?.Map) {
                      clearInterval(checkAfterLoad);
                      resolve();
                    }
                  }, 50);
                }, { once: true });
              }
            });
          }
        } else {
          console.log('✅ Google Maps API already loaded');
        }

        if (!mapRef.current) {
          console.log('⚠️ Map container ref not ready');
          return;
        }

        // Final check to ensure Google Maps API is fully loaded
        if (!window.google?.maps?.Map) {
          console.error('❌ Google Maps API not fully initialized');
          setError('Map failed to load. Please refresh the page.');
          setMapLoaded(true);
          return;
        }

        // Sri Lanka center coordinates (shifted up)
        const sriLankaCenter = { lat: 7.6, lng: 80.7718 };
        
        // Dark ocean theme styling
        const darkOceanStyles = [
          { elementType: 'geometry', stylers: [{ color: '#0a1929' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#64b5f6' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#0a1929' }] },
          {
            featureType: 'administrative',
            elementType: 'geometry',
            stylers: [{ color: '#1e3a5f' }]
          },
          {
            featureType: 'administrative.country',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#22d3ee', weight: 1.5 }]
          },
          {
            featureType: 'administrative.country',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'administrative.locality',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'administrative.neighborhood',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#132f4c' }]
          },
          {
            featureType: 'poi',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'road',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#001e3c' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#4fc3f7' }]
          }
        ];

        // Initialize map
        console.log('🗺️ Creating Google Map instance...');
        const mapOptions = {
          center: sriLankaCenter,
          zoom: 7.5,
          disableDefaultUI: true,
          gestureHandling: 'none',
          draggable: false,
          scrollwheel: false,
          disableDoubleClickZoom: true,
          styles: darkOceanStyles,
          backgroundColor: '#001e3c',
          mapTypeId: 'terrain'
        };

        if (mapId) {
          mapOptions.mapId = mapId;
        }

        map = new window.google.maps.Map(mapRef.current, mapOptions);
        console.log('✅ Map instance created - focused on Sri Lanka only');

        // Sri Lanka's ACTUAL EEZ boundary coordinates (follows coastline at 200nm)
        const eezBoundaryCoords = [
          // Northern boundary (near India)
          { lat: 11.5, lng: 78.5 },
          { lat: 11.8, lng: 79.5 },
          { lat: 12.0, lng: 80.5 },
          { lat: 11.5, lng: 81.5 },
          { lat: 11.0, lng: 82.0 },
          
          // Eastern boundary (Bay of Bengal)
          { lat: 10.0, lng: 83.5 },
          { lat: 9.0, lng: 84.5 },
          { lat: 8.0, lng: 85.0 },
          { lat: 7.0, lng: 85.5 },
          { lat: 6.0, lng: 85.5 },
          { lat: 5.0, lng: 85.0 },
          
          // Southern boundary (Indian Ocean)
          { lat: 4.0, lng: 84.0 },
          { lat: 3.5, lng: 83.0 },
          { lat: 3.5, lng: 82.0 },
          { lat: 3.5, lng: 81.0 },
          { lat: 3.5, lng: 80.0 },
          { lat: 4.0, lng: 79.0 },
          
          // Western boundary (Arabian Sea / Laccadive Sea)
          { lat: 4.5, lng: 78.0 },
          { lat: 5.5, lng: 77.0 },
          { lat: 6.5, lng: 76.5 },
          { lat: 7.5, lng: 76.5 },
          { lat: 8.5, lng: 77.0 },
          { lat: 9.5, lng: 77.5 },
          { lat: 10.5, lng: 78.0 }
        ];
        
        // Simple subtle EEZ boundary (no glow, minimal)
        console.log('🌊 Drawing simple EEZ boundary...');
        const closedPath = [...eezBoundaryCoords, eezBoundaryCoords[0]];

        eezCircle = new window.google.maps.Polyline({
          map,
          path: closedPath,
          strokeColor: '#22d3ee',
          strokeOpacity: 0.4,
          strokeWeight: 2,
          clickable: false
        });
        
        console.log('✅ Simple boundary added');

        // Add NARA office and branch markers if enabled
        if (showMarkers) {
          const stations = [
            {
              lat: 6.9271,
              lng: 79.8612,
              name: 'NARA Head Office',
              address: 'Nara Rd, Colombo 01500',
              type: 'headquarters'
            },
            {
              lat: 8.2167,
              lng: 79.7697,
              name: 'Nara Regional Center Kalpitiya',
              address: 'Kalpitiya',
              type: 'regional'
            },
            {
              lat: 5.9592,
              lng: 80.3743,
              name: 'NARA Regional Research Center',
              address: 'Kapparathota, Weligama',
              type: 'regional'
            },
            {
              lat: 6.6820,
              lng: 79.9290,
              name: 'NARA Regional Research Centre',
              address: 'Panapitiya, Wadduwa',
              type: 'regional'
            },
            {
              lat: 6.0050,
              lng: 80.7889,
              name: 'NARA Regional Research Centre',
              address: 'Rekawa, Tangalle',
              type: 'regional'
            },
            {
              lat: 6.4783,
              lng: 79.9834,
              name: 'Center for Ocean and Fisheries Information (COFI)',
              address: 'Galle Rd, Beruwala',
              type: 'center'
            },
            {
              lat: 9.4040,
              lng: 80.1622,
              name: 'NARA Regional Center Poonakary',
              address: 'Pooneryn',
              type: 'regional'
            }
          ];

          const supportsAdvancedMarkers =
            !!mapId && !!window.google?.maps?.marker?.AdvancedMarkerElement;

          stations.forEach((station) => {
            const position = { lat: station.lat, lng: station.lng };

            // Different colors for different types
            const markerColors = {
              headquarters: { color: '#22d3ee', shadow: 'rgba(34, 211, 238, 0.6)', size: 16 },
              regional: { color: '#f97316', shadow: 'rgba(249, 115, 22, 0.6)', size: 12 },
              center: { color: '#3b82f6', shadow: 'rgba(59, 130, 246, 0.6)', size: 12 }
            };

            const markerStyle = markerColors[station.type] || markerColors.regional;

            if (supportsAdvancedMarkers) {
              const content = document.createElement('div');
              content.style.width = `${markerStyle.size}px`;
              content.style.height = `${markerStyle.size}px`;
              content.style.borderRadius = '50%';
              content.style.background = markerStyle.color;
              content.style.border = '2px solid #fff';
              content.style.boxShadow = `0 0 8px ${markerStyle.shadow}`;
              content.style.cursor = 'pointer';
              content.title = `${station.name}\n${station.address}`;

              new window.google.maps.marker.AdvancedMarkerElement({
                position,
                map,
                title: `${station.name}\n${station.address}`,
                content
              });
            } else {
              new window.google.maps.Marker({
                position,
                map,
                title: `${station.name}\n${station.address}`,
                icon: {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: markerStyle.size / 2,
                  fillColor: markerStyle.color,
                  fillOpacity: 0.9,
                  strokeColor: '#ffffff',
                  strokeWeight: 2
                }
              });
            }
          });
        }

        setMapLoaded(true);
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load map. Please check your API key.');
      }
    };

    initMap();

    // Cleanup
    return () => {
      if (eezCircle) eezCircle.setMap(null);
    };
  }, [showMarkers]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ minHeight: '600px' }}
      />
      {!mapLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-cyan-300 text-sm">Loading sovereign waters...</span>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 rounded-lg">
          <div className="text-center px-4">
            <p className="text-red-400 text-sm mb-2">{error}</p>
            <p className="text-slate-400 text-xs">Using fallback visualization</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SriLankaEEZMap;
