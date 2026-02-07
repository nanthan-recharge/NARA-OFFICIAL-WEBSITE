import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

const DigitalMarketplaceRedesign = () => {
  const { t, i18n } = useTranslation(['marketplace', 'common']);
  const currentLang = i18n.language || 'en';
  const navigate = useNavigate();
  const { cartItems, addToCart: addItemToCart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Digital products data
  const products = [
    {
      id: 1,
      title: "Sri Lankan Ocean Temperature Dataset 2020-2024",
      category: "Dataset",
      price: 0,
      originalPrice: 0,
      rating: 4.9,
      reviews: 234,
      downloads: 5847,
      size: "2.3 GB",
      format: "CSV, JSON, NetCDF",
      thumbnail: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400",
      tags: ["Ocean Data", "Temperature", "Climate"],
      featured: true,
      description: "Comprehensive ocean temperature measurements from 127 monitoring stations"
    },
    {
      id: 2,
      title: "Marine Biodiversity Research Report 2024",
      category: "Publication",
      price: 14900,
      originalPrice: 26900,
      rating: 4.8,
      reviews: 156,
      downloads: 3256,
      size: "145 MB",
      format: "PDF",
      thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
      tags: ["Biodiversity", "Research", "2024"],
      featured: true,
      description: "Complete analysis of marine species in Sri Lankan waters"
    },
    {
      id: 3,
      title: "Ocean Current Prediction Software v2.0",
      category: "Software",
      price: 59700,
      originalPrice: 89700,
      rating: 4.7,
      reviews: 89,
      downloads: 1247,
      size: "512 MB",
      format: "Windows, Mac, Linux",
      thumbnail: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400",
      tags: ["Software", "AI", "Prediction"],
      featured: false,
      description: "AI-powered ocean current prediction with 94% accuracy"
    },
    {
      id: 4,
      title: "Coral Reef Mapping Toolkit",
      category: "Software",
      price: 44900,
      originalPrice: 74700,
      rating: 4.9,
      reviews: 67,
      downloads: 892,
      size: "320 MB",
      format: "Desktop App",
      thumbnail: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400",
      tags: ["Mapping", "Conservation", "GIS"],
      featured: false,
      description: "Professional toolkit for coral reef mapping and analysis"
    },
    {
      id: 5,
      title: "Fishing Zone Analytics Dashboard",
      category: "Service",
      price: 8900,
      originalPrice: 14900,
      rating: 4.6,
      reviews: 312,
      downloads: 4521,
      size: "Online",
      format: "Web Access",
      thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
      tags: ["Analytics", "Fishing", "Real-time"],
      featured: true,
      description: "Real-time fishing zone analysis and recommendations"
    },
    {
      id: 6,
      title: "Marine Species Identification Guide",
      category: "Publication",
      price: 0,
      originalPrice: 0,
      rating: 4.8,
      reviews: 456,
      downloads: 8934,
      size: "89 MB",
      format: "PDF, ePub",
      thumbnail: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400",
      tags: ["Species", "Guide", "Education"],
      featured: false,
      description: "Comprehensive guide to identify 500+ marine species"
    }
  ];

  const categories = [
    { id: 'all', name: t('marketplace:filters.allCategories'), icon: Icons.Grid3x3 },
    { id: 'dataset', name: t('marketplace:categories.items.datasets.name'), icon: Icons.Database },
    { id: 'software', name: t('marketplace:categories.items.tools.name'), icon: Icons.Monitor },
    { id: 'publication', name: t('marketplace:categories.items.reports.name'), icon: Icons.BookOpen },
    { id: 'service', name: t('marketplace:categories.items.consulting.name'), icon: Icons.Cloud }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category.toLowerCase() === activeCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product) => {
    addItemToCart(product);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-blue-900/30 to-black"></div>
          
          {/* Animated Grid */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'linear-gradient(purple 1px, transparent 1px), linear-gradient(90deg, purple 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            opacity: 0.1
          }}>
            <motion.div
              animate={{ y: [0, -50] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="w-full h-[200%]"
              style={{ 
                backgroundImage: 'linear-gradient(purple 1px, transparent 1px), linear-gradient(90deg, purple 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }}
            />
          </div>
          
          {/* Floating Elements */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            >
              <Icons.ShoppingBag className="w-6 h-6 text-purple-400/30" />
            </motion.div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-1 rounded-2xl">
                <div className="bg-black/80 backdrop-blur-xl px-6 py-3 rounded-2xl">
                  <span className="text-purple-400 font-space text-sm tracking-widest uppercase">
                    {t('marketplace:hero.badge')}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold font-space mb-4"
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
              {t('marketplace:hero.title')} {t('marketplace:hero.titleHighlight')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
          >
            {t('marketplace:hero.subtitle')}
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { value: t('marketplace:hero.stats.products.value'), label: t('marketplace:hero.stats.products.label'), icon: Icons.Package },
              { value: t('marketplace:hero.stats.customers.value'), label: t('marketplace:hero.stats.customers.label'), icon: Icons.Download },
              { value: t('marketplace:hero.stats.revenue.value'), label: t('marketplace:hero.stats.revenue.label'), icon: Icons.Users },
              { value: t('marketplace:hero.stats.rating.value'), label: t('marketplace:hero.stats.rating.label'), icon: Icons.Star }
            ].map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                <stat.icon className="w-6 h-6 text-purple-400 mb-2 mx-auto" />
                <div className="text-3xl font-bold text-white font-space">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={t('marketplace:filters.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-12 py-3 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
              />
              <Icons.Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Featured Products */}
          {filteredProducts.filter(p => p.featured).length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
                <Icons.Sparkles className="w-8 h-8 text-yellow-400" />
                Featured Products
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {filteredProducts.filter(p => p.featured).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="group"
                  >
                    <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl rounded-2xl overflow-hidden border border-purple-500/30 hover:border-purple-500 transition-all duration-300">
                      {/* Thumbnail */}
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={product.thumbnail} 
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        {product.price === 0 && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 bg-green-500 rounded-full text-xs font-bold text-white">
                              FREE
                            </span>
                          </div>
                        )}
                        {product.originalPrice > product.price && product.price > 0 && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 bg-red-500 rounded-full text-xs font-bold text-white">
                              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-medium">
                            {product.category}
                          </span>
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                            {product.format}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                          {product.title}
                        </h3>

                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1">
                            <Icons.Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-white font-semibold">{product.rating}</span>
                            <span className="text-gray-400 text-sm">({product.reviews})</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-400 text-sm">
                            <Icons.Download className="w-4 h-4" />
                            {product.downloads.toLocaleString()}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div>
                            {product.price === 0 ? (
                              <span className="text-2xl font-bold text-green-400">Free</span>
                            ) : (
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-white">LKR {product.price.toLocaleString()}</span>
                                {product.originalPrice > product.price && (
                                  <span className="text-sm text-gray-400 line-through">LKR {product.originalPrice.toLocaleString()}</span>
                                )}
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-gray-400">{product.size}</span>
                        </div>

                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
                        >
                          {product.price === 0 ? 'Download Free' : t('marketplace:product.addToCart')}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* All Products */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">All Products</h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.filter(p => !p.featured).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 hover:border-purple-500 transition-all"
                >
                  <div className="aspect-video rounded-lg overflow-hidden mb-4">
                    <img 
                      src={product.thumbnail} 
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs text-purple-400">{product.category}</span>
                  <h4 className="font-semibold text-white mb-2 line-clamp-2">{product.title}</h4>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-white">
                      {product.price === 0 ? 'Free' : `LKR ${product.price.toLocaleString()}`}
                    </span>
                    <div className="flex items-center gap-1">
                      <Icons.Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm text-gray-400">{product.rating}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    {product.price === 0 ? 'Download' : t('marketplace:product.addToCart')}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Floating Cart Button */}
      <motion.button
        onClick={() => setShowCartDrawer(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-4 shadow-2xl z-40 hover:shadow-purple-500/50 transition-all"
      >
        <Icons.ShoppingCart className="w-6 h-6 text-white" />
        {getCartCount() > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {getCartCount()}
          </span>
        )}
      </motion.button>

      {/* Cart Drawer */}
      <AnimatePresence>
        {showCartDrawer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCartDrawer(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-gradient-to-br from-gray-900 to-black border-l border-purple-500/30 z-50 flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Icons.ShoppingCart className="w-6 h-6" />
                    {t('marketplace:cart.title')}
                  </h2>
                  <button
                    onClick={() => setShowCartDrawer(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Icons.X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-400 text-sm">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </p>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Icons.ShoppingBag className="w-16 h-16 text-gray-600 mb-4" />
                    <p className="text-gray-400 mb-2">{t('marketplace:cart.empty')}</p>
                    <button
                      onClick={() => setShowCartDrawer(false)}
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      {t('marketplace:cart.continueShopping')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden">
                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">{item.title}</h3>
                            <p className="text-purple-400 text-xs mb-2">{item.category}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-white font-bold">
                                LKR {(item.price * item.quantity).toLocaleString()}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center transition-colors"
                                >
                                  <Icons.Minus className="w-3 h-3 text-white" />
                                </button>
                                <span className="text-white w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center transition-colors"
                                >
                                  <Icons.Plus className="w-3 h-3 text-white" />
                                </button>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Icons.Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-black/50">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-gray-400">
                      <span>{t('marketplace:cart.subtotal')}</span>
                      <span>LKR {getCartTotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>{t('marketplace:cart.tax')} (5%)</span>
                      <span>LKR {(getCartTotal() * 0.05).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-white/10">
                      <span>{t('marketplace:cart.total')}</span>
                      <span className="text-purple-400">LKR {(getCartTotal() * 1.05).toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Icons.CreditCard className="w-5 h-5" />
                    {t('marketplace:cart.checkout')}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add to Cart Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-24 right-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 shadow-2xl z-40"
          >
            <div className="flex items-center gap-3">
              <Icons.CheckCircle className="w-6 h-6 text-white" />
              <div>
                <p className="text-white font-semibold">Added to cart!</p>
                <p className="text-white/80 text-sm">{getCartCount()} items - LKR {getCartTotal().toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DigitalMarketplaceRedesign;