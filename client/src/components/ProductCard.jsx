import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../utils.js";

// One product tile. It receives a product through props: <ProductCard product={p} />
export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200); // show "Added" for a moment
  }

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <img src={product.image} alt={product.name} loading="lazy" />
      </Link>
      <div className="product-card-body">
        <span className="category">{product.category}</span>
        <Link to={`/product/${product.id}`} className="product-name">
          {product.name}
        </Link>
        <p className="price">{formatPrice(product.price)}</p>
        <button className="btn" onClick={handleAdd}>
          {added ? "Added ✓" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
