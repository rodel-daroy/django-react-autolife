import React from "react";
import { connect } from "react-redux";
import startCase from "lodash/startCase";
import pick from "lodash/pick";
import Spinner from "../../../../components/common/Spinner";

const formatValue = (value, defaultValue) => {
  if (typeof value === "string" && !value.charAt(0).match(/[0-9]/))
    return startCase(value);
  else return value || defaultValue;
};

const Spec = ({ label, value, defaultValue = "NA" }) => (
  <li>
    <div className="car-spec-label">{label}</div>
    <div className="car-spec-value">{formatValue(value, defaultValue)}</div>
  </li>
);

const renderSpecs = specs => (
  <div className="car-specs col-3">
    <ul>
      <Spec label="Engine" value={specs.engine_type} />
      <Spec label="Horsepower" value={specs.horse_power} />
      <Spec label="Torque" value={specs.torque} />
      <Spec label="RPM for Torque" value={specs.rpm_for_torque} />
      <Spec label="Transmission" value={specs.transmission} />
      <Spec label="Drive" value={specs.drive} />
      <Spec label="Speed" value={specs.speed} />
      <Spec label="Cargo Capacity" value={specs.cargo_or_seating} />
      <Spec label="Seating Capacity" value={specs.seating_capacity} />
      <Spec label="Fuel Type" value={specs.fuel_type} />
      <Spec
        label="Dimensions (L/W/H)"
        value={
          specs.overall_length
            ? `${specs.overall_length} / ${specs.height} / ${specs.width}mm`
            : null
        }
      />
      <Spec
        label="Wheelbase"
        value={specs.wheel_base ? `${specs.wheel_base}mm` : null}
      />
      <Spec label="Curb Weight" value={specs.curb_weight} />
      <Spec label="Navigation" value={specs.navigation} />
      <Spec
        label="Collision Warning System"
        value={specs.collision_warning_system}
      />
      <Spec label="Satellite Radio" value={specs.satellite_radio} />
      <Spec
        label="Fuel Economy Highway"
        value={
          specs.fuel_economy_hwy ? `${specs.fuel_economy_hwy}L / 100km` : null
        }
      />
      <Spec
        label="Fuel Economy City"
        value={
          specs.fuel_economy_city ? `${specs.fuel_economy_city}L / 100km` : null
        }
      />
    </ul>
  </div>
);

const CBBSpecificationTab = props => {
  const { carSpecs, loaded } = props;

  if (!loaded) {
    return (
      <div style={{ minHeight: 200, position: "relative" }}>
        <Spinner pulse color="lightgrey" scale={0.5} />
      </div>
    );
  }
  return renderSpecs(carSpecs.data || {});
};

function mapStateToProps(state) {
  return {
    carSpecs: state.MarketPlace.carSpecs
  };
}

export default connect(mapStateToProps)(CBBSpecificationTab);
