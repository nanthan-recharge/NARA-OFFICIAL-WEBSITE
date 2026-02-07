#!/usr/bin/env python3
"""
NARA Copernicus Marine Data API Backend
Flask server for fetching live ocean data from Copernicus Marine Service
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import copernicusmarine
import pandas as pd
import numpy as np
import logging
import os
from functools import lru_cache
import json

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js frontend

# Sri Lanka maritime boundaries
SRI_LANKA_BOUNDS = {
    'min_lat': 5.0,
    'max_lat': 10.0,
    'min_lon': 79.0,
    'max_lon': 82.0
}

# Copernicus Marine dataset IDs
DATASETS = {
    'temperature': 'cmems_mod_glo_phy-thetao_anfc_0.083deg_P1D-m',
    'currents': 'cmems_mod_glo_phy-cur_anfc_0.083deg_P1D-m',
    'waves': 'cmems_mod_glo_wav_anfc_0.083deg_PT3H-i',
    'salinity': 'cmems_mod_glo_phy-so_anfc_0.083deg_P1D-m'
}

# Cache duration: 1 hour (3600 seconds)
CACHE_DURATION = 3600


@lru_cache(maxsize=100)
def fetch_copernicus_data(dataset_id, variables, start_date, end_date, depth=0):
    """
    Fetch data from Copernicus Marine Service with caching

    Args:
        dataset_id: Copernicus dataset identifier
        variables: Tuple of variable names (must be tuple for caching)
        start_date: Start date string (YYYY-MM-DD)
        end_date: End date string (YYYY-MM-DD)
        depth: Depth level in meters (default 0 for surface)

    Returns:
        Dictionary containing processed ocean data
    """
    try:
        logger.info(f"Fetching {dataset_id} for {start_date} to {end_date}")

        # Adjust depth to match dataset constraints
        # Dataset minimum depth is ~0.494m, so map 0 to 0.5
        actual_depth = max(0.5, depth) if depth < 0.5 else depth

        # Fetch data using copernicusmarine Python library
        dataset = copernicusmarine.open_dataset(
            dataset_id=dataset_id,
            variables=list(variables),
            minimum_longitude=SRI_LANKA_BOUNDS['min_lon'],
            maximum_longitude=SRI_LANKA_BOUNDS['max_lon'],
            minimum_latitude=SRI_LANKA_BOUNDS['min_lat'],
            maximum_latitude=SRI_LANKA_BOUNDS['max_lat'],
            start_datetime=start_date,
            end_datetime=end_date,
            minimum_depth=actual_depth,
            maximum_depth=actual_depth + 1.0
        )

        # Convert to dict for JSON serialization
        data_dict = {}

        for var in variables:
            if var in dataset.variables:
                logger.info(f"Processing variable: {var}, dtype: {dataset[var].dtype}")
                data_array = dataset[var].values

                # Handle object dtype by converting to float
                if data_array.dtype == 'O':  # Object dtype
                    logger.info(f"Converting object dtype to numeric for variable: {var}")
                    # Flatten, convert to numeric, then reshape
                    original_shape = data_array.shape
                    flat_array = data_array.flatten()
                    # Convert to numeric, coercing errors to NaN
                    numeric_array = pd.to_numeric(flat_array, errors='coerce')
                    data_array = numeric_array.values.reshape(original_shape)
                    logger.info(f"Converted to dtype: {data_array.dtype}")

                # Ensure we have a numeric array before nan operations
                if not np.issubdtype(data_array.dtype, np.number):
                    logger.warning(f"Variable {var} has non-numeric dtype {data_array.dtype}, attempting conversion")
                    data_array = data_array.astype(float)

                # Handle NaN values - replace NaN with 0.0
                data_array = np.nan_to_num(data_array, nan=0.0)

                data_dict[var] = {
                    'values': data_array.tolist(),
                    'shape': list(data_array.shape),
                    'min': float(np.nanmin(data_array)) if not np.all(np.isnan(data_array)) else None,
                    'max': float(np.nanmax(data_array)) if not np.all(np.isnan(data_array)) else None,
                    'mean': float(np.nanmean(data_array)) if not np.all(np.isnan(data_array)) else None
                }

        # Extract coordinates
        data_dict['coordinates'] = {
            'latitude': dataset.latitude.values.tolist(),
            'longitude': dataset.longitude.values.tolist(),
            'time': [str(t) for t in pd.to_datetime(dataset.time.values)]
        }

        logger.info(f"Successfully fetched {dataset_id}")
        return data_dict

    except Exception as e:
        logger.error(f"Error fetching data from Copernicus: {str(e)}")
        raise


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'NARA Copernicus Marine API',
        'timestamp': datetime.now().isoformat()
    })


@app.route('/api/ocean/temperature/live', methods=['GET'])
def get_live_temperature():
    """
    Get live sea surface temperature data for Sri Lanka waters

    Query Parameters:
        date: Optional date (YYYY-MM-DD), defaults to today
        depth: Optional depth in meters, defaults to 0 (surface)

    Returns:
        JSON with temperature data, coordinates, and metadata
    """
    try:
        # Parse query parameters
        date_str = request.args.get('date', datetime.now().strftime('%Y-%m-%d'))
        depth = float(request.args.get('depth', 0))

        # Fetch data (cached for 1 hour)
        data = fetch_copernicus_data(
            dataset_id=DATASETS['temperature'],
            variables=('thetao',),  # Sea water potential temperature
            start_date=date_str,
            end_date=date_str,
            depth=depth
        )

        return jsonify({
            'success': True,
            'data': data,
            'metadata': {
                'dataset': 'Sea Surface Temperature',
                'source': 'Copernicus Marine Service',
                'date': date_str,
                'depth': depth,
                'units': '°C',
                'bounds': SRI_LANKA_BOUNDS,
                'cached': True
            }
        })

    except Exception as e:
        logger.error(f"Error in get_live_temperature: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/ocean/currents/live', methods=['GET'])
def get_live_currents():
    """
    Get live ocean current data (velocity components) for Sri Lanka waters

    Query Parameters:
        date: Optional date (YYYY-MM-DD), defaults to today
        depth: Optional depth in meters, defaults to 0 (surface)

    Returns:
        JSON with current velocity (U, V components), coordinates, and metadata
    """
    try:
        date_str = request.args.get('date', datetime.now().strftime('%Y-%m-%d'))
        depth = float(request.args.get('depth', 0))

        # Fetch U (eastward) and V (northward) velocity components
        data = fetch_copernicus_data(
            dataset_id=DATASETS['currents'],
            variables=('uo', 'vo'),  # Eastward and northward velocities
            start_date=date_str,
            end_date=date_str,
            depth=depth
        )

        # Calculate current speed and direction
        if 'uo' in data and 'vo' in data:
            u_values = np.array(data['uo']['values'])
            v_values = np.array(data['vo']['values'])

            # Speed (magnitude)
            speed = np.sqrt(u_values**2 + v_values**2)

            # Direction (degrees from north)
            direction = np.degrees(np.arctan2(u_values, v_values)) % 360

            data['speed'] = {
                'values': np.nan_to_num(speed, nan=0.0).tolist(),
                'min': float(np.nanmin(speed)),
                'max': float(np.nanmax(speed)),
                'mean': float(np.nanmean(speed)),
                'units': 'm/s'
            }

            data['direction'] = {
                'values': np.nan_to_num(direction, nan=0.0).tolist(),
                'units': 'degrees'
            }

        return jsonify({
            'success': True,
            'data': data,
            'metadata': {
                'dataset': 'Ocean Currents',
                'source': 'Copernicus Marine Service',
                'date': date_str,
                'depth': depth,
                'units': 'm/s',
                'bounds': SRI_LANKA_BOUNDS,
                'cached': True
            }
        })

    except Exception as e:
        logger.error(f"Error in get_live_currents: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/ocean/waves/live', methods=['GET'])
def get_live_waves():
    """
    Get live wave conditions for Sri Lanka waters

    Query Parameters:
        date: Optional date (YYYY-MM-DD), defaults to today

    Returns:
        JSON with wave height, direction, period data
    """
    try:
        date_str = request.args.get('date', datetime.now().strftime('%Y-%m-%d'))

        # Fetch wave data
        data = fetch_copernicus_data(
            dataset_id=DATASETS['waves'],
            variables=('VHM0', 'VMDR', 'VTPK'),  # Significant wave height, direction, peak period
            start_date=date_str,
            end_date=date_str,
            depth=0
        )

        return jsonify({
            'success': True,
            'data': data,
            'metadata': {
                'dataset': 'Wave Conditions',
                'source': 'Copernicus Marine Service',
                'date': date_str,
                'variables': {
                    'VHM0': 'Significant Wave Height (m)',
                    'VMDR': 'Wave Direction (degrees)',
                    'VTPK': 'Wave Peak Period (s)'
                },
                'bounds': SRI_LANKA_BOUNDS,
                'cached': True
            }
        })

    except Exception as e:
        logger.error(f"Error in get_live_waves: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/ocean/salinity/live', methods=['GET'])
def get_live_salinity():
    """
    Get live sea water salinity for Sri Lanka waters

    Query Parameters:
        date: Optional date (YYYY-MM-DD), defaults to today
        depth: Optional depth in meters, defaults to 0 (surface)

    Returns:
        JSON with salinity data (PSU - Practical Salinity Units)
    """
    try:
        date_str = request.args.get('date', datetime.now().strftime('%Y-%m-%d'))
        depth = float(request.args.get('depth', 0))

        data = fetch_copernicus_data(
            dataset_id=DATASETS['salinity'],
            variables=('so',),  # Sea water salinity
            start_date=date_str,
            end_date=date_str,
            depth=depth
        )

        return jsonify({
            'success': True,
            'data': data,
            'metadata': {
                'dataset': 'Sea Water Salinity',
                'source': 'Copernicus Marine Service',
                'date': date_str,
                'depth': depth,
                'units': 'PSU',
                'bounds': SRI_LANKA_BOUNDS,
                'cached': True
            }
        })

    except Exception as e:
        logger.error(f"Error in get_live_salinity: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/ocean/historical', methods=['GET'])
def get_historical_data():
    """
    Get historical ocean data for a specified time range

    Query Parameters:
        dataset: temperature, currents, waves, or salinity
        start_date: Start date (YYYY-MM-DD)
        end_date: End date (YYYY-MM-DD)
        depth: Optional depth in meters (default 0)
        lat: Optional specific latitude
        lon: Optional specific longitude

    Returns:
        JSON with historical time series data
    """
    try:
        dataset_type = request.args.get('dataset', 'temperature')
        start_date = request.args.get('start_date', (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'))
        end_date = request.args.get('end_date', datetime.now().strftime('%Y-%m-%d'))
        depth = float(request.args.get('depth', 0))

        # Get dataset configuration
        if dataset_type not in DATASETS:
            return jsonify({
                'success': False,
                'error': f'Invalid dataset type. Must be one of: {", ".join(DATASETS.keys())}'
            }), 400

        # Determine variables based on dataset type
        variable_map = {
            'temperature': ('thetao',),
            'currents': ('uo', 'vo'),
            'waves': ('VHM0', 'VMDR', 'VTPK'),
            'salinity': ('so',)
        }

        variables = variable_map[dataset_type]

        data = fetch_copernicus_data(
            dataset_id=DATASETS[dataset_type],
            variables=variables,
            start_date=start_date,
            end_date=end_date,
            depth=depth
        )

        return jsonify({
            'success': True,
            'data': data,
            'metadata': {
                'dataset': dataset_type.title(),
                'source': 'Copernicus Marine Service',
                'start_date': start_date,
                'end_date': end_date,
                'depth': depth,
                'bounds': SRI_LANKA_BOUNDS
            }
        })

    except Exception as e:
        logger.error(f"Error in get_historical_data: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/ocean/station', methods=['GET'])
def get_station_data():
    """
    Get ocean data for a specific station/location

    Query Parameters:
        lat: Latitude
        lon: Longitude
        date: Optional date (YYYY-MM-DD)
        datasets: Comma-separated list (e.g., "temperature,currents,waves")

    Returns:
        JSON with all requested data for the specific location
    """
    try:
        lat = float(request.args.get('lat'))
        lon = float(request.args.get('lon'))
        date_str = request.args.get('date', datetime.now().strftime('%Y-%m-%d'))
        datasets = request.args.get('datasets', 'temperature,currents,waves').split(',')

        result = {
            'location': {'latitude': lat, 'longitude': lon},
            'date': date_str,
            'data': {}
        }

        # Validate location is within Sri Lanka EEZ
        if not (SRI_LANKA_BOUNDS['min_lat'] <= lat <= SRI_LANKA_BOUNDS['max_lat'] and
                SRI_LANKA_BOUNDS['min_lon'] <= lon <= SRI_LANKA_BOUNDS['max_lon']):
            return jsonify({
                'success': False,
                'error': 'Location outside Sri Lanka maritime boundaries'
            }), 400

        # Fetch each requested dataset
        for dataset_type in datasets:
            dataset_type = dataset_type.strip()
            if dataset_type in DATASETS:
                try:
                    # This would need more sophisticated point extraction
                    # For now, fetch the full grid and extract nearest point
                    logger.info(f"Fetching {dataset_type} for point ({lat}, {lon})")
                    result['data'][dataset_type] = {
                        'status': 'available',
                        'note': 'Point extraction not yet implemented, use grid data'
                    }
                except Exception as e:
                    result['data'][dataset_type] = {
                        'status': 'error',
                        'error': str(e)
                    }

        return jsonify({
            'success': True,
            'result': result
        })

    except ValueError as e:
        return jsonify({
            'success': False,
            'error': 'Invalid latitude or longitude'
        }), 400
    except Exception as e:
        logger.error(f"Error in get_station_data: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/datasets', methods=['GET'])
def list_datasets():
    """
    List all available Copernicus datasets with metadata

    Returns:
        JSON with dataset information
    """
    return jsonify({
        'success': True,
        'datasets': {
            'temperature': {
                'id': DATASETS['temperature'],
                'name': 'Sea Surface Temperature',
                'variables': ['thetao'],
                'units': '°C',
                'temporal_resolution': 'Daily',
                'spatial_resolution': '0.083° (~9km)'
            },
            'currents': {
                'id': DATASETS['currents'],
                'name': 'Ocean Currents',
                'variables': ['uo', 'vo'],
                'units': 'm/s',
                'temporal_resolution': 'Daily',
                'spatial_resolution': '0.083° (~9km)'
            },
            'waves': {
                'id': DATASETS['waves'],
                'name': 'Wave Conditions',
                'variables': ['VHM0', 'VMDR', 'VTPK'],
                'units': 'm, degrees, seconds',
                'temporal_resolution': '3-hourly',
                'spatial_resolution': '0.083° (~9km)'
            },
            'salinity': {
                'id': DATASETS['salinity'],
                'name': 'Sea Water Salinity',
                'variables': ['so'],
                'units': 'PSU',
                'temporal_resolution': 'Daily',
                'spatial_resolution': '0.083° (~9km)'
            }
        },
        'bounds': SRI_LANKA_BOUNDS
    })


if __name__ == '__main__':
    # Check if Copernicus credentials are configured
    logger.info("Starting NARA Copernicus Marine API Backend")
    logger.info(f"Sri Lanka Bounds: {SRI_LANKA_BOUNDS}")
    logger.info("Available endpoints:")
    logger.info("  - GET /api/health")
    logger.info("  - GET /api/ocean/temperature/live")
    logger.info("  - GET /api/ocean/currents/live")
    logger.info("  - GET /api/ocean/waves/live")
    logger.info("  - GET /api/ocean/salinity/live")
    logger.info("  - GET /api/ocean/historical")
    logger.info("  - GET /api/ocean/station")
    logger.info("  - GET /api/datasets")

    # Run Flask app
    port = int(os.environ.get('PORT', 5001))  # Changed to 5001 to avoid macOS AirPlay conflict
    app.run(host='0.0.0.0', port=port, debug=True)
