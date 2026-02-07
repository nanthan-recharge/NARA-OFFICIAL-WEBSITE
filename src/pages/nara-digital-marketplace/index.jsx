import { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/shared/SEOHead';

const PRODUCT_CATEGORIES = [
  { id: 'all', name: 'All Products', icon: Icons.Store },
  { id: 'datasets', name: 'Digital Datasets', icon: Icons.Database },
  { id: 'reports', name: 'Research Reports', icon: Icons.FileText },
  { id: 'software', name: 'Software & Tools', icon: Icons.Code },
  { id: 'courses', name: 'Online Courses', icon: Icons.GraduationCap },
  { id: 'subscriptions', name: 'API & Subscriptions', icon: Icons.Cloud }
];

const MARKETPLACE_PRODUCTS = [
  {
    id: 'bathymetry-dataset',
    category: 'datasets',
    name: 'Sri Lanka EEZ Bathymetry Dataset',
    description: 'High-resolution bathymetric data for Sri Lankan waters, GeoTIFF format, 10m resolution',
    price: 45000,
    unit: 'one-time purchase',
    image: '🗺️',
    stock: 'Instant Download',
    certification: 'ISO 19115 Metadata Standard',
    badge: 'Best Seller'
  },
  {
    id: 'ocean-temp-data',
    category: 'datasets',
    name: 'Historical Ocean Temperature Data',
    description: '20-year SST dataset (2005-2025), CSV/NetCDF formats, daily measurements',
    price: 35000,
    unit: 'one-time purchase',
    image: '🌡️',
    stock: 'Instant Download',
    certification: 'Quality Controlled Data'
  },
  {
    id: 'marine-biodiversity-report',
    category: 'reports',
    name: 'Sri Lankan Marine Biodiversity Report 2025',
    description: 'Comprehensive 200-page PDF report on marine species, habitats, and conservation status',
    price: 5000,
    unit: 'digital PDF',
    image: '📄',
    stock: 'Instant Download',
    badge: 'New'
  },
  {
    id: 'fisheries-statistics',
    category: 'reports',
    name: 'Annual Fisheries Statistical Yearbook',
    description: 'Complete fisheries data: catch statistics, vessel registrations, export data (PDF + Excel)',
    price: 8000,
    unit: 'digital download',
    image: '📊',
    stock: 'Instant Download',
    certification: 'Government Approved'
  },
  {
    id: 'gis-marine-mapping',
    category: 'software',
    name: 'NARA Marine GIS Toolkit',
    description: 'Desktop GIS software for marine spatial planning, includes 50+ map layers',
    price: 75000,
    unit: 'annual license',
    image: '🖥️',
    stock: 'Available',
    certification: 'Windows & Mac Compatible',
    badge: 'Premium'
  },
  {
    id: 'fish-id-app',
    category: 'software',
    name: 'Fish Species Identification App',
    description: 'Mobile app with AI-powered fish identification, 500+ Sri Lankan species database',
    price: 2500,
    unit: 'lifetime license',
    image: '📱',
    stock: 'Instant Download',
    badge: 'Popular'
  },
  {
    id: 'oceanography-course',
    category: 'courses',
    name: 'Introduction to Oceanography (Online)',
    description: '12-week self-paced course, video lectures, quizzes, certificate upon completion',
    price: 25000,
    unit: 'per enrollment',
    image: '🎓',
    stock: 'Enrollments Open',
    certification: 'NARA Certificate Included'
  },
  {
    id: 'marine-gis-course',
    category: 'courses',
    name: 'Marine GIS & Spatial Analysis Course',
    description: '8-week hands-on course, live webinars, project-based learning',
    price: 40000,
    unit: 'per enrollment',
    image: '🗺️',
    stock: 'Next Batch: Jan 2026',
    certification: 'Certificate Provided'
  },
  {
    id: 'ocean-data-api',
    category: 'subscriptions',
    name: 'Real-Time Ocean Data API Access',
    description: 'RESTful API for SST, salinity, currents, wave height - 10,000 requests/month',
    price: 15000,
    unit: 'per month',
    image: '🔌',
    stock: 'Available',
    badge: 'New'
  },
  {
    id: 'satellite-imagery-sub',
    category: 'subscriptions',
    name: 'Satellite Imagery Subscription',
    description: 'Weekly updated satellite images: ocean color, chlorophyll-a, sea surface height',
    price: 30000,
    unit: 'per month',
    image: '🛰️',
    stock: 'Available',
    certification: 'Sentinel-3 & MODIS Data'
  },
  {
    id: 'marine-weather-api',
    category: 'subscriptions',
    name: 'Marine Weather Forecast API',
    description: '7-day marine forecasts, wave predictions, wind data - 5,000 API calls/month',
    price: 12000,
    unit: 'per month',
    image: '🌊',
    stock: 'Available'
  },
  {
    id: 'research-database-access',
    category: 'subscriptions',
    name: 'NARA Research Database Premium Access',
    description: 'Unlimited access to 10,000+ research papers, datasets, and technical reports',
    price: 20000,
    unit: 'per year',
    image: '📚',
    stock: 'Available',
    badge: 'Premium'
  }
];

export default function NARADigitalMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const filteredProducts = selectedCategory === 'all'
    ? MARKETPLACE_PRODUCTS
    : MARKETPLACE_PRODUCTS.filter(p => p.category === selectedCategory);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setShowCart(true);
    setTimeout(() => setShowCart(false), 3000);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 selection:bg-cyan-200">
      <SEOHead
        title="NARA Digital Marketplace"
        description="Purchase NARA publications, maps, laboratory services, and research products online."
        path="/nara-digital-marketplace"
        keywords="marketplace, publications, lab services, NARA products"
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500 py-20 text-white">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-300/20 rounded-full blur-[100px] animate-pulse delay-1000" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md shadow-lg">
                <img
                  src="/nara 3d logo .jpeg"
                  alt="NARA Digital Marketplace"
                  className="h-24 w-auto object-contain drop-shadow-lg rounded-xl"
                />
              </div>
            </div>
            <h1 className="mb-6 text-center text-4xl font-bold md:text-6xl tracking-tight drop-shadow-md">
              NARA Digital Marketplace
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-center text-xl text-blue-50 leading-relaxed drop-shadow">
              Research data, software tools, online courses & digital resources.
              <br />
              <span className="text-cyan-100 font-semibold">Empowering marine research through digital innovation.</span>
            </p>

            <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
              <div className="group rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md text-center hover:bg-white/20 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                <Icons.Package className="h-6 w-6 mb-3 mx-auto text-white group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-bold text-white">{MARKETPLACE_PRODUCTS.length}</div>
                <div className="text-xs font-medium text-blue-100 uppercase tracking-wider mt-1">Products</div>
              </div>
              <div className="group rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md text-center hover:bg-white/20 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                <Icons.CheckCircle className="h-6 w-6 mb-3 mx-auto text-emerald-200 group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-xs font-medium text-blue-100 uppercase tracking-wider mt-1">Verified</div>
              </div>
              <div className="group rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md text-center hover:bg-white/20 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                <Icons.Monitor className="h-6 w-6 mb-3 mx-auto text-purple-200 group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-xs font-medium text-blue-100 uppercase tracking-wider mt-1">Access</div>
              </div>
              <div className="group rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md text-center hover:bg-white/20 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                <Icons.Shield className="h-6 w-6 mb-3 mx-auto text-amber-200 group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-bold text-white">Secure</div>
                <div className="text-xs font-medium text-blue-100 uppercase tracking-wider mt-1">Payment</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-[73px] z-30 border-y border-slate-200 bg-white/90 shadow-md backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 py-4 scrollbar-hide">
          {PRODUCT_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 ${selectedCategory === category.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
            >
              <category.icon className="h-4 w-4" />
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {showCart && cartCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 20 }}
          className="fixed top-24 right-6 z-50 rounded-xl bg-emerald-600 p-4 text-white shadow-2xl backdrop-blur-md flex items-center gap-3 border border-emerald-400/30"
        >
          <Icons.CheckCircle className="h-5 w-5" />
          <span className="font-bold text-sm">Added to cart successfully</span>
        </motion.div>
      )}

      {/* Floating Cart Button */}
      <Link
        to="/checkout"
        className="fixed bottom-8 right-8 z-50 group flex items-center gap-3 rounded-full bg-blue-600 px-6 py-4 text-white shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:shadow-[0_6px_25px_rgba(37,99,235,0.5)] transition-all duration-300 active:scale-95"
      >
        <Icons.ShoppingCart className="h-5 w-5" />
        <span className="font-bold tracking-wide">Cart ({cartCount})</span>
        {cartTotal > 0 && (
          <span className="ml-1 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-blue-600">
            LKR {cartTotal.toLocaleString()}
          </span>
        )}
      </Link>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            {PRODUCT_CATEGORIES.find(c => c.id === selectedCategory)?.name || 'All Products'}
            <span className="ml-3 text-lg font-medium text-slate-500">
              Showing {filteredProducts.length} results
            </span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -8 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
            >
              {product.badge && (
                <div className="absolute top-4 right-4 z-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-1 text-xs font-bold text-white uppercase tracking-wide shadow-md">
                  {product.badge}
                </div>
              )}

              <div className="mb-6 flex h-48 w-full items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 text-7xl shadow-inner group-hover:from-blue-100 group-hover:to-cyan-100 transition-colors">
                <div className="transform transition-transform duration-500 group-hover:scale-110 drop-shadow-md">
                  {product.image}
                </div>
              </div>

              <div className="flex-1">
                <div className="mb-3 flex items-center justify-between">
                  <div className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    {PRODUCT_CATEGORIES.find(c => c.id === product.category)?.name}
                  </div>
                </div>

                <h3 className="mb-2 text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="mb-4 text-sm text-slate-500 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                {product.certification && (
                  <div className="mb-5 flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg p-2.5 border border-emerald-100">
                    <Icons.BadgeCheck className="h-4 w-4 text-emerald-600" />
                    <span>{product.certification}</span>
                  </div>
                )}

                <div className="mb-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Icons.PackageCheck className="h-4 w-4 text-blue-500" />
                    <span>{product.stock}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-800">
                      <span className="text-sm font-medium text-slate-400 mr-1">LKR</span>
                      {product.price.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">{product.unit}</div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 grid-cols-2 mt-auto">
                <button
                  onClick={() => addToCart(product)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  <Icons.ShoppingCart className="h-4 w-4" />
                  Add
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm active:scale-95">
                  <Icons.Info className="h-4 w-4" />
                  Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feature Section */}
      <div className="border-t border-slate-200 bg-white py-20 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-900">Why Choose NARA Marketplace?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center p-8 rounded-3xl bg-blue-50/50 border border-blue-100 hover:border-blue-200 hover:bg-blue-50 transition-colors">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm">
                <Icons.Award className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">Quality Guaranteed</h3>
              <p className="text-slate-600 leading-relaxed">All products certified and approved by NARA experts</p>
            </div>
            <div className="text-center p-8 rounded-3xl bg-emerald-50/50 border border-emerald-100 hover:border-emerald-200 hover:bg-emerald-50 transition-colors">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm">
                <Icons.Leaf className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">Sustainable</h3>
              <p className="text-slate-600 leading-relaxed">Environmentally responsible data sourcing</p>
            </div>
            <div className="text-center p-8 rounded-3xl bg-purple-50/50 border border-purple-100 hover:border-purple-200 hover:bg-purple-50 transition-colors">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 shadow-sm">
                <Icons.HeadphonesIcon className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">Expert Support</h3>
              <p className="text-slate-600 leading-relaxed">Direct access to specialists</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
