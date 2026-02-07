#!/usr/bin/env node

const https = require('https');

const NASA_TOKEN = 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfb3BzIiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiVXNlciIsInVpZCI6Im5hcmEyNSIsImV4cCI6MTc2NjQ5MjU4NiwiaWF0IjoxNzYxMzA4NTg2LCJpc3MiOiJodHRwczovL3Vycy5lYXJ0aGRhdGEubmFzYS5nb3YiLCJpZGVudGl0eV9wcm92aWRlciI6ImVkbF9vcHMiLCJhY3IiOiJlZGwiLCJhc3N1cmFuY2VfbGV2ZWwiOjN9.T5qt87b-64cuXo8_8XC2nRu0xzg4uyAG8WNcJJBBmgxh54SEzfqD3VIZyxPHghRRRayQJaPdjAIb8XcdjzBaqXppbih2KvjWVXMFyHee3JVwoSQzJ9XqikG1mSNOR7KCXQYkhc7NjsE677ZYgd2FI8i81qQOuxXZ0V6JTsbhAKLaXr5qLOA1SYgWY0ZTok1_vr61-co38RaP1YshDftHXDxROvSkWshiJjL7gOg-_WQKm8z6j8ObLi9zSC3NbaDI2m6Ug9orVQfC_atdeT6O9wU-9JHmaV4zzbuv1Qv9UAUHK54AC6cKzJqB2gJYSl161fGySa1fjy7HqVVseVwViA';

console.log('🔍 Testing NASA EarthData Token...\n');
console.log('Token:', NASA_TOKEN.substring(0, 50) + '...\n');

// Parse JWT to check expiration
function parseJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      Buffer.from(base64, 'base64')
        .toString('binary')
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('❌ Error parsing JWT:', error.message);
    return null;
  }
}

const payload = parseJWT(NASA_TOKEN);

if (payload) {
  console.log('📋 Token Information:');
  console.log('  User ID:', payload.uid);
  console.log('  Issued At:', new Date(payload.iat * 1000).toLocaleString());
  console.log('  Expires:', new Date(payload.exp * 1000).toLocaleString());
  console.log('  Issuer:', payload.iss);
  console.log('  Assurance Level:', payload.assurance_level);

  const now = Math.floor(Date.now() / 1000);
  const timeRemaining = payload.exp - now;
  const daysRemaining = Math.floor(timeRemaining / 86400);

  console.log('\n⏰ Token Status:');
  if (timeRemaining > 0) {
    console.log(`  ✅ VALID - Expires in ${daysRemaining} days (${new Date(payload.exp * 1000).toLocaleDateString()})`);
  } else {
    console.log(`  ❌ EXPIRED - Token expired ${Math.abs(daysRemaining)} days ago`);
    process.exit(1);
  }
}

// Test API connection
console.log('\n🌐 Testing NASA API Connection...');

const testUrls = [
  {
    name: 'NASA Ocean Color API',
    url: 'https://oceandata.sci.gsfc.nasa.gov/api/file_search?sensor=MODISA&dtype=L3b&results_as_file=1&search=*2024*'
  },
  {
    name: 'NASA EarthData URS',
    url: 'https://urs.earthdata.nasa.gov/api/users/nara25'
  }
];

async function testAPI(testUrl) {
  return new Promise((resolve, reject) => {
    const url = new URL(testUrl.url);

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${NASA_TOKEN}`,
        'User-Agent': 'NARA-Maritime-Services/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`\n📊 ${testUrl.name}:`);
        console.log(`  Status: ${res.statusCode} ${res.statusMessage}`);
        console.log(`  Content-Type: ${res.headers['content-type']}`);

        if (res.statusCode === 200) {
          console.log(`  ✅ SUCCESS - API is responding`);
          console.log(`  Response Preview: ${data.substring(0, 200)}...`);
          resolve(true);
        } else if (res.statusCode === 401) {
          console.log(`  ❌ AUTHENTICATION FAILED - Token is invalid or expired`);
          resolve(false);
        } else if (res.statusCode === 403) {
          console.log(`  ❌ ACCESS DENIED - Token doesn't have required permissions`);
          resolve(false);
        } else {
          console.log(`  ⚠️  UNEXPECTED STATUS - ${res.statusCode}`);
          console.log(`  Response: ${data.substring(0, 500)}`);
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
  console.log('\n' + '='.repeat(60));

  let allPassed = true;

  for (const testUrl of testUrls) {
    const result = await testAPI(testUrl);
    if (!result) allPassed = false;
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n🎯 Final Result:');

  if (allPassed) {
    console.log('  ✅ NASA TOKEN IS VALID AND WORKING!');
    console.log('  You can use this token in your Maritime Admin Panel.');
    console.log('\n📝 Next Steps:');
    console.log('  1. Go to http://localhost:4028/admin/maritime-data');
    console.log('  2. Click "API Configuration" tab');
    console.log('  3. Paste your token in "NASA EarthData Token" field');
    console.log('  4. Click "Save Configuration"');
    console.log('  5. Go to "Live Data Test" tab');
    console.log('  6. Click "Test Connection" on NASA EarthData');
  } else {
    console.log('  ⚠️  TOKEN MAY HAVE ISSUES');
    console.log('  Check the errors above for details.');
    console.log('\n🔧 Troubleshooting:');
    console.log('  1. Verify token is copied completely');
    console.log('  2. Check if your NASA EarthData account is active');
    console.log('  3. Try generating a new token at: https://urs.earthdata.nasa.gov');
  }

  console.log('\n');
}

runTests();
