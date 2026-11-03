import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          ShopEasy
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end>
            Home
          </NavLink>
          {user && <NavLink to="/orders">My Orders</NavLink>}
          <NavLink to="/cart">
            Cart <span className="badge">{totalItems}</span>
          </NavLink>

          {user ? (
            <>
              <span className="hello">Hi, {user.name.split(" ")[0]}</span>
              <button className="btn btn-outline btn-small" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <Link to="/register" className="btn btn-small">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
