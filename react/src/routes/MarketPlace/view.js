import React, { Component } from "react";
import { RouterBreadcrumbs } from "components/Navigation/Breadcrumbs";
import FeatureSpot from "components/common/FeatureSpot";
import TileView from "components/Tiles/TileView";
import Tile from "components/Tiles/Tile";
import TileContent from "components/Tiles/TileContent";
import TileSlot from "components/Tiles/TileSlot";
import ASpotBody from "components/common/ASpotBody";
import featureImage from "styles/img/marketplace/a-spot.jpg";
import ArticleMetaTags from "components/common/ArticleMetaTags";
import future from "styles/img/marketplace/FutureValue-L.jpg";
import tradeIn from "styles/img/marketplace/TradeInValue-P.jpg";
import average from "styles/img/marketplace/AverageAskingPrice-P.jpg";
import recall from "./MarketPlaceTools/img/recall.jpg";
import Tout from "components/common/Tout";
import favouriteModels from "./img/favourite-models-2019.png";
import threecars from "styles/img/marketplace/touts/3cars.png";
import { makeTileContainer } from "components/containers/TileContainer";
import "./style.scss";

const ArticleTileContainer = makeTileContainer("marketplace_articles");

class MarketPlaceView extends Component {
  render() {
    return (
      <div className="marketplace-page">
        <ArticleMetaTags title="Marketplace" />

        <div className="page-width">
          <FeatureSpot
            images={featureImage}
            kind="image"
            short
            scrim="gradient"
          >
            <ASpotBody
              heading="Explore. Compare. Connect."
              synopsis="Access the latest tools to simplify your car shopping experience"
            />
          </FeatureSpot>

          <div className="content-container">
            <div className="text-container">
              <RouterBreadcrumbs />
            </div>

            <section className="page-section">
              <header className="page-section-header">
                <div className="text-container horizontal-header">
                  <h3>Tools</h3>
                  <p className="max-text-width">
                    Look up the current value of your trade-in, the future value
                    of the car you’re interested in, or the average asking price
                    for a vehicle you intend to sell.
                  </p>
                </div>
              </header>
              <div className="page-section-content">
                <TileView>
                  <TileSlot size="A">
                    <Tile
                      imageUrl={average}
                      to="/market-place/tools/average-price"
                    >
                      <TileContent
                        title="Average Asking Price"
                        kind="A"
                        text="Find out the best price to get for your car"
                        buttonText="Let's start"
                      />
                    </Tile>
                  </TileSlot>
                  <TileSlot size="A">
                    <Tile
                      imageUrl={tradeIn}
                      to="/market-place/tools/trade-in-value"
                    >
                      <TileContent
                        title="Trade-in Value"
                        kind="A"
                        text="Find out the Black Book Value of your car"
                        buttonText="Find out"
                      />
                    </Tile>
                  </TileSlot>
                  <TileSlot size="A">
                    <Tile
                      imageUrl={future}
                      to="/market-place/tools/future-value"
                    >
                      <TileContent
                        title="Future Value"
                        kind="A"
                        text="Find out which cars hold their value best"
                        buttonText="Let's go"
                      />
                    </Tile>
                  </TileSlot>
                  <TileSlot size="A">
                    <Tile
                      imageUrl={recall}
                      to="/market-place/tools/recall"
                    >
                      <TileContent
                        title="Recall Check"
                        kind="A"
                        text="Find the latest safety recalls for your vehicle"
                        buttonText="Let's go"
                      />
                    </Tile>
                  </TileSlot>
                </TileView>
              </div>
            </section>

            <section className="page-section">
              <header className="page-section-header">
                <div className="text-container horizontal-header">
                  <h3>Articles</h3>
                  <p className="max-text-width">
                    Connect to information, resources and experiences that have
                    the most meaning to you.
                  </p>
                </div>
              </header>
              <div className="page-section-content">
                <ArticleTileContainer />
              </div>
            </section>

            <Tout
              heading={(
                <span>Our Favourite Models of <span className="marketplace-page-year-tout">2019</span></span>
              )}
              image={favouriteModels}
              buttonText="Browse Vehicles"
              link="/shopping#browse"
            >
              <p>
                Whether you’re looking to switch to an electric car or fulfill
                that dream of buying a sports car, why not take a look and see
                which one is the perfect fit.
              </p>
            </Tout>

            <Tout
              heading={
                <span>
                  Looking for a specific vehicle? <br />
                  We have thousands
                </span>
              }
              image={threecars}
              buttonText="Start My Search"
              link="/shopping#shop"
            >
              <p>
                Find any make or model available in Canada. Search for
                incentives and find a dealer nearby when you’re ready to talk.
              </p>
            </Tout>
          </div>
        </div>
      </div>
    );
  }
}

export default MarketPlaceView;

MarketPlaceView.propTypes = {};
