import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Search,
  X,
  Filter,
  SlidersHorizontal,
  Grid3x3,
  List,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Loader2,
  AlertCircle,
  SearchX,
  BookOpen,
  Book,
  Library,
  Building,
  Globe,
  ExternalLink,
  ArrowUpRight,
  Database,
  TrendingUp,
  Sparkles,
  GraduationCap,
  Archive,
  Clock,
  Mail,
  User,
  HelpCircle,
  CheckCircle,
  XCircle,
  Calendar,
  Languages,
  Scale,
  FileText,
  Disc,
  Map,
  MapPin,
  Tablet,
  FileSpreadsheet,
  Droplet,
  BookMarked,
  BookCopy,
  LibraryBig,
  BookOpenCheck,
  FileEdit,
  ScrollText,
  BookmarkCheck,
  FolderOpen,
  Fish,
  FileDigit,
  FileCode,
  Newspaper,
  ArrowLeft,
  Star,
  Bookmark,
  Eye,
  Award,
  ArrowRight,
  LayoutGrid,
  Layers,
} from "lucide-react";
import { searchService, catalogueService } from "../../services/libraryService";
import { useLibraryUser } from "../../contexts/LibraryUserContext";
import SEOHead from '../../components/shared/SEOHead';

// ============================================
// CONSTANTS
// ============================================

const MATERIAL_TYPES = [
  {
    code: "ACT",
    icon: Scale,
    color: "bg-purple-50 text-purple-700 border-purple-200",
    gradient: "from-purple-500 to-purple-600",
    group: "special",
  },
  {
    code: "ATC",
    icon: Archive,
    color: "bg-amber-50 text-amber-700 border-amber-200",
    gradient: "from-amber-500 to-amber-600",
    group: "special",
  },
  {
    code: "BOBP",
    icon: FileText,
    color: "bg-blue-50 text-blue-700 border-blue-200",
    gradient: "from-blue-500 to-blue-600",
    group: "journals",
  },
  {
    code: "CD",
    icon: Disc,
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
    gradient: "from-cyan-500 to-cyan-600",
    group: "digital",
  },
  {
    code: "DMAP",
    icon: Map,
    color: "bg-green-50 text-green-700 border-green-200",
    gradient: "from-green-500 to-green-600",
    group: "maps",
  },
  {
    code: "EBOOK",
    icon: Tablet,
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    gradient: "from-indigo-500 to-indigo-600",
    group: "digital",
  },
  {
    code: "FAO",
    icon: FileSpreadsheet,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    gradient: "from-emerald-500 to-emerald-600",
    group: "journals",
  },
  {
    code: "IOC",
    icon: FileText,
    color: "bg-teal-50 text-teal-700 border-teal-200",
    gradient: "from-teal-500 to-teal-600",
    group: "journals",
  },
  {
    code: "IWMI",
    icon: Droplet,
    color: "bg-sky-50 text-sky-700 border-sky-200",
    gradient: "from-sky-500 to-sky-600",
    group: "journals",
  },
  {
    code: "JR",
    icon: BookOpen,
    color: "bg-violet-50 text-violet-700 border-violet-200",
    gradient: "from-violet-500 to-violet-600",
    group: "journals",
  },
  {
    code: "LBOOK",
    icon: Book,
    color: "bg-blue-50 text-blue-700 border-blue-200",
    gradient: "from-blue-600 to-blue-700",
    group: "books",
  },
  {
    code: "MAP",
    icon: MapPin,
    color: "bg-lime-50 text-lime-700 border-lime-200",
    gradient: "from-lime-500 to-lime-600",
    group: "maps",
  },
  {
    code: "NEWS",
    icon: Newspaper,
    color: "bg-slate-50 text-slate-700 border-slate-200",
    gradient: "from-slate-500 to-slate-600",
    group: "journals",
  },
  {
    code: "PREF",
    icon: BookMarked,
    color: "bg-red-50 text-red-700 border-red-200",
    gradient: "from-red-500 to-red-600",
    group: "books",
  },
  {
    code: "PROC",
    icon: BookCopy,
    color: "bg-orange-50 text-orange-700 border-orange-200",
    gradient: "from-orange-500 to-orange-600",
    group: "journals",
  },
  {
    code: "UACOL",
    icon: LibraryBig,
    color: "bg-pink-50 text-pink-700 border-pink-200",
    gradient: "from-pink-500 to-pink-600",
    group: "special",
  },
  {
    code: "RBOOK",
    icon: BookOpenCheck,
    color: "bg-rose-50 text-rose-700 border-rose-200",
    gradient: "from-rose-500 to-rose-600",
    group: "books",
  },
  {
    code: "RPAPER",
    icon: FileEdit,
    color: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
    gradient: "from-fuchsia-500 to-fuchsia-600",
    group: "journals",
  },
  {
    code: "RNARA",
    icon: ScrollText,
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
    gradient: "from-cyan-600 to-cyan-700",
    group: "journals",
  },
  {
    code: "SREF",
    icon: BookmarkCheck,
    color: "bg-red-50 text-red-700 border-red-200",
    gradient: "from-red-600 to-red-700",
    group: "books",
  },
  {
    code: "SLBOOK",
    icon: Library,
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    gradient: "from-yellow-500 to-yellow-600",
    group: "special",
  },
  {
    code: "SLREP",
    icon: FolderOpen,
    color: "bg-amber-50 text-amber-700 border-amber-200",
    gradient: "from-amber-600 to-amber-700",
    group: "special",
  },
  {
    code: "THESIS",
    icon: GraduationCap,
    color: "bg-purple-50 text-purple-700 border-purple-200",
    gradient: "from-purple-600 to-purple-700",
    group: "journals",
  },
  {
    code: "WFISH",
    icon: Fish,
    color: "bg-blue-50 text-blue-700 border-blue-200",
    gradient: "from-blue-500 to-blue-600",
    group: "special",
  },
  {
    code: "EJART",
    icon: FileDigit,
    color: "bg-violet-50 text-violet-700 border-violet-200",
    gradient: "from-violet-600 to-violet-700",
    group: "digital",
  },
  {
    code: "EREP",
    icon: FileCode,
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    gradient: "from-indigo-600 to-indigo-700",
    group: "digital",
  },
];

const CATEGORY_GROUPS = [
  {
    key: "books",
    labelKey: "categories.books",
    icon: Book,
    codes: ["LBOOK", "RBOOK", "PREF", "SREF"],
  },
  {
    key: "journals",
    labelKey: "categories.journals",
    icon: FileText,
    codes: [
      "JR",
      "RPAPER",
      "RNARA",
      "THESIS",
      "PROC",
      "NEWS",
      "BOBP",
      "FAO",
      "IOC",
      "IWMI",
    ],
  },
  {
    key: "maps",
    labelKey: "categories.maps",
    icon: Map,
    codes: ["MAP", "DMAP"],
  },
  {
    key: "special",
    labelKey: "categories.special",
    icon: Archive,
    codes: ["ACT", "ATC", "UACOL", "SLBOOK", "SLREP", "WFISH"],
  },
  {
    key: "digital",
    labelKey: "categories.digital",
    icon: Globe,
    codes: ["EBOOK", "CD", "EJART", "EREP"],
  },
];

const SORT_OPTIONS = [
  { value: "relevance", labelKey: "filters.sortRelevance" },
  { value: "title_asc", labelKey: "filters.sortTitle" },
  { value: "title_desc", labelKey: "filters.sortTitleDesc" },
  { value: "year_desc", labelKey: "filters.sortNewest" },
  { value: "year_asc", labelKey: "filters.sortOldest" },
];

const STAFF_PICKS = [
  {
    id: "marine-biodiversity",
    titleKey: "catalogue.staffPicks.items.marineBiodiversity.title",
    authorKey: "catalogue.staffPicks.items.marineBiodiversity.author",
    categoryKey: "catalogue.staffPicks.items.marineBiodiversity.category",
  },
  {
    id: "sustainable-fisheries",
    titleKey: "catalogue.staffPicks.items.sustainableFisheries.title",
    authorKey: "catalogue.staffPicks.items.sustainableFisheries.author",
    categoryKey: "catalogue.staffPicks.items.sustainableFisheries.category",
  },
  {
    id: "coastal-restoration",
    titleKey: "catalogue.staffPicks.items.coastalRestoration.title",
    authorKey: "catalogue.staffPicks.items.coastalRestoration.author",
    categoryKey: "catalogue.staffPicks.items.coastalRestoration.category",
  },
];

// ============================================
// HELPERS
// ============================================

/** Parse author - handles JSON-encoded strings like '{"name":"Mustafa, M.G."}' */
const parseAuthor = (author) => {
  if (!author) return "";
  if (typeof author === "object") return author.name || "";
  if (typeof author === "string" && author.startsWith("{")) {
    try {
      return JSON.parse(author).name || author;
    } catch {
      return author;
    }
  }
  return author;
};

// ============================================
// SUB-COMPONENTS
// ============================================

/** Book cover placeholder with gradient based on material type */
const BookCoverPlaceholder = ({ materialType, size = "md" }) => {
  const typeInfo = MATERIAL_TYPES.find((t) => t.code === materialType);
  const IconComp = typeInfo?.icon || BookOpen;
  const gradient = typeInfo?.gradient || "from-gray-400 to-gray-500";
  const sizeClasses = {
    sm: "w-16 h-24",
    md: "w-full h-full",
    lg: "w-32 h-48",
  };
  return (
    <div
      className={`${sizeClasses[size]} bg-gradient-to-br ${gradient} rounded-lg flex flex-col items-center justify-center text-white/80 p-2`}
    >
      <IconComp
        className={size === "sm" ? "w-6 h-6" : "w-10 h-10"}
        strokeWidth={1.5}
      />
      {size !== "sm" && (
        <span className="text-[10px] mt-1 font-medium text-white/60 uppercase tracking-wider">
          {materialType}
        </span>
      )}
    </div>
  );
};

/** Availability badge */
const AvailabilityBadge = ({ item, t }) => {
  if (item.available_copies > 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle className="w-3 h-3" />
        {t("availability.available")} ({item.available_copies})
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
      <XCircle className="w-3 h-3" />
      {t("availability.checkedOut")}
    </span>
  );
};

/** Material type badge */
const MaterialTypeBadge = ({ code, t }) => {
  const typeInfo = MATERIAL_TYPES.find((mt) => mt.code === code);
  if (!typeInfo) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${typeInfo.color}`}
    >
      <typeInfo.icon className="w-3 h-3" />
      {t(`materialTypes.${code}`)}
    </span>
  );
};

/** Book card - Grid view */
const BookCardGrid = ({ item, t, onClick }) => (
  <div
    onClick={onClick}
    className="group bg-white rounded-xl border border-gray-200 hover:border-[#0066CC]/30 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
  >
    {/* Cover */}
    <div className="aspect-[3/4] relative overflow-hidden bg-gray-50">
      {item.cover_image_url ? (
        <img
          src={item.cover_image_url}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <BookCoverPlaceholder materialType={item.material_type_code} />
      )}
      {/* Overlay actions */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
        <div className="flex gap-2 w-full">
          <button className="flex-1 bg-white text-[#003366] text-xs font-semibold py-2 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {t("catalogue.actions.view")}
          </button>
          <button
            className="p-2 bg-white/90 rounded-lg hover:bg-white transition"
            title={t("actions.bookmark")}
          >
            <Bookmark className="w-3.5 h-3.5 text-gray-600" />
          </button>
        </div>
      </div>
      {/* New badge */}
      {item.is_new && (
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#0066CC] text-white text-[10px] font-bold rounded uppercase tracking-wider">
          {t("catalogue.badges.new")}
        </div>
      )}
    </div>
    {/* Details */}
    <div className="p-4 flex flex-col flex-1">
      <div className="mb-2">
        <AvailabilityBadge item={item} t={t} />
      </div>
      <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-[#0066CC] transition-colors mb-1">
        {item.title}
      </h3>
      <p className="text-xs text-gray-500 line-clamp-1 mb-2">
        {parseAuthor(item.author)}
      </p>
      <div className="mt-auto flex items-center justify-between">
        <MaterialTypeBadge code={item.material_type_code} t={t} />
        {item.publication_year && (
          <span className="text-xs text-gray-400">{item.publication_year}</span>
        )}
      </div>
    </div>
  </div>
);

/** Book card - List view */
const BookCardList = ({ item, t, onClick }) => (
  <div
    onClick={onClick}
    className="group bg-white rounded-xl border border-gray-200 hover:border-[#0066CC]/30 hover:shadow-md transition-all duration-300 cursor-pointer p-4 flex gap-4"
  >
    {/* Thumbnail */}
    <div className="w-20 h-28 rounded-lg overflow-hidden flex-shrink-0">
      {item.cover_image_url ? (
        <img
          src={item.cover_image_url}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <BookCoverPlaceholder
          materialType={item.material_type_code}
          size="sm"
        />
      )}
    </div>
    {/* Content */}
    <div className="flex-1 min-w-0 flex flex-col">
      <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-[#0066CC] transition-colors">
        {item.title}
      </h3>
      <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">
        {parseAuthor(item.author)}
      </p>
      <div className="flex items-center gap-3 mt-2 flex-wrap">
        <AvailabilityBadge item={item} t={t} />
        <MaterialTypeBadge code={item.material_type_code} t={t} />
        {item.publication_year && (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {item.publication_year}
          </span>
        )}
        {item.language && (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Languages className="w-3 h-3" />
            {item.language}
          </span>
        )}
      </div>
      {item.abstract && (
        <p className="text-xs text-gray-400 line-clamp-2 mt-2">
          {item.abstract}
        </p>
      )}
    </div>
    {/* Actions */}
    <div className="flex flex-col gap-2 flex-shrink-0">
      <button
        className="p-2 rounded-lg border border-gray-200 hover:border-[#0066CC] hover:text-[#0066CC] transition text-gray-400"
        title={t("actions.bookmark")}
      >
        <Bookmark className="w-4 h-4" />
      </button>
      <button
        className="p-2 rounded-lg border border-gray-200 hover:border-[#0066CC] hover:text-[#0066CC] transition text-gray-400"
        title={t("actions.viewDetails")}
      >
        <Eye className="w-4 h-4" />
      </button>
    </div>
  </div>
);

/** Horizontal scroll carousel */
const HorizontalCarousel = ({ children, className = "" }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 320, behavior: "smooth" });
  };

  return (
    <div className={`relative group/carousel ${className}`}>
      {canScrollLeft && (
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-[#003366] hover:shadow-xl transition-all opacity-0 group-hover/carousel:opacity-100 -translate-x-1/2"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-2 -mx-1 px-1"
      >
        {children}
      </div>
      {canScrollRight && (
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-[#003366] hover:shadow-xl transition-all opacity-0 group-hover/carousel:opacity-100 translate-x-1/2"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

/** Section header */
const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}) => (
  <div className="flex items-end justify-between mb-6">
    <div>
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon className="w-5 h-5 text-[#0066CC]" />}
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
    {actionLabel && (
      <button
        onClick={onAction}
        className="text-sm text-[#0066CC] hover:text-[#003366] font-medium flex items-center gap-1 transition"
      >
        {actionLabel} <ArrowRight className="w-4 h-4" />
      </button>
    )}
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

const LibraryCatalogue = () => {
  const { t, i18n } = useTranslation("library");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useLibraryUser();

  // Library type toggle
  const [libraryType, setLibraryType] = useState(
    searchParams.get("type") || "physical",
  );

  // Search state
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [facets, setFacets] = useState({
    material_types: [],
    years: [],
    languages: [],
  });

  // Filters
  const [filters, setFilters] = useState({
    material_type: searchParams.get("material_type") || "",
    year: searchParams.get("year") || "",
    language: searchParams.get("language") || "",
  });
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);

  // UI State
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [showCategories, setShowCategories] = useState(true);
  const [expandedGroup, setExpandedGroup] = useState(null);

  // Featured data
  const [popularItems, setPopularItems] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [tamilTranslations, setTamilTranslations] = useState([]);
  const [sinhalaTranslations, setSinhalaTranslations] = useState([]);

  // Refs
  const searchInputRef = useRef(null);
  const resultsRef = useRef(null);

  // ============================================
  // DATA LOADING
  // ============================================

  useEffect(() => {
    loadFacets();
    loadPopularItems();
    loadNewArrivals();
    loadTamilTranslations();
    loadSinhalaTranslations();

    if (searchQuery) {
      performSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFacets = async () => {
    try {
      const response = await searchService.getFacets();
      if (response.success) {
        setFacets(response.data);
      }
    } catch (err) {
      console.error("Failed to load facets:", err);
    }
  };

  const loadPopularItems = async () => {
    try {
      const response = await searchService.getPopularItems(8);
      if (response.success) {
        setPopularItems(response.data);
      }
    } catch (err) {
      console.error("Failed to load popular items:", err);
    }
  };

  const loadNewArrivals = async () => {
    try {
      const response = await searchService.getNewArrivals(10);
      if (response.success) {
        setNewArrivals(response.data);
      }
    } catch (err) {
      console.error("Failed to load new arrivals:", err);
    }
  };

  const loadTamilTranslations = async () => {
    try {
      const response = await searchService.getTamilTranslations(6);
      if (response.success) {
        setTamilTranslations(response.data);
      }
    } catch (err) {
      console.error("Failed to load Tamil translations:", err);
    }
  };

  const loadSinhalaTranslations = async () => {
    try {
      const response = await searchService.getSinhalaTranslations(6);
      if (response.success) {
        setSinhalaTranslations(response.data);
      }
    } catch (err) {
      console.error("Failed to load Sinhala translations:", err);
    }
  };

  // ============================================
  // SEARCH & FILTER HANDLERS
  // ============================================

  const performSearch = async (page = 1) => {
    if (!searchQuery.trim()) {
      setItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    setShowCategories(false);

    try {
      const params = { page, limit: 20, ...filters };
      const response = await searchService.search(searchQuery, params);
      if (response.success) {
        setItems(response.data || []);
        setPagination(response.pagination || {});
      } else {
        setError(response.error || t("catalogue.errors.searchFailed"));
        setItems([]);
      }
    } catch (err) {
      setError(t("catalogue.errors.searchFailed"));
      console.error("Search error:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const performCategorySearch = async (categoryCode, page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const params = { page, limit: 20, material_type: categoryCode };
      const response = await catalogueService.getAllItems(params);
      if (response.success) {
        setItems(response.data || []);
        setPagination(response.pagination || {});
      } else {
        setError(response.error || t("catalogue.errors.loadFailed"));
        setItems([]);
      }
    } catch (err) {
      setError(t("catalogue.errors.loadFailed"));
      console.error("Category search error:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams({ q: searchQuery, ...filters });
      setSearchParams(params);
      performSearch();
      // Scroll to results
      setTimeout(
        () =>
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        300,
      );
    }
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    if (searchQuery) {
      const params = new URLSearchParams({ q: searchQuery, ...newFilters });
      setSearchParams(params);
      performSearch();
    }
  };

  const clearFilters = () => {
    setFilters({ material_type: "", year: "", language: "" });
    setSearchParams({ q: searchQuery });
    if (searchQuery) performSearch();
  };

  const handleItemClick = (itemId) => {
    navigate(`/library/item/${itemId}`);
  };

  const handleCategoryClick = (categoryCode) => {
    setFilters({ ...filters, material_type: categoryCode });
    setSearchParams({ material_type: categoryCode });
    setShowCategories(false);
    if (categoryCode) {
      setSearchQuery("*");
      performCategorySearch(categoryCode);
    }
  };

  const resetToHome = () => {
    setFilters({ material_type: "", year: "", language: "" });
    setSearchParams({});
    setShowCategories(true);
    setItems([]);
    setSearchQuery("");
  };

  // Computed
  const totalItems = facets.material_types.reduce(
    (sum, type) => sum + (type.count || 0),
    0,
  );
  const isSearchActive = searchQuery && searchQuery !== "*";
  const isCategoryActive = filters.material_type && !isSearchActive;
  const showFeatured = !searchQuery && !filters.material_type && showCategories;
  const translationDateLocale = i18n.resolvedLanguage?.startsWith("si")
    ? "si-LK"
    : i18n.resolvedLanguage?.startsWith("ta")
      ? "ta-LK"
      : "en-US";

  // ============================================
  // RENDER
  // ============================================

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{
        fontFamily:
          "'Inter', 'Noto Sans Sinhala', 'Noto Sans Tamil', system-ui, sans-serif",
      }}
    >
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative bg-gradient-to-br from-[#003366] via-[#004080] to-[#0066CC] text-white overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0066CC]/20 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M0 0h1v1H0zM20 0h1v1h-1zM0 20h1v1H0zM20 20h1v1h-1z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          {/* Title area */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5">
              <Library className="w-4 h-4" />
              <span className="text-sm font-medium">
                {t("catalogue.agencyName")}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
              {t("hero.title")}
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              {t("hero.subtitle")}
            </p>
          </div>

          {/* Library Type Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-1.5 inline-flex gap-1 border border-white/20">
              <button
                onClick={() => {
                  setLibraryType("physical");
                  setSearchParams({ type: "physical" });
                  setFilters({ material_type: "", year: "", language: "" });
                  setItems([]);
                  setShowCategories(true);
                  setSearchQuery("");
                }}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm ${libraryType === "physical"
                    ? "bg-white text-[#003366] shadow-lg"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <Building className="w-4 h-4" />
                {t("catalogue.libraryType.physical")}
              </button>
              <button
                onClick={() => {
                  setLibraryType("digital");
                  setSearchParams({ type: "digital" });
                  setFilters({ material_type: "", year: "", language: "" });
                  setItems([]);
                  setShowCategories(true);
                  setSearchQuery("");
                }}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm ${libraryType === "digital"
                    ? "bg-white text-[#003366] shadow-lg"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <Globe className="w-4 h-4" />
                {t("catalogue.libraryType.digital")}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-8">
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-xl border border-white/25 rounded-2xl p-1.5 shadow-2xl">
                <div className="flex items-center bg-white rounded-xl overflow-hidden">
                  <Search className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery === "*" ? "" : searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("hero.searchPlaceholder")}
                    className="flex-1 px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none text-base"
                  />
                  {searchQuery && searchQuery !== "*" && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setItems([]);
                        setShowCategories(true);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={!searchQuery.trim() || searchQuery === "*"}
                    className="bg-[#003366] hover:bg-[#002244] text-white px-6 py-3 m-1 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <Search className="w-4 h-4" />
                    {t("hero.searchButton")}
                  </button>
                </div>
              </div>
            </div>
            {/* Quick links under search */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="text-blue-100 hover:text-white text-sm flex items-center gap-1.5 transition"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {showFilters ? t("hero.hideFilters") : t("hero.advancedSearch")}
              </button>
              <span className="text-white/30">|</span>
              <button
                type="button"
                onClick={resetToHome}
                className="text-blue-100 hover:text-white text-sm flex items-center gap-1.5 transition"
              >
                <Grid3x3 className="w-3.5 h-3.5" />
                {t("hero.browseCategories")}
              </button>
            </div>
          </form>

          {/* Quick Stats */}
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  value: totalItems.toLocaleString(),
                  label: t("hero.stats.totalItems"),
                  icon: Book,
                },
                {
                  value: facets.material_types.length || 26,
                  label: t("hero.stats.categories"),
                  icon: Layers,
                },
                {
                  value: facets.languages.length,
                  label: t("hero.stats.languages"),
                  icon: Languages,
                },
                {
                  value: facets.years.length,
                  label: t("hero.stats.yearsCovered"),
                  icon: Calendar,
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/[0.07] backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10 text-center"
                >
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-blue-200 mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== EXTERNAL RESOURCES BAR ==================== */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" />
              {t("externalResources.title", "External Digital Resources")}
            </span>
            <div className="flex items-center gap-3">
              <a
                href="https://dspace.nara.ac.lk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 border border-emerald-200 transition group"
              >
                <Database className="w-4 h-4" />
                {t("externalResources.dspace")}
                <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 transition" />
              </a>
              <a
                href="https://koha.nara.ac.lk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-100 border border-orange-200 transition group"
              >
                <BookOpen className="w-4 h-4" />
                {t("externalResources.koha")}
                <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 transition" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== MEMBERSHIP BANNER (for non-logged-in users) ==================== */}
      {!isAuthenticated && showFeatured && (
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#003366] rounded-xl text-white">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {t("catalogue.membershipBanner.title")}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t("catalogue.membershipBanner.description")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="hidden lg:flex items-center gap-4 text-sm text-gray-500 mr-4">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />{" "}
                    {t("catalogue.membershipBanner.freeAccess")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Book className="w-3.5 h-3.5" />{" "}
                    {t("catalogue.membershipBanner.studentAccess")}
                  </span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />{" "}
                    {t("catalogue.membershipBanner.researcherAccess")}
                  </span>
                </div>
                <Link
                  to="/library-register"
                  className="inline-flex items-center gap-2 bg-[#003366] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#002244] transition text-sm"
                >
                  <User className="w-4 h-4" />
                  {t("catalogue.membershipBanner.cta")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================== FILTER PANEL ==================== */}
      {showFilters && (
        <section className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Filter className="w-4 h-4 text-[#0066CC]" />
              {t("filters.advancedFilters")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Material Type */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  {t("filters.materialType")}
                </label>
                <select
                  value={filters.material_type}
                  onChange={(e) =>
                    handleFilterChange("material_type", e.target.value)
                  }
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0066CC]/20 focus:border-[#0066CC] text-sm bg-gray-50 hover:bg-white transition"
                >
                  <option value="">{t("filters.allTypes")}</option>
                  {MATERIAL_TYPES.map((type) => {
                    const count =
                      facets.material_types.find((f) => f.code === type.code)
                        ?.count || 0;
                    return (
                      <option key={type.code} value={type.code}>
                        {t(`materialTypes.${type.code}`)}{" "}
                        {count > 0 && `(${count})`}
                      </option>
                    );
                  })}
                </select>
              </div>
              {/* Year */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  {t("filters.publicationYear")}
                </label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange("year", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0066CC]/20 focus:border-[#0066CC] text-sm bg-gray-50 hover:bg-white transition"
                >
                  <option value="">{t("filters.allYears")}</option>
                  {facets.years.slice(0, 30).map((year) => (
                    <option
                      key={year.publication_year}
                      value={year.publication_year}
                    >
                      {year.publication_year} ({year.count})
                    </option>
                  ))}
                </select>
              </div>
              {/* Language */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  {t("filters.language")}
                </label>
                <select
                  value={filters.language}
                  onChange={(e) =>
                    handleFilterChange("language", e.target.value)
                  }
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0066CC]/20 focus:border-[#0066CC] text-sm bg-gray-50 hover:bg-white transition"
                >
                  <option value="">{t("filters.allLanguages")}</option>
                  {facets.languages.map((lang) => (
                    <option key={lang.language} value={lang.language}>
                      {lang.language} ({lang.count})
                    </option>
                  ))}
                </select>
              </div>
              {/* Sort */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  {t("filters.sortBy")}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0066CC]/20 focus:border-[#0066CC] text-sm bg-gray-50 hover:bg-white transition"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {t(opt.labelKey)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.material_type || filters.year || filters.language) && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-gray-500">
                  {t("filters.activeFilters")}
                </span>
                {filters.material_type && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs border border-blue-200">
                    {t(`materialTypes.${filters.material_type}`)}
                    <button
                      onClick={() => handleFilterChange("material_type", "")}
                      className="hover:bg-blue-100 rounded-full p-0.5 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.year && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs border border-purple-200">
                    {filters.year}
                    <button
                      onClick={() => handleFilterChange("year", "")}
                      className="hover:bg-purple-100 rounded-full p-0.5 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.language && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs border border-green-200">
                    {filters.language}
                    <button
                      onClick={() => handleFilterChange("language", "")}
                      className="hover:bg-green-100 rounded-full p-0.5 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 ml-2"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  {t("filters.clearAll")}
                </button>
              </div>
            )}

            {/* Quick filter chips */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-2">
                {t("filters.quickFilters")}
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    label: t("filters.eBooks"),
                    icon: Tablet,
                    filter: { material_type: "EBOOK" },
                  },
                  {
                    label: t("filters.naraResearch"),
                    icon: ScrollText,
                    filter: { material_type: "RNARA" },
                  },
                  {
                    label: t("filters.theses"),
                    icon: GraduationCap,
                    filter: { material_type: "THESIS" },
                  },
                  {
                    label: t("filters.thisYear"),
                    icon: Sparkles,
                    filter: { year: new Date().getFullYear().toString() },
                  },
                ].map((chip, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const [key, value] = Object.entries(chip.filter)[0];
                      handleFilterChange(key, value);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:border-[#0066CC] hover:text-[#0066CC] hover:bg-blue-50 transition"
                  >
                    <chip.icon className="w-3.5 h-3.5" />
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ---------- PHYSICAL LIBRARY: CATEGORY BROWSER ---------- */}
        {libraryType === "physical" && showFeatured && (
          <section className="mb-14">
            <SectionHeader
              icon={Layers}
              title={t("catalogue.sections.physicalBrowseTitle", {
                title: t("browse.title"),
              })}
              subtitle={t("catalogue.sections.physicalBrowseSubtitle")}
            />

            <div className="space-y-6">
              {CATEGORY_GROUPS.map((group) => {
                const groupTypes = MATERIAL_TYPES.filter((mt) =>
                  group.codes.includes(mt.code),
                );
                const isExpanded =
                  expandedGroup === group.key || expandedGroup === null;
                const GroupIcon = group.icon;

                return (
                  <div
                    key={group.key}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                  >
                    {/* Group Header */}
                    <button
                      onClick={() =>
                        setExpandedGroup(
                          expandedGroup === group.key ? null : group.key,
                        )
                      }
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#003366]/5 rounded-lg">
                          <GroupIcon className="w-5 h-5 text-[#003366]" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {t(group.labelKey)}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {t("catalogue.groupMeta.categories", {
                              count: groupTypes.length,
                            })}
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Group Content */}
                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-gray-100">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-4">
                          {groupTypes.map((type) => {
                            const TypeIcon = type.icon;
                            const itemCount =
                              facets.material_types.find(
                                (f) => f.code === type.code,
                              )?.count || 0;
                            return (
                              <button
                                key={type.code}
                                onClick={() => handleCategoryClick(type.code)}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-[#0066CC]/40 hover:shadow-md transition-all duration-200 group bg-white hover:bg-blue-50/30`}
                              >
                                <div
                                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.gradient} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}
                                >
                                  <TypeIcon className="w-6 h-6" />
                                </div>
                                <div className="text-center">
                                  <p className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2">
                                    {t(`materialTypes.${type.code}`)}
                                  </p>
                                  {itemCount > 0 && (
                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                      {itemCount}{" "}
                                      {itemCount === 1
                                        ? t("browse.item")
                                        : t("browse.items")}
                                    </p>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ---------- NEW ARRIVALS CAROUSEL ---------- */}
        {showFeatured && newArrivals.length > 0 && (
          <section className="mb-14">
            <SectionHeader
              icon={Sparkles}
              title={t("sections.newArrivals")}
              subtitle={t("catalogue.sections.newArrivalsSubtitle")}
            />
            <HorizontalCarousel>
              {newArrivals.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className="flex-shrink-0 w-56 cursor-pointer group"
                >
                  <div className="aspect-[3/4] rounded-xl overflow-hidden mb-3 shadow-sm group-hover:shadow-lg transition-shadow">
                    {item.cover_image_url ? (
                      <img
                        src={item.cover_image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <BookCoverPlaceholder
                        materialType={item.material_type_code}
                      />
                    )}
                  </div>
                  <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-[#0066CC] transition-colors leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                    {parseAuthor(item.author)}
                  </p>
                  <div className="mt-1.5">
                    <AvailabilityBadge item={item} t={t} />
                  </div>
                </div>
              ))}
            </HorizontalCarousel>
          </section>
        )}

        {/* ---------- POPULAR THIS MONTH ---------- */}
        {showFeatured && popularItems.length > 0 && (
          <section className="mb-14">
            <SectionHeader
              icon={TrendingUp}
              title={t("sections.popularItems")}
              subtitle={t("catalogue.sections.popularSubtitle")}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularItems.slice(0, 8).map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className="bg-white rounded-xl border border-gray-200 hover:border-[#0066CC]/30 hover:shadow-md transition-all cursor-pointer p-4 flex gap-3 group"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-20 rounded-lg overflow-hidden">
                      {item.cover_image_url ? (
                        <img
                          src={item.cover_image_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookCoverPlaceholder
                          materialType={item.material_type_code}
                          size="sm"
                        />
                      )}
                    </div>
                    <span className="absolute -top-2 -left-2 w-6 h-6 bg-[#003366] text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-[#0066CC] transition-colors leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {parseAuthor(item.author)}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <AvailabilityBadge item={item} t={t} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ---------- STAFF PICKS ---------- */}
        {showFeatured && (
          <section className="mb-14">
            <SectionHeader
              icon={Star}
              title={t("sections.staffPicks")}
              subtitle={t("catalogue.sections.staffPicksSubtitle")}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {STAFF_PICKS.map((pick) => (
                <div
                  key={pick.id}
                  onClick={() => handleItemClick(pick.id)}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:border-[#0066CC]/30 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-24 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                      <BookCoverPlaceholder materialType="LBOOK" size="sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded text-[10px] font-semibold border border-yellow-200 mb-2">
                        <Star className="w-3 h-3" />
                        {t("catalogue.staffPicks.badge")}
                      </span>
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-[#0066CC] transition-colors leading-snug">
                        {t(pick.titleKey)}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {t(pick.authorKey)}
                      </p>
                      <span className="inline-block mt-1.5 text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                        {t(pick.categoryKey)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ---------- FEATURED COLLECTION BANNERS ---------- */}
        {showFeatured && libraryType === "physical" && (
          <section className="mb-14">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-gradient-to-br from-[#003366] to-[#0066CC] rounded-xl p-6 text-white">
                <TrendingUp className="w-7 h-7 mb-3 text-blue-200" />
                <h3 className="text-lg font-bold mb-1">
                  {t("featured.naraResearch.title")}
                </h3>
                <p className="text-sm text-blue-100 mb-4">
                  {t("featured.naraResearch.description")}
                </p>
                <button
                  onClick={() => handleCategoryClick("RNARA")}
                  className="bg-white text-[#003366] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-50 transition"
                >
                  {t("featured.naraResearch.cta")}
                </button>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 text-white">
                <GraduationCap className="w-7 h-7 mb-3 text-purple-200" />
                <h3 className="text-lg font-bold mb-1">
                  {t("featured.academicResources.title")}
                </h3>
                <p className="text-sm text-purple-100 mb-4">
                  {t("featured.academicResources.description")}
                </p>
                <button
                  onClick={() => handleCategoryClick("THESIS")}
                  className="bg-white text-purple-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-purple-50 transition"
                >
                  {t("featured.academicResources.cta")}
                </button>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white">
                <Archive className="w-7 h-7 mb-3 text-amber-100" />
                <h3 className="text-lg font-bold mb-1">
                  {t("featured.specialCollections.title")}
                </h3>
                <p className="text-sm text-amber-100 mb-4">
                  {t("featured.specialCollections.description")}
                </p>
                <button
                  onClick={() => handleCategoryClick("ATC")}
                  className="bg-white text-amber-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-amber-50 transition"
                >
                  {t("featured.specialCollections.cta")}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ---------- DIGITAL LIBRARY: SINHALA TRANSLATIONS ---------- */}
        {libraryType === "digital" &&
          showFeatured &&
          sinhalaTranslations.length > 0 && (
            <section className="mb-14">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-5 mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3 text-white">
                  <Globe className="w-7 h-7" />
                  <div>
                    <h2 className="text-lg font-bold">
                      {t("sections.sinhalaTranslations")}
                    </h2>
                    <p className="text-sm text-blue-100">
                      {t("catalogue.sections.translationSubtitle")}
                    </p>
                  </div>
                </div>
                <span className="bg-white/20 rounded-lg px-3 py-1.5 text-white text-sm font-medium">
                  {t("catalogue.sections.booksCount", {
                    count: sinhalaTranslations.length,
                  })}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sinhalaTranslations.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer p-4 flex gap-4 group"
                  >
                    <div className="w-16 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      {item.cover_image_url ? (
                        <img
                          src={item.cover_image_url}
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Languages className="w-7 h-7 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-semibold border border-blue-200">
                          {t("catalogue.badges.sinhala")}
                        </span>
                        <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] border border-indigo-200">
                          {t("itemDetail.translations.aiTranslated")}
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-[#0066CC] transition-colors leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {parseAuthor(item.author)}
                      </p>
                      {item.translations?.sinhala?.translated_at && (
                        <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {t("catalogue.sections.addedDate", {
                            date: new Date(
                              item.translations.sinhala.translated_at,
                            ).toLocaleDateString(translationDateLocale, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }),
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        {/* ---------- DIGITAL LIBRARY: TAMIL TRANSLATIONS ---------- */}
        {libraryType === "digital" &&
          showFeatured &&
          tamilTranslations.length > 0 && (
            <section className="mb-14">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-5 mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3 text-white">
                  <Globe className="w-7 h-7" />
                  <div>
                    <h2 className="text-lg font-bold">
                      {t("sections.tamilTranslations")}
                    </h2>
                    <p className="text-sm text-orange-100">
                      {t("catalogue.sections.translationSubtitle")}
                    </p>
                  </div>
                </div>
                <span className="bg-white/20 rounded-lg px-3 py-1.5 text-white text-sm font-medium">
                  {t("catalogue.sections.booksCount", {
                    count: tamilTranslations.length,
                  })}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tamilTranslations.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className="bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer p-4 flex gap-4 group"
                  >
                    <div className="w-16 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      {item.cover_image_url ? (
                        <img
                          src={item.cover_image_url}
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Languages className="w-7 h-7 text-orange-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        <span className="px-1.5 py-0.5 bg-orange-50 text-orange-700 rounded text-[10px] font-semibold border border-orange-200">
                          {t("catalogue.badges.tamil")}
                        </span>
                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] border border-blue-200">
                          {t("itemDetail.translations.aiTranslated")}
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-[#0066CC] transition-colors leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {parseAuthor(item.author)}
                      </p>
                      {item.translations?.tamil?.translated_at && (
                        <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {t("catalogue.sections.addedDate", {
                            date: new Date(
                              item.translations.tamil.translated_at,
                            ).toLocaleDateString(translationDateLocale, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }),
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        {/* ==================== SEARCH / CATEGORY RESULTS ==================== */}
        <div ref={resultsRef}>
          {/* Active Category Header */}
          {isCategoryActive && (
            <div className="mb-6 bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {(() => {
                    const activeType = MATERIAL_TYPES.find(
                      (mt) => mt.code === filters.material_type,
                    );
                    if (!activeType) return null;
                    const TypeIcon = activeType.icon;
                    return (
                      <>
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-br ${activeType.gradient} text-white`}
                        >
                          <TypeIcon className="w-7 h-7" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">
                            {t(`materialTypes.${activeType.code}`)}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {pagination.total || 0}{" "}
                            {pagination.total === 1
                              ? t("results.item")
                              : t("results.itemsInCollection")}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <button
                  onClick={resetToHome}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("results.backToCategories")}
                </button>
              </div>
            </div>
          )}

          {/* Search Results Header */}
          {isSearchActive && (
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {t("results.title")}
                    {pagination.total > 0 && (
                      <span className="text-gray-400 text-base font-normal ml-2">
                        ({pagination.total} {t("results.itemsFound")})
                      </span>
                    )}
                  </h2>
                </div>
                {/* View toggle */}
                <div className="flex items-center gap-2">
                  <div className="flex bg-gray-100 rounded-lg p-0.5">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition ${viewMode === "grid" ? "bg-white shadow-sm text-[#003366]" : "text-gray-400 hover:text-gray-600"}`}
                      title={t("filters.viewGrid")}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md transition ${viewMode === "list" ? "bg-white shadow-sm text-[#003366]" : "text-gray-400 hover:text-gray-600"}`}
                      title={t("filters.viewList")}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#0066CC] mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  {t("results.searching")}
                </p>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-700 font-medium">
                  {t("catalogue.errors.searchTitle")}
                </p>
                <p className="text-sm text-red-600 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* No results */}
          {!loading &&
            !error &&
            (isSearchActive || isCategoryActive) &&
            items.length === 0 && (
              <div className="text-center py-20">
                <SearchX className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-medium text-lg">
                  {t("results.noItemsFound")}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {t("results.tryDifferent")}
                </p>
                <button
                  onClick={resetToHome}
                  className="mt-4 text-[#0066CC] hover:text-[#003366] text-sm font-medium flex items-center gap-1 mx-auto transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t("catalogue.results.backToBrowse")}
                </button>
              </div>
            )}

          {/* Results grid/list */}
          {!loading && !error && items.length > 0 && (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {items.map((item) => (
                    <BookCardGrid
                      key={item.id}
                      item={item}
                      t={t}
                      onClick={() => handleItemClick(item.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <BookCardList
                      key={item.id}
                      item={item}
                      t={t}
                      onClick={() => handleItemClick(item.id)}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      if (isSearchActive) performSearch(pagination.page - 1);
                      else if (isCategoryActive)
                        performCategorySearch(
                          filters.material_type,
                          pagination.page - 1,
                        );
                    }}
                    disabled={pagination.page === 1}
                    className="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition text-sm font-medium text-gray-600 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {t("catalogue.results.previous")}
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: Math.min(pagination.totalPages, 5) },
                      (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (
                          pagination.page >=
                          pagination.totalPages - 2
                        ) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => {
                              if (isSearchActive) performSearch(pageNum);
                              else if (isCategoryActive)
                                performCategorySearch(
                                  filters.material_type,
                                  pageNum,
                                );
                            }}
                            className={`w-9 h-9 rounded-lg text-sm font-medium transition ${pageNum === pagination.page
                                ? "bg-[#003366] text-white"
                                : "text-gray-600 hover:bg-gray-100"
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      },
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (isSearchActive) performSearch(pagination.page + 1);
                      else if (isCategoryActive)
                        performCategorySearch(
                          filters.material_type,
                          pagination.page + 1,
                        );
                    }}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition text-sm font-medium text-gray-600 flex items-center gap-1"
                  >
                    {t("catalogue.results.next")}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* ==================== SUBSCRIPTION / MEMBERSHIP SECTION ==================== */}
        {showFeatured && (
          <section className="mb-14 mt-14">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {t("catalogue.membershipPlans.title")}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {t("catalogue.membershipPlans.subtitle")}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Free Reader */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                    <Eye className="w-6 h-6 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {t("catalogue.membershipPlans.free.name")}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {t("catalogue.membershipPlans.free.description")}
                  </p>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  {t("catalogue.membershipPlans.free.price")}
                </div>
                <ul className="space-y-2 text-sm text-gray-600 flex-1 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />{" "}
                    {t("catalogue.membershipPlans.free.features.browse")}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />{" "}
                    {t("catalogue.membershipPlans.free.features.details")}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />{" "}
                    {t("catalogue.membershipPlans.free.features.search")}
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />{" "}
                    {t("catalogue.membershipPlans.free.features.borrow")}
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />{" "}
                    {t("catalogue.membershipPlans.free.features.submit")}
                  </li>
                </ul>
                <Link
                  to="/library-register"
                  className="w-full text-center py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition text-sm"
                >
                  {t("catalogue.membershipPlans.free.cta")}
                </Link>
              </div>

              {/* Student Access */}
              <div className="bg-white rounded-xl border-2 border-[#0066CC] p-6 flex flex-col relative shadow-lg">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0066CC] text-white text-xs font-bold px-3 py-1 rounded-full">
                  {t("catalogue.membershipPlans.student.badge")}
                </div>
                <div className="mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
                    <Book className="w-6 h-6 text-[#0066CC]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {t("catalogue.membershipPlans.student.name")}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {t("catalogue.membershipPlans.student.description")}
                  </p>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  {t("catalogue.membershipPlans.student.price")}{" "}
                  <span className="text-sm font-normal text-gray-500">
                    {t("catalogue.membershipPlans.student.priceSuffix")}
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 flex-1 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />{" "}
                    {t(
                      "catalogue.membershipPlans.student.features.includesFree",
                    )}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />{" "}
                    {t("catalogue.membershipPlans.student.features.borrow")}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />{" "}
                    {t("catalogue.membershipPlans.student.features.loan")}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />{" "}
                    {t("catalogue.membershipPlans.student.features.holds")}
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />{" "}
                    {t("catalogue.membershipPlans.student.features.submit")}
                  </li>
                </ul>
                <Link
                  to="/library-register"
                  className="w-full text-center py-2.5 bg-[#003366] text-white rounded-lg font-medium hover:bg-[#002244] transition text-sm"
                >
                  {t("catalogue.membershipPlans.student.cta")}
                </Link>
              </div>

              {/* Researcher Premium */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-3">
                    <GraduationCap className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {t("catalogue.membershipPlans.researcher.name")}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {t("catalogue.membershipPlans.researcher.description")}
                  </p>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  {t("catalogue.membershipPlans.researcher.price")}{" "}
                  <span className="text-sm font-normal text-gray-500">
                    {t("catalogue.membershipPlans.researcher.priceSuffix")}
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 flex-1 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />{" "}
                    {t(
                      "catalogue.membershipPlans.researcher.features.includesStudent",
                    )}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />{" "}
                    {t("catalogue.membershipPlans.researcher.features.borrow")}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />{" "}
                    {t("catalogue.membershipPlans.researcher.features.loan")}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />{" "}
                    {t("catalogue.membershipPlans.researcher.features.submit")}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />{" "}
                    {t("catalogue.membershipPlans.researcher.features.digital")}
                  </li>
                </ul>
                <Link
                  to="/library-register"
                  className="w-full text-center py-2.5 border border-purple-200 text-purple-700 rounded-lg font-medium hover:bg-purple-50 transition text-sm"
                >
                  {t("catalogue.membershipPlans.researcher.cta")}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ==================== LIBRARY INFO FOOTER ==================== */}
        {showFeatured && (
          <section className="mb-6">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* About */}
                <div className="p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#0066CC]" />
                    {t("about.title")}
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    {t("about.description")}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <Clock className="w-5 h-5 text-[#003366] mb-2" />
                      <h4 className="font-semibold text-sm text-gray-900">
                        {t("about.openHours.title")}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {t("about.openHours.schedule")}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <Mail className="w-5 h-5 text-[#003366] mb-2" />
                      <h4 className="font-semibold text-sm text-gray-900">
                        {t("about.contact.title")}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {t("about.contact.email")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="p-8 bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {t("services.title")}
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        icon: User,
                        title: t("services.patronPortal.title"),
                        desc: t("services.patronPortal.description"),
                        to: "/library/patron-portal",
                      },
                      {
                        icon: Database,
                        title: t("services.digitalRepository.title"),
                        desc: t("services.digitalRepository.description"),
                        to: "/knowledge-discovery-center",
                      },
                      {
                        icon: HelpCircle,
                        title: t("services.needHelp.title"),
                        desc: t("services.needHelp.description"),
                        to: "/contact-us",
                      },
                    ].map((service, i) => (
                      <button
                        key={i}
                        onClick={() => navigate(service.to)}
                        className="w-full bg-white border border-gray-200 rounded-xl p-4 hover:border-[#0066CC]/30 hover:shadow-sm transition text-left flex items-center gap-4 group"
                      >
                        <div className="p-2.5 bg-[#003366]/5 rounded-lg group-hover:bg-[#003366]/10 transition">
                          <service.icon className="w-5 h-5 text-[#003366]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-900">
                            {service.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {service.desc}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#0066CC] transition flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Scrollbar hide CSS */}
      <style>{`
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default LibraryCatalogue;
