import { Router } from "express";
import pool from "../db/connection";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "../db/types";

const router = Router();

// Admin login verification
router.post("/admin-login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username dan password wajib diisi!" });
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM admins WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Username atau password salah!" });
    }

    const admin = rows[0];
    const isPasswordMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Username atau password salah!" });
    }

    res.json({
      success: true,
      message: "Autentikasi Berhasil",
      admin: {
        username: admin.username,
        displayName: admin.display_name
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
