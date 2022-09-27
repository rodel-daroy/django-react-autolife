import React from "react";
import { connect } from "react-redux";
import { formatInt } from "../../../../../utils/format";
import FindNewButton from "./../../components/FindNewButton";
import StartOverButton from "./../../components/StartOverButton";
import VehicleInfo from "./../../components/VehicleInfo";
import PriceInfo from "./PriceInfo";
import Disclaimer from "../../components/Disclaimer";
import { CBBTOOLS } from "../../../../../config/constants";

const TradeInResults = ({ postTradeData, resultsData, handleStartOver }) => {
  const {
    make,
    model,
    year,
    current_kilometers,
    addOns,
    deducts
  } = resultsData;
  const infoArray = [
    { title: "Make", value: make },
    { title: "Model", value: model },
    { title: "Year", value: year },
    { title: "Kilometers", value: `${current_kilometers} km` },
    {
      title: "Add-ons",
      value: (
        <ul>
          {addOns.map(a => (
            <li key={a.option_code}>{a.name}</li>
          ))}
        </ul>
      )
    },
    {
      title: "Deducts",
      value: (
        <ul>
          {deducts.map(d => (
            <li key={d.option_code}>{d.name}</li>
          ))}
        </ul>
      )
    }
  ];
  return (
    <div className="animated fadeIn">
      <div className="resultsBox">
        <div className="resultsDetailsTopRow">
          <div className="resultsDetailsTopRow-Item">
            <PriceInfo
              priceLabel="Low Price"
              price={
                postTradeData && postTradeData.data
                  ? formatInt(postTradeData.data.values.trade_in_low)
                  : ""
              }
            />
          </div>
          <div className="resultsDetailsTopRow-Item">
            <PriceInfo
              isLow={false}
              priceLabel="High Price"
              price={
                postTradeData && postTradeData.data
                  ? formatInt(postTradeData.data.values.trade_in_high)
                  : ""
              }
            />
          </div>
        </div>
        <VehicleInfo dataArray={infoArray} />
      </div>

      <Disclaimer currentTool={CBBTOOLS.TRADEIN} />

      <StartOverButton onClick={handleStartOver} />
      <br />
      <FindNewButton
        model={resultsData.model}
        year={resultsData.year}
        make={resultsData.make}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  postTradeData: state.carWorth.postTradeData
});

export default connect(mapStateToProps)(TradeInResults);
