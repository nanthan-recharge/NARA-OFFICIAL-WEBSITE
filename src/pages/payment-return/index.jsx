import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';
import { verifyPayment } from '../../services/paymentService';
import { useCart } from '../../contexts/CartContext';

const PaymentReturnPage = () => {
  const { t } = useTranslation(['marketplace', 'common']);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  
  const [status, setStatus] = useState('verifying'); // verifying, success, failed
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      try {
        const paymentData = {
          order_id: searchParams.get('order_id'),
          payment_id: searchParams.get('payment_id'),
          status: searchParams.get('status'),
          hash: searchParams.get('hash'),
          message: searchParams.get('message')
        };

        if (!paymentData.order_id) {
          setStatus('failed');
          setMessage('Invalid payment data');
          return;
        }

        setOrderId(paymentData.order_id);

        const result = await verifyPayment(paymentData.order_id, paymentData);

        if (result.success) {
          setStatus('success');
          setMessage(t('marketplace:checkout.paymentSuccess'));
          clearCart();
        } else {
          setStatus('failed');
          setMessage(result.message || t('marketplace:checkout.paymentFailed'));
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
        setMessage('Payment verification failed. Please contact support.');
      }
    };

    verifyPaymentStatus();
  }, [searchParams, clearCart, t]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {status === 'verifying' && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icons.Loader className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Payment
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your payment...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icons.CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            {orderId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                <p className="font-mono font-bold text-gray-900">{orderId}</p>
              </div>
            )}
            <div className="space-y-3">
              <button
                onClick={() => navigate('/my-orders')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                View My Orders
              </button>
              <button
                onClick={() => navigate('/nara-digital-marketplace')}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icons.XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/contact-us')}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Icons.MessageCircle className="w-5 h-5" />
                Contact Support
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentReturnPage;
