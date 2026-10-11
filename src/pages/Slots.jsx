import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";

export default function Slots() {
  const { lotId } = useParams();

  const [slots, setSlots] = useState([]);
  const [lot, setLot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSlots() {
      try {
        const [lotResponse, slotsResponse] = await Promise.all([
          api.get(`/parking-lots/${lotId}`),
          api.get(`/slots/parking-lot/${lotId}`),
        ]);

        setLot(lotResponse.data);

        setSlots(
          Array.isArray(slotsResponse.data)
            ? slotsResponse.data
            : slotsResponse.data.content || []
        );
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    loadSlots();
  }, [lotId]);

  return (
    <main className="page-container">
      <section className="page-heading">
        <span className="eyebrow">PARKING AVAILABILITY</span>

        <h1>{lot?.name || "Choose your parking slot"}</h1>

        <p>{lot?.location || "View available spaces and reserve a slot."}</p>
      </section>

      {loading && <p className="status-message">Loading parking slots...</p>}

      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && slots.length === 0 && (
        <div className="empty-state">
          <span>🚗</span>
          <h3>No slots available</h3>
          <p>There are currently no slots to display.</p>
        </div>
      )}

      <div className="slots-grid">
        {slots.map((slot) => {
          const available =
            slot.available === true && slot.status === "AVAILABLE";

          return (
            <article
              key={slot.id}
              className={`slot-card ${
                available ? "slot-available" : "slot-unavailable"
              }`}
            >
              <span className="slot-icon">🅿️</span>

              <h3>Slot {slot.slotNumber ?? slot.id}</h3>

              <span className="slot-status">
                {available ? "Available" : "Unavailable"}
              </span>

              {available && (
                <Link
                  to={`/booking?lotId=${lotId}&slotId=${slot.id}`}
                  className="button button-primary full-width"
                >
                  Book This Slot
                </Link>
              )}
            </article>
          );
        })}
      </div>
    </main>
  );
}