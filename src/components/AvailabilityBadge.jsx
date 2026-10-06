import { useLanguage } from "../context/LanguageContext";

const MAP = {
  "available": { cls: "badge-available", key: "status_available_today" },
  "low-stock": { cls: "badge-low", key: "status_limited" },
  "limited": { cls: "badge-low", key: "status_limited" },
  "sold-out": { cls: "badge-soldout", key: "status_soldout" },
  "preorder": { cls: "badge-preorder", key: "status_preorder" },
  "unavailable": { cls: "badge-unavailable", key: "status_tomorrow" },
  "coming-soon": { cls: "badge-soon", key: "status_tomorrow" },
};

export default function AvailabilityBadge({ status }) {
  const { t } = useLanguage();
  const config = MAP[status] || MAP["available"];
  const labelOverride = {
    "unavailable": t("availability_temporarily_unavailable"),
    "coming-soon": t("availability_coming_soon"),
  };
  return <span className={`badge ${config.cls}`}>{labelOverride[status] || t(config.key)}</span>;
}
