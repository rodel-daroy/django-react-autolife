import React, { Component } from "react";
import CategoryFilter from "components/Listings/CategoryFilter";
import BrowseCarListing from "./BrowseCarListing";
import SortCarsListByPrice from "components/Listings/SortCarsListByPrice";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import FeatureSpot from "components/common/FeatureSpot";
import featureImage from "styles/img/shopforcars/a-spot.jpg";
import sortBy from "lodash/sortBy";
import get from "lodash/get";
import { capitalise } from "utils";
import Media from "react-media";
import { mediaQuery } from "utils/style";
import { getBreadcrumbs } from "components/Listings";
import BrowseOverlayMenuButton from "components/Listings/BrowseOverlayMenuButton";
import Legal from "components/Listings/Legal";
import ArticleMetaTags from "components/common/ArticleMetaTags";
import ASpotBody from "components/common/ASpotBody";
import {
  getBrowseCategoryData,
  getCategoriesDetail,
  getAllVehicleData
} from "redux/actions/marketPlaceActions";
import isEqual from "lodash/isEqual";
import reloadForUser from "components/Decorators/reloadForUser";
import { sortByPrice } from "components/Listings";

class MarketPlaceBrowseView extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      carListing: [],
      loaded: true,
      heading: ""
    };
  }

  loadCars = () => {
    const {
      match: { params },
      getAllVehicleData,
      getBrowseCategoryData,
      getCategoriesDetail,
      categoriesDetail
    } = this.props;
    const token = get(this.props, "user.authUser.accessToken");

    this.setState({
      loaded: false
    });

    if (params.id === "trim_id") {
      getAllVehicleData(false, token).then(data => {
        this.setState({
          loaded: true
        });
      });
    } else {
      getBrowseCategoryData(
        params.id,
        params.subcategory_id,
        false,
        token
      ).then(data => {
        this.setState({
          loaded: true
        });
      });
    }

    if (!categoriesDetail) getCategoriesDetail(null, token);
  };

  componentDidMount() {
    this.loadCars();
    this.updateTitle();
  }

  componentDidUpdate(prevProps) {
    const {
      match: { params },
      categoriesData,
      categoriesDetail
    } = this.props;

    const paramsEqual = isEqual(params, prevProps.match.params);

    if (!paramsEqual) {
      this.loadCars();
    }

    if (
      !paramsEqual ||
      categoriesDetail !== prevProps.categoriesDetail
    ) {
      this.updateTitle();
    }

    if (categoriesData !== prevProps.categoriesData) {
      console.log(categoriesData, "categories");
      const { sort } = this.state;

      this.sort(categoriesData && categoriesData.data.slice(), sort);
    }
  }

  // componentWillUpdate() {
  //   const { addLoader } = this.props;
  //   addLoader();
  // }

  sort = (listing, sort) => {
    if (sort)
      listing = sortByPrice(listing, sort.value);
    else
      listing = sortBy(listing, ["name"]);

    this.setState({
      carListing: listing
    });

    return listing;
  };

  sortCarsListByPrice = sort => {
    this.sort(this.state.carListing.slice(), sort);

    this.setState({
      sort
    });
  };

  handleUpdated = () => {
    const {
      match: { params },
      getBrowseCategoryData,
      getAllVehicleData
    } = this.props;
    const token = get(this.props, "user.authUser.accessToken");

    if (params.id === "trim_id") {
      getAllVehicleData(false, token);
    } else {
      getBrowseCategoryData(params.id, null, false, token);
    }
  };

  updateTitle = () => {
    const {
      categoriesDetail,
      match: { params }
    } = this.props;

    if (categoriesDetail) {
      if (params.id !== "trim_id") {
        const category = categoriesDetail.data.find(
          category => category.slug === params.id
        );

        let subCategoryName = "";
        if (params.subcategory_id) {
          const subCategory =
            category &&
            category.sub_categories.find(
              subCategory =>
                // eslint-disable-next-line eqeqeq
                subCategory.sub_category_id == params.subcategory_id
            );

          if (subCategory) subCategoryName = subCategory.name + " ";
        }

        const categoryTitle = `${subCategoryName}${category.name}`;

        this.setState({
          categoryTitle,
          heading: `${categoryTitle} listing`
        });
      } else
        this.setState({
          categoryTitle: "All Cars",
          heading: "All Cars Listing"
        });
    }
  };

  renderMobileTitle = () => {
    const { categoryTitle } = this.state;

    return (
      <div className="listing-mobile-title">
        <div className="subtitle">Currently Viewing:</div>
        <h1>{categoryTitle}</h1>
      </div>
    );
  };

  renderHeader = mobile => {
    const { heading } = this.state;
    const { categoriesDetail } = this.props;

    const categories = (categoriesDetail && categoriesDetail.data) || [];

    let browseAllLink = '/market-place/browse-cars/trim_id';
    if(categories.length > 0)
      browseAllLink = `/market-place/browse-cars/${categories[0].slug}`;

    if (mobile) {
      return (
        <div className="browse-mobile-header">
          {this.renderMobileTitle()}

          <div className="browse-mobile-nav">
            <BrowseOverlayMenuButton />
            <SortCarsListByPrice onChange={this.sortCarsListByPrice} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="car-listing-header">
          <div className="car-listing-breadcrumbs">
            {getBreadcrumbs({
              breadcrumbs: [
                {
                  name: 'Browse',
                  link: browseAllLink
                },
                {
                  name: capitalise(heading)
                }
              ]
            })}
          </div>
          <div className="car-listing-sort">
            <div>
              <div
                className="hidden-xs hidden-md hidden-lg"
                style={{ textAlign: "right" }}
              >
                <BrowseOverlayMenuButton />
              </div>
              <SortCarsListByPrice onChange={this.sortCarsListByPrice} />
            </div>
          </div>
        </div>
      );
    }
  };

  render() {
    const { carListing, heading } = this.state;

    return (
      <div className="home-page">
        <ArticleMetaTags title="Browse" />

        <article className="page-width">
          <Media query={mediaQuery("sm md lg")}>
            {matches =>
              matches && (
                <FeatureSpot images={featureImage} kind="image" short>
                  <ASpotBody
                    heading={heading}
                    synopsis={<span>Some of our favourites from the <u>2019</u> Canadian International Autoshow</span>}
                  />
                </FeatureSpot>
              )
            }
          </Media>

          <div className="content-container">
            <div className="offset-header hidden-sm hidden-md hidden-lg" />

            <div className="text-container">
              <Media query={mediaQuery("xs")}>{this.renderHeader}</Media>

              <div className="filter-listing-container">
                <div className="filter-listing-inner">
                  <Media query={mediaQuery("md lg")}>
                    {matches =>
                      matches ? (
                        <div className="filter-container">
                          <CategoryFilter />
                        </div>
                      ) : null
                    }
                  </Media>
                  <div className="listing-container">
                    <BrowseCarListing
                      onUpdated={this.handleUpdated}
                      categoriesData={carListing}
                      loaded={this.state.loaded}
                      params={this.props.params}
                      router={this.props.router}
                    />
                  </div>
                </div>
              </div>

              <Legal />
            </div>
          </div>
        </article>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  categoriesData: state.MarketPlace.categoriesData,
  categoriesDetail: state.MarketPlace.categoriesDetail,
  user: state.user,
  browseData: state.MarketPlace.browseData
});

const mapDispatchToProps = {
  getBrowseCategoryData,
  getCategoriesDetail,
  getAllVehicleData
};

export default reloadForUser(withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MarketPlaceBrowseView)
));
