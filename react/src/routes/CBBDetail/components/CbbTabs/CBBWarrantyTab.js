import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { formatInt } from "../../../../utils/format";
import get from "lodash/get";

const formatWarranty = value => {
  const fraction = (value || "").split("/");

  if (fraction.length > 1) {
    let first = parseInt(fraction[0]);
    let last = parseInt(fraction[1]);

    if (!isNaN(first)) first = formatInt(first);
    else first = fraction[0];

    if (!isNaN(last)) last = formatInt(last);
    else last = fraction[1];

    return `${first} / ${last} (months/km)`;
  }

  return value;
};

const CBBWarrantyTab = props => {
  const carDetails = get(props, "car_details.data.warranty", {});

  return (
    <div className="car-specs col-2">
      <ul>
        <li>
          <div className="car-spec-label">Basic</div>
          <div className="car-spec-value">
            {formatWarranty(carDetails.warranty)}
          </div>
        </li>
        <li>
          <div className="car-spec-label">Powertrain</div>
          <div className="car-spec-value">
            {formatWarranty(carDetails.warranty_powertrain)}
          </div>
        </li>
        <li>
          <div className="car-spec-label">Anti-corrosion</div>
          <div className="car-spec-value">
            {formatWarranty(carDetails.warranty_anti_corrosion)}
          </div>
        </li>
        <li>
          <div className="car-spec-label">Roadside assistance</div>
          <div className="car-spec-value">
            {formatWarranty(carDetails.roadside_assistance)}
          </div>
        </li>
      </ul>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    car_details: state.MarketPlace.carDetails
  };
}

export default connect(mapStateToProps)(CBBWarrantyTab);
