import "dotenv/config";
import express from "express";
import cors from "cors";
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/orders.js";

// Stop early with a clear message if the secret is missing from server/.env
if (!process.env.JWT_SECRET) {
  console.error("Missing JWT_SECRET. Create server/.env (see .env.example).");
  process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running" });
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

// Any other /api URL
app.use("/api", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Catches errors from any route
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON in request" });
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
