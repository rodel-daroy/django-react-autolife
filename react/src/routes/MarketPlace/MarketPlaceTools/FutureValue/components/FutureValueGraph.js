import React from "react";
import Graph from "../../../../../components/common/Graph";

const FutureValueGraph = ({ graphData }) => (
  <div className="avrg_price_graph">
    <Graph data={graphData} />
    <div className="text-center verticaltext_content">Price</div>
    <div className="text-center horizontaltext_content">Year</div>
  </div>
);
export default FutureValueGraph;
