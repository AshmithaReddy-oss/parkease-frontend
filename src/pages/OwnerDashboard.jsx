import { useEffect, useState } from "react";
import api, { getErrorMessage } from "../services/api";

export default function OwnerDashboard() {
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const [lots, setLots] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [error, setError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [success, setSuccess] = useState("");

  const [loadingLots, setLoadingLots] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
    totalSlots: "10",
    pricePerHour: "30",
  });

  // Load the owner's parking facilities.
  async function loadParkingLots() {
    setError("");
    setLoadingLots(true);

    try {
      const response = await api.get("/parking-lots/owner/my");
      const data = response.data;

      setLots(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
            ? data.content
            : []
      );
    } catch (err) {
      setLots([]);
      setError(getErrorMessage(err));
    } finally {
      setLoadingLots(false);
    }
  }

  // Load the logged-in user's bookings.
  async function loadBookings() {
    setBookingError("");
    setLoadingBookings(true);

    try {
      const response = await api.get("/bookings/my");
      const data = response.data;

      setBookings(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
            ? data.content
            : []
      );
    } catch (err) {
      setBookings([]);
      setBookingError(getErrorMessage(err));
    } finally {
      setLoadingBookings(false);
    }
  }

  async function loadData() {
    await Promise.all([loadParkingLots(), loadBookings()]);
  }

  useEffect(() => {
    loadData();
  }, []);

  // Update form fields as the user types.
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Register a new parking facility.
  async function addParkingLot(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.name.trim() ||
      !form.location.trim() ||
      Number(form.totalSlots) < 1 ||
      Number(form.pricePerHour) < 0
    ) {
      setError("Please enter valid parking facility details.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: form.name.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        totalSlots: Number(form.totalSlots),
        pricePerHour: Number(form.pricePerHour),
      };

      // Matches POST /api/parking-lots.
      await api.post("/parking-lots", payload);

      setForm({
        name: "",
        location: "",
        description: "",
        totalSlots: "10",
        pricePerHour: "30",
      });

      setSuccess(
        "Parking facility registered successfully. Its status may be pending admin approval."
      );

      await loadParkingLots();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const welcomeName = user?.name ? ", " + user.name : "";

  return (
    <main className="page-container">
      {/* Welcome */}
      <section className="dashboard-welcome">
        <div>
          <span className="eyebrow">OWNER DASHBOARD</span>

          <h1>Welcome{welcomeName}</h1>

          <p>Manage parking facilities, availability and bookings.</p>
        </div>
      </section>

      {/* Parking facility error */}
      {error && (
        <div className="alert alert-error" role="alert">
          <strong>Parking facility:</strong> {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="alert alert-success" role="status">
          {success}
        </div>
      )}

      {/* Dashboard statistics */}
      <section className="dashboard-stats" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <div className="stat-card">
          <span>Parking Facilities</span>
          <strong>{loadingLots ? "..." : lots.length}</strong>
          <small style={{ color: "var(--muted)", fontSize: "12px" }}>Locations registered</small>
        </div>

        <div className="stat-card">
          <span>Total Slot Capacity</span>
          <strong>{loadingLots ? "..." : lots.reduce((acc, l) => acc + (Number(l.totalSlots) || 0), 0)}</strong>
          <small style={{ color: "var(--muted)", fontSize: "12px" }}>Slots under management</small>
        </div>

        <div className="stat-card">
          <span>Bookings Loaded</span>
          <strong>{loadingBookings ? "..." : bookings.length}</strong>
          <small style={{ color: "var(--muted)", fontSize: "12px" }}>Driver reservations</small>
        </div>

        <div className="stat-card">
          <span>Facility Status</span>
          <strong style={{ color: "var(--success)" }}>Active & Open</strong>
          <small style={{ color: "var(--muted)", fontSize: "12px" }}>Verified owner</small>
        </div>
      </section>

      {/* Add parking facility */}
      <section className="form-card owner-form">
        <div className="section-heading left">
          <h2>Add a Parking Facility</h2>
          <p>Register a new parking facility.</p>
        </div>

        <form onSubmit={addParkingLot}>
          <label htmlFor="name">Facility name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter facility name"
            autoComplete="off"
            required
          />

          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            value={form.location}
            onChange={handleChange}
            placeholder="Enter parking location"
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your parking facility"
            rows={3}
          />

          <label htmlFor="totalSlots">Total slots</label>
          <input
            id="totalSlots"
            name="totalSlots"
            type="number"
            min="1"
            step="1"
            value={form.totalSlots}
            onChange={handleChange}
            required
          />

          <label htmlFor="pricePerHour">Price per hour (₹)</label>
          <input
            id="pricePerHour"
            name="pricePerHour"
            type="number"
            min="0"
            step="0.01"
            value={form.pricePerHour}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="button button-primary"
            disabled={submitting}
          >
            {submitting ? "Registering..." : "Add Parking Facility"}
          </button>
        </form>
      </section>

      {/* Parking facilities list */}
      <section className="section">
        <div className="section-heading left">
          <h2>Your Parking Facilities</h2>
          <p>Facilities registered to your owner account.</p>
        </div>

        {loadingLots ? (
          <div className="empty-state">
            <p>Loading parking facilities...</p>
          </div>
        ) : lots.length > 0 ? (
          <div className="parking-grid">
            {lots.map((lot) => (
              <article className="parking-card" key={lot.id}>
                <div className="parking-card-content">
                  <h3>{lot.name}</h3>

                  <p>{lot.location}</p>

                  {lot.description && <p>{lot.description}</p>}

                  <p>Total slots: {lot.totalSlots ?? "—"}</p>

                  <p>Price: ₹{lot.pricePerHour ?? 0}/hour</p>

                  {lot.status && (
                    <p>
                      Status: <strong>{lot.status}</strong>
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>
              {error
                ? "Parking facilities could not be loaded."
                : "No parking facilities registered yet."}
            </p>

            {!error && <p>Add a facility using the form above.</p>}
          </div>
        )}
      </section>

      {/* Recent bookings */}
      <section className="section">
        <div className="section-heading left">
          <h2>Recent Bookings</h2>
        </div>

        {bookingError && (
          <div className="alert alert-error" role="alert">
            Could not load bookings: {bookingError}
          </div>
        )}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {loadingBookings ? (
                <tr>
                  <td colSpan={4}>Loading bookings...</td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={4}>No bookings available.</td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>#{booking.id}</td>

                    <td>
                      {booking.startTime
                        ? new Date(booking.startTime).toLocaleString()
                        : "—"}
                    </td>

                    <td>
                      {booking.endTime
                        ? new Date(booking.endTime).toLocaleString()
                        : "—"}
                    </td>

                    <td>{booking.status ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}