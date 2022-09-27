import React from "react";
import { Link } from "react-router-dom";

const Terms = props => (
  <section className="legal-area">
    <p>
      Information presented is provided by Canadian Black Book Inc. and is for
      your reference and information purposes only. Please click the link for
      complete Canadian Black Book Terms & Conditions:
    </p>

    <Link
      className="primary-link"
      to="/content/cbb-terms-and-conditions"
      target="_blank"
    >
      CANADIAN BLACK BOOK TERMS & CONDITIONS
    </Link>
  </section>
);

export default Terms;
