import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import OrderSummary from "../components/OrderSummary.jsx";

export default function Checkout() {
  const { user } = useAuth();
  const { items, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
  });
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState(false); // true once the order is placed

  // Nothing to buy? Go back to the cart.
  // (Not when we just placed the order: the cart is empty on purpose then, and we are
  // already on our way to the Orders page.)
  if (items.length === 0 && !done) return <Navigate to="/cart" replace />;

  // One handler for all inputs: the input's `name` tells us which field to update.
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setPlacing(true);
    try {
      // We only send ids and quantities. The server looks up the real prices itself.
      const order = await api("/orders", {
        method: "POST",
        body: {
          items: items.map((i) => ({ productId: i.product.id, qty: i.qty })),
          address: form,
        },
      });
      setDone(true);
      navigate("/orders", { state: { placedId: order.id } });
      clearCart();
    } catch (err) {
      setError(err.message);
      setPlacing(false);
    }
  }

  return (
    <div>
      <h1>Checkout</h1>
      <div className="two-col">
        <form className="form-card plain" id="checkout-form" onSubmit={handleSubmit}>
          <h2>Delivery details</h2>
          {error && <p className="error">{error}</p>}

          <label>
            Full name
            <input name="name" required value={form.name} onChange={handleChange} />
          </label>
          <label>
            Phone (10 digits)
            <input
              name="phone"
              required
              pattern="[0-9]{10}"
              title="Enter a 10 digit phone number"
              value={form.phone}
              onChange={handleChange}
            />
          </label>
          <label>
            Address
            <input name="street" required value={form.street} onChange={handleChange} />
          </label>
          <label>
            City
            <input name="city" required value={form.city} onChange={handleChange} />
          </label>
          <label>
            Pincode (6 digits)
            <input
              name="pincode"
              required
              pattern="[0-9]{6}"
              title="Enter a 6 digit pincode"
              value={form.pincode}
              onChange={handleChange}
            />
          </label>
        </form>

        <OrderSummary items={items}>
          <button className="btn btn-block" form="checkout-form" disabled={placing}>
            {placing ? "Placing order…" : "Place order"}
          </button>
        </OrderSummary>
      </div>
    </div>
  );
}
