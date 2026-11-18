import express from "express";
import cors from "cors";
import "dotenv/config";
import { pool } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// ID harus bilangan bulat positif
const idValid = (v) =>
  /^\d+$/.test(String(v)) && Number(v) > 0 && Number(v) <= 2147483647;

// Cek server hidup
app.get("/", (req, res) => {
  res.json({ message: "Backend BDS berjalan" });
});

// 1. READ: ambil semua siswa
app.get("/api/v1/siswa", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM siswa ORDER BY id_siswa DESC"
    );
    res.json({ success: true, data: rows });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// 2. READ: ambil satu siswa berdasarkan id
app.get("/api/v1/siswa/:id", async (req, res) => {
  try {
    if (!idValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "ID tidak valid" });
    }
    const { rows } = await pool.query(
      "SELECT * FROM siswa WHERE id_siswa = $1",
      [req.params.id]
    );
    if (!rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// 3. CREATE: tambah siswa (ID diisi manual)
app.post("/api/v1/siswa", async (req, res) => {
  try {
    const { id_siswa, nama, jurusan, tanggal_lahir, alamat } = req.body;
    if (!id_siswa || !nama || !jurusan || !tanggal_lahir || !alamat) {
      return res
        .status(400)
        .json({ success: false, message: "Semua field wajib diisi" });
    }
    if (!idValid(id_siswa)) {
      return res
        .status(400)
        .json({ success: false, message: "ID harus berupa angka bulat positif" });
    }
    const { rows } = await pool.query(
      `INSERT INTO siswa (id_siswa, nama, jurusan, tanggal_lahir, alamat)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id_siswa, nama, jurusan, tanggal_lahir, alamat]
    );
    res.status(201).json({
      success: true,
      message: "Data berhasil ditambahkan",
      data: rows[0],
    });
  } catch (e) {
    if (e.code === "23505") {
      return res
        .status(409)
        .json({ success: false, message: "ID sudah dipakai siswa lain" });
    }
    res.status(500).json({ success: false, message: e.message });
  }
});

// 4. UPDATE: ubah siswa, termasuk ID (PUT dan PATCH sama-sama boleh mengubah sebagian field)
const ubahSiswa = async (req, res) => {
  try {
    if (!idValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "ID tidak valid" });
    }
    if (req.body.id_siswa !== undefined && !idValid(req.body.id_siswa)) {
      return res
        .status(400)
        .json({ success: false, message: "ID baru harus berupa angka bulat positif" });
    }
    const kolom = ["id_siswa", "nama", "jurusan", "tanggal_lahir", "alamat"].filter(
      (k) => req.body[k] !== undefined
    );
    if (!kolom.length) {
      return res
        .status(400)
        .json({ success: false, message: "Tidak ada data yang diubah" });
    }
    const set = kolom.map((k, i) => `${k} = $${i + 1}`).join(", ");
    const nilai = kolom.map((k) => req.body[k]);
    const { rowCount } = await pool.query(
      `UPDATE siswa SET ${set} WHERE id_siswa = $${kolom.length + 1}`,
      [...nilai, req.params.id]
    );
    if (!rowCount) {
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan" });
    }
    res.json({ success: true, message: "Data berhasil diubah" });
  } catch (e) {
    if (e.code === "23505") {
      return res
        .status(409)
        .json({ success: false, message: "ID sudah dipakai siswa lain" });
    }
    res.status(500).json({ success: false, message: e.message });
  }
};
app.put("/api/v1/siswa/:id", ubahSiswa);
app.patch("/api/v1/siswa/:id", ubahSiswa);

// 5. DELETE: hapus siswa
app.delete("/api/v1/siswa/:id", async (req, res) => {
  try {
    if (!idValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "ID tidak valid" });
    }
    const { rowCount } = await pool.query(
      "DELETE FROM siswa WHERE id_siswa = $1",
      [req.params.id]
    );
    if (!rowCount) {
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan" });
    }
    res.json({ success: true, message: "Data berhasil dihapus" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Backend jalan di http://localhost:${process.env.PORT}`);
});