# Maritime Data Admin Panel - Complete Guide

## 🎯 Access the Admin Panel

**URL:** http://localhost:4028/admin/maritime-data

---

## 📋 Overview

The Maritime Data Admin Panel allows you to:
- ✅ Configure all ocean data API keys
- ✅ Test API connections in real-time
- ✅ Manage IOC sea level monitoring stations
- ✅ Add and edit nautical charts
- ✅ Manage maritime services
- ✅ All data is saved to Firebase automatically

---

## 🔑 Tab 1: API Configuration

### Where to Get API Keys

#### **FREE APIs** (No Keys Required):
1. **IOC Sea Level Monitoring**
   - Already configured and working!
   - No registration needed
   - Access: https://www.ioc-sealevelmonitoring.org/

2. **NOAA Tides & Currents**
   - Already configured and working!
   - No registration needed
   - Access: https://api.tidesandcurrents.noaa.gov/

#### **PREMIUM APIs** (Keys Required):

1. **Stormglass API**
   - Sign up: https://stormglass.io
   - Free tier: 50 requests/day
   - Paid: $50-$500/month
   - Copy your API key and paste in the admin panel

2. **WeatherAPI**
   - Sign up: https://www.weatherapi.com
   - Free tier available
   - Paid: $10-$50/month
   - Copy your API key and paste in the admin panel

3. **Copernicus Marine**
   - Register: https://marine.copernicus.eu
   - FREE with registration
   - Create account → Get username & password
   - Paste both in the admin panel

4. **NASA EarthData**
   - Register: https://urs.earthdata.nasa.gov
   - FREE with registration
   - Generate an API token
   - Paste in the admin panel

5. **Marine Traffic AIS**
   - Contact: https://www.marinetraffic.com
   - Enterprise subscription: €200-€2000/month
   - Get API key from your account

### How to Configure:

1. Open **API Configuration** tab
2. Paste your API keys in the respective fields
3. Click **"Save Configuration"** button
4. Keys are securely saved to Firebase
5. Copy the environment variables shown at the bottom to your `.env` file

---

## 🧪 Tab 2: Live Data Test

### Test Your API Connections:

1. Click on any API card
2. Click **"Test Connection"** button
3. Wait for results:
   - ✅ **Green Check** = Success! API is working
   - ❌ **Red X** = Failed (check your API key)
   - ⏳ **Spinning** = Testing...

4. Check browser console (F12) for detailed responses

### APIs You Can Test:
- IOC Sea Level (Free)
- NOAA Tides (Free)
- Stormglass (Premium)
- WeatherAPI (Premium)

---

## 📡 Tab 3: IOC Stations

### Manage Sea Level Monitoring Stations:

#### Pre-configured Stations:
1. **Colombo**
   - Code: `colo`
   - Coordinates: 6.9271°N, 79.8612°E
   - Status: Active ✅

2. **Trincomalee**
   - Code: `trin`
   - Coordinates: 8.5874°N, 81.2152°E
   - Status: Active ✅

#### Add New Station:
1. Click **"Add New Station"** button
2. Fill in:
   - Station name (e.g., "Galle")
   - Station code (e.g., "gall")
   - Latitude & Longitude
   - Region (e.g., "Southern Province")
   - API Endpoint URL
3. Toggle **"Active"** checkbox
4. Click **"Save Stations"** button
5. Test the connection

#### Edit Existing Station:
1. Find the station card
2. Edit any field directly
3. Click **"Save Stations"** to update
4. Toggle active/inactive as needed

---

## 🗺️ Tab 4: Chart Catalog

### Manage Nautical Charts:

#### Add New Chart:
1. Click **"Add Chart"** button
2. Fill in:
   - **Chart Number**: e.g., "SL-101"
   - **Title**: e.g., "Colombo Harbour Approaches"
   - **Scale**: e.g., "1:50,000"
   - **Category**: Harbour / Coastal / Offshore
   - **Format**: Digital / Bundle / Paper
   - **Price**: in LKR (e.g., 8500)
   - **Edition**: e.g., "Edition 7"
   - **Year**: 2024
   - **Coverage**: e.g., "Western Province · Colombo Port to Kalutara"
   - **Status**: Available / Out of Stock
   - **Stock**: Number of copies

3. Chart is automatically saved to Firebase
4. Appears instantly on the public website

#### Edit Existing Chart:
1. Find the chart in the list
2. Click on any field to edit
3. Changes auto-save
4. Updates website immediately

---

## 💼 Tab 5: Services

### Manage Maritime Services:

#### Add New Service:
1. Click **"Add Service"** button
2. Fill in:
   - **Service Name**: e.g., "Hydrographic Survey"
   - **Icon**: Ship / Map / Database / etc.
   - **Description**: Brief description
   - **Price**: in LKR (e.g., 500000)
   - **Duration**: e.g., "2-4 weeks"
   - **Status**: Available / Limited / Busy
   - **Features**: List key features

3. Service is saved to Firebase
4. Shows on website instantly

#### Edit Service:
1. Find service card
2. Edit fields directly
3. Auto-saves changes

---

## 🔄 How Data Flows to Website

### Firebase Collections Created:

1. **`maritime_config/api_keys`**
   - Stores all API credentials
   - Used by backend services

2. **`maritime_config/ioc_stations`**
   - List of all monitoring stations
   - Coordinates, endpoints, status
   - Frontend reads this for live data

3. **`nautical_charts`**
   - All chart catalog entries
   - Prices, availability, details
   - Public website displays these

4. **`maritime_services`**
   - Service offerings
   - Pricing and descriptions
   - Shows on services page

---

## 🚀 Quick Start Workflow

### For Ocean Data (Free APIs):
1. ✅ No setup needed! IOC & NOAA work immediately
2. Go to **Live Data Test** tab
3. Test IOC Sea Level → Should show ✅
4. Test NOAA Tides → Should show ✅
5. Data now flows to your website!

### For Premium APIs:
1. Sign up at Stormglass.io (get API key)
2. Paste key in **API Configuration** tab
3. Click **Save Configuration**
4. Go to **Live Data Test** tab
5. Test Stormglass → Should show ✅
6. Premium data now available!

### For Nautical Charts:
1. Go to **Chart Catalog** tab
2. Click **Add Chart**
3. Fill in all details
4. Chart instantly appears at:
   - http://localhost:4028/maritime-services-hub
   - Under "Chart Catalog" section

### For Services:
1. Go to **Services** tab
2. Click **Add Service**
3. Fill in details & pricing
4. Service shows at:
   - http://localhost:4028/maritime-services-hub
   - Under "Our Services" section

---

## 🔐 Security Notes

### API Keys:
- ✅ Saved securely in Firebase
- ✅ Password fields hide keys
- ✅ Never exposed to public website
- ✅ Only backend can access

### Best Practices:
1. **Never commit API keys to git**
2. Add keys to `.env` file
3. Add `.env` to `.gitignore`
4. Use environment variables in production

### Environment Variables Template:

```bash
# Add these to your .env file
VITE_STORMGLASS_API_KEY=your_key_here
VITE_WEATHERAPI_KEY=your_key_here
VITE_COPERNICUS_USERNAME=your_username
VITE_COPERNICUS_PASSWORD=your_password
VITE_NASA_EARTHDATA_TOKEN=your_token
VITE_MARINE_TRAFFIC_KEY=your_key_here
```

---

## 📊 Cost Breakdown

### FREE TIER ($0/month):
- ✅ IOC Sea Level (Colombo & Trincomalee)
- ✅ NOAA Tides & Currents
- ✅ Copernicus Marine (with registration)
- ✅ NASA Ocean Color (with registration)
- **Total: $0/month**

### BASIC TIER ($60/month):
- Everything in Free Tier
- + Stormglass Basic ($50/month)
- + WeatherAPI Marine ($10/month)
- **Total: $60/month**

### PROFESSIONAL TIER (~$900/month):
- Everything in Basic Tier
- + Stormglass Pro ($200/month)
- + Marine Traffic API (€200/month ≈ $220)
- + Custom processing ($500/month)
- **Total: ~$900/month**

---

## 🎯 Common Tasks

### Update Sea Level Data Every 6 Minutes:
1. Already automatic!
2. IOC stations update every 6 minutes
3. Frontend fetches from IOC API
4. No configuration needed

### Add New Monitoring Station:
1. **IOC Stations** tab
2. **Add New Station**
3. Enter station code (find at IOC website)
4. Enter coordinates
5. Paste API endpoint
6. **Save Stations**
7. **Test Connection**

### Change Chart Pricing:
1. **Chart Catalog** tab
2. Find the chart
3. Edit **Price** field
4. Auto-saves
5. New price shows on website

### Disable a Service:
1. **Services** tab
2. Find the service
3. Change **Status** to "Busy"
4. Auto-saves
5. Website shows as unavailable

---

## 🐛 Troubleshooting

### API Test Failed:
- ❌ Check API key is correct
- ❌ Check internet connection
- ❌ Verify API subscription is active
- ❌ Check browser console for errors

### Data Not Showing on Website:
- ❌ Refresh the page
- ❌ Check if station is marked "Active"
- ❌ Verify data saved (check Firebase console)
- ❌ Clear browser cache

### Save Button Not Working:
- ❌ Check Firebase connection
- ❌ Verify you're logged in
- ❌ Check browser console for errors
- ❌ Try refreshing the page

---

## 📞 Support

Need help?
- Check browser console (F12) for errors
- Verify Firebase connection
- Test API connections one by one
- Check that all required fields are filled

---

## ✅ Checklist: Getting Started

- [ ] Access admin panel: http://localhost:4028/admin/maritime-data
- [ ] Test IOC Sea Level API (should work immediately)
- [ ] Test NOAA Tides API (should work immediately)
- [ ] Sign up for Stormglass (if needed)
- [ ] Sign up for WeatherAPI (if needed)
- [ ] Register for Copernicus Marine (if needed)
- [ ] Configure API keys in admin panel
- [ ] Test all API connections
- [ ] Add/edit nautical charts
- [ ] Configure maritime services
- [ ] Verify data shows on public website
- [ ] Save environment variables to .env file

---

## 🎉 You're All Set!

Your Maritime Data Admin Panel is now fully configured and ready to use!

**Next Steps:**
1. Configure your desired API keys
2. Test connections
3. Add your charts and services
4. Monitor the public website for updates

The real-time ocean data will flow automatically to your website! 🌊
