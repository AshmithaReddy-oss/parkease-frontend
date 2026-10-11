import { useState } from "react";
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
      const response = await api.post(
        "/auth/login",
        form
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

        <p className="auth-bottom">
          Don't have an account?{" "}
          <Link to="/register">Register now</Link>
        </p>
      </section>
    </main>
  );
}