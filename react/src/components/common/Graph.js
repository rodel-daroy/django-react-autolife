import React from "react";
import { Line as LineChart } from "react-chartjs/";
const options = {
  pointDot: true,
  pointDotRadius: 4,
  pointDotStrokeWidth: 1,
  pointHitDetectionRadius: 20,
  datasetStroke: true,
  datasetStrokeWidth: 2
};
export default class Graph extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data } = this.props;
    console.log(data, "graphdata");
    return <LineChart data={data} options={options} width="600" height="400" />;
  }
}
