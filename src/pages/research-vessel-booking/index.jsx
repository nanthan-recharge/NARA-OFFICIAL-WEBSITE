import React, { useEffect, useMemo, useState } from 'react';
import SEOHead from '../../components/shared/SEOHead';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import MultilingualContent from 'components/compliance/MultilingualContent';
import {
  researchVesselsService,
  vesselBookingsService,
  vesselAvailabilityService,
  vesselDashboardService
} from '../../services/researchVesselService';

const createInitialBookingForm = () => ({
  vesselId: '',
  vesselName: '',
  organizationName: '',
  principalInvestigator: '',
  contactEmail: '',
  contactPhone: '',
  researchProject: '',
  purposeOfCruise: '',
  startDate: '',
  endDate: '',
  departurePort: '',
  destinationArea: '',
  numberOfScientists: '',
  equipmentRequired: '',
  specialRequests: ''
});

const formatDateSafely = (rawDate, locale, fallback) => {
  if (!rawDate) return fallback;

  try {
    const date =
      typeof rawDate.toDate === 'function' ? rawDate.toDate() : new Date(rawDate);

    if (Number.isNaN(date.getTime())) {
      return fallback;
    }

    return date.toLocaleDateString(locale);
  } catch (error) {
    console.error('Error formatting date:', error);
    return fallback;
  }
};

const ResearchVesselBooking = () => {
  const { t, i18n } = useTranslation(['vesselBooking', 'common']);
  const language = (i18n.language || 'en').split('-')[0];

  const [activeView, setActiveView] = useState('browse');
  const [vessels, setVessels] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trackingId, setTrackingId] = useState('');
  const [trackedBooking, setTrackedBooking] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [bookingForm, setBookingForm] = useState(() => createInitialBookingForm());

  const heroContent = useMemo(
    () => t('hero', { returnObjects: true }),
    [t]
  );
  const heroStats = heroContent.stats || {};
  const browseContent = useMemo(
    () => t('browse', { returnObjects: true }),
    [t]
  );
  const browseSpecs = browseContent.specs || {};
  const browseButtons = browseContent.buttons || {};
  const calendarContent = useMemo(
    () => t('calendar', { returnObjects: true }),
    [t]
  );
  const myBookingsContent = useMemo(
    () => t('myBookings', { returnObjects: true }),
    [t]
  );
  const myBookingLabels = myBookingsContent.labels || {};
  const trackContent = useMemo(
    () => t('track', { returnObjects: true }),
    [t]
  );
  const trackDetails = trackContent.details || {};
  const trackFields = trackDetails.fields || {};
  const modalContent = useMemo(
    () => t('modal', { returnObjects: true }),
    [t]
  );
  const modalButtons = modalContent.buttons || {};
  const formContent = useMemo(
    () => t('form', { returnObjects: true }),
    [t]
  );
  const formLabels = formContent.labels || {};
  const formPlaceholders = formContent.placeholders || {};

  const navTabs = useMemo(
    () => [
      { id: 'browse', label: t('tabs.browse'), icon: Icons.Ship },
      { id: 'calendar', label: t('tabs.calendar'), icon: Icons.Calendar },
      { id: 'my-bookings', label: t('tabs.myBookings'), icon: Icons.BookOpen },
      { id: 'track', label: t('tabs.track'), icon: Icons.Search }
    ],
    [t]
  );

  const translateVesselStatus = (status) => {
    const key = `status.vessel.${status}`;
    const localized = t(key);
    return localized !== key ? localized : t('status.fallback');
  };

  const translateBookingStatus = (status) => {
    const key = `status.booking.${status}`;
    const localized = t(key);
    return localized !== key ? localized : t('status.fallback');
  };

  const formatDate = (rawDate) => formatDateSafely(rawDate, i18n.language, t('misc.na'));

  const loadData = async () => {
    setLoading(true);
    try {
      const [vesselsResult, statsResult] = await Promise.all([
        researchVesselsService.getAvailable(),
        vesselDashboardService.getStatistics()
      ]);

      if (vesselsResult?.data) setVessels(vesselsResult.data);
      if (statsResult?.data) setStatistics(statsResult.data);
    } catch (error) {
      console.error('Error loading vessel booking data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadMyBookings = async () => {
    try {
      const userId = 'demo-user-id';
      const { data } = await vesselBookingsService.getUserBookings(userId);
      if (data) setMyBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const openBookingModal = (vessel) => {
    setSelectedVessel(vessel);
    setBookingForm({
      ...createInitialBookingForm(),
      vesselId: vessel.id,
      vesselName: vessel.name
    });
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedVessel(null);
    setBookingForm(createInitialBookingForm());
  };

  const handleBookingSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const availabilityResult = await vesselAvailabilityService.checkAvailability(
        bookingForm.vesselId,
        bookingForm.startDate,
        bookingForm.endDate
      );

      if (!availabilityResult?.data) {
        alert(t('alerts.availabilityError'));
        setLoading(false);
        return;
      }

      if (!availabilityResult.data.available) {
        alert(t('alerts.availabilityUnavailable'));
        setLoading(false);
        return;
      }

      const bookingData = {
        ...bookingForm,
        userId: 'demo-user-id',
        startDate: new Date(bookingForm.startDate),
        endDate: new Date(bookingForm.endDate),
        numberOfScientists: parseInt(bookingForm.numberOfScientists, 10) || 0
      };

      const result = await vesselBookingsService.create(bookingData);

      if (result?.error) {
        alert(result.error.message || t('alerts.bookingError'));
      } else if (result?.data?.bookingId) {
        alert(t('alerts.bookingSuccess', { id: result.data.bookingId }));
        closeBookingModal();
        loadData();
      } else {
        alert(t('alerts.bookingError'));
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert(t('alerts.bookingError'));
    } finally {
      setLoading(false);
    }
  };

  const trackBooking = async () => {
    if (!trackingId.trim()) {
      alert(t('alerts.trackingIdRequired'));
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await vesselBookingsService.getByBookingId(trackingId);
      if (error || !data) {
        alert(t('alerts.bookingNotFound'));
        setTrackedBooking(null);
      } else {
        setTrackedBooking(data);
      }
    } catch (error) {
      console.error('Error tracking booking:', error);
      alert(t('alerts.trackingError'));
    } finally {
      setLoading(false);
    }
  };

  const heroStatsItems = statistics
    ? [
        {
          value: statistics?.vessels?.total ?? 0,
          label: heroStats.total
        },
        {
          value: statistics?.vessels?.available ?? 0,
          label: heroStats.available
        },
        {
          value: statistics?.bookings?.confirmed ?? 0,
          label: heroStats.active
        },
        {
          value: statistics?.bookings?.completed ?? 0,
          label: heroStats.completed
        }
      ]
    : [];

  if (loading && vessels.length === 0) {
    return (
      <MultilingualContent
        language={language}
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center"
      >
        <div className="text-blue-900 text-xl">{t('common:loading')}</div>
      </MultilingualContent>
    );
  }

  return (
    <MultilingualContent language={language}>
        <SEOHead
          title="Research Vessel Booking"
          description="Book research vessels for marine scientific expeditions and ocean research programs."
          path="/research-vessel-booking"
          keywords="research vessel, marine expedition, ocean research, NARA"
        />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-navy-50">
        {/* Hero Section */}
        {/* Hero Section - Navy Blue Government Theme */}
        <section className="relative bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 text-white py-24 overflow-hidden">
          {/* Animated Background Ships */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, index) => {
              const viewportWidth = typeof window === 'undefined' ? 1440 : window.innerWidth;
              return (
                <motion.div
                  key={index}
                  className="absolute"
                  initial={{
                    x: Math.random() * viewportWidth,
                    y: Math.random() * 400
                  }}
                  animate={{
                    x: [null, Math.random() * viewportWidth],
                    y: [null, Math.random() * 400]
                  }}
                  transition={{
                    duration: 20 + Math.random() * 10,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                >
                  <Icons.Ship className="w-8 h-8" />
                </motion.div>
              );
            })}
          </div>

          <div className="relative max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <Icons.Ship className="w-16 h-16" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">{heroContent.title}</h1>
              {heroContent.subtitle ? (
                <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">{heroContent.subtitle}</p>
              ) : null}

              {/* Quick Stats */}
              {heroStatsItems.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
                  {heroStatsItems.map(
                    ({ value, label }, index) =>
                      label && (
                        <div
                          key={`${label}-${index}`}
                          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                        >
                          <div className="text-3xl font-bold mb-2">{value}</div>
                          <div className="text-sm text-blue-200">{label}</div>
                        </div>
                      )
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-xl shadow-lg z-40 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-2 overflow-x-auto">
              {navTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveView(tab.id);
                    if (tab.id === 'my-bookings') loadMyBookings();
                  }}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                    activeView === tab.id
                      ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <AnimatePresence mode="wait">
            {/* Browse Vessels View */}
            {activeView === 'browse' && (
              <motion.div
                key="browse"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{browseContent.title}</h2>
                  {browseContent.description ? (
                    <p className="text-gray-600">{browseContent.description}</p>
                  ) : null}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {vessels.map((vessel, idx) => (
                    <motion.div
                      key={vessel.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all group"
                    >
                      {/* Vessel Image */}
                      <div className="relative h-56 bg-gradient-to-br from-blue-400 to-cyan-600 overflow-hidden">
                        {vessel.imageUrl ? (
                          <img
                            src={vessel.imageUrl}
                            alt={vessel.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Icons.Ship className="w-24 h-24 text-white opacity-50" />
                          </div>
                        )}
                        <div className="absolute top-4 right-4">
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${(() => {
                              const colors = {
                                available: 'bg-green-100 text-green-800',
                                in_use: 'bg-blue-100 text-blue-800',
                                maintenance: 'bg-orange-100 text-orange-800',
                                unavailable: 'bg-red-100 text-red-800'
                              };
                              return colors[vessel.status] || 'bg-gray-100 text-gray-800';
                            })()}`}
                          >
                            {translateVesselStatus(vessel.status)}
                          </span>
                        </div>
                      </div>

                      {/* Vessel Details */}
                      <div className="p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{vessel.name}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{vessel.description}</p>

                        {/* Specifications */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-3 text-sm text-gray-700">
                            <Icons.Ruler className="w-5 h-5 text-blue-500" />
                            <span>
                              <strong>{browseSpecs.lengthLabel}:</strong>{' '}
                              {t('browse.specs.lengthValue', { value: vessel.length })}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-700">
                            <Icons.Users className="w-5 h-5 text-blue-500" />
                            <span>
                              <strong>{browseSpecs.capacityLabel}:</strong>{' '}
                              {t('browse.specs.capacityValue', { value: vessel.capacity })}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-700">
                            <Icons.Gauge className="w-5 h-5 text-blue-500" />
                            <span>
                              <strong>{browseSpecs.speedLabel}:</strong>{' '}
                              {t('browse.specs.speedValue', { value: vessel.maxSpeed })}
                            </span>
                          </div>
                          {vessel.equipmentAvailable && vessel.equipmentAvailable.length > 0 && (
                            <div className="flex items-start gap-3 text-sm text-gray-700">
                              <Icons.Wrench className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <strong>{browseSpecs.equipment}:</strong>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {vessel.equipmentAvailable.slice(0, 3).map((equipment, equipmentIndex) => (
                                    <span
                                      key={`${vessel.id}-equipment-${equipmentIndex}`}
                                      className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                                    >
                                      {equipment}
                                    </span>
                                  ))}
                                  {vessel.equipmentAvailable.length > 3 && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                      {t('browse.specs.equipmentMore', {
                                        count: vessel.equipmentAvailable.length - 3
                                      })}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <button
                          type="button"
                          onClick={() => openBookingModal(vessel)}
                          disabled={vessel.status !== 'available'}
                          className={`w-full py-3 rounded-xl font-semibold transition-all ${
                            vessel.status === 'available'
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {vessel.status === 'available' ? (
                            <span className="flex items-center justify-center gap-2">
                              <Icons.Calendar className="w-5 h-5" />
                              {browseButtons.book}
                            </span>
                          ) : (
                            browseButtons.unavailable
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {vessels.length === 0 && (
                  <div className="text-center py-16 text-gray-500">
                    <Icons.Ship className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>{browseContent.empty}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Calendar View */}
            {activeView === 'calendar' && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16"
              >
                <Icons.Calendar className="w-24 h-24 mx-auto mb-6 text-blue-500 opacity-50" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{calendarContent.title}</h3>
                {calendarContent.description ? (
                  <p className="text-gray-600 mb-8">{calendarContent.description}</p>
                ) : null}
              </motion.div>
            )}

            {/* My Bookings View */}
            {activeView === 'my-bookings' && (
              <motion.div
                key="my-bookings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{myBookingsContent.title}</h2>
                  {myBookingsContent.description ? (
                    <p className="text-gray-600">{myBookingsContent.description}</p>
                  ) : null}
                </div>

                <div className="space-y-6">
                  {myBookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-xl shadow-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{booking.vesselName}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {`${myBookingLabels.bookingId || 'Booking ID'}: ${booking.bookingId || t('misc.na')}`}
                          </p>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-medium border ${(() => {
                            const colors = {
                              pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                              approved: 'bg-green-100 text-green-800 border-green-300',
                              confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
                              completed: 'bg-purple-100 text-purple-800 border-purple-300',
                              rejected: 'bg-red-100 text-red-800 border-red-300',
                              cancelled: 'bg-gray-100 text-gray-800 border-gray-300'
                            };
                            return colors[booking.status] || 'bg-gray-100 text-gray-800 border-gray-300';
                          })()}`}
                        >
                          {translateBookingStatus(booking.status)}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-3 text-gray-700">
                          <Icons.Calendar className="w-5 h-5 text-blue-500" />
                          <div>
                            <div className="text-sm font-medium">{myBookingLabels.departure}</div>
                            <div className="text-sm">{formatDate(booking.startDate)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <Icons.Calendar className="w-5 h-5 text-blue-500" />
                          <div>
                            <div className="text-sm font-medium">{myBookingLabels.return}</div>
                            <div className="text-sm">{formatDate(booking.endDate)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <Icons.MapPin className="w-5 h-5 text-blue-500" />
                          <div>
                            <div className="text-sm font-medium">{myBookingLabels.departurePort}</div>
                            <div className="text-sm">{booking.departurePort || t('misc.na')}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <Icons.Target className="w-5 h-5 text-blue-500" />
                          <div>
                            <div className="text-sm font-medium">{myBookingLabels.destination}</div>
                            <div className="text-sm">{booking.destinationArea || t('misc.na')}</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="text-sm font-medium text-blue-900 mb-2">
                          {myBookingLabels.researchProject}
                        </div>
                        <div className="text-sm text-blue-800">{booking.researchProject || t('misc.na')}</div>
                      </div>
                    </div>
                  ))}

                  {myBookings.length === 0 && (
                    <div className="text-center py-16 text-gray-500 bg-white rounded-xl">
                      <Icons.BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p>{myBookingsContent.empty}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Track Booking View */}
            {activeView === 'track' && (
              <motion.div
                key="track"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="max-w-2xl mx-auto">
                  <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                      <Icons.Search className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">{trackContent.title}</h2>
                      {trackContent.description ? (
                        <p className="text-gray-600">{trackContent.description}</p>
                      ) : null}
                    </div>

                    <div className="flex gap-3 mb-8">
                      <input
                        type="text"
                        value={trackingId}
                        onChange={(event) => setTrackingId(event.target.value.toUpperCase())}
                        placeholder={t('track.inputPlaceholder', { sample: 'BKG-1234567890-ABCD' })}
                        className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                      />
                      <button
                        type="button"
                        onClick={trackBooking}
                        disabled={loading}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl font-semibold disabled:opacity-50"
                      >
                        {trackContent.button}
                      </button>
                    </div>

                    {trackedBooking && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border-t-2 border-gray-200 pt-8"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-bold text-gray-900">{trackDetails.title}</h3>
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-medium border ${(() => {
                              const colors = {
                                pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                                approved: 'bg-green-100 text-green-800 border-green-300',
                                confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
                                completed: 'bg-purple-100 text-purple-800 border-purple-300',
                                rejected: 'bg-red-100 text-red-800 border-red-300',
                                cancelled: 'bg-gray-100 text-gray-800 border-gray-300'
                              };
                              return colors[trackedBooking.status] || 'bg-gray-100 text-gray-800 border-gray-300';
                            })()}`}
                          >
                            {translateBookingStatus(trackedBooking.status)}
                          </span>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="text-gray-600">{trackFields.vesselName}</span>
                            <span className="font-semibold text-gray-900">
                              {trackedBooking.vesselName || t('misc.na')}
                            </span>
                          </div>
                          <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="text-gray-600">{trackFields.organization}</span>
                            <span className="font-semibold text-gray-900">
                              {trackedBooking.organizationName || t('misc.na')}
                            </span>
                          </div>
                          <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="text-gray-600">{trackFields.cruiseDates}</span>
                            <span className="font-semibold text-gray-900">
                              {`${formatDate(trackedBooking.startDate)} - ${formatDate(trackedBooking.endDate)}`}
                            </span>
                          </div>
                          <div className="flex justify-between py-3 border-b border-gray-100">
                            <span className="text-gray-600">{trackFields.submissionDate}</span>
                            <span className="font-semibold text-gray-900">
                              {formatDate(trackedBooking.submissionDate)}
                            </span>
                          </div>
                          {trackedBooking.approvalDate && (
                            <div className="flex justify-between py-3 border-b border-gray-100">
                              <span className="text-gray-600">{trackFields.approvalDate}</span>
                              <span className="font-semibold text-gray-900">
                                {formatDate(trackedBooking.approvalDate)}
                              </span>
                            </div>
                          )}
                          {trackedBooking.adminNotes && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                              <div className="text-sm font-medium text-blue-900 mb-2">{trackFields.adminNotes}</div>
                              <div className="text-sm text-blue-800">{trackedBooking.adminNotes}</div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Booking Modal */}
        <AnimatePresence>
          {showBookingModal && selectedVessel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={closeBookingModal}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(event) => event.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">
                    {t('modal.title', { vessel: selectedVessel.name })}
                  </h3>
                  <button
                    type="button"
                    onClick={closeBookingModal}
                    className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                  >
                    <Icons.X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleBookingSubmit} className="p-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {formLabels.organizationName} *
                      </label>
                      <input
                        type="text"
                        value={bookingForm.organizationName}
                        onChange={(event) =>
                          setBookingForm({ ...bookingForm, organizationName: event.target.value })
                        }
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        placeholder={formPlaceholders.organizationName}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {formLabels.principalInvestigator} *
                      </label>
                      <input
                        type="text"
                        value={bookingForm.principalInvestigator}
                        onChange={(event) =>
                          setBookingForm({ ...bookingForm, principalInvestigator: event.target.value })
                        }
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        placeholder={formPlaceholders.principalInvestigator}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {formLabels.contactEmail} *
                      </label>
                      <input
                        type="email"
                        value={bookingForm.contactEmail}
                        onChange={(event) => setBookingForm({ ...bookingForm, contactEmail: event.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        placeholder={formPlaceholders.contactEmail}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {formLabels.contactPhone} *
                      </label>
                      <input
                        type="tel"
                        value={bookingForm.contactPhone}
                        onChange={(event) => setBookingForm({ ...bookingForm, contactPhone: event.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        placeholder={formPlaceholders.contactPhone}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {formLabels.researchProject} *
                    </label>
                    <input
                      type="text"
                      value={bookingForm.researchProject}
                      onChange={(event) => setBookingForm({ ...bookingForm, researchProject: event.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      placeholder={formPlaceholders.researchProject}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {formLabels.purposeOfCruise} *
                    </label>
                    <textarea
                      value={bookingForm.purposeOfCruise}
                      onChange={(event) => setBookingForm({ ...bookingForm, purposeOfCruise: event.target.value })}
                      required
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      placeholder={formPlaceholders.purposeOfCruise}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {formLabels.startDate} *
                      </label>
                      <input
                        type="date"
                        value={bookingForm.startDate}
                        onChange={(event) => setBookingForm({ ...bookingForm, startDate: event.target.value })}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {formLabels.endDate} *
                      </label>
                      <input
                        type="date"
                        value={bookingForm.endDate}
                        onChange={(event) => setBookingForm({ ...bookingForm, endDate: event.target.value })}
                        required
                        min={bookingForm.startDate || new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {formLabels.departurePort} *
                      </label>
                      <input
                        type="text"
                        value={bookingForm.departurePort}
                        onChange={(event) => setBookingForm({ ...bookingForm, departurePort: event.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        placeholder={formPlaceholders.departurePort}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {formLabels.destinationArea} *
                      </label>
                      <input
                        type="text"
                        value={bookingForm.destinationArea}
                        onChange={(event) => setBookingForm({ ...bookingForm, destinationArea: event.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        placeholder={formPlaceholders.destinationArea}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {formLabels.numberOfScientists} *
                    </label>
                    <input
                      type="number"
                      value={bookingForm.numberOfScientists}
                      onChange={(event) => setBookingForm({ ...bookingForm, numberOfScientists: event.target.value })}
                      required
                      min="1"
                      max={selectedVessel.capacity}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      placeholder={t('form.placeholders.numberOfScientists', {
                        capacity: selectedVessel.capacity
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {formLabels.equipmentRequired}
                    </label>
                    <textarea
                      value={bookingForm.equipmentRequired}
                      onChange={(event) => setBookingForm({ ...bookingForm, equipmentRequired: event.target.value })}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      placeholder={formPlaceholders.equipmentRequired}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {formLabels.specialRequests}
                    </label>
                    <textarea
                      value={bookingForm.specialRequests}
                      onChange={(event) => setBookingForm({ ...bookingForm, specialRequests: event.target.value })}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      placeholder={formPlaceholders.specialRequests}
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={closeBookingModal}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                    >
                      {modalButtons.cancel}
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl font-semibold disabled:opacity-50"
                    >
                      {loading ? modalButtons.submitting : modalButtons.submit}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MultilingualContent>
  );
};

export default ResearchVesselBooking;
