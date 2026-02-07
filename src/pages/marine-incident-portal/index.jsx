import React, { useState, useEffect, useRef, useMemo } from 'react';
import SEOHead from '../../components/shared/SEOHead';
import { useTranslation } from 'react-i18next';
import MultilingualContent from '../../components/compliance/MultilingualContent';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import {
  marineIncidentsService,
  citizenScienceService,
  marineIncidentDashboardService,
  marineIncidentFileService
} from '../../services/marineIncidentService';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const createCustomIcon = (color) =>
  L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

const incidentTypeIcons = {
  fish_kill: createCustomIcon('#ef4444'),
  stranding: createCustomIcon('#f97316'),
  algal_bloom: createCustomIcon('#22c55e'),
  pollution: createCustomIcon('#8b5cf6'),
  unusual_behavior: createCustomIcon('#3b82f6'),
  other: createCustomIcon('#6b7280')
};

const severityBadgeClasses = {
  low: 'bg-yellow-100 text-yellow-700',
  medium: 'bg-orange-100 text-orange-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700'
};

const statusBadgeClasses = {
  reported: 'bg-gray-100 text-gray-700',
  under_investigation: 'bg-blue-100 text-blue-700',
  resolved: 'bg-green-100 text-green-700'
};

const MarineIncidentPortal = () => {
  const { t, i18n } = useTranslation('marineIncident');
  const language = useMemo(() => (i18n.language || 'en').split('-')[0], [i18n.language]);

  const heroStrings = t('hero', { returnObjects: true });
  const tabLabels = t('tabs', { returnObjects: true });
  const quickActions = t('quickActions', { returnObjects: true });
  const sectionStrings = t('sections', { returnObjects: true });
  const labelStrings = t('labels', { returnObjects: true });
  const statusLabels = t('status', { returnObjects: true });
  const severityStrings = t('severity', { returnObjects: true });
  const incidentTypeLabels = t('incidentTypes', { returnObjects: true });
  const filterStrings = t('filters', { returnObjects: true });
  const alertStrings = t('alerts', { returnObjects: true });
  const reportFormStrings = t('forms.report', { returnObjects: true });
  const observationFormStrings = t('forms.observation', { returnObjects: true });
  const observationsViewStrings = t('observationsView', { returnObjects: true });
  const statusViewStrings = t('statusView', { returnObjects: true });
  const mapStrings = t('map', { returnObjects: true });

  const [activeView, setActiveView] = useState('home');
  const [incidents, setIncidents] = useState([]);
  const [observations, setObservations] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showObservationModal, setShowObservationModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [filters, setFilters] = useState({ incidentType: 'all', status: 'all', severity: 'all' });

  const [reportForm, setReportForm] = useState({
    incidentType: '',
    title: '',
    description: '',
    location: null,
    severity: 'medium',
    reporterName: '',
    reporterEmail: '',
    reporterPhone: '',
    photos: []
  });

  const [observationForm, setObservationForm] = useState({
    observationType: '',
    species: '',
    description: '',
    location: null,
    observerName: '',
    observerEmail: '',
    photos: []
  });

  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const observationFileInputRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [incidentsRes, observationsRes, dashboardRes] = await Promise.all([
        marineIncidentsService.getAll(),
        citizenScienceService.getAll(),
        marineIncidentDashboardService.getStatistics()
      ]);

      if (!incidentsRes.error) setIncidents(incidentsRes.data);
      if (!observationsRes.error) setObservations(observationsRes.data);
      if (!dashboardRes.error) setDashboardData(dashboardRes.data);
      setLoading(false);
    };

    load();
  }, []);

  const getCurrentLocation = (callback) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          callback({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        () => {
          alert(alertStrings.geolocationError);
        }
      );
    } else {
      alert(alertStrings.geolocationUnsupported);
    }
  };

  const handlePhotoUpload = async (files, formType = 'incident') => {
    if (!files || files.length === 0) return;
    setUploadingPhotos(true);

    try {
      if (formType === 'incident') {
        setReportForm((prev) => ({ ...prev, photos: [...prev.photos, ...Array.from(files)] }));
      } else {
        setObservationForm((prev) => ({ ...prev, photos: [...prev.photos, ...Array.from(files)] }));
      }
    } catch (error) {
      console.error('Error handling photos:', error);
      alert(alertStrings.photoError);
    } finally {
      setUploadingPhotos(false);
    }
  };

  const handleSubmitIncident = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: incident, error } = await marineIncidentsService.create({
        ...reportForm,
        photos: []
      });

      if (error) throw error;

      if (reportForm.photos.length > 0) {
        const upload = await marineIncidentFileService.uploadMultiplePhotos(reportForm.photos, incident.incidentId);
        if (!upload.error) {
          await marineIncidentsService.update(incident.id, {
            photos: upload.data.map((photo) => photo.url)
          });
        }
      }

      alert(t('alerts.incidentSuccess', { id: incident.incidentId }));
      setShowReportModal(false);
      setReportForm({
        incidentType: '',
        title: '',
        description: '',
        location: null,
        severity: 'medium',
        reporterName: '',
        reporterEmail: '',
        reporterPhone: '',
        photos: []
      });
      const refreshed = await marineIncidentsService.getAll();
      if (!refreshed.error) setIncidents(refreshed.data);
    } catch (error) {
      console.error('Error submitting incident:', error);
      alert(alertStrings.incidentFailure);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitObservation = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: observation, error } = await citizenScienceService.create({
        ...observationForm,
        photos: []
      });

      if (error) throw error;

      if (observationForm.photos.length > 0) {
        const upload = await marineIncidentFileService.uploadMultiplePhotos(observationForm.photos, observation.observationId);
        if (!upload.error) {
          await marineIncidentsService.update(observation.id, {
            photos: upload.data.map((photo) => photo.url)
          });
        }
      }

      alert(t('alerts.observationSuccess', { id: observation.observationId }));
      setShowObservationModal(false);
      setObservationForm({
        observationType: '',
        species: '',
        description: '',
        location: null,
        observerName: '',
        observerEmail: '',
        photos: []
      });
      const refreshed = await citizenScienceService.getAll();
      if (!refreshed.error) setObservations(refreshed.data);
    } catch (error) {
      console.error('Error submitting observation:', error);
      alert(alertStrings.observationFailure);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredIncidents = incidents.filter((incident) => {
    const matchesType = filters.incidentType === 'all' || incident.incidentType === filters.incidentType;
    const matchesStatus = filters.status === 'all' || incident.status === filters.status;
    const matchesSeverity = filters.severity === 'all' || incident.severity === filters.severity;
    return matchesType && matchesStatus && matchesSeverity;
  });

  // Emergency contact numbers
  const NARA_EMERGENCY_PHONE = '+94112521000';
  const NARA_WHATSAPP = '+94712345678'; // Update with actual WhatsApp number
  const NARA_EMAIL = 'emergency@nara.gov.lk';

  const openWhatsAppReport = () => {
    const message = encodeURIComponent(
      `🚨 MARINE INCIDENT REPORT\n\n` +
      `I would like to report a marine incident.\n\n` +
      `Type: [Please specify]\n` +
      `Location: [Please specify]\n` +
      `Description: [Please describe what you observed]\n\n` +
      `Contact: [Your name and phone]`
    );
    window.open(`https://wa.me/${NARA_WHATSAPP.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  const openPhoneCall = () => {
    window.location.href = `tel:${NARA_EMERGENCY_PHONE}`;
  };

  const openSMS = () => {
    const message = encodeURIComponent('MARINE INCIDENT: [Describe incident and location]');
    window.location.href = `sms:${NARA_EMERGENCY_PHONE}?body=${message}`;
  };

  const openEmail = () => {
    const subject = encodeURIComponent('Marine Incident Report');
    const body = encodeURIComponent(
      'Incident Type: \n' +
      'Location: \n' +
      'Date/Time: \n' +
      'Description: \n' +
      'Your Contact: '
    );
    window.location.href = `mailto:${NARA_EMAIL}?subject=${subject}&body=${body}`;
  };

  const tabs = useMemo(
    () => [
      { id: 'home', label: tabLabels.home, icon: Icons.Home },
      { id: 'report', label: tabLabels.report, icon: Icons.AlertTriangle },
      { id: 'map', label: tabLabels.map, icon: Icons.Map },
      { id: 'observations', label: tabLabels.observations, icon: Icons.Eye },
      { id: 'status', label: tabLabels.status, icon: Icons.Search }
    ],
    [tabLabels]
  );

  const quickActionCards = useMemo(
    () => [
      {
        key: 'report',
        gradient: 'from-red-500 to-orange-500',
        icon: Icons.AlertTriangle,
        onClick: () => setShowReportModal(true),
        strings: quickActions.report
      },
      {
        key: 'observe',
        gradient: 'from-blue-500 to-cyan-500',
        icon: Icons.Eye,
        onClick: () => setShowObservationModal(true),
        strings: quickActions.observe
      }
    ],
    [quickActions]
  );

  const incidentTypeLegend = useMemo(
    () => [
      { type: 'fish_kill', color: '#ef4444' },
      { type: 'stranding', color: '#f97316' },
      { type: 'algal_bloom', color: '#22c55e' },
      { type: 'pollution', color: '#8b5cf6' },
      { type: 'unusual_behavior', color: '#3b82f6' }
    ],
    []
  );

  const severitySelectOptions = useMemo(
    () => [
      { value: 'low', label: reportFormStrings.severityOptions.low },
      { value: 'medium', label: reportFormStrings.severityOptions.medium },
      { value: 'high', label: reportFormStrings.severityOptions.high },
      { value: 'critical', label: reportFormStrings.severityOptions.critical }
    ],
    [reportFormStrings.severityOptions]
  );

  const incidentTypeSelectOptions = useMemo(
    () => [
      { value: '', label: reportFormStrings.incidentTypePlaceholder },
      { value: 'fish_kill', label: reportFormStrings.incidentTypeOptions.fish_kill },
      { value: 'stranding', label: reportFormStrings.incidentTypeOptions.stranding },
      { value: 'algal_bloom', label: reportFormStrings.incidentTypeOptions.algal_bloom },
      { value: 'pollution', label: reportFormStrings.incidentTypeOptions.pollution },
      { value: 'unusual_behavior', label: reportFormStrings.incidentTypeOptions.unusual_behavior },
      { value: 'other', label: reportFormStrings.incidentTypeOptions.other }
    ],
    [reportFormStrings.incidentTypeOptions, reportFormStrings.incidentTypePlaceholder]
  );

  const observationTypeSelectOptions = useMemo(
    () => [
      { value: '', label: observationFormStrings.typePlaceholder },
      { value: 'stranding', label: observationFormStrings.typeOptions.stranding },
      { value: 'unusual_behavior', label: observationFormStrings.typeOptions.unusual_behavior },
      { value: 'species_sighting', label: observationFormStrings.typeOptions.species_sighting },
      { value: 'pollution', label: observationFormStrings.typeOptions.pollution },
      { value: 'other', label: observationFormStrings.typeOptions.other }
    ],
    [observationFormStrings.typeOptions, observationFormStrings.typePlaceholder]
  );

  const getStatusLabel = (status) => statusLabels[status] || status;
  const getSeverityLabel = (severity) => severityStrings[severity]?.label || severity;
  const getIncidentTypeLabel = (type) => incidentTypeLabels[type] || type;

  const renderHeroSection = () => (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 py-20 text-white">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0.1, scale: 0 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.5, 1],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50]
            }}
            transition={{ duration: 8 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 2 }}
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          >
            <Icons.Waves className="h-8 w-8 text-white/20" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-white/10 p-6 backdrop-blur-lg">
              <Icons.AlertTriangle className="h-16 w-16" />
            </div>
          </div>

          <h1 className="mb-4 text-5xl font-bold md:text-6xl">{heroStrings.title}</h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-blue-100">{heroStrings.subtitle}</p>

          {dashboardData && (
            <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-lg">
                <div className="text-3xl font-bold">{dashboardData.overview.totalIncidents}</div>
                <div className="text-sm text-blue-100">{heroStrings.stats.totalIncidents}</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-lg">
                <div className="text-3xl font-bold">{dashboardData.overview.activeIncidents}</div>
                <div className="text-sm text-blue-100">{heroStrings.stats.activeCases}</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-lg">
                <div className="text-3xl font-bold">{dashboardData.overview.totalObservations}</div>
                <div className="text-sm text-blue-100">{heroStrings.stats.observations}</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-lg">
                <div className="text-3xl font-bold">{dashboardData.overview.resolvedIncidents}</div>
                <div className="text-sm text-blue-100">{heroStrings.stats.resolved}</div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );

  const renderNavigationTabs = () => (
    <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 overflow-x-auto py-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex items-center space-x-2 whitespace-nowrap rounded-xl px-6 py-3 font-medium transition-all ${
                activeView === tab.id ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHomeView = () => (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Quick Contact Methods */}
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white shadow-xl">
        <h3 className="mb-4 text-2xl font-bold">🚨 Quick Report Options</h3>
        <p className="mb-4 text-emerald-50">Report an incident immediately using your preferred method:</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={openWhatsAppReport}
            className="flex items-center justify-center space-x-2 rounded-xl bg-white/20 px-4 py-3 font-semibold backdrop-blur-lg transition-all hover:bg-white/30 hover:scale-105"
          >
            <Icons.MessageCircle className="h-5 w-5" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={openPhoneCall}
            className="flex items-center justify-center space-x-2 rounded-xl bg-white/20 px-4 py-3 font-semibold backdrop-blur-lg transition-all hover:bg-white/30 hover:scale-105"
          >
            <Icons.Phone className="h-5 w-5" />
            <span>Call Now</span>
          </button>
          <button
            onClick={openSMS}
            className="flex items-center justify-center space-x-2 rounded-xl bg-white/20 px-4 py-3 font-semibold backdrop-blur-lg transition-all hover:bg-white/30 hover:scale-105"
          >
            <Icons.MessageSquare className="h-5 w-5" />
            <span>SMS</span>
          </button>
          <button
            onClick={openEmail}
            className="flex items-center justify-center space-x-2 rounded-xl bg-white/20 px-4 py-3 font-semibold backdrop-blur-lg transition-all hover:bg-white/30 hover:scale-105"
          >
            <Icons.Mail className="h-5 w-5" />
            <span>Email</span>
          </button>
        </div>
        <p className="mt-3 text-center text-sm text-emerald-100">Emergency: {NARA_EMERGENCY_PHONE}</p>
      </div>

      <div className="mb-12 grid gap-6 md:grid-cols-2">
        {quickActionCards.map((action) => (
          <motion.div
            key={action.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: action.key === 'observe' ? 0.1 : 0 }}
            className={`cursor-pointer rounded-3xl bg-gradient-to-br ${action.gradient} p-8 text-white shadow-lg transition-shadow hover:shadow-2xl`}
            onClick={action.onClick}
          >
            <action.icon className="mb-4 h-12 w-12" />
            <h3 className="mb-2 text-2xl font-bold">{action.strings.title}</h3>
            <p className="mb-4 text-blue-100">{action.strings.description}</p>
            <div className="flex items-center text-sm font-semibold">
              <span>{action.strings.cta}</span>
              <Icons.ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">{sectionStrings.recentIncidents}</h2>
          <button onClick={() => setActiveView('map')} className="flex items-center space-x-2 font-medium text-blue-600 transition-colors hover:text-blue-700">
            <span>{sectionStrings.viewOnMap}</span>
            <Icons.ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dashboardData?.recentIncidents.slice(0, 6).map((incident) => (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              className="cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:shadow-xl"
              onClick={() => {
                setSelectedIncident(incident);
                setActiveView('status');
              }}
            >
              {incident.photos && incident.photos.length > 0 && (
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-cyan-100">
                  <img src={incident.photos[0]} alt={incident.title} className="h-full w-full object-cover" />
                </div>
              )}

              <div className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${severityBadgeClasses[incident.severity] || severityBadgeClasses.low}`}>
                    {getSeverityLabel(incident.severity)}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClasses[incident.status] || statusBadgeClasses.reported}`}>
                    {getStatusLabel(incident.status)}
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-bold text-gray-900">{incident.title}</h3>
                <p className="mb-3 line-clamp-2 text-sm text-gray-600">{incident.description}</p>

                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Icons.MapPin className="h-3 w-3" />
                    <span>{incident.location ? labelStrings.locationRecorded : labelStrings.noLocation}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icons.Calendar className="h-3 w-3" />
                    <span>{new Date(incident.reportedDate?.seconds * 1000).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {dashboardData?.criticalIncidents.length > 0 && (
        <div className="rounded-3xl border-2 border-red-200 bg-red-50 p-8">
          <div className="mb-4 flex items-center space-x-3">
            <Icons.AlertTriangle className="h-8 w-8 text-red-600" />
            <h2 className="text-2xl font-bold text-red-900">{sectionStrings.criticalIncidents}</h2>
          </div>

          <div className="space-y-4">
            {dashboardData.criticalIncidents.map((incident) => (
              <div
                key={incident.id}
                className="flex cursor-pointer items-center justify-between rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                onClick={() => {
                  setSelectedIncident(incident);
                  setActiveView('status');
                }}
              >
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{incident.title}</h4>
                  <p className="text-sm text-gray-600">{getIncidentTypeLabel(incident.incidentType)}</p>
                </div>
                <Icons.ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderReportModal = () => (
    <AnimatePresence>
      {showReportModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setShowReportModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white">
              <div className="flex items-center space-x-3">
                <Icons.AlertTriangle className="h-8 w-8" />
                <h2 className="text-2xl font-bold">{reportFormStrings.title}</h2>
              </div>
              <button onClick={() => setShowReportModal(false)} className="rounded-full p-2 transition-colors hover:bg-white/20">
                <Icons.X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitIncident} className="space-y-6 p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">{reportFormStrings.incidentTypeLabel}</label>
                <select
                  required
                  value={reportForm.incidentType}
                  onChange={(e) => setReportForm({ ...reportForm, incidentType: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-red-500"
                >
                  {incidentTypeSelectOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">{reportFormStrings.incidentTitleLabel}</label>
                <input
                  type="text"
                  required
                  value={reportForm.title}
                  onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                  placeholder={reportFormStrings.incidentTitlePlaceholder}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">{reportFormStrings.descriptionLabel}</label>
                <textarea
                  required
                  value={reportForm.description}
                  onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                  placeholder={reportFormStrings.descriptionPlaceholder}
                  rows={4}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">{reportFormStrings.severityLabel}</label>
                <select
                  required
                  value={reportForm.severity}
                  onChange={(e) => setReportForm({ ...reportForm, severity: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-red-500"
                >
                  {severitySelectOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">{reportFormStrings.locationLabel}</label>
                <button
                  type="button"
                  onClick={() =>
                    getCurrentLocation((loc) => setReportForm({ ...reportForm, location: loc }))
                  }
                  className="flex w-full items-center justify-center space-x-2 rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 font-medium text-blue-700 transition-colors hover:bg-blue-100"
                >
                  <Icons.MapPin className="h-5 w-5 text-blue-600" />
                  <span>
                    {reportForm.location ? labelStrings.locationCaptured : labelStrings.captureLocation}
                  </span>
                </button>
                {reportForm.location && (
                  <p className="mt-2 text-sm text-gray-600">
                    {t('labels.latLong', {
                      lat: reportForm.location.latitude.toFixed(6),
                      lng: reportForm.location.longitude.toFixed(6)
                    })}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">{reportFormStrings.photosLabel}</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handlePhotoUpload(e.target.files, 'incident')}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhotos}
                  className="flex w-full items-center justify-center space-x-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  <Icons.Camera className="h-5 w-5 text-gray-600" />
                  <span>{uploadingPhotos ? reportFormStrings.processing : reportFormStrings.addPhotos}</span>
                </button>
                {reportForm.photos.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {reportForm.photos.map((photo, index) => (
                      <div key={index} className="relative h-20 w-20 rounded-lg bg-gray-100">
                        <img src={URL.createObjectURL(photo)} alt={t('forms.report.photoPreview', { index: index + 1 })} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            setReportForm({
                              ...reportForm,
                              photos: reportForm.photos.filter((_, i) => i !== index)
                            })
                          }
                          className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
                        >
                          <Icons.X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t pt-6">
                <h3 className="mb-4 text-lg font-bold text-gray-900">{reportFormStrings.contactTitle}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">{reportFormStrings.nameLabel}</label>
                    <input
                      type="text"
                      required
                      value={reportForm.reporterName}
                      onChange={(e) => setReportForm({ ...reportForm, reporterName: e.target.value })}
                      placeholder={reportFormStrings.namePlaceholder}
                      className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">{reportFormStrings.emailLabel}</label>
                    <input
                      type="email"
                      required
                      value={reportForm.reporterEmail}
                      onChange={(e) => setReportForm({ ...reportForm, reporterEmail: e.target.value })}
                      placeholder={reportFormStrings.emailPlaceholder}
                      className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">{reportFormStrings.phoneLabel}</label>
                    <input
                      type="tel"
                      value={reportForm.reporterPhone}
                      onChange={(e) => setReportForm({ ...reportForm, reporterPhone: e.target.value })}
                      placeholder={reportFormStrings.phonePlaceholder}
                      className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 rounded-xl bg-gray-100 px-6 py-4 font-semibold text-gray-700 transition-colors hover:bg-gray-200"
                >
                  {reportFormStrings.cancel}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 px-6 py-4 font-semibold text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? reportFormStrings.submitting : reportFormStrings.submit}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderObservationModal = () => (
    <AnimatePresence>
      {showObservationModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setShowObservationModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
              <div className="flex items-center space-x-3">
                <Icons.Eye className="h-8 w-8" />
                <h2 className="text-2xl font-bold">{observationFormStrings.title}</h2>
              </div>
              <button onClick={() => setShowObservationModal(false)} className="rounded-full p-2 transition-colors hover:bg-white/20">
                <Icons.X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitObservation} className="space-y-6 p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">{observationFormStrings.typeLabel}</label>
                <select
                  required
                  value={observationForm.observationType}
                  onChange={(e) => setObservationForm({ ...observationForm, observationType: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                >
                  {observationTypeSelectOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">{observationFormStrings.speciesLabel}</label>
                <input
                  type="text"
                  value={observationForm.species}
                  onChange={(e) => setObservationForm({ ...observationForm, species: e.target.value })}
                  placeholder={observationFormStrings.speciesPlaceholder}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">{observationFormStrings.descriptionLabel}</label>
                <textarea
                  required
                  value={observationForm.description}
                  onChange={(e) => setObservationForm({ ...observationForm, description: e.target.value })}
                  placeholder={observationFormStrings.descriptionPlaceholder}
                  rows={4}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">{observationFormStrings.locationLabel}</label>
                <button
                  type="button"
                  onClick={() =>
                    getCurrentLocation((loc) => setObservationForm({ ...observationForm, location: loc }))
                  }
                  className="flex w-full items-center justify-center space-x-2 rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 font-medium text-blue-700 transition-colors hover:bg-blue-100"
                >
                  <Icons.MapPin className="h-5 w-5 text-blue-600" />
                  <span>{observationForm.location ? labelStrings.locationCaptured : labelStrings.captureLocation}</span>
                </button>
                {observationForm.location && (
                  <p className="mt-2 text-sm text-gray-600">
                    {t('labels.latLong', {
                      lat: observationForm.location.latitude.toFixed(6),
                      lng: observationForm.location.longitude.toFixed(6)
                    })}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">{observationFormStrings.photosLabel}</label>
                <input
                  ref={observationFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handlePhotoUpload(e.target.files, 'observation')}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => observationFileInputRef.current?.click()}
                  disabled={uploadingPhotos}
                  className="flex w-full items-center justify-center space-x-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  <Icons.Camera className="h-5 w-5 text-gray-600" />
                  <span>{uploadingPhotos ? observationFormStrings.processing : observationFormStrings.addPhotos}</span>
                </button>
                {observationForm.photos.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {observationForm.photos.map((photo, index) => (
                      <div key={index} className="relative h-20 w-20 rounded-lg bg-gray-100">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={t('forms.observation.photoPreview', { index: index + 1 })}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setObservationForm({
                              ...observationForm,
                              photos: observationForm.photos.filter((_, i) => i !== index)
                            })
                          }
                          className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
                        >
                          <Icons.X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t pt-6">
                <h3 className="mb-4 text-lg font-bold text-gray-900">{observationFormStrings.contactTitle}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">{observationFormStrings.nameLabel}</label>
                    <input
                      type="text"
                      required
                      value={observationForm.observerName}
                      onChange={(e) => setObservationForm({ ...observationForm, observerName: e.target.value })}
                      placeholder={observationFormStrings.namePlaceholder}
                      className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">{observationFormStrings.emailLabel}</label>
                    <input
                      type="email"
                      required
                      value={observationForm.observerEmail}
                      onChange={(e) => setObservationForm({ ...observationForm, observerEmail: e.target.value })}
                      placeholder={observationFormStrings.emailPlaceholder}
                      className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowObservationModal(false)} className="flex-1 rounded-xl bg-gray-100 px-6 py-4 font-semibold text-gray-700 transition-colors hover:bg-gray-200">
                  {observationFormStrings.cancel}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 font-semibold text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? observationFormStrings.submitting : observationFormStrings.submit}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const mapFilterOptions = {
    incidentType: [
      { value: 'all', label: mapStrings.incidentTypeAll },
      { value: 'fish_kill', label: incidentTypeLabels.fish_kill },
      { value: 'stranding', label: incidentTypeLabels.stranding },
      { value: 'algal_bloom', label: incidentTypeLabels.algal_bloom },
      { value: 'pollution', label: incidentTypeLabels.pollution },
      { value: 'unusual_behavior', label: incidentTypeLabels.unusual_behavior }
    ],
    status: [
      { value: 'all', label: mapStrings.statusAll },
      { value: 'reported', label: statusLabels.reported },
      { value: 'under_investigation', label: statusLabels.under_investigation },
      { value: 'resolved', label: statusLabels.resolved }
    ],
    severity: [
      { value: 'all', label: mapStrings.severityAll },
      { value: 'low', label: severityStrings.low.label },
      { value: 'medium', label: severityStrings.medium.label },
      { value: 'high', label: severityStrings.high.label },
      { value: 'critical', label: severityStrings.critical.label }
    ]
  };

  const renderObservationsView = () => (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="mb-6 text-3xl font-bold text-gray-900">{observationsViewStrings.title}</h2>
      {observations.length === 0 ? (
        <p className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600 shadow-sm">{observationsViewStrings.empty}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {observations.map((observation) => (
            <div key={observation.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-blue-600">
                  {observationFormStrings.typeOptions[observation.observationType] || observation.observationType}
                </span>
                <span className="text-xs text-gray-500">
                  {t('observationsView.submitted', {
                    date: observation.submittedAt ? new Date(observation.submittedAt.seconds * 1000).toLocaleDateString() : '--'
                  })}
                </span>
              </div>
              <p className="mb-3 text-sm text-gray-600">{observation.description}</p>
              <div className="text-xs text-gray-500">
                <div>
                  {observationsViewStrings.observer}: {observation.observerName || '-'}
                </div>
                <div>{observation.location ? labelStrings.locationRecorded : observationsViewStrings.locationPending}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStatusView = () => {
    if (!selectedIncident) {
      return (
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600 shadow-sm">{statusViewStrings.empty}</p>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <button onClick={() => setActiveView('home')} className="mb-6 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700">
          {statusViewStrings.back}
        </button>
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">{statusViewStrings.title}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs text-gray-500">{statusViewStrings.reportedOn}</div>
              <div className="text-sm font-semibold text-gray-900">{selectedIncident.reportedDate ? new Date(selectedIncident.reportedDate.seconds * 1000).toLocaleString() : '--'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">{statusViewStrings.incidentType}</div>
              <div className="text-sm font-semibold text-gray-900">{getIncidentTypeLabel(selectedIncident.incidentType)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">{statusViewStrings.severity}</div>
              <div className="text-sm font-semibold text-gray-900">{getSeverityLabel(selectedIncident.severity)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">{statusViewStrings.status}</div>
              <div className="text-sm font-semibold text-gray-900">{getStatusLabel(selectedIncident.status)}</div>
            </div>
          </div>
          <div className="mt-6 border-t pt-4 text-sm text-gray-600">
            <div className="font-semibold text-gray-900">{statusViewStrings.description}</div>
            <p>{selectedIncident.description}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderMapView = () => (
    <div className="relative h-[calc(100vh-300px)]">
      <MapContainer center={[7.8731, 80.7718]} zoom={8} style={{ height: '100%', width: '100%' }} className="overflow-hidden rounded-3xl">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {filteredIncidents.map((incident) => {
          if (!incident.location) return null;
          return (
            <Marker
              key={incident.id}
              position={[incident.location.latitude, incident.location.longitude]}
              icon={incidentTypeIcons[incident.incidentType] || incidentTypeIcons.other}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="mb-1 font-bold text-gray-900">{incident.title}</h3>
                  <p className="mb-2 text-sm text-gray-600">{incident.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`rounded-full px-2 py-1 ${severityBadgeClasses[incident.severity] || severityBadgeClasses.low}`}>
                      {getSeverityLabel(incident.severity)}
                    </span>
                    <span className="text-gray-500">{getIncidentTypeLabel(incident.incidentType)}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <div className="absolute bottom-6 right-6 z-[1000] rounded-2xl bg-white p-4 shadow-xl">
        <h4 className="mb-3 font-bold text-gray-900">{sectionStrings.mapLegend}</h4>
        <div className="space-y-2">
          {incidentTypeLegend.map((item) => (
            <div key={item.type} className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full border-2 border-white shadow" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-gray-700">{getIncidentTypeLabel(item.type)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute left-6 top-6 z-[1000] w-64 rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center space-x-2">
          <Icons.Filter className="h-5 w-5 text-blue-600" />
          <h4 className="text-lg font-bold text-gray-900">{mapStrings.filtersTitle}</h4>
        </div>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Incident Type</label>
            <select
              value={filters.incidentType}
              onChange={(e) => setFilters({ ...filters, incidentType: e.target.value })}
              className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2.5 text-base font-medium text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              {mapFilterOptions.incidentType.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2.5 text-base font-medium text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              {mapFilterOptions.status.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Severity</label>
            <select
              value={filters.severity}
              onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
              className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2.5 text-base font-medium text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              {mapFilterOptions.severity.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setFilters({ incidentType: 'all', status: 'all', severity: 'all' })}
            className="mt-2 w-full rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <MultilingualContent language={language}>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="text-center">
            <Icons.Loader className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
            <p className="text-gray-600">{t('loading')}</p>
          </div>
        </div>
      </MultilingualContent>
    );
  }

  return (
    <MultilingualContent language={language}>
        <SEOHead
          title="Marine Incident Portal"
          description="Report and track marine incidents, emergencies, and maritime safety events around Sri Lanka."
          path="/marine-incident-portal"
          keywords="marine incidents, maritime safety, emergency reporting, NARA"
        />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-navy-50">
        {renderHeroSection()}
        {renderNavigationTabs()}

        <AnimatePresence mode="wait">
          <motion.div key={activeView} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            {activeView === 'home' && renderHomeView()}
            {activeView === 'map' && (
              <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">{renderMapView()}</div>
            )}
            {activeView === 'observations' && renderObservationsView()}
            {activeView === 'status' && renderStatusView()}
          </motion.div>
        </AnimatePresence>

        {renderReportModal()}
        {renderObservationModal()}

        {/* Floating Action Button for Quick Report */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={openWhatsAppReport}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-2xl transition-shadow hover:shadow-green-500/50"
            title="Quick Report via WhatsApp"
          >
            <Icons.MessageCircle className="h-6 w-6" />
          </motion.button>
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowReportModal(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-2xl transition-shadow hover:shadow-red-500/50"
            title="Full Report Form"
          >
            <Icons.AlertTriangle className="h-6 w-6" />
          </motion.button>
        </div>
      </div>
    </MultilingualContent>
  );
};

export default MarineIncidentPortal;
