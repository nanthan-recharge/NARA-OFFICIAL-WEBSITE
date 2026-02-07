# Marine Forecast API Configuration

## Required API Keys

To enable real-time ocean data, configure these API keys in your `.env.local` file:

```bash
# Stormglass Maritime Weather API
# Sign up at: https://stormglass.io/
# Free tier: 50 requests/day
VITE_STORMGLASS_API_KEY=your_key_here

# Optional: For enhanced features
# VITE_COPERNICUS_USERNAME=your_username
# VITE_COPERNICUS_PASSWORD=your_password
```

## Free Data Sources (No API Key Required)

These services work without authentication:

1. **IOC Sea Level Monitoring** (UNESCO)
   - Real-time sea level for Colombo & Trincomalee
   - Updates: Every 6 minutes
   - URL: https://www.ioc-sealevelmonitoring.org/

2. **NOAA Tides & Currents**
   - Water level and tide predictions
   - Updates: Every minute
   - URL: https://api.tidesandcurrents.noaa.gov/

## API Rate Limits

| Service | Free Tier | Rate Limit |
|---------|-----------|------------|
| Stormglass | 50 req/day | 1 req/sec |
| IOC UNESCO | Unlimited | No limit |
| NOAA | Unlimited | No limit |

## Fallback Behavior

Without API keys, the system will:
1. Use cached data (5-minute cache)
2. Fall back to mock data generation
3. Display warning about limited data

## Setup Instructions

1. Copy `.env` to `.env.local`
2. Add your API keys
3. Restart the development server
4. Test at: http://localhost:5173/marine-forecast

## Testing Real APIs

```bash
# Test IOC sea level
curl "https://www.ioc-sealevelmonitoring.org/service.php?query=data&code=colo&format=json"

# Test NOAA tides (requires station ID)
curl "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=water_level&station=1612340&date=latest&datum=MLLW&time_zone=GMT&units=metric&format=json"
```

## Data Quality

- ✅ **IOC/NOAA:** Real-time, high quality, government data
- ✅ **Stormglass:** Commercial-grade forecasts, ML-enhanced
- ⚠️ **Mock Data:** Algorithmically generated for development only
