-- TRAINING CAVE DATABASE SCHEMA (FIXED VERSION)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('learner', 'trainer', 'super_admin')),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'banned')),
    profile_bio TEXT,
    expertise_areas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- =====================================================
-- CATEGORIES TABLE
-- =====================================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert 7 training categories
INSERT INTO categories (name, slug, description, display_order) VALUES
('Soft Skills', 'soft-skills', 'Communication, Leadership, Team Building', 1),
('Technical Training', 'technical-training', 'Programming, Data Science, Cloud Computing', 2),
('AI & Trending Technologies', 'ai-trending', 'Machine Learning, AI, Emerging Tech', 3),
('Security Training', 'security', 'Cybersecurity, InfoSec, Compliance', 4),
('Tool-Based Training', 'tool-based', 'Software Applications, Platforms', 5),
('Official Certifications', 'certifications', 'CSM, CSPO, AWS, Azure, Google Cloud', 6),
('Healthcare Training', 'healthcare', 'Medical, Clinical, Healthcare IT', 7);

-- =====================================================
-- MATERIALS TABLE
-- =====================================================
CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id),
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    file_name VARCHAR(500) NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(50),
    file_mime_type VARCHAR(100),
    tags TEXT[],
    training_date DATE,
    training_type VARCHAR(50) CHECK (training_type IN ('upcoming', 'delivered')),
    download_count INTEGER DEFAULT 0,
    rating_avg DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'deleted')),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_materials_trainer ON materials(trainer_id);
CREATE INDEX idx_materials_category ON materials(category_id);
CREATE INDEX idx_materials_status ON materials(status);
CREATE INDEX idx_materials_uploaded ON materials(uploaded_at);

-- =====================================================
-- DOWNLOADS TABLE
-- =====================================================
CREATE TABLE downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45)
);

CREATE INDEX idx_downloads_material ON downloads(material_id);
CREATE INDEX idx_downloads_user ON downloads(user_id);
CREATE INDEX idx_downloads_date ON downloads(downloaded_at);

-- =====================================================
-- RATINGS TABLE
-- =====================================================
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(material_id, user_id)
);

CREATE INDEX idx_ratings_material ON ratings(material_id);
CREATE INDEX idx_ratings_user ON ratings(user_id);

-- =====================================================
-- BOOKMARKS TABLE
-- =====================================================
CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, material_id)
);

CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_material ON bookmarks(material_id);

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(500),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- =====================================================
-- AUDIT LOG TABLE
-- =====================================================
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_action ON audit_log(action);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON ratings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update material ratings
CREATE OR REPLACE FUNCTION update_material_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE materials
    SET rating_avg = (
        SELECT AVG(rating)::DECIMAL(3,2)
        FROM ratings
        WHERE material_id = NEW.material_id
    ),
    rating_count = (
        SELECT COUNT(*)
        FROM ratings
        WHERE material_id = NEW.material_id
    )
    WHERE id = NEW.material_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for rating updates
CREATE TRIGGER update_rating_trigger
    AFTER INSERT OR UPDATE ON ratings
    FOR EACH ROW EXECUTE FUNCTION update_material_rating();

-- Function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE materials
    SET download_count = download_count + 1
    WHERE id = NEW.material_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for downloads
CREATE TRIGGER increment_download_trigger
    AFTER INSERT ON downloads
    FOR EACH ROW EXECUTE FUNCTION increment_download_count();

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert super admin (password: admin123)
INSERT INTO users (email, password_hash, full_name, role, status) VALUES
('jay.thanki@cognixia.com', '$2a$10$rL5h6YK9K3mXqH.vZ5YqYOqKqVqVqvqvqvqvqvqvqvqvqvqvqvqvq', 'Jay Thanki', 'super_admin', 'active');

-- Note: The password hash above is a placeholder. 
-- Real hash for "admin123" will be generated by backend on first run

COMMIT;