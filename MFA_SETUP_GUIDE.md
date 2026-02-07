# Multi-Factor Authentication (MFA) Setup Guide for NARA Admins

## 🚨 CRITICAL SECURITY REQUIREMENT

All NARA admin accounts MUST enable Multi-Factor Authentication (MFA) as per Sri Lankan Government IT Security Policy.

---

## Step 1: Enable MFA in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `nara-web-73384`
3. Navigate to **Authentication** → **Sign-in method**
4. Click **Multi-factor authentication** tab
5. Click **Enable** for SMS and/or TOTP

---

## Step 2: Require MFA for Admin Accounts

Add this code to admin login flow:

```javascript
import { multiFactor, PhoneAuthProvider, PhoneMultiFactorGenerator } from 'firebase/auth';

// After admin signs in, check MFA status
const user = auth.currentUser;
const enrolledFactors = multiFactor(user).enrolledFactors;

if (enrolledFactors.length === 0) {
  // Force MFA enrollment for admins
  alert('Admin accounts must enable MFA. You will be enrolled now.');
  // Redirect to MFA enrollment flow
}
```

---

## Step 3: Test MFA

1. Sign in as admin
2. Enter phone number for SMS verification
3. Enter code received via SMS
4. Verify login requires both password AND MFA code

---

## Security Contact

**IT Security Officer:** security@nara.ac.lk
