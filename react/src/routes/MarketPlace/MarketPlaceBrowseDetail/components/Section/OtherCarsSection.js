import React from "react";
import { withRouter } from "react-router";
import BrowseVehiclesMightLike from "./BrowseVehiclesMightLike";
import { connect } from "react-redux";

class OtherCarsSection extends React.Component {
  render() {
    const {
      match: { params },
      similarVehicle,
      postalCode,
      carDetailData,
      onUpdated
    } = this.props;

    return (
      <div>
        {((similarVehicle && similarVehicle.data) || {}).hasOwnProperty(
          "similar_brands"
        ) && (
          <BrowseVehiclesMightLike
            headline={`More vehicles from ${carDetailData &&
              carDetailData.make}`}
            params={params}
            postalCode={postalCode}
            carDetailData={
              similarVehicle &&
              similarVehicle.data &&
              similarVehicle.data.similar_brands
                ? similarVehicle.data.similar_brands
                : ""
            }
            onUpdated={onUpdated}
          />
        )}
        {((similarVehicle && similarVehicle.data) || {}).hasOwnProperty(
          "similar_vehicles"
        ) && (
          <BrowseVehiclesMightLike
            headline="Similar vehicles you might like"
            carDetailData={
              similarVehicle &&
              similarVehicle.data &&
              similarVehicle.data.similar_vehicles
                ? similarVehicle.data.similar_vehicles
                : ""
            }
            onUpdated={onUpdated}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    carDetailData: state.MarketPlace.carDetailData,
    similarVehicle: state.MarketPlace.similarVehicle,
    categoriesDetail: state.MarketPlace.categoriesDetail
  };
};

export default withRouter(connect(mapStateToProps)(OtherCarsSection));
