import React from "react";
import { connect } from "react-redux";
import StartOverButton from "./../../components/StartOverButton";
import FindNewButton from "./../../components/FindNewButton";
import AvrgOdometerPriceSection from "./AvrgOdometerPriceSection";
import VehicleInfo from "./../../components/VehicleInfo";
import Disclaimer from "../../components/Disclaimer";
import { CBBTOOLS } from "../../../../../config/constants";

const AvrgResults = ({ postAvgPriceData, resultsData, handleStartOver }) => {
  const { make, model, year, current_kilometers, addOns } = resultsData;
  const infoArray = [
    { title: "Make", value: make },
    { title: "Model", value: model },
    { title: "Year", value: year },
    // { title: 'Kilometers', value: `${current_kilometers} km` },
    {
      title: "Add-ons",
      value: (
        <ul>
          {addOns.map(a => (
            <li>{a.name}</li>
          ))}
        </ul>
      )
    }
  ];
  return (
    <div className="animated fadeIn">
      <div className="resultsContainer">
        <div className="resultsContainer-item">
          <div className="resultsBox">
            <AvrgOdometerPriceSection postAvgPriceData={postAvgPriceData} />
            <VehicleInfo dataArray={infoArray} />
          </div>
        </div>
      </div>

      <Disclaimer currentTool={CBBTOOLS.AVERAGEPRICE} />

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
  postAvgPriceData: state.carWorth.postAvgPriceData
});

export default connect(mapStateToProps)(AvrgResults);
