import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import CartItem from "../components/CartItem.jsx";
import OrderSummary from "../components/OrderSummary.jsx";

export default function Cart() {
  const { items } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="empty">
        <h2>Your cart is empty</h2>
        <p className="muted">Add something you like and it will show up here.</p>
        <Link to="/" className="btn">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Your cart</h1>
      <div className="two-col">
        <div className="cart-list">
          {items.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>

        <OrderSummary items={items}>
          <button className="btn btn-block" onClick={() => navigate("/checkout")}>
            Proceed to checkout
          </button>
        </OrderSummary>
      </div>
    </div>
  );
}
