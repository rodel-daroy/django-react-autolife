import React from "react";
import ArrowLabel from "../../../../../components/Forms/ArrowLabel";

const AveragePrice = ({ label, info }) => (
  <div className="resultsDetailsTopRow-Item">
    <div className="priceBox">
      <ArrowLabel
        color="blue"
        style={{ background: "red", marginRight: "50px" }}
      >
        {label}
      </ArrowLabel>{" "}
      <span className="priceBox-price">{info}</span>
    </div>
  </div>
);
export default AveragePrice;
