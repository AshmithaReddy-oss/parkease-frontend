import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";

export default function Payment() {
  const [searchParams] = useSearchParams();

  const bookingId = searchParams.get("bookingId");

  const [method, setMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handlePayment(event) {
    event.preventDefault();

    if (!bookingId) {
      setError("A valid booking ID is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Create (or reuse) the pending payment for this booking.
      const created = await api.post(`/payments/booking/${bookingId}`);

      // 2. Demo confirmation with the selected method.
      const confirmed = await api.post(
        `/payments/${created.data.id}/confirm`,
        null,
        { params: { method } }
      );

      setResult(confirmed.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <main className="page-container narrow-container">
        <section className="confirmation-card">
          <div className="confirmation-icon">✓</div>

          <h1>Payment completed</h1>

          <p>
            Payment status:{" "}
            <strong>{result.paymentStatus ?? "Pending"}</strong>
          </p>

          <p>Payment ID: {result.id ?? "Not provided"}</p>

          {result.transactionReference && (
            <p>Reference: {result.transactionReference}</p>
          )}

          <p>
            This is a demo payment. No real money has been transferred.
          </p>

          <Link to="/mybookings" className="button button-primary">
            Return to My Bookings
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-container narrow-container">
      <section className="page-heading">
        <span className="eyebrow">SECURE CHECKOUT</span>

        <h1>Payment</h1>

        <p>Choose your payment method for the selected booking.</p>
      </section>

      <section className="form-card">
        <div className="booking-summary">
          <h3>Booking #{bookingId || "Not selected"}</h3>

          <p>
            The payment amount is calculated and validated by the backend.
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handlePayment}>
          <label htmlFor="method">Payment method</label>

          <select
            id="method"
            value={method}
            onChange={(event) => setMethod(event.target.value)}
          >
            <option value="UPI">UPI</option>
            <option value="CARD">Debit/Credit Card</option>
            <option value="NET_BANKING">Net Banking</option>
          </select>

          <button
            type="submit"
            className="button button-primary full-width"
            disabled={loading || !bookingId}
          >
            {loading ? "Processing..." : "Continue to Payment"}
          </button>
        </form>

        <p className="muted">
          Demo mode: this does not charge a card or transfer money.
        </p>
      </section>
    </main>
  );
}