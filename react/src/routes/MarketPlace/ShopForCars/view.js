import React, { Component } from "react";
import { connect } from "react-redux";
import FeatureSpot from "../../../components/common/FeatureSpot";
import { RouterBreadcrumbs } from "../../../components/Navigation/Breadcrumbs";
// import { addLoader, hideLoader } from 'store/loader';
// import { getLead } from 'store/common/MarketPlace';

import BrowseCars from "./components/BrowseCars";
import ShopCars from "./components/ShopCars";
import featureImage from "../../../styles/img/shopforcars/a-spot.jpg";
import ArticleMetaTags from "../../../components/common/ArticleMetaTags";
import ASpotBody from "../../../components/common/ASpotBody";
import { makeTileContainer } from "../../../components/containers/TileContainer";

const ConceptCarTileContainer = makeTileContainer("marketplace_concept_cars");

class ShopCarsView extends Component {
  static propTypes = {};

  // componentDidMount() {
  //   hideLoader();
  // }

  // componentWillUpdate() {
  //   addLoader();
  // }

  // componentDidUpdate() {
  //   hideLoader();
  // }
  // /*
  // fetchLeadData() {
  //   // this.props.getLead ()
  // }
  // */
  render() {
    return (
      <div className="home-page">
        <ArticleMetaTags title="Shop for cars" />

        <article className="page-width">
          <FeatureSpot
            images={featureImage}
            kind="image"
            short
            scrim="gradient"
          >
            <ASpotBody
              heading="Car shopping simplified"
              synopsis={
                <span>
                  Find your next car, get an instant insurance quote and connect
                  to a dealer, all&nbsp;in&nbsp;one&nbsp;place
                </span>
              }
            />
          </FeatureSpot>

          <div className="content-container">
            <div className="text-container">
              <RouterBreadcrumbs />
            </div>

            <div className="anchor" id="shop">
              <ShopCars />
            </div>

            <div className="anchor" id="browse">
              <BrowseCars />
            </div>

            <section className="page-section last">
              <header className="page-section-header">
                <div className="text-container horizontal-header">
                  <h3>Concept Cars</h3>
                  <p className="max-text-width">
                    See first looks, insider photos and reviews on some of the
                    top concepts cars of the future.
                  </p>
                </div>
              </header>
              <div
                className="page-section-content"
                style={{ paddingBottom: 0 }}
              >
                <ConceptCarTileContainer />
              </div>
            </section>
          </div>
        </article>
      </div>
    );
  }
}

const mapStateToProps = () => ({
  // leadData: state.marketPlace.leadData
});
const mapDispatchToProps = {
  // getLead,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShopCarsView);
