import React from "react";
import {
  CBBTOOLS,
  TRADE_IN_TEXT,
  TRADE_IN_HIGH,
  TRADE_IN_LOW
} from "../../../../config/constants";

export default ({ currentTool = CBBTOOLS.AVERAGEPRICE }) => (
  <section className="page-section disclaimer">
    {currentTool === CBBTOOLS.AVERAGEPRICE && (
      <div>
        <header className="page-section-header">
          <h3>Understanding Average Asking Price</h3>
        </header>
        <div className="page-section-content">
          <p>
            The average asking price is based on Canadian Black Book's research
            of similar vehicles, this value is a guideline for what you should
            expect to find as the price asked by the seller. Actual asking price
            will vary to reflect the vehicle's individual characteristics.
          </p>
        </div>
      </div>
    )}
    {currentTool === CBBTOOLS.FUTUREVALUE && (
      <div>
        <header className="page-section-header">
          <h3>Understanding Future Value</h3>
        </header>
        <div className="page-section-content">
          <p>
            The future value is presented as a guideline and is an estimate
            only. Actual values may vary depending on several different factors
            including the condition of the car, number of accidents, and many
            other factors.
          </p>
        </div>
      </div>
    )}
    {currentTool === CBBTOOLS.TRADEIN && (
      <div>
        <header className="page-section-header">
          <h3>Understanding the Trade-in value</h3>
        </header>
        <div className="page-section-content">
          <p>{TRADE_IN_TEXT}</p>
          <div>
            <h4>
              Trade-in-value - High{" "}
              <span className="icon icon-arrow-right-up" />
            </h4>
            <p>{TRADE_IN_HIGH}</p>
          </div>
          <div>
            <h4>
              Trade-in-value - Low{" "}
              <span className="icon icon-arrow-right-down" />
            </h4>
            <p>{TRADE_IN_LOW}</p>
          </div>
        </div>
      </div>
    )}
  </section>
);
