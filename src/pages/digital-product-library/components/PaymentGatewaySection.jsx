import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentGatewaySection = () => {
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const paymentGateways = [
    {
      id: 'govpay',
      name: 'GovPay',
      description: 'Official government payment platform - secure and trusted',
      icon: 'Shield',
      color: 'bg-blue-600',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-600',
      bgLight: 'bg-blue-50',
      features: ['Government backed', 'Highest security', 'Local currency', 'No foreign exchange'],
      processingTime: 'Instant',
      fees: '2.5%',
      supported: ['LKR'],
      verification: 'National ID required'
    },
    {
      id: 'lankapay',
      name: 'LankaPay',
      description: 'National payment network connecting all major banks',
      icon: 'CreditCard',
      color: 'bg-red-600',
      textColor: 'text-red-600',
      borderColor: 'border-red-600',
      bgLight: 'bg-red-50',
      features: ['All banks connected', 'Real-time transfer', 'Mobile app support', '24/7 availability'],
      processingTime: 'Instant',
      fees: '1.8%',
      supported: ['LKR'],
      verification: 'Bank account required'
    },
    {
      id: 'sampath',
      name: 'Sampath Bank',
      description: 'Direct bank gateway with preferential rates for account holders',
      icon: 'Building2',
      color: 'bg-green-700',
      textColor: 'text-green-700',
      borderColor: 'border-green-700',
      bgLight: 'bg-green-50',
      features: ['Direct bank transfer', 'Account holder benefits', 'SMS notifications', 'Internet banking'],
      processingTime: '1-2 hours',
      fees: '1.5% (0.8% for account holders)',
      supported: ['LKR'],
      verification: 'Bank verification'
    },
    {
      id: 'commercial',
      name: 'Commercial Bank',
      description: 'Established bank with comprehensive online payment solutions',
      icon: 'Building2',
      color: 'bg-blue-800',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-800',
      bgLight: 'bg-blue-50',
      features: ['Multi-card support', 'Installment options', 'Corporate accounts', 'API integration'],
      processingTime: '1-3 hours',
      fees: '2.0%',
      supported: ['LKR'],
      verification: 'Card/Account verification'
    },
    {
      id: 'ezcash',
      name: 'eZ Cash',
      description: 'Popular mobile wallet with instant payments and top-ups',
      icon: 'Smartphone',
      color: 'bg-orange-600',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-600',
      bgLight: 'bg-orange-50',
      features: ['Mobile first', 'QR code payments', 'Agent network', 'Bill payments'],
      processingTime: 'Instant',
      fees: '1.2%',
      supported: ['LKR'],
      verification: 'Mobile number + NIC'
    },
    {
      id: 'mcash',
      name: 'mCash',
      description: 'Convenient mobile payment solution with broad merchant acceptance',
      icon: 'Smartphone',
      color: 'bg-purple-600',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-600',
      bgLight: 'bg-purple-50',
      features: ['Cross-network support', 'Loyalty rewards', 'Merchant payments', 'Balance tracking'],
      processingTime: 'Instant',
      fees: '1.5%',
      supported: ['LKR'],
      verification: 'Mobile verification'
    }
  ];

  const handleSelectGateway = (gateway) => {
    setSelectedGateway(gateway);
    setShowPaymentForm(false);
  };

  const handleProceedToPayment = () => {
    if (selectedGateway) {
      setShowPaymentForm(true);
    }
  };

  const formatFeature = (feature) => {
    return feature;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-headline text-2xl font-bold text-text-primary mb-2">
          Sri Lankan Payment Options
        </h2>
        <p className="text-text-secondary">
          Choose from secure local payment methods optimized for Sri Lankan users
        </p>
      </div>

      {/* Payment Gateway Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentGateways?.map((gateway) => (
          <div
            key={gateway?.id}
            onClick={() => handleSelectGateway(gateway)}
            className={`relative bg-card border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${
              selectedGateway?.id === gateway?.id
                ? `${gateway?.borderColor} ${gateway?.bgLight}` 
                : 'border-border hover:border-primary/30'
            }`}
          >
            {/* Selection Indicator */}
            {selectedGateway?.id === gateway?.id && (
              <div className={`absolute top-4 right-4 w-6 h-6 ${gateway?.color} rounded-full flex items-center justify-center`}>
                <Icon name="Check" size={16} color="white" />
              </div>
            )}

            {/* Gateway Icon and Name */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 ${gateway?.color} rounded-lg flex items-center justify-center`}>
                <Icon name={gateway?.icon} size={24} color="white" />
              </div>
              <div>
                <h3 className="font-cta-medium text-lg text-text-primary">
                  {gateway?.name}
                </h3>
                <p className={`text-sm ${gateway?.textColor}`}>
                  {gateway?.processingTime} • {gateway?.fees} fee
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-text-secondary text-sm mb-4">
              {gateway?.description}
            </p>

            {/* Features */}
            <div className="space-y-2 mb-4">
              {gateway?.features?.slice(0, 3)?.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Icon name="CheckCircle" size={14} className="text-green-600 flex-shrink-0" />
                  <span className="text-text-secondary">{formatFeature(feature)}</span>
                </div>
              ))}
              {gateway?.features?.length > 3 && (
                <div className="text-xs text-text-secondary">
                  +{gateway?.features?.length - 3} more features
                </div>
              )}
            </div>

            {/* Verification Requirement */}
            <div className="flex items-center gap-2 text-xs text-text-secondary pt-2 border-t border-border">
              <Icon name="Shield" size={12} />
              <span>{gateway?.verification}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Gateway Details */}
      {selectedGateway && (
        <div className={`${selectedGateway?.bgLight} border ${selectedGateway?.borderColor} rounded-lg p-6`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-headline text-xl font-semibold text-text-primary mb-2">
                Payment via {selectedGateway?.name}
              </h3>
              <p className="text-text-secondary">
                Complete your purchase using {selectedGateway?.name} secure payment gateway
              </p>
            </div>
            <div className={`w-16 h-16 ${selectedGateway?.color} rounded-lg flex items-center justify-center`}>
              <Icon name={selectedGateway?.icon} size={32} color="white" />
            </div>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-cta-medium text-text-primary mb-3">Gateway Features:</h4>
              <div className="space-y-2">
                {selectedGateway?.features?.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Icon name="CheckCircle" size={14} className="text-green-600" />
                    <span className="text-text-secondary">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-cta-medium text-text-primary mb-3">Payment Information:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Processing Time:</span>
                  <span className="text-text-primary">{selectedGateway?.processingTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Transaction Fee:</span>
                  <span className="text-text-primary">{selectedGateway?.fees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Supported Currency:</span>
                  <span className="text-text-primary">{selectedGateway?.supported?.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Verification:</span>
                  <span className="text-text-primary">{selectedGateway?.verification}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              size="lg"
              iconName="CreditCard"
              iconPosition="left"
              onClick={handleProceedToPayment}
            >
              Proceed to {selectedGateway?.name}
            </Button>
            <Button
              variant="outline"
              size="lg"
              iconName="HelpCircle"
              iconPosition="left"
            >
              Payment Help
            </Button>
          </div>
        </div>
      )}

      {/* Payment Security Information */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Shield" size={24} className="text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-cta-medium text-lg text-text-primary mb-2">
              Your Payment Security
            </h3>
            <div className="space-y-2 text-sm text-text-secondary">
              <p>• All transactions are encrypted with industry-standard SSL/TLS protocols</p>
              <p>• PCI DSS compliant payment processing for maximum security</p>
              <p>• Local Sri Lankan payment gateways ensure fast, secure transactions</p>
              <p>• Your financial information is never stored on our servers</p>
              <p>• Government-grade security standards for institutional buyers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Benefits */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white">
        <h3 className="font-headline text-xl font-bold mb-4">
          Why Choose Sri Lankan Payment Integration?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-cta-medium mb-2">Local Advantages:</h4>
            <ul className="space-y-1 text-sm text-white/90">
              <li>• No foreign exchange fees or complications</li>
              <li>• Familiar payment methods you already use</li>
              <li>• Instant local currency processing (LKR)</li>
              <li>• 24/7 local customer support</li>
            </ul>
          </div>
          <div>
            <h4 className="font-cta-medium mb-2">Business Benefits:</h4>
            <ul className="space-y-1 text-sm text-white/90">
              <li>• Lower transaction costs compared to international gateways</li>
              <li>• Compliance with Sri Lankan banking regulations</li>
              <li>• Integration with local accounting systems</li>
              <li>• Support for government and institutional procurement</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="text-center py-8">
        <h3 className="font-headline text-lg font-semibold text-text-primary mb-2">
          Need Help with Payment?
        </h3>
        <p className="text-text-secondary mb-4">
          Our local payment specialists are available to assist you
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant="outline"
            iconName="Phone"
            iconPosition="left"
          >
            Call +94 11 269 4444
          </Button>
          <Button
            variant="outline"
            iconName="Mail"
            iconPosition="left"
          >
            payments@nara.ac.lk
          </Button>
          <Button
            variant="outline"
            iconName="MessageCircle"
            iconPosition="left"
          >
            Live Chat Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentGatewaySection;