import { Router } from "express";
import pool from "../db/connection";
import { RowDataPacket, ResultSetHeader } from "../db/types";

const router = Router();

// Get all foods
router.get("/", async (req, res, next) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM foods ORDER BY id ASC");
    const formatted = rows.map((row) => ({
      id: String(row.id),
      title: row.title,
      category: row.category,
      price: Number(row.price),
      description: row.description,
      rating: Number(row.rating),
      status: row.status,
      image: row.image
    }));
    res.json(formatted);
  } catch (error) {
    next(error);
  }
});

// Get a single food item
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM foods WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Menu tidak ditemukan!" });
    }
    const row = rows[0];
    res.json({
      id: String(row.id),
      title: row.title,
      category: row.category,
      price: Number(row.price),
      description: row.description,
      rating: Number(row.rating),
      status: row.status,
      image: row.image
    });
  } catch (error) {
    next(error);
  }
});

// Create new food
router.post("/", async (req, res, next) => {
  try {
    const { title, category, price, description, rating, status, image } = req.body;
    
    if (!title || !category || price === undefined) {
      return res.status(400).json({ error: "Title, category, dan price wajib diisi!" });
    }

    const query = `
      INSERT INTO foods (title, category, price, description, rating, status, image)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      title, 
      category, 
      price, 
      description || "", 
      rating || 4.5, 
      status || "Tersedia", 
      image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
    ];

    const [result] = await pool.query<ResultSetHeader>(query, values);
    
    res.status(201).json({
      id: String(result.insertId),
      title,
      category,
      price: Number(price),
      description: description || "",
      rating: Number(rating || 4.5),
      status: status || "Tersedia",
      image: image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
    });
  } catch (error) {
    next(error);
  }
});

// Update a food item
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, category, price, description, rating, status, image } = req.body;

    // Check if item exists
    const [checkRows] = await pool.query<RowDataPacket[]>("SELECT id FROM foods WHERE id = ?", [id]);
    if (checkRows.length === 0) {
      return res.status(404).json({ error: "Menu tidak ditemukan!" });
    }

    const query = `
      UPDATE foods 
      SET title = ?, category = ?, price = ?, description = ?, rating = ?, status = ?, image = ?
      WHERE id = ?
    `;
    const values = [title, category, price, description, rating, status, image, id];
    await pool.query(query, values);

    res.json({
      id: String(id),
      title,
      category,
      price: Number(price),
      description,
      rating: Number(rating),
      status,
      image
    });
  } catch (error) {
    next(error);
  }
});

// Delete a food item
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query<ResultSetHeader>("DELETE FROM foods WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Menu tidak ditemukan!" });
    }
    res.json({ message: "Menu berhasil dihapus!", id });
  } catch (error) {
    next(error);
  }
});

export default router;
