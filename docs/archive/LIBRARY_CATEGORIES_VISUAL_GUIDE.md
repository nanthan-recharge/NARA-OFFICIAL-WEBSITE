# 📚 NARA Library - Visual Categories Guide

## All 26 Material Types - Categorized & Clickable

### 📖 Books & Publications
| Category | Code | Description | Icon |
|----------|------|-------------|------|
| **Lending Book** | LBOOK | Circulating book collection | 📘 Book |
| **Reference Book** | RBOOK | In-library reference materials | 📕 BookOpenCheck |
| **Electronic Books** | EBOOK | Digital reading materials | 📱 Tablet |

### 🎓 Academic Resources
| Category | Code | Description | Icon |
|----------|------|-------------|------|
| **Thesis** | THESIS | Graduate and doctoral dissertations | 🎓 GraduationCap |
| **Research Papers** | RPAPER | Academic papers and studies | 📄 FileEdit |
| **Journal** | JR | Scientific periodicals | 📖 BookOpen |
| **e-Journal Articles** | EJART | Digital journal publications | 🔢 FileDigit |

### 📊 Reports & Documents
| Category | Code | Description | Icon |
|----------|------|-------------|------|
| **Research Reports - NARA** | RNARA | Internal research publications | 📜 ScrollText |
| **BOBP Reports** | BOBP | Bay of Bengal Programme reports | 📄 FileText |
| **FAO Reports** | FAO | Food and Agriculture Organization | 📊 FileSpreadsheet |
| **IOC Reports** | IOC | Intergovernmental Oceanographic Commission | 📄 FileText |
| **IWMI Reports** | IWMI | International Water Management Institute | 💧 Droplet |
| **e-Reports** | EREP | Digital report collection | 💻 FileCode |

### 📑 Special Collections
| Category | Code | Description | Icon |
|----------|------|-------------|------|
| **Atapattu Collection** | ATC | Special archived collection | 📦 Archive |
| **Prof. Upali Amarasinghe Collection** | UACOL | Curated academic collection | 🏛️ LibraryBig |
| **Sri Lanka Collection - Books** | SLBOOK | National book collection | 📚 Library |
| **Sri Lanka Collection - Reports** | SLREP | National reports | 📁 FolderOpen |
| **World Fisheries Collection** | WFISH | International fisheries resources | 🐟 Fish |

### 📋 Reference Materials
| Category | Code | Description | Icon |
|----------|------|-------------|------|
| **Permanent Reference** | PREF | Non-circulating reference works | 📌 BookMarked |
| **Special Reference** | SREF | Restricted reference materials | ✅ BookmarkCheck |

### 🗺️ Geographic & Media
| Category | Code | Description | Icon |
|----------|------|-------------|------|
| **Maps** | MAP | Physical cartographic materials | 📍 MapPin |
| **Digital Map** | DMAP | Geographic information systems | 🗺️ Map |
| **CDs** | CD | Audio/visual media | 💿 Disc |

### 📰 Publications & Legal
| Category | Code | Description | Icon |
|----------|------|-------------|------|
| **Proceedings** | PROC | Conference and symposium publications | 📖 BookCopy |
| **Newspaper Articles** | NEWS | Press clippings and articles | 📰 Newspaper |
| **Acts** | ACT | Legal documents and regulations | ⚖️ Scale |

---

## 🎨 Color Scheme

Each category has a unique gradient:

### Blue Family
- **Lending Book**: Blue-600 to Blue-700
- **BOBP Reports**: Blue-500 to Blue-600
- **World Fisheries**: Blue-500 to Blue-600

### Cyan Family
- **CDs**: Cyan-500 to Cyan-600
- **NARA Research**: Cyan-600 to Cyan-700

### Green Family
- **Digital Map**: Green-500 to Green-600
- **FAO Reports**: Emerald-500 to Emerald-600

### Purple Family
- **Acts**: Purple-500 to Purple-600
- **Thesis**: Purple-600 to Purple-700

### Red Family
- **Permanent Reference**: Red-500 to Red-600
- **Special Reference**: Red-600 to Red-700
- **Reference Book**: Rose-500 to Rose-600

### Amber/Orange Family
- **Atapattu Collection**: Amber-500 to Amber-600
- **Sri Lanka Reports**: Amber-600 to Amber-700
- **Proceedings**: Orange-500 to Orange-600

### Other Colors
- **Electronic Books**: Indigo-500 to Indigo-600
- **IOC Reports**: Teal-500 to Teal-600
- **IWMI Reports**: Sky-500 to Sky-600
- **Journal**: Violet-500 to Violet-600
- **Maps**: Lime-500 to Lime-600
- **Newspaper**: Slate-500 to Slate-600
- **Upali Collection**: Pink-500 to Pink-600
- **Research Papers**: Fuchsia-500 to Fuchsia-600
- **Sri Lanka Books**: Yellow-500 to Yellow-600
- **e-Journal Articles**: Violet-600 to Violet-700
- **e-Reports**: Indigo-600 to Indigo-700

---

## 🔍 How to Use

### Browse by Category
1. Visit `/library` page
2. Scroll to "Browse by Material Type" section
3. Click any of the 26 colorful category cards
4. View all items in that category

### Search with Filters
1. Use the search bar at top
2. Click "Advanced Search"
3. Select material type from dropdown
4. Add year and language filters
5. View filtered results

### Quick Access
Featured collections provide one-click access to:
- **NARA Research** (RNARA)
- **Academic Resources** (THESIS)
- **Special Collections** (ATC)

---

## 📱 Responsive Design

Categories adapt to screen size:
- **Mobile**: 2 columns
- **Small**: 3 columns
- **Medium**: 4 columns
- **Large**: 5 columns
- **Extra Large**: 6 columns

---

## ✨ Visual Features

Each category card includes:
- **Icon**: Relevant visual representation
- **Name**: Full category name
- **Count**: Number of items (if available)
- **Color**: Unique gradient background
- **Animation**: Hover effects (scale, shadow)
- **Clickable**: Direct navigation to category

---

## 🎯 User Benefits

1. **Visual Discovery** - See all categories at a glance
2. **Color Coding** - Easy recognition of category types
3. **Item Counts** - Know collection size before browsing
4. **Direct Access** - One click to category contents
5. **Modern UI** - Beautiful, professional design
6. **Fast Navigation** - No menu drilling required

---

## 📊 Statistics Display

Hero section shows live stats:
- **Total Items**: Across all 26 categories
- **26 Categories**: Material type count
- **Languages**: Language diversity
- **Years**: Publication year range

---

## 🎨 Design System

### Icons
- From Lucide React icon library
- Consistent 5-6px size in cards
- White color on gradient backgrounds
- Hover scale animation (110%)

### Cards
- Rounded corners (rounded-xl)
- Padding: 6 units (p-6)
- Shadow: 2xl on hover
- Scale: 105% on hover
- Transition: All properties, 300ms

### Typography
- **Name**: font-semibold, text-sm
- **Count**: text-xs, opacity-90
- **White text** on gradient backgrounds

### Layout
- Gap: 4 units between cards
- Responsive grid with breakpoints
- Full-width on container
- Centered alignment

---

## 🚀 Performance

- **Conditional Rendering**: Only show when appropriate
- **Lazy Loading**: Images load as needed
- **Optimized Icons**: SVG-based Lucide icons
- **Efficient State**: React hooks for state management

---

**Version**: 2.0 Enhanced
**Last Updated**: October 15, 2025
**Status**: ✅ Production Ready

