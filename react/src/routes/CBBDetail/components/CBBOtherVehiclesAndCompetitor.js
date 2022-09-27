import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import CarListingTile from 'components/Listings/CarListingTile';
import { getStats, getCarPrice } from 'components/Listings';
import CarListings from 'components/Listings/CarListings';
import {
  getCarDetails,
  getCarSpecification,
  getOtherCars,
  getIncentiveData
} from 'redux/actions/marketPlaceActions';

const IMAGE_JATO_PATH = 'https://jatona.blob.core.windows.net/pix640';
const IMAGE_SSL_PATH = 'https://sslphotos.jato.com/PHOTO300';

class CBBOtherVehiclesAndCompetitor extends React.Component {
  getDetailsOfOtherCars = (vehicle_id, body_style_id, color_code) => {
    const { history } = this.props;
    console.log(color_code, 'colors');
    history.push(
      `/shopping/vehicle-details/${vehicle_id}/${body_style_id}/${
        color_code !== undefined ? color_code : ''
      }`
    );
  };

  render() {
    const { otherCars, headline, onUpdated } = this.props;
    console.log(otherCars, 'otherCars');
    return (
      <section
        ref={ref => (this._container = ref)}
        className="page-section other-vehicles"
      >
        <header className="page-section-header">
          {headline && <h3>{headline}</h3>}
        </header>

        <div className="page-section-body">
          <CarListings>
            {otherCars &&
              otherCars.map((car, i) => {
                // which path are we using?
                console.log(car, 'carsss');
                const image =
                  car && car.image_url && car.image_url.includes('http')
                    ? car.image_url
                    : `${IMAGE_JATO_PATH}${car.image_url}` ||
                      `${IMAGE_SSL_PATH}${car.image_url}`;

                const price = getCarPrice(car);
                const stats = getStats(car);

                return (
                  <CarListingTile
                    key={`${i}-${car.vehicle_id}`}
                    year={car.year}
                    make={car.make}
                    model={car.model}
                    bodyStyleName={car.body_style}
                    trim={car.trim_name !== '-' ? car.trim_name : ''}
                    {...price}
                    image={image}
                    stats={stats}
                    saved={car.is_liked}
                    onView={() =>
                      this.getDetailsOfOtherCars(
                        car.vehicle_id,
                        car.body_style_id,
                        car.color_code
                      )
                    }
                    trimId={car.vehicle_id}
                    section="shop"
                    onSave={onUpdated}
                    onUnsave={onUpdated}
                  />
                );
              })}
          </CarListings>
        </div>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    searchData: state.MarketPlace.searchData,
    car_details: state.MarketPlace.carDetails,
    user: state.user
  };
}

const mapDispatchToProps = {
  getCarDetails,
  getCarSpecification,
  getOtherCars,
  getIncentiveData
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CBBOtherVehiclesAndCompetitor)
);
