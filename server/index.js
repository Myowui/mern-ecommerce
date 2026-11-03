import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { readData, writeData } from "./db.js";
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/orders.js";

// Stop early with a clear message if the secret is missing from server/.env
if (!process.env.JWT_SECRET) {
  console.error("Missing JWT_SECRET. Create server/.env (see .env.example).");
  process.exit(1);
}

// On a free host the users file is wiped whenever the server restarts or sleeps.
// So we make sure a demo login always exists for anyone who wants to test the site.
async function ensureDemoUser() {
  const users = readData("users");
  if (!users.find((u) => u.email === "demo@shopeasy.com")) {
    users.push({
      id: "demo-user",
      name: "Demo User",
      email: "demo@shopeasy.com",
      password: await bcrypt.hash("demo1234", 10),
    });
    writeData("users", users);
  }
}
await ensureDemoUser();

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

// ---- Serve the built React website (when client/dist exists) ----
// Run `npm run build` inside client/ to create it. Then this one server
// serves both the API (/api/...) and the website, so deploying is a single step.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientBuild = path.join(__dirname, "..", "client", "dist");

if (fs.existsSync(clientBuild)) {
  app.use(express.static(clientBuild));
  // Any other URL (like /cart or /orders) gets index.html, and React Router shows the right page.
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(clientBuild, "index.html"));
  });
}

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