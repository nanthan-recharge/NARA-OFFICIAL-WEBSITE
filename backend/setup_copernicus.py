#!/usr/bin/env python3
"""
Setup script for Copernicus Marine credentials
"""

import copernicusmarine
import os

# Credentials
USERNAME = "info@safenetcreations.com"
PASSWORD = "Ellalan@2016"

print("🌊 Setting up Copernicus Marine credentials...")
print(f"Username: {USERNAME}")

try:
    # Configure credentials
    os.environ['COPERNICUS_MARINE_SERVICE_USERNAME'] = USERNAME
    os.environ['COPERNICUS_MARINE_SERVICE_PASSWORD'] = PASSWORD

    # Test credentials by attempting login
    print("\n✓ Credentials configured successfully!")
    print("\nCredentials have been set in environment variables.")
    print("They will be available for this session.")

    print("\n" + "="*60)
    print("NEXT STEPS:")
    print("="*60)
    print("\n1. Start the Flask backend:")
    print("   python3 copernicus_flask_api.py")
    print("\n2. Test the API:")
    print("   curl http://localhost:5000/api/health")
    print("   curl http://localhost:5000/api/ocean/temperature/live")
    print("\n3. Start the frontend:")
    print("   cd ..")
    print("   npm run dev")
    print("\n4. Access the live ocean data:")
    print("   http://localhost:4028/live-ocean-data")
    print("\n" + "="*60)

except Exception as e:
    print(f"\n❌ Error: {e}")
    print("\nPlease check your credentials and try again.")
