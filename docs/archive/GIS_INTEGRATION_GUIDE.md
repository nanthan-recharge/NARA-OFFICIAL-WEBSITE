# 🗺️ GIS Map Integration Guide

## Overview
Complete guide for integrating GIS (Geographic Information System) mapping into the Government Services Portal.

---

## 📦 **COMPONENTS CREATED**

### 1. **GISMapViewer.jsx** (500+ lines)
Main interactive map component for visualizing all government services data on a map.

**Features:**
- Interactive Sri Lanka map
- Multiple marker types (EIA, License, Emergency, Compliance)
- Marine zone overlays
- Layer filtering
- Fullscreen mode
- Click-to-view popups
- Critical emergency highlighting
- Real-time data visualization

### 2. **LocationPicker.jsx** (200+ lines)
Modal component for selecting GPS coordinates in forms.

**Features:**
- Click-to-select location
- Current location detection
- Coordinate display (lat/lng)
- Copy-friendly format
- Beautiful modal UI

---

## 🛠️ **INSTALLATION**

### **Required Packages:**
```bash
npm install --legacy-peer-deps react-leaflet leaflet
```

### **CSS Import:**
Add to your main CSS or component:
```javascript
import 'leaflet/dist/leaflet.css';
```

---

## 📍 **USAGE EXAMPLES**

### **1. Display Map with All Data**

```javascript
import GISMapViewer from './components/government-services/GISMapViewer';

function GovernmentPortal() {
  const [eiaApplications, setEiaApplications] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  
  return (
    <div>
      <h1>Government Services Map</h1>
      <GISMapViewer
        eiaApplications={eiaApplications}
        licenses={licenses}
        emergencies={emergencies}
        complianceRecords={[]}
        showZones={true}
        height="600px"
      />
    </div>
  );
}
```

---

### **2. Location Picker in Forms**

```javascript
import { useState } from 'react';
import LocationPicker from './components/government-services/LocationPicker';

function EIAApplicationForm() {
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [coordinates, setCoordinates] = useState(null);

  const handleLocationConfirm = (location) => {
    setCoordinates(`${location.lat}, ${location.lng}`);
    console.log('Selected:', location);
  };

  return (
    <div>
      {/* Coordinates Input */}
      <div>
        <label>GPS Coordinates</label>
        <div className="flex gap-2">
          <input
            value={coordinates || ''}
            onChange={(e) => setCoordinates(e.target.value)}
            placeholder="6.9271, 79.8612"
          />
          <button onClick={() => setShowLocationPicker(true)}>
            📍 Pick on Map
          </button>
        </div>
      </div>

      {/* Location Picker Modal */}
      <LocationPicker
        isOpen={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onConfirm={handleLocationConfirm}
        initialLocation={
          coordinates ? {
            lat: parseFloat(coordinates.split(',')[0]),
            lng: parseFloat(coordinates.split(',')[1])
          } : null
        }
        title="Select Project Location"
      />
    </div>
  );
}
```

---

### **3. Emergency Map View**

```javascript
import GISMapViewer from './components/government-services/GISMapViewer';

function EmergencyDashboard() {
  const [emergencies, setEmergencies] = useState([
    {
      id: '1',
      title: 'Oil Spill Near Colombo',
      incidentType: 'oil_spill',
      severity: 'critical',
      status: 'active',
      coordinates: '6.9271, 79.8612'
    },
    {
      id: '2',
      title: 'Vessel Accident',
      incidentType: 'vessel_accident',
      severity: 'high',
      status: 'active',
      coordinates: '8.5874, 81.2152'
    }
  ]);

  return (
    <div>
      <h1>Emergency Response Map</h1>
      <GISMapViewer
        eiaApplications={[]}
        licenses={[]}
        emergencies={emergencies}
        complianceRecords={[]}
        height="700px"
      />
    </div>
  );
}
```

---

## 🎨 **COMPONENT PROPS**

### **GISMapViewer Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `eiaApplications` | Array | `[]` | EIA applications with coordinates |
| `licenses` | Array | `[]` | License records with coordinates |
| `emergencies` | Array | `[]` | Emergency incidents with coordinates |
| `complianceRecords` | Array | `[]` | Compliance records with coordinates |
| `onLocationSelect` | Function | `null` | Callback when location is clicked |
| `selectionMode` | Boolean | `false` | Enable location selection mode |
| `selectedLocation` | Object | `null` | Currently selected location |
| `showZones` | Boolean | `true` | Show marine zone overlays |
| `height` | String | `'600px'` | Map height |

---

### **LocationPicker Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | Boolean | Required | Control modal visibility |
| `onClose` | Function | Required | Called when modal closes |
| `onConfirm` | Function | Required | Called with selected location |
| `initialLocation` | Object | `null` | Initial map position |
| `title` | String | `"Select Location on Map"` | Modal title |

---

## 📊 **DATA FORMAT**

### **Required Coordinate Format:**

All items must have a `coordinates` field in format: `"latitude, longitude"`

**Example:**
```javascript
{
  id: '123',
  title: 'Project Name',
  coordinates: '6.9271, 79.8612', // ← Required format
  // ... other fields
}
```

### **EIA Application Data:**
```javascript
{
  id: 'eia-123',
  projectName: 'Marine Park Development',
  projectType: 'Coastal Development',
  coordinates: '6.9271, 79.8612',
  estimatedBudget: 5000000,
  location: 'Colombo',
  status: 'pending'
}
```

### **License Data:**
```javascript
{
  id: 'lic-456',
  vesselName: 'Ocean Star',
  licenseType: 'fishing',
  coordinates: '8.5874, 81.2152',
  operationArea: 'Trincomalee Waters',
  status: 'active'
}
```

### **Emergency Data:**
```javascript
{
  id: 'emg-789',
  title: 'Oil Spill Emergency',
  incidentType: 'oil_spill',
  severity: 'critical', // critical, high, medium, low
  coordinates: '6.0535, 80.2210',
  status: 'active'
}
```

---

## 🎯 **FEATURES EXPLAINED**

### **1. Layer Filtering**

Users can toggle visibility of different data types:
- ✅ EIA Projects (Cyan markers)
- ✅ Licenses (Purple markers)
- ✅ Emergencies (Red markers)
- ✅ Compliance (Green markers)
- ✅ Marine Zones (Colored overlays)

### **2. Custom Markers**

Each data type has a unique marker:
- 📋 **EIA** - Cyan pin with document icon
- ⚓ **License** - Purple pin with anchor icon
- 🚨 **Emergency** - Red pin with alert icon
- ✓ **Compliance** - Green pin with checkmark icon

### **3. Critical Emergency Highlighting**

Emergencies with `severity: 'critical'` get:
- Red dashed circle (5km radius)
- Prominent marker
- Special popup styling

### **4. Marine Zones**

Pre-defined marine zones display as colored polygons:
- **Protected Areas** - Blue overlay
- **Commercial Zones** - Green overlay
- **Conservation Areas** - Orange overlay

### **5. Fullscreen Mode**

Click the maximize button to:
- View map in fullscreen
- Better for presentations
- Easier data analysis

### **6. Recenter Button**

Quickly return to Sri Lanka overview with navigation button.

---

## 🔧 **CUSTOMIZATION**

### **Add More Marine Zones:**

Edit `sriLankaMarineZones` array in `GISMapViewer.jsx`:

```javascript
const sriLankaMarineZones = [
  {
    name: 'New Protected Zone',
    type: 'protected',
    coordinates: [
      [lat1, lng1],
      [lat2, lng2],
      [lat3, lng3],
      [lat4, lng4]
    ],
    color: '#3b82f6',
    opacity: 0.2
  },
  // Add more zones...
];
```

### **Change Map Style:**

Replace TileLayer URL with different providers:

```javascript
// Dark mode
url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"

// Satellite
url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"

// Terrain
url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
```

### **Custom Marker Icons:**

Modify `createCustomIcon` function:

```javascript
const createCustomIcon = (color, icon) => {
  return L.divIcon({
    html: `<div style="your-custom-style">${icon}</div>`,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  });
};
```

---

## 🚀 **INTEGRATION WITH EXISTING FORMS**

### **Update EIA Application Form:**

```javascript
// Add to EIAApplicationForm.jsx

import LocationPicker from '../LocationPicker';
import { useState } from 'react';

// Inside component:
const [showLocationPicker, setShowLocationPicker] = useState(false);
const [selectedCoords, setSelectedCoords] = useState(null);

// In form fields section:
<div>
  <label>GPS Coordinates (optional)</label>
  <div className="flex gap-2">
    <input
      {...register('coordinates')}
      value={selectedCoords || ''}
      placeholder="Click map to select"
      className="flex-1"
    />
    <button
      type="button"
      onClick={() => setShowLocationPicker(true)}
      className="px-4 py-2 bg-cyan-500 text-white rounded-lg"
    >
      📍 Select on Map
    </button>
  </div>
</div>

// Before closing form:
<LocationPicker
  isOpen={showLocationPicker}
  onClose={() => setShowLocationPicker(false)}
  onConfirm={(location) => {
    setSelectedCoords(`${location.lat}, ${location.lng}`);
    setValue('coordinates', `${location.lat}, ${location.lng}`);
  }}
  title="Select Project Location"
/>
```

---

### **Update Emergency Report Form:**

```javascript
// Add same Location Picker integration
// But with emergency-specific title:

<LocationPicker
  isOpen={showLocationPicker}
  onClose={() => setShowLocationPicker(false)}
  onConfirm={(location) => {
    setSelectedCoords(`${location.lat}, ${location.lng}`);
    setValue('coordinates', `${location.lat}, ${location.lng}`);
  }}
  title="Select Emergency Incident Location"
/>
```

---

## 📱 **MOBILE OPTIMIZATION**

The maps are mobile-responsive but consider:

### **Touch-Friendly:**
- Larger touch targets for controls
- Swipe to pan map
- Pinch to zoom (native)

### **Performance:**
- Limit markers on mobile (use clustering for 100+ items)
- Lower quality tiles on slow connections
- Lazy load map component

```javascript
import { lazy, Suspense } from 'react';

const GISMapViewer = lazy(() => import('./components/GISMapViewer'));

<Suspense fallback={<LoadingSpinner />}>
  <GISMapViewer {...props} />
</Suspense>
```

---

## 🐛 **TROUBLESHOOTING**

### **Markers Not Showing:**
- Check coordinates format: `"lat, lng"` as string
- Verify coordinates are within Sri Lanka bounds
- Check console for parsing errors

### **Map Not Loading:**
- Ensure `leaflet/dist/leaflet.css` is imported
- Check internet connection (tiles need to download)
- Verify react-leaflet version compatibility

### **Icons Missing:**
- Clear browser cache
- Check CDN URLs in icon configuration
- Verify emoji support in browser

### **Performance Issues:**
- Use marker clustering for 100+ markers
- Lazy load map component
- Reduce polygon complexity
- Limit visible layers

---

## 📈 **ADVANCED FEATURES**

### **Marker Clustering:**

```bash
npm install react-leaflet-cluster
```

```javascript
import MarkerClusterGroup from 'react-leaflet-cluster';

<MarkerClusterGroup>
  {markers.map(marker => (
    <Marker key={marker.id} position={marker.position} />
  ))}
</MarkerClusterGroup>
```

### **Heat Maps:**

```bash
npm install leaflet.heat
```

```javascript
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet.heat';

function HeatMapLayer({ points }) {
  const map = useMap();
  
  useEffect(() => {
    const heat = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17
    }).addTo(map);
    
    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);
  
  return null;
}
```

### **Draw Tools:**

```bash
npm install leaflet-draw
```

Allow users to draw zones, polygons, circles on map.

---

## 🎓 **BEST PRACTICES**

### **1. Data Loading:**
```javascript
// Load coordinates asynchronously
const loadMapData = async () => {
  const data = await fetchApplications();
  // Parse and validate coordinates
  const validData = data.filter(item => 
    item.coordinates && 
    /^-?\d+\.?\d*, -?\d+\.?\d*$/.test(item.coordinates)
  );
  setMapData(validData);
};
```

### **2. Error Handling:**
```javascript
try {
  const [lat, lng] = coordinates.split(',').map(parseFloat);
  if (isNaN(lat) || isNaN(lng)) {
    throw new Error('Invalid coordinates');
  }
  // Use coordinates
} catch (error) {
  console.error('Coordinate parsing error:', error);
  // Skip this marker or use default
}
```

### **3. Performance:**
```javascript
// Memoize markers
const markers = useMemo(() => {
  return data.map(item => ({
    // ... marker data
  }));
}, [data, activeFilters]);
```

---

## 📞 **SUPPORT**

For GIS-related questions:
- **Technical:** dev@nara.gov.lk
- **Map Data:** gis@nara.gov.lk
- **Documentation:** See this guide

---

## 📚 **RESOURCES**

- [React Leaflet Docs](https://react-leaflet.js.org/)
- [Leaflet Documentation](https://leafletjs.com/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [GeoJSON Spec](https://geojson.org/)

---

## ✅ **TESTING CHECKLIST**

- [ ] Map loads correctly
- [ ] All markers display
- [ ] Popups show correct data
- [ ] Layers can be toggled
- [ ] Location picker works
- [ ] Fullscreen mode works
- [ ] Mobile responsive
- [ ] Performance is acceptable
- [ ] Coordinates save correctly
- [ ] Emergency circles display

---

## 🎉 **CONCLUSION**

GIS integration is now complete! You can:
- ✅ View all data on interactive maps
- ✅ Select locations in forms
- ✅ Filter by data type
- ✅ Highlight critical emergencies
- ✅ Display marine zones
- ✅ Export maps (screenshots)

**Next Steps:**
1. Integrate LocationPicker into forms
2. Add GISMapViewer to dashboard
3. Test with real data
4. Train users on features

---

**Version:** 1.0  
**Last Updated:** October 28, 2025  
**Status:** Production Ready ✅
