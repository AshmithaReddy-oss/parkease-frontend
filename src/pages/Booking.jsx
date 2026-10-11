import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";

export default function Booking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const lotId = searchParams.get("lotId");
  const slotId = searchParams.get("slotId");

  const [form, setForm] = useState({
    startTime: "",
    endTime: "",
  });

  const [lot, setLot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!lotId) return;

    api.get(`/parking-lots/${lotId}`)
      .then((response) => setLot(response.data))
      .catch((err) => setError(getErrorMessage(err)));
  }, [lotId]);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!lotId || !slotId) {
      setError("Please select a parking lot and slot first.");
      return;
    }

    const start = new Date(form.startTime);
    const end = new Date(form.endTime);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      start <= new Date() ||
      end <= start
    ) {
      setError(
        "Choose a future start time and an end time after the start."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/bookings", {
        slotId: Number(slotId),
        startTime: form.startTime,
        endTime: form.endTime,
      });

      navigate("/bookingconfirmation", {
        state: {
          booking: response.data,
          lot,
        },
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-container narrow-container">
      <section className="page-heading">
        <span className="eyebrow">RESERVE YOUR SPACE</span>

        <h1>Book a parking slot</h1>

        <p>
          Select your parking period and review your reservation.
        </p>
      </section>

      <section className="form-card">
        {lot && (
          <div className="booking-summary">
            <h3>{lot.name}</h3>
            <p>📍 {lot.location}</p>
            <p>
              Hourly price: ₹{lot.pricePerHour ?? 0}
            </p>
          </div>
        )}

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="startTime">Start date and time</label>

          <input
            id="startTime"
            type="datetime-local"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
          />

          <label htmlFor="endTime">End date and time</label>

          <input
            id="endTime"
            type="datetime-local"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="button button-primary full-width"
            disabled={loading}
          >
            {loading ? "Confirming..." : "Confirm Booking"}
          </button>
        </form>
      </section>
    </main>
  );
}