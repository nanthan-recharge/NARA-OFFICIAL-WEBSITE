import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { cn } from '../../../utils/cn';

const PaymentMethodCard = ({ method, onSelect, isSelected = false, isLoading = false }) => {
  const {
    id,
    name,
    type, // 'bank', 'mobile', 'government', 'card'
    description,
    logo,
    processingTime,
    fees,
    isAvailable = true,
    supportedFeatures = [],
    maxAmount,
    minAmount
  } = method;

  const getTypeIcon = (methodType) => {
    switch (methodType) {
      case 'government': return 'Building';
      case 'bank': return 'Landmark';
      case 'mobile': return 'Smartphone';
      case 'card': return 'CreditCard';
      default: return 'Wallet';
    }
  };

  const getTypeColor = (methodType) => {
    switch (methodType) {
      case 'government': return 'text-green-600 bg-green-50';
      case 'bank': return 'text-blue-600 bg-blue-50';
      case 'mobile': return 'text-purple-600 bg-purple-50';
      case 'card': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatAmount = (amount) => {
    if (!amount) return '';
    return `LKR ${amount?.toLocaleString()}`;
  };

  return (
    <div
      className={cn(
        "bg-white rounded-xl border-2 p-6 transition-all duration-200 cursor-pointer",
        isSelected 
          ? "border-blue-600 shadow-lg ring-2 ring-blue-100" 
          : "border-gray-200 hover:border-gray-300 hover:shadow-md",
        !isAvailable && "opacity-60 cursor-not-allowed",
        isLoading && "pointer-events-none"
      )}
      onClick={() => isAvailable && !isLoading && onSelect?.(method)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Logo or Icon */}
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
            {logo ? (
              <img src={logo} alt={name} className="w-full h-full object-contain" />
            ) : (
              <Icon name={getTypeIcon(type)} size={20} className="text-gray-600" />
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              {name}
              {isSelected && <Icon name="CheckCircle" size={16} className="text-blue-600" />}
            </h3>
            <span className={cn("text-xs px-2 py-1 rounded-full font-medium", getTypeColor(type))}>
              {type?.charAt(0)?.toUpperCase() + type?.slice(1)} Payment
            </span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {isLoading && <Icon name="Loader" size={16} className="animate-spin text-blue-600" />}
          <div className={cn(
            "w-3 h-3 rounded-full",
            isAvailable ? "bg-green-500" : "bg-red-500"
          )} />
        </div>
      </div>
      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>
      )}
      {/* Payment Details */}
      <div className="space-y-3 mb-4">
        {/* Processing Time */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center gap-1">
            <Icon name="Clock" size={14} />
            Processing Time
          </span>
          <span className="font-medium text-gray-900">{processingTime}</span>
        </div>

        {/* Fees */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center gap-1">
            <Icon name="DollarSign" size={14} />
            Transaction Fee
          </span>
          <span className="font-medium text-gray-900">{fees}</span>
        </div>

        {/* Amount Limits */}
        {(minAmount || maxAmount) && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <Icon name="TrendingUp" size={14} />
              Limits
            </span>
            <span className="font-medium text-gray-900 text-right">
              {minAmount && formatAmount(minAmount)}
              {minAmount && maxAmount && ' - '}
              {maxAmount && formatAmount(maxAmount)}
            </span>
          </div>
        )}
      </div>
      {/* Supported Features */}
      {supportedFeatures?.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {supportedFeatures?.slice(0, 3)?.map((feature, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
              >
                {feature}
              </span>
            ))}
            {supportedFeatures?.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{supportedFeatures?.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
      {/* Action Button */}
      <Button
        variant={isSelected ? "default" : "outline"}
        size="sm"
        className={cn(
          "w-full",
          isSelected && "bg-blue-600 hover:bg-blue-700 text-white",
          !isAvailable && "opacity-50 cursor-not-allowed"
        )}
        disabled={!isAvailable || isLoading}
        iconName={isSelected ? "CheckCircle" : "ArrowRight"}
        iconPosition={isSelected ? "left" : "right"}
      >
        {isLoading 
          ? "Loading..." 
          : isSelected 
            ? "Selected" 
            : !isAvailable 
              ? "Unavailable" :"Select Payment"
        }
      </Button>
      {/* Security Badge */}
      <div className="mt-3 flex items-center justify-center gap-1 text-xs text-gray-500">
        <Icon name="Shield" size={12} />
        <span>Secured by SSL encryption</span>
      </div>
    </div>
  );
};

export default PaymentMethodCard;