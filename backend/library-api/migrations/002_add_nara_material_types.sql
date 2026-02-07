-- NARA Library System - Add/Update Material Types
-- This script can be run separately to add NARA-specific material types to an existing database

-- First, clear existing generic material types if this is a fresh install
-- (Comment out if you want to keep existing types)
-- DELETE FROM material_types;

-- Insert or update NARA-specific material types
INSERT INTO material_types (name, code, description, is_circulating) VALUES
('Acts', 'ACT', 'Legislative acts and regulations', TRUE),
('Atapattu Collection', 'ATC', 'Atapattu special collection', TRUE),
('BOBP Reports', 'BOBP', 'Bay of Bengal Programme reports', TRUE),
('CDs', 'CD', 'Compact discs and digital media', TRUE),
('Digital Map', 'DMAP', 'Digital cartographic materials', TRUE),
('Electronic Books', 'EBOOK', 'Electronic book resources', TRUE),
('FAO Reports', 'FAO', 'Food and Agriculture Organization reports', TRUE),
('IOC Reports', 'IOC', 'Intergovernmental Oceanographic Commission reports', TRUE),
('IWMI Reports', 'IWMI', 'International Water Management Institute reports', TRUE),
('Journal', 'JR', 'Periodical journals', TRUE),
('Lending Book', 'LBOOK', 'Books available for lending', TRUE),
('Maps', 'MAP', 'Physical maps and charts', TRUE),
('Newspaper Articles', 'NEWS', 'Newspaper clippings and articles', TRUE),
('Permanent Reference', 'PREF', 'Permanent reference materials (non-circulating)', FALSE),
('Proceedings', 'PROC', 'Conference and symposium proceedings', TRUE),
('Prof. Upali Amarasinghe Collection', 'UACOL', 'Prof. Upali Amarasinghe special collection', TRUE),
('Reference Book', 'RBOOK', 'Reference books (non-circulating)', FALSE),
('Research Papers', 'RPAPER', 'Research papers and publications', TRUE),
('Research Reports - NARA', 'RNARA', 'NARA research reports', TRUE),
('Special Reference', 'SREF', 'Special reference materials', FALSE),
('Sri Lanka Collection - Books', 'SLBOOK', 'Sri Lankan book collection', TRUE),
('Sri Lanka Collection - Reports', 'SLREP', 'Sri Lankan report collection', TRUE),
('Thesis', 'THESIS', 'Academic theses and dissertations', TRUE),
('World Fisheries Collection', 'WFISH', 'World fisheries collection', TRUE),
('e-Journal Articles', 'EJART', 'Electronic journal articles', TRUE),
('e-Reports', 'EREP', 'Electronic reports', TRUE)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_circulating = EXCLUDED.is_circulating;

-- Verify the material types were added
SELECT id, name, code, is_circulating FROM material_types ORDER BY name;

-- Show count
SELECT COUNT(*) as total_material_types FROM material_types;

