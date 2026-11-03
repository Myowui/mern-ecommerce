import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../utils.js";

// One row in the cart: image, name, quantity buttons, line total, remove.
export default function CartItem({ item }) {
  const { changeQty, removeFromCart } = useCart();
  const { product, qty } = item;

  return (
    <div className="cart-item">
      <img src={product.image} alt={product.name} />

      <div className="cart-item-info">
        <Link to={`/product/${product.id}`} className="product-name">
          {product.name}
        </Link>
        <p className="price">{formatPrice(product.price)}</p>
        <div className="qty">
          <button
            aria-label="Decrease quantity"
            disabled={qty <= 1}
            onClick={() => changeQty(product.id, qty - 1)}
          >
            −
          </button>
          <span>{qty}</span>
          <button
            aria-label="Increase quantity"
            onClick={() => changeQty(product.id, qty + 1)}
          >
            +
          </button>
        </div>
      </div>

      <div className="cart-item-right">
        <strong>{formatPrice(product.price * qty)}</strong>
        <button className="link-btn" onClick={() => removeFromCart(product.id)}>
          Remove
        </button>
      </div>
    </div>
  );
}
