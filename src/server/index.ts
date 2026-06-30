import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import foodsRouter from "./routes/foods";
import categoriesRouter from "./routes/categories";
import ordersRouter from "./routes/orders";
import promotionsRouter from "./routes/promotions";
import bannersRouter from "./routes/banners";
import authRouter from "./routes/auth";
import tablesRouter from "./routes/tables";

dotenv.config();

const app = express();
const port = process.env.API_PORT || 3001;

// CORS setup to allow request from Vite dev server (usually http://localhost:3000)
app.use(cors({
  origin: "*", // In development, allow all. Or change to specific origin if needed.
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Routes
app.use("/api/foods", foodsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/promotions", promotionsRouter);
app.use("/api/banners", bannersRouter);
app.use("/api/auth", authRouter);
app.use("/api/tables", tablesRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", database: "Connected", timestamp: new Date() });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Terjadi kesalahan internal pada server!" });
});

app.listen(port, () => {
  console.log(`Express server running on http://localhost:${port}`);
});
