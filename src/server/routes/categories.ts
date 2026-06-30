import { Router } from "express";
import pool from "../db/connection";
import { RowDataPacket, ResultSetHeader } from "mysql2";

const router = Router();

// Get all categories
router.get("/", async (req, res, next) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM categories ORDER BY name ASC");
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// Create a new category
router.post("/", async (req, res, next) => {
  try {
    const { name, icon } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Nama kategori wajib diisi!" });
    }

    const id = name.toLowerCase().replace(/\s+/g, "-");
    const categoryIcon = icon || "Grid";

    // Check if ID already exists
    const [existing] = await pool.query<RowDataPacket[]>("SELECT id FROM categories WHERE id = ?", [id]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Kategori dengan nama serupa sudah ada!" });
    }

    await pool.query("INSERT INTO categories (id, name, icon) VALUES (?, ?, ?)", [id, name, categoryIcon]);
    res.status(201).json({ id, name, icon: categoryIcon });
  } catch (error) {
    next(error);
  }
});

// Update a category name
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (id === "semua") {
      return res.status(400).json({ error: "Kategori 'Semua' adalah sistem default dan tidak boleh diubah!" });
    }

    if (!name) {
      return res.status(400).json({ error: "Nama kategori wajib diisi!" });
    }

    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE categories SET name = ? WHERE id = ?",
      [name, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Kategori tidak ditemukan!" });
    }

    res.json({ id, name });
  } catch (error) {
    next(error);
  }
});

// Delete a category
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id === "semua") {
      return res.status(400).json({ error: "Kategori 'Semua' adalah sistem default dan tidak boleh dihapus!" });
    }

    const [result] = await pool.query<ResultSetHeader>("DELETE FROM categories WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Kategori tidak ditemukan!" });
    }

    res.json({ message: "Kategori berhasil dihapus!", id });
  } catch (error) {
    next(error);
  }
});

export default router;
