import { useCallback, useEffect, useState } from "react";
import api, { getErrorMessage } from "../services/api";
import { Link } from "react-router-dom";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookings = useCallback(async () => {
    try {
      const response = await api.get("/bookings/my");

      setBookings(
        Array.isArray(response.data)
          ? response.data
          : response.data.content || []
      );

      setError("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  async function cancelBooking(id) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      await api.patch(`/bookings/${id}/cancel`);

      await loadBookings();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <main className="page-container">
      <section className="page-heading">
        <span className="eyebrow">YOUR RESERVATIONS</span>

        <h1>My Bookings</h1>

        <p>Track and manage your parking reservations.</p>
      </section>

      {loading && (
        <p className="status-message">Loading bookings...</p>
      )}

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="empty-state">
          <span>📅</span>

          <h3>No bookings yet</h3>

          <p>
            Find a parking facility and reserve your first slot.
          </p>

          <Link
            to="/parkinglots"
            className="button button-primary"
          >
            Explore Parking
          </Link>
        </div>
      )}

      <div className="booking-list">
        {bookings.map((booking) => (
          <article className="booking-card" key={booking.id}>
            <div className="booking-card-header">
              <div>
                <span className="eyebrow">
                  BOOKING #{booking.id}
                </span>

                <h3>
                  {booking.parkingLotName ||
                    booking.parkingLot?.name ||
                    "Parking Reservation"}
                </h3>
              </div>

              <span className="status-pill">
                {booking.status}
              </span>
            </div>

            <div className="booking-card-details">
              <p>
                <strong>Start:</strong>{" "}
                {booking.startTime
                  ? new Date(booking.startTime).toLocaleString()
                  : "—"}
              </p>

              <p>
                <strong>End:</strong>{" "}
                {booking.endTime
                  ? new Date(booking.endTime).toLocaleString()
                  : "—"}
              </p>

              <p>
                <strong>Amount:</strong>{" "}
                ₹{booking.amount ?? booking.totalAmount ?? "—"}
              </p>
            </div>

            <div className="booking-actions">
              {booking.status !== "CANCELLED" &&
                booking.status !== "COMPLETED" && (
                  <button
                    className="button button-danger"
                    onClick={() => cancelBooking(booking.id)}
                  >
                    Cancel Booking
                  </button>
                )}

              {booking.status === "PENDING_PAYMENT" && (
                <Link
                  to={`/payment?bookingId=${booking.id}`}
                  className="button button-primary"
                >
                  Pay Now
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}