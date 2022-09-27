import React, { Component } from "react";
import { connect } from "react-redux";
import sortBy from "lodash/sortBy";
import map from "lodash/map";
import VehicleInfo from "./../../components/VehicleInfo";
import StartOverButton from "./../../components/StartOverButton";
import FindNewButton from "./../../components/FindNewButton";
import FutureValueGraph from "./FutureValueGraph";
import Disclaimer from "../../components/Disclaimer";
import { CBBTOOLS } from "../../../../../config/constants";

class FutureValueResults extends Component {
  chartData = (xAxesData, yAxesData) => ({
    labels: xAxesData,
    datasets: [
      {
        // label: 'My Second dataset',
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "#ED222C", // '#4876dc',
        pointColor: "#ED222C", // '#4876dc',
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: yAxesData
      }
    ]
  });

  render() {
    const { postFutureValData, resultsData, handleStartOver } = this.props;
    const {
      make,
      model,
      year,
      current_kilometers,
      addOns,
      deducts
    } = resultsData;
    console.log(resultsData, "res");
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
    const sortedGraphPoint =
      postFutureValData && postFutureValData.data
        ? sortBy(postFutureValData.data.values.future_values, "year")
        : "";
    console.log(sortedGraphPoint, "SGP");
    console.log(postFutureValData, "sort");
    const yearPoint = sortedGraphPoint ? map(sortedGraphPoint, "year") : "";
    console.log(yearPoint, "yearP");
    const pricePoint = sortedGraphPoint ? map(sortedGraphPoint, "price") : "";
    console.log(pricePoint, "priceP");
    const graphData = this.chartData(yearPoint, pricePoint);

    console.log(graphData, "graph");

    return (
      <div className="animated fadeIn">
        {postFutureValData &&
          postFutureValData.data &&
          postFutureValData.data.values.future_values && (
            <div style={{ margin: "50px 0 0 0" }}>
              <FutureValueGraph
                postFutureValData={postFutureValData.data}
                graphData={graphData}
              />
            </div>
          )}
        <div className="resultsContainer">
          <div className="resultsContainer-item">
            <div className="resultsBox">
              <VehicleInfo dataArray={infoArray} />
            </div>
          </div>
        </div>
        <Disclaimer currentTool={CBBTOOLS.FUTUREVALUE} />

        <StartOverButton onClick={handleStartOver} />
        <br />
        <FindNewButton
          model={resultsData.model}
          year={resultsData.year}
          make={resultsData.make}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  postFutureValData: state.carWorth.postFutureValData
});

export default connect(mapStateToProps)(FutureValueResults);
