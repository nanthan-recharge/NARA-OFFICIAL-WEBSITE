import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '../../components/shared/SEOHead';

const PRODUCT_CATEGORIES = [
  { id: 'all', icon: Icons.Store },
  { id: 'datasets', icon: Icons.Database },
  { id: 'reports', icon: Icons.FileText },
  { id: 'software', icon: Icons.Code },
  { id: 'courses', icon: Icons.GraduationCap },
  { id: 'subscriptions', icon: Icons.Cloud }
];

const MARKETPLACE_PRODUCTS = [
  { id: 'bathymetry-dataset', category: 'datasets', price: 45000, image: '🗺️' },
  { id: 'ocean-temp-data', category: 'datasets', price: 35000, image: '🌡️' },
  { id: 'marine-biodiversity-report', category: 'reports', price: 5000, image: '📄' },
  { id: 'fisheries-statistics', category: 'reports', price: 8000, image: '📊' },
  { id: 'gis-marine-mapping', category: 'software', price: 75000, image: '🖥️' },
  { id: 'fish-id-app', category: 'software', price: 2500, image: '📱' },
  { id: 'oceanography-course', category: 'courses', price: 25000, image: '🎓' },
  { id: 'marine-gis-course', category: 'courses', price: 40000, image: '🗺️' },
  { id: 'ocean-data-api', category: 'subscriptions', price: 15000, image: '🔌' },
  { id: 'satellite-imagery-sub', category: 'subscriptions', price: 30000, image: '🛰️' },
  { id: 'marine-weather-api', category: 'subscriptions', price: 12000, image: '🌊' },
  { id: 'research-database-access', category: 'subscriptions', price: 20000, image: '📚' }
];

const optionalTranslation = (t, key) => {
  const translated = t(key);
  return translated === key ? undefined : translated;
};

export default function NARADigitalMarketplace() {
  const { t } = useTranslation('digitalMarketplacePage');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const categories = useMemo(
    () =>
      PRODUCT_CATEGORIES.map((category) => ({
        ...category,
        name: t(`categories.${category.id}`)
      })),
    [t]
  );

  const products = useMemo(
    () =>
      MARKETPLACE_PRODUCTS.map((product) => {
        const baseKey = `products.${product.id}`;
        return {
          ...product,
          name: t(`${baseKey}.name`),
          description: t(`${baseKey}.description`),
          unit: t(`${baseKey}.unit`),
          stock: t(`${baseKey}.stock`),
          certification: optionalTranslation(t, `${baseKey}.certification`),
          badge: optionalTranslation(t, `${baseKey}.badge`)
        };
      }),
    [t]
  );

  const filteredProducts =
    selectedCategory === 'all' ? products : products.filter((product) => product.category === selectedCategory);

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setShowCart(true);
    setTimeout(() => setShowCart(false), 3000);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 selection:bg-cyan-200">
      <SEOHead
        title={t('meta.title')}
        description={t('meta.description')}
        path="/nara-digital-marketplace"
        keywords={t('meta.keywords')}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500 py-20 text-white">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 h-96 w-96 animate-pulse rounded-full bg-white/20 blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 animate-pulse rounded-full bg-cyan-300/20 blur-[100px] delay-1000" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="mb-6 flex items-center justify-center gap-4">
              <div className="rounded-2xl border border-white/30 bg-white/20 p-4 shadow-lg backdrop-blur-md">
                <img
                  src="/nara 3d logo .jpeg"
                  alt={t('meta.title')}
                  className="h-24 w-auto rounded-xl object-contain drop-shadow-lg"
                />
              </div>
            </div>
            <h1 className="mb-6 text-center text-4xl font-bold tracking-tight drop-shadow-md md:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-center text-xl leading-relaxed text-blue-50 drop-shadow">
              {t('hero.subtitle')}
              <br />
              <span className="font-semibold text-cyan-100">{t('hero.highlight')}</span>
            </p>

            <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
              <div className="group rounded-xl border border-white/20 bg-white/10 p-6 text-center shadow-lg transition-all hover:-translate-y-1 hover:bg-white/20 hover:shadow-xl backdrop-blur-md">
                <Icons.Package className="mx-auto mb-3 h-6 w-6 text-white transition-transform group-hover:scale-110" />
                <div className="text-2xl font-bold text-white">{products.length}</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wider text-blue-100">
                  {t('hero.stats.products')}
                </div>
              </div>
              <div className="group rounded-xl border border-white/20 bg-white/10 p-6 text-center shadow-lg transition-all hover:-translate-y-1 hover:bg-white/20 hover:shadow-xl backdrop-blur-md">
                <Icons.CheckCircle className="mx-auto mb-3 h-6 w-6 text-emerald-200 transition-transform group-hover:scale-110" />
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wider text-blue-100">
                  {t('hero.stats.verified')}
                </div>
              </div>
              <div className="group rounded-xl border border-white/20 bg-white/10 p-6 text-center shadow-lg transition-all hover:-translate-y-1 hover:bg-white/20 hover:shadow-xl backdrop-blur-md">
                <Icons.Monitor className="mx-auto mb-3 h-6 w-6 text-purple-200 transition-transform group-hover:scale-110" />
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wider text-blue-100">
                  {t('hero.stats.access')}
                </div>
              </div>
              <div className="group rounded-xl border border-white/20 bg-white/10 p-6 text-center shadow-lg transition-all hover:-translate-y-1 hover:bg-white/20 hover:shadow-xl backdrop-blur-md">
                <Icons.Shield className="mx-auto mb-3 h-6 w-6 text-amber-200 transition-transform group-hover:scale-110" />
                <div className="text-2xl font-bold text-white">{t('hero.stats.secureValue')}</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wider text-blue-100">
                  {t('hero.stats.payment')}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="sticky top-[73px] z-30 border-y border-slate-200 bg-white/90 shadow-md backdrop-blur-xl">
        <div className="scrollbar-hide mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 py-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'scale-105 bg-blue-600 text-white shadow-lg shadow-blue-500/30'
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
          className="fixed top-24 right-6 z-50 flex items-center gap-3 rounded-xl border border-emerald-400/30 bg-emerald-600 p-4 text-white shadow-2xl backdrop-blur-md"
        >
          <Icons.CheckCircle className="h-5 w-5" />
          <span className="text-sm font-bold">{t('notifications.addedToCart')}</span>
        </motion.div>
      )}

      <Link
        to="/checkout"
        className="group fixed right-8 bottom-8 z-50 flex items-center gap-3 rounded-full bg-blue-600 px-6 py-4 text-white shadow-[0_4px_20px_rgba(37,99,235,0.4)] transition-all duration-300 active:scale-95 hover:bg-blue-700 hover:shadow-[0_6px_25px_rgba(37,99,235,0.5)]"
      >
        <Icons.ShoppingCart className="h-5 w-5" />
        <span className="font-bold tracking-wide">{t('cart.button', { count: cartCount })}</span>
        {cartTotal > 0 && (
          <span className="ml-1 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-blue-600">
            LKR {cartTotal.toLocaleString()}
          </span>
        )}
      </Link>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl font-bold text-slate-900">
            {categories.find((category) => category.id === selectedCategory)?.name || t('categories.all')}
            <span className="ml-3 text-lg font-medium text-slate-500">
              {t('results.showing', { count: filteredProducts.length })}
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
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              {product.badge && (
                <div className="absolute top-4 right-4 z-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-1 text-xs font-bold tracking-wide text-white uppercase shadow-md">
                  {product.badge}
                </div>
              )}

              <div className="mb-6 flex h-48 w-full items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 text-7xl shadow-inner transition-colors group-hover:from-blue-100 group-hover:to-cyan-100">
                <div className="transform drop-shadow-md transition-transform duration-500 group-hover:scale-110">
                  {product.image}
                </div>
              </div>

              <div className="flex-1">
                <div className="mb-3 flex items-center justify-between">
                  <div className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold tracking-wider text-slate-600 uppercase">
                    {categories.find((category) => category.id === product.category)?.name}
                  </div>
                </div>

                <h3 className="mb-2 line-clamp-1 text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                  {product.name}
                </h3>
                <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-500">
                  {product.description}
                </p>

                {product.certification && (
                  <div className="mb-5 flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 p-2.5 text-xs font-medium text-emerald-700">
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
                      <span className="mr-1 text-sm font-medium text-slate-400">LKR</span>
                      {product.price.toLocaleString()}
                    </div>
                    <div className="text-[10px] font-semibold text-slate-500 uppercase">{product.unit}</div>
                  </div>
                </div>
              </div>

              <div className="mt-auto grid grid-cols-2 gap-3">
                <button
                  onClick={() => addToCart(product)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
                >
                  <Icons.ShoppingCart className="h-4 w-4" />
                  {t('productActions.add')}
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-95">
                  <Icons.Info className="h-4 w-4" />
                  {t('productActions.details')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden border-t border-slate-200 bg-white py-20">
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-900">{t('features.title')}</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-3xl border border-blue-100 bg-blue-50/50 p-8 text-center transition-colors hover:border-blue-200 hover:bg-blue-50">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 shadow-sm">
                <Icons.Award className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">{t('features.quality.title')}</h3>
              <p className="leading-relaxed text-slate-600">{t('features.quality.description')}</p>
            </div>
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-8 text-center transition-colors hover:border-emerald-200 hover:bg-emerald-50">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm">
                <Icons.Leaf className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">{t('features.sustainable.title')}</h3>
              <p className="leading-relaxed text-slate-600">{t('features.sustainable.description')}</p>
            </div>
            <div className="rounded-3xl border border-purple-100 bg-purple-50/50 p-8 text-center transition-colors hover:border-purple-200 hover:bg-purple-50">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 shadow-sm">
                <Icons.HeadphonesIcon className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">{t('features.support.title')}</h3>
              <p className="leading-relaxed text-slate-600">{t('features.support.description')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
