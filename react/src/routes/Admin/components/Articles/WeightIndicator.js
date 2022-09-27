import React from "react";
import PropTypes from "prop-types";
import { between } from "airbnb-prop-types";
import range from "lodash/range";
import "./WeightIndicator.scss";

const MAX_VALUE = 10;

const WeightIndicator = ({ value, label }) => {
  const percent = Math.abs(value) / MAX_VALUE * 100;
  const negative = value < 0;

  return (
    <div className={`weight-indicator ${negative ? "negative" : "positive"}`}>
      <div className="weight-indicator-box">
        <div className="weight-indicator-bar-offset">
          <div 
            className="weight-indicator-bar"
            style={{
              width: `${percent}%`
            }}></div>
        </div>
        <div className="weight-indicator-bar-overlay">
          {range(0, MAX_VALUE * 2).map(i => (
            <div key={i}></div>
          ))}
        </div>
        <div className="weight-indicator-label">{label}</div>
      </div>
    </div>
  );
};

WeightIndicator.propTypes = {
  value: between({ gte: -MAX_VALUE, lte: MAX_VALUE }).isRequired,
  label: PropTypes.string.isRequired
};
 
export default WeightIndicator;