import React, { Component } from 'react';
import { connect } from 'react-redux';
import CarListingTile from 'components/Listings/CarListingTile';
import CarListings from 'components/Listings/CarListings';
import get from 'lodash/get';
import { getStats, getCarPrice } from 'components/Listings';
import { getScrollParent } from 'utils';
import { withRouter } from 'react-router-dom';
import { defaultSuvImg, defaultTruckImg } from 'config/constants';
import {
  getCategoriesDetail,
  getBrowseCarDetail
} from 'redux/actions/marketPlaceActions';

class BrowseVehiclesMightLike extends Component {
  openVehiclePage = data => {
    const {
      getCategoriesDetail,
      getBrowseCarDetail,
      history: { push }
    } = this.props;
    const token = get(this.props, 'user.authUser.accessToken');

    // getCategoriesDetail(null, token);
    // getBrowseCarDetail(data.id, true, token, data.make, data.model, push).then(
    // () => {
    const carMake =
      data && data.make.includes(' ') ? data.make.replace(' ', '-') : data.make;
    const carModel =
      data && data.model.includes(' ')
        ? data.model.replace(' ', '-')
        : data.model;
    push(`/market-place/browse-detail/${data.id}/${carMake}/${carModel}`);
    // }
    // );

    const scrollParent = getScrollParent(this._container);
    scrollParent.scrollTop = scrollParent.scrollLeft = 0;
  };

  render() {
    const {
      carDetailData,
      headline,
      match: { params },
      onUpdated
    } = this.props;
    return (
      <section ref={ref => (this._container = ref)} className="page-section">
        <header className="page-section-header">
          {headline && <h3>{headline}</h3>}
        </header>

        <div className="page-section-body">
          <CarListings>
            {carDetailData &&
              carDetailData.map((car, i) => {
                let price = getCarPrice(car);
                if (isNaN(price.total_price))
                  price.total_price = carDetailData.price;

                const stats = getStats(car);
                let imageUrl = car.image_url;
                const categoryName = car.category;
                if (categoryName === 'suv')
                  imageUrl = car.image_url ? car.image_url : defaultSuvImg;
                else if (categoryName === 'truck')
                  imageUrl = car.image_url ? car.image_url : defaultTruckImg;
                if (car.id != params.trim_id) {
                  return (
                    <CarListingTile
                      key={`${i}-${car.id}`}
                      year={car.year}
                      make={car.make}
                      model={car.model}
                      bodyStyleName={car.body_style}
                      trim={car.trim_name !== '-' ? car.trim_name : ''}
                      {...price}
                      image={imageUrl}
                      stats={stats}
                      trimId={car.id}
                      saved={car.is_liked}
                      onView={() => this.openVehiclePage(car)}
                      imageAspectRatio={0.5625}
                      section="browse"
                      onSave={onUpdated}
                      onUnsave={onUpdated}
                    />
                  );
                }

                return null;
              })}
          </CarListings>
        </div>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

const mapDispatchToProps = {
  getCategoriesDetail,
  getBrowseCarDetail
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BrowseVehiclesMightLike)
);
