import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";

export default function UserDashboard() {
  const navigate = useNavigate();

  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const [bookings, setBookings] = useState([]);
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardData() {
      setLoading(true);
      setError("");

      try {
        const [bookingsRes, lotsRes] = await Promise.allSettled([
          api.get("/bookings/my"),
          api.get("/parking-lots"),
        ]);

        if (isMounted) {
          if (bookingsRes.status === "fulfilled") {
            const data = bookingsRes.value.data;
            setBookings(Array.isArray(data) ? data : data?.content || []);
          }

          if (lotsRes.status === "fulfilled") {
            const data = lotsRes.value.data;
            setLots(Array.isArray(data) ? data : data?.content || []);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleCancel(bookingId) {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }

    setCancellingId(bookingId);
    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      // Update local state
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "CANCELLED" } : b))
      );
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setCancellingId(null);
    }
  }

  const activeBookings = bookings.filter(
    (b) => b.status === "CONFIRMED" || b.status === "PENDING_PAYMENT"
  );
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED");

  function getStatusBadge(status) {
    switch (status) {
      case "CONFIRMED":
        return <span className="status-pill status-active">● Confirmed</span>;
      case "PENDING_PAYMENT":
        return <span className="status-pill status-pending">⏱ Payment Pending</span>;
      case "COMPLETED":
        return <span className="status-pill status-completed">✓ Completed</span>;
      case "CANCELLED":
        return <span className="status-pill status-cancelled">✕ Cancelled</span>;
      default:
        return <span className="status-pill">{status}</span>;
    }
  }

  function formatDateTime(dateStr) {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  }

  return (
    <main className="page-container dashboard-page">
      {/* Welcome Banner */}
      <section className="dashboard-welcome" style={{ borderRadius: "20px" }}>
        <div>
          <span className="eyebrow" style={{ letterSpacing: "1px" }}>
            🚗 PARKEASE DRIVER DASHBOARD
          </span>
          <h1>Welcome back{user?.name ? `, ${user.name}` : ""}!</h1>
          <p>
            Find parking facilities, reserve slots instantly, and manage your reservations in real time.
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link to="/parkinglots" className="button button-light">
            🔍 Find Parking
          </Link>
          <Link to="/mybookings" className="button" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}>
            📅 My Reservations
          </Link>
        </div>
      </section>

      {error && (
        <div className="alert alert-error" style={{ marginTop: "20px" }}>
          {error}
        </div>
      )}

      {/* Statistics Bar */}
      <section className="dashboard-stats" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Active Reservations</span>
            <span style={{ fontSize: "20px" }}>🟢</span>
          </div>
          <strong>{loading ? "..." : activeBookings.length}</strong>
          <small style={{ color: "var(--muted)", fontSize: "12px" }}>Slots currently reserved</small>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Total Bookings</span>
            <span style={{ fontSize: "20px" }}>📋</span>
          </div>
          <strong>{loading ? "..." : bookings.length}</strong>
          <small style={{ color: "var(--muted)", fontSize: "12px" }}>Lifetime reservations</small>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Available Lots</span>
            <span style={{ fontSize: "20px" }}>📍</span>
          </div>
          <strong>{loading ? "..." : lots.length}</strong>
          <small style={{ color: "var(--muted)", fontSize: "12px" }}>Ready for booking</small>
        </div>

        <div className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Completed Trips</span>
            <span style={{ fontSize: "20px" }}>🏁</span>
          </div>
          <strong>{loading ? "..." : completedBookings.length}</strong>
          <small style={{ color: "var(--muted)", fontSize: "12px" }}>Past parking sessions</small>
        </div>
      </section>

      {/* Active & Recent Reservations Section */}
      <section className="section" style={{ marginTop: "10px" }}>
        <div className="section-heading left" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h2>Your Reservations</h2>
            <p>Recent and active parking slots booked under your account.</p>
          </div>
          {bookings.length > 0 && (
            <Link to="/mybookings" style={{ fontWeight: "700", fontSize: "14px" }}>
              View all bookings →
            </Link>
          )}
        </div>

        {loading ? (
          <div className="empty-state">
            <p>Loading your reservations...</p>
          </div>
        ) : bookings.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px", marginTop: "16px" }}>
            {bookings.slice(0, 4).map((booking) => {
              const lotName = booking.slot?.parkingLot?.name || booking.parkingLotName || "City Center Facility";
              const lotLoc = booking.slot?.parkingLot?.location || booking.parkingLotLocation || "Downtown Area";
              const slotNum = booking.slot?.slotNumber || "Slot #1";

              return (
                <div
                  key={booking.id}
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    border: "1px solid var(--border)",
                    padding: "22px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "16px"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--muted)" }}>
                        #{booking.id}
                      </span>
                      {getStatusBadge(booking.status)}
                    </div>

                    <h3 style={{ margin: "0 0 6px 0", fontSize: "18px" }}>{lotName}</h3>
                    <p style={{ margin: "0 0 14px 0", color: "var(--muted)", fontSize: "13px" }}>
                      📍 {lotLoc}
                    </p>

                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                      padding: "12px",
                      background: "#f8fafc",
                      borderRadius: "10px",
                      fontSize: "12px"
                    }}>
                      <div>
                        <span style={{ color: "var(--muted)", display: "block" }}>Reserved Slot</span>
                        <strong style={{ fontSize: "15px", color: "var(--primary)" }}>{slotNum}</strong>
                      </div>
                      <div>
                        <span style={{ color: "var(--muted)", display: "block" }}>Total Amount</span>
                        <strong style={{ fontSize: "15px", color: "#10294d" }}>₹{booking.totalAmount || 0}</strong>
                      </div>
                      <div style={{ gridColumn: "span 2" }}>
                        <span style={{ color: "var(--muted)", display: "block" }}>Duration</span>
                        <span>{formatDateTime(booking.startTime)} - {formatDateTime(booking.endTime)}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", alignItems: "center" }}>
                    {booking.status === "PENDING_PAYMENT" && (
                      <button
                        type="button"
                        className="button button-primary"
                        style={{ padding: "8px 16px", fontSize: "13px" }}
                        onClick={() => navigate("/payment", { state: { bookingId: booking.id, amount: booking.totalAmount } })}
                      >
                        💳 Pay Now
                      </button>
                    )}

                    {booking.status === "CONFIRMED" && (
                      <button
                        type="button"
                        className="button button-secondary"
                        style={{ padding: "8px 14px", fontSize: "13px", color: "var(--danger)" }}
                        disabled={cancellingId === booking.id}
                        onClick={() => handleCancel(booking.id)}
                      >
                        {cancellingId === booking.id ? "Cancelling..." : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state" style={{ background: "#ffffff", border: "1px dashed var(--border)", borderRadius: "16px", padding: "35px 20px" }}>
            <span style={{ fontSize: "36px" }}>🅿️</span>
            <h3 style={{ margin: "10px 0 6px 0" }}>No bookings yet</h3>
            <p style={{ margin: "0 0 16px 0", color: "var(--muted)", maxWidth: "450px" }}>
              You haven't reserved any parking spots yet. Explore our top facilities below and book your guaranteed parking spot in seconds!
            </p>
            <Link to="/parkinglots" className="button button-primary">
              Browse Parking Lots
            </Link>
          </div>
        )}
      </section>

      {/* Featured Available Parking Locations */}
      <section className="section" style={{ marginTop: "30px" }}>
        <div className="section-heading left" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h2>Available Parking Lots</h2>
            <p>Guaranteed parking locations ready for immediate booking.</p>
          </div>
          <Link to="/parkinglots" style={{ fontWeight: "700", fontSize: "14px" }}>
            View all {lots.length} facilities →
          </Link>
        </div>

        {lots.length > 0 ? (
          <div className="parking-grid">
            {lots.slice(0, 3).map((lot) => (
              <article className="parking-card" key={lot.id} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div className="parking-card-content">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <span className="eyebrow" style={{ fontSize: "11px" }}>FACILITY #{lot.id}</span>
                    <span style={{ background: "#ecfdf5", color: "#047857", padding: "4px 8px", borderRadius: "8px", fontSize: "11px", fontWeight: "700" }}>
                      OPEN
                    </span>
                  </div>

                  <h3 style={{ margin: "0 0 6px 0", fontSize: "19px" }}>{lot.name}</h3>
                  <p style={{ margin: "0 0 12px 0", color: "var(--muted)", fontSize: "13px" }}>
                    📍 {lot.location}
                  </p>

                  {lot.description && (
                    <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.5", marginBottom: "16px" }}>
                      {lot.description}
                    </p>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "14px", marginTop: "auto" }}>
                    <div>
                      <span style={{ fontSize: "11px", color: "var(--muted)", display: "block" }}>Hourly Rate</span>
                      <strong style={{ fontSize: "18px", color: "var(--navy)" }}>₹{lot.pricePerHour ?? 0}</strong>
                      <small style={{ color: "var(--muted)" }}> /hr</small>
                    </div>

                    <div>
                      <span style={{ fontSize: "11px", color: "var(--muted)", display: "block" }}>Capacity</span>
                      <strong style={{ fontSize: "15px", color: "var(--primary)" }}>{lot.totalSlots ?? 10} Slots</strong>
                    </div>
                  </div>
                </div>

                <div style={{ padding: "0 24px 20px 24px" }}>
                  <Link
                    to={`/slots/${lot.id}`}
                    className="button button-primary full-width"
                    style={{ textAlign: "center", display: "block" }}
                  >
                    Select Slot & Book →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>Loading available parking facilities...</p>
          </div>
        )}
      </section>

      {/* Quick Services Navigation */}
      <section className="dashboard-grid" style={{ marginTop: "30px" }}>
        <article className="dashboard-card">
          <div className="dashboard-card-icon">🔎</div>
          <h3>Find & Reserve</h3>
          <p>Search real-time parking spaces across prime city hubs, tech parks, and airports.</p>
          <Link to="/parkinglots">Search locations →</Link>
        </article>

        <article className="dashboard-card">
          <div className="dashboard-card-icon">📅</div>
          <h3>Manage Reservations</h3>
          <p>Review booking status, generate parking passes, and modify or cancel upcoming slots.</p>
          <Link to="/mybookings">View reservations →</Link>
        </article>

        <article className="dashboard-card">
          <div className="dashboard-card-icon">⚡</div>
          <h3>Instant Check-in</h3>
          <p>Show your slot pass on arrival for automated barrier gate entry and swift exit.</p>
          <Link to="/parkinglots">Explore slots →</Link>
        </article>

        <article className="dashboard-card">
          <div className="dashboard-card-icon">👤</div>
          <h3>Account Information</h3>
          <p>Registered as: <strong>{user?.name || "Parking User"}</strong></p>
          <p style={{ margin: "4px 0", color: "var(--muted)", fontSize: "12px" }}>{user?.email || "No email"}</p>
          <span style={{ display: "inline-block", marginTop: "8px", background: "#e0f2fe", color: "#0369a1", padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700" }}>
            Role: {user?.role || "USER"}
          </span>
        </article>
      </section>
    </main>
  );
}