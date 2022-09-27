import React from 'react';

const VehicleInfo = ({ dataArray = [] }) => (
  <div className="resultsDetailsBottomRow">
    {dataArray.map((item, i) => (
      <div key={i} className="resultsDetailsBottomRow-Item">
        <div className="resultsDetailsBottomRow-Title">{item.title}</div>
        { item.value }
      </div>))
     }
  </div>
);
export default VehicleInfo;
