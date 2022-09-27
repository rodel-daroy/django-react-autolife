import React from "react";
import PrimaryButton from "../../../../components/Forms/PrimaryButton";

export default ({ model, year, make }) => {
  // eslint-disable-line
  const linkTo = "/shopping"; // `/shopping/vehicle-search/${model}/${year}/${make}`
  return (
    <PrimaryButton link={linkTo} style={{ margin: "30px 0 30px 0" }}>
      Browse New Vehicles <span className="icon icon-angle-right" />
    </PrimaryButton>
  );
};
