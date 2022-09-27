import React from "react";
import { Link } from "react-router-dom";

const FooterLinks = props => {
  const { link, footerLinkText, text } = props;
  return (
    <div className="footer-column">
      <Link to={link}>
        <h1>{footerLinkText}</h1>
      </Link>
      <p>{text}</p>
    </div>
  );
};

export default FooterLinks;
