import React from "react";
import PropTypes from "prop-types";
import incentiveIcon from "styles/img/listings/incentive-small.svg";
import { formatCurrency } from "utils/format";
import pick from "lodash/pick";
import MSRP from "./MSRP";
import { CarPricePropTypes } from "./";

const CarPrice = props => {
  return (
    <div className={`car-listing-price ${props.className || ""}`}>
      {props.incentive && (
        <img
          className="car-listing-incentive"
          src={incentiveIcon}
          alt="Incentive"
          title="Incentive"
        />
      )}

      {!isNaN(props.totalPrice) && (
        <span>
          {`$${formatCurrency(props.totalPrice, false)}`}

          <MSRP
            tabIndex={props.tabIndex}
            {...pick(props, Object.keys(CarPricePropTypes))}
          />
        </span>
      )}
      {isNaN(props.totalPrice) && "NA"}
    </div>
  );
};

CarPrice.propTypes = {
  incentive: PropTypes.bool,
  ...CarPricePropTypes,
  className: PropTypes.string,
  tabIndex: PropTypes.number
};

export default CarPrice;
