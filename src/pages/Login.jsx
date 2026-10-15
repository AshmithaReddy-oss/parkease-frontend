import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (token && user) {
      if (user.role === "ADMIN") {
        navigate("/admindashboard", { replace: true });
      } else if (user.role === "OWNER") {
        navigate("/ownerdashboard", { replace: true });
      } else {
        navigate("/userdashboard", { replace: true });
      }
    }
  }, [navigate]);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const payload = {
        email: form.email.trim(),
        password: form.password,
      };

      const response = await api.post(
        "/auth/login",
        payload
      );

      const data = response.data;

      if (!data.token) {
        throw new Error(
          "The server did not return an authentication token."
        );
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
        })
      );

      // Notify Navbar and other listeners to update authentication state
      window.dispatchEvent(new Event("storage"));

      if (data.role === "ADMIN") {
        navigate("/admindashboard");
      } else if (data.role === "OWNER") {
        navigate("/ownerdashboard");
      } else {
        navigate("/userdashboard");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-heading">
          <div className="auth-logo">P</div>

          <span className="eyebrow">
            WELCOME BACK
          </span>

          <h1>Sign in to ParkEase</h1>

          <p>
            Access your parking dashboard and bookings.
          </p>
        </div>

        {location.state?.message && (
          <div className="alert alert-success">
            {location.state.message}
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>

          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="button button-primary full-width"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="demo-accounts-box" style={{
          marginTop: "24px",
          padding: "16px",
          background: "#f0f5ff",
          borderRadius: "12px",
          border: "1px dashed #b9d1ff",
          fontSize: "13px"
        }}>
          <p style={{ margin: "0 0 10px 0", fontWeight: "700", color: "#155eef", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            ⚡ Quick Demo Accounts (Click to Fill)
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              type="button"
              className="button button-light"
              style={{ padding: "6px 12px", fontSize: "12px" }}
              onClick={() => setForm({ email: "user@parkease.com", password: "User12345!" })}
            >
              👤 Demo User
            </button>
            <button
              type="button"
              className="button button-light"
              style={{ padding: "6px 12px", fontSize: "12px" }}
              onClick={() => setForm({ email: "owner@parkease.com", password: "Owner12345!" })}
            >
              🏢 Demo Owner
            </button>
            <button
              type="button"
              className="button button-light"
              style={{ padding: "6px 12px", fontSize: "12px" }}
              onClick={() => setForm({ email: "admin@parkease.com", password: "ChangeMe@Local1" })}
            >
              🛡️ Demo Admin
            </button>
          </div>
        </div>

        <p className="auth-bottom">
          Don't have an account?{" "}
          <Link to="/register">Register now</Link>
        </p>
      </section>
    </main>
  );
}