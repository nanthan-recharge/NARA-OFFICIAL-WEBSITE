import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronRight, BookOpen, Loader2, AlertCircle, User, Building2,
  Calendar, Hash, FileText, BookCopy, Layers, Globe, Download,
  Eye, EyeOff, Bookmark, BookmarkCheck, Share2, Printer, Copy,
  CheckCircle, XCircle, Clock, MapPin, QrCode, ExternalLink,
  Maximize2, Minimize2, Sun, Moon, SunMedium, ZoomIn, ZoomOut,
  ArrowLeft, ChevronUp, ChevronDown, Info, Tag, Library, Lock,
  UserPlus, LogIn, Link2, BookMarked, Barcode, ShieldCheck,
  Languages, Award, ScrollText, Search, X, Check
} from 'lucide-react';
import { catalogueService, circulationService, searchService } from '../../services/libraryService';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import { useLibraryUser } from '../../contexts/LibraryUserContext';
import DownloadManager from '../../components/library/DownloadManager';
import LanguageSelector from '../../components/library/LanguageSelector';
import MultiLanguagePreview from '../../components/library/MultiLanguagePreview';
import PhysicalReservationButton from '../../components/library/PhysicalReservationButton';

// ─── NARA Material Type Config ───────────────────────────────────────────────
const MATERIAL_TYPE_MAP = {
  ACT:    { icon: BookMarked, gradient: 'from-purple-500 to-purple-600', label: 'Act / Legislation' },
  ATC:    { icon: Library,    gradient: 'from-amber-500 to-amber-600',   label: 'Archive Collection' },
  BOBP:   { icon: FileText,   gradient: 'from-blue-500 to-blue-600',    label: 'BOBP Document' },
  CD:     { icon: Globe,      gradient: 'from-cyan-500 to-cyan-600',    label: 'CD / Media' },
  DMAP:   { icon: MapPin,     gradient: 'from-green-500 to-green-600',  label: 'Digital Map' },
  EBOOK:  { icon: BookOpen,   gradient: 'from-indigo-500 to-indigo-600',label: 'E-Book' },
  FAO:    { icon: FileText,   gradient: 'from-emerald-500 to-emerald-600',label: 'FAO Document' },
  IOC:    { icon: FileText,   gradient: 'from-teal-500 to-teal-600',    label: 'IOC Document' },
  IWMI:   { icon: Globe,      gradient: 'from-sky-500 to-sky-600',      label: 'IWMI Publication' },
  JR:     { icon: BookOpen,   gradient: 'from-violet-500 to-violet-600',label: 'Journal' },
  LBOOK:  { icon: BookOpen,   gradient: 'from-blue-600 to-blue-700',    label: 'Library Book' },
  MAP:    { icon: MapPin,     gradient: 'from-lime-500 to-lime-600',    label: 'Map' },
  NEWS:   { icon: FileText,   gradient: 'from-slate-500 to-slate-600',  label: 'Newspaper' },
  PREF:   { icon: BookMarked, gradient: 'from-red-500 to-red-600',      label: 'Reference' },
  PROC:   { icon: BookCopy,   gradient: 'from-orange-500 to-orange-600',label: 'Proceedings' },
  UACOL:  { icon: Library,    gradient: 'from-pink-500 to-pink-600',    label: 'UA Collection' },
  RBOOK:  { icon: BookOpen,   gradient: 'from-rose-500 to-rose-600',    label: 'Reference Book' },
  RPAPER: { icon: FileText,   gradient: 'from-fuchsia-500 to-fuchsia-600',label: 'Research Paper' },
  RNARA:  { icon: ScrollText, gradient: 'from-cyan-600 to-cyan-700',    label: 'NARA Report' },
  SREF:   { icon: BookmarkCheck, gradient: 'from-red-600 to-red-700',   label: 'Special Reference' },
  SLBOOK: { icon: Library,    gradient: 'from-yellow-500 to-yellow-600', label: 'SL Book' },
  SLREP:  { icon: FileText,   gradient: 'from-amber-600 to-amber-700',  label: 'SL Report' },
  THESIS: { icon: Award,      gradient: 'from-purple-600 to-purple-700', label: 'Thesis' },
  WFISH:  { icon: Globe,      gradient: 'from-blue-500 to-blue-600',     label: 'World Fish' },
  EJART:  { icon: FileText,   gradient: 'from-violet-600 to-violet-700', label: 'E-Journal Article' },
  EREP:   { icon: FileText,   gradient: 'from-indigo-600 to-indigo-700', label: 'E-Report' },
};

const getMaterialConfig = (code) =>
  MATERIAL_TYPE_MAP[code] || { icon: BookOpen, gradient: 'from-[#003366] to-[#0066CC]', label: code || 'Document' };

// ─── Status Badge ────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = {
    available:   { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Available' },
    checked_out: { bg: 'bg-amber-50 border-amber-200',     text: 'text-amber-700',   dot: 'bg-amber-500',   label: 'Checked Out' },
    on_hold:     { bg: 'bg-blue-50 border-blue-200',       text: 'text-blue-700',     dot: 'bg-blue-500',     label: 'On Hold' },
    missing:     { bg: 'bg-red-50 border-red-200',         text: 'text-red-700',       dot: 'bg-red-500',       label: 'Missing' },
    processing:  { bg: 'bg-slate-50 border-slate-200',     text: 'text-slate-700',     dot: 'bg-slate-500',     label: 'Processing' },
  };
  const c = cfg[status] || cfg.available;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};

// ─── Citation Generator ──────────────────────────────────────────────────────
const generateCitation = (item, style) => {
  let author = 'Unknown Author';
  if (typeof item.author === 'string') {
    if (item.author.startsWith('{')) {
      try { author = JSON.parse(item.author).name || item.author; } catch { author = item.author; }
    } else { author = item.author; }
  } else if (item.author?.name) { author = item.author.name; }
  const year = item.publication_year || 'n.d.';
  const title = item.title || 'Untitled';
  const publisher = item.publisher || '';
  const edition = item.edition ? ` (${item.edition} ed.)` : '';

  switch (style) {
    case 'apa':
      return `${author} (${year}). ${title}${edition}. ${publisher}.`;
    case 'mla':
      return `${author}. ${title}. ${publisher}, ${year}.`;
    case 'chicago':
      return `${author}. ${title}. ${publisher}, ${year}.`;
    default:
      return `${author}. "${title}." ${publisher}, ${year}.`;
  }
};

// ─── Tabs ────────────────────────────────────────────────────────────────────
const TABS = [
  { key: 'overview',     label: 'Overview',      icon: Info },
  { key: 'read',         label: 'Read Online',   icon: Eye },
  { key: 'translations', label: 'Translations',  icon: Languages },
  { key: 'details',      label: 'Details',       icon: FileText },
  { key: 'related',      label: 'Related',       icon: Library },
];

// ─── Main Component ──────────────────────────────────────────────────────────
const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useFirebaseAuth();
  const { userProfile } = useLibraryUser();

  // Core state
  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Interaction state
  const [activeTab, setActiveTab] = useState('overview');
  const [placingHold, setPlacingHold] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState('');

  // PDF viewer state
  const [pdfFullscreen, setPdfFullscreen] = useState(false);
  const [pdfTheme, setPdfTheme] = useState('day'); // day | night | sepia
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('english');
  const [pdfLoadError, setPdfLoadError] = useState(false);
  const [pdfChecking, setPdfChecking] = useState(false);

  // Citation state
  const [citationStyle, setCitationStyle] = useState('apa');
  const [showCitationDropdown, setShowCitationDropdown] = useState(false);

  const pdfContainerRef = useRef(null);

  // ─── Load Item ───────────────────────────────────────────────────────────
  useEffect(() => {
    loadItem();
    window.scrollTo(0, 0);
  }, [id]);

  // Check if PDF URL is actually accessible before rendering iframe
  useEffect(() => {
    if (item?.url) {
      setCurrentPdfUrl(item.url);
      setPdfLoadError(false);
      setPdfChecking(true);

      // Check if the item has a known upload error
      if (item.upload_error) {
        setPdfLoadError(true);
        setPdfChecking(false);
        return;
      }

      // Test the URL with a HEAD request
      fetch(item.url, { method: 'HEAD', mode: 'no-cors' })
        .then((res) => {
          // In no-cors mode we get opaque response; if it throws, URL is broken
          // For Firebase Storage, a 404 will still resolve with opaque response
          // So we also check for common error patterns
          if (res.type === 'opaque') {
            // Can't read status in no-cors, try fetching a small range
            return fetch(item.url, { headers: { Range: 'bytes=0-0' } });
          }
          if (!res.ok) {
            setPdfLoadError(true);
          }
          setPdfChecking(false);
        })
        .then((rangeRes) => {
          if (rangeRes) {
            if (!rangeRes.ok && rangeRes.status !== 206) {
              setPdfLoadError(true);
            }
          }
          setPdfChecking(false);
        })
        .catch(() => {
          setPdfLoadError(true);
          setPdfChecking(false);
        });
    } else if (item && !item.url) {
      setPdfLoadError(true);
      setPdfChecking(false);
    }
  }, [item]);

  const loadItem = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await catalogueService.getItemById(id);

      if (response.success) {
        let bookData = response.data;

        // If this is a translation ID (e.g., "6-sinhala"), fetch original and merge translations
        if (typeof id === 'string' && (id.includes('-sinhala') || id.includes('-tamil'))) {
          const originalId = bookData.original_id;
          if (originalId) {
            const originalResponse = await catalogueService.getItemById(originalId);
            if (originalResponse.success) {
              const originalBook = originalResponse.data;
              const sinhalaResponse = await catalogueService.getItemById(`${originalId}-sinhala`);
              const tamilResponse = await catalogueService.getItemById(`${originalId}-tamil`);

              bookData = {
                ...originalBook,
                translations: {
                  sinhala: sinhalaResponse.success ? {
                    url: sinhalaResponse.data.url,
                    translated_at: sinhalaResponse.data.translations?.sinhala?.translated_at
                  } : null,
                  tamil: tamilResponse.success ? {
                    url: tamilResponse.data.url,
                    translated_at: tamilResponse.data.translations?.tamil?.translated_at
                  } : null
                },
                translations_available: [
                  sinhalaResponse.success ? 'sinhala' : null,
                  tamilResponse.success ? 'tamil' : null
                ].filter(Boolean)
              };
            }
          }
        }

        setItem(bookData);
        loadRelatedItems(bookData.id || id);
      } else {
        setError('Item not found in the catalogue.');
      }
    } catch (err) {
      setError('Failed to load item details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedItems = async (itemId) => {
    try {
      const response = await searchService.getRelatedItems(itemId, 6);
      if (response.success) {
        setRelatedItems(response.data || []);
      }
    } catch (err) {
      console.error('Failed to load related items:', err);
    }
  };

  // ─── Actions ─────────────────────────────────────────────────────────────
  const handlePlaceHold = async () => {
    if (!user) {
      navigate('/library-login', { state: { returnTo: `/library/item/${id}` } });
      return;
    }
    setPlacingHold(true);
    try {
      const response = await circulationService.placeHold(user.uid, id);
      if (response.success) {
        alert('Hold placed successfully! You will be notified when the item is available.');
        loadItem();
      }
    } catch (err) {
      alert('Failed to place hold. Please try again or contact library staff.');
      console.error(err);
    } finally {
      setPlacingHold(false);
    }
  };

  const handleLanguageChange = (url, langCode, langName) => {
    setCurrentPdfUrl(url);
    setCurrentLanguage(langCode);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCitation = (style) => {
    const text = generateCitation(item, style);
    navigator.clipboard.writeText(text);
    setCopiedCitation(style);
    setTimeout(() => setCopiedCitation(''), 2000);
  };

  const toggleFullscreen = () => {
    if (!pdfFullscreen && pdfContainerRef.current) {
      if (pdfContainerRef.current.requestFullscreen) {
        pdfContainerRef.current.requestFullscreen();
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    setPdfFullscreen(!pdfFullscreen);
  };

  useEffect(() => {
    const handler = () => setPdfFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // ─── Parsed author ──────────────────────────────────────────────────────
  const authorDisplay = useMemo(() => {
    if (!item?.author) return null;
    if (typeof item.author === 'object') return item.author.name || 'Unknown Author';
    if (typeof item.author === 'string') {
      // Handle JSON-encoded author strings like '{"name":"Mustafa, M.G."}'
      if (item.author.startsWith('{')) {
        try {
          const parsed = JSON.parse(item.author);
          return parsed.name || item.author;
        } catch { return item.author; }
      }
      return item.author;
    }
    return String(item.author);
  }, [item]);

  // ─── Material config ────────────────────────────────────────────────────
  const materialConfig = useMemo(() => getMaterialConfig(item?.material_type_code), [item]);
  const MaterialIcon = materialConfig.icon;

  // ─── PDF themes ──────────────────────────────────────────────────────────
  const pdfThemes = {
    day:   { bg: 'bg-white',        border: 'border-slate-200', label: 'Day',   icon: Sun },
    night: { bg: 'bg-slate-900',    border: 'border-slate-700', label: 'Night', icon: Moon },
    sepia: { bg: 'bg-[#f4ecd8]',   border: 'border-amber-200', label: 'Sepia', icon: SunMedium },
  };

  // ─── Visible tabs (filter based on item data) ───────────────────────────
  const visibleTabs = useMemo(() => {
    if (!item) return TABS;
    return TABS.filter(tab => {
      // Always show Read tab - it will display "not available" state if PDF is missing
      if (tab.key === 'read') return true;
      if (tab.key === 'translations' && !item.url) return false;
      return true;
    });
  }, [item]);

  // ─── Loading State ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#003366] to-[#0066CC] rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-[#0066CC] mx-auto mb-3" />
          <p className="text-slate-600 font-medium">Loading item details...</p>
        </div>
      </div>
    );
  }

  // ─── Error State ────────────────────────────────────────────────────────
  if (error || !item) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Item Not Found</h2>
          <p className="text-slate-600 mb-6">{error || 'The requested catalogue item could not be found.'}</p>
          <button
            onClick={() => navigate('/library')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Catalogue
          </button>
        </div>
      </div>
    );
  }

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ═══════════════════════════════════════════════════════════════════
          BREADCRUMB
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
            <Link to="/library" className="text-slate-500 hover:text-[#0066CC] transition font-medium">
              Library
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            {item.material_type_name && (
              <>
                <Link
                  to={`/library?material_type=${item.material_type_code}`}
                  className="text-slate-500 hover:text-[#0066CC] transition font-medium"
                >
                  {item.material_type_name}
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </>
            )}
            <span className="text-slate-900 font-semibold truncate max-w-xs">
              {item.title}
            </span>
          </nav>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BOOK HEADER SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Left - Book Cover */}
            <div className="flex-shrink-0">
              <div className="w-56 lg:w-64">
                <div
                  className={`aspect-[3/4] rounded-xl shadow-lg overflow-hidden bg-gradient-to-br ${materialConfig.gradient} flex items-center justify-center relative group`}
                >
                  {item.cover_image_url ? (
                    <img
                      src={item.cover_image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-white p-6">
                      <MaterialIcon className="w-16 h-16 mx-auto mb-3 opacity-80" />
                      <p className="text-sm font-medium opacity-70 leading-tight">
                        {materialConfig.label}
                      </p>
                    </div>
                  )}
                  {/* Subtle overlay on hover */}
                  {item.url && (
                    <button
                      onClick={() => setActiveTab('read')}
                      className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      <span className="bg-white text-slate-900 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 shadow-lg">
                        <Eye className="w-4 h-4" />
                        Read Online
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right - Book Info */}
            <div className="flex-1 min-w-0">
              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-2">
                {item.title}
              </h1>
              {item.subtitle && (
                <p className="text-lg text-slate-600 mb-3">{item.subtitle}</p>
              )}

              {/* Author */}
              {authorDisplay && (
                <p className="text-base text-slate-700 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="font-medium">{authorDisplay}</span>
                  {item.publication_year && (
                    <span className="text-slate-400 font-normal">({item.publication_year})</span>
                  )}
                </p>
              )}

              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                {/* Material Type Badge */}
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${materialConfig.gradient}`}>
                  <MaterialIcon className="w-3.5 h-3.5" />
                  {item.material_type_name || materialConfig.label}
                </span>

                {/* Language Badge */}
                {item.language && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold border border-slate-200">
                    <Globe className="w-3.5 h-3.5" />
                    {item.language}
                  </span>
                )}

                {/* Status */}
                <StatusBadge status={item.status || 'available'} />

                {/* PDF Available */}
                {item.url && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5" />
                    PDF Available
                  </span>
                )}
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm mb-6">
                {item.isbn && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Hash className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-500">ISBN:</span>
                    <span className="font-mono font-medium text-slate-800">{item.isbn}</span>
                  </div>
                )}
                {item.issn && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Hash className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-500">ISSN:</span>
                    <span className="font-mono font-medium text-slate-800">{item.issn}</span>
                  </div>
                )}
                {item.publisher && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-500">Publisher:</span>
                    <span className="font-medium text-slate-800">{item.publisher}</span>
                  </div>
                )}
                {item.edition && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <BookCopy className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-500">Edition:</span>
                    <span className="font-medium text-slate-800">{item.edition}</span>
                  </div>
                )}
                {item.pages && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-500">Pages:</span>
                    <span className="font-medium text-slate-800">{item.pages}</span>
                  </div>
                )}
                {item.call_number && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Barcode className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-500">Call No:</span>
                    <span className="font-mono font-medium text-slate-800">{item.call_number}</span>
                  </div>
                )}
                {item.location && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-500">Location:</span>
                    <span className="font-medium text-slate-800">{item.location}</span>
                  </div>
                )}
                {item.shelf_location && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Library className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-500">Shelf:</span>
                    <span className="font-medium text-slate-800">{item.shelf_location}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {item.url && (
                  <button
                    onClick={() => setActiveTab('read')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition font-semibold text-sm shadow-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Read Online
                  </button>
                )}

                {item.url && (
                  <DownloadManager book={item} className="inline-block" />
                )}

                <button
                  onClick={handlePlaceHold}
                  disabled={placingHold}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#003366] rounded-lg hover:bg-slate-50 transition font-semibold text-sm border border-slate-300 shadow-sm disabled:opacity-50"
                >
                  {placingHold ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <BookmarkCheck className="w-4 h-4" />
                  )}
                  Place Hold
                </button>

                <button
                  onClick={() => setBookmarked(!bookmarked)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm border shadow-sm transition ${
                    bookmarked
                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {bookmarked ? (
                    <Bookmark className="w-4 h-4 fill-amber-500" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                  {bookmarked ? 'Bookmarked' : 'Bookmark'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          TABS NAVIGATION
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide -mb-px">
            {visibleTabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? 'border-[#003366] text-[#003366]'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          MAIN CONTENT + SIDEBAR
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ─── Main Content Area ─────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* ─── OVERVIEW TAB ──────────────────────────────────────── */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Abstract */}
                {item.abstract && (
                  <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Info className="w-5 h-5 text-[#0066CC]" />
                      Abstract / Description
                    </h2>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">{item.abstract}</p>
                  </div>
                )}

                {/* Subject Headings */}
                {item.subject_headings && item.subject_headings.length > 0 && (
                  <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Tag className="w-5 h-5 text-[#0066CC]" />
                      Subject Headings
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {item.subject_headings.map((subject, i) => (
                        <Link
                          key={i}
                          to={`/library?q=${encodeURIComponent(subject)}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition border border-blue-100"
                        >
                          <Search className="w-3 h-3" />
                          {subject}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Keywords */}
                {item.keywords && item.keywords.length > 0 && (
                  <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Hash className="w-5 h-5 text-[#0066CC]" />
                      Keywords
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {item.keywords.map((keyword, i) => (
                        <Link
                          key={i}
                          to={`/library?q=${encodeURIComponent(keyword)}`}
                          className="inline-flex items-center px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition border border-slate-200"
                        >
                          {keyword}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Authors / Notes */}
                {(item.additional_authors || item.notes || item.series) && (
                  <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    {item.additional_authors && (
                      <div>
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Additional Authors</h3>
                        <p className="text-slate-700">{item.additional_authors}</p>
                      </div>
                    )}
                    {item.series && (
                      <div>
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Series</h3>
                        <p className="text-slate-700">{item.series}</p>
                      </div>
                    )}
                    {item.notes && (
                      <div>
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Notes</h3>
                        <p className="text-slate-700">{item.notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Subscription Prompt for non-logged-in users */}
                {!user && (
                  <div className="bg-gradient-to-r from-[#003366] to-[#0066CC] rounded-xl p-6 text-white">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Lock className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1">Sign in to access more features</h3>
                        <p className="text-blue-100 text-sm">
                          Borrow books, save bookmarks, download PDFs, and access premium features with a free NARA Library account.
                        </p>
                      </div>
                      <div className="flex gap-3 flex-shrink-0">
                        <Link
                          to="/library-login"
                          state={{ returnTo: `/library/item/${id}` }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#003366] rounded-lg font-semibold text-sm hover:bg-blue-50 transition"
                        >
                          <LogIn className="w-4 h-4" />
                          Sign In
                        </Link>
                        <Link
                          to="/library-register"
                          state={{ returnTo: `/library/item/${id}` }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg font-semibold text-sm hover:bg-white/30 transition border border-white/30"
                        >
                          <UserPlus className="w-4 h-4" />
                          Register
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── READ ONLINE TAB ───────────────────────────────────── */}
            {activeTab === 'read' && (
              <div className="space-y-4">
                {/* Language Selector - only show if PDF is available */}
                {!pdfLoadError && item.url && (
                  <LanguageSelector book={item} onLanguageChange={handleLanguageChange} />
                )}

                {/* Loading state while checking PDF availability */}
                {pdfChecking && (
                  <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#0066CC] mx-auto mb-3" />
                    <p className="text-slate-600 font-medium">Checking document availability...</p>
                  </div>
                )}

                {/* PDF Not Available - Error State */}
                {!pdfChecking && (pdfLoadError || !item.url) && (
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="p-8 sm:p-12 text-center">
                      {/* Icon */}
                      <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="w-10 h-10 text-slate-400" />
                      </div>

                      {/* Message */}
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        Digital Copy Not Yet Available
                      </h3>
                      <p className="text-slate-500 max-w-md mx-auto mb-8">
                        The digital version of this publication is currently being processed.
                        You may be able to access it from the original source or visit the NARA library in person.
                      </p>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        {/* Source URL link - if available */}
                        {item.source_url && (
                          <a
                            href={item.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#003366] text-white rounded-xl font-semibold text-sm hover:bg-[#002244] transition shadow-lg shadow-blue-900/20"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View at Original Source
                          </a>
                        )}

                        {/* Download source info */}
                        {item.download_source && !item.source_url && (
                          <a
                            href={
                              item.download_source === 'Internet Archive' || item.download_source === 'InternetArchive'
                                ? `https://archive.org/search?query=${encodeURIComponent(item.title)}`
                                : item.download_source === 'CORE'
                                ? `https://core.ac.uk/search?q=${encodeURIComponent(item.title)}`
                                : item.download_source === 'DOAB'
                                ? `https://www.doabooks.org/en/search?q=${encodeURIComponent(item.title)}`
                                : item.download_source === 'DOAJ'
                                ? `https://doaj.org/search/articles?ref=homepage&q=${encodeURIComponent(item.title)}`
                                : item.download_source === 'OpenLibrary'
                                ? `https://openlibrary.org/search?q=${encodeURIComponent(item.title)}`
                                : `https://scholar.google.com/scholar?q=${encodeURIComponent(item.title)}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#003366] text-white rounded-xl font-semibold text-sm hover:bg-[#002244] transition shadow-lg shadow-blue-900/20"
                          >
                            <Search className="w-4 h-4" />
                            Search on {item.download_source === 'InternetArchive' ? 'Internet Archive' : item.download_source}
                          </a>
                        )}

                        {/* Google Scholar fallback search */}
                        <a
                          href={`https://scholar.google.com/scholar?q=${encodeURIComponent(item.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold text-sm hover:bg-slate-50 transition"
                        >
                          <Search className="w-4 h-4" />
                          Search on Google Scholar
                        </a>

                        {/* Browse catalogue */}
                        <Link
                          to="/library"
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold text-sm hover:bg-slate-50 transition"
                        >
                          <Library className="w-4 h-4" />
                          Browse Catalogue
                        </Link>
                      </div>
                    </div>

                    {/* Item Quick Info */}
                    <div className="px-8 py-4 bg-slate-50 border-t border-slate-200">
                      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
                        {item.material_type_name && (
                          <span className="flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5" />
                            {item.material_type_name}
                          </span>
                        )}
                        {item.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            Physical copy: {item.location}
                          </span>
                        )}
                        {item.call_number && (
                          <span className="flex items-center gap-1">
                            <Hash className="w-3.5 h-3.5" />
                            {item.call_number}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* PDF Viewer Container - only show when PDF is accessible */}
                {!pdfChecking && !pdfLoadError && item.url && (
                  <div
                    ref={pdfContainerRef}
                    className={`bg-white rounded-xl border border-slate-200 overflow-hidden ${
                      pdfFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
                    }`}
                  >
                    {/* PDF Toolbar */}
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#0066CC]" />
                          {currentLanguage === 'english' ? 'Original' : currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1)} Version
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Theme Toggle */}
                        {Object.entries(pdfThemes).map(([key, theme]) => {
                          const ThIcon = theme.icon;
                          return (
                            <button
                              key={key}
                              onClick={() => setPdfTheme(key)}
                              className={`p-2 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                                pdfTheme === key
                                  ? 'bg-[#003366] text-white'
                                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                              }`}
                              title={`${theme.label} mode`}
                            >
                              <ThIcon className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">{theme.label}</span>
                            </button>
                          );
                        })}

                        <div className="w-px h-6 bg-slate-200 mx-1" />

                        {/* Open in new tab */}
                        <a
                          href={currentPdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 transition"
                          title="Open in new tab"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        {/* Fullscreen */}
                        <button
                          onClick={toggleFullscreen}
                          className="p-2 rounded-lg bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 transition"
                          title={pdfFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                        >
                          {pdfFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* PDF Iframe */}
                    <div className={`relative ${pdfThemes[pdfTheme].bg}`}>
                      <iframe
                        key={`${currentPdfUrl}-${pdfTheme}`}
                        src={currentPdfUrl}
                        className={`w-full border-0 ${pdfFullscreen ? 'h-[calc(100vh-56px)]' : 'h-[700px] sm:h-[800px]'}`}
                        title={`PDF Viewer - ${item.title}`}
                        onError={() => setPdfLoadError(true)}
                        style={{
                          filter: pdfTheme === 'night' ? 'invert(0.88) hue-rotate(180deg)' : pdfTheme === 'sepia' ? 'sepia(0.3)' : 'none',
                        }}
                      />
                    </div>

                    {/* Fallback */}
                    <div className="px-4 py-3 bg-slate-50 border-t border-slate-200">
                      <p className="text-xs text-slate-500 text-center">
                        PDF not loading?{' '}
                        <a
                          href={currentPdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0066CC] font-medium hover:underline"
                        >
                          Open directly
                        </a>
                        {item.source_url && (
                          <>
                            {' or '}
                            <a
                              href={item.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#0066CC] font-medium hover:underline"
                            >
                              view original source
                            </a>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── TRANSLATIONS TAB ──────────────────────────────────── */}
            {activeTab === 'translations' && item.url && (
              <div className="space-y-4">
                <MultiLanguagePreview book={item} />
              </div>
            )}

            {/* ─── DETAILS TAB ───────────────────────────────────────── */}
            {activeTab === 'details' && (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#0066CC]" />
                    Full Metadata
                  </h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {[
                    { label: 'Title',             value: item.title },
                    { label: 'Subtitle',          value: item.subtitle },
                    { label: 'Author',            value: authorDisplay },
                    { label: 'Additional Authors', value: item.additional_authors },
                    { label: 'Publisher',          value: item.publisher },
                    { label: 'Publication Year',   value: item.publication_year },
                    { label: 'Edition',            value: item.edition },
                    { label: 'Pages',              value: item.pages },
                    { label: 'Language',           value: item.language },
                    { label: 'ISBN',               value: item.isbn,  mono: true },
                    { label: 'ISSN',               value: item.issn,  mono: true },
                    { label: 'Material Type',      value: item.material_type_name },
                    { label: 'Material Code',      value: item.material_type_code, mono: true },
                    { label: 'Call Number',         value: item.call_number, mono: true },
                    { label: 'Barcode',             value: item.barcode, mono: true },
                    { label: 'Location',            value: item.location },
                    { label: 'Shelf Location',      value: item.shelf_location },
                    { label: 'Status',              value: item.status },
                    { label: 'Series',              value: item.series },
                    { label: 'Notes',               value: item.notes },
                    { label: 'Item ID',             value: item.id, mono: true },
                  ]
                    .filter(row => row.value)
                    .map((row, i) => (
                      <div key={i} className="flex flex-col sm:flex-row px-6 py-3 hover:bg-slate-50/50 transition">
                        <dt className="w-44 flex-shrink-0 text-sm font-semibold text-slate-500">{row.label}</dt>
                        <dd className={`text-sm text-slate-900 ${row.mono ? 'font-mono' : ''}`}>{row.value}</dd>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ─── RELATED TAB ───────────────────────────────────────── */}
            {activeTab === 'related' && (
              <div>
                {relatedItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {relatedItems.map((ri) => {
                      const riConfig = getMaterialConfig(ri.material_type_code);
                      const RiIcon = riConfig.icon;
                      return (
                        <button
                          key={ri.id}
                          onClick={() => navigate(`/library/item/${ri.id}`)}
                          className="bg-white rounded-xl border border-slate-200 p-4 text-left hover:shadow-md hover:border-slate-300 transition group"
                        >
                          <div className="flex gap-3">
                            <div className={`w-16 h-20 rounded-lg bg-gradient-to-br ${riConfig.gradient} flex items-center justify-center flex-shrink-0`}>
                              {ri.cover_image_url ? (
                                <img src={ri.cover_image_url} alt={ri.title} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <RiIcon className="w-6 h-6 text-white opacity-80" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-[#0066CC] transition">
                                {ri.title}
                              </h3>
                              {ri.author && (
                                <p className="text-xs text-slate-500 mt-1 truncate">
                                  {typeof ri.author === 'string' ? ri.author : ri.author?.name}
                                </p>
                              )}
                              <span className="text-xs text-slate-400 mt-1 inline-block">
                                {ri.material_type_name || riConfig.label}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <Library className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No related items found.</p>
                    <p className="text-sm text-slate-400 mt-1">Try browsing the catalogue for similar materials.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ─── SIDEBAR ───────────────────────────────────────────── */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-5">

            {/* Availability Card */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm">Availability</h3>
              </div>
              <div className="p-5">
                {(item.available_copies !== undefined && item.available_copies > 0) ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-1">
                      <CheckCircle className="w-5 h-5" />
                      Available
                    </div>
                    <p className="text-sm text-emerald-700">
                      {item.available_copies} of {item.total_copies || item.available_copies} copies available
                    </p>
                  </div>
                ) : item.available_copies === 0 ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 text-amber-800 font-semibold mb-1">
                      <Clock className="w-5 h-5" />
                      All Copies Checked Out
                    </div>
                    <p className="text-sm text-amber-700">
                      0 of {item.total_copies || 0} copies available
                    </p>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold mb-1">
                      <ShieldCheck className="w-5 h-5" />
                      {item.url ? 'Digital Access' : 'Check Availability'}
                    </div>
                    <p className="text-sm text-slate-600">
                      {item.url ? 'Free digital access available online' : 'Contact library for availability'}
                    </p>
                  </div>
                )}

                {/* Location Info */}
                <div className="space-y-2 text-sm">
                  {item.call_number && (
                    <div className="flex items-start gap-2">
                      <Barcode className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500">Call Number</p>
                        <p className="font-mono font-semibold text-slate-900">{item.call_number}</p>
                      </div>
                    </div>
                  )}
                  {item.location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500">Location</p>
                        <p className="font-medium text-slate-900">{item.location}</p>
                        {item.shelf_location && (
                          <p className="text-xs text-slate-500 mt-0.5">Shelf: {item.shelf_location}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm">Actions</h3>
              </div>
              <div className="p-5 space-y-3">
                {/* Source URL (External link) */}
                {item.source_url ? (
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2.5 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition flex items-center justify-center gap-2 font-semibold text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on {item.download_source || 'External Source'}
                  </a>
                ) : item.url ? (
                  <>
                    <button
                      onClick={() => setActiveTab('read')}
                      className="w-full px-4 py-2.5 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition flex items-center justify-center gap-2 font-semibold text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Read Online
                    </button>
                    <DownloadManager book={item} pdfUrl={currentPdfUrl} language={currentLanguage} />
                  </>
                ) : (
                  <PhysicalReservationButton book={item} />
                )}

                {!item.url && !item.source_url && (
                  <button
                    onClick={handlePlaceHold}
                    disabled={placingHold}
                    className="w-full px-4 py-2.5 bg-[#0066CC] text-white rounded-lg hover:bg-[#0055AA] transition flex items-center justify-center gap-2 font-semibold text-sm disabled:opacity-50"
                  >
                    {placingHold ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Placing Hold...
                      </>
                    ) : (
                      <>
                        <BookmarkCheck className="w-4 h-4" />
                        Place Hold
                      </>
                    )}
                  </button>
                )}

                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <button
                    onClick={handleCopyLink}
                    className="w-full px-4 py-2 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition flex items-center justify-center gap-2 text-sm font-medium border border-slate-200"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Link2 className="w-4 h-4" />}
                    {copiedLink ? 'Link Copied!' : 'Copy Link'}
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="w-full px-4 py-2 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition flex items-center justify-center gap-2 text-sm font-medium border border-slate-200"
                  >
                    <Printer className="w-4 h-4" />
                    Print Details
                  </button>
                </div>
              </div>
            </div>

            {/* QR Code */}
            {item.qr_code_url && (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-[#0066CC]" />
                    QR Code
                  </h3>
                </div>
                <div className="p-5 flex flex-col items-center">
                  <img
                    src={item.qr_code_url}
                    alt="QR Code"
                    className="w-36 h-36 mb-2"
                  />
                  <p className="text-xs text-slate-500 text-center">Scan to access on mobile</p>
                </div>
              </div>
            )}

            {/* Citation Generator */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <ScrollText className="w-4 h-4 text-[#0066CC]" />
                  Cite This Item
                </h3>
              </div>
              <div className="p-5">
                {/* Style Tabs */}
                <div className="flex items-center gap-1 mb-3 bg-slate-100 rounded-lg p-1">
                  {['apa', 'mla', 'chicago'].map((style) => (
                    <button
                      key={style}
                      onClick={() => setCitationStyle(style)}
                      className={`flex-1 px-3 py-1.5 rounded-md text-xs font-semibold uppercase transition ${
                        citationStyle === style
                          ? 'bg-white text-[#003366] shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>

                {/* Citation Text */}
                <div className="bg-slate-50 rounded-lg p-3 mb-3 border border-slate-200">
                  <p className="text-xs text-slate-700 leading-relaxed font-mono break-words">
                    {generateCitation(item, citationStyle)}
                  </p>
                </div>

                {/* Copy Button */}
                <button
                  onClick={() => handleCopyCitation(citationStyle)}
                  className="w-full px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition flex items-center justify-center gap-2 text-sm font-medium border border-slate-200"
                >
                  {copiedCitation === citationStyle ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Citation
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Share Card */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#0066CC]" />
                  Share
                </h3>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`mailto:?subject=${encodeURIComponent(item.title)}&body=${encodeURIComponent(`Check out this item from the NARA Library: ${window.location.href}`)}`}
                    className="flex flex-col items-center gap-1 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition border border-slate-200 text-slate-600"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                    <span className="text-[10px] font-medium">Email</span>
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`"${item.title}" - NARA Library`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition border border-slate-200 text-slate-600"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.85.38-1.78.64-2.73.76 1-.6 1.76-1.54 2.12-2.67-.93.55-1.96.95-3.06 1.17-.88-.94-2.13-1.53-3.51-1.53-2.66 0-4.81 2.16-4.81 4.81 0 .38.04.75.13 1.1-4-.2-7.58-2.11-9.96-5.02-.42.72-.66 1.56-.66 2.46 0 1.68.85 3.16 2.14 4.02-.79-.02-1.53-.24-2.18-.6v.06c0 2.35 1.67 4.31 3.88 4.76-.4.1-.83.16-1.27.16-.31 0-.62-.03-.92-.08.63 1.96 2.45 3.39 4.6 3.43-1.68 1.32-3.81 2.1-6.12 2.1-.4 0-.79-.02-1.17-.07 2.19 1.4 4.78 2.22 7.57 2.22 9.07 0 14.02-7.52 14.02-14.02 0-.21 0-.42-.01-.63.96-.7 1.8-1.56 2.46-2.55z"/></svg>
                    <span className="text-[10px] font-medium">Twitter</span>
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition border border-slate-200 text-slate-600"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    <span className="text-[10px] font-medium">Facebook</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Item ID / Barcode */}
            <div className="bg-white rounded-xl border border-slate-200 px-5 py-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Barcode: {item.barcode || 'N/A'}</span>
                <span>ID: {item.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          RELATED ITEMS (Bottom Section - always visible)
      ═══════════════════════════════════════════════════════════════════ */}
      {relatedItems.length > 0 && activeTab !== 'related' && (
        <div className="border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Related Items</h2>
              <button
                onClick={() => setActiveTab('related')}
                className="text-sm text-[#0066CC] hover:text-[#003366] font-medium transition flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {relatedItems.slice(0, 6).map((ri) => {
                const riConfig = getMaterialConfig(ri.material_type_code);
                const RiIcon = riConfig.icon;
                return (
                  <button
                    key={ri.id}
                    onClick={() => navigate(`/library/item/${ri.id}`)}
                    className="bg-slate-50 rounded-xl border border-slate-200 p-3 text-left hover:shadow-md hover:border-slate-300 transition group"
                  >
                    <div className={`w-full aspect-[3/4] rounded-lg bg-gradient-to-br ${riConfig.gradient} flex items-center justify-center mb-3 overflow-hidden`}>
                      {ri.cover_image_url ? (
                        <img src={ri.cover_image_url} alt={ri.title} className="w-full h-full object-cover" />
                      ) : (
                        <RiIcon className="w-8 h-8 text-white opacity-70" />
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-900 text-xs leading-snug line-clamp-2 group-hover:text-[#0066CC] transition mb-1">
                      {ri.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 truncate">
                      {typeof ri.author === 'string' ? ri.author : ri.author?.name || ''}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          BACK TO TOP / FOOTER LINK
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-slate-50 border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/library')}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#003366] font-medium transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Catalogue
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#003366] font-medium transition"
          >
            <ChevronUp className="w-4 h-4" />
            Back to Top
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
