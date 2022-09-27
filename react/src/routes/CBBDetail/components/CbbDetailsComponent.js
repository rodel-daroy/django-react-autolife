import React from 'react';
import { withRouter } from 'react-router-dom';
import CBBOtherVehicleSection from './CBBOtherVehicleSection';
import CarDetailsASpot from 'components/Listings/CarDetailsASpot';
import CbbDescription from './CbbDescription';
import InsuranceQuote from './InsuranceQuote';
import CbbSpecificationTabView from './CbbSpecificationTabView';
import { connect } from 'react-redux';
import Media from 'react-media';
import { mediaQuery } from 'utils/style';
import PrimaryButton from 'components/Forms/PrimaryButton';
import ShopOverlayMenuButton from 'components/Listings/ShopOverlayMenuButton';
import CarName, { getCarName } from 'components/Listings/CarName';
import CarPrice from 'components/Listings/CarPrice';
import {
  getCarPrice,
  getBackButton,
  getBreadcrumbs
} from 'components/Listings';
import ShareButton from 'components/Listings/ShareButton';
import ArticleMetaTags from 'components/common/ArticleMetaTags';
import { defaultDescription } from 'config/constants';
import {
  getCarDetails,
  postSearch,
  setIncentivePostalCode
} from 'redux/actions/marketPlaceActions';

class CbbDetailsComponent extends React.Component {
  renderHeader = mobile => {
    const { car_details, carSpecs } = this.props;
    const url = window.location.href;
    console.log(car_details, 'C_D');

    const backLink = `/shopping/vehicle-search/${car_details.data.model}/${car_details.data.year}/${car_details.data.make}`;
    const breadcrumbs = [
      {
        name: 'Search',
        link: backLink
      },
      {
        name: getCarName({
          ...car_details.data,

          bodyStyle: car_details.data.body_style,
          trim: car_details.data.trim_name
        })
      }
    ];

    let images = [];
    if (car_details && car_details.data) {
      if (car_details.data.images && car_details.data.images.length > 0)
        images = car_details.data.images.map(img => img.images[0]);
      else images = [car_details.data.image_url];
    }

    if (!mobile) {
      return (
        <div className="car-listing-header">
          <div className="car-listing-breadcrumbs">
            {getBackButton({
              backLink,
              className: 'hidden-sm hidden-md hidden-lg'
            })}
            {getBreadcrumbs({ breadcrumbs })}
          </div>

          <div className="car-listing-sort">
            <ShareButton
              url={url}
              imageUrl={images[0]}
              text={car_details.data.name}
              className="last"
            />
          </div>
        </div>
      );
    } else {
      const price = getCarPrice(Object.assign({}, car_details.data, carSpecs));

      return (
        <div className="shop-details-mobile-header">
          <div className="shop-details-mobile-nav">
            <PrimaryButton size="medium" link={backLink}>
              <span className="icon icon-angle-left" /> Back to Results
            </PrimaryButton>

            <ShopOverlayMenuButton />
          </div>

          <div className="shop-details-mobile-name">
            <div>
              <CarName
                year={car_details.data.year}
                make={car_details.data.make}
                model={car_details.data.model}
                bodyStyle={car_details.data.body_style}
                trim={car_details.data.trim_name}
              />

              <CarPrice {...price} />
            </div>

            <ShareButton url={url} imagesUrl={images} />
          </div>
        </div>
      );
    }
  };

  render() {
    const {
      car_details,
      carSpecs,
      onUpdated,
      loaded,
      showLoaderCallback,
      otherCars,
      incentivePostalCode
    } = this.props;

    const price = getCarPrice(Object.assign({}, car_details, carSpecs));
    let images = [];
    if (car_details) {
      if (car_details.data.images && car_details.data.images.length > 0)
        images = car_details.data.images.map(img => img.images[0]);
      else images = [car_details.data.image_url];
    }

    let title;
    if (car_details)
      title = getCarName({
        year: car_details.data.year,
        make: car_details.data.make,
        model: car_details.data.model,
        bodyStyle: car_details.data.body_style,
        trim: car_details.data.trim_name
      });
    return (
      <div className="text-container clearfix">
        <ArticleMetaTags
          metaKeyword="Autolife"
          metaDescription={defaultDescription}
          title={title}
          url={window.location.href}
          imageUrl={images[0]}
        />
        <div className="offset-header">
          <Media query={mediaQuery('xs')}>{this.renderHeader}</Media>
        </div>
        <div className="shop-details-container">
          <div className="shop-details-row">
            <div className="shop-details-feature-spot">
              <CarDetailsASpot images={images} carDetails={car_details} />
            </div>
            <div className="shop-details-description">
              <CbbDescription
                showLoaderCallback={showLoaderCallback}
                onUpdated={onUpdated}
              />
            </div>
          </div>
          <div className="shop-details-row">
            <div className="shop-details-specs-insurance">
              <CbbSpecificationTabView
                onUpdated={onUpdated}
                loaded={loaded}
                postalCode={incentivePostalCode}
              />

              <InsuranceQuote {...price} />

              {/*<HelpBox title={<span>Looking for insurance?<br />Get a quote</span>} />*/}
            </div>
          </div>
          <div className="shop-details-row">
            <div className="shop-details-other-cars">
              <CBBOtherVehicleSection
                otherCars={otherCars}
                car_details={car_details}
                params={this.props.params}
                postalCode={incentivePostalCode}
                onUpdated={onUpdated}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    searchData: state.MarketPlace.searchData,
    otherCars: state.MarketPlace.otherCars,
    user: state.user,
    car_details: state.MarketPlace.carDetails,
    incentivePostalCode: state.MarketPlace.incentivePostalCode,
    insurancePostalCode: state.MarketPlace.insurancePostalCode,
    carSpecs: state.MarketPlace.carSpecs
  };
}

const mapDispatchToProps = {
  getCarDetails,
  postSearch,
  setIncentivePostalCode
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CbbDetailsComponent)
);
