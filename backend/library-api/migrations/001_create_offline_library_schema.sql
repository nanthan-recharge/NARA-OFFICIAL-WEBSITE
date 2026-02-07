-- =====================================================
-- NARA OFFLINE LIBRARY DATABASE SCHEMA
-- Complete database structure for the offline library system
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CATEGORIES TABLE
-- Stores all book categories/subjects
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100), -- Icon name for UI
    color VARCHAR(50), -- Color code for UI
    parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_active ON categories(is_active);

-- =====================================================
-- 2. AUTHORS TABLE
-- Stores book authors/contributors
-- =====================================================
CREATE TABLE IF NOT EXISTS authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    name_si VARCHAR(500), -- Sinhala name
    name_ta VARCHAR(500), -- Tamil name
    biography TEXT,
    biography_si TEXT,
    biography_ta TEXT,
    nationality VARCHAR(100),
    birth_year INTEGER,
    death_year INTEGER,
    website_url VARCHAR(500),
    photo_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_authors_name ON authors(name);
CREATE INDEX idx_authors_active ON authors(is_active);

-- =====================================================
-- 3. PUBLISHERS TABLE
-- Stores publisher information
-- =====================================================
CREATE TABLE IF NOT EXISTS publishers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    name_si VARCHAR(500),
    name_ta VARCHAR(500),
    country VARCHAR(100),
    city VARCHAR(200),
    website_url VARCHAR(500),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    logo_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_publishers_name ON publishers(name);
CREATE INDEX idx_publishers_country ON publishers(country);

-- =====================================================
-- 4. OFFLINE_BOOKS TABLE (MAIN TABLE)
-- Stores all offline library book records
-- =====================================================
CREATE TABLE IF NOT EXISTS offline_books (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,

    -- Basic Information
    title VARCHAR(1000) NOT NULL,
    title_si VARCHAR(1000), -- Sinhala title
    title_ta VARCHAR(1000), -- Tamil title
    subtitle VARCHAR(1000),
    subtitle_si VARCHAR(1000),
    subtitle_ta VARCHAR(1000),

    -- Identifiers
    isbn VARCHAR(50),
    isbn13 VARCHAR(50),
    issn VARCHAR(50),
    accession_number VARCHAR(100) UNIQUE,
    call_number VARCHAR(200),
    barcode VARCHAR(100) UNIQUE,

    -- Classification
    dewey_decimal VARCHAR(50),
    lcc VARCHAR(50), -- Library of Congress Classification
    subject_headings TEXT[],
    keywords TEXT[],

    -- Physical Description
    edition VARCHAR(100),
    publication_year INTEGER,
    publication_month INTEGER,
    publication_date DATE,
    pages INTEGER,
    dimensions VARCHAR(100), -- e.g., "24 x 16 cm"
    weight_grams INTEGER,
    binding_type VARCHAR(50), -- Hardcover, Paperback, etc.

    -- Content
    description TEXT,
    description_si TEXT,
    description_ta TEXT,
    table_of_contents TEXT,
    abstract TEXT,
    language VARCHAR(10) DEFAULT 'en', -- ISO 639-1 code
    additional_languages VARCHAR(10)[],

    -- Media/Files
    cover_image_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    pdf_url VARCHAR(500),
    epub_url VARCHAR(500),
    audio_url VARCHAR(500),

    -- Location
    shelf_location VARCHAR(200),
    floor_number INTEGER,
    section VARCHAR(100),
    row_number VARCHAR(50),

    -- Status
    status VARCHAR(50) DEFAULT 'available', -- available, checked_out, reserved, maintenance, lost, damaged
    condition VARCHAR(50) DEFAULT 'good', -- new, good, fair, poor, damaged
    is_reference_only BOOLEAN DEFAULT FALSE,
    is_restricted BOOLEAN DEFAULT FALSE,
    restriction_note TEXT,

    -- Copies
    total_copies INTEGER DEFAULT 1,
    available_copies INTEGER DEFAULT 1,

    -- Pricing & Acquisition
    price_lkr DECIMAL(10,2),
    price_currency VARCHAR(10) DEFAULT 'LKR',
    purchase_date DATE,
    vendor VARCHAR(500),
    acquisition_method VARCHAR(50), -- purchase, donation, exchange, etc.

    -- Statistics
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    checkout_count INTEGER DEFAULT 0,
    rating_average DECIMAL(3,2) DEFAULT 0.00,
    rating_count INTEGER DEFAULT 0,

    -- Flags
    is_featured BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    is_digital_copy_available BOOLEAN DEFAULT FALSE,

    -- Metadata
    notes TEXT,
    internal_notes TEXT, -- Staff only
    source VARCHAR(200), -- Where the book data came from
    external_id VARCHAR(255), -- ID from external system

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cataloged_at TIMESTAMP,
    cataloged_by VARCHAR(255),

    -- Search optimization
    search_vector TSVECTOR
);

-- Indexes for offline_books
CREATE INDEX idx_offline_books_uuid ON offline_books(uuid);
CREATE INDEX idx_offline_books_title ON offline_books(title);
CREATE INDEX idx_offline_books_isbn ON offline_books(isbn);
CREATE INDEX idx_offline_books_accession ON offline_books(accession_number);
CREATE INDEX idx_offline_books_barcode ON offline_books(barcode);
CREATE INDEX idx_offline_books_status ON offline_books(status);
CREATE INDEX idx_offline_books_language ON offline_books(language);
CREATE INDEX idx_offline_books_year ON offline_books(publication_year);
CREATE INDEX idx_offline_books_dewey ON offline_books(dewey_decimal);
CREATE INDEX idx_offline_books_featured ON offline_books(is_featured);
CREATE INDEX idx_offline_books_new_arrival ON offline_books(is_new_arrival);
CREATE INDEX idx_offline_books_archived ON offline_books(is_archived);
CREATE INDEX idx_offline_books_search ON offline_books USING gin(search_vector);
CREATE INDEX idx_offline_books_keywords ON offline_books USING gin(keywords);
CREATE INDEX idx_offline_books_subjects ON offline_books USING gin(subject_headings);

-- =====================================================
-- 5. BOOK_AUTHORS JUNCTION TABLE
-- Many-to-many relationship between books and authors
-- =====================================================
CREATE TABLE IF NOT EXISTS book_authors (
    id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES offline_books(id) ON DELETE CASCADE,
    author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
    author_role VARCHAR(50) DEFAULT 'author', -- author, editor, translator, illustrator, etc.
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(book_id, author_id, author_role)
);

CREATE INDEX idx_book_authors_book ON book_authors(book_id);
CREATE INDEX idx_book_authors_author ON book_authors(author_id);

-- =====================================================
-- 6. BOOK_CATEGORIES JUNCTION TABLE
-- Many-to-many relationship between books and categories
-- =====================================================
CREATE TABLE IF NOT EXISTS book_categories (
    id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES offline_books(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(book_id, category_id)
);

CREATE INDEX idx_book_categories_book ON book_categories(book_id);
CREATE INDEX idx_book_categories_category ON book_categories(category_id);
CREATE INDEX idx_book_categories_primary ON book_categories(is_primary);

-- =====================================================
-- 7. BOOK_PUBLISHERS JUNCTION TABLE
-- Many-to-many relationship between books and publishers
-- =====================================================
CREATE TABLE IF NOT EXISTS book_publishers (
    id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES offline_books(id) ON DELETE CASCADE,
    publisher_id INTEGER NOT NULL REFERENCES publishers(id) ON DELETE CASCADE,
    publisher_role VARCHAR(50) DEFAULT 'publisher', -- publisher, co-publisher, distributor
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(book_id, publisher_id, publisher_role)
);

CREATE INDEX idx_book_publishers_book ON book_publishers(book_id);
CREATE INDEX idx_book_publishers_publisher ON book_publishers(publisher_id);

-- =====================================================
-- 8. BOOK_COPIES TABLE
-- Individual physical copies of books
-- =====================================================
CREATE TABLE IF NOT EXISTS book_copies (
    id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES offline_books(id) ON DELETE CASCADE,
    copy_number INTEGER NOT NULL,
    barcode VARCHAR(100) UNIQUE,
    rfid_tag VARCHAR(100) UNIQUE,
    status VARCHAR(50) DEFAULT 'available',
    condition VARCHAR(50) DEFAULT 'good',
    location VARCHAR(200),
    shelf_location VARCHAR(200),
    notes TEXT,
    purchase_date DATE,
    price_lkr DECIMAL(10,2),
    last_checked_out TIMESTAMP,
    checkout_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(book_id, copy_number)
);

CREATE INDEX idx_book_copies_book ON book_copies(book_id);
CREATE INDEX idx_book_copies_barcode ON book_copies(barcode);
CREATE INDEX idx_book_copies_status ON book_copies(status);

-- =====================================================
-- 9. BOOK_REVIEWS TABLE
-- User reviews and ratings for books
-- =====================================================
CREATE TABLE IF NOT EXISTS book_reviews (
    id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES offline_books(id) ON DELETE CASCADE,
    user_id VARCHAR(255),
    user_name VARCHAR(255),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    review_title VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    helpful_count INTEGER DEFAULT 0,
    unhelpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_book_reviews_book ON book_reviews(book_id);
CREATE INDEX idx_book_reviews_rating ON book_reviews(rating);
CREATE INDEX idx_book_reviews_approved ON book_reviews(is_approved);

-- =====================================================
-- 10. CHECKOUT_HISTORY TABLE
-- Track book checkouts and returns
-- =====================================================
CREATE TABLE IF NOT EXISTS checkout_history (
    id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES offline_books(id),
    copy_id INTEGER REFERENCES book_copies(id),
    patron_id VARCHAR(255) NOT NULL,
    patron_name VARCHAR(500),
    patron_email VARCHAR(255),
    patron_phone VARCHAR(50),
    checkout_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    return_date TIMESTAMP,
    renewal_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'checked_out', -- checked_out, returned, overdue, lost
    fine_amount DECIMAL(10,2) DEFAULT 0.00,
    fine_paid BOOLEAN DEFAULT FALSE,
    notes TEXT,
    checked_out_by VARCHAR(255), -- Staff member
    returned_to VARCHAR(255), -- Staff member
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_checkout_history_book ON checkout_history(book_id);
CREATE INDEX idx_checkout_history_patron ON checkout_history(patron_id);
CREATE INDEX idx_checkout_history_status ON checkout_history(status);
CREATE INDEX idx_checkout_history_dates ON checkout_history(checkout_date, due_date, return_date);

-- =====================================================
-- 11. RESERVATIONS TABLE
-- Book reservations by patrons
-- =====================================================
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES offline_books(id),
    patron_id VARCHAR(255) NOT NULL,
    patron_name VARCHAR(500),
    patron_email VARCHAR(255),
    patron_phone VARCHAR(50),
    reservation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active', -- active, fulfilled, expired, cancelled
    priority INTEGER DEFAULT 0,
    notification_sent BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reservations_book ON reservations(book_id);
CREATE INDEX idx_reservations_patron ON reservations(patron_id);
CREATE INDEX idx_reservations_status ON reservations(status);

-- =====================================================
-- 12. BOOK_SERIES TABLE
-- Book series/collections
-- =====================================================
CREATE TABLE IF NOT EXISTS book_series (
    id SERIAL PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    name_si VARCHAR(500),
    name_ta VARCHAR(500),
    description TEXT,
    total_volumes INTEGER,
    publisher_id INTEGER REFERENCES publishers(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_book_series_name ON book_series(name);

-- =====================================================
-- 13. BOOK_SERIES_ITEMS JUNCTION TABLE
-- Books belonging to a series
-- =====================================================
CREATE TABLE IF NOT EXISTS book_series_items (
    id SERIAL PRIMARY KEY,
    series_id INTEGER NOT NULL REFERENCES book_series(id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES offline_books(id) ON DELETE CASCADE,
    volume_number INTEGER,
    volume_title VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(series_id, book_id)
);

CREATE INDEX idx_book_series_items_series ON book_series_items(series_id);
CREATE INDEX idx_book_series_items_book ON book_series_items(book_id);

-- =====================================================
-- 14. BOOK_TAGS TABLE
-- Flexible tagging system
-- =====================================================
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tags_slug ON tags(slug);

CREATE TABLE IF NOT EXISTS book_tags (
    id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES offline_books(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(book_id, tag_id)
);

CREATE INDEX idx_book_tags_book ON book_tags(book_id);
CREATE INDEX idx_book_tags_tag ON book_tags(tag_id);

-- =====================================================
-- 15. ACTIVITY_LOG TABLE
-- Track all activities related to books
-- =====================================================
CREATE TABLE IF NOT EXISTS activity_log (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES offline_books(id),
    activity_type VARCHAR(100) NOT NULL, -- view, download, checkout, return, edit, etc.
    user_id VARCHAR(255),
    user_name VARCHAR(255),
    user_ip VARCHAR(50),
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_log_book ON activity_log(book_id);
CREATE INDEX idx_activity_log_type ON activity_log(activity_type);
CREATE INDEX idx_activity_log_date ON activity_log(created_at);
CREATE INDEX idx_activity_log_details ON activity_log USING gin(details);

-- =====================================================
-- TRIGGER FUNCTIONS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables with updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_authors_updated_at BEFORE UPDATE ON authors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_publishers_updated_at BEFORE UPDATE ON publishers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offline_books_updated_at BEFORE UPDATE ON offline_books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_book_copies_updated_at BEFORE UPDATE ON book_copies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update search vector on book insert/update
CREATE OR REPLACE FUNCTION update_book_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.subtitle, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(NEW.keywords, ' '), '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(NEW.subject_headings, ' '), '')), 'B');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_offline_books_search_vector
BEFORE INSERT OR UPDATE ON offline_books
FOR EACH ROW EXECUTE FUNCTION update_book_search_vector();

-- Update available copies when checkout/return happens
CREATE OR REPLACE FUNCTION update_available_copies()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'checked_out' THEN
        UPDATE offline_books
        SET available_copies = available_copies - 1,
            checkout_count = checkout_count + 1
        WHERE id = NEW.book_id AND available_copies > 0;
    ELSIF TG_OP = 'UPDATE' AND OLD.status = 'checked_out' AND NEW.status = 'returned' THEN
        UPDATE offline_books
        SET available_copies = available_copies + 1
        WHERE id = NEW.book_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_book_available_copies
AFTER INSERT OR UPDATE ON checkout_history
FOR EACH ROW EXECUTE FUNCTION update_available_copies();

-- =====================================================
-- INITIAL DATA - INSERT DEFAULT CATEGORIES
-- =====================================================

INSERT INTO categories (name, slug, description, icon, color, display_order) VALUES
('Marine Biology', 'marine-biology', 'Study of marine organisms and ecosystems', 'fish', '#3b82f6', 1),
('Oceanography', 'oceanography', 'Physical and chemical properties of oceans', 'waves', '#0ea5e9', 2),
('Fisheries Science', 'fisheries-science', 'Sustainable fishing and aquaculture', 'anchor', '#06b6d4', 3),
('Aquaculture', 'aquaculture', 'Farming of aquatic organisms', 'droplet', '#14b8a6', 4),
('Marine Conservation', 'marine-conservation', 'Protection of marine environments', 'shield', '#10b981', 5),
('Coastal Management', 'coastal-management', 'Management of coastal zones', 'map', '#22c55e', 6),
('Climate Change', 'climate-change', 'Impact of climate change on aquatic systems', 'thermometer', '#ef4444', 7),
('Marine Technology', 'marine-technology', 'Technology for marine research', 'cpu', '#8b5cf6', 8),
('Marine Policy', 'marine-policy', 'Laws and regulations governing marine resources', 'book-open', '#ec4899', 9),
('Research Methods', 'research-methods', 'Scientific research methodologies', 'microscope', '#f59e0b', 10),
('General Reference', 'general-reference', 'General reference materials', 'book', '#6b7280', 11),
('Journals & Periodicals', 'journals-periodicals', 'Academic journals and magazines', 'newspaper', '#78716c', 12)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Complete book view with all related data
CREATE OR REPLACE VIEW books_complete_view AS
SELECT
    b.*,
    -- Authors
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'id', a.id,
                'name', a.name,
                'role', ba.author_role
            )
        ) FILTER (WHERE a.id IS NOT NULL),
        '[]'
    ) AS authors,
    -- Categories
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'id', c.id,
                'name', c.name,
                'slug', c.slug,
                'is_primary', bc.is_primary
            )
        ) FILTER (WHERE c.id IS NOT NULL),
        '[]'
    ) AS categories,
    -- Publishers
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'id', p.id,
                'name', p.name,
                'role', bp.publisher_role
            )
        ) FILTER (WHERE p.id IS NOT NULL),
        '[]'
    ) AS publishers
FROM offline_books b
LEFT JOIN book_authors ba ON b.id = ba.book_id
LEFT JOIN authors a ON ba.author_id = a.id
LEFT JOIN book_categories bc ON b.id = bc.book_id
LEFT JOIN categories c ON bc.category_id = c.id
LEFT JOIN book_publishers bp ON b.id = bp.book_id
LEFT JOIN publishers p ON bp.publisher_id = p.id
GROUP BY b.id;

-- Popular books view
CREATE OR REPLACE VIEW popular_books_view AS
SELECT
    b.id,
    b.title,
    b.cover_image_url,
    b.rating_average,
    b.rating_count,
    b.view_count,
    b.download_count,
    b.checkout_count,
    (b.view_count * 0.3 + b.download_count * 0.3 + b.checkout_count * 0.4) AS popularity_score
FROM offline_books b
WHERE b.is_archived = FALSE
ORDER BY popularity_score DESC;

-- =====================================================
-- GRANT PERMISSIONS (adjust as needed)
-- =====================================================
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ NARA Offline Library Database Schema Created Successfully!';
    RAISE NOTICE '📚 Ready to import offline library data.';
END $$;
