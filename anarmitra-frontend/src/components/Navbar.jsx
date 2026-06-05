import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const goDashboard = () => {
    if (role === "FARMER") navigate("/dashboard/farmer");
    else if (role === "MERCHANT") navigate("/dashboard/merchant");
    else if (role === "ADVISOR") navigate("/dashboard/advisor");
    else if (role === "FERTILIZER_STORE") navigate("/dashboard/fertilizer-store");
    else if (role === "ADMIN") navigate("/dashboard/admin");
    else navigate("/login");
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="main-navbar">
      <Link to="/" className="brand-logo">
        🌿 AnarMitra
      </Link>

      <div className="nav-links">
        <Link to="/">{t("home")}</Link>
        <Link to="/about">{t("about")}</Link>
        <Link to="/services">{t("services")}</Link>
        <Link to="/contact">{t("contact")}</Link>

        <LanguageSwitcher />

        {!token ? (
          <>
            <Link to="/login">{t("login")}</Link>
            <Link to="/registration" className="nav-btn">
              {t("register")}
            </Link>
          </>
        ) : (
          <>
            <button className="nav-text-btn" onClick={goDashboard}>
              {t("dashboard")}
            </button>
            <button className="nav-btn" onClick={logout}>
              {t("logout")}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}  