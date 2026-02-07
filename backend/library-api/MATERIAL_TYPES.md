# NARA Library - Material Types

## Complete List of Material Types

The NARA Library System includes 26 specialized material types tailored for marine and aquatic research resources:

| ID | Name | Code | Circulating | Description |
|----|------|------|-------------|-------------|
| 1 | Acts | ACT | ✅ Yes | Legislative acts and regulations |
| 2 | Atapattu Collection | ATC | ✅ Yes | Atapattu special collection |
| 3 | BOBP Reports | BOBP | ✅ Yes | Bay of Bengal Programme reports |
| 4 | CDs | CD | ✅ Yes | Compact discs and digital media |
| 5 | Digital Map | DMAP | ✅ Yes | Digital cartographic materials |
| 6 | Electronic Books | EBOOK | ✅ Yes | Electronic book resources |
| 7 | FAO Reports | FAO | ✅ Yes | Food and Agriculture Organization reports |
| 8 | IOC Reports | IOC | ✅ Yes | Intergovernmental Oceanographic Commission reports |
| 9 | IWMI Reports | IWMI | ✅ Yes | International Water Management Institute reports |
| 10 | Journal | JR | ✅ Yes | Periodical journals |
| 11 | Lending Book | LBOOK | ✅ Yes | Books available for lending |
| 12 | Maps | MAP | ✅ Yes | Physical maps and charts |
| 13 | Newspaper Articles | NEWS | ✅ Yes | Newspaper clippings and articles |
| 14 | Permanent Reference | PREF | ❌ No | Permanent reference materials (non-circulating) |
| 15 | Proceedings | PROC | ✅ Yes | Conference and symposium proceedings |
| 16 | Prof. Upali Amarasinghe Collection | UACOL | ✅ Yes | Prof. Upali Amarasinghe special collection |
| 17 | Reference Book | RBOOK | ❌ No | Reference books (non-circulating) |
| 18 | Research Papers | RPAPER | ✅ Yes | Research papers and publications |
| 19 | Research Reports - NARA | RNARA | ✅ Yes | NARA research reports |
| 20 | Special Reference | SREF | ❌ No | Special reference materials |
| 21 | Sri Lanka Collection - Books | SLBOOK | ✅ Yes | Sri Lankan book collection |
| 22 | Sri Lanka Collection - Reports | SLREP | ✅ Yes | Sri Lankan report collection |
| 23 | Thesis | THESIS | ✅ Yes | Academic theses and dissertations |
| 24 | World Fisheries Collection | WFISH | ✅ Yes | World fisheries collection |
| 25 | e-Journal Articles | EJART | ✅ Yes | Electronic journal articles |
| 26 | e-Reports | EREP | ✅ Yes | Electronic reports |

## Circulating vs Non-Circulating

### Circulating Materials (23 types)
These items can be checked out by patrons:
- Acts, Collections, Reports, Books, Papers, Journals, Maps, CDs, Electronic resources, etc.

### Non-Circulating Materials (3 types)
These items must be used in the library only:
- **Permanent Reference** (PREF)
- **Reference Book** (RBOOK)
- **Special Reference** (SREF)

## Usage in Search & Filters

All material types are available as:
1. **Search filters** in the public catalogue
2. **Faceted navigation** options
3. **Advanced search** criteria
4. **Cataloguing** dropdown when adding items

## API Endpoints

### Get All Material Types
```bash
GET /api/catalogue/material-types/all
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Acts",
      "code": "ACT",
      "description": "Legislative acts and regulations",
      "is_circulating": true
    },
    ...
  ]
}
```

### Filter by Material Type
```bash
GET /api/catalogue?material_type=1
GET /api/search?q=marine&material_type=11
```

## Adding New Material Types

To add a new material type via API:

```bash
POST /api/admin/material-types
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "New Type",
  "code": "NEWT",
  "description": "Description here",
  "is_circulating": true
}
```

Or directly in database:
```sql
INSERT INTO material_types (name, code, description, is_circulating)
VALUES ('New Type', 'NEWT', 'Description', TRUE);
```

## Special Collections

### Research Collections
- **BOBP Reports** - Bay of Bengal Programme
- **FAO Reports** - Food and Agriculture Organization
- **IOC Reports** - Intergovernmental Oceanographic Commission
- **IWMI Reports** - International Water Management Institute
- **Research Reports - NARA** - NARA's own research output

### Named Collections
- **Atapattu Collection** - Special collection
- **Prof. Upali Amarasinghe Collection** - Special collection
- **World Fisheries Collection** - Global fisheries resources

### Regional Collections
- **Sri Lanka Collection - Books** - Sri Lankan publications
- **Sri Lanka Collection - Reports** - Sri Lankan reports and documents

## Search Examples

### By Material Type
```javascript
// Search for FAO reports
searchService.search('fisheries', { material_type: 7 });

// Get all theses
catalogueService.getAllItems({ material_type: 23 });

// Advanced search for NARA research reports
searchService.advancedSearch({
  material_type_id: 19,
  year_from: 2020,
  subject: 'marine biology'
});
```

### In Frontend Components
```jsx
// Material type filter dropdown
<select value={filters.material_type} onChange={handleFilterChange}>
  <option value="">All Types</option>
  {materialTypes.map(type => (
    <option key={type.id} value={type.id}>
      {type.name} ({type.code})
    </option>
  ))}
</select>
```

## Database Schema

```sql
CREATE TABLE material_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(20) NOT NULL UNIQUE,
  description TEXT,
  is_circulating BOOLEAN DEFAULT TRUE,
  loan_period_override INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Notes

- Material type codes are unique identifiers (e.g., 'ACT', 'BOBP', 'LBOOK')
- Non-circulating items cannot be checked out
- Each bibliographic record must have a material type
- Material types can have custom loan periods if needed
- The `is_circulating` flag controls whether items can be borrowed

## Migration

When running the initial migration (`npm run migrate`), all 26 material types are automatically created.

To add these types to an existing database:
```bash
psql nara_library < migrations/002_add_nara_material_types.sql
```

