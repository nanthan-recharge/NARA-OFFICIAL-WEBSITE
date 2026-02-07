import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import { initiatePayment } from '../../services/paymentService';

const CheckoutPage = () => {
  const { t } = useTranslation(['marketplace', 'common']);
  const navigate = useNavigate();
  const { user } = useFirebaseAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();
  
  const [step, setStep] = useState(1); // 1: Billing, 2: Payment, 3: Confirm
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [billingInfo, setBillingInfo] = useState({
    fullName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    organization: '',
    country: 'Sri Lanka',
    address: '',
    city: '',
    zipCode: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('GOVEPAY');

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    }
    if (cartItems.length === 0) {
      navigate('/nara-digital-marketplace');
    }
  }, [user, cartItems, navigate]);

  const subtotal = getCartTotal();
  const tax = subtotal * 0.05; // 5% VAT
  const total = subtotal + tax;

  const handleBillingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        items: cartItems.map(item => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity
        })),
        billingInfo,
        subtotal,
        tax,
        total,
        currency: 'LKR'
      };

      const paymentResult = await initiatePayment(orderData, paymentMethod);

      if (paymentResult.success) {
        if (paymentMethod === 'BANK_TRANSFER') {
          // Show bank transfer instructions
          setStep(3);
        } else {
          // Redirect to payment gateway
          redirectToPaymentGateway(paymentResult);
        }
      }
    } catch (err) {
      setError(err.message || 'Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  const redirectToPaymentGateway = (paymentResult) => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = paymentResult.redirectUrl;

    Object.keys(paymentResult.paymentData).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = paymentResult.paymentData[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/nara-digital-marketplace')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <Icons.ArrowLeft className="w-5 h-5" />
            {t('common:back')}
          </button>
          <h1 className="text-4xl font-bold text-gray-900">
            {t('marketplace:checkout.title')}
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {[
              { num: 1, label: t('marketplace:checkout.billingInfo'), icon: Icons.User },
              { num: 2, label: t('marketplace:checkout.paymentMethod'), icon: Icons.CreditCard },
              { num: 3, label: t('marketplace:checkout.orderSummary'), icon: Icons.CheckCircle }
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className={`flex items-center gap-3 ${step >= s.num ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= s.num ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}>
                    {step > s.num ? <Icons.Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  <span className="font-medium hidden md:block">{s.label}</span>
                </div>
                {idx < 2 && <div className={`w-24 h-1 ${step > s.num ? 'bg-blue-600' : 'bg-gray-200'}`}></div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Billing Information */}
              {step === 1 && (
                <motion.div
                  key="billing"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl shadow-sm p-8"
                >
                  <h2 className="text-2xl font-bold mb-6">{t('marketplace:checkout.billingInfo')}</h2>
                  <form onSubmit={handleBillingSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('marketplace:checkout.fields.fullName')} *
                        </label>
                        <input
                          type="text"
                          required
                          value={billingInfo.fullName}
                          onChange={(e) => setBillingInfo({ ...billingInfo, fullName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('marketplace:checkout.fields.email')} *
                        </label>
                        <input
                          type="email"
                          required
                          value={billingInfo.email}
                          onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('marketplace:checkout.fields.phone')} *
                        </label>
                        <input
                          type="tel"
                          required
                          value={billingInfo.phone}
                          onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+94 XX XXX XXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('marketplace:checkout.fields.organization')}
                        </label>
                        <input
                          type="text"
                          value={billingInfo.organization}
                          onChange={(e) => setBillingInfo({ ...billingInfo, organization: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('marketplace:checkout.fields.address')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={billingInfo.address}
                        onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('marketplace:checkout.fields.city')} *
                        </label>
                        <input
                          type="text"
                          required
                          value={billingInfo.city}
                          onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('marketplace:checkout.fields.zipCode')}
                        </label>
                        <input
                          type="text"
                          value={billingInfo.zipCode}
                          onChange={(e) => setBillingInfo({ ...billingInfo, zipCode: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('marketplace:checkout.fields.country')} *
                        </label>
                        <select
                          required
                          value={billingInfo.country}
                          onChange={(e) => setBillingInfo({ ...billingInfo, country: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Sri Lanka">Sri Lanka</option>
                          <option value="India">India</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      {t('common:continue')}
                      <Icons.ArrowRight className="w-5 h-5" />
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Step 2: Payment Method */}
              {step === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl shadow-sm p-8"
                >
                  <h2 className="text-2xl font-bold mb-6">{t('marketplace:checkout.paymentMethod')}</h2>
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    {/* GovePay */}
                    <label className={`block p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'GOVEPAY' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="GOVEPAY"
                        checked={paymentMethod === 'GOVEPAY'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                          <Icons.Building className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">GovePay</h3>
                          <p className="text-sm text-gray-600">Sri Lankan Government Payment Gateway</p>
                          <p className="text-xs text-gray-500 mt-1">Visa, Master, Amex, Bank Transfer</p>
                        </div>
                        {paymentMethod === 'GOVEPAY' && <Icons.CheckCircle className="w-6 h-6 text-blue-600" />}
                      </div>
                    </label>

                    {/* PayHere */}
                    <label className={`block p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'PAYHERE' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="PAYHERE"
                        checked={paymentMethod === 'PAYHERE'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Icons.CreditCard className="w-8 h-8 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">PayHere</h3>
                          <p className="text-sm text-gray-600">Online Payment Gateway</p>
                          <p className="text-xs text-gray-500 mt-1">Cards, eZcash, mCash</p>
                        </div>
                        {paymentMethod === 'PAYHERE' && <Icons.CheckCircle className="w-6 h-6 text-blue-600" />}
                      </div>
                    </label>

                    {/* Bank Transfer */}
                    <label className={`block p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'BANK_TRANSFER' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="BANK_TRANSFER"
                        checked={paymentMethod === 'BANK_TRANSFER'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icons.Landmark className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">Direct Bank Transfer</h3>
                          <p className="text-sm text-gray-600">Transfer to NARA Bank Account</p>
                          <p className="text-xs text-gray-500 mt-1">Manual verification required</p>
                        </div>
                        {paymentMethod === 'BANK_TRANSFER' && <Icons.CheckCircle className="w-6 h-6 text-blue-600" />}
                      </div>
                    </label>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
                        <Icons.AlertCircle className="w-5 h-5" />
                        {error}
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        {t('common:back')}
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <Icons.Loader className="w-5 h-5 animate-spin" />
                            {t('marketplace:checkout.processingPayment')}
                          </>
                        ) : (
                          <>
                            {t('marketplace:checkout.placeOrder')}
                            <Icons.Lock className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-4">{t('marketplace:checkout.orderSummary')}</h3>
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icons.Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-blue-600">
                        LKR {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('marketplace:cart.subtotal')}</span>
                  <span>LKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t('marketplace:cart.tax')} (5%)</span>
                  <span>LKR {tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>{t('marketplace:cart.total')}</span>
                  <span className="text-blue-600">LKR {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
