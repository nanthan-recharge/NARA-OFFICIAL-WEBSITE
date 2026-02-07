import React from 'react';
import AppImage from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { cn } from '../../../utils/cn';

const ProductCard = ({ 
  product = {}, 
  onAddToCart, 
  onWishlistToggle, 
  onQuickView,
  isWishlisted = false 
}) => {
  const {
    id,
    title = "Research Publication",
    type = "Digital Product",
    price = 2500,
    originalPrice,
    division = "Marine Research",
    availability = "Available",
    image,
    rating = 4.5,
    reviewCount = 12,
    isNew = false,
    isPopular = false,
    description = "Comprehensive research findings on marine ecosystems"
  } = product;

  const formatPrice = (amount) => {
    return `LKR ${amount?.toLocaleString() || '0'}`;
  };

  const getAvailabilityColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'text-green-600 bg-green-50';
      case 'limited': return 'text-orange-600 bg-orange-50';
      case 'out of stock': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeColor = (productType) => {
    switch (productType?.toLowerCase()) {
      case 'digital product': return 'text-blue-600 bg-blue-50';
      case 'physical product': return 'text-purple-600 bg-purple-50';
      case 'service': return 'text-teal-600 bg-teal-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
      {/* Image Section */}
      <div className="relative overflow-hidden rounded-t-xl">
        <AppImage
          src={image || "/public/assets/images/no_image.png"}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <span className="px-2 py-1 text-xs font-medium bg-green-600 text-white rounded-full">
              NEW
            </span>
          )}
          {isPopular && (
            <span className="px-2 py-1 text-xs font-medium bg-orange-600 text-white rounded-full">
              POPULAR
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onWishlistToggle?.(id)}
            className={cn(
              "p-2 rounded-full shadow-lg transition-colors duration-200",
              isWishlisted 
                ? "bg-red-600 text-white hover:bg-red-700" :"bg-white text-gray-600 hover:text-red-600"
            )}
          >
            <Icon name="Heart" size={16} />
          </button>
          
          <button
            onClick={() => onQuickView?.(product)}
            className="p-2 rounded-full bg-white text-gray-600 shadow-lg hover:text-blue-600 transition-colors duration-200"
          >
            <Icon name="Eye" size={16} />
          </button>
        </div>

        {/* Quick Add Button */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            variant="default"
            onClick={() => onAddToCart?.(product)}
            iconName="Plus"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          >
            Add
          </Button>
        </div>
      </div>
      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Type and Division */}
        <div className="flex items-center justify-between text-xs">
          <span className={cn("px-2 py-1 rounded-full font-medium", getTypeColor(type))}>
            {type}
          </span>
          <span className="text-gray-500">{division}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5]?.map((star) => (
              <Icon
                key={star}
                name="Star"
                size={14}
                className={cn(
                  star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            {rating} ({reviewCount} reviews)
          </span>
        </div>

        {/* Price and Availability */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-gray-900">
              {formatPrice(price)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          
          <span className={cn("px-2 py-1 text-xs font-medium rounded-full", getAvailabilityColor(availability))}>
            {availability}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => onAddToCart?.(product)}
            iconName="ShoppingCart"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Add to Cart
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuickView?.(product)}
            iconName="Eye"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;