import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "../api.js";
import { formatPrice } from "../utils.js";

export default function Orders() {
  const [orders, setOrders] = useState(null); // null = still loading
  const [error, setError] = useState("");
  const { state } = useLocation(); // Checkout passes { placedId } after a successful order

  useEffect(() => {
    api("/orders")
      .then(setOrders)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!orders) return <p className="muted">Loading your orders…</p>;

  return (
    <div>
      <h1>My orders</h1>

      {state?.placedId && (
        <p className="success">Order placed successfully! Your order id is #{state.placedId}.</p>
      )}

      {orders.length === 0 ? (
        <div className="empty">
          <h2>No orders yet</h2>
          <Link to="/" className="btn">
            Start shopping
          </Link>
        </div>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-head">
              <div>
                <strong>Order #{order.id}</strong>
                <p className="muted">{new Date(order.createdAt).toLocaleString("en-IN")}</p>
              </div>
              <span className="status">{order.status}</span>
            </div>

            <ul>
              {order.items.map((item) => (
                <li key={item.productId}>
                  <span>
                    {item.name} × {item.qty}
                  </span>
                  <span>{formatPrice(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>

            <div className="order-foot">
              <p className="muted">
                Deliver to: {order.address.name}, {order.address.street}, {order.address.city} -{" "}
                {order.address.pincode}
              </p>
              <strong>Total: {formatPrice(order.total)}</strong>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
