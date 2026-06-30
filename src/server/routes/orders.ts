import { Router } from "express";
import pool from "../db/connection";
import { RowDataPacket, ResultSetHeader } from "../db/types";

const router = Router();

// Get all orders (including their ordered items)
router.get("/", async (req, res, next) => {
  try {
    // Get all orders sorted by creation time
    const [orders] = await pool.query<RowDataPacket[]>("SELECT * FROM orders ORDER BY created_at DESC");
    
    if (orders.length === 0) {
      return res.json([]);
    }

    // Get all order items
    const [items] = await pool.query<RowDataPacket[]>("SELECT * FROM order_items");

    // Map items to their respective orders
    const ordersWithItems = orders.map((order) => {
      const orderItems = items
        .filter((item) => item.order_id === order.id)
        .map((item) => ({
          id: String(item.food_id),
          title: item.title,
          price: Number(item.price),
          quantity: Number(item.quantity)
        }));

      return {
        id: order.id,
        tableNumber: order.table_number,
        customerName: order.customer_name,
        items: orderItems,
        subtotal: Number(order.subtotal),
        discount: Number(order.discount),
        total: Number(order.total),
        promoCode: order.promo_code || undefined,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        orderStatus: order.order_status,
        createdAt: order.created_at
      };
    });

    res.json(ordersWithItems);
  } catch (error) {
    next(error);
  }
});

// Create a new order (with transaction support)
router.post("/", async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      tableNumber,
      customerName,
      items, // array of { id, title, price, quantity }
      subtotal,
      discount,
      total,
      promoCode,
      paymentMethod
    } = req.body;

    if (!customerName || !tableNumber || !items || !Array.isArray(items) || items.length === 0) {
      await connection.rollback();
      return res.status(400).json({ error: "Data pesanan tidak lengkap atau tidak valid!" });
    }

    // Generate unique order ID TRX-YYYYMMDD-XXX
    const dateStr = new Date().toISOString();
    const cleanDate = dateStr.slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const orderId = `TRX-${cleanDate}-${randomSuffix}`;

    const paymentStatus = paymentMethod === "Tunai" ? "Belum Bayar" : "Sudah Bayar";
    const orderStatus = "Menunggu Konfirmasi";

    // 1. Insert order record
    const insertOrderQuery = `
      INSERT INTO orders (id, table_number, customer_name, subtotal, discount, total, promo_code, payment_method, payment_status, order_status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const orderValues = [
      orderId,
      tableNumber,
      customerName,
      subtotal,
      discount,
      total,
      promoCode || null,
      paymentMethod,
      paymentStatus,
      orderStatus,
      dateStr
    ];
    await connection.query(insertOrderQuery, orderValues);

    // 2. Insert order items
    const insertItemQuery = `
      INSERT INTO order_items (order_id, food_id, title, price, quantity)
      VALUES (?, ?, ?, ?, ?)
    `;
    for (const item of items) {
      await connection.query(insertItemQuery, [
        orderId,
        Number(item.id),
        item.title,
        item.price,
        item.quantity
      ]);
    }

    await connection.commit();

    res.status(201).json({
      id: orderId,
      tableNumber,
      customerName,
      items,
      subtotal,
      discount,
      total,
      promoCode: promoCode || undefined,
      paymentMethod,
      paymentStatus,
      orderStatus,
      createdAt: dateStr
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
});

// Update order status (orderStatus: 'Menunggu Konfirmasi' | 'Diproses' | 'Selesai' | 'Dibatalkan')
router.patch("/:id/status", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Menunggu Konfirmasi", "Diproses", "Selesai", "Dibatalkan"];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Status pesanan tidak valid!" });
    }

    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE orders SET order_status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Pesanan tidak ditemukan!" });
    }

    res.json({ id, orderStatus: status });
  } catch (error) {
    next(error);
  }
});

// Update payment status (paymentStatus: 'Belum Bayar' | 'Sudah Bayar')
router.patch("/:id/payment", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Belum Bayar", "Sudah Bayar"];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Status pembayaran tidak valid!" });
    }

    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE orders SET payment_status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Pesanan tidak ditemukan!" });
    }

    res.json({ id, paymentStatus: status });
  } catch (error) {
    next(error);
  }
});

// Delete an order
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query<ResultSetHeader>("DELETE FROM orders WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Pesanan tidak ditemukan!" });
    }
    res.json({ message: "Pesanan berhasil dihapus!", id });
  } catch (error) {
    next(error);
  }
});

export default router;
