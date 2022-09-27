import React, { Component } from "react";
import PropTypes from "prop-types";
import PriceTag from "./PriceTag";
import MSRP from "./MSRP";
import { CarPricePropTypes } from "./";
import { formatCurrency } from "../../utils/format";

const CarPriceTag = props => {
  if (!isNaN(props.price))
    return (
      <PriceTag className={props.className}>
        <MSRP {...props} />

        {props.totalPrice
          ? `$${formatCurrency(props.totalPrice, false)}`
          : "NA"}
      </PriceTag>
    );
  else return <PriceTag className={props.className}>NA</PriceTag>;
};

CarPriceTag.propTypes = {
  ...CarPricePropTypes,
  className: PropTypes.string
};

export default CarPriceTag;
