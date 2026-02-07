import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import PaymentMethodCard from './components/PaymentMethodCard';
import OrderSummary from './components/OrderSummary';
import SecurityBadges from './components/SecurityBadges';
import { cn } from '../../utils/cn';
import StitchWrapper from '../../components/shared/StitchWrapper';

const PaymentGatewayHub = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState('method'); // method, details, confirmation
  const [paymentDetails, setPaymentDetails] = useState({
    customerType: 'individual',
    email: '',
    phone: '',
    organizationName: '',
    taxId: ''
  });

  // Mock order data (would come from marketplace)
  const [orderData] = useState({
    orderNumber: 'NARA-' + Date.now()?.toString()?.slice(-6),
    items: [
      {
        id: '1',
        title: 'Marine Ecosystem Analysis Report',
        type: 'Digital Product',
        division: 'Marine Research',
        price: 3500,
        quantity: 1,
        image: '/public/assets/images/no_image.png'
      },
      {
        id: '2',
        title: 'Oceanographic Dataset 2024',
        type: 'Digital Dataset',
        division: 'Oceanography',
        price: 5500,
        quantity: 1,
        image: '/public/assets/images/no_image.png'
      }
    ],
    subtotal: 9000,
    processingFee: 100,
    taxes: 1365, // 15% VAT
    discount: 0,
    total: 10465,
    currency: 'LKR',
    customerType: 'individual'
  });

  // Sri Lankan Payment Methods
  const paymentMethods = [
    {
      id: 'govpay',
      name: 'GovPay',
      type: 'government',
      description: 'Official government payment platform for secure institutional transactions',
      processingTime: 'Instant',
      fees: 'Free for gov agencies',
      isAvailable: true,
      supportedFeatures: ['Instant Settlement', 'Tax Integration', 'Audit Trail', 'Bulk Payments'],
      maxAmount: 1000000,
      minAmount: 100
    },
    {
      id: 'lankapay',
      name: 'LankaPay',
      type: 'bank',
      description: 'National payment network connecting all major Sri Lankan banks',
      processingTime: '2-5 minutes',
      fees: 'LKR 25 + 0.5%',
      isAvailable: true,
      supportedFeatures: ['Real-time Transfer', 'Mobile Banking', 'ATM Network', 'Multi-bank Support'],
      maxAmount: 500000,
      minAmount: 50
    },
    {
      id: 'sampath-bank',
      name: 'Sampath Bank',
      type: 'bank',
      description: 'Direct integration with Sampath Bank online banking platform',
      processingTime: '1-3 minutes',
      fees: 'LKR 30 per transaction',
      isAvailable: true,
      supportedFeatures: ['Online Banking', 'Mobile App', 'SMS Alerts', 'Transaction History'],
      maxAmount: 300000,
      minAmount: 100
    },
    {
      id: 'commercial-bank',
      name: 'Commercial Bank',
      type: 'bank',
      description: 'Secure payment gateway through Commercial Bank of Ceylon',
      processingTime: '1-3 minutes',
      fees: 'LKR 35 per transaction',
      isAvailable: true,
      supportedFeatures: ['Internet Banking', 'CardNet', 'ComBank Mobile', 'Auto Debit'],
      maxAmount: 250000,
      minAmount: 100
    },
    {
      id: 'hnb',
      name: 'Hatton National Bank',
      type: 'bank',
      description: 'HNB PayGate for secure online transactions',
      processingTime: '1-3 minutes',
      fees: 'LKR 28 per transaction',
      isAvailable: true,
      supportedFeatures: ['HNB Mobile', 'Internet Banking', 'SMS Banking', 'Card Payments'],
      maxAmount: 200000,
      minAmount: 100
    },
    {
      id: 'dfcc',
      name: 'DFCC Bank',
      type: 'bank',
      description: 'DFCC online payment gateway with enhanced security features',
      processingTime: '1-3 minutes',
      fees: 'LKR 32 per transaction',
      isAvailable: true,
      supportedFeatures: ['Online Banking', 'Mobile Banking', 'Card Payments', 'Standing Orders'],
      maxAmount: 150000,
      minAmount: 100
    },
    {
      id: 'ezcash',
      name: 'eZ Cash',
      type: 'mobile',
      description: 'Leading mobile wallet service in Sri Lanka',
      processingTime: 'Instant',
      fees: 'LKR 15 + 1%',
      isAvailable: true,
      supportedFeatures: ['QR Payments', 'Mobile Top-up', 'Bill Payments', 'P2P Transfers'],
      maxAmount: 100000,
      minAmount: 10
    },
    {
      id: 'mcash',
      name: 'mCash',
      type: 'mobile',
      description: 'Dialog mCash mobile payment platform',
      processingTime: 'Instant',
      fees: 'LKR 12 + 0.75%',
      isAvailable: true,
      supportedFeatures: ['QR Code', 'NFC Payments', 'Merchant Payments', 'Utility Bills'],
      maxAmount: 75000,
      minAmount: 10
    }
  ];

  const customerTypes = [
    { value: 'individual', label: 'Individual Researcher' },
    { value: 'institutional', label: 'Educational Institution' },
    { value: 'government', label: 'Government Agency' },
    { value: 'commercial', label: 'Commercial Entity' }
  ];

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleCustomerTypeChange = (type) => {
    setPaymentDetails(prev => ({ ...prev, customerType: type }));
  };

  const handleProceedToPayment = async () => {
    if (!selectedPaymentMethod) return;

    setIsProcessing(true);
    setCurrentStep('details');

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
    }, 1000);
  };

  const handleSubmitPayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setCurrentStep('confirmation');
      setIsProcessing(false);
    }, 3000);
  };

  const handleBackToMarketplace = () => {
    window.location.href = '/nara-digital-marketplace';
  };

  const getStepIcon = (step) => {
    switch (step) {
      case 'method': return 'CreditCard';
      case 'details': return 'FileText';
      case 'confirmation': return 'CheckCircle';
      default: return 'Circle';
    }
  };

  const isStepComplete = (step) => {
    switch (step) {
      case 'method': return selectedPaymentMethod !== null;
      case 'details': return currentStep === 'confirmation';
      case 'confirmation': return false;
      default: return false;
    }
  };

  const isStepActive = (step) => {
    return currentStep === step;
  };

  return (
    <StitchWrapper>
      <div className="min-h-screen text-white relative z-10">
        {/* Header / Hero */}
        <header className="relative bg-white/5 border-b border-white/10 backdrop-blur-md z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Left - Branding & Nav */}
              <div className="w-full lg:w-auto flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleBackToMarketplace}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
                  >
                    <Icon name="ArrowLeft" size={24} />
                  </button>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-900/20">
                      <Icon name="ShieldCheck" className="text-white" size={24} />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white tracking-tight">Payment Gateway Hub</h1>
                      <p className="text-sm text-cyan-300 font-medium tracking-wide uppercase">Secure Sri Lankan Transaction Portal</p>
                    </div>
                  </div>
                </div>

                {/* Unique Hero Placeholder Area (Small version for functional page) */}
                <div className="hidden lg:flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 w-full max-w-lg">
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                    <Icon name="Image" size={20} className="text-white/30" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1">Upload Portal Banner</p>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-0 bg-cyan-500" />
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs h-8">Upload</Button>
                </div>
              </div>

              {/* Right - Order Total */}
              <div className="flex items-center gap-6 bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-md">
                <div className="text-right">
                  <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Total Payable</div>
                  <div className="text-2xl font-bold text-emerald-400 font-mono">
                    {orderData?.currency} {orderData?.total?.toLocaleString()}
                  </div>
                </div>
                <div className="w-1.5 h-12 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Progress Steps */}
        <div className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-4 sm:space-x-8">
                {['method', 'details', 'confirmation']?.map((step, index) => (
                  <div key={step} className="flex items-center">
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-300",
                      isStepActive(step)
                        ? "border-cyan-500 bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                        : isStepComplete(step)
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-white/20 bg-white/5 text-white/30"
                    )}>
                      <Icon
                        name={isStepComplete(step) ? "Check" : getStepIcon(step)}
                        size={16}
                      />
                    </div>

                    <div className="ml-3 hidden sm:block">
                      <div className={cn(
                        "text-sm font-bold tracking-wide",
                        isStepActive(step) ? "text-cyan-400" :
                          isStepComplete(step) ? "text-emerald-400" : "text-slate-500"
                      )}>
                        {step?.charAt(0)?.toUpperCase() + step?.slice(1)}
                      </div>
                    </div>

                    {index < 2 && (
                      <div className={cn(
                        "w-8 sm:w-16 h-0.5 ml-4 rounded-full",
                        isStepComplete(step) ? "bg-emerald-500" : "bg-white/10"
                      )} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Content - Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {currentStep === 'method' && (
                <>
                  {/* Payment Method Selection */}
                  <section>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        Choose Payment Method
                      </h2>
                      <p className="text-slate-400">
                        Select your preferred Sri Lankan payment gateway for secure transaction processing
                      </p>
                    </div>

                    {/* Customer Type Selection */}
                    <div className="mb-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Icon name="User" size={18} className="text-cyan-400" />
                        Customer Type
                      </h3>

                      <Select
                        value={paymentDetails?.customerType}
                        onChange={handleCustomerTypeChange}
                        options={customerTypes}
                        className="max-w-md bg-white/5 border-white/10 text-white"
                      />

                      <p className="text-sm text-slate-400 mt-2">
                        Different pricing and features available based on customer type
                      </p>
                    </div>

                    {/* Payment Methods Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {paymentMethods?.map((method) => (
                        <PaymentMethodCard
                          key={method?.id}
                          method={method}
                          onSelect={handlePaymentMethodSelect}
                          isSelected={selectedPaymentMethod?.id === method?.id}
                          isLoading={isProcessing && selectedPaymentMethod?.id === method?.id}
                        />
                      ))}
                    </div>

                    {/* Continue Button */}
                    {selectedPaymentMethod && (
                      <div className="mt-8 flex justify-end">
                        <Button
                          size="lg"
                          onClick={handleProceedToPayment}
                          disabled={isProcessing}
                          iconName="ArrowRight"
                          iconPosition="right"
                          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0 min-w-[200px] shadow-lg shadow-cyan-900/20"
                        >
                          {isProcessing ? "Loading..." : "Continue to Payment"}
                        </Button>
                      </div>
                    )}
                  </section>
                </>
              )}

              {currentStep === 'details' && selectedPaymentMethod && (
                <>
                  {/* Payment Details Form */}
                  <section className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        Payment Details
                      </h2>
                      <p className="text-slate-400">
                        Complete your payment using <span className="text-cyan-400 font-semibold">{selectedPaymentMethod?.name}</span>
                      </p>
                    </div>

                    {/* Selected Payment Method Info */}
                    <div className="mb-8 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                          <Icon name={selectedPaymentMethod?.type === 'government' ? 'Building' : 'CreditCard'}
                            size={24} className="text-cyan-400" />
                        </div>
                        <div>
                          <div className="font-bold text-white">
                            {selectedPaymentMethod?.name}
                          </div>
                          <div className="text-sm text-cyan-200/80 mt-1">
                            Processing Time: {selectedPaymentMethod?.processingTime} •
                            Fee: {selectedPaymentMethod?.fees}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="Email Address"
                          type="email"
                          required
                          value={paymentDetails?.email}
                          onChange={(e) => setPaymentDetails(prev => ({ ...prev, email: e?.target?.value }))}
                          placeholder="your.email@example.com"
                          className="bg-black/20 border-white/10 text-white placeholder-white/30"
                        />

                        <Input
                          label="Mobile Number"
                          type="tel"
                          required
                          value={paymentDetails?.phone}
                          onChange={(e) => setPaymentDetails(prev => ({ ...prev, phone: e?.target?.value }))}
                          placeholder="+94 77 123 4567"
                          className="bg-black/20 border-white/10 text-white placeholder-white/30"
                        />
                      </div>

                      {paymentDetails?.customerType !== 'individual' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input
                            label="Organization Name"
                            required
                            value={paymentDetails?.organizationName}
                            onChange={(e) => setPaymentDetails(prev => ({ ...prev, organizationName: e?.target?.value }))}
                            placeholder="University of Colombo"
                            className="bg-black/20 border-white/10 text-white placeholder-white/30"
                          />

                          <Input
                            label="Tax ID / VAT Number"
                            value={paymentDetails?.taxId}
                            onChange={(e) => setPaymentDetails(prev => ({ ...prev, taxId: e?.target?.value }))}
                            placeholder="134-556-789"
                            className="bg-black/20 border-white/10 text-white placeholder-white/30"
                          />
                        </div>
                      )}
                    </div>

                    {/* Terms and Conditions */}
                    <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="terms"
                          className="mt-1 h-4 w-4 bg-white/10 border-white/20 text-cyan-500 rounded focus:ring-cyan-500 focus:ring-offset-0"
                        />
                        <label htmlFor="terms" className="text-sm text-slate-300">
                          I agree to the{' '}
                          <a href="#" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2">
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a href="#" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2">
                            Privacy Policy
                          </a>
                          . I understand that digital products are non-refundable after download.
                        </label>
                      </div>
                    </div>

                    {/* Payment Button */}
                    <div className="mt-8 flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep('method')}
                        disabled={isProcessing}
                        iconName="ArrowLeft"
                        className="border-white/10 text-white hover:bg-white/10"
                      >
                        Back
                      </Button>

                      <Button
                        size="lg"
                        onClick={handleSubmitPayment}
                        disabled={isProcessing}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white border-0 shadow-lg shadow-emerald-900/20"
                        iconName={isProcessing ? "Loader" : "Lock"}
                      >
                        {isProcessing ? "Processing Payment..." : `Pay ${orderData?.currency} ${orderData?.total?.toLocaleString()}`}
                      </Button>
                    </div>
                  </section>
                </>
              )}

              {currentStep === 'confirmation' && (
                <>
                  {/* Payment Confirmation */}
                  <section className="text-center space-y-8 py-8">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
                      <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-green-500/10 rounded-full border border-emerald-500/30 flex items-center justify-center mx-auto">
                        <Icon name="CheckCircle" size={48} className="text-emerald-400" />
                      </div>
                    </div>

                    <div>
                      <h2 className="text-4xl font-bold text-white mb-3">
                        Payment Successful!
                      </h2>
                      <p className="text-lg text-slate-300">
                        Your order has been confirmed and is being processed
                      </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 text-left max-w-md mx-auto relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>
                      <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
                        <Icon name="Receipt" size={18} className="text-emerald-400" />
                        Transaction Details
                      </h3>

                      <div className="space-y-4 text-sm">
                        <div className="flex justify-between pb-3 border-b border-white/5">
                          <span className="text-slate-400">Order Number</span>
                          <span className="font-mono text-white">{orderData?.orderNumber}</span>
                        </div>
                        <div className="flex justify-between pb-3 border-b border-white/5">
                          <span className="text-slate-400">Payment Method</span>
                          <span className="font-medium text-white">{selectedPaymentMethod?.name}</span>
                        </div>
                        <div className="flex justify-between pb-3 border-b border-white/5">
                          <span className="text-slate-400">Amount Paid</span>
                          <span className="font-bold text-emerald-400 text-lg">
                            {orderData?.currency} {orderData?.total?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Transaction Date</span>
                          <span className="font-medium text-white">
                            {new Date()?.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                      <Button
                        variant="outline"
                        iconName="Download"
                        className="border-white/10 text-white hover:bg-white/10"
                      >
                        Download Receipt
                      </Button>

                      <Button
                        onClick={handleBackToMarketplace}
                        iconName="ArrowLeft"
                        className="bg-white/10 hover:bg-white/20 text-white border-0"
                      >
                        Back to Marketplace
                      </Button>
                    </div>

                    <div className="text-sm text-slate-500 max-w-sm mx-auto">
                      Digital products will be available in your account within 5 minutes.
                      Check your email for download instructions.
                    </div>
                  </section>
                </>
              )}
            </div>

            {/* Order Summary - Right Column */}
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sticky top-24">
                <OrderSummary
                  order={orderData}
                  onEdit={currentStep === 'method' ? handleBackToMarketplace : undefined}
                  isProcessing={isProcessing}
                />
              </div>

              <SecurityBadges className="" />
            </div>
          </div>
        </div>
      </div>
    </StitchWrapper>
  );
};

export default PaymentGatewayHub;