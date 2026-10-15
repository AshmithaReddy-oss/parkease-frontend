import { useEffect, useState } from "react";
import api, { getErrorMessage } from "../services/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [lots, setLots] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [approvingId, setApprovingId] = useState(null);

  function toList(data) {
    return Array.isArray(data) ? data : data?.content || [];
  }

  async function loadDashboard() {
    try {
      const [usersResponse, lotsResponse, bookingsResponse] =
        await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/parking-lots"),
          api.get("/admin/bookings"),
        ]);

      setUsers(toList(usersResponse.data));
      setLots(toList(lotsResponse.data));
      setBookings(toList(bookingsResponse.data));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function approveLot(id) {
    setError("");
    setSuccess("");
    setApprovingId(id);

    try {
      await api.put(`/admin/parking-lots/${id}/approve`);
      setSuccess("Parking facility approved.");
      await loadDashboard();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setApprovingId(null);
    }
  }

  return (
    <main className="page-container">
      <section className="dashboard-welcome">
        <div>
          <span className="eyebrow">SYSTEM ADMINISTRATION</span>

          <h1>Admin Dashboard</h1>

          <p>Monitor users, parking facilities and reservations.</p>
        </div>
      </section>

      {error && <div className="alert alert-error">{error}</div>}

      {success && <div className="alert alert-success">{success}</div>}

      <section className="dashboard-stats" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <div className="stat-card">
          <span>Registered Users</span>
          <strong>{users.length}</strong>
          <small style={{ color: "var(--muted)", fontSize: "12px" }}>Platform accounts</small>
        </div>

        <div className="stat-card">
          <span>Parking Facilities</span>
          <strong>{lots.length}</strong>
          <small style={{ color: "var(--muted)", fontSize: "12px" }}>Total locations</small>
        </div>

        <div className="stat-card">
          <span>Total Bookings</span>
          <strong>{bookings.length}</strong>
          <small style={{ color: "var(--muted)", fontSize: "12px" }}>System reservations</small>
        </div>

        <div className="stat-card">
          <span>System Status</span>
          <strong style={{ color: "var(--success)" }}>Online 🟢</strong>
          <small style={{ color: "var(--muted)", fontSize: "12px" }}>API & Database UP</small>
        </div>
      </section>

      <section className="section">
        <div className="section-heading left">
          <h2>Registered Users</h2>

          <p>Review the user accounts returned by the backend.</p>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan="4">No user data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <div className="section-heading left">
          <h2>Parking Facilities</h2>

          <p>Approve new facilities so users can book them.</p>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Facility</th>
                <th>Location</th>
                <th>Total Slots</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {lots.map((lot) => (
                <tr key={lot.id}>
                  <td>{lot.id}</td>
                  <td>{lot.name}</td>
                  <td>{lot.location}</td>
                  <td>{lot.totalSlots ?? "—"}</td>
                  <td>{lot.status ?? "—"}</td>
                  <td>
                    {lot.status === "APPROVED" ? (
                      "—"
                    ) : (
                      <button
                        type="button"
                        className="button button-primary"
                        disabled={approvingId === lot.id}
                        onClick={() => approveLot(lot.id)}
                      >
                        {approvingId === lot.id
                          ? "Approving..."
                          : "Approve"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {lots.length === 0 && (
                <tr>
                  <td colSpan="6">No parking facilities available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <div className="section-heading left">
          <h2>Recent Bookings</h2>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>User ID</th>
                <th>Status</th>
                <th>Start Time</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.userId ?? booking.user?.id ?? "—"}</td>
                  <td>{booking.status}</td>
                  <td>
                    {booking.startTime
                      ? new Date(booking.startTime).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}

              {bookings.length === 0 && (
                <tr>
                  <td colSpan="4">No booking data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}