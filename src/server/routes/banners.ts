import { Router } from "express";
import pool from "../db/connection";
import { RowDataPacket } from "mysql2";

const router = Router();

// Get all banners
router.get("/", async (req, res, next) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM banners");
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

export default router;
