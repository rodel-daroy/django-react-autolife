import React from "react";
import CBBOtherVehiclesAndCompetitor from "./CBBOtherVehiclesAndCompetitor";
import { withRouter } from "react-router-dom";

const CBBOtherVehicleSection = props => {
  const {
    otherCars,
    car_details,
    params,
    postalCode,
    onUpdated
  } = props;

  const make = car_details && car_details.data ? car_details.data.make : "";

  return (
    <div>
      {otherCars &&
        otherCars.data &&
        otherCars.data.hasOwnProperty("similar") && (
          <CBBOtherVehiclesAndCompetitor
            otherCars={otherCars && otherCars.data && otherCars.data.similar}
            headline={`More vehicles from ${make}`}
            params={params}
            postalCode={postalCode}
            onUpdated={onUpdated}
          />
        )}
      {otherCars &&
        otherCars.data &&
        otherCars.data.hasOwnProperty("competitor") && (
          <CBBOtherVehiclesAndCompetitor
            otherCars={otherCars && otherCars.data && otherCars.data.competitor}
            headline="Similar vehicles you might like"
            params={params}
            postalCode={postalCode}
            onUpdated={onUpdated}
          />
        )}
    </div>
  );
};

export default withRouter(CBBOtherVehicleSection);
