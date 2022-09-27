import React from "react";
import ToolsRow from "./ToolsRow";
import { CBBTOOLS } from "config/constants";
import ToolsCarSelectorForm from "./ToolsCarSelectorForm";

export default ({ currentTool = CBBTOOLS.AVERAGEPRICE, selectCar }) => (
  <div>
    {currentTool === CBBTOOLS.AVERAGEPRICE && (
      <ToolsRow
        title="Average Asking Price"
        textContent="Whether you are buying or selling a vehicle, you want to be confident that the price is right. Everyday, Canadian Black Book tracks thousands of retail listings and provides you with the most up-to-date average asking price for similar vehicles. Before you set your list price or make an offer to purchase, use our tool and go in smarter."
        style={{ marginTop: "50px" }}
      >
        <ToolsCarSelectorForm form="averageAskingPrice" onSubmit={selectCar} />
      </ToolsRow>
    )}
    {currentTool === CBBTOOLS.FUTUREVALUE && (
      <ToolsRow
        title="Future Value"
        textContent="Most people don’t realize that depreciation is the single highest cost of vehicle ownership. Understanding how a vehicle has historically held its value can be helpful when assessing the cost of one vehicle over another. It is also helpful when determining at what point during the loan term you will be in an equity position."
        style={{ marginTop: "50px" }}
      >
        <ToolsCarSelectorForm form="futureValue" onSubmit={selectCar} />
      </ToolsRow>
    )}
    {currentTool === CBBTOOLS.TRADEIN && (
      <ToolsRow
        title="Trade-in Value"
        textContent="Shopping for a new car? Knowing the value of your current vehicle that you intend to trade is beneficial to know before you visit the dealership. Learning your vehicle’s current trade-in value provides you with a realistic expectation and helps you to set your budget."
        style={{ marginTop: "50px" }}
      >
        <ToolsCarSelectorForm form="tradeInValue" onSubmit={selectCar} />
      </ToolsRow>
    )}
  </div>
);
