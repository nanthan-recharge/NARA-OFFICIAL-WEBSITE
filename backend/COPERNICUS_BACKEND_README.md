# NARA Copernicus Marine API Backend

Complete Python Flask backend for fetching live ocean data from Copernicus Marine Service.

## 🎯 Overview

This backend provides REST API endpoints to fetch real-time ocean data for Sri Lanka's maritime zones:

- **Sea Surface Temperature** (daily updates)
- **Ocean Currents** (U/V velocity components)
- **Wave Conditions** (height, direction, period)
- **Salinity** (PSU units)
- **Historical Data** (time series analysis)

## 📋 Prerequisites

1. **Python 3.9+** installed
2. **Copernicus Marine Account** (free registration)
   - Register at: https://data.marine.copernicus.eu/register
3. **Valid Copernicus credentials**

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
cd backend

# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

### Step 2: Configure Copernicus Credentials

```bash
# Login to Copernicus Marine (interactive prompt)
python3 -c "import copernicusmarine; copernicusmarine.login()"

# Enter your Copernicus username and password
# Credentials will be stored securely in ~/.copernicusmarine-credentials
```

Alternatively, set environment variables:

```bash
export COPERNICUS_MARINE_SERVICE_USERNAME="your_username"
export COPERNICUS_MARINE_SERVICE_PASSWORD="your_password"
```

### Step 3: Run the Server

```bash
# Development mode
python3 copernicus_flask_api.py

# Production mode (using gunicorn)
gunicorn -w 4 -b 0.0.0.0:5000 copernicus_flask_api:app
```

Server will start at: **http://localhost:5000**

### Step 4: Test the API

```bash
# Health check
curl http://localhost:5000/api/health

# Get live temperature data
curl http://localhost:5000/api/ocean/temperature/live

# Get live ocean currents
curl http://localhost:5000/api/ocean/currents/live

# Get wave conditions
curl http://localhost:5000/api/ocean/waves/live

# List available datasets
curl http://localhost:5000/api/datasets
```

## 📡 API Endpoints

### 1. Health Check
```
GET /api/health
```
Returns server status and timestamp.

**Response:**
```json
{
  "status": "healthy",
  "service": "NARA Copernicus Marine API",
  "timestamp": "2025-10-24T10:30:00"
}
```

---

### 2. Live Temperature
```
GET /api/ocean/temperature/live?date=2025-10-24&depth=0
```

**Query Parameters:**
- `date` (optional): Date in YYYY-MM-DD format (default: today)
- `depth` (optional): Depth in meters (default: 0 for surface)

**Response:**
```json
{
  "success": true,
  "data": {
    "thetao": {
      "values": [...],
      "shape": [1, 60, 36],
      "min": 27.5,
      "max": 29.8,
      "mean": 28.6
    },
    "coordinates": {
      "latitude": [5.0, 5.083, ...],
      "longitude": [79.0, 79.083, ...],
      "time": ["2025-10-24T00:00:00"]
    }
  },
  "metadata": {
    "dataset": "Sea Surface Temperature",
    "source": "Copernicus Marine Service",
    "date": "2025-10-24",
    "depth": 0,
    "units": "°C",
    "bounds": {
      "min_lat": 5.0,
      "max_lat": 10.0,
      "min_lon": 79.0,
      "max_lon": 82.0
    }
  }
}
```

---

### 3. Live Ocean Currents
```
GET /api/ocean/currents/live?date=2025-10-24&depth=0
```

**Query Parameters:**
- `date` (optional): Date in YYYY-MM-DD format
- `depth` (optional): Depth in meters (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "uo": {
      "values": [...],
      "min": -0.5,
      "max": 0.8,
      "mean": 0.15
    },
    "vo": {
      "values": [...],
      "min": -0.4,
      "max": 0.6,
      "mean": 0.12
    },
    "speed": {
      "values": [...],
      "min": 0.01,
      "max": 1.2,
      "mean": 0.25,
      "units": "m/s"
    },
    "direction": {
      "values": [...],
      "units": "degrees"
    },
    "coordinates": { ... }
  },
  "metadata": {
    "dataset": "Ocean Currents",
    "units": "m/s"
  }
}
```

---

### 4. Live Wave Conditions
```
GET /api/ocean/waves/live?date=2025-10-24
```

**Response:**
```json
{
  "success": true,
  "data": {
    "VHM0": {
      "values": [...],
      "min": 0.8,
      "max": 2.5,
      "mean": 1.5
    },
    "VMDR": {
      "values": [...]
    },
    "VTPK": {
      "values": [...]
    }
  },
  "metadata": {
    "dataset": "Wave Conditions",
    "variables": {
      "VHM0": "Significant Wave Height (m)",
      "VMDR": "Wave Direction (degrees)",
      "VTPK": "Wave Peak Period (s)"
    }
  }
}
```

---

### 5. Live Salinity
```
GET /api/ocean/salinity/live?date=2025-10-24&depth=0
```

**Response:**
```json
{
  "success": true,
  "data": {
    "so": {
      "values": [...],
      "min": 33.5,
      "max": 35.2,
      "mean": 34.3
    }
  },
  "metadata": {
    "dataset": "Sea Water Salinity",
    "units": "PSU"
  }
}
```

---

### 6. Historical Data
```
GET /api/ocean/historical?dataset=temperature&start_date=2025-10-01&end_date=2025-10-24&depth=0
```

**Query Parameters:**
- `dataset` (required): `temperature`, `currents`, `waves`, or `salinity`
- `start_date` (required): Start date YYYY-MM-DD
- `end_date` (required): End date YYYY-MM-DD
- `depth` (optional): Depth in meters

**Response:**
```json
{
  "success": true,
  "data": {
    "thetao": { ... },
    "coordinates": {
      "time": ["2025-10-01", "2025-10-02", ...]
    }
  },
  "metadata": {
    "dataset": "Temperature",
    "start_date": "2025-10-01",
    "end_date": "2025-10-24"
  }
}
```

---

### 7. Station/Point Data
```
GET /api/ocean/station?lat=6.9271&lon=79.8612&datasets=temperature,currents,waves
```

**Query Parameters:**
- `lat` (required): Latitude
- `lon` (required): Longitude
- `date` (optional): Date YYYY-MM-DD
- `datasets` (optional): Comma-separated list

**Response:**
```json
{
  "success": true,
  "result": {
    "location": {
      "latitude": 6.9271,
      "longitude": 79.8612
    },
    "date": "2025-10-24",
    "data": {
      "temperature": { ... },
      "currents": { ... },
      "waves": { ... }
    }
  }
}
```

---

### 8. List Datasets
```
GET /api/datasets
```

**Response:**
```json
{
  "success": true,
  "datasets": {
    "temperature": {
      "id": "cmems_mod_glo_phy-thetao_anfc_0.083deg_P1D-m",
      "name": "Sea Surface Temperature",
      "variables": ["thetao"],
      "units": "°C",
      "temporal_resolution": "Daily",
      "spatial_resolution": "0.083° (~9km)"
    },
    ...
  },
  "bounds": { ... }
}
```

## 🗺️ Sri Lanka Maritime Boundaries

All data is automatically filtered to Sri Lanka's EEZ:

```python
SRI_LANKA_BOUNDS = {
    'min_lat': 5.0,    # Southern boundary
    'max_lat': 10.0,   # Northern boundary
    'min_lon': 79.0,   # Western boundary
    'max_lon': 82.0    # Eastern boundary
}
```

## 📊 Copernicus Datasets Used

| Dataset | ID | Variables | Resolution |
|---------|----|-----------|-----------
| **Sea Surface Temperature** | `cmems_mod_glo_phy-thetao_anfc_0.083deg_P1D-m` | `thetao` | Daily, ~9km |
| **Ocean Currents** | `cmems_mod_glo_phy-cur_anfc_0.083deg_P1D-m` | `uo`, `vo` | Daily, ~9km |
| **Wave Conditions** | `cmems_mod_glo_wav_anfc_0.083deg_PT3H-i` | `VHM0`, `VMDR`, `VTPK` | 3-hourly, ~9km |
| **Salinity** | `cmems_mod_glo_phy-so_anfc_0.083deg_P1D-m` | `so` | Daily, ~9km |

## ⚡ Performance & Caching

- **LRU Cache:** Results cached for 1 hour (3600 seconds)
- **Cache Key:** `(dataset_id, variables, date, depth)`
- **Max Cache Size:** 100 entries
- **Benefit:** Reduces API calls and improves response time

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```bash
# Copernicus Marine credentials
COPERNICUS_MARINE_SERVICE_USERNAME=your_username
COPERNICUS_MARINE_SERVICE_PASSWORD=your_password

# Flask configuration
FLASK_ENV=production
PORT=5000
```

### CORS Configuration

Default: Allows all origins (`*`)

To restrict origins, modify `copernicus_flask_api.py`:

```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:4028", "https://nara.gov.lk"]
    }
})
```

## 🚀 Production Deployment

### Option 1: Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY copernicus_flask_api.py .

# Configure Copernicus credentials
RUN echo "${COPERNICUS_USERNAME}\n${COPERNICUS_PASSWORD}" | python3 -c "import copernicusmarine; copernicusmarine.login()"

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "copernicus_flask_api:app"]
```

Build and run:
```bash
docker build -t nara-copernicus-api .
docker run -p 5000:5000 \
  -e COPERNICUS_MARINE_SERVICE_USERNAME=your_username \
  -e COPERNICUS_MARINE_SERVICE_PASSWORD=your_password \
  nara-copernicus-api
```

### Option 2: Azure App Service

```bash
az webapp up --name nara-copernicus-api \
  --resource-group nara-resources \
  --sku B1 \
  --runtime "PYTHON:3.11"

# Set credentials
az webapp config appsettings set --name nara-copernicus-api \
  --resource-group nara-resources \
  --settings \
    COPERNICUS_MARINE_SERVICE_USERNAME=your_username \
    COPERNICUS_MARINE_SERVICE_PASSWORD=your_password
```

### Option 3: Google Cloud Run

```bash
gcloud run deploy nara-copernicus-api \
  --source . \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars COPERNICUS_MARINE_SERVICE_USERNAME=your_username,COPERNICUS_MARINE_SERVICE_PASSWORD=your_password
```

## 🔍 Troubleshooting

### Issue: Authentication Failed

**Error:** `401 Unauthorized` or `Access denied`

**Solution:**
1. Verify Copernicus account is active
2. Re-login with correct credentials:
   ```bash
   python3 -c "import copernicusmarine; copernicusmarine.login()"
   ```
3. Check credentials file exists: `~/.copernicusmarine-credentials`

### Issue: Dataset Not Found

**Error:** `Dataset ID not found`

**Solution:**
1. Verify dataset IDs at: https://data.marine.copernicus.eu/products
2. Check if dataset is available for your region
3. Update `DATASETS` dict in `copernicus_flask_api.py`

### Issue: Slow Response Times

**Solution:**
1. Increase cache duration:
   ```python
   CACHE_DURATION = 7200  # 2 hours
   ```
2. Reduce spatial/temporal resolution
3. Use smaller bounding boxes
4. Deploy closer to Copernicus servers (Europe)

### Issue: Memory Errors

**Error:** `MemoryError` or `Out of memory`

**Solution:**
1. Reduce date range for historical queries
2. Process data in chunks
3. Increase server memory
4. Use smaller spatial grids

## 📝 API Usage Examples

### JavaScript/Next.js

```javascript
// Fetch live temperature
const response = await fetch('http://localhost:5000/api/ocean/temperature/live');
const data = await response.json();

if (data.success) {
  console.log('Temperature data:', data.data.thetao);
  console.log('Mean temperature:', data.data.thetao.mean, '°C');
}
```

### Python

```python
import requests

# Get ocean currents
response = requests.get('http://localhost:5000/api/ocean/currents/live', params={
    'date': '2025-10-24',
    'depth': 0
})

data = response.json()
if data['success']:
    print(f"Current speed: {data['data']['speed']['mean']} m/s")
```

### cURL

```bash
# Historical wave data
curl -X GET "http://localhost:5000/api/ocean/historical?dataset=waves&start_date=2025-10-01&end_date=2025-10-24"
```

## 📞 Support & Resources

- **Copernicus Marine Documentation:** https://help.marine.copernicus.eu/
- **Python Toolbox Docs:** https://pypi.org/project/copernicusmarine/
- **NARA Technical Support:** Contact your system administrator

## 🔄 Next Steps

1. ✅ Backend API created and documented
2. ⏳ Create React components for frontend visualization
3. ⏳ Integrate with Maritime Services Hub
4. ⏳ Deploy to production server
5. ⏳ Setup monitoring and alerts

## 📅 Last Updated

October 24, 2025
