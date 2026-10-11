import { Link, useLocation } from "react-router-dom";

export default function BookingConfirmation() {
  const location = useLocation();

  const booking = location.state?.booking;
  const lot = location.state?.lot;

  return (
    <main className="page-container narrow-container">
      <section className="confirmation-card">
        <div className="confirmation-icon">✓</div>

        <span className="eyebrow">PARKEASE RESERVATION</span>

        <h1>Booking confirmation</h1>

        {booking ? (
          <>
            <p>
              Your booking request has been processed.
              Check the details below.
            </p>

            <div className="confirmation-details">
              <div>
                <span>Booking ID</span>
                <strong>{booking.id ?? "Pending"}</strong>
              </div>

              <div>
                <span>Parking location</span>
                <strong>{lot?.name ?? "Selected parking lot"}</strong>
              </div>

              <div>
                <span>Start time</span>
                <strong>
                  {booking.startTime
                    ? new Date(booking.startTime).toLocaleString()
                    : "See booking details"}
                </strong>
              </div>

              <div>
                <span>End time</span>
                <strong>
                  {booking.endTime
                    ? new Date(booking.endTime).toLocaleString()
                    : "See booking details"}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong>
                  {booking.status ?? "Created"}
                </strong>
              </div>
            </div>
          </>
        ) : (
          <p>
            Your booking details are not available on this page.
            Open My Bookings to check existing reservations.
          </p>
        )}

        <div className="confirmation-actions">
          <Link
            to="/mybookings"
            className="button button-primary"
          >
            View My Bookings
          </Link>

          <Link
            to="/parkinglots"
            className="button button-outline"
          >
            Find More Parking
          </Link>
        </div>
      </section>
    </main>
  );
}