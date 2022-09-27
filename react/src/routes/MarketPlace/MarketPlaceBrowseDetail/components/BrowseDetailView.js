import React, { Component } from "react";
import { connect } from "react-redux";
import BrowseCarDetailSection from "./Section/BrowseCarDetailSection";
import {
  getCategoriesDetail,
  getBrowseCarDetail,
  getSimilarVehicle,
  emptyData
} from "redux/actions/marketPlaceActions";
import reloadForUser from "components/Decorators/reloadForUser";
import { accessToken } from "redux/selectors/userSelectors";
import isEqual from "lodash/isEqual";

class BrowseDetailView extends Component {
  componentDidMount() {
    const { getCategoriesDetail, accessToken } = this.props;

    getCategoriesDetail(null, accessToken);
    this.loadVehicle();
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;

    if(!isEqual(match.params, prevProps.match.params))
      this.loadVehicle();
  }

  loadVehicle = () => {
    const { match: { params }, getBrowseCarDetail, getSimilarVehicle, accessToken } = this.props;

    getBrowseCarDetail(
      params.trim_id,
      true,
      accessToken,
      params.make,
      params.model
    );
    getSimilarVehicle(params.trim_id, accessToken);
  }

  render() {
    return (
      <React.Fragment>
        <BrowseCarDetailSection
          onUpdated={this.loadVehicle}
        />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    accessToken: accessToken(state),
    carDetailData: state.MarketPlace.carDetailData,
    categoriesDetail: state.MarketPlace.categoriesDetail
  };
}
const mapDispatchToProps = {
  getCategoriesDetail,
  getBrowseCarDetail,
  getSimilarVehicle,
  emptyData
};

export default reloadForUser(connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowseDetailView));
