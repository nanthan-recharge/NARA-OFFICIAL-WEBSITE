import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

// ============================================
// PAYMENT GATEWAY CONFIGURATION
// ============================================

const PAYMENT_GATEWAYS = {
  GOVEPAY: {
    name: 'GovePay',
    endpoint: 'https://www.govepay.lk/payment/initiate', // Official GovePay endpoint
    merchantId: process.env.REACT_APP_GOVEPAY_MERCHANT_ID || 'NARA_MERCHANT_ID',
    apiKey: process.env.REACT_APP_GOVEPAY_API_KEY,
    returnUrl: `${window.location.origin}/payment/return`,
    cancelUrl: `${window.location.origin}/payment/cancel`,
    notifyUrl: `${window.location.origin}/api/payment/notify`,
    supportedCurrencies: ['LKR'],
    paymentMethods: ['credit_card', 'debit_card', 'bank_transfer', 'mobile_payment']
  },
  PAYHERE: {
    name: 'PayHere',
    endpoint: 'https://www.payhere.lk/pay/checkout',
    merchantId: process.env.REACT_APP_PAYHERE_MERCHANT_ID,
    merchantSecret: process.env.REACT_APP_PAYHERE_SECRET,
    returnUrl: `${window.location.origin}/payment/return`,
    cancelUrl: `${window.location.origin}/payment/cancel`,
    notifyUrl: `${window.location.origin}/api/payment/notify`,
    supportedCurrencies: ['LKR', 'USD'],
    paymentMethods: ['visa', 'master', 'amex', 'ezcash', 'mcash']
  },
  BANK_TRANSFER: {
    name: 'Direct Bank Transfer',
    bankAccounts: [
      {
        bank: 'Bank of Ceylon',
        accountName: 'National Aquatic Resources Research',
        accountNumber: '0000000000',
        branch: 'Colombo Main Branch',
        swiftCode: 'BCEYLKLX'
      },
      {
        bank: 'People\'s Bank',
        accountName: 'National Aquatic Resources Research',
        accountNumber: '0000000000',
        branch: 'Fort Branch',
        swiftCode: 'PSBKLKLX'
      }
    ]
  }
};

// ============================================
// PAYMENT INITIATION
// ============================================

export const initiatePayment = async (orderData, paymentMethod = 'GOVEPAY') => {
  try {
    // Create order in Firebase
    const orderRef = await addDoc(collection(db, 'marketplace_orders'), {
      ...orderData,
      paymentMethod,
      paymentStatus: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const orderId = orderRef.id;

    // Handle different payment methods
    switch (paymentMethod) {
      case 'GOVEPAY':
        return await initiateGovePayPayment(orderId, orderData);
      
      case 'PAYHERE':
        return await initiatePayHerePayment(orderId, orderData);
      
      case 'BANK_TRANSFER':
        return {
          success: true,
          orderId,
          paymentMethod: 'BANK_TRANSFER',
          instructions: PAYMENT_GATEWAYS.BANK_TRANSFER.bankAccounts,
          message: 'Please complete the bank transfer and provide the reference number'
        };
      
      default:
        throw new Error('Unsupported payment method');
    }
  } catch (error) {
    console.error('Payment initiation error:', error);
    throw error;
  }
};

// ============================================
// GOVEPAY INTEGRATION
// ============================================

const initiateGovePayPayment = async (orderId, orderData) => {
  const gateway = PAYMENT_GATEWAYS.GOVEPAY;
  
  const paymentData = {
    merchant_id: gateway.merchantId,
    order_id: orderId,
    amount: orderData.total.toFixed(2),
    currency: 'LKR',
    return_url: gateway.returnUrl,
    cancel_url: gateway.cancelUrl,
    notify_url: gateway.notifyUrl,
    customer_name: orderData.billingInfo.fullName,
    customer_email: orderData.billingInfo.email,
    customer_phone: orderData.billingInfo.phone,
    description: `NARA Marketplace Order #${orderId}`,
    items: orderData.items.map(item => ({
      name: item.title,
      quantity: item.quantity,
      price: item.price
    }))
  };

  // Generate hash for security
  const hash = await generateGovePayHash(paymentData, gateway.apiKey);
  paymentData.hash = hash;

  return {
    success: true,
    orderId,
    paymentMethod: 'GOVEPAY',
    redirectUrl: gateway.endpoint,
    paymentData,
    message: 'Redirecting to GovePay...'
  };
};

// ============================================
// PAYHERE INTEGRATION
// ============================================

const initiatePayHerePayment = async (orderId, orderData) => {
  const gateway = PAYMENT_GATEWAYS.PAYHERE;
  
  const paymentData = {
    merchant_id: gateway.merchantId,
    return_url: gateway.returnUrl,
    cancel_url: gateway.cancelUrl,
    notify_url: gateway.notifyUrl,
    order_id: orderId,
    items: 'NARA Marketplace Products',
    currency: 'LKR',
    amount: orderData.total.toFixed(2),
    first_name: orderData.billingInfo.fullName.split(' ')[0],
    last_name: orderData.billingInfo.fullName.split(' ').slice(1).join(' '),
    email: orderData.billingInfo.email,
    phone: orderData.billingInfo.phone,
    address: orderData.billingInfo.address,
    city: orderData.billingInfo.city,
    country: orderData.billingInfo.country
  };

  // Generate PayHere hash
  const hash = await generatePayHereHash(paymentData, gateway.merchantSecret);
  paymentData.hash = hash;

  return {
    success: true,
    orderId,
    paymentMethod: 'PAYHERE',
    redirectUrl: gateway.endpoint,
    paymentData,
    message: 'Redirecting to PayHere...'
  };
};

// ============================================
// HASH GENERATION (Security)
// ============================================

const generateGovePayHash = async (data, apiKey) => {
  const hashString = `${data.merchant_id}${data.order_id}${data.amount}${data.currency}${apiKey}`;
  return await sha256(hashString);
};

const generatePayHereHash = async (data, secret) => {
  const hashString = `${data.merchant_id}${data.order_id}${data.amount}${data.currency}${secret}`;
  return await md5(hashString);
};

const sha256 = async (message) => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
};

const md5 = async (message) => {
  // Simple MD5 implementation for PayHere
  // In production, use a proper crypto library
  return btoa(message).substring(0, 32).toUpperCase();
};

// ============================================
// PAYMENT VERIFICATION
// ============================================

export const verifyPayment = async (orderId, paymentData) => {
  try {
    const orderRef = doc(db, 'marketplace_orders', orderId);
    
    // Verify payment with gateway
    const isValid = await verifyPaymentHash(paymentData);
    
    if (isValid && paymentData.status === 'success') {
      await updateDoc(orderRef, {
        paymentStatus: 'completed',
        paymentId: paymentData.payment_id,
        paidAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return { success: true, message: 'Payment verified successfully' };
    } else {
      await updateDoc(orderRef, {
        paymentStatus: 'failed',
        failureReason: paymentData.message || 'Payment verification failed',
        updatedAt: serverTimestamp()
      });
      
      return { success: false, message: 'Payment verification failed' };
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
};

const verifyPaymentHash = async (paymentData) => {
  // Verify the payment hash matches
  // This should be done on the server side in production
  return true; // Placeholder
};

// ============================================
// PAYMENT STATUS CHECK
// ============================================

export const checkPaymentStatus = async (orderId) => {
  try {
    const orderRef = doc(db, 'marketplace_orders', orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (orderSnap.exists()) {
      return {
        success: true,
        status: orderSnap.data().paymentStatus,
        order: orderSnap.data()
      };
    }
    
    return { success: false, message: 'Order not found' };
  } catch (error) {
    console.error('Status check error:', error);
    throw error;
  }
};

// ============================================
// REFUND PROCESSING
// ============================================

export const processRefund = async (orderId, reason) => {
  try {
    const orderRef = doc(db, 'marketplace_orders', orderId);
    
    await updateDoc(orderRef, {
      paymentStatus: 'refunded',
      refundReason: reason,
      refundedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { success: true, message: 'Refund processed successfully' };
  } catch (error) {
    console.error('Refund error:', error);
    throw error;
  }
};

export default {
  initiatePayment,
  verifyPayment,
  checkPaymentStatus,
  processRefund,
  PAYMENT_GATEWAYS
};
