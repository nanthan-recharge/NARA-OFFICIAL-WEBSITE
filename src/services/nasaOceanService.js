/**
 * NASA Ocean Color & EarthData Service
 * Sea surface temperature, chlorophyll, ocean color
 */

const NASA_TOKEN = import.meta.env.VITE_NASA_EARTHDATA_TOKEN;

// Sri Lanka region bounds
const SRI_LANKA_BOUNDS = {
  north: 10.0,
  south: 5.0,
  east: 82.0,
  west: 79.0
};

export async function fetchOceanColorData(product = 'SST', date = null) {
  // Note: NASA Ocean Color requires complex authentication and data processing
  // This is a simplified version - full implementation would use MODIS/VIIRS data
  
  const mockData = generateMockNASAData(product);
  
  return {
    success: true,
    data: mockData,
    source: 'NASA Ocean Color (Demo)',
    product: product
  };
}

export async function fetchChlorophyllData() {
  return fetchOceanColorData('CHLOR_A');
}

export async function fetchSSTData() {
  return fetchOceanColorData('SST');
}

function generateMockNASAData(product) {
  const gridSize = 20;
  const data = [];
  
  for (let lat = SRI_LANKA_BOUNDS.south; lat <= SRI_LANKA_BOUNDS.north; lat += 0.25) {
    for (let lng = SRI_LANKA_BOUNDS.west; lng <= SRI_LANKA_BOUNDS.east; lng += 0.25) {
      let value;
      if (product === 'SST') {
        value = 28 + Math.random() * 2; // 28-30°C
      } else if (product === 'CHLOR_A') {
        value = 0.1 + Math.random() * 0.5; // 0.1-0.6 mg/m³
      }
      
      data.push({
        lat: parseFloat(lat.toFixed(2)),
        lng: parseFloat(lng.toFixed(2)),
        value: parseFloat(value.toFixed(2))
      });
    }
  }
  
  return data;
}

export default {
  fetchOceanColorData,
  fetchChlorophyllData,
  fetchSSTData
};
