import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api.js";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../utils.js";

export default function ProductDetails() {
  const { id } = useParams(); // the :id from the URL /product/:id
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api(`/products/${id}`)
      .then(setProduct)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <div>
        <p className="error">{error}</p>
        <Link to="/">← Back to products</Link>
      </div>
    );
  }
  if (!product) return <p className="muted">Loading…</p>;

  function handleAdd() {
    addToCart(product, qty);
    setAdded(true);
  }

  return (
    <div>
      <Link to="/" className="back">
        ← Back to products
      </Link>

      <div className="details">
        <img src={product.image} alt={product.name} />

        <div className="details-info">
          <span className="category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="price big">{formatPrice(product.price)}</p>
          <p>{product.description}</p>

          <div className="qty">
            <button aria-label="Decrease quantity" disabled={qty <= 1} onClick={() => setQty(qty - 1)}>
              −
            </button>
            <span>{qty}</span>
            <button aria-label="Increase quantity" onClick={() => setQty(qty + 1)}>
              +
            </button>
          </div>

          <div className="actions">
            <button className="btn" onClick={handleAdd}>
              Add to cart
            </button>
            {added && (
              <Link to="/cart" className="btn btn-outline">
                Added ✓ Go to cart
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
