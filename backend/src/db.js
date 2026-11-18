import pg from "pg";
import "dotenv/config";

// Supaya kolom tanggal tetap berbentuk "2006-05-12", bukan objek Date
pg.types.setTypeParser(1082, (v) => v);

export const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});