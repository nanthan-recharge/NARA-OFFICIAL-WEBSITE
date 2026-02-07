-- Add fields for background agent integration
-- These fields support automated book downloads and QR code storage

-- Add URL field for digital resources (PDFs in Firebase Storage)
ALTER TABLE bibliographic_records 
ADD COLUMN IF NOT EXISTS url TEXT;

-- Add download source tracking
ALTER TABLE bibliographic_records 
ADD COLUMN IF NOT EXISTS download_source VARCHAR(100);

-- Add source URL (original source where book was found)
ALTER TABLE bibliographic_records 
ADD COLUMN IF NOT EXISTS source_url TEXT;

-- Add file hash for integrity verification
ALTER TABLE bibliographic_records 
ADD COLUMN IF NOT EXISTS file_hash VARCHAR(64);

-- Add page count (extracted from PDF)
ALTER TABLE bibliographic_records 
ADD COLUMN IF NOT EXISTS page_count INTEGER;

-- Add QR code URL (stored in Firebase Storage)
ALTER TABLE bibliographic_records 
ADD COLUMN IF NOT EXISTS qr_code_url TEXT;

-- Create indexes for new fields
CREATE INDEX IF NOT EXISTS idx_bibliographic_download_source 
ON bibliographic_records(download_source);

CREATE INDEX IF NOT EXISTS idx_bibliographic_file_hash 
ON bibliographic_records(file_hash);

-- Add comments for documentation
COMMENT ON COLUMN bibliographic_records.url IS 'Firebase Storage URL for PDF file';
COMMENT ON COLUMN bibliographic_records.download_source IS 'Source API (CORE, Internet Archive, DOAJ, etc.)';
COMMENT ON COLUMN bibliographic_records.source_url IS 'Original URL where book was discovered';
COMMENT ON COLUMN bibliographic_records.file_hash IS 'SHA-256 hash of PDF file for integrity';
COMMENT ON COLUMN bibliographic_records.page_count IS 'Number of pages in PDF';
COMMENT ON COLUMN bibliographic_records.qr_code_url IS 'Firebase Storage URL for QR code image';

