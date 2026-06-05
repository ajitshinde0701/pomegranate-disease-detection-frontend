import "../styles/publicPages.css";

export default function About() {
  return (
    <div className="page-section">
      <section className="banner-section">
        <h1>About AnarMitra</h1>
        <p>
          A digital agriculture platform built to support pomegranate farmers
          with technology, communication and data-driven decision making.
        </p>
      </section>

      <section className="info-section">
        <div className="card-grid">
          <div className="info-card">
            <h3>🎯 Our Objective</h3>
            <p>
              To provide farmers easy access to multiple agriculture services
              through one integrated digital platform.
            </p>
          </div>

          <div className="info-card">
            <h3>🌾 Farmer Support</h3>
            <p>
              Farmers can connect with merchants, advisors and fertilizer stores
              for guidance and service access.
            </p>
          </div>

          <div className="info-card">
            <h3>🧠 AI Powered System</h3>
            <p>
              The platform integrates disease detection and market prediction to
              improve crop management decisions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}