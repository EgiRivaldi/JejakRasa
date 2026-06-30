import { Router } from "express";
import pool from "../db/connection";
import { RowDataPacket } from "../db/types";

const router = Router();

// Get all promotions
router.get("/", async (req, res, next) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM promotions");
    const promotions = rows.map((p) => ({
      id: p.id,
      title: p.title,
      code: p.code,
      discountPercent: Number(p.discount_percent),
      minTransaction: Number(p.min_transaction),
      description: p.description,
      image: p.image
    }));
    res.json(promotions);
  } catch (error) {
    next(error);
  }
});

export default router;
