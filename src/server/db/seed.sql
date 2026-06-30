-- ============================================
-- JejakRasa Seed Data
-- Migrasi dari data hardcoded TypeScript
-- ============================================

-- Daftar Meja
INSERT INTO tables (number, status) VALUES
  ('01', 'Tersedia'),
  ('02', 'Tersedia'),
  ('03', 'Tersedia'),
  ('04', 'Tersedia'),
  ('05', 'Tersedia'),
  ('06', 'Tersedia'),
  ('07', 'Tersedia'),
  ('08', 'Tersedia'),
  ('09', 'Tersedia'),
  ('10', 'Tersedia'),
  ('11', 'Tersedia'),
  ('12', 'Tersedia'),
  ('13', 'Tersedia'),
  ('14', 'Tersedia'),
  ('15', 'Tersedia'),
  ('16', 'Tersedia'),
  ('17', 'Tersedia'),
  ('18', 'Tersedia'),
  ('19', 'Tersedia'),
  ('20', 'Tersedia');

-- Kategori
INSERT INTO categories (id, name, icon) VALUES
  ('semua', 'Semua', 'Grid'),
  ('makanan', 'Makanan', 'Utensils'),
  ('minuman', 'Minuman', 'CupSoda'),
  ('cemilan', 'Cemilan', 'Cookie'),
  ('dessert', 'Dessert', 'CakeSlice');

-- Menu Makanan/Minuman
INSERT INTO foods (id, title, category, price, description, rating, status, image) VALUES
  (1, 'Nasi Goreng Spesial JejakRasa', 'makanan', 28000, 'Nasi goreng bumbu khas JejakRasa dengan telur ceplok, sate ayam, acar segar, dan kerupuk renyah.', 4.8, 'Tersedia', 'https://images.unsplash.com/photo-1603133872878-685f5888a3f1?auto=format&fit=crop&w=600&q=80'),
  (2, 'Sate Ayam Madura Premium', 'makanan', 32000, '10 tusuk sate ayam empuk disiram bumbu kacang gurih kental, kecap manis, dan taburan bawang goreng.', 4.9, 'Tersedia', 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80'),
  (3, 'Rendang Padang Daging Sapi', 'makanan', 38000, 'Daging sapi pilihan yang dimasak perlahan dengan santan dan rempah-rempah autentik Minang hingga meresap.', 4.9, 'Tersedia', 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80'),
  (4, 'Mie Goreng Aceh Kepiting', 'makanan', 30000, 'Mie tebal khas Aceh dengan bumbu kari pedas pekat, disajikan dengan sayuran segar dan acar bawang merah.', 4.7, 'Tersedia', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80'),
  (5, 'Es Teh Manis Jumbo', 'minuman', 6000, 'Teh melati seduh tradisional disajikan dingin dalam gelas ukuran jumbo yang sangat menyegarkan.', 4.6, 'Tersedia', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80'),
  (6, 'Es Campur JejakRasa Segar', 'minuman', 18000, 'Es serut dengan isian alpukat, nangka, kolang-kaling, kelapa muda, jeli, susu kental manis, dan sirup merah khas.', 4.8, 'Tersedia', 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=600&q=80'),
  (7, 'Kopi Susu Gula Aren', 'minuman', 15000, 'Paduan espresso arabika, susu segar cair, dan pemanis alami sirup gula aren murni.', 4.7, 'Tersedia', 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80'),
  (8, 'Kentang Goreng Krispi', 'cemilan', 14000, 'Kentang goreng potongan tebal yang digoreng garing di luar, lembut di dalam dengan taburan garam laut halus.', 4.5, 'Tersedia', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80'),
  (9, 'Pisang Goreng Keju Coklat', 'cemilan', 16000, 'Pisang kepok manis digoreng krispi dengan tepung roti, diberi limpahan keju parut gurih dan meses coklat.', 4.8, 'Tersedia', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80'),
  (10, 'Roti Bakar Coklat Keju', 'cemilan', 15000, 'Roti tawar tebal dibakar dengan margarin gurih, diisi coklat lumer, diselimuti keju parut melimpah.', 4.7, 'Tersedia', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'),
  (11, 'Pancake Durian Medan', 'dessert', 25000, 'Kulit pancake tipis lembut berisi daging buah durian Medan murni tanpa campuran dan krim kocok manis.', 4.9, 'Tersedia', 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80'),
  (12, 'Affogato Matcha Delight', 'dessert', 20000, 'Satu skop es krim vanila lembut disiram dengan seduhan matcha Jepang kental berkualitas tinggi.', 4.7, 'Tersedia', 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=600&q=80');

-- Promosi
INSERT INTO promotions (id, title, code, discount_percent, min_transaction, description, image) VALUES
  ('p1', 'Diskon Ceria Pengguna Baru', 'JEJAKRASA10', 10, 20000, 'Nikmati potongan harga sebesar 10% untuk pemesanan pertama Anda tanpa batas menu.', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'),
  ('p2', 'Makan Hemat Akhir Bulan', 'KENYANG20', 20, 75000, 'Dapatkan diskon 20% khusus transaksi di atas Rp 75.000. Makan nikmat tetap hemat!', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80'),
  ('p3', 'Gila Kuliner Weekend', 'WEEKEND30', 30, 100000, 'Pesta rasa akhir pekan dengan diskon 30% hingga maksimal Rp 40.000 di setiap hari Sabtu & Minggu.', 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=600&q=80');

-- Banner
INSERT INTO banners (id, title, subtitle, image) VALUES
  ('b1', 'Cita Rasa Autentik Nusantara', 'Nikmati masakan khas Indonesia yang dimasak dengan rempah-rempah segar dan resep tradisional warisan leluhur.', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80'),
  ('b2', 'Pesan dari Meja Tanpa Antre', 'Cukup scan QR code di meja Anda, pesan makanan favorit lewat ponsel, bayar instan, dan pesanan akan langsung diantar.', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'),
  ('b3', 'Diskon Melimpah Setiap Hari', 'Temukan berbagai promo menarik mulai dari gratis menu pembuka hingga diskon spesial pembayaran QRIS & VA.', 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1200&q=80');

-- Admin Default (password: admin123, bcrypt hash)
INSERT INTO admins (username, password_hash, display_name) VALUES
  ('admin', '$2a$10$XVQzfKCSGGjJ3JI.J2qNLe/tfWLLKI/tuMF/pqO.lp4MvyGH4vo3m', 'Admin JejakRasa');
