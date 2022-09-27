import React, { Component } from 'react';
import CbbDetailsComponent from './CbbDetailsComponent';
import Spinner from 'components/common/Spinner';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Legal from 'components/Listings/Legal';
import isEqual from 'lodash/isEqual';
import ArticleMetaTags from 'components/common/ArticleMetaTags';
import {
  getCarDetails,
  postSearch,
  getOtherCars,
  getCarSpecification,
  getIncentiveData,
  getCarColors
} from "redux/actions/marketPlaceActions";
import reloadForUser from "components/Decorators/reloadForUser";
import { accessToken } from "redux/selectors/userSelectors";
import { NO_CARS_AVAILABLE } from "config/constants";
import get from "lodash/get";

class CBBDetailView extends Component {
  componentDidMount() {
    this.loadDetails(true);
  }

  loadDetails = (loadAll = false) => {
    const {
      match: { params },
      getCarDetails,
      getOtherCars,
      getCarSpecification,
      accessToken,
      incentivePostalCode,
      getIncentiveData,
      getCarColors
    } = this.props;
    
    const details = getCarDetails({
      trim_id: params.trim_id,
      body_style_id: params.body_style_id,
      token: accessToken,
      color_code: params.color_code
    });

    details.then(data => {
      if (Object.keys(data).length !== 0) {
        const paramsData = {
          postal_code: incentivePostalCode,
          uid: data.data.uid,
          year: data.data.year
        };
        if (incentivePostalCode) {
          getIncentiveData(paramsData);
        }
      }
    });

    if(loadAll) {
      details.then(data => {
        const evoxId = get(data, "data.evox_id");
        if(evoxId)
          getCarColors(evoxId);
      });

      return details.then(data => {
        if (data.status === 200) {
          getOtherCars(params.trim_id, accessToken);
          getCarSpecification(params.trim_id, accessToken);
        }
      });
    }

    return details;
  };

  componentDidUpdate(prevProps) {
    const { match, loadingCarDetail, history, location } = this.props;

    if (!isEqual(match.params, prevProps.match.params)) this.loadDetails(true);

    if (!loadingCarDetail && prevProps.loadingCarDetail)
      history.replace({
        ...location,
        state: undefined
      });
  }

  renderNoResults() {
    return (
      <div className="text-container offset-header">
        <div className="text-center max-text-width center no-cars-available">
          {NO_CARS_AVAILABLE}
        </div>
      </div>
    );
  }

  renderCarDetailsView = () => {
    const {
      car_details,
      match: { params },
      location: { state = {} },
      history,
      loadingCarDetail
    } = this.props;

    if (loadingCarDetail && !state.changeKind) {
      return (
        <div style={{ minHeight: 500, position: 'relative' }}>
          <Spinner pulse color="lightgrey" scale={0.5} />
        </div>
      );
    } else if (Object.keys(car_details).length === 0) {
      return this.renderNoResults();
    } else {
      return (
        <CbbDetailsComponent
          params={params}
          loaded={!loadingCarDetail}
          router={history}
          onUpdated={() => this.loadDetails(true)}
        />
      );
    }
  };

  render() {
    return (
      <div className="cbb-detail-view">
        <ArticleMetaTags title="Shop" metaDescription="" />
        <article className="page-width">
          <div className="content-container">
            {this.renderCarDetailsView()}
            <div className="text-container">
              <Legal />
            </div>
          </div>
        </article>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    car_details: state.MarketPlace.carDetails,
    searchData: state.MarketPlace.searchData,
    accessToken: accessToken(state),
    incentivePostalCode: state.MarketPlace.incentivePostalCode,
    loadingCarDetail: state.MarketPlace.loadingCarDetail
  };
}

const mapDispatchToProps = {
  getCarDetails,
  postSearch,
  getOtherCars,
  getCarSpecification,
  getIncentiveData,
  getCarColors
};

export default reloadForUser(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(CBBDetailView)
  )
);

CBBDetailView.propTypes = {};
