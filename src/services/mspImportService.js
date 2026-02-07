/**
 * MSP Import Service
 * Handles importing various file formats into MSP Viewer
 * Supports: GeoJSON, KML, Shapefile (via conversion), GPX
 */

/**
 * Import GeoJSON file
 */
export const importGeoJSON = (geoJsonData) => {
  try {
    // Validate GeoJSON
    if (!geoJsonData || geoJsonData.type !== 'FeatureCollection') {
      throw new Error('Invalid GeoJSON format. Must be a FeatureCollection.');
    }

    const shapes = [];
    const features = geoJsonData.features || [];

    features.forEach((feature, index) => {
      try {
        const geometry = feature.geometry;
        const properties = feature.properties || {};

        let shape = {
          id: `imported_${Date.now()}_${index}`,
          label: properties.name || properties.title || `Imported Zone ${index + 1}`,
          zoneType: properties.type || properties.zoneType || 'custom',
          color: properties.color || properties.stroke || '#3b82f6',
          data: properties.data || {},
          createdAt: new Date().toISOString(),
          imported: true,
          originalProperties: properties
        };

        // Convert geometry to internal format
        switch (geometry.type) {
          case 'Polygon':
            shape.type = 'polygon';
            // GeoJSON uses [lon, lat], we use [lat, lon]
            shape.positions = geometry.coordinates[0].map(coord => [coord[1], coord[0]]);
            break;

          case 'MultiPolygon':
            // Create multiple shapes for MultiPolygon
            geometry.coordinates.forEach((polygon, polyIndex) => {
              const multiShape = {
                ...shape,
                id: `imported_${Date.now()}_${index}_${polyIndex}`,
                type: 'polygon',
                positions: polygon[0].map(coord => [coord[1], coord[0]]),
                label: `${shape.label} (Part ${polyIndex + 1})`
              };
              shapes.push(multiShape);
            });
            return; // Skip adding shape at end since we added all parts

          case 'LineString':
            shape.type = 'line';
            shape.positions = geometry.coordinates.map(coord => [coord[1], coord[0]]);
            break;

          case 'Point':
            shape.type = 'point';
            shape.position = [geometry.coordinates[1], geometry.coordinates[0]];
            break;

          case 'Circle':
            // GeoJSON doesn't have native circle, check for circle properties
            shape.type = 'circle';
            shape.center = [geometry.coordinates[1], geometry.coordinates[0]];
            shape.radius = properties.radius || 100; // Default 100m
            break;

          default:
            console.warn(`Unsupported geometry type: ${geometry.type}`);
            return;
        }

        shapes.push(shape);
      } catch (error) {
        console.error(`Error processing feature ${index}:`, error);
      }
    });

    console.log(`✅ Imported ${shapes.length} zones from GeoJSON`);
    return {
      success: true,
      shapes: shapes,
      message: `Successfully imported ${shapes.length} zones`
    };

  } catch (error) {
    console.error('❌ Error importing GeoJSON:', error);
    return {
      success: false,
      error: error.message,
      shapes: []
    };
  }
};

/**
 * Import KML file (convert to GeoJSON first)
 */
export const importKML = async (kmlText) => {
  try {
    // Parse KML XML
    const parser = new DOMParser();
    const kmlDoc = parser.parseFromString(kmlText, 'text/xml');

    // Check for parsing errors
    const parseError = kmlDoc.querySelector('parsererror');
    if (parseError) {
      throw new Error('Invalid KML format');
    }

    const shapes = [];

    // Extract Placemarks
    const placemarks = kmlDoc.querySelectorAll('Placemark');

    placemarks.forEach((placemark, index) => {
      try {
        const name = placemark.querySelector('name')?.textContent || `Imported Zone ${index + 1}`;
        const description = placemark.querySelector('description')?.textContent || '';

        // Parse coordinates
        const coordinates = placemark.querySelector('coordinates')?.textContent.trim();
        if (!coordinates) return;

        const coords = coordinates.split(/\s+/).map(coord => {
          const [lon, lat, alt] = coord.split(',').map(Number);
          return [lat, lon]; // Convert to [lat, lon]
        });

        let shape = {
          id: `imported_kml_${Date.now()}_${index}`,
          label: name,
          zoneType: 'custom',
          color: '#3b82f6',
          data: { description },
          createdAt: new Date().toISOString(),
          imported: true
        };

        // Determine geometry type
        const polygonTag = placemark.querySelector('Polygon');
        const lineStringTag = placemark.querySelector('LineString');
        const pointTag = placemark.querySelector('Point');

        if (polygonTag) {
          shape.type = 'polygon';
          shape.positions = coords;
        } else if (lineStringTag) {
          shape.type = 'line';
          shape.positions = coords;
        } else if (pointTag) {
          shape.type = 'point';
          shape.position = coords[0];
        } else {
          return; // Skip unknown types
        }

        shapes.push(shape);
      } catch (error) {
        console.error(`Error processing placemark ${index}:`, error);
      }
    });

    console.log(`✅ Imported ${shapes.length} zones from KML`);
    return {
      success: true,
      shapes: shapes,
      message: `Successfully imported ${shapes.length} zones from KML`
    };

  } catch (error) {
    console.error('❌ Error importing KML:', error);
    return {
      success: false,
      error: error.message,
      shapes: []
    };
  }
};

/**
 * Import MSP JSON project file
 */
export const importMSPProject = (jsonData) => {
  try {
    // Validate project structure
    if (!jsonData || !jsonData.project) {
      throw new Error('Invalid MSP project file format');
    }

    // Extract project data
    const project = {
      id: jsonData.project.id || `imported_${Date.now()}`,
      name: jsonData.project.name || 'Imported Project',
      description: jsonData.project.description || '',
      researcher: jsonData.project.researcher || '',
      date: jsonData.project.date || new Date().toISOString(),
      type: jsonData.project.type || 'general',
      status: jsonData.project.status || 'draft',
      tags: jsonData.project.tags || [],
      metadata: jsonData.project.metadata || {}
    };

    const shapes = jsonData.shapes || [];
    const researchData = jsonData.researchData || {};
    const comments = jsonData.comments || [];

    console.log(`✅ Imported MSP project: ${project.name}`);
    return {
      success: true,
      project: project,
      shapes: shapes,
      researchData: researchData,
      comments: comments,
      message: `Successfully imported project "${project.name}" with ${shapes.length} zones`
    };

  } catch (error) {
    console.error('❌ Error importing MSP project:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Import CSV file with zone data
 */
export const importCSV = (csvText) => {
  try {
    // Parse CSV
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const shapes = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length !== headers.length) continue;

      const row = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx];
      });

      // Try to create shape from row
      try {
        const shape = {
          id: `imported_csv_${Date.now()}_${i}`,
          label: row['Zone Name'] || row['name'] || `Imported Zone ${i}`,
          zoneType: row['Type'] || row['type'] || 'custom',
          color: row['Color'] || row['color'] || '#3b82f6',
          createdAt: new Date().toISOString(),
          imported: true,
          data: {}
        };

        // Try to parse coordinate data if available
        if (row['Coordinates'] || row['coordinates']) {
          const coordString = row['Coordinates'] || row['coordinates'];
          try {
            const coords = JSON.parse(coordString);
            if (Array.isArray(coords)) {
              if (coords.length > 2) {
                shape.type = 'polygon';
                shape.positions = coords;
              } else if (coords.length === 2) {
                shape.type = 'point';
                shape.position = coords;
              }
            }
          } catch (e) {
            // If coordinates can't be parsed, just store as metadata
            shape.data.coordinateString = coordString;
          }
        }

        // Add all other fields as data
        Object.keys(row).forEach(key => {
          if (!['Zone Name', 'name', 'Type', 'type', 'Color', 'color', 'Coordinates', 'coordinates'].includes(key)) {
            shape.data[key] = row[key];
          }
        });

        shapes.push(shape);
      } catch (error) {
        console.error(`Error processing CSV row ${i}:`, error);
      }
    }

    console.log(`✅ Imported ${shapes.length} zones from CSV`);
    return {
      success: true,
      shapes: shapes,
      message: `Successfully imported ${shapes.length} zones from CSV`
    };

  } catch (error) {
    console.error('❌ Error importing CSV:', error);
    return {
      success: false,
      error: error.message,
      shapes: []
    };
  }
};

/**
 * Parse CSV line handling quoted values
 */
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

/**
 * Detect file type from content
 */
export const detectFileType = (content, filename) => {
  // Check by content
  const trimmed = content.trim();

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed.type === 'FeatureCollection') {
        return 'geojson';
      } else if (parsed.project) {
        return 'msp-json';
      }
      return 'json';
    } catch (e) {
      return 'unknown';
    }
  }

  if (trimmed.startsWith('<?xml') || trimmed.startsWith('<kml')) {
    return 'kml';
  }

  if (trimmed.split('\n')[0].includes(',')) {
    return 'csv';
  }

  // Check by filename
  if (filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (ext === 'geojson' || ext === 'json') return 'geojson';
    if (ext === 'kml') return 'kml';
    if (ext === 'csv') return 'csv';
  }

  return 'unknown';
};

/**
 * Main import function - detects type and imports
 */
export const importFile = async (file) => {
  try {
    const content = await file.text();
    const fileType = detectFileType(content, file.name);

    console.log(`📥 Importing file type: ${fileType}`);

    switch (fileType) {
      case 'geojson':
        const geoJson = JSON.parse(content);
        return importGeoJSON(geoJson);

      case 'kml':
        return await importKML(content);

      case 'msp-json':
        const mspProject = JSON.parse(content);
        return importMSPProject(mspProject);

      case 'csv':
        return importCSV(content);

      default:
        return {
          success: false,
          error: `Unsupported file type: ${fileType}. Supported formats: GeoJSON, KML, MSP JSON, CSV`
        };
    }

  } catch (error) {
    console.error('❌ Error importing file:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Validate imported shapes
 */
export const validateImportedShapes = (shapes) => {
  const validShapes = [];
  const errors = [];

  shapes.forEach((shape, index) => {
    try {
      // Required fields
      if (!shape.id) shape.id = `shape_${Date.now()}_${index}`;
      if (!shape.label) shape.label = `Zone ${index + 1}`;
      if (!shape.type) throw new Error('Missing shape type');
      if (!shape.color) shape.color = '#3b82f6';

      // Validate geometry
      switch (shape.type) {
        case 'polygon':
          if (!shape.positions || shape.positions.length < 3) {
            throw new Error('Polygon must have at least 3 points');
          }
          break;

        case 'line':
          if (!shape.positions || shape.positions.length < 2) {
            throw new Error('Line must have at least 2 points');
          }
          break;

        case 'point':
          if (!shape.position || shape.position.length !== 2) {
            throw new Error('Point must have [lat, lon] coordinates');
          }
          break;

        case 'circle':
          if (!shape.center || shape.center.length !== 2) {
            throw new Error('Circle must have center [lat, lon] coordinates');
          }
          if (!shape.radius || shape.radius <= 0) {
            throw new Error('Circle must have valid radius');
          }
          break;

        default:
          throw new Error(`Unknown shape type: ${shape.type}`);
      }

      validShapes.push(shape);
    } catch (error) {
      errors.push({
        index: index,
        shape: shape.label || `Shape ${index}`,
        error: error.message
      });
    }
  });

  return {
    validShapes,
    errors,
    totalImported: shapes.length,
    validCount: validShapes.length,
    errorCount: errors.length
  };
};

export default {
  importGeoJSON,
  importKML,
  importMSPProject,
  importCSV,
  importFile,
  detectFileType,
  validateImportedShapes
};
