DROP TABLE IF EXISTS siswa;

CREATE TABLE siswa (
  id_siswa      INTEGER PRIMARY KEY,   
  nama          VARCHAR(100) NOT NULL,
  jurusan       VARCHAR(100) NOT NULL, 
  tanggal_lahir DATE         NOT NULL,
  alamat        TEXT         NOT NULL
);

-- Data contoh (kolom id_siswa wajib disertakan)
INSERT INTO siswa (id_siswa, nama, jurusan, tanggal_lahir, alamat) VALUES
  (1,  'Budi Santoso',      'IPA', '2006-05-12', 'Jakarta'),
  (2,  'Siti Aminah',       'IPS', '2007-01-20', 'Bandung'),
  (3,  'Rizky Pratama',     'IPA', '2006-08-03', 'Surabaya'),
  (4,  'Dewi Lestari',      'IPS', '2007-03-15', 'Yogyakarta'),
  (5,  'Ahmad Fauzi',       'IPA', '2006-11-27', 'Semarang'),
  (6,  'Putri Rahayu',      'IPA', '2007-02-09', 'Medan'),
  (7,  'Dimas Aditya',      'IPS', '2006-07-18', 'Depok'),
  (8,  'Nurul Hidayati',    'IPS', '2007-04-22', 'Bekasi'),
  (9,  'Fajar Nugroho',     'IPA', '2006-12-05', 'Malang'),
  (10, 'Rina Wulandari',    'IPS', '2007-06-30', 'Bogor'),
  (11, 'Yoga Permana',      'IPA', '2006-09-14', 'Denpasar'),
  (12, 'Maya Sari',         'IPS', '2007-05-08', 'Palembang'),
  (13, 'Andi Setiawan',     'IPA', '2006-10-21', 'Makassar'),
  (14, 'Lestari Handayani', 'IPS', '2007-01-11', 'Tangerang'),
  (15, 'Eko Prasetyo',      'IPA', '2006-03-26', 'Solo');

SELECT * FROM siswa ORDER BY id_siswa;