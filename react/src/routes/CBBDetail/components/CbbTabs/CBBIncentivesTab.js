import React from 'react';
import ChangePostalCode from 'components/Listings/ChangePostalCode';
import { connect } from 'react-redux';
import SaveCar from 'components/Listings/SaveCar';
import financeImage from 'styles/img/listings/finance.svg';
import leaseImage from 'styles/img/listings/lease.svg';
import cashImage from 'styles/img/listings/cash.svg';
import IncentivesSection from 'components/Listings/IncentivesSection';
import PrimaryButton from 'components/Forms/PrimaryButton';
import IncentivePanel from 'components/Listings/IncentivePanel';
import get from 'lodash/get';
import { getInsuranceQuote } from 'redux/actions/insuranceActions';
import {
  getIncentiveData,
  setIncentivePostalCode,
  setInsurancePostalCode,
  emptyIncentiveData
} from 'redux/actions/marketPlaceActions';

class CBBIncentivesTab extends React.Component {
  state = {
    showPostalCode: true
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.incentivePostalCode !== this.props.incentivePostalCode) {
      this.props.emptyIncentiveData();
      this.showIncentiveDetail(nextProps.incentivePostalCode);
    }
  }

  handlePostalCodeSubmit = postalCode => {
    const { setIncentivePostalCode, setInsurancePostalCode } = this.props;
    setIncentivePostalCode(postalCode);
    setInsurancePostalCode(postalCode);
  };

  showIncentiveDetail = postalCode => {
    const { car_details, getIncentiveData, incentivePostalCode } = this.props;
    const dealerPostalCode = postalCode || incentivePostalCode;

    const paramsData = {
      postal_code: dealerPostalCode,
      uid: car_details && car_details.data && car_details.data.uid,
      year: car_details && car_details.data && car_details.data.year
    };

    if (dealerPostalCode) {
      this.setState({
        showPostalCode: false
      });
    }
    getIncentiveData(paramsData);
  };

  getTerms = terms => {
    return terms.map((t, i) => {
      return {
        term: parseInt(t[0]),
        rate: parseFloat(t[1])
      };
    });
  };

  renderFinancePanel({ terms, rebate_pre_tax, rebate_post_tax, start_date }) {
    const finalRebate = Math.max(
      parseInt(rebate_pre_tax),
      parseInt(rebate_post_tax)
    );

    return (
      <IncentivePanel
        title="Finance"
        icon={financeImage}
        rebate={finalRebate}
        terms={this.getTerms(terms)}
        throughDate={start_date}
      />
    );
  }

  renderLeasePanel({ terms, start_date, rebate_pre_tax, rebate_post_tax }) {
    const finalRebate = Math.max(
      parseInt(rebate_pre_tax),
      parseInt(rebate_post_tax)
    );

    return (
      <IncentivePanel
        title="Lease"
        icon={leaseImage}
        rebate={finalRebate}
        terms={this.getTerms(terms)}
        throughDate={start_date}
      />
    );
  }

  renderCashPanel({ terms, rebate_pre_tax, rebate_post_tax, start_date }) {
    const finalRebate = Math.max(
      parseInt(rebate_pre_tax),
      parseInt(rebate_post_tax)
    );

    if (finalRebate) {
      return (
        <IncentivePanel
          title="Cash"
          icon={cashImage}
          rebate={finalRebate}
          terms={this.getTerms(terms)}
          throughDate={start_date}
        />
      );
    } else {
      return null;
    }
  }

  renderIncentives() {
    const {
      incentiveData,
      incentivePostalCode,
      setInsurancePostalCode
    } = this.props;
    console.log(incentiveData, 'incentiveDta');
    const financeIncentive =
      incentiveData &&
      incentiveData.data &&
      incentiveData.data.incentives.find(
        data => data.incentive_type === 'finance'
      );
    const leaseIncentive =
      incentiveData &&
      incentiveData.data &&
      incentiveData.data.incentives.find(
        data => data.incentive_type === 'lease'
      );
    const cashIncentive =
      incentiveData &&
      incentiveData.data &&
      incentiveData.data.incentives.find(
        data => data.incentive_type === 'cash'
      );

    const motoinsight = (className = '') => (
      <div className={`motoinsight ${className}`}>
        New vehicle incentives provided by{' '}
        <a
          className="primary-link"
          href="https://motoinsight.com"
          target="_blank"
        >
          Motoinsight
        </a>
      </div>
    );

    return (
      <div>
        <div className="incentive-tab-header">
          {incentivePostalCode && (
            <ChangePostalCode
              postalCode={incentivePostalCode}
              onSubmit={this.handlePostalCodeSubmit}
            />
          )}

          <div className="incentive-tab-header-text hidden-xs">
            {motoinsight()}
          </div>
        </div>

        <div className="incentive-panel-container">
          <div className="incentive-panel-container-inner">
            {financeIncentive &&
              this.renderFinancePanel({
                ...financeIncentive,
                start_date: incentiveData.start_date
              })}

            {leaseIncentive &&
              this.renderLeasePanel({
                ...leaseIncentive,
                start_date: incentiveData.start_date
              })}

            {cashIncentive &&
              this.renderCashPanel({
                ...cashIncentive,
                start_date: incentiveData.start_date
              })}
          </div>
        </div>

        {motoinsight('hidden-sm hidden-md hidden-lg')}
      </div>
    );
  }

  checkForUserPostalCode() {
    const { car_details, incentivePostalCode, onUpdated } = this.props;

    let incentiveData = null;
    console.log(this.props.incentiveData, 'incentiveData');
    if (incentivePostalCode) {
      incentiveData =
        this.props.incentiveData && this.props.incentiveData.data
          ? this.props.incentiveData.data
          : '';
      if (!incentiveData.incentives || incentiveData.incentives.length === 0) {
        return (
          <div className="no-incentives">
            <ChangePostalCode
              postalCode={incentivePostalCode}
              onSubmit={this.handlePostalCodeSubmit}
            />

            <h2>There are no incentives at this time.</h2>
            <p>
              Save this vehicle and we will alert you when incentives become
              available
            </p>

            <SaveCar
              trimId={car_details.vehicle_id}
              saved={car_details.is_liked}
              onSave={onUpdated}
              onUnsave={onUpdated}
              section="shop"
            >
              {({ handleSave, handleUnsave, saved }) => {
                if (!saved) {
                  return (
                    <PrimaryButton onClick={handleSave}>
                      <span className="icon icon-heart-empty" /> Save
                    </PrimaryButton>
                  );
                } else {
                  return (
                    <PrimaryButton onClick={handleUnsave}>
                      <span className="icon icon-heart" /> Unsave
                    </PrimaryButton>
                  );
                }
              }}
            </SaveCar>
          </div>
        );
      } else if (
        incentiveData.incentives &&
        incentiveData.incentives.length > 0
      ) {
        return this.renderIncentives();
      }
    } else if (!incentivePostalCode) {
      return (
        <IncentivesSection>
          <div>
            <h3>See current incentives</h3>

            <ChangePostalCode onSubmit={this.handlePostalCodeSubmit} />
          </div>
        </IncentivesSection>
      );
    }
  }

  render() {
    return this.checkForUserPostalCode();
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    car_details: state.MarketPlace.carDetails,
    incentiveData: state.MarketPlace.incentiveData,
    incentivePostalCode: state.MarketPlace.incentivePostalCode,
    insurancePostalCode: state.MarketPlace.insurancePostalCode,
    accessToken: get(state, 'user.authUser.accessToken')
  };
}
const mapDispatchToProps = {
  getIncentiveData,
  setIncentivePostalCode,
  setInsurancePostalCode,
  getInsuranceQuote,
  emptyIncentiveData
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CBBIncentivesTab);
