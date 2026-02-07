-- NARA Library System - Initial Database Schema
-- PostgreSQL 14+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PATRON CATEGORIES
-- ============================================
CREATE TABLE patron_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  borrowing_limit INTEGER NOT NULL DEFAULT 5,
  loan_period_days INTEGER NOT NULL DEFAULT 14,
  fine_rate_per_day DECIMAL(10, 2) NOT NULL DEFAULT 10.00,
  can_renew BOOLEAN DEFAULT TRUE,
  max_renewals INTEGER DEFAULT 2,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default patron categories
INSERT INTO patron_categories (name, borrowing_limit, loan_period_days, fine_rate_per_day, description) VALUES
('Researcher', 10, 30, 10.00, 'Research staff and senior researchers'),
('Student', 5, 14, 5.00, 'University and college students'),
('Staff', 7, 21, 10.00, 'NARA staff members'),
('Public', 3, 14, 10.00, 'General public members');

-- ============================================
-- PATRONS (Library Users)
-- ============================================
CREATE TABLE patrons (
  id SERIAL PRIMARY KEY,
  firebase_uid VARCHAR(255) NOT NULL UNIQUE,
  patron_number VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  category_id INTEGER REFERENCES patron_categories(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'expired', 'inactive')),
  registration_date DATE DEFAULT CURRENT_DATE,
  expiry_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_patrons_firebase_uid ON patrons(firebase_uid);
CREATE INDEX idx_patrons_patron_number ON patrons(patron_number);
CREATE INDEX idx_patrons_email ON patrons(email);
CREATE INDEX idx_patrons_status ON patrons(status);

-- ============================================
-- MATERIAL TYPES
-- ============================================
CREATE TABLE material_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(20) NOT NULL UNIQUE,
  description TEXT,
  is_circulating BOOLEAN DEFAULT TRUE,
  loan_period_override INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert NARA-specific material types
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
('e-Reports', 'EREP', 'Electronic reports', TRUE);

-- ============================================
-- BIBLIOGRAPHIC RECORDS
-- ============================================
CREATE TABLE bibliographic_records (
  id SERIAL PRIMARY KEY,
  barcode VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  subtitle VARCHAR(500),
  author VARCHAR(500),
  additional_authors TEXT,
  isbn VARCHAR(20),
  issn VARCHAR(20),
  publisher VARCHAR(255),
  publication_year INTEGER,
  edition VARCHAR(50),
  pages INTEGER,
  language VARCHAR(50) DEFAULT 'English',
  material_type_id INTEGER REFERENCES material_types(id) ON DELETE SET NULL,
  subject_headings TEXT[],
  keywords TEXT[],
  abstract TEXT,
  call_number VARCHAR(100),
  location VARCHAR(255) DEFAULT 'Main Library',
  shelf_location VARCHAR(100),
  total_copies INTEGER DEFAULT 1,
  available_copies INTEGER DEFAULT 1,
  cover_image_url TEXT,
  notes TEXT,
  acquisition_date DATE,
  price DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'withdrawn', 'lost', 'damaged', 'on_order')),
  search_vector tsvector,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Full-text search index
CREATE INDEX idx_bibliographic_search ON bibliographic_records USING GIN(search_vector);
CREATE INDEX idx_bibliographic_barcode ON bibliographic_records(barcode);
CREATE INDEX idx_bibliographic_isbn ON bibliographic_records(isbn);
CREATE INDEX idx_bibliographic_issn ON bibliographic_records(issn);
CREATE INDEX idx_bibliographic_material_type ON bibliographic_records(material_type_id);
CREATE INDEX idx_bibliographic_status ON bibliographic_records(status);
CREATE INDEX idx_bibliographic_call_number ON bibliographic_records(call_number);

-- Trigger to update search vector
CREATE OR REPLACE FUNCTION update_bibliographic_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.author, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.publisher, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.subject_headings, ' '), '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.keywords, ' '), '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.abstract, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bibliographic_search_vector_update
BEFORE INSERT OR UPDATE ON bibliographic_records
FOR EACH ROW EXECUTE FUNCTION update_bibliographic_search_vector();

-- ============================================
-- CIRCULATION TRANSACTIONS
-- ============================================
CREATE TABLE circulation_transactions (
  id SERIAL PRIMARY KEY,
  patron_id INTEGER REFERENCES patrons(id) ON DELETE CASCADE,
  item_id INTEGER REFERENCES bibliographic_records(id) ON DELETE CASCADE,
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('checkout', 'checkin', 'renewal')),
  checkout_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  due_date DATE NOT NULL,
  return_date TIMESTAMP,
  renewed_count INTEGER DEFAULT 0,
  librarian_uid VARCHAR(255),
  librarian_name VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_circulation_patron ON circulation_transactions(patron_id);
CREATE INDEX idx_circulation_item ON circulation_transactions(item_id);
CREATE INDEX idx_circulation_due_date ON circulation_transactions(due_date);
CREATE INDEX idx_circulation_return_date ON circulation_transactions(return_date);
CREATE INDEX idx_circulation_type ON circulation_transactions(transaction_type);

-- ============================================
-- HOLDS AND RESERVATIONS
-- ============================================
CREATE TABLE holds_reservations (
  id SERIAL PRIMARY KEY,
  patron_id INTEGER REFERENCES patrons(id) ON DELETE CASCADE,
  item_id INTEGER REFERENCES bibliographic_records(id) ON DELETE CASCADE,
  hold_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expiry_date DATE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'available', 'fulfilled', 'cancelled', 'expired')),
  notification_sent BOOLEAN DEFAULT FALSE,
  pickup_location VARCHAR(255) DEFAULT 'Main Library',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_holds_patron ON holds_reservations(patron_id);
CREATE INDEX idx_holds_item ON holds_reservations(item_id);
CREATE INDEX idx_holds_status ON holds_reservations(status);
CREATE INDEX idx_holds_date ON holds_reservations(hold_date);

-- ============================================
-- FINES
-- ============================================
CREATE TABLE fines (
  id SERIAL PRIMARY KEY,
  patron_id INTEGER REFERENCES patrons(id) ON DELETE CASCADE,
  transaction_id INTEGER REFERENCES circulation_transactions(id) ON DELETE SET NULL,
  fine_type VARCHAR(50) DEFAULT 'overdue' CHECK (fine_type IN ('overdue', 'lost', 'damaged', 'other')),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'LKR',
  days_overdue INTEGER,
  status VARCHAR(20) DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'waived', 'partial')),
  amount_paid DECIMAL(10, 2) DEFAULT 0.00,
  payment_date TIMESTAMP,
  payment_method VARCHAR(50),
  payment_reference VARCHAR(100),
  waived_by VARCHAR(255),
  waive_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fines_patron ON fines(patron_id);
CREATE INDEX idx_fines_status ON fines(status);
CREATE INDEX idx_fines_type ON fines(fine_type);

-- ============================================
-- SUPPLIERS
-- ============================================
CREATE TABLE suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  website VARCHAR(255),
  payment_terms TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_suppliers_name ON suppliers(name);
CREATE INDEX idx_suppliers_status ON suppliers(status);

-- ============================================
-- ACQUISITIONS
-- ============================================
CREATE TABLE acquisitions (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL,
  order_date DATE DEFAULT CURRENT_DATE,
  expected_delivery_date DATE,
  actual_delivery_date DATE,
  status VARCHAR(20) DEFAULT 'ordered' CHECK (status IN ('ordered', 'received', 'catalogued', 'cancelled')),
  total_amount DECIMAL(10, 2),
  currency VARCHAR(10) DEFAULT 'LKR',
  invoice_number VARCHAR(100),
  invoice_date DATE,
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial', 'cancelled')),
  budget_category VARCHAR(100),
  ordered_by VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_acquisitions_order_number ON acquisitions(order_number);
CREATE INDEX idx_acquisitions_supplier ON acquisitions(supplier_id);
CREATE INDEX idx_acquisitions_status ON acquisitions(status);
CREATE INDEX idx_acquisitions_order_date ON acquisitions(order_date);

-- ============================================
-- ACQUISITION ITEMS
-- ============================================
CREATE TABLE acquisition_items (
  id SERIAL PRIMARY KEY,
  acquisition_id INTEGER REFERENCES acquisitions(id) ON DELETE CASCADE,
  bibliographic_record_id INTEGER REFERENCES bibliographic_records(id) ON DELETE SET NULL,
  title VARCHAR(500) NOT NULL,
  author VARCHAR(500),
  isbn VARCHAR(20),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2),
  total_price DECIMAL(10, 2),
  received_quantity INTEGER DEFAULT 0,
  catalogued_quantity INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_acquisition_items_acquisition ON acquisition_items(acquisition_id);
CREATE INDEX idx_acquisition_items_biblio ON acquisition_items(bibliographic_record_id);

-- ============================================
-- SERIALS
-- ============================================
CREATE TABLE serials (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  issn VARCHAR(20),
  publisher VARCHAR(255),
  frequency VARCHAR(50) CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'biannual', 'annual', 'irregular')),
  subscription_start_date DATE,
  subscription_end_date DATE,
  supplier_id INTEGER REFERENCES suppliers(id) ON DELETE SET NULL,
  subscription_cost DECIMAL(10, 2),
  currency VARCHAR(10) DEFAULT 'LKR',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'on_hold')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_serials_title ON serials(title);
CREATE INDEX idx_serials_issn ON serials(issn);
CREATE INDEX idx_serials_status ON serials(status);

-- ============================================
-- SERIAL ISSUES
-- ============================================
CREATE TABLE serial_issues (
  id SERIAL PRIMARY KEY,
  serial_id INTEGER REFERENCES serials(id) ON DELETE CASCADE,
  volume_number VARCHAR(50),
  issue_number VARCHAR(50),
  publication_date DATE,
  expected_date DATE,
  received_date DATE,
  status VARCHAR(20) DEFAULT 'expected' CHECK (status IN ('expected', 'received', 'missing', 'claimed', 'cancelled')),
  claim_date DATE,
  claim_count INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_serial_issues_serial ON serial_issues(serial_id);
CREATE INDEX idx_serial_issues_status ON serial_issues(status);
CREATE INDEX idx_serial_issues_expected_date ON serial_issues(expected_date);

-- ============================================
-- LIBRARY SETTINGS
-- ============================================
CREATE TABLE library_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(20) DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO library_settings (setting_key, setting_value, setting_type, description) VALUES
('library_name', 'NARA Library', 'string', 'Official library name'),
('library_email', 'library@nara.gov.lk', 'string', 'Library contact email'),
('library_phone', '+94-11-2521000', 'string', 'Library contact phone'),
('overdue_notice_days', '3', 'number', 'Days before due date to send reminder'),
('max_renewal_count', '2', 'number', 'Maximum number of renewals allowed'),
('fine_grace_period', '3', 'number', 'Grace period in days before fines apply'),
('enable_email_notifications', 'true', 'boolean', 'Enable email notifications'),
('enable_holds', 'true', 'boolean', 'Enable hold/reservation system');

-- ============================================
-- AUDIT LOG
-- ============================================
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  user_uid VARCHAR(255),
  user_name VARCHAR(255),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INTEGER,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user ON audit_log(user_uid);
CREATE INDEX idx_audit_action ON audit_log(action);
CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_log(created_at);

-- ============================================
-- VIEWS FOR REPORTING
-- ============================================

-- Active loans view
CREATE VIEW active_loans AS
SELECT 
  ct.id,
  ct.patron_id,
  p.patron_number,
  p.full_name AS patron_name,
  p.email AS patron_email,
  ct.item_id,
  br.barcode,
  br.title,
  br.author,
  ct.checkout_date,
  ct.due_date,
  ct.renewed_count,
  CASE 
    WHEN ct.due_date < CURRENT_DATE THEN TRUE 
    ELSE FALSE 
  END AS is_overdue,
  CURRENT_DATE - ct.due_date AS days_overdue
FROM circulation_transactions ct
JOIN patrons p ON ct.patron_id = p.id
JOIN bibliographic_records br ON ct.item_id = br.id
WHERE ct.return_date IS NULL
ORDER BY ct.due_date;

-- Overdue items view
CREATE VIEW overdue_items AS
SELECT * FROM active_loans
WHERE is_overdue = TRUE
ORDER BY days_overdue DESC;

-- Patron statistics view
CREATE VIEW patron_statistics AS
SELECT 
  p.id,
  p.patron_number,
  p.full_name,
  p.email,
  pc.name AS category,
  COUNT(DISTINCT ct.id) FILTER (WHERE ct.return_date IS NULL) AS active_loans,
  COUNT(DISTINCT ct.id) AS total_loans,
  COALESCE(SUM(f.amount - f.amount_paid), 0) AS outstanding_fines,
  COUNT(DISTINCT hr.id) FILTER (WHERE hr.status = 'pending') AS active_holds
FROM patrons p
LEFT JOIN patron_categories pc ON p.category_id = pc.id
LEFT JOIN circulation_transactions ct ON p.id = ct.patron_id
LEFT JOIN fines f ON p.id = f.patron_id AND f.status != 'paid'
LEFT JOIN holds_reservations hr ON p.id = hr.patron_id
GROUP BY p.id, p.patron_number, p.full_name, p.email, pc.name;

-- Collection statistics view
CREATE VIEW collection_statistics AS
SELECT 
  mt.name AS material_type,
  COUNT(br.id) AS total_items,
  SUM(br.total_copies) AS total_copies,
  SUM(br.available_copies) AS available_copies,
  SUM(br.total_copies - br.available_copies) AS checked_out_copies,
  COUNT(DISTINCT ct.id) AS total_circulations
FROM material_types mt
LEFT JOIN bibliographic_records br ON mt.id = br.material_type_id
LEFT JOIN circulation_transactions ct ON br.id = ct.item_id
GROUP BY mt.id, mt.name
ORDER BY total_items DESC;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to calculate fine amount
CREATE OR REPLACE FUNCTION calculate_fine(
  p_patron_id INTEGER,
  p_due_date DATE,
  p_return_date DATE DEFAULT CURRENT_DATE
)
RETURNS DECIMAL(10, 2) AS $$
DECLARE
  v_days_overdue INTEGER;
  v_grace_period INTEGER;
  v_fine_rate DECIMAL(10, 2);
  v_fine_amount DECIMAL(10, 2);
BEGIN
  -- Get grace period from settings
  SELECT CAST(setting_value AS INTEGER) INTO v_grace_period
  FROM library_settings WHERE setting_key = 'fine_grace_period';
  
  -- Calculate days overdue
  v_days_overdue := p_return_date - p_due_date;
  
  -- If not overdue or within grace period, no fine
  IF v_days_overdue <= v_grace_period THEN
    RETURN 0.00;
  END IF;
  
  -- Get patron's fine rate
  SELECT pc.fine_rate_per_day INTO v_fine_rate
  FROM patrons p
  JOIN patron_categories pc ON p.category_id = pc.id
  WHERE p.id = p_patron_id;
  
  -- Calculate fine (excluding grace period)
  v_fine_amount := (v_days_overdue - v_grace_period) * v_fine_rate;
  
  RETURN v_fine_amount;
END;
$$ LANGUAGE plpgsql;

-- Function to update item availability
CREATE OR REPLACE FUNCTION update_item_availability()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.transaction_type = 'checkout' THEN
    -- Decrease available copies on checkout
    UPDATE bibliographic_records
    SET available_copies = available_copies - 1
    WHERE id = NEW.item_id AND available_copies > 0;
  ELSIF TG_OP = 'UPDATE' AND NEW.return_date IS NOT NULL AND OLD.return_date IS NULL THEN
    -- Increase available copies on return
    UPDATE bibliographic_records
    SET available_copies = available_copies + 1
    WHERE id = NEW.item_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_availability_on_circulation
AFTER INSERT OR UPDATE ON circulation_transactions
FOR EACH ROW EXECUTE FUNCTION update_item_availability();

-- ============================================
-- INITIAL DATA COMPLETE
-- ============================================

-- Create a function to generate patron numbers
CREATE OR REPLACE FUNCTION generate_patron_number()
RETURNS VARCHAR(50) AS $$
DECLARE
  v_year VARCHAR(4);
  v_sequence INTEGER;
  v_patron_number VARCHAR(50);
BEGIN
  v_year := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(patron_number FROM 6) AS INTEGER)), 0) + 1
  INTO v_sequence
  FROM patrons
  WHERE patron_number LIKE 'PAT' || v_year || '%';
  
  v_patron_number := 'PAT' || v_year || LPAD(v_sequence::TEXT, 5, '0');
  
  RETURN v_patron_number;
END;
$$ LANGUAGE plpgsql;

-- Create a function to generate barcodes
CREATE OR REPLACE FUNCTION generate_barcode()
RETURNS VARCHAR(50) AS $$
DECLARE
  v_sequence INTEGER;
  v_barcode VARCHAR(50);
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(barcode FROM 5) AS INTEGER)), 100000) + 1
  INTO v_sequence
  FROM bibliographic_records;
  
  v_barcode := 'NARA' || LPAD(v_sequence::TEXT, 8, '0');
  
  RETURN v_barcode;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions (adjust as needed for your database user)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_db_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_db_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO your_db_user;

