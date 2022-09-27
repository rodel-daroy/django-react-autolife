import React, { Component } from 'react';
import ShopCarsForm from 'components/Listings/ShopCarsForm';
import { connect } from 'react-redux';
import SortCarsListByPrice from 'components/Listings/SortCarsListByPrice';
import ChangePostalCode from 'components/Listings/ChangePostalCode';
import CarListingTile from 'components/Listings/CarListingTile';
import CarListings from 'components/Listings/CarListings';
import IncentivesSection from 'components/Listings/IncentivesSection';
import get from 'lodash/get';
import Legal from 'components/Listings/Legal';
import { getStats, getBreadcrumbs, getCarPrice } from 'components/Listings';
import Media from 'react-media';
import { mediaQuery } from 'utils/style';
import Spinner from 'components/common/Spinner';
import { NO_CARS_AVAILABLE } from 'config/constants';
import {
  postSearch,
  getCarDetails,
  setIncentivePostalCode,
  setInsurancePostalCode
} from 'redux/actions/marketPlaceActions';
import { getProfile } from 'redux/actions/userActions';
import ArticleMetaTags from 'components/common/ArticleMetaTags';
import isEqual from 'lodash/isEqual';
import reloadForUser from 'components/Decorators/reloadForUser';
import { sortByPrice } from 'components/Listings';

class CBBListingView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemsToShow: 9,
      carListing: [],
      loaded: true,
      mobileSearchForm: false
    };
    this.loadSuccess = true;
  }

  loadCars() {
    const {
      incentivePostalCode,
      match: { params }
    } = this.props;
    const token = get(this.props, 'user.authUser.accessToken');

    this.setState({
      loaded: false
    });

    if (params) {
      const values = {
        ...params,

        postal_code: incentivePostalCode
      };

      this.props.postSearch(values, token, false).then(data => {
        if (data.status === 200) {
          this.setState({
            loaded: true
          });
        }
      });
    }
  }

  componentDidMount() {
    this.loadCars();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      carListing: nextProps.searchData && nextProps.searchData.data
    });

    if (
      nextProps.searchData &&
      this.props.searchData &&
      nextProps.searchData.data.results !== this.props.searchData.data.results
    ) {
      this.setState({
        mobileSearchForm: false
      });
    }
  }

  componentDidUpdate(prevProps) {
    const {
      match: { params }
    } = this.props;

    if (!isEqual(params, prevProps.match.params)) this.loadCars();

    if (
      this.props.searchData &&
      this.props.searchData.data &&
      this.loadSuccess
    ) {
      this.setState({
        carListing: this.props.searchData.data
      });
      this.loadSuccess = false;
    }
  }

  getCarsToShow = items => {
    this.setState({
      itemsToShow: items
    });
  };

  showMore = () => {
    if (this.state.itemsToShow <= this.state.cars.length) {
      this.setState({ itemsToShow: this.state.itemsToShow + 3 }, () => {
        this.getCarsToShow(this.state.itemsToShow, true);
      });
    } else {
      this.setState({ itemsToShow: 9 }, () => {
        this.getCarsToShow(this.state.itemsToShow, false);
      });
    }
  };

  getCarsSpecificDetails = (trim_id, body_style_id, color_code) => {
    const { history } = this.props;
    // console.log(color_code, 'colorrrrr');
    history.push(
      `/shopping/vehicle-details/${trim_id}/${body_style_id}${
        color_code !== null || undefined ? `/${color_code}` : ''
      }`
    );
  };

  showLoadingScreen = bool => {
    this.setState({
      loaded: bool
    });
  };

  sortCarsListByPrice = price => {
    this.state.carListing.results.forEach(
      newData => (newData.vehicles = sortByPrice(newData.vehicles, price.value))
    );
    this.setState({
      carListing: this.state.carListing
    });
  };

  postalCodeInputCallback = (code, validate) => {
    this.setState({
      postalCode: code,
      validatePostalCode: validate
    });

    this.searchIncentives();
  };

  handleUpdated = () => {
    const {
      match: { params },
      incentivePostalCode
    } = this.props;
    const token = get(this.props, 'user.authUser.accessToken');
    const values = {
      ...params,

      postal_code: incentivePostalCode
    };
    this.props.postSearch(values, token, true);
  };

  searchIncentives = () => {
    const {
      match: { params },
      incentivePostalCode
    } = this.props;
    const values = {
      ...params,

      postal_code: incentivePostalCode
    };
    this.props.postSearch(values);
  };

  showIncentiveDetail = postalCode => {
    const {
      match: { params },
      setIncentivePostalCode,
      setInsurancePostalCode
    } = this.props;

    setIncentivePostalCode(postalCode);
    setInsurancePostalCode(postalCode);

    const token = get(this.props, 'user.authUser.accessToken');
    const values = {
      ...params,

      postal_code: postalCode.toUpperCase()
    };
    this.props.postSearch(values, token, false).then(data => {
      if (data.status === 200) {
        this.setState({
          loaded: true
        });
      }
    });
  };

  renderFinalCarListing = () => {
    const { carListing } = this.state;
    const { incentivePostalCode } = this.props;
    const searchDataDetails = get(carListing, 'results') || '';

    if (!this.state.loaded) {
      return (
        <div style={{ minHeight: 500, position: 'relative' }}>
          <Spinner pulse color="lightgrey" scale={0.5} />
        </div>
      );
    }
    return (
      <div>
        {searchDataDetails ? (
          searchDataDetails.map((data, i) => (
            <div key={i}>
              {i === 0 && incentivePostalCode && (
                <IncentivesSection>
                  <div>
                    <h3>Showing current incentives</h3>

                    <ChangePostalCode
                      postalCode={incentivePostalCode}
                      onSubmit={this.showIncentiveDetail}
                    />
                  </div>
                </IncentivesSection>
              )}

              <div className="text-container">
                <section className="page-section listing-section">
                  <header className="page-section-header">
                    <h2>
                      <span className="hidden-xs">
                        {carListing.year} {carListing.make}{' '}
                        {carListing.model.replace('-', ' ')}{' '}
                      </span>
                      {carListing.model.match(data.body_style.toLowerCase())
                        ? ''
                        : data.body_style}
                      <span className="hidden-sm hidden-md hidden-lg">s</span>
                    </h2>
                  </header>

                  <div className="page-section-body">
                    {this.renderCarsList(data)}
                  </div>
                </section>
              </div>

              {i === 0 && !incentivePostalCode && (
                <IncentivesSection>
                  <div>
                    <h3>See current incentives</h3>

                    <ChangePostalCode onSubmit={this.showIncentiveDetail} />
                  </div>
                </IncentivesSection>
              )}
            </div>
          ))
        ) : (
          <div className="text-container">
            <div className="text-center max-text-width center">
              {NO_CARS_AVAILABLE}
            </div>
          </div>
        )}
      </div>
    );
  };

  renderCarsList = data => {
    const { incentivePostalCode } = this.props;
    const updatedData = data.vehicles ? data.vehicles : '';
    return (
      <CarListings>
        {updatedData instanceof Array &&
          updatedData.map((car, i) => {
            const stats = getStats(car);
            const price = getCarPrice(car);
            return (
              <CarListingTile
                key={`${i}-${car.vehicle_id}`}
                year={car.year}
                make={car.make}
                model={car.model}
                bodyStyleName={data.body_style}
                trim={car.trim_name !== '-' ? car.trim_name : ''}
                {...price}
                carDetail={car}
                incentive={!!(car.incentive && incentivePostalCode)}
                image={car.izmo || car.image_url}
                stats={stats}
                onView={() =>
                  this.getCarsSpecificDetails(
                    car.vehicle_id,
                    data.body_style_id,
                    car.color_code
                  )
                }
                saved={car.is_liked}
                trimId={car.vehicle_id}
                onSave={this.handleUpdated}
                onUnsave={this.handleUpdated}
                section="shop"
              />
            );
          })}
      </CarListings>
    );
  };

  showMobileSearchForm = () => {
    this.setState({
      mobileSearchForm: true
    });
  };

  renderHeader = mobile => {
    const {
      match: { params },
      searchData
    } = this.props;
    const { mobileSearchForm } = this.state;

    const { year, make, model } = (searchData && searchData.data) || {};

    const form = (
      <div className="content-strip">
        <div className="text-container text-center">
          <div className="offset-header">
            <ShopCarsForm
              initialValues={params}
              title="Shop cars"
              form="shopCarsListing"
            />
          </div>
        </div>
      </div>
    );

    if (mobile) {
      return (
        <div>
          {mobileSearchForm && form}

          <div className="text-container">
            <div
              className={`shop-mobile-header ${
                mobileSearchForm ? '' : 'offset-header'
              }`}
            >
              {!mobileSearchForm && (
                <div className="listing-mobile-title">
                  <div className="subtitle">Results:</div>
                  <h1>
                    {year} {make} {model}{' '}
                    <button
                      className="btn btn-link primary-link"
                      onClick={this.showMobileSearchForm}
                    >
                      Edit
                    </button>
                  </h1>
                </div>
              )}

              <div className="shop-mobile-nav">
                <SortCarsListByPrice onChange={this.sortCarsListByPrice} />
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          {form}

          <div className="text-container">
            <div className="car-listing-header">
              <div className="car-listing-breadcrumbs">
                {getBreadcrumbs({ currentBreadcrumb: 'Search' })}
              </div>
              <div className="car-listing-sort">
                <SortCarsListByPrice onChange={this.sortCarsListByPrice} />
                {/*<ShareButton url={url} /> */}
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  render() {
    // const { carListing } = this.state;
    // const { incentivePostalCode } = this.props;

    // // const searchDataDetails = get(carListing, "carListing.results") || "";
    // // const postalCode = incentivePostalCode;
    // // const url = window.location.href;
    return (
      <div className="page-width content-container">
        <ArticleMetaTags title="Shop" />

        <Media query={mediaQuery('xs')}>{this.renderHeader}</Media>

        {this.renderFinalCarListing()}
        {/*<div className="load_btn" onClick={::this.showMore}>
          <a className="search_Button" href="javascript:void(0);">{this.state.expanded ? 'LOAD MORE +' : 'LOAD LESS-'}</a>
        </div>*/}

        <div className="text-container">
          <Legal />
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    searchData: state.MarketPlace.searchData,
    carDetails: state.MarketPlace.carDetails,
    user: state.user,
    incentivePostalCode: state.MarketPlace.incentivePostalCode
  };
}
const mapDispatchToProps = {
  postSearch,
  getCarDetails,
  getProfile,
  setIncentivePostalCode,
  setInsurancePostalCode
};

export default reloadForUser(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CBBListingView)
);

CBBListingView.propTypes = {};
