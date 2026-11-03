import { createContext, useContext, useEffect, useState } from "react";
import { api, getToken, saveToken, clearToken } from "../api.js";

// Context = a box of data that any component can read, without passing props down every level.
// This one holds: who is logged in, plus login / register / logout functions.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // true while we check (on page load) whether the saved token is still valid
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    api("/auth/me")
      .then(setUser)
      .catch(() => clearToken()) // token expired or invalid
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await api("/auth/login", { method: "POST", body: { email, password } });
    saveToken(data.token);
    setUser(data.user);
  }

  async function register(name, email, password) {
    const data = await api("/auth/register", { method: "POST", body: { name, email, password } });
    saveToken(data.token);
    setUser(data.user);
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Shortcut: const { user, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);
