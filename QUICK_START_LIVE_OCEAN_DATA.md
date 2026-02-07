# 🌊 Live Ocean Data - Quick Start Guide

## ✅ Configuration Complete!

Your Copernicus Marine credentials have been configured:
- **Username:** info@safenetcreations.com
- **Password:** ********** (configured)

## 🚀 Start the System (3 Simple Steps)

### Terminal 1: Start Backend

```bash
cd nara_digital_ocean

# Option A: Use the quick start script
./START_LIVE_OCEAN_DATA.sh

# Option B: Manual start
cd backend
source venv/bin/activate  # or: venv\Scripts\activate on Windows
python3 copernicus_flask_api.py
```

Backend will run at: **http://localhost:5000**

### Terminal 2: Start Frontend

```bash
cd nara_digital_ocean

# Start the dev server
npm run dev
```

Frontend will run at: **http://localhost:4028**

### Step 3: Access the Application

Open your browser and go to:

**Option A:** Direct access
- http://localhost:4028/live-ocean-data

**Option B:** Via Maritime Services Hub
- http://localhost:4028/maritime-services-hub
- Click "Access Live Ocean Data" button

## 🧪 Test the Backend API

Open a new terminal and test:

```bash
# Health check
curl http://localhost:5000/api/health

# Get live temperature data
curl http://localhost:5000/api/ocean/temperature/live

# Get ocean currents
curl http://localhost:5000/api/ocean/currents/live

# Get wave conditions
curl http://localhost:5000/api/ocean/waves/live

# Get salinity data
curl http://localhost:5000/api/ocean/salinity/live
```

## 🎨 What You'll See

The Live Ocean Data page has **4 interactive tabs**:

1. **Temperature** - Heatmap showing sea surface temperature in °C
2. **Ocean Currents** - Vector arrows showing current speed (m/s) and direction
3. **Wave Conditions** - Markers showing wave height (m), direction, and period (s)
4. **Salinity** - Markers showing salinity in PSU (Practical Salinity Units)

**Controls Available:**
- Date selector (any date up to today)
- Depth selector (0m, 10m, 20m, 50m, 100m)
- Auto-refresh toggle (updates every 5 minutes)
- Manual refresh button

## 📊 Data Coverage

- **Area:** Sri Lanka EEZ (5°N-10°N, 79°E-82°E)
- **Resolution:** ~9km (0.083°)
- **Data Points:** ~2,160 points per layer
- **Update Frequency:**
  - Temperature, Currents, Salinity: Daily
  - Waves: Every 3 hours
- **Forecast:** 10-day forecast included

## 🔧 Troubleshooting

### Backend won't start?

```bash
cd backend
pip install -r requirements.txt
python3 copernicus_flask_api.py
```

### Frontend shows "Backend Connection Error"?

1. Make sure backend is running at http://localhost:5000
2. Check `.env` file has: `VITE_COPERNICUS_BACKEND_URL=http://localhost:5000`
3. Restart frontend: `npm run dev`

### No data showing?

1. Check browser console for errors (F12)
2. Verify backend API is responding: `curl http://localhost:5000/api/health`
3. Check Copernicus credentials in `/backend/.env`

### Map not loading?

1. Check internet connection (OpenStreetMap tiles need internet)
2. Clear browser cache
3. Try different browser

## 📱 Features

✅ Interactive Leaflet maps
✅ Real-time data from Copernicus Marine Service
✅ Color-coded visualizations
✅ Click markers for detailed info
✅ Date and depth controls
✅ Auto-refresh capability
✅ Statistics (min, max, mean)
✅ Mobile responsive

## 🆓 Cost

**Everything is FREE!**
- Copernicus Marine Service: FREE
- NASA EarthData: FREE
- OpenWeather: FREE (1,000 calls/day)
- Stormglass: FREE tier (50 calls/day)

Total cost: **$0/month**

## 📚 Documentation

- **Complete Guide:** `LIVE_OCEAN_DATA_IMPLEMENTATION_GUIDE.md`
- **Backend API:** `backend/COPERNICUS_BACKEND_README.md`
- **API Keys:** `API-KEYS-SUMMARY.md`

## 🎯 Quick Commands

```bash
# Start backend
cd nara_digital_ocean/backend
python3 copernicus_flask_api.py

# Start frontend
cd nara_digital_ocean
npm run dev

# Test API
curl http://localhost:5000/api/health

# Access app
open http://localhost:4028/live-ocean-data
```

---

**Status:** ✅ Ready to Use
**Last Updated:** October 24, 2025

Enjoy exploring live ocean data! 🌊
