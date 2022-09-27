import React from "react"
import classnames from "classnames"
import InsurancePhone from "./InsurancePhone";
import "./style.scss";

const HelpBox = ({ className = "", title = "Need Help?", body }) => (
  <div className={classnames("helpBox", className)}>
    <div className="helpBox-content">
      <div className="helpBox-title">{title}</div>
      <InsurancePhone />
      {body && <p>{body}</p>}
    </div>
  </div>
);

export default HelpBox;

