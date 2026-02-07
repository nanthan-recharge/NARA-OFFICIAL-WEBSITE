# Live Ocean Data Visualization - Complete Implementation Guide

## Overview

A complete live ocean data visualization system has been implemented for the NARA website, featuring real-time data from Copernicus Marine Service displayed through interactive maps and charts.

## System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     User Browser                              │
│  http://localhost:4028/live-ocean-data                       │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│              React Frontend (Port 4028)                       │
│                                                               │
│  Components:                                                  │
│  ├─ LiveOceanDataView.jsx (Main container)                  │
│  ├─ TemperatureHeatmap.jsx (Leaflet heatmap)                │
│  ├─ OceanCurrentsVector.jsx (Vector field display)          │
│  ├─ WaveConditionsDisplay.jsx (Wave markers)                │
│  └─ SalinityDisplay.jsx (Salinity circles)                  │
│                                                               │
│  Service:                                                     │
│  └─ copernicusService.js (API client)                       │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     │ REST API calls
                     │ (fetch requests)
                     ▼
┌──────────────────────────────────────────────────────────────┐
│          Python Flask Backend (Port 5000)                     │
│                                                               │
│  copernicus_flask_api.py                                     │
│                                                               │
│  Endpoints:                                                   │
│  ├─ GET /api/health                                          │
│  ├─ GET /api/ocean/temperature/live                          │
│  ├─ GET /api/ocean/currents/live                             │
│  ├─ GET /api/ocean/waves/live                                │
│  ├─ GET /api/ocean/salinity/live                             │
│  ├─ GET /api/ocean/historical                                │
│  ├─ GET /api/ocean/station                                   │
│  └─ GET /api/datasets                                         │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     │ Python library calls
                     │ (copernicusmarine)
                     ▼
┌──────────────────────────────────────────────────────────────┐
│       Copernicus Marine Service (CMEMS)                      │
│                                                               │
│  Datasets:                                                    │
│  ├─ Global Ocean Physics - Temperature                       │
│  ├─ Global Ocean Physics - Currents                          │
│  ├─ Global Ocean Waves                                       │
│  └─ Global Ocean Physics - Salinity                          │
└──────────────────────────────────────────────────────────────┘
```

## Files Created

### Backend (Python Flask API)

| File | Location | Purpose |
|------|----------|---------|
| `copernicus_flask_api.py` | `/backend/` | Main Flask server with 8 API endpoints |
| `requirements.txt` | `/backend/` | Python dependencies |
| `COPERNICUS_BACKEND_README.md` | `/backend/` | Backend setup documentation |

### Frontend (React Components)

| File | Location | Purpose |
|------|----------|---------|
| `LiveOceanDataView.jsx` | `/src/pages/live-ocean-data/` | Main container with tabs and controls |
| `TemperatureHeatmap.jsx` | `/src/pages/live-ocean-data/components/` | Temperature heatmap visualization |
| `OceanCurrentsVector.jsx` | `/src/pages/live-ocean-data/components/` | Current vectors with arrows |
| `WaveConditionsDisplay.jsx` | `/src/pages/live-ocean-data/components/` | Wave condition markers |
| `SalinityDisplay.jsx` | `/src/pages/live-ocean-data/components/` | Salinity circle markers |
| `copernicusService.js` | `/src/services/` | API client service |

### Routing & Integration

| File | Change | Purpose |
|------|--------|---------|
| `Routes.jsx` | Added import & route | Route for `/live-ocean-data` |
| `QuickActionsSection.jsx` | Updated link | Navigation from Maritime Services Hub |

## Features Implemented

### 1. Live Ocean Data Visualization

**Four Data Types:**
- **Temperature:** Heatmap layer showing sea surface temperature (°C)
- **Ocean Currents:** Vector field with arrows showing speed (m/s) and direction
- **Wave Conditions:** Circular markers showing wave height (m), direction, and period (s)
- **Salinity:** Circular markers showing salinity (PSU)

**Interactive Controls:**
- Date selector (any date up to today)
- Depth selector (0m, 10m, 20m, 50m, 100m)
- Auto-refresh toggle (every 5 minutes)
- Manual refresh button
- Tab navigation between data types

**Map Features:**
- Leaflet-based interactive maps
- Sri Lanka EEZ coverage (5°N-10°N, 79°E-82°E)
- OpenStreetMap base layer
- Popup information on click
- Color-coded legends
- Statistics cards (min, max, mean)

### 2. Backend API

**Endpoints:**
```
GET  /api/health                        # Health check
GET  /api/ocean/temperature/live        # Live temperature
GET  /api/ocean/currents/live           # Live currents
GET  /api/ocean/waves/live              # Live waves
GET  /api/ocean/salinity/live           # Live salinity
GET  /api/ocean/historical              # Historical data
GET  /api/ocean/station                 # Station-specific data
GET  /api/datasets                      # List datasets
```

**Features:**
- LRU caching (1 hour, 100 entries)
- CORS enabled for frontend
- Error handling and logging
- Query parameter validation
- Data processing (NaN handling, normalization)

### 3. Integration Points

**From Maritime Services Hub:**
- "Access Live Ocean Data" quick action
- Navigates to `/live-ocean-data`
- Updated description and CTA

## Setup Instructions

### Prerequisites

1. **Copernicus Marine Account**
   - Register at: https://data.marine.copernicus.eu/register
   - Free account with access to global ocean data

2. **Python 3.9+**
   ```bash
   python3 --version  # Should be 3.9 or higher
   ```

3. **Node.js & npm**
   ```bash
   node --version   # Should be 14+
   npm --version    # Should be 6+
   ```

### Step 1: Install Python Dependencies

```bash
cd nara_digital_ocean/backend

# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Configure Copernicus Credentials

```bash
# Interactive login (stores credentials securely)
python3 -c "import copernicusmarine; copernicusmarine.login()"

# Enter your Copernicus username and password when prompted
# Credentials will be stored in: ~/.copernicusmarine-credentials
```

Alternatively, set environment variables:

```bash
export COPERNICUS_MARINE_SERVICE_USERNAME="your_username"
export COPERNICUS_MARINE_SERVICE_PASSWORD="your_password"
```

### Step 3: Start the Backend Server

```bash
cd nara_digital_ocean/backend

# Development mode
python3 copernicus_flask_api.py

# Production mode (using gunicorn)
gunicorn -w 4 -b 0.0.0.0:5000 copernicus_flask_api:app
```

Server will start at: **http://localhost:5000**

### Step 4: Configure Frontend Environment

Create or update `.env` file in `nara_digital_ocean/`:

```bash
# Copernicus Backend URL
VITE_COPERNICUS_BACKEND_URL=http://localhost:5000

# Other existing API keys
VITE_STORMGLASS_API_KEY=7d8ff776-b0d7-11f0-b4de-0242ac130003-7d8ff7da-b0d7-11f0-b4de-0242ac130003
VITE_NASA_EARTHDATA_TOKEN=eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOi...
VITE_OPENWEATHER_API_KEY=024c7bc4260d03aea27b961257d7f588
```

### Step 5: Install Frontend Dependencies

```bash
cd nara_digital_ocean

# Install React Leaflet and related packages
npm install react-leaflet leaflet react-leaflet-heatmap-layer-v3

# Install if not already present
npm install framer-motion lucide-react
```

### Step 6: Start the Frontend

```bash
cd nara_digital_ocean

# Development mode
npm run dev

# Or if using Vite directly
npx vite
```

Frontend will start at: **http://localhost:4028**

### Step 7: Test the System

1. **Check Backend Health:**
   ```bash
   curl http://localhost:5000/api/health
   ```

   Expected response:
   ```json
   {
     "status": "healthy",
     "service": "NARA Copernicus Marine API",
     "timestamp": "2025-10-24T..."
   }
   ```

2. **Test Temperature Endpoint:**
   ```bash
   curl http://localhost:5000/api/ocean/temperature/live
   ```

3. **Access Frontend:**
   - Navigate to: http://localhost:4028/maritime-services-hub
   - Click "Access Live Ocean Data" (third quick action)
   - Or directly: http://localhost:4028/live-ocean-data

4. **Test Visualizations:**
   - Select different dates
   - Change depth levels
   - Switch between tabs (Temperature, Currents, Waves, Salinity)
   - Enable auto-refresh
   - Click on map markers to see popups

## API Usage Examples

### JavaScript/React (Frontend)

```javascript
import {
  fetchLiveTemperature,
  fetchLiveCurrents,
  formatDate
} from '@/services/copernicusService';

// Fetch live temperature
const data = await fetchLiveTemperature({
  date: formatDate(new Date()),
  depth: 0
});

console.log('Temperature data:', data.data.thetao);
console.log('Mean temperature:', data.data.thetao.mean, '°C');

// Fetch ocean currents
const currents = await fetchLiveCurrents({
  date: '2025-10-24',
  depth: 0
});

console.log('Current speed:', currents.data.speed.mean, 'm/s');
```

### Python

```python
import requests

# Get live waves
response = requests.get('http://localhost:5000/api/ocean/waves/live')
data = response.json()

if data['success']:
    print(f"Wave height: {data['data']['VHM0']['mean']} m")
```

### cURL

```bash
# Historical temperature data
curl "http://localhost:5000/api/ocean/historical?dataset=temperature&start_date=2025-10-01&end_date=2025-10-24&depth=0"

# Station data for Colombo
curl "http://localhost:5000/api/ocean/station?lat=6.9271&lon=79.8612&datasets=temperature,currents"
```

## Troubleshooting

### Backend Issues

**Problem:** `401 Unauthorized` or `Access denied`

**Solution:**
1. Verify Copernicus account is active
2. Re-login with correct credentials:
   ```bash
   python3 -c "import copernicusmarine; copernicusmarine.login()"
   ```
3. Check credentials file exists: `~/.copernicusmarine-credentials`

**Problem:** `ModuleNotFoundError: No module named 'copernicusmarine'`

**Solution:**
```bash
pip install copernicusmarine
```

**Problem:** Backend not responding

**Solution:**
1. Check if server is running:
   ```bash
   lsof -i :5000
   ```
2. Check logs for errors
3. Restart backend:
   ```bash
   python3 copernicus_flask_api.py
   ```

### Frontend Issues

**Problem:** "Backend Connection Error" message

**Solution:**
1. Verify backend is running at http://localhost:5000
2. Check CORS is enabled in backend
3. Verify `.env` file has correct `VITE_COPERNICUS_BACKEND_URL`

**Problem:** Heatmap not displaying

**Solution:**
1. Check browser console for errors
2. Verify `react-leaflet-heatmap-layer-v3` is installed:
   ```bash
   npm install react-leaflet-heatmap-layer-v3
   ```
3. Clear browser cache and reload

**Problem:** Map tiles not loading

**Solution:**
1. Check internet connection
2. Verify OpenStreetMap tiles are accessible
3. Check browser console for CORS errors

## Production Deployment

### Backend Deployment Options

#### Option 1: Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY copernicus_flask_api.py .

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "copernicus_flask_api:app"]
```

Build and deploy:
```bash
docker build -t nara-copernicus-api .
docker run -p 5000:5000 \
  -e COPERNICUS_MARINE_SERVICE_USERNAME=your_username \
  -e COPERNICUS_MARINE_SERVICE_PASSWORD=your_password \
  nara-copernicus-api
```

#### Option 2: Azure App Service

```bash
az webapp up \
  --name nara-copernicus-api \
  --resource-group nara-resources \
  --sku B1 \
  --runtime "PYTHON:3.11"

az webapp config appsettings set \
  --name nara-copernicus-api \
  --resource-group nara-resources \
  --settings \
    COPERNICUS_MARINE_SERVICE_USERNAME=your_username \
    COPERNICUS_MARINE_SERVICE_PASSWORD=your_password
```

#### Option 3: Google Cloud Run

```bash
gcloud run deploy nara-copernicus-api \
  --source . \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars \
    COPERNICUS_MARINE_SERVICE_USERNAME=your_username,\
    COPERNICUS_MARINE_SERVICE_PASSWORD=your_password
```

### Frontend Deployment

Update `.env.production`:

```bash
VITE_COPERNICUS_BACKEND_URL=https://your-backend-url.com
```

Build and deploy:

```bash
npm run build
firebase deploy --only hosting
```

## Performance Optimization

### Backend Caching

Current caching: 1 hour (3600 seconds)

To adjust cache duration, edit `copernicus_flask_api.py`:

```python
CACHE_DURATION = 7200  # 2 hours
```

### Frontend Optimization

1. **Reduce sample rate** for vectors/markers:
   ```javascript
   const sampleRate = 5;  // Increase for fewer points
   ```

2. **Lazy load components**:
   ```javascript
   const TemperatureHeatmap = lazy(() => import('./components/TemperatureHeatmap'));
   ```

3. **Debounce API calls**:
   ```javascript
   const debouncedFetch = debounce(fetchData, 500);
   ```

## Data Coverage

### Sri Lanka Maritime Boundaries

```python
SRI_LANKA_BOUNDS = {
    'min_lat': 5.0,    # Southern boundary
    'max_lat': 10.0,   # Northern boundary
    'min_lon': 79.0,   # Western boundary
    'max_lon': 82.0    # Eastern boundary
}
```

### Spatial Resolution

- **Grid spacing:** ~9 km (0.083°)
- **Data points:** Approximately 60×36 = 2,160 points per layer

### Temporal Resolution

- **Temperature:** Daily updates
- **Currents:** Daily updates
- **Waves:** 3-hourly updates
- **Salinity:** Daily updates

### Forecast Period

- All datasets include **10-day forecast**

## Cost & Resources

### Copernicus Marine Service

- **Cost:** FREE (with registration)
- **Rate limits:** None for reasonable use
- **Data access:** Python library (copernicusmarine)

### Existing APIs (Already Verified)

From `API-KEYS-SUMMARY.md`:

| API | Key | Status | Cost |
|-----|-----|--------|------|
| Stormglass | `7d8ff776...` | ✅ Working | $0 (50 req/day) |
| NASA EarthData | `eyJ0eXAi...` | ✅ Valid (expires Dec 23, 2025) | $0 |
| OpenWeather | `024c7bc4...` | ✅ Working | $0 (1,000 calls/day) |

## Next Steps

### Immediate Actions

1. ✅ Backend API created and documented
2. ✅ Frontend components implemented
3. ✅ Integration with Maritime Services Hub complete
4. ⏳ **Test live data fetching and display**
5. ⏳ Deploy backend to production server
6. ⏳ Update production frontend URLs
7. ⏳ Setup monitoring and alerts

### Future Enhancements

1. **Historical Data Analysis**
   - Time series charts (ApexCharts/Recharts)
   - Trend analysis
   - Seasonal patterns

2. **Additional Datasets**
   - Chlorophyll-a concentration
   - Sea ice coverage
   - pH levels

3. **Advanced Visualizations**
   - 3D ocean models (Three.js)
   - Animated time series
   - Comparison views

4. **User Features**
   - Save favorite locations
   - Data export (CSV, JSON)
   - Email alerts for conditions
   - Custom dashboards

5. **Integration**
   - Combine with existing APIs (Stormglass, NASA, OpenWeather)
   - Unified ocean data dashboard
   - Vessel tracking overlay

## Support & Resources

### Documentation

- **Backend API:** `/backend/COPERNICUS_BACKEND_README.md`
- **API Keys:** `/API-KEYS-SUMMARY.md`
- **Maritime Admin:** `/MARITIME-ADMIN-GUIDE.md`

### External Resources

- **Copernicus Marine:** https://data.marine.copernicus.eu/
- **Python Toolbox:** https://pypi.org/project/copernicusmarine/
- **Leaflet:** https://leafletjs.com/
- **React Leaflet:** https://react-leaflet.js.org/

### Contact

For technical support, contact your NARA system administrator.

---

## Implementation Summary

**Date:** October 24, 2025
**Status:** ✅ Complete and Ready for Testing
**Components:** 10 files created/modified
**Lines of Code:** ~3,500+ lines
**Technologies:** Python, Flask, React, Leaflet, Copernicus Marine Service

### Quick Start Commands

```bash
# Terminal 1: Start Backend
cd nara_digital_ocean/backend
python3 copernicus_flask_api.py

# Terminal 2: Start Frontend
cd nara_digital_ocean
npm run dev

# Access Application
open http://localhost:4028/live-ocean-data
```
