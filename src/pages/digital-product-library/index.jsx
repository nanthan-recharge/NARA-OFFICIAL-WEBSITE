import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Database,
  LineChart,
  Cpu,
  FileText,
  Map,
  Camera,
  Server,
  Terminal,
  CloudRain,
  Fish,
  Recycle,
  ListTree,
  Radio,
  Layers,
  ArrowUpRight,
  Search,
  Filter,
  BadgeCheck,
  BookOpen
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StitchWrapper from '../../components/shared/StitchWrapper';

const ICON_MAP = {
  Sparkles,
  Database,
  LineChart,
  Cpu,
  FileText,
  Map,
  Camera,
  Server,
  Terminal,
  CloudRain,
  Fish,
  Recycle,
  ListTree,
  Radio,
  Layers,
  BadgeCheck,
  BookOpen
};

const resolveIcon = (iconName, fallback) => {
  if (iconName && ICON_MAP[iconName]) {
    return ICON_MAP[iconName];
  }
  if (fallback && ICON_MAP[fallback]) {
    return ICON_MAP[fallback];
  }
  return Sparkles;
};

const METRICS_FALLBACK = [
  {
    id: 'datasets',
    label: 'Published datasets',
    value: '128',
    delta: '+12 newly curated',
    icon: 'Database',
    description: 'Observation, modelling, and survey records'
  },
  {
    id: 'visualizations',
    label: 'Interactive dashboards',
    value: '64',
    delta: '+8 refreshed',
    icon: 'LineChart',
    description: 'Maps, storyboards, and live analytics'
  },
  {
    id: 'toolkits',
    label: 'Analysis toolkits',
    value: '23',
    delta: '+3 upgraded',
    icon: 'Cpu',
    description: 'Scripts, notebooks, and processing pipelines'
  },
  {
    id: 'publications',
    label: 'Linked publications',
    value: '340',
    delta: '+18 this year',
    icon: 'FileText',
    description: 'Peer-reviewed outputs referencing the library'
  }
];

const CATEGORIES_FALLBACK = [
  {
    id: 'datasets',
    title: 'Research datasets',
    description: 'Quality-controlled observational and model outputs delivered in analysis-ready formats.',
    icon: 'Database',
    badge: 'NetCDF · CSV · GeoTIFF'
  },
  {
    id: 'tools',
    title: 'Analysis toolkits',
    description: 'Reusable scripts, notebooks, and Docker images for automating marine science workflows.',
    icon: 'Terminal',
    badge: 'Python · R · Docker'
  },
  {
    id: 'maps',
    title: 'Interactive maps',
    description: 'Web dashboards that visualise coastal risk, fisheries effort, and climate indicators in real time.',
    icon: 'Map',
    badge: 'StoryMaps · Deck.GL'
  },
  {
    id: 'media',
    title: 'Media kits',
    description: 'Briefing packs, infographics, and outreach assets ready for stakeholder distribution.',
    icon: 'Camera',
    badge: 'Infographics · Video'
  },
  {
    id: 'publications',
    title: 'Linked publications',
    description: 'Access the articles and policy briefs that contextualise every digital asset.',
    icon: 'FileText',
    badge: 'Open access'
  },
  {
    id: 'apis',
    title: 'Developer APIs',
    description: 'Stream ocean intelligence straight into your applications with low-latency endpoints.',
    icon: 'Server',
    badge: 'REST · CSV · Webhooks'
  }
];

const FEATURED_FALLBACK = {
  heading: 'Featured releases',
  subheading: 'Handpicked resources updated in the last 90 days.',
  items: [
    {
      id: 'io-temp-atlas',
      title: 'Indian Ocean temperature anomaly atlas',
      type: 'datasets',
      excerpt: 'Gridded sea-surface and subsurface temperature anomalies (0–700 m) at 0.1° resolution from 2000–2024.',
      updated: 'June 2024',
      format: 'NetCDF',
      size: '1.2 GB',
      tags: ['temperature', 'climate', 'ocean-observing'],
      action: 'Download dataset',
      link: '#'
    },
    {
      id: 'coastal-risk-dashboard',
      title: 'Sri Lanka coastal resilience dashboard',
      type: 'maps',
      excerpt: 'Interactive coastal flood, erosion, and community exposure viewer with scenario modelling.',
      updated: 'May 2024',
      format: 'Web dashboard',
      size: 'Live',
      tags: ['risk', 'coast', 'visualisation'],
      action: 'Launch dashboard',
      link: '#'
    },
    {
      id: 'fisheries-insight-suite',
      title: 'Fisheries insight modelling suite',
      type: 'tools',
      excerpt: 'Jupyter workflows for catch forecasting, vessel effort dynamics, and quota simulations.',
      updated: 'April 2024',
      format: 'Notebook bundle',
      size: '240 MB',
      tags: ['fisheries', 'forecasting', 'python'],
      action: 'Download toolkit',
      link: '#'
    },
    {
      id: 'blue-carbon-brief',
      title: 'Blue carbon valuation media kit',
      type: 'media',
      excerpt: "Press-ready fact sheets, infographics, and quote bank covering Sri Lanka's blue carbon assets.",
      updated: 'June 2024',
      format: 'PDF & PNG',
      size: '35 MB',
      tags: ['communications', 'policy', 'blue-carbon'],
      action: 'Download media kit',
      link: '#'
    }
  ]
};

const COLLECTIONS_FALLBACK = {
  heading: 'Curated collections',
  description: 'Each collection combines datasets, narratives, and decision tools for a specific mission.',
  items: [
    {
      id: 'monsoon-outlook',
      title: 'Monsoon outlook intelligence pack',
      summary: 'Seasonal climate drivers, rainfall anomalies, and advisories for coastal communities.',
      contents: '8 datasets · 3 dashboards · 4 briefs',
      icon: 'CloudRain',
      accent: 'from-cyan-500/20 to-blue-500/10',
      stat: 'Updated fortnightly'
    },
    {
      id: 'fisheries-sustainability',
      title: 'Sustainable fisheries operations',
      summary: 'Fuel optimisation, catch per unit effort, and compliance monitoring resources.',
      contents: '5 datasets · 2 notebooks · 6 KPIs',
      icon: 'Fish',
      accent: 'from-emerald-500/20 to-teal-500/10',
      stat: 'Trusted by 18 agencies'
    },
    {
      id: 'marine-plastics',
      title: 'Marine plastics watch',
      summary: 'Microplastic transects, shoreline audits, and mitigation success stories.',
      contents: '6 datasets · 4 maps · 5 media assets',
      icon: 'Recycle',
      accent: 'from-rose-500/20 to-orange-500/10',
      stat: 'New insights monthly'
    }
  ]
};

const APIS_FALLBACK = {
  heading: 'Developer access',
  description: 'Automate analysis pipelines with secure, rate-limited APIs backed by the library.',
  items: [
    {
      id: 'catalog-api',
      title: 'Product catalogue API',
      description: 'Query metadata, licensing, and provenance for every published asset.',
      icon: 'ListTree',
      link: '#',
      linkLabel: 'View API schema'
    },
    {
      id: 'stream-api',
      title: 'Real-time telemetry stream',
      description: 'Subscribe to buoy, tide gauge, and satellite event feeds via webhooks.',
      icon: 'Radio',
      link: '#',
      linkLabel: 'Request access'
    },
    {
      id: 'tile-service',
      title: 'Map tile service',
      description: 'Embed high-resolution ocean layers directly inside GIS and web maps.',
      icon: 'Layers',
      link: '#',
      linkLabel: 'Get tile URL'
    }
  ]
};

const SEARCH_FALLBACK = {
  tagline: 'Search across datasets, tools, visualisations, and media packages.',
  placeholder: 'Search datasets, tools, publications...',
  filters: [
    { id: 'all', label: 'All resources' },
    { id: 'datasets', label: 'Datasets' },
    { id: 'tools', label: 'Toolkits' },
    { id: 'maps', label: 'Maps & dashboards' },
    { id: 'media', label: 'Media & briefs' }
  ]
};

const DigitalProductLibrary = () => {
  const { t } = useTranslation('digitalLibrary');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const heroCopy = useMemo(() => {
    const translated = t('hero', { returnObjects: true, defaultValue: {} });
    return {
      badge: translated?.badge || 'Digital assets suite',
      title: translated?.title || 'Digital Product Library',
      description:
        translated?.description ||
        'Discover curated ocean intelligence ready for research, policy, and innovation.'
    };
  }, [t]);

  const metrics = useMemo(() => {
    const translated = t('metrics', { returnObjects: true, defaultValue: METRICS_FALLBACK });
    const list = Array.isArray(translated) && translated.length ? translated : METRICS_FALLBACK;
    return list.map((metric) => {
      const fallback = METRICS_FALLBACK.find((item) => item.id === metric.id) || METRICS_FALLBACK[0];
      const iconName = metric.icon || fallback.icon;
      return {
        ...fallback,
        ...metric,
        icon: resolveIcon(iconName, fallback.icon)
      };
    });
  }, [t]);

  const searchCopy = useMemo(() => {
    const translated = t('search', { returnObjects: true, defaultValue: SEARCH_FALLBACK });
    const filters = Array.isArray(translated?.filters) && translated.filters.length
      ? translated.filters
      : SEARCH_FALLBACK.filters;
    return {
      tagline: translated?.tagline || SEARCH_FALLBACK.tagline,
      placeholder: translated?.placeholder || SEARCH_FALLBACK.placeholder,
      filters: filters.map((filter) => ({
        id: filter.id,
        label: filter.label || SEARCH_FALLBACK.filters.find((f) => f.id === filter.id)?.label || filter.id
      }))
    };
  }, [t]);

  const categories = useMemo(() => {
    const translated = t('categories', { returnObjects: true, defaultValue: CATEGORIES_FALLBACK });
    const list = Array.isArray(translated) && translated.length ? translated : CATEGORIES_FALLBACK;
    return list.map((category) => {
      const fallback = CATEGORIES_FALLBACK.find((item) => item.id === category.id) || CATEGORIES_FALLBACK[0];
      const iconName = category.icon || fallback.icon;
      return {
        ...fallback,
        ...category,
        icon: resolveIcon(iconName, fallback.icon)
      };
    });
  }, [t]);

  const featured = useMemo(() => {
    const translated = t('featured', { returnObjects: true, defaultValue: FEATURED_FALLBACK });
    const fallback = FEATURED_FALLBACK;
    const items = Array.isArray(translated?.items) && translated.items.length
      ? translated.items
      : fallback.items;
    return {
      heading: translated?.heading || fallback.heading,
      subheading: translated?.subheading || fallback.subheading,
      items: items.map((item) => {
        const fallbackItem = fallback.items.find((f) => f.id === item.id) || fallback.items[0];
        return {
          ...fallbackItem,
          ...item,
          tags: Array.isArray(item.tags) && item.tags.length ? item.tags : fallbackItem.tags,
          link: item.link || fallbackItem.link,
          type: item.type || fallbackItem.type
        };
      })
    };
  }, [t]);

  const collections = useMemo(() => {
    const translated = t('collections', { returnObjects: true, defaultValue: COLLECTIONS_FALLBACK });
    const fallback = COLLECTIONS_FALLBACK;
    const items = Array.isArray(translated?.items) && translated.items.length
      ? translated.items
      : fallback.items;
    return {
      heading: translated?.heading || fallback.heading,
      description: translated?.description || fallback.description,
      items: items.map((item) => {
        const fallbackItem = fallback.items.find((f) => f.id === item.id) || fallback.items[0];
        return {
          ...fallbackItem,
          ...item,
          icon: resolveIcon(item.icon || fallbackItem.icon, fallbackItem.icon),
          accent: item.accent || fallbackItem.accent
        };
      })
    };
  }, [t]);

  const apis = useMemo(() => {
    const translated = t('apis', { returnObjects: true, defaultValue: APIS_FALLBACK });
    const fallback = APIS_FALLBACK;
    const items = Array.isArray(translated?.items) && translated.items.length ? translated.items : fallback.items;
    return {
      heading: translated?.heading || fallback.heading,
      description: translated?.description || fallback.description,
      items: items.map((item) => {
        const fallbackItem = fallback.items.find((f) => f.id === item.id) || fallback.items[0];
        return {
          ...fallbackItem,
          ...item,
          icon: resolveIcon(item.icon || fallbackItem.icon, fallbackItem.icon),
          link: item.link || fallbackItem.link,
          linkLabel: item.linkLabel || fallbackItem.linkLabel
        };
      })
    };
  }, [t]);

  const cta = useMemo(() => {
    const translated = t('cta', { returnObjects: true, defaultValue: {} });
    return {
      heading: translated?.heading || 'Need a tailored digital package?',
      description:
        translated?.description ||
        'Our data management team can help assemble custom bundles, translations, and delivery pipelines for your project.',
      primary: translated?.primary || 'Request a consultation',
      secondary: translated?.secondary || 'View usage guidelines'
    };
  }, [t]);

  const filteredFeatured = useMemo(() => {
    return featured.items.filter((item) => {
      const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
      const term = searchTerm.trim().toLowerCase();
      if (!term) {
        return matchesFilter;
      }
      const haystack = [item.title, item.excerpt, item.format, item.size, ...(item.tags || [])]
        .join(' ')
        .toLowerCase();
      return matchesFilter && haystack.includes(term);
    });
  }, [featured.items, activeFilter, searchTerm]);

  return (
    <StitchWrapper>
      <div className="min-h-screen relative z-10 w-full text-white">
        <div className="relative overflow-hidden">
          {/* Background Elements removed as StitchWrapper handles them, keeping local accents if needed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-24 left-16 w-72 h-72 bg-cyan-500/10 blur-3xl rounded-full" />
            <div className="absolute -bottom-32 right-10 w-80 h-80 bg-indigo-500/10 blur-3xl rounded-full" />
          </motion.div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-24">
            {/* Hero */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 uppercase tracking-[0.3em] text-xs font-semibold backdrop-blur-sm">
                  <Sparkles className="w-4 h-4" />
                  {heroCopy.badge}
                </div>
                <h1 className="mt-6 text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] text-white">
                  {heroCopy.title}
                </h1>
                <p className="mt-6 text-lg text-slate-300 max-w-xl leading-relaxed">
                  {heroCopy.description}
                </p>
                <div className="mt-10 flex flex-wrap gap-4 text-sm text-slate-200">
                  <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md">
                    <BadgeCheck className="w-4 h-4 inline mr-2 text-emerald-400" />
                    ISO 19115 metadata compliant
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md">
                    <BookOpen className="w-4 h-4 inline mr-2 text-sky-400" />
                    FAIR principles aligned
                  </div>
                </div>
              </div>

              {/* Unique Hero Image Placeholder */}
              <div className="relative group w-full aspect-video rounded-3xl overflow-hidden bg-white/5 border-2 border-dashed border-white/10 hover:border-cyan-400/50 transition-all duration-300 flex flex-col items-center justify-center p-8 text-center cursor-pointer backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50 transition-all duration-300">
                  <Camera className="w-8 h-8 text-white/40 group-hover:text-cyan-400 transition-colors" />
                </div>

                <h3 className="text-lg font-bold text-white/60 group-hover:text-cyan-100 transition-colors mb-2">
                  Featured Product Visual
                </h3>
                <p className="text-sm text-slate-400 max-w-xs mx-auto group-hover:text-cyan-200/70 transition-colors">
                  Display high-impact product imagery or data visualizations.
                </p>

                <div className="mt-6 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider text-slate-500 group-hover:border-cyan-500/30 group-hover:text-cyan-400/80 transition-all">
                  Recommended: 1920 x 1080px
                </div>
              </div>
            </motion.section>

            {/* Key Metrics Bar (Moved from Hero Right) */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.id}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-cyan-400/40 transition-colors hover:bg-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30">
                      <metric.icon className="w-6 h-6 text-cyan-300" />
                    </div>
                    {metric.delta && (
                      <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded-full">{metric.delta}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white mb-1">{metric.value}</p>
                    <p className="text-sm text-slate-400 font-medium">{metric.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Search & filters */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white">{heroCopy.title}</h2>
                  <p className="mt-2 text-slate-300 text-sm lg:text-base">{searchCopy.tagline}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-200">
                    <Filter className="w-4 h-4 text-cyan-300" />
                    FAIR & open licensing ready
                  </div>
                </div>
              </div>

              <div className="mt-8 grid lg:grid-cols-[2fr,1fr] gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-200" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder={searchCopy.placeholder}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  {searchCopy.filters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${activeFilter === filter.id
                        ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-200'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Categories */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-semibold text-white">Browse by collection</h3>
                  <p className="mt-2 text-sm text-slate-300 max-w-2xl">
                    Activate a category to focus the featured feed and discover the tooling, data, and media built for it.
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = activeFilter === category.id || (activeFilter === 'all' && category.id === 'datasets');
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setActiveFilter(category.id)}
                      className={`text-left p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${isActive
                        ? 'bg-cyan-500/15 border-cyan-400/60 shadow-[0_20px_45px_-20px_rgba(14,165,233,0.6)]'
                        : 'bg-white/5 border-white/10 hover:border-cyan-300/40'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${isActive ? 'bg-cyan-500/30' : 'bg-white/10'}`}>
                          <Icon className="w-6 h-6 text-cyan-200" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">{category.title}</h4>
                          <span className="mt-1 inline-flex items-center gap-2 text-xs text-cyan-200 bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded-full">
                            {category.badge}
                          </span>
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-slate-300 leading-relaxed">{category.description}</p>
                    </button>
                  );
                })}
              </div>
            </motion.section>

            {/* Featured resources */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-semibold text-white">{featured.heading}</h3>
                  <p className="mt-2 text-sm text-slate-300">{featured.subheading}</p>
                </div>
                <div className="text-xs text-slate-200">
                  {filteredFeatured.length}/{featured.items.length} resources visible
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {filteredFeatured.map((item, index) => (
                  <motion.article
                    key={item.id}
                    className="p-6 rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-white/10 border border-white/10 hover:border-cyan-400/40 transition-colors"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between text-xs uppercase tracking-wide text-cyan-200">
                      <span>{item.type}</span>
                      <span className="text-slate-200">{item.updated}</span>
                    </div>
                    <h4 className="mt-3 text-xl font-semibold text-white">{item.title}</h4>
                    <p className="mt-3 text-sm text-slate-300 leading-relaxed">{item.excerpt}</p>
                    <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-300">
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">{item.format}</span>
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">{item.size}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-cyan-200">
                      {item.tags?.map((tag) => (
                        <span key={tag} className="px-2 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <a
                      href={item.link || '#'}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white transition-colors"
                    >
                      {item.action}
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </motion.article>
                ))}
              </div>
            </motion.section>

            {/* Collections */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-semibold text-white">{collections.heading}</h3>
                  <p className="mt-2 text-sm text-slate-300 max-w-2xl">{collections.description}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {collections.items.map((item, index) => {
                  const Icon = item.icon || Sparkles;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className={`p-6 rounded-2xl border border-white/10 bg-gradient-to-br ${item.accent || 'from-white/10 to-white/5'}`}
                    >
                      <div className="flex items-center gap-3 text-cyan-100">
                        <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs uppercase tracking-widest">
                          {item.stat}
                        </span>
                      </div>
                      <h4 className="mt-4 text-xl font-semibold text-white">{item.title}</h4>
                      <p className="mt-3 text-sm text-slate-200 leading-relaxed">{item.summary}</p>
                      <p className="mt-4 text-xs text-cyan-100 font-medium">{item.contents}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>

            {/* APIs */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid lg:grid-cols-[2fr,3fr] gap-10 items-start"
            >
              <div>
                <h3 className="text-3xl font-semibold text-white">{apis.heading}</h3>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed">{apis.description}</p>
                <p className="mt-6 text-xs text-slate-200 uppercase tracking-[0.2em]">Included with enterprise data subscriptions</p>
              </div>
              <div className="space-y-4">
                {apis.items.map((item) => {
                  const Icon = item.icon || Server;
                  return (
                    <div
                      key={item.id}
                      className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-cyan-500/15 border border-cyan-400/30">
                          <Icon className="w-5 h-5 text-cyan-200" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                          <p className="text-sm text-slate-300 mt-1 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                      <a
                        href={item.link || '#'}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white transition-colors"
                      >
                        {item.linkLabel || 'Learn more'}
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </motion.section>

            {/* CTA */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <div className="relative overflow-hidden p-8 sm:p-12 rounded-3xl border border-cyan-400/40 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-indigo-500/20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.35),_transparent_55%)]" />
                <div className="relative z-10 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs uppercase tracking-[0.25em] text-cyan-100">
                    <Sparkles className="w-4 h-4" />
                    Concierge support
                  </div>
                  <h3 className="mt-6 text-3xl sm:text-4xl font-semibold text-white">{cta.heading}</h3>
                  <p className="mt-4 text-sm text-cyan-100 leading-relaxed">{cta.description}</p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <button className="px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors">
                      {cta.primary}
                    </button>
                    <button className="px-6 py-3 rounded-xl border border-white/60 text-white font-semibold hover:bg-white/10 transition-colors">
                      {cta.secondary}
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </StitchWrapper >
  );
};

export default DigitalProductLibrary;
