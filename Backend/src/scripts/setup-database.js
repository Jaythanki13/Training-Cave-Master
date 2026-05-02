/**
 * Training Cave — Database Setup Script
 * Run once after creating your Neon database:
 *   cd Backend && npm run db:setup
 *
 * What this does:
 *  1. Creates all tables (users, materials, categories, downloads, ratings …)
 *  2. Seeds the 7 training categories
 *  3. Creates the super_admin account with a real bcrypt password hash
 */

import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Connect ──────────────────────────────────────────────────────────────────

const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      }
);

// ── Schema SQL (inline so the script is self-contained) ───────────────────────

const SCHEMA_SQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TABLE IF NOT EXISTS users (
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
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Materials
CREATE TABLE IF NOT EXISTS materials (
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
CREATE INDEX IF NOT EXISTS idx_materials_trainer ON materials(trainer_id);
CREATE INDEX IF NOT EXISTS idx_materials_category ON materials(category_id);
CREATE INDEX IF NOT EXISTS idx_materials_status ON materials(status);
CREATE INDEX IF NOT EXISTS idx_materials_uploaded ON materials(uploaded_at);

-- Downloads
CREATE TABLE IF NOT EXISTS downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45)
);
CREATE INDEX IF NOT EXISTS idx_downloads_material ON downloads(material_id);
CREATE INDEX IF NOT EXISTS idx_downloads_user ON downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_date ON downloads(downloaded_at);

-- Ratings
CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(material_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_ratings_material ON ratings(material_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user ON ratings(user_id);

-- Bookmarks
CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, material_id)
);

-- Functions & Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = CURRENT_TIMESTAMP; RETURN NEW; END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_materials_updated_at ON materials;
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION update_material_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE materials
    SET rating_avg = (SELECT AVG(rating)::DECIMAL(3,2) FROM ratings WHERE material_id = NEW.material_id),
        rating_count = (SELECT COUNT(*) FROM ratings WHERE material_id = NEW.material_id)
    WHERE id = NEW.material_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_rating_trigger ON ratings;
CREATE TRIGGER update_rating_trigger AFTER INSERT OR UPDATE ON ratings
    FOR EACH ROW EXECUTE FUNCTION update_material_rating();

CREATE OR REPLACE FUNCTION increment_download_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE materials SET download_count = download_count + 1 WHERE id = NEW.material_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS increment_download_trigger ON downloads;
CREATE TRIGGER increment_download_trigger AFTER INSERT ON downloads
    FOR EACH ROW EXECUTE FUNCTION increment_download_count();
`;

const CATEGORIES = [
  { name: 'Soft Skills',               slug: 'soft-skills',        description: 'Communication, Leadership, Team Building',       order: 1 },
  { name: 'Technical Training',        slug: 'technical-training', description: 'Programming, Data Science, Cloud Computing',     order: 2 },
  { name: 'AI & Trending Technologies',slug: 'ai-trending',        description: 'Machine Learning, AI, Emerging Tech',            order: 3 },
  { name: 'Security Training',         slug: 'security',           description: 'Cybersecurity, InfoSec, Compliance',             order: 4 },
  { name: 'Tool-Based Training',       slug: 'tool-based',         description: 'Software Applications, Platforms',               order: 5 },
  { name: 'Official Certifications',   slug: 'certifications',     description: 'CSM, CSPO, AWS, Azure, Google Cloud',            order: 6 },
  { name: 'Healthcare Training',       slug: 'healthcare',         description: 'Medical, Clinical, Healthcare IT',               order: 7 },
];

// ── Main ──────────────────────────────────────────────────────────────────────

async function setup() {
  const client = await pool.connect();
  try {
    console.log('\n🗿 Training Cave — Database Setup');
    console.log('══════════════════════════════════════');

    // 1. Run schema
    console.log('\n📋 Creating tables…');
    await client.query(SCHEMA_SQL);
    console.log('   ✅ Tables created');

    // 2. Seed categories (skip if already exist)
    console.log('\n📂 Seeding categories…');
    for (const cat of CATEGORIES) {
      await client.query(
        `INSERT INTO categories (name, slug, description, display_order)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (slug) DO NOTHING`,
        [cat.name, cat.slug, cat.description, cat.order]
      );
    }
    console.log('   ✅ 7 categories ready');

    // 3. Create super admin (skip if email already exists)
    const adminEmail = process.env.ADMIN_EMAIL || 'jay.thanki@cognixia.com';
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Admin@Cave2024';
    const existing = await client.query('SELECT id FROM users WHERE email = $1', [adminEmail]);

    if (existing.rows.length > 0) {
      console.log(`\n👤 Admin account already exists (${adminEmail}) — skipping`);
    } else {
      console.log(`\n👤 Creating admin account (${adminEmail})…`);
      const hash = await bcrypt.hash(adminPassword, 10);
      await client.query(
        `INSERT INTO users (email, password_hash, full_name, role, status)
         VALUES ($1, $2, 'Jay Thanki', 'super_admin', 'active')`,
        [adminEmail, hash]
      );
      console.log(`   ✅ Admin created — password: ${adminPassword}`);
      console.log('   ⚠️  Change this password after first login!');
    }

    console.log('\n══════════════════════════════════════');
    console.log('✅ Database setup complete!');
    console.log('   Run: npm run dev   to start the server\n');

  } catch (err) {
    console.error('\n❌ Setup failed:', err.message);
    console.error('   Check your DATABASE_URL or DB_* variables in .env\n');
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

setup();
