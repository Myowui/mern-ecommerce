import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { readData, writeData } from "../db.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// A token is a signed ticket that says "this is user <id>". It expires in 7 days.
const makeToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/register   body: { name, email, password }
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body || {};

  if (![name, email, password].every((v) => typeof v === "string" && v.trim())) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const users = readData("users");
  const cleanEmail = email.trim().toLowerCase();

  if (users.find((u) => u.email === cleanEmail)) {
    return res.status(409).json({ message: "This email is already registered" });
  }

  // Never store the real password: store a one-way hash of it.
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: Date.now().toString(),
    name: name.trim(),
    email: cleanEmail,
    password: hashedPassword,
  };
  users.push(user);
  writeData("users", users);

  res.status(201).json({
    token: makeToken(user.id),
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// POST /api/auth/login   body: { email, password }
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = readData("users").find((u) => u.email === email.trim().toLowerCase());
  // compare the typed password with the stored hash
  const ok = user && (await bcrypt.compare(password, user.password));

  if (!ok) {
    return res.status(401).json({ message: "Wrong email or password" });
  }

  res.json({
    token: makeToken(user.id),
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// GET /api/auth/me  (protected) -> who am I? Used to restore login after a page refresh.
router.get("/me", protect, (req, res) => {
  const user = readData("users").find((u) => u.id === req.userId);
  if (!user) {
    return res.status(401).json({ message: "User no longer exists, please log in again" });
  }
  res.json({ id: user.id, name: user.name, email: user.email });
});

export default router;
