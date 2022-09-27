import React from "react";
import PropTypes from "prop-types";
import RelatedArticles from "components/content/RelatedArticles";
import futureImage from "styles/img/marketplace/FutureValue-L.jpg";
import tradeInImage from "styles/img/marketplace/TradeInValue-P.jpg";
import averageImage from "styles/img/marketplace/AverageAskingPrice-P.jpg";
import recallImage from "../img/recall.jpg";
import { CBBTOOLS } from "config/constants";

const OtherTools = ({ currentTool }) => (
  <section className="page-section last" style={{ margin: "50px 0" }}>
    <header className="page-section-header">
      <h3>Other tools you may like</h3>
    </header>
    <div className="page-section-content">
      <RelatedArticles orientation="horizontal">
        {currentTool !== CBBTOOLS.AVERAGEPRICE && (
          <RelatedArticles.Article
            title="Average Asking Price"
            image={{ url: averageImage }}
            content="Find out the best price to get for your car"
            link="/market-place/tools/average-price"
          />
        )}
        {currentTool !== CBBTOOLS.TRADEIN && (
          <RelatedArticles.Article
            title="Trade-in Value"
            image={{ url: tradeInImage }}
            content="Find out the Black Book Value of your car"
            link="/market-place/tools/trade-in-value"
          />
        )}
        {currentTool !== CBBTOOLS.FUTUREVALUE && (
          <RelatedArticles.Article
            title="Future Value"
            image={{ url: futureImage }}
            content="Find out which cars hold their value best"
            link="/market-place/tools/future-value"
          />
        )}
        {currentTool !== CBBTOOLS.RECALL && (
          <RelatedArticles.Article
            title="Recall Check"
            image={{ url: recallImage }}
            content="Find the latest safety recalls for your vehicle"
            link="/market-place/tools/recall"
          />
        )}
      </RelatedArticles>
    </div>
  </section>
);

OtherTools.propTypes = {
  currentTool: PropTypes.oneOf(Object.values(CBBTOOLS))
};

export default OtherTools;
