import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Wrap a page in this to make it login-only.
// Not logged in? Send them to /login, and remember where they were going (state.from)
// so we can bring them back after they log in.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p>Loading…</p>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
