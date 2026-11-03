import express from "express";
import { readData, writeData } from "../db.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// Both order routes are protected: you must be logged in.

// POST /api/orders
// body: { items: [{ productId, qty }], address: { name, phone, street, city, pincode } }
router.post("/", protect, (req, res) => {
  const { items, address } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Your cart is empty" });
  }
  const fields = ["name", "phone", "street", "city", "pincode"];
  if (!address || !fields.every((f) => typeof address[f] === "string" && address[f].trim())) {
    return res.status(400).json({ message: "Please fill in all delivery details" });
  }

  const products = readData("products");
  const orderItems = [];
  let total = 0;

  for (const item of items) {
    const qty = Number(item.qty);
    const product = products.find((p) => p.id === Number(item.productId));

    if (!product || !Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ message: "Invalid item in cart" });
    }
    // Price comes from OUR data, never from the browser (the browser can be tampered with).
    orderItems.push({ productId: product.id, name: product.name, price: product.price, qty });
    total += product.price * qty;
  }

  const order = {
    id: Date.now().toString(),
    userId: req.userId,
    items: orderItems,
    total,
    address: Object.fromEntries(fields.map((f) => [f, address[f].trim()])),
    status: "Placed",
    createdAt: new Date().toISOString(),
  };

  const orders = readData("orders");
  orders.push(order);
  writeData("orders", orders);

  res.status(201).json(order);
});

// GET /api/orders -> order history of the logged-in user, newest first
router.get("/", protect, (req, res) => {
  const mine = readData("orders")
    .filter((o) => o.userId === req.userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  res.json(mine);
});

export default router;
