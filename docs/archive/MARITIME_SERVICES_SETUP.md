# Maritime Services Hub - Complete Setup Guide

## Overview
Comprehensive Maritime Services Hub with real-time vessel tracking, port operations, permits, weather data, and trilingual support (EN/SI/TA).

---

## 🏗️ Architecture

### **Frontend Layer**
- React components with real-time updates
- Framer Motion animations
- Trilingual content (i18next)
- Responsive design (Tailwind CSS)

### **Backend Layer (Firebase)**
- Firestore for data storage
- Real-time subscriptions
- Server-side timestamps
- Secure access rules

### **API Layer** (`/src/services/maritimeService.js`)
- Vessel tracking & management
- Port operations
- Permits & licenses
- Weather & sea conditions
- Maritime alerts
- Safety reports
- Service bookings

---

## 📊 Firebase Collections

### 1. **`maritime_vessels`**
Stores vessel tracking data

```javascript
{
  id: "NARA-001",
  name: { en: "RV Ocean Explorer", si: "සාගර ගවේෂකයා", ta: "கடல் ஆராய்ச்சி" },
  type: "research_vessel",
  status: "active", // active, in_port, maintenance, decommissioned
  position: {
    lat: 6.9271,
    lon: 79.8612,
    altitude: 0
  },
  speed: 12.5, // knots
  heading: 45, // degrees
  crew: 24,
  mission: { en: "Deep Sea Survey", si: "ගැඹුරු මුහුදු සමීක්ෂණය", ta: "ஆழ் கடல் ஆய்வு" },
  eta: "2024-09-22T14:30:00Z",
  lastUpdate: serverTimestamp(),
  flag: "LK"
}
```

### 2. **`maritime_ports`**
Port operations and status

```javascript
{
  id: "LKCMB",
  name: { en: "Colombo Port", si: "කොළඹ වරාය", ta: "கொழும்பு துறைமுகம்" },
  code: "LKCMB",
  vessels: 47,
  capacity: 85, // percentage
  weather: {
    condition: "clear",
    temp: 28,
    wind: 12,
    humidity: 75
  },
  status: "operational", // operational, limited, closed
  lastUpdate: serverTimestamp()
}
```

### 3. **`maritime_services`**
Available maritime services

```javascript
{
  id: "service_001",
  title: {
    en: "Vessel Inspection",
    si: "යාත්‍රා පරීක්ෂණය",
    ta: "கப்பல் ஆய்வு"
  },
  description: {
    en: "Comprehensive vessel safety inspection",
    si: "සම්පූර්ණ යාත්‍රා ආරක්ෂණ පරීක්ෂණය",
    ta: "முழுமையான கப்பல் பாதுகாப்பு ஆய்வு"
  },
  category: "inspection", // inspection, permit, license, training, emergency
  price: 15000, // LKR
  duration: "2-3 hours",
  requirements: ["Valid vessel registration", "Insurance certificate"],
  icon: "ClipboardCheck",
  status: "active",
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
}
```

### 4. **`maritime_permits`**
Permit applications and status

```javascript
{
  id: "permit_001",
  userId: "user_123",
  type: "fishing_license", // fishing_license, vessel_registration, export_permit
  applicantName: "John Doe",
  vesselName: "Blue Ocean",
  vesselType: "fishing",
  applicationData: {
    vesselLength: 12,
    enginePower: 150,
    crew: 5,
    fishingArea: "Zone A"
  },
  documents: [
    {
      name: "vessel_certificate.pdf",
      url: "https://storage.firebase.com/...",
      uploadedAt: "2024-09-20"
    }
  ],
  status: "pending", // pending, approved, rejected, expired
  submittedAt: serverTimestamp(),
  reviewedAt: null,
  reviewedBy: null,
  notes: "",
  expiryDate: "2025-09-20"
}
```

### 5. **`maritime_alerts`**
Active maritime alerts and notices

```javascript
{
  id: "alert_001",
  severity: "high", // low, medium, high, critical
  type: "weather", // weather, security, navigation, environmental
  title: {
    en: "Severe Weather Warning",
    si: "දැඩි කාලගුණ අනතුරු ඇඟවීම",
    ta: "கடுமையான வானிலை எச்சரிக்கை"
  },
  description: {
    en: "Strong winds expected in southern waters",
    si: "දකුණු ජලයේ තද සුළං අපේක්ෂා කෙරේ",
    ta: "தென் கடல் பகுதியில் கடும் காற்று எதிர்பார்க்கப்படுகிறது"
  },
  affectedAreas: ["South Coast", "East Coast"],
  validFrom: "2024-09-20T00:00:00Z",
  validUntil: "2024-09-21T23:59:59Z",
  status: "active",
  createdAt: serverTimestamp()
}
```

### 6. **`maritime_bookings`**
Service bookings and reservations

```javascript
{
  id: "booking_001",
  userId: "user_123",
  serviceId: "service_001",
  userName: "John Doe",
  userEmail: "john@example.com",
  userPhone: "+94771234567",
  vesselId: "NARA-001",
  bookingDate: "2024-09-25T10:00:00Z",
  notes: "Urgent inspection needed",
  status: "pending", // pending, confirmed, completed, cancelled
  paymentStatus: "pending", // pending, paid, refunded
  totalAmount: 15000,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
}
```

### 7. **`maritime_safety_reports`**
Safety incident reports

```javascript
{
  id: "report_001",
  vesselId: "FISH-245",
  reporterName: "Captain Smith",
  reporterContact: "+94771234567",
  incidentType: "collision", // collision, grounding, fire, pollution, injury
  incidentDate: "2024-09-19T14:30:00Z",
  location: {
    lat: 6.9271,
    lon: 79.8612,
    description: "Near Colombo Port"
  },
  description: "Minor collision with buoy",
  injuries: 0,
  damage: "Minor hull damage",
  attachments: [],
  status: "submitted", // submitted, under_review, resolved
  submittedAt: serverTimestamp()
}
```

### 8. **`maritime_data/current_weather`**
Current weather and sea conditions (single document)

```javascript
{
  zones: [
    {
      id: "south_coast",
      name: { en: "South Coast", si: "දකුණු වෙරළ", ta: "தென் கடற்கரை" },
      condition: "clear",
      temperature: 28,
      windSpeed: 15,
      windDirection: "SW",
      waveHeight: 1.2,
      visibility: "Good",
      seaCondition: "Moderate"
    }
  ],
  lastUpdate: serverTimestamp()
}
```

---

## 🔧 API Endpoints (maritimeService.js)

### **Vessel Management**
```javascript
import { getVessels, subscribeToVessels, updateVesselPosition } from '@/services/maritimeService';

// Get all vessels
const vessels = await getVessels({ status: 'active', limit: 50 });

// Subscribe to real-time updates
const unsubscribe = subscribeToVessels((vessels) => {
  console.log('Live vessels:', vessels);
});

// Update vessel position (from GPS/AIS)
await updateVesselPosition('NARA-001', { lat: 6.9271, lon: 79.8612 });
```

### **Port Operations**
```javascript
import { getPorts, getPortStatus, updatePortStatus } from '@/services/maritimeService';

// Get all ports
const ports = await getPorts();

// Get specific port status
const port = await getPortStatus('LKCMB');

// Update port status (admin only)
await updatePortStatus('LKCMB', {
  vessels: 48,
  capacity: 87,
  weather: { condition: 'clear', temp: 29 }
});
```

### **Maritime Services**
```javascript
import { getMaritimeServices, createMaritimeService } from '@/services/maritimeService';

// Get services in specific language
const services = await getMaritimeServices('si'); // en, si, ta

// Create new service (admin only)
await createMaritimeService({
  title: { en: "Safety Training", si: "ආරක්ෂණ පුහුණුව", ta: "பாதுகாப்பு பயிற்சி" },
  description: { en: "...", si: "...", ta: "..." },
  category: "training",
  price: 25000
});
```

### **Permits & Licenses**
```javascript
import { submitPermitApplication, getPermitApplications } from '@/services/maritimeService';

// Submit permit application
const result = await submitPermitApplication({
  userId: currentUser.uid,
  type: 'fishing_license',
  applicantName: 'John Doe',
  vesselName: 'Blue Ocean',
  applicationData: { ... }
});

// Get user's applications
const myPermits = await getPermitApplications(currentUser.uid);
```

### **Weather & Alerts**
```javascript
import { getWeatherData, subscribeToWeather, getMaritimeAlerts } from '@/services/maritimeService';

// Get current weather
const weather = await getWeatherData();

// Subscribe to real-time weather
const unsubscribe = subscribeToWeather((weatherData) => {
  console.log('Weather update:', weatherData);
});

// Get active alerts
const alerts = await getMaritimeAlerts(true);
```

---

## 🎨 Admin Panel Integration

### Location
`/admin/maritime` - Maritime Services Admin Panel

### Features
1. **Vessel Management**
   - Add/edit/delete vessels
   - Update vessel positions
   - View vessel history
   - Assign missions

2. **Port Operations**
   - Update port status
   - Manage vessel arrivals/departures
   - Set capacity limits
   - Weather updates

3. **Service Management**
   - Create/edit services (trilingual)
   - Set pricing
   - Manage availability
   - Service categories

4. **Permit Administration**
   - Review applications
   - Approve/reject permits
   - Set expiry dates
   - Document verification

5. **Alert System**
   - Create maritime alerts
   - Set severity levels
   - Affected areas
   - Expiry management

6. **Booking Management**
   - View all bookings
   - Confirm/cancel bookings
   - Payment tracking
   - Customer communication

---

## 🌐 Trilingual Implementation

### Content Structure
```javascript
// /src/locales/en/maritime.json
{
  "hero": {
    "title": "Maritime Services Hub",
    "subtitle": "Comprehensive maritime operations & services",
    "cta": "View Services"
  },
  "services": {
    "inspection": "Vessel Inspection",
    "permits": "Permits & Licenses",
    "training": "Safety Training"
  }
}

// /src/locales/si/maritime.json
{
  "hero": {
    "title": "සමුද්‍ර සේවා කේන්ද්‍රය",
    "subtitle": "සම්පූර්ණ සමුද්‍ර මෙහෙයුම් සහ සේවා",
    "cta": "සේවා බලන්න"
  }
}

// /src/locales/ta/maritime.json
{
  "hero": {
    "title": "கடல்சார் சேவைகள் மையம்",
    "subtitle": "விரிவான கடல் செயல்பாடுகள் & சேவைகள்",
    "cta": "சேவைகளைப் பார்க்கவும்"
  }
}
```

### Usage in Components
```javascript
import { useTranslation } from 'react-i18next';

const MaritimeServices = () => {
  const { t, i18n } = useTranslation('maritime');
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
      <button>{t('hero.cta')}</button>
    </div>
  );
};
```

---

## 📡 External API Integrations

### 1. **AIS (Automatic Identification System)**
Real-time vessel tracking

```javascript
// External API endpoint (example)
const AIS_API = 'https://api.ais.com/v1/vessels';

async function fetchAISData() {
  const response = await fetch(`${AIS_API}?region=sri-lanka`, {
    headers: {
      'Authorization': `Bearer ${process.env.REACT_APP_AIS_API_KEY}`
    }
  });
  const vessels = await response.json();
  
  // Sync with Firebase
  for (const vessel of vessels) {
    await updateVesselPosition(vessel.id, vessel.position);
  }
}
```

### 2. **Weather API**
```javascript
// OpenWeatherMap or similar
const WEATHER_API = 'https://api.openweathermap.org/data/2.5/weather';

async function updateWeatherData() {
  const zones = ['colombo', 'galle', 'trincomalee'];
  
  for (const zone of zones) {
    const response = await fetch(
      `${WEATHER_API}?q=${zone},lk&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
    );
    const data = await response.json();
    
    // Update Firebase
    await updateWeatherData({
      zone,
      temperature: data.main.temp,
      condition: data.weather[0].main,
      windSpeed: data.wind.speed
    });
  }
}
```

### 3. **Port Authority API**
```javascript
// Sri Lanka Ports Authority integration
async function syncPortData() {
  const response = await fetch('https://ports.gov.lk/api/status');
  const portData = await response.json();
  
  for (const port of portData.ports) {
    await updatePortStatus(port.code, {
      vessels: port.vessel_count,
      capacity: port.occupancy_rate
    });
  }
}
```

---

## 🚀 Deployment Checklist

### Firebase Setup
- [ ] Create Firestore collections
- [ ] Set up security rules
- [ ] Configure indexes
- [ ] Set up Firebase Functions for cron jobs

### Environment Variables
```bash
# .env
REACT_APP_AIS_API_KEY=your_ais_api_key
REACT_APP_WEATHER_API_KEY=your_weather_api_key
REACT_APP_GOOGLE_MAPS_KEY=your_maps_api_key
```

### Security Rules (firestore.rules)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read for vessels, ports, weather
    match /maritime_vessels/{vessel} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /maritime_ports/{port} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // User-specific permits
    match /maritime_permits/{permit} {
      allow read: if request.auth != null && 
                     (resource.data.userId == request.auth.uid ||
                      request.auth.token.admin == true);
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

---

## 📊 Real-Time Updates Implementation

### Component Example
```javascript
import { useEffect, useState } from 'react';
import { subscribeToVessels, subscribeToWeather } from '@/services/maritimeService';

const LiveMaritimeDashboard = () => {
  const [vessels, setVessels] = useState([]);
  const [weather, setWeather] = useState(null);
  
  useEffect(() => {
    // Subscribe to vessels
    const unsubscribeVessels = subscribeToVessels((data) => {
      setVessels(data);
    });
    
    // Subscribe to weather
    const unsubscribeWeather = subscribeToWeather((data) => {
      setWeather(data);
    });
    
    // Cleanup
    return () => {
      unsubscribeVessels();
      unsubscribeWeather();
    };
  }, []);
  
  return (
    <div>
      <h2>Live Vessels: {vessels.length}</h2>
      {vessels.map(vessel => (
        <VesselCard key={vessel.id} vessel={vessel} />
      ))}
    </div>
  );
};
```

---

## 📱 Mobile Responsive Design

### Breakpoints
- Mobile: 320px - 768px
- Tablet: 769px - 1024px
- Desktop: 1025px+

### Key Features
- Touch-friendly buttons (min 44x44px)
- Swipeable vessel cards
- Collapsible sections
- Bottom navigation for mobile

---

## 🎯 Key Features Summary

✅ **Real-Time Vessel Tracking** - Live positions, speed, heading
✅ **Port Operations Dashboard** - Capacity, weather, vessel count
✅ **Permit System** - Apply, track, download
✅ **Weather Integration** - Multiple zones, forecasts
✅ **Maritime Alerts** - Severity-based notifications
✅ **Service Booking** - Reserve inspections, training
✅ **Safety Reporting** - Incident documentation
✅ **Trilingual Support** - EN/SI/TA throughout
✅ **Admin Panel** - Full CRUD operations
✅ **Live Data APIs** - External integrations

---

Last Updated: 2025-10-13  
Version: 1.0.0
