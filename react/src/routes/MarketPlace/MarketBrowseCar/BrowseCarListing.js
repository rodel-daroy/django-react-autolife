import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import CarListingTile from 'components/Listings/CarListingTile';
import CarListings from 'components/Listings/CarListings';
import Spinner from 'components/common/Spinner';
import { getStats, getCarPrice } from 'components/Listings';
import {
  getBrowseCarDetail,
  getBrowseCategoryData
} from 'redux/actions/marketPlaceActions';
import { bodyStyle, defaultSedanImg } from 'config/constants';

//getRollOverData

class BrowseCarListing extends React.Component {
  state = {
    vehicle_id: ''
  };

  getCategoriesDetail = data => {
    const { match } = this.props;
    console.log(data, 'carData');
    const carMake =
      data && data.make.includes(' ') ? data.make.replace(' ', '-') : data.make;
    const carModel =
      data && data.model.includes(' ')
        ? data.model.replace(' ', '-')
        : data.model;
    const { history } = this.props;
    history.push({
      pathname: `/market-place/browse-detail/${data.id}/${carMake}/${carModel}`,
      state: {
        categorySlug: match.params.id,
        subCategoryId: match.params.subcategory_id
      }
    });
  };

  renderFinalCarListing() {
    const categoriesData = this.props.categoriesData || [];
    const { onUpdated } = this.props;
    const listItems = categoriesData.map((car, i) => {
      const stats = getStats(car);
      const price = getCarPrice(car);
      let imageUrl = car.image_url;
      const defaultBodyStyleImage = bodyStyle[car.body_style];
      if (defaultBodyStyleImage) {
        imageUrl = imageUrl || defaultBodyStyleImage;
      } else imageUrl = imageUrl || defaultSedanImg;
      return (
        <CarListingTile
          key={`${i}-${car.id}`}
          year={car.year}
          make={car.make}
          model={car.model}
          saved={car.is_liked}
          bodyStyleName={car.body_style}
          trim={car.trim_name !== '-' ? car.trim_name : ''}
          {...price}
          image={imageUrl}
          stats={stats}
          onView={() => this.getCategoriesDetail(car)}
          trimId={car.id}
          onSave={onUpdated}
          onUnsave={onUpdated}
          imageAspectRatio={0.5625}
          section="browse"
        />
      );
    });

    return <CarListings>{listItems}</CarListings>;
  }

  render() {
    if (!this.props.loaded) {
      return (
        <div style={{ minHeight: 500 }}>
          <Spinner pulse color="lightgrey" scale={0.5} />
        </div>
      );
    }

    return this.renderFinalCarListing();
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

const mapDispatchToProps = {
  getBrowseCarDetail,
  getBrowseCategoryData
  // getRollOverData
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BrowseCarListing)
);
