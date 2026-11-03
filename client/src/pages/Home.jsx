import { useEffect, useState } from "react";
import { api } from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

const CATEGORIES = ["All", "Electronics", "Fashion", "Home", "Books"];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Runs on first load AND every time `search` or `category` changes (the [search, category] list).
  useEffect(() => {
    let ignore = false; // if the user types again before this finishes, ignore the old answer
    setLoading(true);

    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (category !== "All") params.set("category", category);

    api(`/products?${params}`)
      .then((data) => {
        if (!ignore) {
          setProducts(data);
          setError("");
        }
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [search, category]);

  return (
    <div>
      <h1>Shop our products</h1>

      <div className="filters">
        <input
          type="search"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="chips">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={c === category ? "chip active" : "chip"}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Loading products…</p>}

      {!loading && !error && products.length === 0 && (
        <p className="muted">No products found.</p>
      )}

      <div className="grid">
        {!loading && products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
