# Payment Gateway Setup Guide

This document explains how to configure payment gateways for the NARA Digital Marketplace.

## Supported Payment Gateways

### 1. **GovePay** (Sri Lankan Government Payment Gateway)
- **Official Website:** https://www.govepay.lk
- **Primary gateway for government transactions**
- **Supports:** Credit Cards, Debit Cards, Bank Transfers, Mobile Payments

### 2. **PayHere** (Popular Sri Lankan Payment Gateway)
- **Official Website:** https://www.payhere.lk
- **Widely used for online payments**
- **Supports:** Visa, Master, Amex, eZcash, mCash

### 3. **Direct Bank Transfer**
- Manual bank transfer to NARA accounts
- Requires manual verification

---

## Environment Variables Setup

Create a `.env` file in the project root with the following variables:

```bash
# ============================================
# GOVEPAY CONFIGURATION
# ============================================
REACT_APP_GOVEPAY_MERCHANT_ID=your_govepay_merchant_id
REACT_APP_GOVEPAY_API_KEY=your_govepay_api_key

# ============================================
# PAYHERE CONFIGURATION
# ============================================
REACT_APP_PAYHERE_MERCHANT_ID=your_payhere_merchant_id
REACT_APP_PAYHERE_SECRET=your_payhere_secret_key

# ============================================
# FIREBASE CONFIGURATION (if not already set)
# ============================================
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
```

---

## GovePay Setup Instructions

### Step 1: Register as Merchant
1. Visit https://www.govepay.lk
2. Click "Register as Merchant"
3. Fill in organization details (NARA)
4. Submit required documents:
   - Business Registration Certificate
   - Tax Registration (TIN)
   - Bank Account Details
   - Director/Authorized Signatory ID

### Step 2: Get Credentials
After approval, you'll receive:
- **Merchant ID**: Your unique merchant identifier
- **API Key**: Secret key for secure transactions
- **Test Credentials**: For development/testing

### Step 3: Configure Callback URLs
In GovePay dashboard, set:
- **Return URL**: `https://nara-web-73384.web.app/payment/return`
- **Cancel URL**: `https://nara-web-73384.web.app/payment/cancel`
- **Notify URL**: `https://nara-web-73384.web.app/api/payment/notify`

### Step 4: Test Integration
1. Use test credentials first
2. Test transactions:
   - Success scenario
   - Failed payment
   - Cancelled payment
3. Switch to live credentials after testing

---

## PayHere Setup Instructions

### Step 1: Create Account
1. Visit https://www.payhere.lk
2. Sign up for Business Account
3. Complete KYC verification

### Step 2: Get API Credentials
1. Login to PayHere dashboard
2. Go to Settings → Domains & Credentials
3. Copy:
   - Merchant ID
   - Merchant Secret

### Step 3: Configure Settings
1. Add your domain: `nara-web-73384.web.app`
2. Set notification URL
3. Enable required payment methods

### Step 4: Test with Sandbox
1. Use sandbox credentials for testing
2. Test card numbers provided by PayHere
3. Switch to live mode after verification

---

## Implementation Details

### Payment Flow

```
1. User adds items to cart
2. Goes to checkout (/checkout)
3. Enters billing information
4. Selects payment method (GovePay/PayHere/Bank Transfer)
5. Submits order
6. Redirected to payment gateway
7. Completes payment
8. Redirected back to /payment/return
9. Payment verified
10. Order confirmed
```

### Security Features

✅ **Hash Generation**: All payments use SHA-256/MD5 hashing
✅ **Firebase Authentication**: User must be logged in
✅ **Order Tracking**: All orders stored in Firestore
✅ **Payment Verification**: Callback verification with hash matching
✅ **SSL/HTTPS**: All transactions over secure connection

---

## Testing Payment Gateways

### GovePay Test Cards
```
Card Number: 5123 4567 8901 2346
Expiry: 12/25
CVV: 123
3D Secure OTP: 123456
```

### PayHere Test Cards
```
Visa: 4916 3385 0608 2832
Master: 5313 5810 1722 4788
Expiry: Any future date
CVV: Any 3 digits
```

---

## Bank Transfer Setup

Update bank account details in:
`src/services/paymentService.js`

```javascript
BANK_TRANSFER: {
  bankAccounts: [
    {
      bank: 'Bank of Ceylon',
      accountName: 'National Aquatic Resources Research',
      accountNumber: 'YOUR_ACCOUNT_NUMBER',
      branch: 'Colombo Main Branch',
      swiftCode: 'BCEYLKLX'
    }
  ]
}
```

---

## Troubleshooting

### Common Issues

**1. Payment Gateway Not Loading**
- Check if merchant credentials are correct
- Verify domain is whitelisted in gateway dashboard
- Check browser console for errors

**2. Payment Verification Failed**
- Ensure hash generation algorithm matches gateway requirements
- Check notify URL is accessible
- Verify firestore rules allow order updates

**3. Redirect Issues**
- Confirm return URLs match in both code and gateway dashboard
- Check for CORS issues
- Ensure SSL certificate is valid

---

## Production Checklist

Before going live:

- [ ] Replace test credentials with live credentials
- [ ] Test all payment methods
- [ ] Verify SSL certificate
- [ ] Set up payment failure notifications
- [ ] Configure refund process
- [ ] Test on mobile devices
- [ ] Set up monitoring/alerts
- [ ] Document payment reconciliation process
- [ ] Train staff on order management
- [ ] Set up customer support for payment issues

---

## Support Contacts

### GovePay Support
- Email: support@govepay.lk
- Phone: +94 11 XXX XXXX

### PayHere Support
- Email: support@payhere.lk
- Phone: +94 11 232 2228

### NARA IT Support
- Email: it@nara.ac.lk
- Internal Extension: XXXX

---

## License & Compliance

- Ensure PCI DSS compliance for card handling
- Follow Sri Lankan payment regulations
- Maintain transaction logs for auditing
- Implement data protection measures

---

Last Updated: 2025-10-13
Version: 1.0.0
