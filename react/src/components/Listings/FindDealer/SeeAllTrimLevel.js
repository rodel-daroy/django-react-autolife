import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getCarDetails } from "redux/actions/marketPlaceActions";
import { accessToken } from "redux/selectors/userSelectors";

class SeeAllTrimLevel extends Component {
  componentDidMount() {
    this.loadDetails();
  }

  componentDidUpdate(prevProps) {
    const { carDetailData } = this.props;

    if(carDetailData !== prevProps.carDetailData)
      this.loadDetails();
  }

  loadDetails = () => {
    const { getCarDetails, carDetailData, accessToken } = this.props;

    if(carDetailData && carDetailData.source_id)
      getCarDetails({
        trim_id: carDetailData.source_id, 
        body_style_id: carDetailData.body_style_id, 
        token: accessToken
      });
  }

  render() {
    const { carDetailData, carDetails } = this.props;

    if(carDetails && carDetails.status === 200 && carDetailData && carDetailData.source_id)
      return (
        <Link
          to={`/shopping/vehicle-details/${carDetailData.source_id}/${
            carDetailData.body_style_id
          }`}
          className="btn btn-link large"
        >
          See All Trim Levels <span className="icon icon-angle-right" />
        </Link>
      );

    return null;
  }
}

SeeAllTrimLevel.propTypes = {
  carDetailData: PropTypes.object,
  carDetails: PropTypes.object,
  getCarDetails: PropTypes.func.isRequired,
  accessToken: PropTypes.string
};

function mapStateToProps(state) {
  return {
    carDetailData: state.MarketPlace.carDetailData,
    carDetails: state.MarketPlace.carDetails,
    accessToken: accessToken(state)
  };
};

export default withRouter(connect(mapStateToProps, { getCarDetails })(SeeAllTrimLevel));
