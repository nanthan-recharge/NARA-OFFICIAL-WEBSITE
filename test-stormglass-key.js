#!/usr/bin/env node

const https = require('https');

const STORMGLASS_API_KEY = '7d8ff776-b0d7-11f0-b4de-0242ac130003-7d8ff7da-b0d7-11f0-b4de-0242ac130003';

console.log('🔍 Testing Stormglass API Key...\n');
console.log('API Key:', STORMGLASS_API_KEY.substring(0, 50) + '...\n');

// Test locations in Sri Lanka
const testLocations = [
  { name: 'Colombo', lat: 6.9271, lng: 79.8612 },
  { name: 'Trincomalee', lat: 8.5874, lng: 81.2152 },
  { name: 'Galle', lat: 6.0535, lng: 80.2210 }
];

const testEndpoints = [
  {
    name: 'Weather Point (Marine)',
    params: 'waveHeight,waveDirection,wavePeriod,waterTemperature,seaLevel,currentSpeed,currentDirection',
    description: 'Wave height, water temp, currents'
  },
  {
    name: 'Tide Data',
    params: 'tideHeight,tideTime',
    description: 'Tide predictions'
  },
  {
    name: 'Weather Forecast',
    params: 'airTemperature,windSpeed,windDirection,pressure,cloudCover',
    description: 'Weather conditions'
  }
];

async function testAPI(endpoint, location) {
  return new Promise((resolve, reject) => {
    const now = Math.floor(Date.now() / 1000);
    const future = now + 86400; // 24 hours ahead

    const path = `/v2/weather/point?lat=${location.lat}&lng=${location.lng}&params=${endpoint.params}&start=${now}&end=${future}`;

    const options = {
      hostname: 'api.stormglass.io',
      path: path,
      method: 'GET',
      headers: {
        'Authorization': STORMGLASS_API_KEY,
        'User-Agent': 'NARA-Maritime-Services/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`\n📊 ${endpoint.name} - ${location.name}:`);
        console.log(`  Status: ${res.statusCode} ${res.statusMessage}`);

        if (res.statusCode === 200) {
          const jsonData = JSON.parse(data);
          console.log(`  ✅ SUCCESS - ${endpoint.description}`);

          if (jsonData.hours && jsonData.hours.length > 0) {
            const firstHour = jsonData.hours[0];
            console.log(`  📅 Time: ${firstHour.time}`);

            // Display available data
            if (firstHour.waveHeight) {
              const waveHeight = firstHour.waveHeight.sg || firstHour.waveHeight.noaa || firstHour.waveHeight.meteo;
              console.log(`  🌊 Wave Height: ${waveHeight?.toFixed(2) || 'N/A'} m`);
            }
            if (firstHour.waveDirection) {
              const waveDir = firstHour.waveDirection.sg || firstHour.waveDirection.noaa;
              console.log(`  🧭 Wave Direction: ${waveDir?.toFixed(0) || 'N/A'}°`);
            }
            if (firstHour.waterTemperature) {
              const waterTemp = firstHour.waterTemperature.sg || firstHour.waterTemperature.noaa;
              console.log(`  🌡️  Water Temp: ${waterTemp?.toFixed(1) || 'N/A'}°C`);
            }
            if (firstHour.currentSpeed) {
              const currentSpeed = firstHour.currentSpeed.sg;
              console.log(`  💨 Current Speed: ${currentSpeed?.toFixed(2) || 'N/A'} m/s`);
            }
            if (firstHour.windSpeed) {
              const windSpeed = firstHour.windSpeed.sg || firstHour.windSpeed.noaa;
              console.log(`  💨 Wind Speed: ${windSpeed?.toFixed(1) || 'N/A'} m/s`);
            }

            console.log(`  📈 Data Points: ${jsonData.hours.length}`);
            console.log(`  🔢 Sources: ${Object.keys(jsonData.meta || {}).length}`);
          }

          // Check rate limit headers
          if (res.headers['x-rate-limit-limit']) {
            console.log(`  📊 Rate Limit: ${res.headers['x-rate-limit-remaining']}/${res.headers['x-rate-limit-limit']} remaining`);
          }

          resolve(true);
        } else if (res.statusCode === 401) {
          console.log(`  ❌ AUTHENTICATION FAILED - Invalid API Key`);
          try {
            const jsonData = JSON.parse(data);
            console.log(`  Error: ${jsonData.errors?.[0]?.msg || jsonData.message || 'Unknown error'}`);
          } catch (e) {
            console.log(`  Raw Error: ${data.substring(0, 200)}`);
          }
          resolve(false);
        } else if (res.statusCode === 429) {
          console.log(`  ⚠️  RATE LIMIT EXCEEDED`);
          console.log(`  You've reached your daily/monthly limit`);
          resolve(false);
        } else if (res.statusCode === 402) {
          console.log(`  💳 PAYMENT REQUIRED`);
          console.log(`  This endpoint requires a paid subscription`);
          resolve(false);
        } else {
          console.log(`  ⚠️  ERROR - ${res.statusCode}`);
          console.log(`  Response: ${data.substring(0, 300)}`);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`  ❌ REQUEST FAILED - ${error.message}`);
      resolve(false);
    });

    req.setTimeout(10000, () => {
      console.log(`  ⏱️  REQUEST TIMEOUT`);
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

async function runTests() {
  console.log('🌐 Testing Stormglass API Connection...');
  console.log('='.repeat(60));

  let successCount = 0;
  let totalTests = 0;

  // Test with Colombo location first
  const location = testLocations[0];

  for (const endpoint of testEndpoints) {
    totalTests++;
    const result = await testAPI(endpoint, location);
    if (result) successCount++;
    await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting delay
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n🎯 Final Result:');
  console.log(`  Tests Passed: ${successCount}/${totalTests}`);

  if (successCount === totalTests) {
    console.log('\n  ✅ STORMGLASS API KEY IS VALID AND WORKING!');
    console.log('  All endpoints responded successfully.');

    console.log('\n🌊 Available Marine Data:');
    console.log('  ✅ Wave height, direction & period');
    console.log('  ✅ Water temperature');
    console.log('  ✅ Sea level');
    console.log('  ✅ Ocean currents (speed & direction)');
    console.log('  ✅ Tide predictions');
    console.log('  ✅ Wind speed & direction');
    console.log('  ✅ Air temperature');
    console.log('  ✅ Atmospheric pressure');

    console.log('\n📝 Next Steps:');
    console.log('  1. Go to http://localhost:4028/admin/maritime-data');
    console.log('  2. Click "API Configuration" tab');
    console.log('  3. Paste your key in "Stormglass API Key" field');
    console.log('  4. Click "Save Configuration"');
    console.log('  5. Test connection in "Live Data Test" tab');

    console.log('\n💰 Subscription Info:');
    console.log('  Check your plan at: https://dashboard.stormglass.io');
    console.log('  Current key: Working and authenticated');

  } else if (successCount > 0) {
    console.log('\n  ⚠️  PARTIAL SUCCESS');
    console.log('  Some endpoints working, others may require upgrade.');
    console.log('\n💡 Tip: Some features need paid subscription.');
    console.log('  Free tier: 50 requests/day');
    console.log('  Upgrade: $50-500/month for more data');
  } else {
    console.log('\n  ❌ ALL TESTS FAILED');
    console.log('\n🔧 Troubleshooting:');
    console.log('  1. Verify API key is correct and complete');
    console.log('  2. Check if key is activated (dashboard.stormglass.io)');
    console.log('  3. Verify subscription is active');
    console.log('  4. Check if free tier limit (50/day) is exceeded');
    console.log('  5. Confirm account is in good standing');
  }

  console.log('\n');
}

runTests();
