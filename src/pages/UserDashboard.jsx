import { Link } from "react-router-dom";

export default function UserDashboard() {
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  return (
    <main className="page-container">
      <section className="dashboard-welcome">
        <div>
          <span className="eyebrow">USER DASHBOARD</span>

          <h1>
            Welcome back{user?.name ? `, ${user.name}` : ""}!
          </h1>

          <p>
            Find parking, reserve a slot and manage your bookings.
          </p>
        </div>

        <Link
          to="/parkinglots"
          className="button button-light"
        >
          + Find Parking
        </Link>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <div className="dashboard-card-icon">🔎</div>

          <h3>Find Parking</h3>

          <p>
            Explore parking facilities near your destination.
          </p>

          <Link to="/parkinglots">Explore locations →</Link>
        </article>

        <article className="dashboard-card">
          <div className="dashboard-card-icon">📅</div>

          <h3>My Bookings</h3>

          <p>
            View reservations, check statuses and cancel bookings.
          </p>

          <Link to="/mybookings">Manage bookings →</Link>
        </article>

        <article className="dashboard-card">
          <div className="dashboard-card-icon">💳</div>

          <h3>Payments</h3>

          <p>
            Continue payment for eligible reservations.
          </p>

          <Link to="/mybookings">View reservations →</Link>
        </article>

        <article className="dashboard-card">
          <div className="dashboard-card-icon">👤</div>

          <h3>My Account</h3>

          <p>
            Review your registered account information.
          </p>

          <strong>{user?.email || "No email available"}</strong>
        </article>
      </section>
    </main>
  );
}