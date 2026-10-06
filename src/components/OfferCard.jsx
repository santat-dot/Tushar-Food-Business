import { Link } from "react-router-dom";
import { categories } from "../data/categories";
import { offerStatus } from "../data/offers";
import { useLanguage } from "../context/LanguageContext";
import { localizeOffer } from "../i18n/translations";

export function daysLeft(end) {
  const ms = new Date(end + "T23:59:59") - new Date();
  return Math.max(0, Math.ceil(ms / 86400000));
}

export default function OfferCard({ offer }) {
  const { t, lang, formatDate } = useLanguage();
  const status = offerStatus(offer);
  const localizedOffer = localizeOffer(offer, lang);
  const first = categories.find((c) => offer.categories.includes(c.slug));
  return (
    <div className={`offer-card ${status}`} style={{ "--oc": offer.color }}>
      {offer.image && <div className="offer-card-image" style={{ backgroundImage: `linear-gradient(180deg, rgba(31,25,18,0.08), rgba(31,25,18,0.35)), url(${offer.image})` }} />}
      <div className="offer-card-top">
        <span className="offer-emoji">{offer.emoji}</span>
        <span className="offer-pct">{offer.percent}<small>{t("offer_off_suffix")}</small></span>
      </div>
      <h3>{localizedOffer.title}</h3>
      <p>{localizedOffer.note}</p>
      <div className="offer-meta">
        {status === "live" && <span className="pill pill-live">● {daysLeft(offer.end) === 1 ? t("offer_live_day", { count: 1 }) : t("offer_live_days", { count: daysLeft(offer.end) })}</span>}
        {status === "upcoming" && <span className="pill">{t("offer_starts", { date: formatDate(offer.start, { day: "numeric", month: "short", year: "numeric" }) })}</span>}
        {status === "ended" && <span className="pill">{t("offer_ended")}</span>}
        <span style={{ fontSize: 12 }}>{formatDate(offer.start, { day: "numeric", month: "short", year: "numeric" })} – {formatDate(offer.end, { day: "numeric", month: "short", year: "numeric" })}</span>
      </div>
      {status === "live" && first && <Link to={`/category/${first.slug}`} className="btn btn-sm offer-btn">{t("offer_shop")} →</Link>}
    </div>
  );
}
