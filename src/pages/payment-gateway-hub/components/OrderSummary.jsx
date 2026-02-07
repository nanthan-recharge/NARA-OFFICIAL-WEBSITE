import React from 'react';
import Icon from '../../../components/AppIcon';
import AppImage from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { cn } from '../../../utils/cn';

const OrderSummary = ({ order = {}, onEdit, isProcessing = false }) => {
  const {
    items = [],
    subtotal = 0,
    processingFee = 100,
    taxes = 0,
    discount = 0,
    total = 0,
    currency = 'LKR',
    orderNumber,
    customerType = 'individual' // individual, institutional, government
  } = order;

  const formatPrice = (amount) => {
    return `${currency} ${amount?.toLocaleString() || '0'}`;
  };

  const getCustomerTypeColor = (type) => {
    switch (type) {
      case 'government': return 'text-green-600 bg-green-50';
      case 'institutional': return 'text-blue-600 bg-blue-50';
      case 'individual': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCustomerTypeIcon = (type) => {
    switch (type) {
      case 'government': return 'Building';
      case 'institutional': return 'GraduationCap';
      case 'individual': return 'User';
      default: return 'User';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Icon name="ShoppingCart" size={18} />
            Order Summary
          </h2>
          {orderNumber && (
            <p className="text-sm text-gray-500 mt-1">Order #{orderNumber}</p>
          )}
        </div>
        
        {onEdit && !isProcessing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            iconName="Edit2"
            className="text-blue-600 hover:text-blue-700"
          >
            Edit
          </Button>
        )}
      </div>
      {/* Customer Type */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Customer Type</span>
        <span className={cn("text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1", getCustomerTypeColor(customerType))}>
          <Icon name={getCustomerTypeIcon(customerType)} size={12} />
          {customerType?.charAt(0)?.toUpperCase() + customerType?.slice(1)}
        </span>
      </div>
      {/* Items */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Items ({items?.length})</h3>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {items?.map((item) => (
            <div key={item?.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <AppImage
                  src={item?.image || "/public/assets/images/no_image.png"}
                  alt={item?.title}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {item?.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {item?.type} • {item?.division}
                </p>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-600">
                    Qty: {item?.quantity}
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(item?.price)}
                    </div>
                    {item?.quantity > 1 && (
                      <div className="text-xs text-gray-500">
                        Total: {formatPrice(item?.price * item?.quantity)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Pricing Breakdown */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">{formatPrice(subtotal)}</span>
        </div>

        {/* Processing Fee */}
        <div className="flex justify-between text-sm items-center">
          <div className="flex items-center gap-1">
            <span className="text-gray-600">Processing Fee</span>
            <div className="group relative">
              <Icon name="Info" size={12} className="text-gray-400 cursor-help" />
              <div className="invisible group-hover:visible absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
                Standard processing fee for digital transactions
              </div>
            </div>
          </div>
          <span className="text-gray-900">{formatPrice(processingFee)}</span>
        </div>

        {/* Taxes */}
        {taxes > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">VAT (15%)</span>
            <span className="text-gray-900">{formatPrice(taxes)}</span>
          </div>
        )}

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span className="flex items-center gap-1">
              <Icon name="Tag" size={12} />
              Discount
            </span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between text-lg font-semibold text-gray-900 pt-3 border-t border-gray-300">
          <span>Total</span>
          <span className="text-blue-600">{formatPrice(total)}</span>
        </div>
      </div>
      {/* Payment Protection Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Shield" size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium text-blue-900 mb-1">Secure Payment Guarantee</div>
            <div className="text-blue-700">
              Your payment is protected by government-grade encryption and Sri Lankan banking security standards. 
              Full refund available within 30 days for digital products.
            </div>
          </div>
        </div>
      </div>
      {/* Special Notices */}
      {customerType === 'government' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm text-green-800">
            <Icon name="CheckCircle" size={14} />
            <span className="font-medium">Government Discount Applied</span>
          </div>
          <p className="text-xs text-green-700 mt-1">
            Special pricing for government agencies includes expedited processing and priority support.
          </p>
        </div>
      )}
      {customerType === 'institutional' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <Icon name="GraduationCap" size={14} />
            <span className="font-medium">Educational Institution Benefits</span>
          </div>
          <p className="text-xs text-blue-700 mt-1">
            Includes multi-user licensing and educational resource access.
          </p>
        </div>
      )}
      {/* Digital Delivery Notice */}
      <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
        <Icon name="Download" size={12} className="inline mr-1" />
        Digital products will be available immediately after payment confirmation
      </div>
    </div>
  );
};

export default OrderSummary;