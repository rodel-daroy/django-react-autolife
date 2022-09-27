import React from "react";
import PropTypes from "prop-types";

const CarName = props => (
  <div className={`car-listing-name ${props.size}`}>
    <div className="car-listing-name-1">
      {props.kind === "complete" && `${props.year} `}
      {props.make}&nbsp;{props.model}&nbsp;
    </div>
    {(props.kind === "long" || props.kind === "complete") && (
      <div className="car-listing-name-2">
        {props.trim !== "-" ? props.trim : ""}&nbsp;
      </div>
    )}
  </div>
);

CarName.propTypes = {
  year: PropTypes.any,
  make: PropTypes.string,
  model: PropTypes.string,
  trim: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  kind: PropTypes.oneOf(["complete", "long", "short"])
};

CarName.defaultProps = {
  size: "small",
  kind: "long"
};

export default CarName;

export const getCarName = ({
  kind = "complete",
  year,
  make,
  model,
  trim
}) => {
  trim = trim !== "-" ? trim : "";

  switch (kind) {
    case "short":
      return `${make || ""} ${model || ""}`;
    case "long":
      return `${make || ""} ${model || ""} ${trim || ""}`;
    default:
      return `${year || ""} ${make || ""} ${model || ""} ${trim || ""}`;
  }
};
