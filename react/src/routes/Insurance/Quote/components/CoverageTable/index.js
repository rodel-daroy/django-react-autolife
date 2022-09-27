import React from "react";
import CustomCoverage from "./CustomCoverage";
import {
  RowLabel,
  COMPREHENSIVE_DEDUCTIBLE,
  COLLISION_DEDUCTIBLE,
  LIABILITY_LIMIT,
  LOSS_OF_USE,
  NON_OWNED_AUTO,
  WAIVER_OF_DEPRECIATION,
  ACCIDENT_FORGIVENESS,
  ACCIDENT_BENEFITS
} from "./Rows";
import "./style.scss";

const coverageData = [
  {
    label: "Minimum",
    items: [
      { row: COMPREHENSIVE_DEDUCTIBLE, covered: true, value: "$0" },
      { row: COLLISION_DEDUCTIBLE, covered: true, value: "$0" },
      { row: LIABILITY_LIMIT, covered: true, value: "$1 million" },
      { row: LOSS_OF_USE, covered: false, value: "No coverage" },
      { row: NON_OWNED_AUTO, covered: false, value: "No coverage" },
      { row: WAIVER_OF_DEPRECIATION, covered: false, value: "No coverage" },
      { row: ACCIDENT_FORGIVENESS, covered: false, value: "No coverage" },
      { row: ACCIDENT_BENEFITS, covered: false, value: "No coverage" }
    ]
  },
  {
    label: "Essentials",
    items: [
      { row: COMPREHENSIVE_DEDUCTIBLE, covered: true, value: "$1000" },
      { row: COLLISION_DEDUCTIBLE, covered: true, value: "$1000" },
      { row: LIABILITY_LIMIT, covered: true, value: "$1 million" },
      { row: LOSS_OF_USE, covered: true, value: "Standard" },
      { row: NON_OWNED_AUTO, covered: true, value: "Standard" },
      { row: WAIVER_OF_DEPRECIATION, covered: true, value: "Standard" },
      { row: ACCIDENT_FORGIVENESS, covered: false, value: "No coverage" },
      { row: ACCIDENT_BENEFITS, covered: false, value: "No coverage" }
    ]
  },
  {
    label: "Enhanced",
    items: [
      { row: COMPREHENSIVE_DEDUCTIBLE, covered: true, value: "$500" },
      { row: COLLISION_DEDUCTIBLE, covered: true, value: "$500" },
      { row: LIABILITY_LIMIT, covered: true, value: "$2 million" },
      { row: LOSS_OF_USE, covered: true, value: "Standard" },
      { row: NON_OWNED_AUTO, covered: true, value: "Standard" },
      { row: WAIVER_OF_DEPRECIATION, covered: true, value: "Standard" },
      { row: ACCIDENT_FORGIVENESS, covered: true, value: "Standard" },
      { row: ACCIDENT_BENEFITS, covered: false, value: "No coverage" }
    ]
  }
];

export default ({ coverageSelected = 0 }) => {
  console.log(coverageSelected, "coverageSelected");
  if (coverageSelected == 3) return <CustomCoverage />;
  else {
    const coverage = coverageData[coverageSelected];

    return (
      <div className="coverageTable">
        <table className="table table-bordered">
          <tbody>
            {!coverage && <div>coverage {coverageSelected} not found</div>}
            {coverage &&
              coverage.items.map((item, index) => (
                <tr key={index}>
                  <th scope="row">
                    <RowLabel {...item.row} />
                  </th>
                  <td>
                    <div>
                      <span
                        className={`icon icon-${
                          item.covered ? "checkmark" : "x"
                        }`}
                      />{" "}
                      {item.value}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }
};
