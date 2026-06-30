import { Router } from "express";
import pool from "../db/connection";
import { RowDataPacket, ResultSetHeader } from "mysql2";

const router = Router();

// Get all tables (sorted by number ascending)
router.get("/", async (req, res, next) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM tables ORDER BY CAST(number AS UNSIGNED) ASC, number ASC"
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// Add new table
router.post("/", async (req, res, next) => {
  try {
    const { number } = req.body;

    if (!number || !String(number).trim()) {
      return res.status(400).json({ error: "Nomor meja wajib diisi!" });
    }

    const tableNumber = String(number).trim().padStart(2, "0");

    // Check if table already exists
    const [existing] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM tables WHERE number = ?",
      [tableNumber]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: `Meja Nomor ${tableNumber} sudah terdaftar!` });
    }

    await pool.query<ResultSetHeader>(
      "INSERT INTO tables (number, status) VALUES (?, 'Tersedia')",
      [tableNumber]
    );

    res.status(201).json({
      number: tableNumber,
      status: "Tersedia"
    });
  } catch (error) {
    next(error);
  }
});

// Delete a table
router.delete("/:number", async (req, res, next) => {
  try {
    const { number } = req.params;

    if (!number) {
      return res.status(400).json({ error: "Nomor meja tidak valid!" });
    }

    const [existing] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM tables WHERE number = ?",
      [number]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: "Meja tidak ditemukan!" });
    }

    await pool.query<ResultSetHeader>(
      "DELETE FROM tables WHERE number = ?",
      [number]
    );

    res.json({
      success: true,
      message: `Meja Nomor ${number} berhasil dihapus.`
    });
  } catch (error) {
    next(error);
  }
});

export default router;
