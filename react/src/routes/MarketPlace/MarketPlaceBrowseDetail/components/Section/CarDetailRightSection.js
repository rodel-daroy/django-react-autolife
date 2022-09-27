import React from "react";
import FindDealerButton from "components/Listings/FindDealer/FindDealerButton";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import BrowseDetailAssetSection from "./BrowseDetailAssetSection";
import SeeAllTrimLevel from "components/Listings/FindDealer/SeeAllTrimLevel";
import SaveCar from "components/Listings/SaveCar";
import Commands from "components/common/Commands";
import CarPriceTag from "components/Listings/CarPriceTag";
import CarPrice from "components/Listings/CarPrice";
import { getCarPrice } from "components/Listings";
import CarName from "components/Listings/CarName";

class CarDetailRightSection extends React.Component {
  state = {
    currentUrl: "",
    prevUrl: ""
  };

  render() {
    const { onUpdated } = this.props;

    const carDetailData = this.props.carDetailData
      ? this.props.carDetailData
      : "";

    const price = getCarPrice(carDetailData);

    return (
      <div>
        <BrowseDetailAssetSection carDetailData={carDetailData} />

        <section className="browse-car-detail">
          <header className="browse-car-detail-header">
            {/*<h1>{carDetailData.hasOwnProperty('name') ? carDetailData.name : `${params.make} ${params.model}`}</h1>*/}
            <CarName
              year={carDetailData.year}
              make={carDetailData.make}
              model={carDetailData.model}
              bodyStyle={carDetailData.body_style}
              trim={carDetailData.trim_name}
              size="large"
            />

            <CarPriceTag className="hidden-xs" {...price} />
            <CarPrice className="hidden-sm hidden-md hidden-lg" {...price} />
          </header>

          <div
            className="browse-car-detail-body"
            dangerouslySetInnerHTML={{ __html: carDetailData.article_text }}
          />

          <Commands className="browse-car-detail-nav" align="left">
            <SaveCar
              trimId={carDetailData.id}
              saved={carDetailData.is_liked}
              onSave={onUpdated}
              onUnsave={onUpdated}
              section="browse"
              className="first"
            />
            <SeeAllTrimLevel />
            <FindDealerButton division={carDetailData.make} />
          </Commands>
        </section>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    carDetailData: state.MarketPlace.carDetailData,
    categoriesDetail: state.MarketPlace.categoriesDetail
  };
}

export default withRouter(connect(mapStateToProps)(CarDetailRightSection));
