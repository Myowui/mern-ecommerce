// Protects a route: only requests carrying a valid login token get through.
// The frontend sends the token in the header:  Authorization: Bearer <token>
import jwt from "jsonwebtoken";

export default function protect(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "Please log in first" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // remember who is calling for the route that runs next
    next();
  } catch {
    res.status(401).json({ message: "Session expired, please log in again" });
  }
}
