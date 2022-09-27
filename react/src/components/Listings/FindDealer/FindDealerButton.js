import React from "react";
import FindDealerModal from "./FindDealerModal";
import { connect } from "react-redux";
import { reset } from "redux-form";
import PostalCodeField from "components/Listings/ChangePostalCode";
import UserDetailPopup from "./UserDetailPopup";
import ConfirmMessageModal from "./ConfirmMessageModal";
import PrimaryButton from "components/Forms/PrimaryButton";
import {
  findDealerInfo,
  getIncentiveData,
  setIncentivePostalCode,
  setInsurancePostalCode
} from "redux/actions/marketPlaceActions";
import { showNotification } from "redux/actions/notificationAction";

class FindDealerButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      userDetailModal: false,
      confirmMsgModal: false,
      postalCode: props.postalCode,
      dealerArray: [],
      loaded: true,
      showPostalTab: false
    };
  }

  openDealerContactModal = postalCode => {
    const {
      car_details,
      findDealerInfo,
      getIncentiveData,
      division,
      incentivePostalCode
    } = this.props;
    const dealerPostalCode = postalCode || incentivePostalCode;

    if (!dealerPostalCode) {
      this.setState({
        showPostalTab: true
      });
      return false;
    }
    this.setState({
      loaded: false
    });
    const requiredParams = {
      postal_code: dealerPostalCode,
      division: division,
      search_radius: "500"
    };
    findDealerInfo(requiredParams).then(data => {
      this.setState({ loaded: true, modalIsOpen: true });
    });
    const paramsData = {
      postal_code: dealerPostalCode.toUpperCase(),
      uid: car_details.uid,
      year: car_details.year
    };
    getIncentiveData(paramsData);
  };

  openUserDetailModal = () => {
    this.setState({ userDetailModal: true });
  };

  closeModal = () => {
    const { reset } = this.props;
    reset("FindDealerModal");
    this.setState({ modalIsOpen: false, dealerArray: [] });
  };

  closeUserDetailModal = () => {
    this.setState({ userDetailModal: false, dealerArray: [] });
  };

  closeConfirmMessageModal = () => {
    this.setState({
      confirmMsgModal: false,
      dealerArray: []
    });
  };

  handlePostalCodeSubmit = postalCode => {
    const { setIncentivePostalCode, setInsurancePostalCode } = this.props;

    setIncentivePostalCode(postalCode);
    setInsurancePostalCode(postalCode);

    this.setState({
      postalCode,
      showPostalTab: false
    });

    this.openDealerContactModal(postalCode);
  };

  openUseDetailForm = selected => {
    const { dealerArray } = this.state;
    if (dealerArray.length > 3) {
      this.setState({
        modalIsOpen: true,
        userDetailModal: false
      });
      this.props.showNotification({
        message: "Please select up to 3 dealers",
        type: "ERROR"
      });
    } else if (dealerArray.length > 0 && selected) {
      this.setState({
        modalIsOpen: false,
        userDetailModal: true
      });
    }
  };

  getDealerArrayCallback = val => {
    this.setState({
      dealerArray: val
    });
  };

  showConfirmationMessage = bool => {
    this.setState({
      confirmMsgModal: bool,
      userDetailModal: false,
      dealerArray: []
    });
  };

  handleSCILeadError = bool => {
    this.setState({
      dealerArray: []
    });
  };

  render() {
    const {
      incentivePostalCode,
      className
    } = this.props;
    const {
      modalIsOpen,
      loaded,
      dealerArray,
      confirmMsgModal,
      userDetailModal
    } = this.state;

    const postalCode = this.state.postalCode || incentivePostalCode;

    if (incentivePostalCode) this.state.showPostalTab = false;

    return (
      <div>
        {!this.state.showPostalTab ? (
          <PrimaryButton
            className={className}
            type="button"
            size="medium"
            onClick={() => this.openDealerContactModal()}
          >
            Find a dealer
          </PrimaryButton>
        ) : (
          ""
        )}
        <FindDealerModal
          modalIsOpen={modalIsOpen}
          closeModal={this.closeModal}
          openUseDetailForm={this.openUseDetailForm}
          getDealerArrayCallback={this.getDealerArrayCallback}
          loaded={loaded}
          getDealerInformation={this.openDealerContactModal}
        />
        <UserDetailPopup
          modalIsOpen={userDetailModal}
          closeModal={this.closeUserDetailModal}
          openUserDetailModal={this.openUserDetailModal}
          dealerArray={dealerArray}
          showConfirmationMessage={this.showConfirmationMessage}
          handleSCILeadError={this.handleSCILeadError}
        />
        <ConfirmMessageModal
          modalIsOpen={confirmMsgModal}
          closeModal={this.closeConfirmMessageModal}
        />
        {this.state.showPostalTab && (
          <PostalCodeField
            value={postalCode}
            onSubmit={this.handlePostalCodeSubmit}
          />
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    dealerData: state.MarketPlace.dealerData,
    user: state.user,
    car_details: state.MarketPlace.carDetails,
    incentivePostalCode: state.MarketPlace.incentivePostalCode
  };
}

const mapDispatchToProps = {
  findDealerInfo,
  getIncentiveData,
  reset,
  setIncentivePostalCode,
  setInsurancePostalCode,
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FindDealerButton);

FindDealerButton.defaultProps = {
  onClick: () => {}
};
