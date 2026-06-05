import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import VoiceReader from "../components/VoiceReader";
import "../styles/publicPages.css";

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          
          <VoiceReader text={t("heroTitle")}>
  <h1>{t("heroTitle")}</h1>
</VoiceReader>

<VoiceReader text={t("heroText")}>
  <p>{t("heroText")}</p>
</VoiceReader>

          {/* <p>{t("heroText")}</p> */}

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => navigate("/registration")}
            >
              {t("createAccount")}
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/services")}
            >
              {t("exploreServices")}
            </button>
          </div>
        </div>

        {/* <div className="hero-gallery">
          <img
            src="https://images.unsplash.com/photo-1577003833619-76bbd7f82948?auto=format&fit=crop&w=900&q=80"
            alt="Pomegranate fruit"
          />

          <img
            src="https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=900&q=80"
            alt="Pomegranate farm"
          />

          <img
            src="https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?auto=format&fit=crop&w=900&q=80"
            alt="Pomegranate agriculture"
          />
        </div> */}
      </section>

      <section className="info-section">
        <div className="card-grid">
          <div className="info-card">
            <h3>🧠 AI Disease Detection</h3>
            <p>
              Upload pomegranate plant images and detect disease using ML model API.
            </p>
          </div>

          <div className="info-card">
            <h3>📊 Market Analysis</h3>
            <p>
              Analyze pomegranate prices using uploaded CSV and prediction charts.
            </p>
          </div>

          <div className="info-card">
            <h3>🤝 Farmer Services</h3>
            <p>
              Connect with merchants, fertilizer stores and agriculture advisors.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}