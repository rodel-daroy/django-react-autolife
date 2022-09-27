import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  footerLinks,
  ADVERTISE_WITH_US_TEXT,
  ABOUT_US_TEXT,
  CONTACT_US_TEXT,
  FOOTER_LAYOUT_TYPES
} from "../../config/constants";
import Logo from "../common/Logo";
import FooterLinks from "./FooterLinks";
import MonthlyDigest from "./MonthlyDigest";

const Footer = ({ footerLayoutType, headerFooterVisible }) => {
  const minimal = footerLayoutType === FOOTER_LAYOUT_TYPES.SOFTREGISTRATION;
  const d = new Date();
  const year = d.getFullYear();
  return (
    <div>
      {headerFooterVisible && (
        <div className="main-footer-container">
          <footer className={`main-footer page-width ${minimal && "minimal"}`}>
            {!minimal && (
              <div className="text-container">
                <div className="visible-xs-block" style={{ padding: 16 }}>
                  <Logo kind="Symbol-AllWhite" />
                </div>
                <div className="footer-column-wrap">
                  <FooterLinks
                    link="/content/about-us"
                    footerLinkText="About us"
                    text={ABOUT_US_TEXT}
                  />
                  <FooterLinks
                    link="/content/advertise-with-us"
                    footerLinkText="Advertise with us"
                    text={ADVERTISE_WITH_US_TEXT}
                  />
                  <FooterLinks
                    link="/contact-us"
                    footerLinkText="Contact us"
                    text={CONTACT_US_TEXT}
                  />
                  <MonthlyDigest />
                </div>
                <div className="visible-xs-block">
                  <ul className="footer-mobile-links" style={{ padding: 16 }}>
                    {footerLinks.data.map((data, i) => (
                      <li key={i}>
                        <Link
                          className="btn btn-link primary-link dark"
                          to={data.link}
                        >
                          {data.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            <div className="footer-bottom-bar">
              <div className="container-fluid hidden-xs">
                <span>&copy; AutoLife {year}, All Rights Reserved</span>
                <ul>
                  {footerLinks.data.map((data, i) => (
                    <li key={i}>
                      <Link
                        to={data.link}
                        className="btn btn-link primary-link dark"
                      >
                        {data.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="visible-xs-block" style={{ fontSize: 10 }}>
                &copy; AutoLife {year}, All Rights Reserved
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  footerLayoutType: state.layout.footerLayout,
  headerFooterVisible: state.layout.headerFooterVisible
});

export default connect(mapStateToProps)(Footer);
