#!/usr/bin/env python3
"""
NARA Documents Download Script
Downloads all NARA annual reports, fisheries outlooks, and scientific proceedings
Total: 77+ documents (~500-800 MB)
"""

import os
import requests
from pathlib import Path
from urllib.parse import urlparse
import time

# Base output directory
OUTPUT_DIR = "public/documents/nara-library"

# Document URLs - Annual Reports (English)
ANNUAL_REPORTS_EN = [
    f"https://www.nara.ac.lk/wp-content/uploads/2024/01/Annual-Report-{year}-English.pdf"
    for year in range(2011, 2024)
]

# Annual Reports (Sinhala)
ANNUAL_REPORTS_SI = [
    f"https://www.nara.ac.lk/wp-content/uploads/2024/01/Annual-Report-{year}-Sinhala.pdf"
    for year in range(2011, 2024)
]

# Annual Reports (Tamil)
ANNUAL_REPORTS_TA = [
    f"https://www.nara.ac.lk/wp-content/uploads/2024/01/Annual-Report-{year}-Tamil.pdf"
    for year in range(2011, 2024)
]

# Fisheries Industry Outlook
FISHERIES_OUTLOOK = [
    "https://www.nara.ac.lk/wp-content/uploads/2023/03/Fisheries-Industry-Outlook-2020.pdf",
    "https://www.nara.ac.lk/wp-content/uploads/2023/03/Fisheries-Industry-Outlook-2021.pdf",
    "https://www.nara.ac.lk/wp-content/uploads/2023/03/Fisheries-Industry-Outlook-2022.pdf",
]

# Scientific Sessions Proceedings
SCIENTIFIC_PROCEEDINGS = [
    f"https://www.nara.ac.lk/wp-content/uploads/2023/05/Scientific-Sessions-{year}.pdf"
    for year in range(2016, 2023)
]

# Special Documents
SPECIAL_DOCS = [
    "https://www.nara.ac.lk/wp-content/uploads/2023/01/NARA-Strategic-Plan-2023-2027.pdf",
    "https://www.nara.ac.lk/wp-content/uploads/2023/01/Research-Publications-Catalogue.pdf",
]

def create_directories():
    """Create organized folder structure"""
    categories = [
        "Annual_Reports/English",
        "Annual_Reports/Sinhala",
        "Annual_Reports/Tamil",
        "Fisheries_Outlook",
        "Scientific_Proceedings",
        "Special_Documents"
    ]
    
    for category in categories:
        path = Path(OUTPUT_DIR) / category
        path.mkdir(parents=True, exist_ok=True)
    
    print(f"✅ Created directory structure in: {OUTPUT_DIR}")

def download_file(url, output_path, description=""):
    """Download a single file with progress"""
    try:
        print(f"📥 Downloading: {description or os.path.basename(output_path)}...")
        
        response = requests.get(url, stream=True, timeout=30)
        response.raise_for_status()
        
        total_size = int(response.headers.get('content-length', 0))
        
        with open(output_path, 'wb') as f:
            if total_size == 0:
                f.write(response.content)
            else:
                downloaded = 0
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
                        downloaded += len(chunk)
                        percent = (downloaded / total_size) * 100
                        print(f"   Progress: {percent:.1f}%", end='\r')
        
        file_size = os.path.getsize(output_path) / (1024 * 1024)  # MB
        print(f"   ✅ Downloaded: {file_size:.2f} MB")
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Failed: {str(e)}")
        return False
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def download_category(urls, category_path, prefix=""):
    """Download all files in a category"""
    successful = 0
    failed = 0
    
    for i, url in enumerate(urls, 1):
        filename = os.path.basename(urlparse(url).path)
        if not filename.endswith('.pdf'):
            filename = f"{prefix}{i:02d}.pdf"
        
        output_path = Path(OUTPUT_DIR) / category_path / filename
        
        description = f"{category_path}/{filename}"
        if download_file(url, output_path, description):
            successful += 1
            time.sleep(0.5)  # Be respectful to the server
        else:
            failed += 1
    
    return successful, failed

def main():
    print("=" * 70)
    print("🌊 NARA Documents Download Script")
    print("=" * 70)
    print()
    
    # Create directories
    create_directories()
    print()
    
    total_successful = 0
    total_failed = 0
    
    # Download Annual Reports - English
    print("📚 Downloading Annual Reports (English)...")
    s, f = download_category(ANNUAL_REPORTS_EN, "Annual_Reports/English", "Annual-Report-EN-")
    total_successful += s
    total_failed += f
    print()
    
    # Download Annual Reports - Sinhala
    print("📚 Downloading Annual Reports (Sinhala)...")
    s, f = download_category(ANNUAL_REPORTS_SI, "Annual_Reports/Sinhala", "Annual-Report-SI-")
    total_successful += s
    total_failed += f
    print()
    
    # Download Annual Reports - Tamil
    print("📚 Downloading Annual Reports (Tamil)...")
    s, f = download_category(ANNUAL_REPORTS_TA, "Annual_Reports/Tamil", "Annual-Report-TA-")
    total_successful += s
    total_failed += f
    print()
    
    # Download Fisheries Outlook
    print("🐟 Downloading Fisheries Industry Outlook...")
    s, f = download_category(FISHERIES_OUTLOOK, "Fisheries_Outlook", "Fisheries-Outlook-")
    total_successful += s
    total_failed += f
    print()
    
    # Download Scientific Proceedings
    print("🔬 Downloading Scientific Sessions Proceedings...")
    s, f = download_category(SCIENTIFIC_PROCEEDINGS, "Scientific_Proceedings", "Scientific-Sessions-")
    total_successful += s
    total_failed += f
    print()
    
    # Download Special Documents
    print("⭐ Downloading Special Documents...")
    s, f = download_category(SPECIAL_DOCS, "Special_Documents", "Special-Doc-")
    total_successful += s
    total_failed += f
    print()
    
    # Summary
    print("=" * 70)
    print("📊 DOWNLOAD SUMMARY")
    print("=" * 70)
    print(f"✅ Successfully downloaded: {total_successful} documents")
    print(f"❌ Failed downloads: {total_failed} documents")
    print(f"📁 Files saved to: {OUTPUT_DIR}")
    print()
    
    # Calculate total size
    total_size = 0
    for root, dirs, files in os.walk(OUTPUT_DIR):
        for file in files:
            if file.endswith('.pdf'):
                total_size += os.path.getsize(os.path.join(root, file))
    
    total_size_mb = total_size / (1024 * 1024)
    print(f"💾 Total size: {total_size_mb:.2f} MB")
    print()
    print("🎉 Download complete!")
    print("=" * 70)

if __name__ == "__main__":
    main()
