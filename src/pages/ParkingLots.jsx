import { useEffect, useState } from "react";
import ParkingCard from "../components/ParkingCard";
import api, { getErrorMessage } from "../services/api";

export default function ParkingLots() {
  const [lots, setLots] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLots() {
      try {
        const response = await api.get("/parking-lots");

        setLots(
          Array.isArray(response.data)
            ? response.data
            : response.data.content || []
        );
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    loadLots();
  }, []);

  const filteredLots = lots.filter((lot) => {
    const query = search.toLowerCase();

    return (
      lot.name?.toLowerCase().includes(query) ||
      lot.location?.toLowerCase().includes(query)
    );
  });

  return (
    <main className="page-container">
      <section className="page-heading">
        <span className="eyebrow">FIND YOUR SPACE</span>

        <h1>Explore parking locations</h1>

        <p>
          Search facilities and find a convenient parking space.
        </p>
      </section>

      <div className="search-bar">
        <span>🔎</span>

        <input
          placeholder="Search by parking name or location..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {loading && (
        <p className="status-message">
          Loading parking locations...
        </p>
      )}

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {!loading && !error && filteredLots.length === 0 && (
        <div className="empty-state">
          <span>🅿️</span>
          <h3>No parking locations found</h3>
          <p>
            Try another search or add parking facilities through
            your owner account.
          </p>
        </div>
      )}

      <div className="parking-grid">
        {filteredLots.map((lot) => (
          <ParkingCard key={lot.id} lot={lot} />
        ))}
      </div>
    </main>
  );
}