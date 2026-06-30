-- ============================================
-- JejakRasa Database Schema (PostgreSQL)
-- Target: Supabase / PostgreSQL Online
-- ============================================

-- Drop existing tables to start clean (CASCADE will handle dependencies)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS foods CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS tables CASCADE;
DROP TABLE IF EXISTS promotions CASCADE;
DROP TABLE IF EXISTS banners CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Tabel Daftar Meja Pelanggan
CREATE TABLE tables (
  number VARCHAR(50) PRIMARY KEY,
  status VARCHAR(50) NOT NULL DEFAULT 'Tersedia' CHECK (status IN ('Tersedia', 'Terisi'))
);

-- Tabel Kategori Menu
CREATE TABLE categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50) NOT NULL DEFAULT 'Grid'
);

-- Tabel Menu Makanan/Minuman
CREATE TABLE foods (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price INT NOT NULL DEFAULT 0,
  description TEXT,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  status VARCHAR(50) NOT NULL DEFAULT 'Tersedia' CHECK (status IN ('Tersedia', 'Habis')),
  image VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category) REFERENCES categories(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabel Pesanan
CREATE TABLE orders (
  id VARCHAR(50) PRIMARY KEY,
  table_number VARCHAR(10) NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  subtotal INT NOT NULL DEFAULT 0,
  discount INT NOT NULL DEFAULT 0,
  total INT NOT NULL DEFAULT 0,
  promo_code VARCHAR(50) DEFAULT NULL,
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('Tunai', 'QRIS', 'Virtual Account')),
  payment_status VARCHAR(50) NOT NULL DEFAULT 'Belum Bayar' CHECK (payment_status IN ('Belum Bayar', 'Sudah Bayar')),
  order_status VARCHAR(50) NOT NULL DEFAULT 'Menunggu Konfirmasi' CHECK (order_status IN ('Menunggu Konfirmasi', 'Diproses', 'Selesai', 'Dibatalkan')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Item Pesanan (relasi many-to-one ke orders)
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL,
  food_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  price INT NOT NULL DEFAULT 0,
  quantity INT NOT NULL DEFAULT 1,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabel Promosi
CREATE TABLE promotions (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  discount_percent INT NOT NULL DEFAULT 0,
  min_transaction INT NOT NULL DEFAULT 0,
  description TEXT,
  image VARCHAR(500) DEFAULT NULL
);

-- Tabel Banner
CREATE TABLE banners (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  image VARCHAR(500) DEFAULT NULL
);

-- Tabel Admin
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100) NOT NULL DEFAULT 'Admin'
);
