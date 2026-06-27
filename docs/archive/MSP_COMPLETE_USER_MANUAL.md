# 🗺️ Marine Spatial Planning Viewer - Complete User Manual

**Version:** 2.0 (Cloud-Enabled)
**Last Updated:** October 28, 2025
**Status:** ✅ Live on Production

---

## 📋 Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Interface Overview](#interface-overview)
4. [Drawing Tools](#drawing-tools)
5. [Research Templates](#research-templates)
6. [Project Management](#project-management)
7. [Cloud Features](#cloud-features)
8. [Data Import](#data-import)
9. [Export Options](#export-options)
10. [Measurement Tools](#measurement-tools)
11. [Best Practices](#best-practices)
12. [Troubleshooting](#troubleshooting)
13. [FAQs](#faqs)

---

## 🌊 Introduction

### What is the Marine Spatial Planning Viewer?

The Marine Spatial Planning (MSP) Viewer is a powerful web-based tool designed for NARA staff and marine researchers to:

- **Map research zones** on interactive Sri Lankan marine maps
- **Document field work** with GPS coordinates, photos, and data
- **Generate professional reports** with maps and statistics
- **Collaborate** with team members across devices
- **Import/Export** GIS data in multiple formats
- **Save to cloud** for access anywhere, anytime

### Who Should Use This Tool?

- 🔬 **Marine Researchers** - Document study areas and survey zones
- 🐟 **Fisheries Officers** - Map fishing grounds and monitoring areas
- 🌿 **Conservation Teams** - Define protected areas and coral reefs
- 📊 **Data Scientists** - Analyze spatial data and trends
- 👥 **Project Managers** - Coordinate multi-site research projects

### Key Benefits

✅ **Cloud-Synced** - Work from office, field, or home
✅ **Collaborative** - Share projects with team members
✅ **Professional** - Generate publication-ready PDF reports
✅ **Flexible** - Import GIS data from other systems
✅ **Offline-Ready** - Works without internet (local save)

---

## 🚀 Getting Started

### Accessing the Tool

**URL:** https://nara-web-73384.web.app/marine-spatial-planning-viewer

**Browser Requirements:**
- Google Chrome (recommended)
- Mozilla Firefox
- Microsoft Edge
- Safari (macOS/iOS)

**No Installation Required** - It's a web application!

---

### First-Time Setup

#### **Step 1: Create an Account (Optional but Recommended)**

For cloud features, you need to sign in:

1. Click **"Sign In"** button (top-right corner)
2. Enter your NARA email address
3. Complete authentication
4. Return to MSP Viewer

**Benefits of Signing In:**
- ☁️ Projects save to cloud
- 📷 Upload photos to zones
- 🔄 Sync across devices
- 👥 Share with colleagues

**Without Sign-In:**
- 💾 Projects save to browser only
- 🚫 No photo uploads
- ⚠️ Data lost if browser cache cleared

---

#### **Step 2: Familiarize with Interface**

The screen is divided into 3 main sections:

```
┌─────────────────────────────────────────┐
│  HEADER (Blue Bar)                      │
│  Project Name | Import | Save | Export  │
├──────────┬──────────────────────────────┤
│          │                              │
│  SIDEBAR │         MAP AREA             │
│  Tools   │    (Interactive Sri Lanka)   │
│  (Left)  │                              │
│          │                              │
│          │                              │
└──────────┴──────────────────────────────┘
```

---

## 🖥️ Interface Overview

### Header Bar (Top)

The blue header contains all main actions:

| Button | Icon | Function |
|--------|------|----------|
| **Projects** | 📁 | Open/Save/Load projects |
| **Import** | ⬆️ | Import GIS data (GeoJSON/KML/CSV) |
| **Save** | 💾 | Save current project |
| **Export** | ⬇️ | Export data (JSON/GeoJSON/CSV/PDF) |
| **Stats** | 📊 | Toggle statistics panel |

**Project Info Display:**
Shows current project name, number of zones, and total area.

---

### Left Sidebar

Four tabs organize all tools:

#### **1. Draw Tab 🖊️**

Tools for creating zones:
- **Polygon** - Draw custom shapes (click points, double-click to finish)
- **Point** - Mark single locations (click once)
- **Undo** - Reverse last action
- **Redo** - Re-apply undone action
- **Clear All** - Delete all zones (with confirmation)

**Drawn Zones List:**
- Shows all created zones
- Click to select
- Trash icon to delete

---

#### **2. Measure Tab 📏**

Tools for measuring distances and areas:

**Distance Tool:**
1. Click "Measure Distance"
2. Click points on map
3. See total distance in km
4. Click "Clear Measurement" when done

**Area Tool:**
1. Click "Measure Area"
2. Click to draw polygon
3. See area in km²
4. Auto-calculates bearing between 2 points

**Results Display:**
- **Distance:** Total path length in kilometers
- **Area:** Enclosed area in square kilometers
- **Bearing:** Direction between two points (degrees)

---

#### **3. Data Tab 💾**

Enter research data for selected zones:

1. Click a zone on the map
2. Switch to Data tab
3. See zone information
4. Enter custom data fields

*Note: Full data entry forms available for each zone type*

---

#### **4. Templates Tab 📋**

Quick-start templates for common research activities:

**10 Pre-Built Templates:**
1. 🌳 **Coral Reef Study Area** (500m × 500m)
2. 🐟 **Fish Population Survey** (1km line transect)
3. 💧 **Water Quality Sampling** (100m radius circle)
4. 🛡️ **Marine Protected Area** (2km × 2km)
5. ⚓ **Fishing Grounds Assessment** (3km × 2km)
6. 🧭 **Oceanographic Station** (Fixed point)
7. 🌊 **Seagrass Meadow Survey** (800m × 600m)
8. 🚢 **Research Vessel Track** (5km route)
9. ⚠️ **Pollution Monitoring** (1km × 1km)
10. 🏠 **Aquaculture Site** (500m × 500m)

**How to Use:**
1. Click template button
2. Click on map to place
3. Adjust size/shape as needed

---

### Map Area (Center)

The main interactive map shows:

**Base Map:**
- OpenStreetMap tiles of Sri Lanka
- Pan by clicking and dragging
- Zoom with scroll wheel or +/- buttons

**Your Zones:**
- Colored polygons, lines, circles, points
- Click to select
- Popup shows details

**Marine Zones (if enabled):**
- Blue = Protected areas
- Green = Commercial zones
- Orange = Conservation areas

---

### Statistics Panel (Right)

Floating panel shows live statistics:

**Overall Stats:**
- Total Zones: Count of drawn zones
- Total Area: Sum of all zone areas (km²)
- Total Distance: Sum of all line lengths (km)

**By Zone Type:**
- Breakdown by research type
- Color-coded by category
- Real-time updates

**Toggle:** Click 📊 button in header to show/hide

---

## 🎨 Drawing Tools

### Drawing a Polygon Zone

**Purpose:** Define irregular research areas (reefs, coastlines, fishing grounds)

**Steps:**
1. Click **Draw** tab in sidebar
2. Click **Polygon** button
3. Click on map to add first point
4. Continue clicking to add corners
5. **Double-click** to complete the polygon
6. Zone appears with color and label

**Tips:**
- More points = more accurate shape
- Follow coastlines naturally
- Don't overlap zones (unless intentional)

**Example Use Cases:**
- Coral reef study areas
- Fish spawning grounds
- Seagrass beds
- Marine protected areas

---

### Placing a Point Marker

**Purpose:** Mark exact locations (sampling stations, dive sites, buoys)

**Steps:**
1. Click **Draw** tab
2. Click **Point** button
3. Click once on map
4. Marker appears with popup

**Tips:**
- Use for precise GPS coordinates
- Good for monitoring stations
- Can add photos to points

**Example Use Cases:**
- Water quality sampling stations
- Oceanographic monitoring buoys
- Fish aggregating devices (FADs)
- Research vessel waypoints

---

### Editing Zones

**Select a Zone:**
- Click any zone on the map
- Zone highlights
- Popup shows details

**Delete a Zone:**
- Click zone in sidebar list
- Click trash icon 🗑️
- Confirm deletion

**Undo/Redo:**
- **Undo** (⬅️) - Reverse last action
- **Redo** (➡️) - Re-apply undone action
- Works for all drawing operations

---

## 📚 Research Templates

### What Are Templates?

Pre-configured zone shapes optimized for specific NARA research activities.

### Benefits:
✅ **Standardized sizes** - Consistency across projects
✅ **Faster setup** - One-click placement
✅ **Pre-loaded fields** - Custom data forms
✅ **Best practices** - Based on NARA protocols

---

### Template Details

#### 1. 🌳 Coral Reef Study Area

**Size:** 500m × 500m square
**Color:** Orange (#f59e0b)

**When to Use:**
- Coral health assessments
- Reef monitoring programs
- Biodiversity surveys
- Climate change studies

**Data Fields:**
- Coral coverage (%)
- Species list
- Health score (1-10)
- Water temperature (°C)
- Visibility (meters)

**Example:**
```
Project: "Hikkaduwa Reef Monitoring 2025"
Zones: 5 coral study grids
Purpose: Annual health assessment
```

---

#### 2. 🐟 Fish Population Survey

**Size:** 1km line transect
**Color:** Blue (#3b82f6)

**When to Use:**
- Fish counting exercises
- Species distribution studies
- Population density estimates
- Behavioral observations

**Data Fields:**
- Species observed
- Individual counts
- Size distribution
- Behavior notes

**Example:**
```
Project: "Trincomalee Fish Census"
Zones: 12 survey transects
Purpose: Annual population survey
```

---

#### 3. 💧 Water Quality Sampling Station

**Size:** 100m radius circle
**Color:** Cyan (#06b6d4)

**When to Use:**
- Regular water monitoring
- Pollution assessments
- Oceanographic studies
- Environmental compliance

**Data Fields:**
- pH level
- Salinity (ppt)
- Dissolved oxygen (mg/L)
- Temperature (°C)
- Turbidity (NTU)
- Nutrients (NO₃, PO₄)

**Example:**
```
Project: "Coastal Water Quality 2025"
Zones: 20 sampling points
Purpose: Monthly monitoring
```

---

#### 4. 🛡️ Marine Protected Area Proposal

**Size:** 2km × 2km large zone
**Color:** Green (#10b981)

**When to Use:**
- MPA planning and design
- Conservation zone proposals
- Zoning plan development
- Management plan areas

**Data Fields:**
- Protection level (strict/moderate/multiple-use)
- Allowed activities
- Restricted activities
- Management plan notes

**Example:**
```
Project: "Batticaloa MPA Proposal"
Zones: 3 protection zones
Purpose: Conservation planning
```

---

#### 5. ⚓ Fishing Grounds Assessment

**Size:** 3km × 2km rectangular zone
**Color:** Purple (#8b5cf6)

**When to Use:**
- Traditional fishing area mapping
- Catch data collection
- Effort analysis
- Conflict zone identification

**Data Fields:**
- Fishing methods used
- Target species
- Catch data (kg/day)
- Fishing effort (hours)

**Example:**
```
Project: "Negombo Fishing Fleet Study"
Zones: 8 fishing grounds
Purpose: Sustainable management
```

---

#### 6. 🧭 Oceanographic Monitoring Station

**Size:** Fixed point (50m buffer)
**Color:** Red (#ef4444)

**When to Use:**
- Permanent monitoring locations
- Sensor deployment sites
- Weather station positions
- Tide gauge locations

**Data Fields:**
- Sensors installed
- Data frequency (hourly/daily)
- Parameters monitored

**Example:**
```
Project: "Ocean Observing Network"
Zones: 15 monitoring stations
Purpose: Real-time data collection
```

---

#### 7. 🌊 Seagrass Meadow Survey

**Size:** 800m × 600m polygon
**Color:** Light Green (#22c55e)

**When to Use:**
- Seagrass bed mapping
- Health assessment
- Carbon stock estimation
- Threat documentation

**Data Fields:**
- Seagrass species
- Density (shoots/m²)
- Health status
- Threats observed

**Example:**
```
Project: "Kalpitiya Seagrass Assessment"
Zones: 6 meadow areas
Purpose: Conservation priority
```

---

#### 8. 🚢 Research Vessel Track

**Size:** 5km route line
**Color:** Light Purple (#a855f7)

**When to Use:**
- Survey cruise planning
- Vessel track logging
- Sampling route design
- Navigation planning

**Data Fields:**
- Vessel name
- Survey type
- Start/end times
- Weather conditions

**Example:**
```
Project: "NARA Vessel Survey July 2025"
Zones: 3 survey routes
Purpose: Oceanographic data collection
```

---

#### 9. ⚠️ Pollution Monitoring Zone

**Size:** 1km × 1km square
**Color:** Dark Red (#dc2626)

**When to Use:**
- Pollution incident response
- Industrial discharge monitoring
- Oil spill assessment
- Waste dumping investigation

**Data Fields:**
- Pollution type
- Severity level
- Source identification
- Measurement data

**Example:**
```
Project: "Colombo Harbor Water Quality"
Zones: 10 monitoring areas
Purpose: Industrial compliance
```

---

#### 10. 🏠 Aquaculture Site Assessment

**Size:** 500m × 500m square
**Color:** Teal (#14b8a6)

**When to Use:**
- Fish farm site selection
- Aquaculture suitability
- Environmental impact assessment
- Carrying capacity studies

**Data Fields:**
- Culture species
- Capacity (tons/year)
- Water flow rate
- Environmental impact notes

**Example:**
```
Project: "Puttalam Lagoon Aquaculture"
Zones: 4 proposed sites
Purpose: Licensing and regulation
```

---

## 💾 Project Management

### Creating a New Project

**Steps:**
1. Click **Projects** button (📁) in header
2. Click **"New Project"** button (green)
3. Existing work is cleared (with confirmation)
4. Start drawing zones
5. Remember to **Save** your work!

---

### Saving Your Project

#### **If Signed In (Cloud Save):**

1. Click **Save** button (💾) in header
2. Project saves to Firebase cloud
3. See message: **"Project saved to cloud successfully!"**
4. Project is now:
   - ☁️ Accessible from any device
   - 🔄 Auto-synced across devices
   - 👥 Shareable with team
   - 📷 Can have photos attached

**What Gets Saved:**
- All drawn zones
- Zone types and labels
- Research data entries
- Measurements
- Comments
- Active layers
- Project metadata

---

#### **If NOT Signed In (Local Save):**

1. Click **Save** button
2. Project saves to browser localStorage
3. See message: **"Project saved locally (sign in for cloud sync)"**
4. Project is:
   - 💻 Only on this browser/device
   - ⚠️ Lost if browser cache cleared
   - 🚫 Cannot be shared
   - 🚫 No photo uploads

**Recommendation:** Sign in for cloud features!

---

### Loading a Saved Project

**Steps:**
1. Click **Projects** button (📁)
2. See list of saved projects
3. Each project shows:
   - Project name
   - Description
   - Number of zones
   - Last modified date
4. Click **"Load"** button on desired project
5. Map updates with project data

**Search/Filter:**
- Projects listed by most recent first
- Use browser search (Ctrl+F) to find projects

---

### Project Information

When you create a project, you can set:

**Basic Info:**
- **Name:** "Trincomalee Reef Survey 2025"
- **Description:** Brief summary of project
- **Researcher:** Your name/team
- **Date:** Auto-filled (can edit)
- **Type:** general/research/monitoring/assessment
- **Status:** draft/active/completed
- **Tags:** Keywords for searching

**How to Edit:**
*Currently: Project properties can be edited by modifying the project object in code. UI for editing project details coming soon.*

---

## ☁️ Cloud Features

### Cloud Sync Status

Look for the sync indicator:

| Icon | Status | Meaning |
|------|--------|---------|
| ☁️ | Synced | Connected to cloud, all saved |
| 🔄 | Syncing | Uploading changes now |
| ⚠️ | Error | Sync failed, check connection |
| 📴 | Offline | Not signed in |

---

### Photo Attachments (🔐 Requires Sign-In + Saved Project)

#### **How to Upload Photos:**

**Backend Ready - UI Button Coming Soon**

Photos are stored in Firebase Storage and linked to specific zones.

**Current Method (For Developers):**
```javascript
await handlePhotoUpload(zoneId, file);
```

**What You Can Upload:**
- JPG/PNG images
- Max 10MB per photo
- Multiple photos per zone
- Automatically linked to project

**Photo Metadata:**
- Uploader email
- Upload timestamp
- Project name
- Zone ID

**Future UI:**
- 📷 Camera button on zone popup
- Gallery view of all photos
- Click to enlarge
- Download original
- Delete button

---

### Real-Time Collaboration (Backend Ready)

**Coming Soon:**

- 👥 Add team members by email
- 🔄 See live updates from colleagues
- 💬 Comment on zones
- 📢 Activity notifications

**How It Will Work:**
1. Save project to cloud
2. Click "Share" button
3. Enter colleague's email
4. They receive access
5. Changes sync instantly

**Current Status:** Backend functions are ready and tested. UI controls will be added in next update.

---

### Activity Logging (Backend Ready)

**Automatic Audit Trail:**

Every action is logged:
- Zone created
- Zone modified
- Zone deleted
- Project saved
- Photo uploaded
- Data entered

**Log Includes:**
- Who did it (user email)
- What they did (action type)
- When (timestamp)
- Where (zone ID)

**Future UI:**
- Activity log panel
- Filter by user/date/action
- Export audit report

---

## 📥 Data Import

### Import Button (New Feature!)

The **indigo Import button** (⬆️) in the header lets you bring in GIS data from other systems.

---

### Supported File Formats

#### **1. GeoJSON (.geojson, .json)**

**Industry Standard** for GIS data exchange.

**Example:**
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[79.8, 6.9], [79.9, 6.9], [79.9, 7.0], [79.8, 7.0], [79.8, 6.9]]]
      },
      "properties": {
        "name": "Study Area 1",
        "type": "coral_reef_study"
      }
    }
  ]
}
```

**Use Cases:**
- Data from QGIS
- ArcGIS exports
- Google Earth Engine
- Open data portals

---

#### **2. KML (.kml)**

**Google Earth Format** for spatial data.

**Example:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <Placemark>
      <name>Research Site</name>
      <Point>
        <coordinates>79.8612,6.9271,0</coordinates>
      </Point>
    </Placemark>
  </Document>
</kml>
```

**Use Cases:**
- Google Earth data
- GPS device exports
- Vessel tracks
- Field surveys

---

#### **3. MSP JSON (.json)**

**Native Format** from this application.

**Example:**
```json
{
  "project": {
    "name": "My Project",
    "date": "2025-10-28"
  },
  "shapes": [
    {
      "id": "shape_1",
      "type": "polygon",
      "positions": [[6.9, 79.8], [6.95, 79.85]],
      "zoneType": "coral_reef_study",
      "color": "#f59e0b"
    }
  ]
}
```

**Use Cases:**
- Backup/restore projects
- Share with colleagues
- Archive old work
- Template creation

---

#### **4. CSV (.csv)**

**Spreadsheet Format** for point data.

**Example:**
```csv
name,type,latitude,longitude,area_km2
"Site 1","coral_reef_study",6.9271,79.8612,0.25
"Site 2","fish_survey",8.5874,81.2152,0.15
```

**Required Columns:**
- latitude (or lat)
- longitude (or lon/lng)

**Optional Columns:**
- name
- type
- Any custom fields

**Use Cases:**
- Excel data
- Database exports
- GPS logs
- Field data sheets

---

### How to Import

**Steps:**
1. Click **Import** button (⬆️) in header
2. File picker opens
3. Select your file (.geojson/.kml/.csv/.json)
4. Click "Open"
5. File is parsed and validated
6. Zones appear on map
7. Success message shows count

**Example:**
```
✅ Successfully imported 12 zones
```

**What Happens:**
- Coordinates converted to Leaflet format
- Zones added to current project
- Colors assigned automatically
- Can undo if needed

**Errors:**
If import fails, you'll see:
```
❌ Import failed: Invalid GeoJSON format
```

Check:
- File format is correct
- Coordinates are valid
- File isn't corrupted

---

### Importing Tips

**✅ Best Practices:**
- Test with small files first (1-10 zones)
- Verify coordinates before import
- Use standard projection (WGS84)
- Include zone names in properties

**⚠️ Common Issues:**
- Wrong coordinate order (should be lat, lng)
- Missing required fields
- Invalid JSON syntax
- Too many zones at once (limit: 1000)

**Coordinate Systems:**
The app expects **WGS84 (EPSG:4326)** coordinates:
- Latitude: -90 to 90
- Longitude: -180 to 180
- Sri Lanka range: Lat 6-10, Lng 79-82

---

## 📤 Export Options

Click the **Export** button (⬇️) to see 4 export formats:

---

### 1. 📄 JSON Data

**Complete Project Backup**

**What's Included:**
- All zones with coordinates
- Research data
- Comments
- Measurements
- Project metadata
- Export timestamp

**When to Use:**
- Full project backup
- Transfer between computers
- Archive completed work
- Share with colleagues (native format)

**File Name:**
```
ProjectName_1730000000000.json
```

**Example Use:**
```
Export → JSON Data
Save to: /Documents/NARA_Projects/backup.json
Later: Import → Select backup.json
```

---

### 2. 🌍 GeoJSON

**GIS-Compatible Format**

**What's Included:**
- Zone geometries
- Basic properties (name, type, color)
- Custom data fields
- GeoJSON standard format

**When to Use:**
- Import to QGIS
- Import to ArcGIS
- Share with GIS professionals
- Web mapping applications
- Open data publication

**File Name:**
```
ProjectName_1730000000000.geojson
```

**Compatible With:**
- QGIS
- ArcGIS Desktop/Pro
- Google Earth Pro
- Leaflet/Mapbox
- Python (geopandas)
- R (sf package)

**Example Workflow:**
```
MSP Viewer → Export GeoJSON
QGIS → Layer → Add Vector Layer
Analyze in QGIS
Generate final maps
```

---

### 3. 📊 CSV Spreadsheet

**Excel-Compatible Data**

**What's Included:**
- Zone name
- Zone type
- Area (km²)
- Perimeter (km)
- Color
- Created date
- All custom data (JSON format)

**When to Use:**
- Statistical analysis in Excel
- Create charts and graphs
- Share with non-GIS users
- Import to databases
- Generate reports

**File Name:**
```
ProjectName_data_1730000000000.csv
```

**Open With:**
- Microsoft Excel
- Google Sheets
- LibreOffice Calc
- R/Python (pandas)

**Example:**
```csv
Zone Name,Type,Area (km²),Color,Created Date
"Coral Site 1","coral_reef_study",0.25,"#f59e0b","2025-10-28"
"Fish Survey A","fish_survey",0.15,"#3b82f6","2025-10-28"
```

---

### 4. 📑 PDF Report

**Professional Research Report** (NEW!)

**What's Included:**
- **Cover Page:** Project title, NARA logo, date
- **Executive Summary:** Statistics and overview
- **Map Screenshot:** Automatically captured
- **Zone Details:** Table for each zone with data
- **Page Numbers:** Auto-generated
- **Print-Ready:** A4 format

**When to Use:**
- Management presentations
- Stakeholder meetings
- Project documentation
- Publications
- Funding applications
- Annual reports

**File Name:**
```
ProjectName_Report_1730000000000.pdf
```

**Report Structure:**
```
Page 1: Cover Page
  - Project Title
  - NARA Logo
  - Date Generated
  - Researcher Name

Page 2: Executive Summary
  - Total Zones: 12
  - Total Area: 45.5 km²
  - Total Distance: 23.4 km
  - Statistics Table

Page 3: Map View
  - Full-resolution map screenshot
  - All zones visible
  - Legend included

Page 4+: Zone Details
  - Zone 1: Coral Reef Study Area
    - Type: coral_reef_study
    - Area: 0.25 km²
    - Data: [All custom fields]
  - Zone 2: ...

Last Page: Footer with page numbers
```

**Quality:**
- 300 DPI image quality
- Vector graphics where possible
- Professional typography
- Color-printed ready

**Generation Time:**
- Small projects (<10 zones): ~5 seconds
- Medium projects (10-50 zones): ~15 seconds
- Large projects (50+ zones): ~30 seconds

**Example Use:**
```
Complete field survey
Export → PDF Report
Email to supervisor
Print for meeting
Present findings
```

---

## 📏 Measurement Tools

### Measure Distance

**Purpose:** Calculate linear distances on the map.

**Steps:**
1. Switch to **Measure** tab
2. Click **"Measure Distance"** button
3. Click first point on map
4. Click second point
5. Click more points to continue path
6. See total distance in Results box

**Display:**
```
Distance: 12.45 km
```

**Use Cases:**
- Transect lengths
- Vessel routes
- Sampling intervals
- Protected area perimeters
- Migration paths

**Tips:**
- Click many points for curved paths
- Distance shown is sum of all segments
- Appears as orange dashed line
- Point markers show P1, P2, P3...

---

### Measure Area

**Purpose:** Calculate enclosed area.

**Steps:**
1. Click **"Measure Area"** button
2. Click to draw polygon
3. Continue clicking corners
4. Double-click to close polygon
5. See area in Results box

**Display:**
```
Area: 5.67 km²
```

**Use Cases:**
- Habitat extent
- Protection zone size
- Research grid area
- Fishing ground coverage
- Impact assessment zones

**Accuracy:**
Uses **Haversine formula** for accurate spherical calculations.

---

### Measure Bearing

**Purpose:** Get compass direction between two points.

**Automatic:** Shows when you measure distance between exactly 2 points.

**Display:**
```
Bearing: 045.3°
```

**Interpretation:**
- 0° = North
- 90° = East
- 180° = South
- 270° = West

**Use Cases:**
- Navigation planning
- Current direction
- Wind direction reference
- Survey line orientation

---

### Clear Measurements

**Steps:**
1. Click **"Clear Measurement"** button (red)
2. All measurement lines/polygons removed
3. Start fresh measurement

**Tip:** Measurements don't save with project - they're temporary!

---

## 🎯 Best Practices

### Project Organization

**Naming Convention:**
```
[Location]_[Type]_[Date]
Example: "Trincomalee_CoralSurvey_2025-10"
```

**Project Structure:**
```
Main Project: "Sri Lanka Reef Network 2025"
├── Sub-project: "North Coast Reefs"
│   ├── Zone: Trincomalee Site 1
│   ├── Zone: Trincomalee Site 2
│   └── Zone: Trincomalee Site 3
└── Sub-project: "West Coast Reefs"
    ├── Zone: Negombo Site 1
    └── Zone: Negombo Site 2
```

---

### Coordinate Accuracy

**GPS Precision:**
- Handheld GPS: ±3-5 meters
- Smartphone GPS: ±5-10 meters
- Survey-grade GPS: ±1 meter

**Recording Tips:**
- Average multiple readings
- Record in clear sky conditions
- Note GPS accuracy value
- Double-check coordinates
- Use decimal degrees format

**Validation:**
✅ Valid: `6.9271, 79.8612`
❌ Invalid: `6° 55' 38"N, 79° 51' 40"E` (convert first)

---

### Data Entry

**Consistent Formats:**

**Dates:** `YYYY-MM-DD` (2025-10-28)
**Times:** `HH:MM:SS` (14:30:00)
**Decimals:** Use `.` not `,` (0.25, not 0,25)
**Units:** Always specify (5 kg, 12°C, 2.5 km)

**Required Fields:**
- Zone name/label
- Zone type
- Coordinates
- Date collected

**Optional but Recommended:**
- Observer name
- Weather conditions
- Photo references
- Sample IDs
- Equipment used

---

### Team Collaboration

**Roles:**
- **Project Lead:** Creates project, manages access
- **Field Researchers:** Add zones, collect data
- **Data Manager:** Quality control, exports
- **Supervisor:** Review, approve

**Workflow:**
```
1. Lead creates project and shares with team
2. Researchers add zones from field
3. Data manager checks for errors
4. Supervisor reviews and approves
5. Lead generates final report
```

---

### Quality Control

**Before Submitting:**
- [ ] All zones labeled clearly
- [ ] Coordinates verified
- [ ] Required data filled in
- [ ] No duplicate zones
- [ ] Spelling checked
- [ ] Units specified
- [ ] Photos uploaded
- [ ] Backup exported

---

## 🐛 Troubleshooting

### Common Issues

#### **Map Not Loading**

**Symptoms:** Blank map area, loading spinner forever

**Solutions:**
1. Check internet connection
2. Refresh page (F5)
3. Clear browser cache
4. Try different browser
5. Check firewall settings

**Technical:** Map tiles load from OpenStreetMap servers.

---

#### **Cannot Save Project**

**Symptoms:** Error message when clicking Save

**If Signed In:**
1. Check internet connection
2. Verify you're still logged in
3. Check browser console for errors
4. Try exporting as JSON backup

**If Not Signed In:**
1. Check if browser allows localStorage
2. Try incognito mode
3. Check available disk space
4. Clear old projects

---

#### **Import Fails**

**Symptoms:** "Import failed" error message

**Common Causes:**
1. **Invalid file format**
   - Solution: Verify file is .geojson/.kml/.csv/.json
   - Check file isn't corrupted

2. **Wrong coordinate order**
   - GeoJSON uses [lng, lat] but CSV uses lat, lng
   - Solution: App auto-converts, but check source

3. **Missing required fields**
   - CSV needs latitude and longitude columns
   - Solution: Add columns to file

4. **Invalid coordinates**
   - Coordinates outside valid range
   - Solution: Check values are realistic

---

#### **Zones Not Appearing**

**Symptoms:** Drew zone but can't see it

**Solutions:**
1. Zoom out - might be off-screen
2. Check layer visibility
3. Check zone list in sidebar
4. Try recenter button
5. Refresh page and reload project

---

#### **PDF Export Not Working**

**Symptoms:** "Error generating PDF" message

**Solutions:**
1. Ensure map has loaded completely
2. Wait for all tiles to load
3. Try zooming to fit all zones
4. Check browser allows downloads
5. Try with fewer zones first

**Technical:** PDF generation requires map screenshot, which needs map to be fully rendered.

---

#### **Photos Won't Upload**

**Symptoms:** Photo upload fails or button not available

**Requirements:**
- ✅ Must be signed in
- ✅ Project must be saved to cloud first
- ✅ File must be image (JPG/PNG)
- ✅ File size under 10MB

**Solutions:**
1. Sign in first
2. Save project to cloud
3. Check file format
4. Compress large images
5. Check internet connection

---

#### **Slow Performance**

**Symptoms:** Laggy map, slow drawing, delays

**Causes:**
- Too many zones (100+)
- Large project size
- Slow internet
- Old browser
- Low device memory

**Solutions:**
1. Split into multiple projects
2. Hide unused layers
3. Close other browser tabs
4. Update browser
5. Clear browser cache
6. Use more powerful device

---

### Browser Compatibility

**Recommended:**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

**Not Supported:**
- ❌ Internet Explorer (any version)
- ❌ Opera Mini
- ❌ Very old mobile browsers

---

### Getting Help

**Technical Support:**
- Email: dev@nara.gov.lk
- Phone: +94 11 XXX XXXX
- Office Hours: Mon-Fri 9:00-17:00

**Training:**
- Online tutorials: [YouTube Channel]
- In-person workshops: [Schedule]
- User guide: This document

**Reporting Bugs:**
Include:
1. Browser and version
2. Steps to reproduce
3. Screenshot of error
4. Console error messages (F12)

---

## ❓ FAQs

### General Questions

**Q: Is this free to use?**
A: Yes, free for all NARA staff and authorized researchers.

**Q: Do I need to install anything?**
A: No, it's a web application. Just open the URL in your browser.

**Q: Can I use this on my phone?**
A: Yes, but desktop experience is better for complex projects.

**Q: Is my data secure?**
A: Yes, stored in Firebase with security rules. Only you and your collaborators can access.

---

### Account & Cloud

**Q: Do I need to create an account?**
A: Optional, but highly recommended for cloud features.

**Q: What if I forget my password?**
A: Use "Forgot Password" link on sign-in page.

**Q: Can I use the same account on multiple devices?**
A: Yes! That's the benefit of cloud sync.

**Q: What happens if my internet disconnects?**
A: Current work stays on screen. Save when reconnected.

---

### Projects

**Q: How many projects can I create?**
A: Unlimited (within reasonable storage limits).

**Q: Can I delete old projects?**
A: Yes, from the Projects menu (trash icon).

**Q: Can multiple people edit the same project?**
A: Backend supports this, UI coming soon.

**Q: How big can a project be?**
A: Recommended: < 100 zones. Max: 1000 zones.

---

### Data & Export

**Q: What formats can I export?**
A: JSON, GeoJSON, CSV, PDF.

**Q: Can I import my old GPS data?**
A: Yes, if in CSV/GeoJSON/KML format.

**Q: Are measurements accurate?**
A: Very accurate (Haversine formula), but depends on coordinate precision.

**Q: Can I print the maps?**
A: Yes, export to PDF first for best quality.

---

### Features

**Q: Can I upload photos?**
A: Yes, if signed in and project saved to cloud.

**Q: Can I draw circles?**
A: Currently points and polygons. Circles coming soon.

**Q: Can I add text labels?**
A: Zone labels yes, free text labels coming soon.

**Q: Can I change colors?**
A: Currently auto-assigned by type. Custom colors coming soon.

---

### Technical

**Q: What map projection is used?**
A: Web Mercator (EPSG:3857), coordinates in WGS84 (EPSG:4326).

**Q: What's the coordinate precision?**
A: 6 decimal places (~0.1 meter accuracy).

**Q: Can I use offline?**
A: Partially - drawing works, but map tiles need internet.

**Q: What browsers are supported?**
A: Modern browsers (Chrome, Firefox, Edge, Safari).

---

## 📞 Contact & Support

### NARA GIS Team
**Email:** gis@nara.gov.lk
**Phone:** +94 11 XXX XXXX
**Office:** NARA Headquarters, Colombo 15
**Hours:** Monday-Friday, 9:00 AM - 5:00 PM

### Online Resources
**Documentation:** https://nara-web-73384.web.app/docs
**Video Tutorials:** [YouTube Playlist]
**User Forum:** [Community Forum Link]
**Bug Reports:** github.com/nara/issues

### Training
**Workshops:** Monthly training sessions
**One-on-One:** By appointment
**Field Training:** On-site demonstrations

---

## 🎓 Quick Reference Card

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Undo | Ctrl + Z |
| Redo | Ctrl + Y |
| Save | Ctrl + S |
| Fullscreen | F11 |
| Refresh | F5 |

*(Coming soon in future update)*

---

### Button Quick Reference

| Icon | Name | Function |
|------|------|----------|
| 📁 | Projects | Open/Save/Load |
| ⬆️ | Import | Import GIS data |
| 💾 | Save | Save project |
| ⬇️ | Export | Export data |
| 📊 | Stats | Toggle statistics |
| 🖊️ | Draw | Drawing tools |
| 📏 | Measure | Measurement tools |
| 💾 | Data | Research data entry |
| 📋 | Templates | Quick templates |

---

## 🎉 Conclusion

You now know how to:
- ✅ Create and save marine spatial projects
- ✅ Draw research zones on maps
- ✅ Use research templates
- ✅ Save to cloud for collaboration
- ✅ Import GIS data
- ✅ Export professional PDF reports
- ✅ Measure distances and areas
- ✅ Manage your projects

**Start mapping your marine research today!**

Access the tool: https://nara-web-73384.web.app/marine-spatial-planning-viewer

---

**Manual Version:** 2.0
**Last Updated:** October 28, 2025
**Next Review:** January 2026

**Changelog:**
- v2.0 (Oct 2025): Added cloud sync, PDF export, import features
- v1.0 (Aug 2025): Initial release with basic drawing and templates

---

*This manual is maintained by the NARA Digital Systems Team.
For corrections or suggestions, email: documentation@nara.gov.lk*

**Happy Mapping! 🌊🗺️**
