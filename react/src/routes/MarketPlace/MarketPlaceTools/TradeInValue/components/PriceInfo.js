import React from "react";
import ArrowLabel from "../../../../../components/Forms/ArrowLabel";

const PriceInfo = ({ priceLabel, price, isLow = true }) => (
  <div>
    <div className="priceBox">
      <ArrowLabel color={isLow ? "green" : "red"}>
        <span
          className={`icon ${
            isLow ? "icon-arrow-right-down" : "icon-arrow-right-up"
          }`}
        />{" "}
        {priceLabel}
      </ArrowLabel>

      <span className="priceBox-price">${price}</span>
    </div>
  </div>
);
export default PriceInfo;
