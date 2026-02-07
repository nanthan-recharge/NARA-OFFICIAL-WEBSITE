import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductCatalogSection = ({ products, onPurchase }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products?.filter(product => {
    const matchesFilter = filter === 'all' || product?.type === filter;
    const matchesSearch = !searchTerm || 
      product?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      product?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      product?.tags?.some(tag => tag?.toLowerCase()?.includes(searchTerm?.toLowerCase()));
    return matchesFilter && matchesSearch;
  })?.sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a?.price - b?.price;
      case 'price-high': return b?.price - a?.price;
      case 'popular': return b?.downloads - a?.downloads;
      case 'rating': return b?.rating - a?.rating;
      default: return 0; // newest - keep original order
    }
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'dataset': return 'Database';
      case 'e-book': return 'Book';
      case 'software': return 'Settings';
      case 'publication': return 'FileText';
      default: return 'File';
    }
  };

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('si-LK', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(price);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)]?.map((_, i) => (
          <Icon
            key={i}
            name="Star"
            size={14}
            className={
              i < fullStars 
                ? 'text-yellow-400 fill-current' 
                : i === fullStars && hasHalfStar 
                  ? 'text-yellow-400 fill-current' :'text-gray-300'
            }
          />
        ))}
        <span className="text-sm text-text-secondary ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="font-headline text-2xl font-bold text-text-primary mb-2">
            Product Catalog
          </h2>
          <p className="text-text-secondary">
            Discover and purchase digital research products, datasets, and tools
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary w-full sm:w-64"
            />
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e?.target?.value)}
            className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="all">All Categories</option>
            <option value="dataset">Datasets</option>
            <option value="e-book">E-Books</option>
            <option value="software">Software</option>
            <option value="publication">Publications</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e?.target?.value)}
            className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-text-secondary">
          Showing {filteredProducts?.length} of {products?.length} products
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts?.map((product) => (
            <div key={product?.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              {/* Product Image */}
              <div className="relative">
                <img 
                  src={product?.thumbnail} 
                  alt={product?.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {product?.isNew && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      New
                    </span>
                  )}
                  <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                    {product?.type?.toUpperCase()?.replace('-', ' ')}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name={getTypeIcon(product?.type)} size={16} className="text-primary" />
                  </div>
                </div>
              </div>

              {/* Product Content */}
              <div className="p-6">
                <h3 className="font-headline text-lg font-semibold text-text-primary mb-2 line-clamp-2">
                  {product?.title}
                </h3>
                
                <p className="text-text-secondary text-sm mb-4 line-clamp-3">
                  {product?.description}
                </p>

                {/* Rating and Downloads */}
                <div className="flex items-center justify-between mb-4">
                  {renderStars(product?.rating)}
                  <span className="text-xs text-text-secondary">
                    {product?.downloads} downloads
                  </span>
                </div>

                {/* Product Details */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Format:</span>
                    <span className="text-text-primary">{product?.format}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Size:</span>
                    <span className="text-text-primary">{product?.fileSize}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">License:</span>
                    <span className="text-text-primary">{product?.license}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {product?.tags?.slice(0, 3)?.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                  {product?.tags?.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{product?.tags?.length - 3} more
                    </span>
                  )}
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-text-primary">
                      {formatPrice(product?.price, product?.currency)}
                    </div>
                    <div className="text-xs text-text-secondary">
                      Secure Sri Lankan payment
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {product?.preview && (
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Eye"
                        onClick={() => console.log('Preview:', product)}
                      />
                    )}
                    <Button
                      variant="primary"
                      size="sm"
                      iconName="ShoppingCart"
                      iconPosition="left"
                      onClick={() => onPurchase?.(product)}
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icon name="ShoppingCart" size={48} className="text-text-secondary mx-auto mb-4" />
          <h3 className="font-headline text-xl font-bold text-text-primary mb-2">
            No products found
          </h3>
          <p className="font-body text-text-secondary mb-6 max-w-md mx-auto">
            Try adjusting your search terms or filters to find the research products you need
          </p>
          <Button
            variant="outline"
            iconName="RotateCcw"
            iconPosition="left"
            onClick={() => {
              setSearchTerm('');
              setFilter('all');
              setSortBy('newest');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Institutional Licensing CTA */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-headline text-xl font-bold mb-2">
              Need Institutional Licensing?
            </h3>
            <p className="text-white/90">
              Multi-user access, bulk pricing, and dedicated support for universities, 
              government agencies, and research organizations
            </p>
          </div>
          <Button
            variant="secondary"
            iconName="Building"
            iconPosition="left"
          >
            Contact Sales
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalogSection;