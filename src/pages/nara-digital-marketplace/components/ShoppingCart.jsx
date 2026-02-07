import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import AppImage from '../../../components/AppImage';
import { cn } from '../../../utils/cn';

const ShoppingCart = ({ isOpen, onClose, cart = {}, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const { items = [], total = 0, itemCount = 0 } = cart;

  const formatPrice = (amount) => {
    return `LKR ${amount?.toLocaleString() || '0'}`;
  };

  const calculateSubtotal = (price, quantity) => {
    return price * quantity;
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      onRemoveItem?.(itemId);
    } else {
      onUpdateQuantity?.(itemId, newQuantity);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={onClose}
        />
      )}
      {/* Cart Sidebar */}
      <div className={cn(
        "fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <Icon name="ShoppingCart" size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Shopping Cart {itemCount > 0 && `(${itemCount})`}
            </h2>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            className="text-gray-500 hover:text-gray-700"
          />
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto">
          {items?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Icon name="ShoppingCart" size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some products to get started with your research collection.</p>
              <Button
                onClick={onClose}
                variant="default"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {items?.map((item) => (
                <div key={item?.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <AppImage
                        src={item?.image || "/public/assets/images/no_image.png"}
                        alt={item?.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item?.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {item?.type} • {item?.division}
                      </p>
                      
                      {/* Price and Quantity */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(item?.price)}
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item?.id, item?.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                            disabled={item?.quantity <= 1}
                          >
                            <Icon name="Minus" size={12} />
                          </button>
                          
                          <span className="w-8 text-center text-sm font-medium">
                            {item?.quantity}
                          </span>
                          
                          <button
                            onClick={() => handleQuantityChange(item?.id, item?.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                          >
                            <Icon name="Plus" size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal and Remove */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-sm text-gray-600">
                          Subtotal: <span className="font-medium text-gray-900">
                            {formatPrice(calculateSubtotal(item?.price, item?.quantity))}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => onRemoveItem?.(item?.id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                          title="Remove item"
                        >
                          <Icon name="Trash2" size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Bulk Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-gray-600 border-gray-300"
                  onClick={() => {
                    // Clear all items
                    items?.forEach(item => onRemoveItem?.(item?.id));
                  }}
                >
                  Clear Cart
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-blue-600"
                  onClick={onClose}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Total and Checkout */}
        {items?.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50 space-y-4">
            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                <span className="text-gray-900">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Processing Fee</span>
                <span className="text-gray-900">LKR 100</span>
              </div>
              <div className="flex justify-between text-base font-semibold border-t border-gray-300 pt-2">
                <span className="text-gray-900">Total</span>
                <span className="text-blue-600">{formatPrice(total + 100)}</span>
              </div>
            </div>

            {/* Checkout Buttons */}
            <div className="space-y-2">
              <Button
                onClick={onCheckout}
                variant="default"
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                iconName="CreditCard"
              >
                Proceed to Checkout
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="w-full border-green-600 text-green-600 hover:bg-green-50"
                iconName="Wallet"
              >
                Quick Pay with GovPay
              </Button>
            </div>

            {/* Security Notice */}
            <div className="text-xs text-gray-500 text-center">
              <Icon name="Shield" size={12} className="inline mr-1" />
              Secure checkout with Sri Lankan payment gateways
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ShoppingCart;