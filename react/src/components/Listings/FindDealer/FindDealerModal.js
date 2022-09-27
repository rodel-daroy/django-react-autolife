import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// import DealerFormInput from './DealerFormInput'
import {
  Field,
  reduxForm,
  initialize,
  reset,
  formValueSelector,
  getFormValues,
  SubmissionError
} from "redux-form";
// import Loader from 'react-loader'
import ChangePostalCode from "../ChangePostalCode";
import ResponsiveModal from "../../common/ResponsiveModal";
import PrimaryButton from "../../Forms/PrimaryButton";
import { ReduxCheckbox } from "../../Forms/Checkbox";
import { PageStepperSmall } from "../../Navigation/PageStepper";
import { DealerMap } from "./GoogleMapComponent";
import Spinner from "../../common/Spinner";
import { required } from "../../../utils/validations";
import {
  setIncentivePostalCode,
  setInsurancePostalCode
} from "../../../redux/actions/marketPlaceActions";

import Media from "react-media";
import { mediaQuery } from "../../../utils/style";
import Stepper from "../../Navigation/Stepper";

const DEALERS_PER_PAGE = 3;

class FindDealerModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pageIndex: 0,
      clientWidth: 0,
      clientHeight: 0
    };
  }

  componentDidUpdate(prevProps) {
    const { is_checked, getDealerArrayCallback, dealerData } = this.props;
    const { clientWidth, clientHeight } = this.state;

    if (
      prevProps.is_checked !== is_checked ||
      (prevProps.dealerData &&
        prevProps.dealerData.data !== dealerData &&
        dealerData.data) ||
      prevProps.getDealerArrayCallback !== getDealerArrayCallback
    ) {
      if (is_checked && dealerData && getDealerArrayCallback) {
        let dealerArray = [];

        for (let id of Object.keys(is_checked)) {
          if (is_checked[id]) {
            const dealer =
              dealerData &&
              dealerData.data &&
              dealerData.data.find(dealer => dealer.dealer_id === id);

            dealerArray.push(dealer);
          }
        }

        getDealerArrayCallback(dealerArray);
      }
    }

    if (
      this._form &&
      (this._form.clientWidth !== clientWidth ||
        this._form.clientHeight !== clientHeight)
    )
      this.setState({
        clientWidth: this._form.clientWidth,
        clientHeight: this._form.clientHeight
      });
  }

  openUseDetailForm() {
    const { dealer_check, openUseDetailForm } = this.props;
    openUseDetailForm(dealer_check);
  }

  handleChangePage = pageIndex => {
    this.setState({
      pageIndex
    });
  };

  submitDealerDetail = values => {
    const { is_checked, reset } = this.props;

    const dealerCount = (is_checked || []).reduce(
      (sum, value) => sum + Number(value),
      0
    );

    if (dealerCount >= 1 && dealerCount <= 3) {
      this.openUseDetailForm();
      reset();
    } else {
      throw new SubmissionError({
        _error: "Please select between one and three dealers"
      });
    }
  };

  closeModal = () => {
    const { closeModal, reset } = this.props;

    closeModal();
    reset();
  };

  handleSubmitPostalCode = postalCode => {
    const {
      changePostalCodeCallback,
      setInsurancePostalCode,
      getDealerInformation,
      setIncentivePostalCode
    } = this.props;

    setIncentivePostalCode(postalCode);
    setInsurancePostalCode(postalCode);

    if (changePostalCodeCallback) changePostalCodeCallback(postalCode);

    if (getDealerInformation) getDealerInformation(postalCode);
  };

  renderDealerDetail() {
    const {
      dealerData,
      handleSubmit,
      error,
      loaded,
      incentivePostalCode
    } = this.props;
    const { clientWidth, clientHeight } = this.state;

    const pageCount =
      Math.ceil(
        ((dealerData && dealerData.data) || []).length / DEALERS_PER_PAGE
      ) || 0;

    let { pageIndex } = this.state;
    pageIndex = Math.min(pageCount - 1, pageIndex);
    pageIndex = Math.max(0, pageIndex);

    const currentPage = ((dealerData && dealerData.data) || []).slice(
      pageIndex * DEALERS_PER_PAGE,
      (pageIndex + 1) * DEALERS_PER_PAGE
    );

    if (!loaded) {
      return (
        <ResponsiveModal.Block>
          <div
            style={{
              minWidth: clientWidth,
              minHeight: clientHeight,
              position: "relative"
            }}
          >
            <Spinner pulse color="lightgrey" scale={0.5} />
          </div>
        </ResponsiveModal.Block>
      );
    }

    return (
      <Media query={mediaQuery("xs")}>
        {mobile => (
          <form
            ref={ref => (this._form = ref)}
            onSubmit={handleSubmit(this.submitDealerDetail)}
            className={`find-dealers-modal ${error ? "has-error" : ""}`}
          >
            <ResponsiveModal.Block position="header">
              {!mobile && <h1>Have a Dealer Contact You</h1>}
              {mobile && (
                <span>
                  <h1>Select up to 3 dealers</h1>
                  <h2>In this postal code:</h2>
                </span>
              )}
            </ResponsiveModal.Block>

            <ResponsiveModal.Block position="top">
              {incentivePostalCode && (
                <ChangePostalCode
                  postalCode={incentivePostalCode}
                  onSubmit={this.handleSubmitPostalCode}
                />
              )}

              <div className="dealers-container">
                <div className="dealers-list">
                  {!mobile && (
                    <p>
                      Select up to <u>3 dealers</u> and click Submit for more
                      details
                    </p>
                  )}

                  <div className="dealers-list-inner">
                    {currentPage.map((data, i) => (
                      <Field
                        key={i}
                        component={ReduxCheckbox}
                        name={`is_checked[${data.dealer_id}]`}
                        normalize={v => !!v}
                        label={
                          <div>
                            <span className="dealers-list-name">
                              {data.dealer_name}
                            </span>
                            <p>{data.address}</p>
                            <p>
                              {data.city}, {data.state_code}
                            </p>
                          </div>
                        }
                      />
                    ))}

                    {currentPage.length === 0 && (
                      <div>No dealers found in this location</div>
                    )}
                  </div>

                  {pageCount > 0 && (
                    <nav className="dealers-list-nav">
                      {!mobile && (
                        <PageStepperSmall
                          wrapAround={false}
                          count={pageCount}
                          index={pageIndex}
                          onChange={this.handleChangePage}
                        />
                      )}

                      {mobile && (
                        <Stepper
                          orientation="horizontal"
                          first={pageIndex === 0}
                          last={pageIndex === pageCount - 1}
                          onPrevious={() =>
                            this.handleChangePage(pageIndex - 1)
                          }
                          onNext={() => this.handleChangePage(pageIndex + 1)}
                        />
                      )}
                    </nav>
                  )}
                </div>

                {!mobile && (
                  <div className="dealers-map">
                    <DealerMap mapdata={dealerData && dealerData.data} />
                  </div>
                )}
              </div>
            </ResponsiveModal.Block>

            <ResponsiveModal.Block
              position="bottom"
              grey
              className="find-dealers-foot"
            >
              <Field
                component={ReduxCheckbox}
                name={"dealer_check"}
                normalize={v => !!v}
                validate={[required]}
                label="Yes, I'd like the dealership(s) I have selected to contact me"
              />

              {error && <div className="help-block">{error}</div>}

              <PrimaryButton type="submit">
                Continue <span className="icon icon-angle-right" />
              </PrimaryButton>
            </ResponsiveModal.Block>
          </form>
        )}
      </Media>
    );
  }

  render() {
    const { modalIsOpen } = this.props;

    if (modalIsOpen) {
      return (
        <ResponsiveModal
          className="find-dealers-modal"
          onClose={this.closeModal}
          fullScreenMobile
          closeText="Cancel"
        >
          {this.renderDealerDetail()}
        </ResponsiveModal>
      );
    } else return null;
  }
}

function mapStateToProps(state) {
  const selector = formValueSelector("FindDealerModal");

  return {
    dealerData: state.MarketPlace.dealerData,
    user: state.user,
    car_details: state.MarketPlace.carDetails,
    dealer_check: selector(state, "dealer_check"),
    is_checked: selector(state, "is_checked"),
    dealer_check: selector(state, "dealer_check"),
    incentivePostalCode: state.MarketPlace.incentivePostalCode
  };
}

const mapDispatchToProps = {
  setIncentivePostalCode,
  setInsurancePostalCode
};

FindDealerModal = reduxForm({
  form: "FindDealerModal"
})(FindDealerModal);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(FindDealerModal));
