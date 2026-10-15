import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [auth, setAuth] = useState(() => ({
    token: localStorage.getItem("token"),
    user: JSON.parse(localStorage.getItem("user") || "null"),
  }));

  useEffect(() => {
    function syncAuth() {
      setAuth({
        token: localStorage.getItem("token"),
        user: JSON.parse(localStorage.getItem("user") || "null"),
      });
    }

    syncAuth();
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, [location.pathname]);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ token: null, user: null });
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  }

  const { token, user } = auth;
  const role = user?.role;

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-icon">P</span>

        <span>
          Park<span className="brand-accent">Ease</span>
          <small>Smart Parking Solutions</small>
        </span>
      </Link>

      <nav className="nav-links">
        <NavLink to="/">Home</NavLink>

        <NavLink to="/parkinglots">
          Parking Lots
        </NavLink>

        {token && role !== "ADMIN" && (
          <NavLink to="/mybookings">
            My Bookings
          </NavLink>
        )}

        {token && role === "USER" && (
          <NavLink to="/userdashboard">
            Dashboard
          </NavLink>
        )}

        {token && role === "OWNER" && (
          <NavLink to="/ownerdashboard">
            Owner Dashboard
          </NavLink>
        )}

        {token && role === "ADMIN" && (
          <NavLink to="/admindashboard">
            Admin Dashboard
          </NavLink>
        )}

        {!token ? (
          <>
            <NavLink to="/login">Login</NavLink>

            <Link to="/register" className="nav-register">
              Get Started
            </Link>
          </>
        ) : (
          <button
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}