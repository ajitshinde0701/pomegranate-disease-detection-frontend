import { useTranslation } from "react-i18next";
import "../styles/publicPages.css";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <select
      className="language-select"
      value={i18n.language}
      onChange={(e) => changeLanguage(e.target.value)}
    >
      <option value="en">English</option>
      <option value="mr">मराठी</option>
      <option value="hi">हिंदी</option>
    </select>
  );
}