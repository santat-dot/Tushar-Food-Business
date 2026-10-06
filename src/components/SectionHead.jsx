import { Link } from "react-router-dom";

export default function SectionHead({ eyebrow, title, linkTo, linkLabel }) {
  return (
    <div className="section-head">
      <div>
        {eyebrow && <div className="eyebrow" style={{ marginBottom: 6 }}>{eyebrow}</div>}
        <h2 className="section-title">{title}</h2>
      </div>
      {linkTo && <Link to={linkTo} className="link-more">{linkLabel}</Link>}
    </div>
  );
}
