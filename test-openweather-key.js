#!/usr/bin/env node

const https = require('https');

const OPENWEATHER_API_KEY = '024c7bc4260d03aea27b961257d7f588';

console.log('🔍 Testing OpenWeather API Key...\n');
console.log('API Key:', OPENWEATHER_API_KEY, '\n');

// Test locations in Sri Lanka
const testLocations = [
  { name: 'Colombo', lat: 6.9271, lon: 79.8612 },
  { name: 'Trincomalee', lat: 8.5874, lon: 81.2152 },
  { name: 'Galle', lat: 6.0535, lon: 80.2210 }
];

const testAPIs = [
  {
    name: 'Current Weather Data',
    endpoint: (lat, lon) => `/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
  },
  {
    name: 'Marine Weather (Wave Data)',
    endpoint: (lat, lon) => `/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
  },
  {
    name: '5 Day Forecast',
    endpoint: (lat, lon) => `/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
  }
];

async function testAPI(apiTest, location) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.openweathermap.org',
      path: apiTest.endpoint(location.lat, location.lon),
      method: 'GET',
      headers: {
        'User-Agent': 'NARA-Maritime-Services/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`\n📊 ${apiTest.name} - ${location.name}:`);
        console.log(`  Status: ${res.statusCode} ${res.statusMessage}`);

        if (res.statusCode === 200) {
          const jsonData = JSON.parse(data);
          console.log(`  ✅ SUCCESS`);

          // Display relevant data
          if (jsonData.main) {
            console.log(`  🌡️  Temperature: ${jsonData.main.temp}°C`);
            console.log(`  💧 Humidity: ${jsonData.main.humidity}%`);
            console.log(`  🌊 Pressure: ${jsonData.main.pressure} hPa`);
          }
          if (jsonData.wind) {
            console.log(`  💨 Wind Speed: ${jsonData.wind.speed} m/s`);
            console.log(`  🧭 Wind Direction: ${jsonData.wind.deg}°`);
          }
          if (jsonData.weather && jsonData.weather[0]) {
            console.log(`  ☁️  Condition: ${jsonData.weather[0].description}`);
          }

          resolve(true);
        } else if (res.statusCode === 401) {
          console.log(`  ❌ AUTHENTICATION FAILED - Invalid API Key`);
          const jsonData = JSON.parse(data);
          console.log(`  Error: ${jsonData.message}`);
          resolve(false);
        } else if (res.statusCode === 429) {
          console.log(`  ⚠️  RATE LIMIT - Too many requests`);
          resolve(false);
        } else {
          console.log(`  ⚠️  ERROR - ${res.statusCode}`);
          console.log(`  Response: ${data.substring(0, 200)}`);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`  ❌ REQUEST FAILED - ${error.message}`);
      resolve(false);
    });

    req.end();
  });
}

async function runTests() {
  console.log('🌐 Testing OpenWeather API Connection...');
  console.log('='.repeat(60));

  let successCount = 0;
  let totalTests = 0;

  // Test with Colombo location
  const location = testLocations[0];

  for (const apiTest of testAPIs) {
    totalTests++;
    const result = await testAPI(apiTest, location);
    if (result) successCount++;
    await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting delay
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n🎯 Final Result:');
  console.log(`  Tests Passed: ${successCount}/${totalTests}`);

  if (successCount === totalTests) {
    console.log('\n  ✅ OPENWEATHER API KEY IS VALID AND WORKING!');
    console.log('  All endpoints responded successfully.');

    console.log('\n📦 Available Data:');
    console.log('  ✅ Current weather conditions');
    console.log('  ✅ Temperature & humidity');
    console.log('  ✅ Wind speed & direction');
    console.log('  ✅ Atmospheric pressure');
    console.log('  ✅ 5-day forecast');
    console.log('  ✅ Weather descriptions');

    console.log('\n📝 Next Steps:');
    console.log('  1. Go to http://localhost:4028/admin/maritime-data');
    console.log('  2. Click "API Configuration" tab');
    console.log('  3. Paste your key in "OpenWeather API Key" field');
    console.log('  4. Click "Save Configuration"');
    console.log('  5. Test connection in "Live Data Test" tab');

    console.log('\n💰 API Plan Info:');
    console.log('  Free tier: 1,000 calls/day');
    console.log('  Upgrade: $40-$180/month for more calls');
    console.log('  Current key: Working on free tier');

  } else if (successCount > 0) {
    console.log('\n  ⚠️  PARTIAL SUCCESS');
    console.log('  Some endpoints working, others may have issues.');
  } else {
    console.log('\n  ❌ ALL TESTS FAILED');
    console.log('\n🔧 Troubleshooting:');
    console.log('  1. Verify API key is correct');
    console.log('  2. Check if key is activated (can take 10 minutes)');
    console.log('  3. Verify account is in good standing');
    console.log('  4. Check rate limits on your account');
  }

  console.log('\n');
}

runTests();
