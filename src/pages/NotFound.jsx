import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="container section empty-state">
      <h3>{t("not_found_title")}</h3>
      <p>{t("not_found_description")}</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 16, display: "inline-flex" }}>{t("not_found_back_home")}</Link>
    </div>
  );
}
