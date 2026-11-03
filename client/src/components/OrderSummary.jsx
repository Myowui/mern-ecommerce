import { formatPrice } from "../utils.js";

// The summary box used on both the Cart page and the Checkout page.
// Anything placed between <OrderSummary> ... </OrderSummary> (like a button) shows at the bottom.
export default function OrderSummary({ items, children }) {
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const total = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);

  return (
    <aside className="summary">
      <h3>Order summary</h3>
      <ul>
        {items.map((i) => (
          <li key={i.product.id}>
            <span>
              {i.product.name} × {i.qty}
            </span>
            <span>{formatPrice(i.product.price * i.qty)}</span>
          </li>
        ))}
      </ul>
      <div className="summary-row">
        <span>Delivery</span>
        <span>Free</span>
      </div>
      <div className="summary-total">
        <span>Total ({count} items)</span>
        <span>{formatPrice(total)}</span>
      </div>
      {children}
    </aside>
  );
}
