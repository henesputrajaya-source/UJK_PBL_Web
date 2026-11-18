CREATE TABLE IF NOT EXISTS siswa (
  id_siswa      SERIAL PRIMARY KEY,
  nama          VARCHAR(100) NOT NULL,
  jurusan       VARCHAR(100) NOT NULL,
  tanggal_lahir DATE         NOT NULL,
  alamat        TEXT         NOT NULL
);

-- Data contoh (opsional)
INSERT INTO siswa (nama, jurusan, tanggal_lahir, alamat) VALUES
  ('Budi Santoso', 'Teknik Informatika', '2004-03-15', 'Jl. Merdeka No. 10, Jakarta'),
  ('Siti Aminah',  'Sistem Informasi',   '2003-11-02', 'Jl. Sudirman No. 25, Bandung'),
  ('Andi Pratama', 'Manajemen',          '2004-07-21', 'Jl. Diponegoro No. 5, Surabaya');
