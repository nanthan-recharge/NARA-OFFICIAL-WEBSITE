# Google Maps API Setup Guide

## 🗺️ **Why Google Maps Failed to Load**

The application uses Google Maps to display Sri Lanka's Exclusive Economic Zone (EEZ). The map component requires a valid Google Maps API key to function.

---

## 🔑 **Get Your Google Maps API Key**

### **Step 1: Create a Google Cloud Project**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Name it something like "NARA Digital Ocean Platform"

### **Step 2: Enable Maps JavaScript API**
1. In the Google Cloud Console, navigate to **APIs & Services > Library**
2. Search for "Maps JavaScript API"
3. Click **Enable**

### **Step 3: Create API Credentials**
1. Go to **APIs & Services > Credentials**
2. Click **+ CREATE CREDENTIALS**
3. Select **API Key**
4. Copy the generated API key

### **Step 4: (Optional) Restrict the API Key**
For security, restrict your API key:
1. Click on your API key to edit it
2. Under **Application restrictions**, select:
   - **HTTP referrers (web sites)**
   - Add: `https://nara-web-73384.web.app/*`
   - Add: `http://localhost:*` (for local development)
3. Under **API restrictions**, select:
   - **Restrict key**
   - Select: **Maps JavaScript API**
4. Click **Save**

---

## ⚙️ **Configure Your Application**

### **For Local Development:**

1. Create a `.env` file in the project root:
   ```bash
   cd /Users/nanthan/Desktop/nara\ digital/nara_digital_ocean
   touch .env
   ```

2. Add your API key to `.env`:
   ```env
   VITE_GOOGLE_MAPS_KEY=YOUR_API_KEY_HERE
   ```

3. Restart your development server:
   ```bash
   npm run start
   ```

### **For Production (Firebase Hosting):**

Add the environment variable to your build process or use Firebase Config.

**Option A: Set before build**
```bash
export VITE_GOOGLE_MAPS_KEY=YOUR_API_KEY_HERE
npm run build
npx firebase deploy --only hosting
```

**Option B: Add to package.json scripts**
```json
{
  "scripts": {
    "build:prod": "VITE_GOOGLE_MAPS_KEY=YOUR_KEY npm run build"
  }
}
```

---

## 🧪 **Test the Map**

After configuring the API key:

1. Visit any page with the EEZ map
2. You should see:
   - ✅ Animated colorful border around Sri Lanka's waters
   - ✅ Research station markers
   - ✅ No error messages

---

## 🆓 **Free Tier Information**

Google Maps offers a generous free tier:
- **$200 free credit per month**
- Maps JavaScript API: $7 per 1,000 loads
- First **28,571 map loads per month are FREE**

For a government website with moderate traffic, you'll likely stay within the free tier.

---

## 🚨 **Troubleshooting**

### **"Map visualization unavailable"**
- ❌ API key not set in `.env`
- ✅ Create `.env` file and add `VITE_GOOGLE_MAPS_KEY`

### **"Failed to load Google Maps API"**
- ❌ Invalid API key
- ✅ Check your key in Google Cloud Console
- ✅ Ensure Maps JavaScript API is enabled

### **Map loads but shows "For development purposes only"**
- ❌ API key has billing restrictions
- ✅ Enable billing in Google Cloud Console (you won't be charged if you stay within free tier)

### **Console errors about API restrictions**
- ❌ API key is restricted to wrong domains
- ✅ Add your domain to HTTP referrers in API key settings

---

## 📞 **Need Help?**

Contact: tech-support@nara.ac.lk

---

## 🔒 **Security Best Practices**

1. **Never commit `.env` to git** (it's already gitignored)
2. **Restrict API key to your domains only**
3. **Monitor usage in Google Cloud Console**
4. **Set up billing alerts** to avoid unexpected charges
5. **Rotate keys periodically**

---

**Last Updated:** January 12, 2025  
**Status:** Configuration Required
