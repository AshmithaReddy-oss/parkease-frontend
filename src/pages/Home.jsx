import { Link } from "react-router-dom";

const features = [
  {
    icon: "🔎",
    title: "Smart Parking Search",
    description:
      "Discover parking facilities based on your location and requirements.",
  },
  {
    icon: "⚡",
    title: "Real-Time Availability",
    description:
      "Check available parking spaces before making a reservation.",
  },
  {
    icon: "📅",
    title: "Easy Reservations",
    description:
      "Choose a suitable date and time for your parking reservation.",
  },
  {
    icon: "🔐",
    title: "Secure Authentication",
    description:
      "Access your account using secure, token-based authentication.",
  },
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">
            THE SMARTER WAY TO PARK
          </span>

          <h1>
            Parking made
            <br />
            <span>simple and stress-free.</span>
          </h1>

          <p>
            Discover parking spaces, check availability,
            reserve your slot and manage every booking
            from one convenient platform.
          </p>

          <div className="hero-actions">
            <Link
              to="/parkinglots"
              className="button button-primary"
            >
              Find Parking →
            </Link>

            <Link
              to="/register"
              className="button button-outline"
            >
              Create Account
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <strong>24/7</strong>
              <span>Online access</span>
            </div>

            <div>
              <strong>Easy</strong>
              <span>Reservations</span>
            </div>

            <div>
              <strong>Secure</strong>
              <span>Authentication</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="parking-illustration">
            <div className="parking-sign">P</div>

            <div className="parking-road">
              <span>🚗</span>
              <span>🚙</span>
            </div>

            <div className="parking-slots">
              <div>01</div>
              <div>02</div>
              <div>03</div>
              <div>04</div>
            </div>
          </div>

          <div className="floating-card">
            <span className="status-dot"></span>
            <div>
              <strong>Park smarter</strong>
              <p>Your next space is a few clicks away.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">WHY PARKEASE?</span>

          <h2>Everything you need to park better</h2>

          <p>
            A simple, connected solution for drivers
            and parking lot owners.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <article
              className="feature-card"
              key={feature.title}
            >
              <div className="feature-icon">
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div>
          <span className="eyebrow">GET STARTED TODAY</span>

          <h2>Your parking journey starts here.</h2>

          <p>
            Register to explore parking facilities
            and manage reservations conveniently.
          </p>
        </div>

        <Link
          to="/register"
          className="button button-light"
        >
          Join ParkEase →
        </Link>
      </section>
    </main>
  );
}