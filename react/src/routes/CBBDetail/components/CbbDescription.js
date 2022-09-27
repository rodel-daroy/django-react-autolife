import React, { Component } from "react";
import { connect } from "react-redux";
import TrimsDropdown from "./TrimsDropdown";
import FindDealerButton from "components/Listings/FindDealer/FindDealerButton";
import SaveCar from "components/Listings/SaveCar";
import Commands from "components/common/Commands";
import MarketPlaceBodyStyle from "./MarketPlaceBodyStyle";
import { getCarPrice } from "components/Listings/";
import CarPriceTag from "components/Listings/CarPriceTag";
import CarName from "components/Listings/CarName";
import VehicleColorSwatches from "./VehicleColorSwatches";

class CbbDescription extends Component {
  render() {
    const {
      carDetails,
      onUpdated,
      carSpecs
    } = this.props;

    const price = getCarPrice(
      Object.assign(
        {},
        carDetails && carDetails.data,
        carSpecs && carSpecs.data
      )
    );

    return (
      <section className="page-section">
        <header className="page-section-header shop-details-header hidden-xs">
          <CarName
            year={carDetails.data.year}
            make={carDetails.data.make}
            model={carDetails.data.model}
            bodyStyle={carDetails.data.body_style}
            trim={carDetails.data.trim_name}
            size="medium"
            kind="complete"
          />

          <CarPriceTag {...price} />
        </header>

        <div className="shop-details-options hidden-xs">
          <TrimsDropdown
            carDetails={this.props}
          />
          <MarketPlaceBodyStyle />
        </div>

        <div className="shop-details-color-swatches">
          <VehicleColorSwatches />
        </div>

        <Commands align="left">
          <FindDealerButton
            division={carDetails && carDetails.data.make}
            className="first"
          />
          <SaveCar
            trimId={carDetails && carDetails.data && carDetails.data.vehicle_id}
            saved={carDetails && carDetails.data && carDetails.data.is_liked}
            onSave={onUpdated}
            onUnsave={onUpdated}
            section="shop"
            className="last"
          />
        </Commands>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    carDetails: state.MarketPlace.carDetails,
    searchData: state.MarketPlace.searchData,
    carByTrims: state.MarketPlace.carByTrims,
    carSpecs: state.MarketPlace.carSpecs
  };
}

export default connect(mapStateToProps)(CbbDescription);
