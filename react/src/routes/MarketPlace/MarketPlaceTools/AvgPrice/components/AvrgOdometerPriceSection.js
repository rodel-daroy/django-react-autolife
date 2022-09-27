import React from "react";
import map from "lodash/map";
import AveragePrice from "./AveragePrice";
import { formatInt } from "../../../../../utils/format";

const AvrgOdometerPriceSection = ({ postAvgPriceData }) => {
  const graphPoint = postAvgPriceData
    ? map(postAvgPriceData && postAvgPriceData.data[0].values.points, "point")
    : "";
  const value = graphPoint ? map(graphPoint, "price") : "";
  const MaxValue = Math.max(...value);
  const MinValue = Math.min(...value);
  return (
    <div className="resultsDetailsTopRow">
      <AveragePrice
        label="Average Asking Price"
        info={
          postAvgPriceData
            ? postAvgPriceData &&
              postAvgPriceData.data[0].values.averageAskingPrice
              ? `$ ${formatInt(postAvgPriceData[0].values.averageAskingPrice)}`
              : "NA"
            : ""
        }
      />
      <AveragePrice
        label="Average Odometer"
        info={
          postAvgPriceData
            ? postAvgPriceData &&
              postAvgPriceData.data[0].values.averageOdometer &&
              postAvgPriceData &&
              postAvgPriceData.data[0].values.averageOdometer > 0
              ? `${formatInt(postAvgPriceData[0].values.averageOdometer)} km`
              : "NA"
            : ""
        }
      />
      {/*
      <AveragePrice
        label="Max Value"
        info={postAvgPriceData ?
        (postAvgPriceData[0].values.averageOdometer && postAvgPriceData[0].values.averageOdometer > 0 ? `$ ${formatInt(MaxValue)}` : 'NA')
        : ''}
      />
      <AveragePrice
        label="Min Value"
        info={postAvgPriceData ?
        (postAvgPriceData[0].values.averageOdometer && postAvgPriceData[0].values.averageOdometer > 0 ? `$ ${formatInt(MinValue)}` : 'NA')
        : ''}
      />
        */}
    </div>
  );
};
export default AvrgOdometerPriceSection;
