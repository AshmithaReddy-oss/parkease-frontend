export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <h3>
          Park<span className="brand-accent">Ease</span>
        </h3>

        <p>
          Find your space. Book with ease. Park smarter.
        </p>
      </div>

      <p>
        © {new Date().getFullYear()} ParkEase.
        Smart Parking Slot Reservation System.
      </p>
    </footer>
  );
}