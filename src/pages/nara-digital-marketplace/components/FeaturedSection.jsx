import React from 'react';
import Icon from '../../../components/AppIcon';
import AppImage from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { cn } from '../../../utils/cn';

const FeaturedSection = ({ onViewAll, onAddToCart }) => {
  const featuredProducts = [
    {
      id: 'fp-1',
      title: 'Marine Biodiversity Assessment 2024',
      type: 'Research Publication',
      price: 3500,
      originalPrice: 4200,
      division: 'Marine Biology',
      isNew: true,
      isPopular: true,
      image: '/public/assets/images/no_image.png',
      rating: 4.8,
      description: 'Comprehensive assessment of marine biodiversity in Sri Lankan waters with detailed species cataloging and conservation recommendations.'
    },
    {
      id: 'fp-2',
      title: 'Oceanographic Data Collection 2023-2024',
      type: 'Digital Dataset',
      price: 5500,
      division: 'Oceanography',
      isPopular: true,
      image: '/public/assets/images/no_image.png',
      rating: 4.7,
      description: 'High-resolution oceanographic data including temperature, salinity, and current measurements from 50+ monitoring stations.'
    },
    {
      id: 'fp-3',
      title: 'Maritime Safety Training Program',
      type: 'Training Service',
      price: 12000,
      division: 'Maritime Safety',
      isNew: true,
      image: '/public/assets/images/no_image.png',
      rating: 4.9,
      description: 'Professional maritime safety certification program with hands-on training and international compliance standards.'
    }
  ];

  const newReleases = [
    {
      id: 'nr-1',
      title: 'Coastal Erosion Monitoring System',
      type: 'GIS Dataset',
      price: 2800,
      division: 'Coastal Studies',
      publishDate: '2024-01-15'
    },
    {
      id: 'nr-2',
      title: 'Marine Protected Areas Guide',
      type: 'Educational Material',
      price: 1500,
      division: 'Environmental Monitoring',
      publishDate: '2024-01-12'
    },
    {
      id: 'nr-3',
      title: 'Tsunami Early Warning Protocols',
      type: 'Research Publication',
      price: 3200,
      division: 'Maritime Safety',
      publishDate: '2024-01-10'
    }
  ];

  const popularDatasets = [
    {
      id: 'pd-1',
      title: 'Sri Lankan Waters Temperature Maps',
      downloads: 1247,
      price: 4200,
      type: 'GIS Maps'
    },
    {
      id: 'pd-2',
      title: 'Fish Species Distribution Data',
      downloads: 892,
      price: 3800,
      type: 'Digital Dataset'
    },
    {
      id: 'pd-3',
      title: 'Coral Reef Health Assessment',
      downloads: 756,
      price: 2900,
      type: 'Research Data'
    }
  ];

  const formatPrice = (amount) => {
    return `LKR ${amount?.toLocaleString() || '0'}`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-12">
      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Icon name="Star" className="text-yellow-500" />
              Featured Products
            </h2>
            <p className="text-gray-600 mt-1">Handpicked research products and premium datasets</p>
          </div>
          
          <Button
            variant="outline"
            onClick={() => onViewAll?.('featured')}
            iconName="ArrowRight"
            iconPosition="right"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts?.map((product) => (
            <div key={product?.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden group hover:shadow-xl transition-all duration-300">
              {/* Image with Badges */}
              <div className="relative">
                <AppImage
                  src={product?.image}
                  alt={product?.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product?.isNew && (
                    <span className="px-2 py-1 text-xs font-bold bg-green-600 text-white rounded-full">
                      NEW
                    </span>
                  )}
                  {product?.isPopular && (
                    <span className="px-2 py-1 text-xs font-bold bg-orange-500 text-white rounded-full">
                      FEATURED
                    </span>
                  )}
                </div>

                {/* Discount Badge */}
                {product?.originalPrice && (
                  <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded-full">
                    {Math.round((1 - product?.price / product?.originalPrice) * 100)}% OFF
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                    {product?.type}
                  </span>
                  <div className="flex items-center gap-1">
                    <Icon name="Star" size={14} className="text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{product?.rating}</span>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product?.title}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {product?.description}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(product?.price)}
                      </span>
                      {product?.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product?.originalPrice)}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{product?.division}</span>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => onAddToCart?.(product)}
                    iconName="Plus"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* New Releases and Popular Datasets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* New Releases */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Icon name="Zap" className="text-green-600" />
              New Releases
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewAll?.('new-releases')}
              iconName="ArrowRight"
              iconPosition="right"
              className="text-green-600 hover:text-green-700"
            >
              See All
            </Button>
          </div>

          <div className="space-y-4">
            {newReleases?.map((item) => (
              <div key={item?.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                      {item?.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {item?.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {item?.division}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatPrice(item?.price)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(item?.publishDate)}
                    </div>
                  </div>
                </div>
                
                <Button
                  size="xs"
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50"
                  iconName="Download"
                >
                  Add to Cart
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Datasets */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Icon name="TrendingUp" className="text-orange-600" />
              Popular Datasets
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewAll?.('popular')}
              iconName="ArrowRight"
              iconPosition="right"
              className="text-orange-600 hover:text-orange-700"
            >
              See All
            </Button>
          </div>

          <div className="space-y-4">
            {popularDatasets?.map((item, index) => (
              <div key={item?.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white",
                    index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-500"
                  )}>
                    #{index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                      {item?.title}
                    </h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                        {item?.type}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Icon name="Download" size={12} />
                        {item?.downloads?.toLocaleString()} downloads
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatPrice(item?.price)}
                    </div>
                    <Button
                      size="xs"
                      className="bg-orange-600 hover:bg-orange-700 text-white mt-1"
                      iconName="Plus"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      {/* Call to Action Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-center text-white">
        <div className="max-w-2xl mx-auto">
          <Icon name="Users" size={32} className="mx-auto mb-4 text-blue-200" />
          <h2 className="text-2xl font-bold mb-3">
            Institutional Licensing Available
          </h2>
          <p className="text-blue-100 mb-6">
            Get access to our complete research library with multi-user licensing for universities, 
            government agencies, and research institutions. Special pricing and bulk discounts available.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-50"
              iconName="Building"
            >
              Institutional Pricing
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600"
              iconName="Phone"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturedSection;