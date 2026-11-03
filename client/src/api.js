// One helper for talking to the Express server.
// Usage:  const products = await api("/products");
//         const data = await api("/auth/login", { method: "POST", body: { email, password } });

const TOKEN_KEY = "token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export async function api(path, { method = "GET", body } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";

  // If the user is logged in, send the token so protected routes accept us.
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // response had no JSON body
  }

  // The server sends { message: "..." } on errors. Turn that into a JS error.
  if (!res.ok) {
    throw new Error(data?.message || "Something went wrong");
  }
  return data;
}
