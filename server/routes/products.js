import express from "express";
import { readData } from "../db.js";

const router = express.Router();

// GET /api/products                       -> all products
// GET /api/products?search=phone          -> filter by name
// GET /api/products?category=Electronics  -> filter by category
router.get("/", (req, res) => {
  const { search, category } = req.query;
  let products = readData("products");

  if (category && category !== "All") {
    products = products.filter((p) => p.category === category);
  }
  if (search) {
    const term = String(search).toLowerCase();
    products = products.filter((p) => p.name.toLowerCase().includes(term));
  }

  res.json(products);
});

// GET /api/products/3 -> one product (for the details page)
router.get("/:id", (req, res) => {
  const product = readData("products").find((p) => p.id === Number(req.params.id));
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

export default router;
