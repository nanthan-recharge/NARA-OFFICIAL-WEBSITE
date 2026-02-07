import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PurchaseHistorySection = ({ purchaseHistory }) => {
  const [sortBy, setSortBy] = useState('newest');

  const sortedHistory = purchaseHistory?.sort((a, b) => {
    switch (sortBy) {
      case 'oldest': return new Date(a?.date) - new Date(b?.date);
      case 'amount-high': return b?.total - a?.total;
      case 'amount-low': return a?.total - b?.total;
      default: return new Date(b?.date) - new Date(a?.date); // newest
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'govpay': return 'Shield';
      case 'lankapay': return 'CreditCard';
      case 'sampath bank': case'commercial bank': case'hnb': case'dfcc': return 'Building2';
      case 'ez cash': case'mcash': return 'Smartphone';
      default: return 'CreditCard';
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

  const handleDownloadInvoice = (purchase) => {
    console.log('Downloading invoice for:', purchase?.orderNumber);
    // Implement invoice download
  };

  const handleReorder = (purchase) => {
    console.log('Reordering:', purchase);
    // Implement reorder functionality
  };

  return (
    <div className="space-y-6">
      {/* Header with Sort Options */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="font-headline text-2xl font-bold text-text-primary mb-2">
            Purchase History
          </h2>
          <p className="text-text-secondary">
            View and manage your complete transaction history with detailed invoices
          </p>
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e?.target?.value)}
          className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="amount-high">Amount: High to Low</option>
          <option value="amount-low">Amount: Low to High</option>
        </select>
      </div>
      {/* Purchase History List */}
      {sortedHistory?.length > 0 ? (
        <div className="space-y-4">
          {sortedHistory?.map((purchase) => (
            <div key={purchase?.id} className="bg-card border border-border rounded-lg p-6">
              {/* Purchase Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Receipt" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-cta-medium text-lg text-text-primary">
                      Order #{purchase?.orderNumber}
                    </h3>
                    <p className="text-text-secondary text-sm">
                      {new Date(purchase?.date)?.toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(purchase?.status)}`}>
                    {purchase?.status?.charAt(0)?.toUpperCase() + purchase?.status?.slice(1)}
                  </span>
                  <div className="text-right">
                    <div className="font-cta-medium text-lg text-text-primary">
                      {formatPrice(purchase?.total, purchase?.currency)}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-text-secondary">
                      <Icon name={getPaymentMethodIcon(purchase?.paymentMethod)} size={14} />
                      {purchase?.paymentMethod}
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3 mb-4">
                {purchase?.items?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-l-2 border-primary/20 pl-4">
                    <div>
                      <h4 className="font-cta text-text-primary">{item?.name}</h4>
                      <p className="text-sm text-text-secondary">{item?.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-cta text-text-primary">
                        {formatPrice(item?.price, item?.currency)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Purchase Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  iconPosition="left"
                  onClick={() => handleDownloadInvoice(purchase)}
                >
                  Download Invoice
                </Button>
                
                {purchase?.accessGranted && (
                  <Button
                    variant="outline" 
                    size="sm"
                    iconName="ExternalLink"
                    iconPosition="left"
                    onClick={() => console.log('Access products:', purchase)}
                  >
                    Access Products
                  </Button>
                )}
                
                {purchase?.status === 'completed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="ShoppingCart"
                    iconPosition="left"
                    onClick={() => handleReorder(purchase)}
                  >
                    Reorder
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  iconName="MessageCircle"
                  iconPosition="left"
                  onClick={() => console.log('Contact support:', purchase)}
                >
                  Support
                </Button>
              </div>

              {/* Purchase Details Summary */}
              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-text-secondary">Transaction ID:</span>
                    <p className="font-mono text-text-primary">{purchase?.id?.toUpperCase()}</p>
                  </div>
                  <div>
                    <span className="text-text-secondary">Payment Gateway:</span>
                    <p className="text-text-primary">{purchase?.paymentMethod}</p>
                  </div>
                  <div>
                    <span className="text-text-secondary">Access Status:</span>
                    <p className={purchase?.accessGranted ? 'text-green-600' : 'text-red-600'}>
                      {purchase?.accessGranted ? 'Active' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icon name="Receipt" size={48} className="text-text-secondary mx-auto mb-4" />
          <h3 className="font-headline text-xl font-bold text-text-primary mb-2">
            No purchase history
          </h3>
          <p className="font-body text-text-secondary mb-6 max-w-md mx-auto">
            Your purchase history will appear here once you make your first order
          </p>
          <Button
            variant="primary"
            iconName="ShoppingCart"
            iconPosition="left"
            onClick={() => window?.scrollTo(0, 0)}
          >
            Browse Products
          </Button>
        </div>
      )}
      {/* Purchase Summary Stats */}
      {sortedHistory?.length > 0 && (
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-6">
          <h3 className="font-headline text-lg font-semibold text-text-primary mb-4">
            Purchase Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {sortedHistory?.length}
              </div>
              <div className="text-sm text-text-secondary">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {formatPrice(
                  sortedHistory?.reduce((sum, purchase) => sum + purchase?.total, 0),
                  sortedHistory?.[0]?.currency
                )}
              </div>
              <div className="text-sm text-text-secondary">Total Spent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {sortedHistory?.filter(p => p?.status === 'completed')?.length}
              </div>
              <div className="text-sm text-text-secondary">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {sortedHistory?.reduce((sum, purchase) => sum + purchase?.items?.length, 0)}
              </div>
              <div className="text-sm text-text-secondary">Products Purchased</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistorySection;