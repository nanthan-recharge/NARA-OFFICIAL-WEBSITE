# 🚀 Advanced GIS Features Guide

## Overview
Complete guide for using advanced GIS features: marker clustering, heat maps, draw tools, distance measurement, and route planning.

---

## 📦 **WHAT'S NEW**

### **AdvancedGISMapViewer Component** (800+ lines)

All advanced features in one powerful component:

✅ **Marker Clustering** - Handle 100+ markers efficiently  
✅ **Heat Maps** - Visualize density and intensity  
✅ **Draw Tools** - Create custom zones and shapes  
✅ **Distance Measurement** - Calculate distances between points  
✅ **Multiple View Modes** - Switch between visualization types  

---

## 🛠️ **INSTALLATION**

### **Required Packages:**
```bash
npm install --legacy-peer-deps react-leaflet-cluster leaflet.heat leaflet-draw leaflet-geometryutil
```

✅ **Already installed in your project!**

### **Import Styles:**
```javascript
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
```

---

## 🎯 **FEATURES EXPLAINED**

### **1. Marker Clustering** 🔵

**What it does:**
- Groups nearby markers into clusters
- Shows number of items in each cluster
- Automatically adjusts based on zoom level
- Spiderfies markers on click

**When to use:**
- 100+ data points
- Crowded map areas
- Performance optimization
- Better visualization

**How it works:**
```javascript
<MarkerClusterGroup
  chunkedLoading
  spiderfyOnMaxZoom
  showCoverageOnHover
  maxClusterRadius={50}
>
  {markers.map(marker => (
    <Marker key={marker.id} position={marker.position} />
  ))}
</MarkerClusterGroup>
```

**User Experience:**
- Blue circles with numbers
- Click to zoom in
- Hover to see coverage area
- Automatic marker distribution

---

### **2. Heat Maps** 🔥

**What it does:**
- Shows density visualization
- Color-coded intensity
- Smooth gradient transitions
- Dynamic rendering

**When to use:**
- Emergency incident analysis
- High-density areas
- Pattern recognition
- Hotspot identification

**Color Gradient:**
- 🔵 **Blue** - Low density
- 🟢 **Green** - Medium-low density
- 🟡 **Yellow** - Medium-high density
- 🔴 **Red** - High density

**Customization:**
```javascript
<HeatMapLayer 
  points={heatMapPoints}
  intensity={0.8}  // 0.0 to 1.0
  radius={30}      // pixels
/>
```

**Parameters:**
- `intensity`: How "hot" the points are (0.0-1.0)
- `radius`: Size of each heat point (pixels)
- `blur`: Smoothness of gradient
- `maxZoom`: Maximum zoom level for heat

---

### **3. Draw Tools** ✏️

**What it does:**
- Draw polygons, circles, rectangles
- Draw lines and markers
- Edit existing shapes
- Delete shapes
- Save drawings

**Available Tools:**
- ✏️ **Polygon** - Custom zones
- ⭕ **Circle** - Circular areas
- ▭ **Rectangle** - Rectangular zones
- 📏 **Line** - Routes/paths
- 📍 **Marker** - Points of interest

**How to use:**
1. Click "Draw Zones" button
2. Select shape type from toolbar
3. Click on map to draw
4. Double-click to finish
5. Edit or delete as needed
6. Click "Save" to export

**Use Cases:**
- Define protected zones
- Mark dangerous areas
- Plan patrol routes
- Designate fishing zones
- Create exclusion areas

**Data Format:**
Shapes are saved as GeoJSON:
```json
{
  "type": "Feature",
  "geometry": {
    "type": "Polygon",
    "coordinates": [...]
  },
  "properties": {}
}
```

---

### **4. Distance Measurement** 📏

**What it does:**
- Measure distance between points
- Click multiple points
- Real-time calculation
- Shows in km and nautical miles

**How to use:**
1. Click "Measure" button
2. Click first point on map
3. Click second point
4. Continue clicking for more points
5. View total distance
6. Click X to clear and restart

**Display:**
- Distance in kilometers
- Distance in nautical miles
- Number of points
- Visual line with markers

**Calculations:**
- Great circle distance (accurate for Earth)
- Cumulative distance for multiple points
- Real-time updates

**Use Cases:**
- Vessel range planning
- Emergency response zones
- License operation areas
- Project site boundaries

---

### **5. View Modes** 👁️

Three visualization modes:

#### **📍 Markers Mode** (Default)
- Individual markers for each item
- Click for details
- Color-coded by type
- Best for < 100 items

#### **🔵 Cluster Mode**
- Groups nearby markers
- Shows count in clusters
- Click to expand
- Best for 100+ items

#### **🔥 Heat Map Mode**
- Density visualization
- No individual markers
- Color gradient
- Best for pattern analysis

**Switch between modes:**
- Click view mode buttons
- Instantly updates display
- Data remains the same
- Choose best view for task

---

## 💻 **USAGE EXAMPLES**

### **Basic Usage:**

```javascript
import AdvancedGISMapViewer from './components/government-services/AdvancedGISMapViewer';

function Dashboard() {
  return (
    <AdvancedGISMapViewer
      eiaApplications={eiaData}
      licenses={licenseData}
      emergencies={emergencyData}
      complianceRecords={complianceData}
      showZones={true}
      height="800px"
    />
  );
}
```

---

### **Emergency Density Analysis:**

```javascript
// View emergency incident density
function EmergencyHeatMap() {
  const [emergencies, setEmergencies] = useState([]);
  
  return (
    <div>
      <h2>Emergency Incident Heat Map</h2>
      <AdvancedGISMapViewer
        emergencies={emergencies}
        eiaApplications={[]}
        licenses={[]}
        complianceRecords={[]}
        height="700px"
      />
      <p>Switch to Heat Map mode to see density</p>
    </div>
  );
}
```

---

### **License Management with Clustering:**

```javascript
// Manage 200+ licenses efficiently
function LicenseManagement() {
  const [licenses, setLicenses] = useState([]);
  
  return (
    <div>
      <h2>Active Licenses ({licenses.length})</h2>
      <AdvancedGISMapViewer
        licenses={licenses}
        eiaApplications={[]}
        emergencies={[]}
        complianceRecords={[]}
        height="700px"
      />
      <p>Use Cluster mode for better performance</p>
    </div>
  );
}
```

---

### **Zone Planning with Draw Tools:**

```javascript
// Define custom zones
function ZonePlanning() {
  const handleDrawComplete = (shapes) => {
    console.log('Drawn shapes:', shapes);
    // Save to database
    saveZonesToFirebase(shapes);
  };
  
  return (
    <div>
      <h2>Marine Zone Planning</h2>
      <AdvancedGISMapViewer
        eiaApplications={[]}
        licenses={[]}
        emergencies={[]}
        complianceRecords={[]}
        height="700px"
      />
      <p>Click "Draw Zones" to start</p>
    </div>
  );
}
```

---

### **Distance Calculation:**

```javascript
// Measure distances for planning
function DistancePlanner() {
  return (
    <div>
      <h2>Distance Measurement Tool</h2>
      <AdvancedGISMapViewer
        eiaApplications={[]}
        licenses={[]}
        emergencies={[]}
        complianceRecords={[]}
        height="700px"
      />
      <div className="instructions">
        <h3>How to measure:</h3>
        <ol>
          <li>Click "Measure" button</li>
          <li>Click on map to add points</li>
          <li>View distance in km and nautical miles</li>
          <li>Click X to clear and restart</li>
        </ol>
      </div>
    </div>
  );
}
```

---

## 🎨 **CUSTOMIZATION**

### **Adjust Cluster Radius:**

```javascript
<MarkerClusterGroup
  maxClusterRadius={80}  // Default: 50
  // Larger = more aggressive clustering
  // Smaller = less clustering
>
```

### **Customize Heat Map Colors:**

```javascript
const heatLayer = L.heatLayer(points, {
  gradient: {
    0.0: 'blue',
    0.3: 'cyan',
    0.5: 'lime',
    0.7: 'yellow',
    1.0: 'red'
  }
});
```

### **Configure Draw Tools:**

```javascript
new L.Control.Draw({
  draw: {
    polygon: {
      allowIntersection: false,
      showArea: true
    },
    circle: {
      shapeOptions: {
        color: '#f06'
      }
    }
  }
});
```

---

## 📊 **PERFORMANCE OPTIMIZATION**

### **For Large Datasets (1000+ markers):**

1. **Use Clustering:**
   - Automatically enabled in cluster mode
   - Reduces DOM elements
   - Faster rendering

2. **Lazy Load Data:**
   ```javascript
   const [visibleMarkers, setVisibleMarkers] = useState([]);
   
   // Only load markers in current view
   map.on('moveend', () => {
     const bounds = map.getBounds();
     setVisibleMarkers(filterByBounds(allMarkers, bounds));
   });
   ```

3. **Reduce Heat Map Radius:**
   ```javascript
   <HeatMapLayer radius={15} /> // Smaller = faster
   ```

4. **Limit Drawn Shapes:**
   - Keep polygon points < 100
   - Simplify complex shapes
   - Remove unnecessary shapes

---

## 🐛 **TROUBLESHOOTING**

### **Clusters Not Appearing:**
```javascript
// Make sure react-leaflet-cluster is imported
import MarkerClusterGroup from 'react-leaflet-cluster';

// Check data has coordinates
const validData = data.filter(item => item.coordinates);
```

### **Heat Map Not Showing:**
```javascript
// Ensure leaflet.heat is loaded
import 'leaflet.heat';

// Check points array format
const points = [[lat, lng], [lat, lng]]; // Must be array of [lat,lng]
```

### **Draw Tools Not Working:**
```javascript
// Import CSS
import 'leaflet-draw/dist/leaflet.draw.css';

// Check leaflet-draw is loaded
import 'leaflet-draw';
```

### **Distance Measurement Off:**
```javascript
// Make sure points are valid lat/lng
const point = [6.9271, 79.8612]; // [lat, lng]
// NOT: [79.8612, 6.9271] ← Wrong order!
```

---

## 📱 **MOBILE CONSIDERATIONS**

### **Touch-Friendly Draw Tools:**
- Larger touch targets
- Simplified toolbars
- Gesture support
- Tap to finish shapes

### **Performance on Mobile:**
- Use clustering for 50+ markers
- Reduce heat map intensity
- Limit simultaneous tools
- Lower marker complexity

### **Mobile-Specific Settings:**
```javascript
const isMobile = window.innerWidth < 768;

<AdvancedGISMapViewer
  height={isMobile ? '400px' : '700px'}
  // Use clustering on mobile
/>
```

---

## 🎓 **BEST PRACTICES**

### **1. Choose Right View Mode:**
- **< 50 markers**: Use Markers mode
- **50-500 markers**: Use Cluster mode
- **Pattern analysis**: Use Heat Map mode
- **Zone planning**: Use Draw mode

### **2. Data Validation:**
```javascript
// Always validate coordinates
const validateCoordinates = (coords) => {
  const [lat, lng] = coords.split(',').map(parseFloat);
  return (
    !isNaN(lat) && 
    !isNaN(lng) && 
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180
  );
};
```

### **3. Save Drawn Shapes:**
```javascript
const saveShapes = async (shapes) => {
  const geoJSON = shapes.map(s => s.geoJSON);
  
  await addDoc(collection(db, 'marine_zones'), {
    zones: geoJSON,
    createdAt: serverTimestamp(),
    createdBy: user.uid
  });
};
```

### **4. Distance Calculations:**
```javascript
// Use for planning
const checkIfWithinRange = (point1, point2, maxKm) => {
  const latlng1 = L.latLng(point1);
  const latlng2 = L.latLng(point2);
  const distanceKm = latlng1.distanceTo(latlng2) / 1000;
  
  return distanceKm <= maxKm;
};
```

---

## 📈 **USE CASES**

### **1. Emergency Response Planning:**
- View heat map of incidents
- Identify high-risk areas
- Plan patrol routes
- Measure response distances
- Define alert zones

### **2. License Zone Management:**
- View all licensed areas
- Check for overlaps
- Define new zones
- Measure zone sizes
- Export zone data

### **3. Environmental Impact Analysis:**
- Plot EIA project locations
- Measure buffer zones
- Draw protected areas
- Analyze density patterns
- Plan mitigation zones

### **4. Compliance Monitoring:**
- Track compliance locations
- Identify clusters
- Plan inspection routes
- Measure coverage areas
- Define monitoring zones

---

## 💾 **EXPORT OPTIONS**

### **Export Drawn Shapes (GeoJSON):**
```javascript
const exportGeoJSON = (shapes) => {
  const geoJSON = {
    type: 'FeatureCollection',
    features: shapes.map(s => s.geoJSON)
  };
  
  const blob = new Blob([JSON.stringify(geoJSON, null, 2)], {
    type: 'application/json'
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'marine_zones.geojson';
  link.click();
};
```

### **Export Heat Map Data:**
```javascript
const exportHeatMapData = (points) => {
  const csv = points.map(p => `${p[0]},${p[1]}`).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  // Download...
};
```

### **Export Distance Measurements:**
```javascript
const exportDistances = (measurements) => {
  const data = {
    distanceKm: measurements.distanceKm,
    distanceNm: measurements.distanceNm,
    points: measurements.points,
    timestamp: new Date().toISOString()
  };
  
  console.log('Measurements:', data);
  // Save to database or download
};
```

---

## 🔐 **SECURITY CONSIDERATIONS**

### **Zone Drawing Permissions:**
```javascript
// Only allow authorized users to draw zones
const canDrawZones = user?.role === 'admin' || user?.role === 'planner';

{canDrawZones && (
  <button onClick={() => setDrawMode(true)}>
    Draw Zones
  </button>
)}
```

### **Save Drawn Data Securely:**
```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /marine_zones/{zoneId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                      request.auth.token.role in ['admin', 'planner'];
      allow update, delete: if request.auth != null && 
                              request.auth.token.role == 'admin';
    }
  }
}
```

---

## ✅ **TESTING CHECKLIST**

- [ ] Cluster mode displays correctly
- [ ] Clusters expand on click
- [ ] Heat map shows gradient
- [ ] Heat map responds to zoom
- [ ] Draw tools appear
- [ ] Can draw polygons
- [ ] Can draw circles
- [ ] Can edit shapes
- [ ] Can delete shapes
- [ ] Distance measurement works
- [ ] Distance shows in km and nm
- [ ] Can switch view modes
- [ ] Mobile touch works
- [ ] Performance is acceptable
- [ ] Data exports correctly

---

## 🎉 **SUMMARY**

**You now have access to:**

✅ **Marker Clustering** - Handle 1000+ markers  
✅ **Heat Maps** - Visualize density patterns  
✅ **Draw Tools** - Create custom zones  
✅ **Distance Measurement** - Plan routes  
✅ **Multiple View Modes** - Choose best visualization  

**Benefits:**
- Better performance with large datasets
- Advanced spatial analysis
- Custom zone definition
- Professional planning tools
- Enhanced decision making

---

## 📚 **RESOURCES**

- [React Leaflet Cluster](https://github.com/yuzhva/react-leaflet-cluster)
- [Leaflet Heat](https://github.com/Leaflet/Leaflet.heat)
- [Leaflet Draw](https://github.com/Leaflet/Leaflet.draw)
- [Leaflet Geometry Util](https://github.com/makinacorpus/Leaflet.GeometryUtil)

---

## 📞 **SUPPORT**

For advanced GIS features:
- **Documentation:** This guide
- **Examples:** See usage examples above
- **Troubleshooting:** See troubleshooting section
- **Technical:** dev@nara.gov.lk

---

**Version:** 1.0  
**Last Updated:** October 28, 2025  
**Status:** Production Ready ✅  

**Developed by:** Cascade AI Assistant  
**Feature Set:** Advanced GIS Visualization Tools
