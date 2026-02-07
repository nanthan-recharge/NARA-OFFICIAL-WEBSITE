import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useLoadScript } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBjDI-36r6TA4UAimHENGrK8NP8jh5d7Sg';
const GOOGLE_MAPS_LIBRARIES = ['places', 'geometry', 'marker'];

const RegionalCentersPage = () => {
  const { t, i18n } = useTranslation('regionalCenters');
  const [selectedCenter, setSelectedCenter] = useState('kadolkele');
  const [activeTab, setActiveTab] = useState('overview');
  const [userLocation, setUserLocation] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES
  });

  console.log('Google Maps Load Status:', { isLoaded, loadError });

  useEffect(() => {
    window.scrollTo(0, 0);
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, []);

  const hero = t('regionalCenters.hero', { returnObjects: true });
  const stats = t('regionalCenters.stats', { returnObjects: true });
  const centers = t('regionalCenters.centers', { returnObjects: true });
  const cta = t('regionalCenters.cta', { returnObjects: true });
  const tabs = t('regionalCenters.tabs', { returnObjects: true });
  const sections = t('regionalCenters.sections', { returnObjects: true });

  const centerKeys = ['kadolkele', 'kalpitiya', 'kapparathota', 'panapitiya', 'rekawa'];
  const statsArray = Object.entries(stats || {}).map(([key, value]) => ({
    ...value,
    key
  }));

  const currentCenter = centers[selectedCenter] || {};

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  useEffect(() => {
    if (isLoaded && mapRef.current && currentCenter?.coordinates && activeTab === 'map') {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        initializeMap();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, selectedCenter, activeTab, showDirections, userLocation, currentCenter]);

  const initializeMap = () => {
    console.log('Initializing map...', {
      hasGoogle: !!window.google,
      hasMapRef: !!mapRef.current,
      hasCoords: !!currentCenter?.coordinates,
      isLoaded
    });

    if (!window.google || !mapRef.current || !currentCenter?.coordinates) {
      console.error('Map initialization failed - missing requirements');
      return;
    }

    const centerCoords = {
      lat: currentCenter.coordinates.lat,
      lng: currentCenter.coordinates.lng
    };

    console.log('Creating map with coords:', centerCoords);

    // Initialize map
    const map = new window.google.maps.Map(mapRef.current, {
      center: centerCoords,
      zoom: 14,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        }
      ]
    });

    mapInstanceRef.current = map;

    // Create custom NARA marker with spinning logo
    const markerDiv = document.createElement('div');
    markerDiv.innerHTML = `
      <div style="position: relative; width: 60px; height: 80px; display: flex; flex-direction: column; align-items: center;">
        <div style="
          width: 50px;
          height: 50px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          animation: spin 3s linear infinite;
          border: 3px solid #0066CC;
        ">
          <img src="/assets/nara-logo.png" alt="NARA" style="width: 35px; height: 35px; object-fit: contain;" />
        </div>
        <div style="
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 12px solid #0066CC;
          margin-top: -2px;
        "></div>
        <div style="
          position: absolute;
          bottom: -25px;
          background: rgba(0, 102, 204, 0.95);
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        ">${currentCenter.name.split('–')[1]?.trim()}</div>
      </div>
      <style>
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      </style>
    `;

    // Use standard marker if AdvancedMarkerElement not available
    if (window.google.maps.marker?.AdvancedMarkerElement) {
      new window.google.maps.marker.AdvancedMarkerElement({
        position: centerCoords,
        map: map,
        content: markerDiv,
        title: currentCenter.name
      });
    } else {
      // Fallback to standard marker with custom icon
      new window.google.maps.Marker({
        position: centerCoords,
        map: map,
        icon: {
          url: '/assets/nara-logo.png',
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 40)
        },
        title: currentCenter.name
      });
    }

    // Info window
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 12px; font-family: 'Inter', sans-serif;">
          <h3 style="margin: 0 0 8px 0; color: #0066CC; font-size: 16px; font-weight: 700;">
            ${currentCenter.name}
          </h3>
          <p style="margin: 0 0 6px 0; color: #333; font-size: 13px;">
            <strong>📍 ${currentCenter.location}</strong>
          </p>
          <p style="margin: 0 0 8px 0; color: #666; font-size: 12px;">
            ${currentCenter.tagline}
          </p>
          <p style="margin: 0; color: #888; font-size: 11px;">
            ${currentCenter.distance}
          </p>
        </div>
      `,
      position: centerCoords
    });

    infoWindow.open(map);

    // Show directions if user location available and requested
    if (showDirections && userLocation) {
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#0066CC',
          strokeWeight: 5,
          strokeOpacity: 0.8
        }
      });

      directionsService.route(
        {
          origin: userLocation,
          destination: centerCoords,
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === 'OK') {
            directionsRenderer.setDirections(result);
          }
        }
      );
    } else if (userLocation) {
      // Show user location marker
      new window.google.maps.Marker({
        position: userLocation,
        map: map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 2
        },
        title: 'Your Location'
      });
    }
  };

  const getGoogleMapsLink = (lat, lng) => {
    if (userLocation) {
      return `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${lat},${lng}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-teal-500/10 to-cyan-400/10" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <motion.div
          className="max-w-7xl mx-auto relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
              <Icons.MapPin className="w-4 h-4" />
              {hero?.badge}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              {hero?.title}
            </h1>
            <p className="text-xl md:text-2xl text-emerald-600 font-semibold mb-6">
              {hero?.headline}
            </p>
            <p className="text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed">
              {hero?.description}
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {statsArray.map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* All Centers Map Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-white to-emerald-50 rounded-3xl overflow-hidden shadow-2xl p-8"
          >
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-slate-900 mb-3 flex items-center gap-3">
                <Icons.MapPinned className="w-8 h-8 text-emerald-600" />
                All NARA Regional Research Centers
              </h2>
              <p className="text-slate-600">Interactive map showing all 5 regional research centers across Sri Lanka</p>
            </div>

            {/* All Centers Map */}
            <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-lg border-4 border-emerald-200 bg-white relative">
              {loadError ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
                  <div className="text-center p-8">
                    <Icons.AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
                    <p className="text-lg font-semibold text-slate-900 mb-2">Map Loading Error</p>
                    <p className="text-sm text-slate-600">Please check Google Maps API configuration</p>
                  </div>
                </div>
              ) : !isLoaded ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100">
                  <div className="text-center">
                    <Icons.Loader className="w-12 h-12 mx-auto mb-4 text-emerald-600 animate-spin" />
                    <p className="text-lg font-semibold text-slate-900">Loading Sri Lanka Research Centers Map...</p>
                  </div>
                </div>
              ) : (
                <div
                  ref={(el) => {
                    if (el && isLoaded && !mapInstanceRef.current) {
                      // Initialize map showing all Sri Lanka with all centers
                      const sriLankaCenter = { lat: 7.8731, lng: 80.7718 };
                      const map = new window.google.maps.Map(el, {
                        center: sriLankaCenter,
                        zoom: 7,
                        mapTypeControl: true,
                        streetViewControl: true,
                        fullscreenControl: true,
                        zoomControl: true
                      });

                      mapInstanceRef.current = map;

                      // Add markers for all centers
                      const bounds = new window.google.maps.LatLngBounds();

                      centerKeys.forEach((key, index) => {
                        const center = centers[key];
                        if (center?.coordinates) {
                          const position = {
                            lat: center.coordinates.lat,
                            lng: center.coordinates.lng
                          };

                          bounds.extend(position);

                          // Create custom marker for each center
                          const markerDiv = document.createElement('div');
                          markerDiv.innerHTML = `
                            <div style="position: relative; width: 60px; height: 80px; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
                              <div style="
                                width: 50px;
                                height: 50px;
                                background: white;
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                                border: 3px solid #10b981;
                              ">
                                <span style="font-size: 24px; font-weight: bold; color: #10b981;">${index + 1}</span>
                              </div>
                              <div style="
                                width: 0;
                                height: 0;
                                border-left: 8px solid transparent;
                                border-right: 8px solid transparent;
                                border-top: 12px solid #10b981;
                                margin-top: -2px;
                              "></div>
                              <div style="
                                position: absolute;
                                bottom: -30px;
                                background: rgba(16, 185, 129, 0.95);
                                color: white;
                                padding: 4px 12px;
                                border-radius: 12px;
                                font-size: 11px;
                                font-weight: 600;
                                white-space: nowrap;
                                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                              ">${center.name.split('–')[1]?.trim()}</div>
                            </div>
                          `;

                          // Info window content
                          const infoContent = `
                            <div style="padding: 12px; font-family: 'Inter', sans-serif; max-width: 300px;">
                              <h3 style="margin: 0 0 8px 0; color: #10b981; font-size: 16px; font-weight: 700;">
                                ${center.name}
                              </h3>
                              <p style="margin: 0 0 6px 0; color: #333; font-size: 13px;">
                                <strong>📍 ${center.location}</strong>
                              </p>
                              <p style="margin: 0 0 8px 0; color: #666; font-size: 12px;">
                                ${center.tagline}
                              </p>
                              <p style="margin: 0; color: #888; font-size: 11px;">
                                ${center.distance}
                              </p>
                              <button
                                onclick="window.scrollTo(0, 800); document.querySelector('[data-center-id=\\'${key}\\']')?.click();"
                                style="
                                  margin-top: 10px;
                                  padding: 6px 12px;
                                  background: linear-gradient(to right, #10b981, #14b8a6);
                                  color: white;
                                  border: none;
                                  border-radius: 8px;
                                  font-weight: 600;
                                  cursor: pointer;
                                  font-size: 12px;
                                "
                              >View Details →</button>
                            </div>
                          `;

                          const infoWindow = new window.google.maps.InfoWindow({
                            content: infoContent
                          });

                          // Use Advanced Marker if available
                          if (window.google.maps.marker?.AdvancedMarkerElement) {
                            const marker = new window.google.maps.marker.AdvancedMarkerElement({
                              position: position,
                              map: map,
                              content: markerDiv,
                              title: center.name
                            });

                            marker.addListener('click', () => {
                              infoWindow.open(map, marker);
                            });
                          } else {
                            // Fallback to standard marker
                            const marker = new window.google.maps.Marker({
                              position: position,
                              map: map,
                              label: {
                                text: `${index + 1}`,
                                color: 'white',
                                fontWeight: 'bold'
                              },
                              icon: {
                                path: window.google.maps.SymbolPath.CIRCLE,
                                scale: 25,
                                fillColor: '#10b981',
                                fillOpacity: 1,
                                strokeColor: 'white',
                                strokeWeight: 3
                              },
                              title: center.name
                            });

                            marker.addListener('click', () => {
                              infoWindow.open(map, marker);
                            });
                          }
                        }
                      });

                      // Fit map to show all centers
                      map.fitBounds(bounds);

                      // Add some padding
                      const padding = { top: 50, right: 50, bottom: 50, left: 50 };
                      map.fitBounds(bounds, padding);
                    }
                  }}
                  className="w-full h-full"
                />
              )}
            </div>

            {/* Centers Legend */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
              {centerKeys.map((key, index) => {
                const center = centers[key];
                return (
                  <div
                    key={key}
                    className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">
                        {center?.name?.split('–')[1]?.trim()}
                      </div>
                      <div className="text-xs text-slate-600 truncate">
                        {center?.location}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Centers Navigation */}
      <section className="py-8 px-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-y border-emerald-100">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-slate-900 mb-6">Select a Center for Detailed Information</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {centerKeys.map((key) => {
              const center = centers[key];
              const isActive = selectedCenter === key;

              return (
                <motion.button
                  key={key}
                  data-center-id={key}
                  onClick={() => {
                    setSelectedCenter(key);
                    setActiveTab('overview');
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                      : 'bg-white text-slate-700 hover:bg-emerald-100 border-2 border-emerald-200'
                  }`}
                >
                  <Icons.Building2 className="w-4 h-4" />
                  <span className="text-sm">{center?.name?.split('–')[1]?.trim()}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Center Details */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCenter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Center Hero Card */}
              <div className="bg-gradient-to-br from-white to-emerald-50 rounded-3xl overflow-hidden shadow-2xl">
                {/* Center Image */}
                <div className="relative h-96 bg-gradient-to-br from-emerald-500 to-teal-600 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white p-8">
                      <Icons.Image className="w-24 h-24 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">{sections?.centerImage}</p>
                      <p className="text-sm opacity-75 mt-2">{sections?.uploadImage}</p>
                    </div>
                  </div>
                  {/* Decorative overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                <div className="p-8 md:p-12">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Icons.MapPin className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                        {currentCenter?.name}
                      </h2>
                      <p className="text-xl text-emerald-600 font-semibold mb-4">
                        {currentCenter?.tagline}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
                        <span className="flex items-center gap-2">
                          <Icons.MapPin className="w-4 h-4 text-emerald-600" />
                          {currentCenter?.location}
                        </span>
                        <span className="flex items-center gap-2">
                          <Icons.Navigation className="w-4 h-4 text-emerald-600" />
                          {currentCenter?.distance}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        {currentCenter?.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="flex flex-wrap gap-3 bg-white rounded-2xl p-4 shadow-md">
                {['overview', 'objectives', 'staff', 'research', 'map'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tabs?.[tab] || tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      {currentCenter?.mainObjectives && (
                        <div className="bg-white rounded-3xl p-8 shadow-xl">
                          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <Icons.Target className="w-7 h-7 text-emerald-600" />
                            {sections?.mainObjectives}
                          </h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            {currentCenter.mainObjectives.map((objective, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-3 p-4 rounded-xl hover:bg-emerald-50 transition-colors"
                              >
                                <Icons.CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <span className="text-slate-700">{objective}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {currentCenter?.services && currentCenter.services.length > 0 && (
                        <div className="bg-white rounded-3xl p-8 shadow-xl">
                          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <Icons.Briefcase className="w-7 h-7 text-teal-600" />
                            {sections?.servicesOffered}
                          </h3>
                          <div className="grid md:grid-cols-2 gap-6">
                            {currentCenter.services.map((service, index) => (
                              <div
                                key={index}
                                className="p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100"
                              >
                                <h4 className="text-lg font-bold text-slate-900 mb-2">
                                  {service.title}
                                </h4>
                                <p className="text-slate-600 mb-3">{service.description}</p>
                                {service.contact && (
                                  <p className="text-sm text-emerald-600 font-medium flex items-center gap-2">
                                    <Icons.Phone className="w-4 h-4" />
                                    {service.contact}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Objectives Tab */}
                  {activeTab === 'objectives' && (
                    <div className="space-y-6">
                      {currentCenter?.objectives && (
                        <div className="bg-white rounded-3xl p-8 shadow-xl">
                          <h3 className="text-2xl font-bold text-slate-900 mb-6">{sections?.objectives}</h3>
                          <div className="space-y-3">
                            {currentCenter.objectives.map((obj, index) => (
                              <div key={index} className="flex items-start gap-3 p-4 rounded-xl hover:bg-emerald-50 transition-colors">
                                <Icons.ChevronRight className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <span className="text-slate-700">{obj}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {currentCenter?.specificActivities && (
                        <div className="bg-white rounded-3xl p-8 shadow-xl">
                          <h3 className="text-2xl font-bold text-slate-900 mb-6">{sections?.specificActivities}</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            {currentCenter.specificActivities.map((activity, index) => (
                              <div key={index} className="flex items-start gap-3 p-4 rounded-xl hover:bg-emerald-50 transition-colors">
                                <Icons.Activity className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                                <span className="text-slate-700">{activity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {currentCenter?.currentActivities && (
                        <div className="bg-white rounded-3xl p-8 shadow-xl">
                          <h3 className="text-2xl font-bold text-slate-900 mb-6">{sections?.currentActivities}</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            {currentCenter.currentActivities.map((activity, index) => (
                              <div key={index} className="flex items-start gap-3 p-4 rounded-xl hover:bg-emerald-50 transition-colors">
                                <Icons.Zap className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <span className="text-slate-700">{activity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Staff Tab */}
                  {activeTab === 'staff' && currentCenter?.staff && (
                    <div className="bg-white rounded-3xl p-8 shadow-xl">
                      <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <Icons.Users className="w-7 h-7 text-emerald-600" />
                        {sections?.staffMembers}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        {currentCenter.staff.map((member, index) => (
                          <div
                            key={index}
                            className="p-6 rounded-xl bg-gradient-to-br from-slate-50 to-emerald-50 border border-emerald-100"
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
                                <Icons.User className="w-8 h-8 text-white" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-lg font-bold text-slate-900 mb-1">
                                  {member.name}
                                </h4>
                                <p className="text-emerald-600 font-medium text-sm mb-3">
                                  {member.designation}
                                </p>
                                <div className="space-y-1">
                                  {member.email && (
                                    <a
                                      href={`mailto:${member.email}`}
                                      className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition-colors"
                                    >
                                      <Icons.Mail className="w-4 h-4" />
                                      <span className="truncate">{member.email}</span>
                                    </a>
                                  )}
                                  {member.phone && (
                                    <a
                                      href={`tel:${member.phone}`}
                                      className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition-colors"
                                    >
                                      <Icons.Phone className="w-4 h-4" />
                                      <span>{member.phone}</span>
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Research Tab */}
                  {activeTab === 'research' && currentCenter?.projects && (
                    <div className="bg-white rounded-3xl p-8 shadow-xl">
                      <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <Icons.FlaskConical className="w-7 h-7 text-emerald-600" />
                        {sections?.researchProjects}
                      </h3>
                      <div className="space-y-6">
                        {currentCenter.projects.map((project, index) => (
                          <div
                            key={index}
                            className="p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border-l-4 border-emerald-600"
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
                                {project.code}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-lg font-bold text-slate-900 leading-relaxed">
                                  {project.title}
                                </h4>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Map Tab */}
                  {activeTab === 'map' && currentCenter?.coordinates && (
                    <div className="bg-white rounded-3xl p-8 shadow-xl">
                      <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <Icons.Map className="w-7 h-7 text-emerald-600" />
                        {sections?.locationMap}
                      </h3>
                      <div className="space-y-6">
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6">
                          <div className="grid md:grid-cols-3 gap-4 mb-6">
                            <div className="flex items-center gap-3">
                              <Icons.MapPin className="w-5 h-5 text-emerald-600" />
                              <div>
                                <div className="text-sm text-slate-500">{sections?.location}</div>
                                <div className="font-semibold text-slate-900">{currentCenter.location}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Icons.Navigation className="w-5 h-5 text-emerald-600" />
                              <div>
                                <div className="text-sm text-slate-500">{sections?.distance}</div>
                                <div className="font-semibold text-slate-900">{currentCenter.distance}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Icons.Globe className="w-5 h-5 text-emerald-600" />
                              <div>
                                <div className="text-sm text-slate-500">{sections?.coordinates}</div>
                                <div className="font-semibold text-slate-900 text-xs">
                                  {currentCenter.coordinates.lat}, {currentCenter.coordinates.lng}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <a
                              href={getGoogleMapsLink(currentCenter.coordinates.lat, currentCenter.coordinates.lng)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
                            >
                              <Icons.ExternalLink className="w-5 h-5" />
                              {sections?.openInGoogleMaps}
                            </a>
                            {userLocation && (
                              <button
                                onClick={() => setShowDirections(!showDirections)}
                                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all ${
                                  showDirections
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                                    : 'bg-white text-emerald-600 border-2 border-emerald-600'
                                }`}
                              >
                                <Icons.Navigation className="w-5 h-5" />
                                {showDirections ? sections?.hideDirections : sections?.showDirections}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Advanced Google Maps with Custom Marker */}
                        <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg border border-emerald-200 bg-white relative">
                          {loadError ? (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
                              <div className="text-center p-8">
                                <Icons.AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
                                <p className="text-lg font-semibold text-slate-900 mb-2">{sections?.mapLoadError}</p>
                                <p className="text-sm text-slate-600">{sections?.checkApiKey}</p>
                              </div>
                            </div>
                          ) : !isLoaded ? (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100">
                              <div className="text-center">
                                <Icons.Loader className="w-12 h-12 mx-auto mb-4 text-emerald-600 animate-spin" />
                                <p className="text-lg font-semibold text-slate-900">{sections?.loadingMap}</p>
                              </div>
                            </div>
                          ) : (
                            <div ref={mapRef} className="w-full h-full" />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-emerald-600 to-teal-600 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {cta?.title}
          </h2>
          <p className="text-lg text-emerald-100 mb-8">
            {cta?.description}
          </p>
          <Link
            to="/contact-us"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-colors shadow-lg hover:shadow-xl"
          >
            <Icons.Mail className="w-5 h-5" />
            {cta?.button}
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default RegionalCentersPage;
