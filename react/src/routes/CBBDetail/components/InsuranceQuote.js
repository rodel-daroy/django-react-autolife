import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PostalCodeField from '../../../components/Listings/PostalCodeField';
import ChangePostalCode from '../../../components/Listings/ChangePostalCode';
import {
  setInsurancePostalCode,
  setIncentivePostalCode,
  getIncentiveData
} from '../../../redux/actions/marketPlaceActions';
import PrimaryButton from '../../../components/Forms/PrimaryButton';
import { getInsuranceQuote } from '../../../redux/actions/insuranceActions';
import {
  insuranceConfig,
  insurancesubmitData,
  providerWhitelist
} from './insuranceConfig';
import { roundNumbers } from '../../../utils/format';
import Spinner from '../../../components/common/Spinner';
import get from 'lodash/get';
import { PhoneLink } from '../../../components/Decorators/WithPhoneLink';
import {
  INSURANCE_PHONE_TEXT,
  INSURANCE_PHONE
} from '../../../config/constants';

class InsuranceQuote extends Component {
  componentDidMount() {
    const { insurancePostalCode } = this.props;
    if (insurancePostalCode) {
      this.submitInsuranceQuote(insurancePostalCode); // To change insurance quote for every time a new vehicle searched
      this.loaded = false;
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props.match.params.trim_id, 'jato-params');
    if (
      nextProps.insurancePostalCode !== this.props.insurancePostalCode ||
      nextProps.match.params.trim_id !== this.props.match.params.trim_id
    ) {
      this.submitInsuranceQuote(nextProps.insurancePostalCode);
    }
  }

  handlePostalCodeSubmit = postalCode => {
    const { setIncentivePostalCode, setInsurancePostalCode } = this.props;
    setInsurancePostalCode(postalCode);
    setIncentivePostalCode(postalCode);
  };

  submitInsuranceQuote = postalCode => {
    const { getInsuranceQuote, insurancePostalCode, accessToken } = this.props;
    const data = insurancesubmitData({ ...this.props }, postalCode);
    const submitParams = insuranceConfig(data);
    getInsuranceQuote(submitParams, accessToken);
  };

  renderLoader = () => {
    return (
      <article className="shop-details-insurance">
        <div className="shop-details-insurance-body">
          <Spinner pulse color="lightgrey" scale={0.5} />
        </div>
      </article>
    );
  };

  renderInitial = () => {
    const { insurancePostalCode } = this.props;

    return (
      <article className="shop-details-insurance">
        <div className="shop-details-insurance-body">
          <h3>
            Get an <strong>instant insurance quote</strong> for this vehicle
          </h3>

          {!insurancePostalCode && (
            <PostalCodeField
              value={insurancePostalCode}
              onSubmit={this.handlePostalCodeSubmit}
            />
          )}
        </div>

        {insurancePostalCode && (
          <div className="shop-details-insurance-foot">
            <div>
              <PrimaryButton
                onClick={this.submitInsuranceQuote.bind(
                  'this',
                  insurancePostalCode
                )}
              >
                Get quote
              </PrimaryButton>
            </div>
          </div>
        )}
      </article>
    );
  };

  renderError = () => {
    return (
      <article className="shop-details-insurance">
        <div className="shop-details-insurance-body">
          <h3>
            <strong>Sorry</strong>
          </h3>
          <p>
            We are having an issue finding quotes and are unable to continue.
          </p>
          <p>To continue your quote, please call:</p>

          <h3>
            <strong>
              <PhoneLink
                className="btn btn-link primary-link phone-link"
                phone={INSURANCE_PHONE}
                phoneWords={INSURANCE_PHONE_TEXT}
              >
                <span className="icon icon-phone" />
                {INSURANCE_PHONE_TEXT}
              </PhoneLink>
            </strong>
          </h3>
        </div>
      </article>
    );
  };

  render() {
    const {
      insurancePostalCode,
      loaded,
      insuranceData,
      insuranceStatus
    } = this.props;

    if (loaded) return this.renderLoader();
    else {
      if (!insurancePostalCode || !insuranceData) return this.renderInitial();
      else {
        if (insuranceStatus != 200) return this.renderError();

        let prices = get(insuranceData, 'price.Prices', []);
        prices = prices.filter(p =>
          providerWhitelist.includes(p.InsuranceCompany)
        );

        return (
          <article className="shop-details-insurance">
            <div className="shop-details-insurance-body">
              {prices.length > 0 && (
                <div>
                  <h3>
                    <strong>
                      Insure this
                      <br />
                      vehicle for as
                      <br />
                      low as
                    </strong>
                  </h3>

                  <h4>
                    $
                    {roundNumbers(
                      Math.min(...prices.map(o => o.MonthlyPayment)),
                      0
                    )}
                    /month
                  </h4>
                </div>
              )}

              {prices.length === 0 && (
                <div>
                  <h3>Sorry</h3>
                  <p>
                    No quotes available.
                    <br />
                    Please try a different postal code or vehicle
                  </p>
                </div>
              )}

              <ChangePostalCode
                postalCode={insurancePostalCode}
                onSubmit={this.handlePostalCodeSubmit}
              />
            </div>

            {prices.length > 0 && (
              <div className="shop-details-insurance-foot">
                <div>
                  <PrimaryButton link="/insurance/quote">
                    Get a Detailed Quote
                  </PrimaryButton>
                </div>
              </div>
            )}
          </article>
        );
      }
    }
  }
}

const mapStateToProps = state => ({
  insurancePostalCode: state.MarketPlace.insurancePostalCode,
  user: state.user,
  car_details: state.MarketPlace.carDetails,
  loaded: state.insurance.loadingInsuranceData,
  incentivePostalCode: state.MarketPlace.incentivePostalCode,
  insuranceData: state.insurance.insuranceData,
  insuranceStatus: state.insurance.insuranceStatus,
  accessToken: get(state, 'user.authUser.accessToken')
});

const mapDispatchToProps = {
  setInsurancePostalCode,
  setIncentivePostalCode,
  getIncentiveData,
  getInsuranceQuote
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(InsuranceQuote)
);
