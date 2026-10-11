import { Link } from "react-router-dom";

export default function ParkingCard({ lot }) {
  const id = lot.id;

  return (
    <article className="parking-card">
      <div className="parking-card-image">
        <span>🅿️</span>

        <span className="available-badge">
          {lot.status || "AVAILABLE"}
        </span>
      </div>

      <div className="parking-card-content">
        <h3>{lot.name}</h3>

        <p className="muted">
          📍 {lot.location}
        </p>

        <div className="parking-card-details">
          <span>
            🅿️ {lot.totalSlots ?? "—"} slots
          </span>

          <span>
            ₹{lot.pricePerHour ?? 0}/hour
          </span>
        </div>

        <Link
          to={`/slots/${id}`}
          className="button button-primary full-width"
        >
          View Available Slots
        </Link>
      </div>
    </article>
  );
}