import React, { Component } from "react";
import CategoryFilter from "components/Listings/CategoryFilter";
import { connect } from "react-redux";
import Legal from "components/Listings/Legal";
import Media from "react-media";
import { mediaQuery } from "utils/style";
import { withRouter } from "react-router-dom";
import Spinner from "components/common/Spinner";
import CarDetailRightSection from "./CarDetailRightSection";
import OtherCarsSection from "./OtherCarsSection";
import { setInitialPageLoadedAction } from "redux/actions/layoutActions";
import { emptyData } from "redux/actions/marketPlaceActions";
import {
  getBreadcrumbs,
  getBackButton
} from "components/Listings";
import BrowseOverlayMenuButton from "components/Listings/BrowseOverlayMenuButton";
import ShareButton from "components/Listings/ShareButton";
import ArticleMetaTags from "components/common/ArticleMetaTags";
import { defaultCarImg } from "config/constants";
import { getCarName } from "components/Listings/CarName";

class BrowseCarDetailSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socialShareBtn: false
    };
  }

  componentDidMount() {
    const { setInitialPageLoadedAction } = this.props;
    setInitialPageLoadedAction();
  }

  showSocialShareButtons = () => {
    this.setState({
      socialShareBtn: true
    });
  };

  closeModal = () => {
    this.setState({
      socialShareBtn: false
    });
  };

  renderMobileTitle = () => {
    const { carDetailData } = this.props;

    if (carDetailData) {
      const categoryTitle = `${carDetailData.make || ""} ${carDetailData.category || ""}`;

      return (
        <div className="listing-mobile-title">
          <div className="subtitle">Currently Viewing:</div>
          <h1>{categoryTitle}</h1>
        </div>
      );
    } else return null;
  };

  renderHeader = mobile => {
    const {
      carDetailData,
      match: { params },
      categoriesDetail
    } = this.props;
    let name = "";
    if (carDetailData) {
      name = getCarName({
        ...carDetailData,

        bodyStyle: carDetailData.body_style,
        trim: carDetailData.trim_name,
        kind: "long"
      });
    }
    const url = window.location.href;

    const categories = (categoriesDetail && categoriesDetail.data) || [];

    let backLink = '/market-place/browse-cars/trim_id';
    if(categories.length > 0)
      backLink = `/market-place/browse-cars/${categories[0].slug}`;

    const breadcrumbs = [{ name: "Browse", link: backLink }, { name }];
    const carImage = carDetailData
      ? carDetailData.image_url
        ? carDetailData.image_url
        : defaultCarImg
      : "";

    if (mobile) {
      return (
        <div className="car-listing-header">
          {getBackButton({ backLink })}

          <div className="browse-mobile-header">
            {this.renderMobileTitle()}

            <div className="browse-mobile-nav">
              <BrowseOverlayMenuButton
                categorySlug={
                  carDetailData ? carDetailData.category_slug : null
                }
                make={carDetailData ? carDetailData.make : null}
              />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="car-listing-header">
          <div className="car-listing-breadcrumbs">
            {getBackButton({
              backLink: backLink,
              className: "hidden-sm hidden-md hidden-lg"
            })}
            {getBreadcrumbs({ 
              breadcrumbs, 
              className: "hidden-xs" 
            })}
          </div>
          <div className="car-listing-sort">
            <div style={{ textAlign: "right" }}>
              <div className="hidden-xs hidden-md hidden-lg">
                <BrowseOverlayMenuButton
                  categorySlug={
                    carDetailData ? carDetailData.category_slug : null
                  }
                  make={carDetailData ? carDetailData.make : null}
                />
              </div>
              <ShareButton
                url={url}
                imageUrl={carImage}
                text={carDetailData ? carDetailData.name : ""}
                className="last"
              />
            </div>
          </div>
        </div>
      );
    }
  };

  render() {
    const { carDetailData, loadingBrowseCarDetail, onUpdated } = this.props;

    return (
      <div ref={ref => (this._container = ref)} className="browse-car-detail">
        <ArticleMetaTags title="Browse" />

        <article className="page-width">
          <div className="content-container">
            <div className="text-container">
              <div className="offset-header">
                <div>
                  <Media query={mediaQuery("xs")}>{this.renderHeader}</Media>

                  <div className="filter-listing-container">
                    <div className="filter-listing-inner">
                      <Media query={mediaQuery("md lg")}>
                        {matches =>
                          matches ? (
                            <div className="filter-container">
                              <CategoryFilter
                                categorySlug={
                                  carDetailData
                                    ? carDetailData.category_slug
                                    : null
                                }
                                make={carDetailData ? carDetailData.make : null}
                              />
                            </div>
                          ) : null
                        }
                      </Media>
                      <div className="listing-container">
                        {!loadingBrowseCarDetail && (
                          <div>
                            <CarDetailRightSection onUpdated={onUpdated} />
                            <OtherCarsSection onUpdated={onUpdated} />
                          </div>
                        )}

                        {loadingBrowseCarDetail && (
                          <div style={{ minHeight: 500 }}>
                            <Spinner pulse color="lightgrey" scale={0.5} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Legal />
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    carDetailData: state.MarketPlace.carDetailData,
    initialPageLoaded: state.layout.initialPageLoaded,
    loadingBrowseCarDetail: state.MarketPlace.loadingBrowseCarDetail,
    categoriesDetail: state.MarketPlace.categoriesDetail
  };
}

const mapDispatchToProps = {
  setInitialPageLoadedAction,
  emptyData
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BrowseCarDetailSection)
);
