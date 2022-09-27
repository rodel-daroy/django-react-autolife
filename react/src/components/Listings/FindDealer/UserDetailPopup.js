import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import DealerFormInput from "./DealerFormInput";
import { ReduxTextField } from "../../Forms/TextField";
import { ReduxCheckbox } from "../../Forms/Checkbox";
import { Field, reduxForm, initialize, formValueSelector } from "redux-form";
import PrimaryButton from "../../Forms/PrimaryButton";
import { showNotification } from "../../../redux/actions/notificationAction";
import { getUserSubscribeMonthly } from "../../../redux/actions/userActions";
import ResponsiveModal from "../../common/ResponsiveModal";
import Commands from "../../common/Commands";
import get from "lodash/get";
import { required, email } from "../../../utils/validations";
import {
  getLead,
  getContactConfirm
} from "../../../redux/actions/marketPlaceActions";
import { LEAD_REQUESTED } from "../../../redux/actiontypes/marketPlacetypes";
class UserDetailPopup extends React.Component {
  submitUserDetails = values => {
    const {
      car_details_data,
      car_details,
      match: { params },
      incentivePostalCode,
      sign_up
    } = this.props;
    const accessToken = get(this.props, "user.authUser.accessToken");
    console.log(values, "valuesssss");
    let submitParams;
    const DealerName = this.props.dealerArray.map(dealer => {
      return dealer.dealer_name[0];
    });
    let EmailParams;
    if (car_details_data !== null) {
      EmailParams = {
        first_name: values.first_name,
        last_name: values.last_name,
        make: car_details_data.make,
        model: car_details_data.model,
        year: parseInt(car_details_data.year),
        receipient_email: values.email,
        dealers: DealerName
      };
      submitParams = {
        dealer_details: this.props.dealerArray,
        first_name: values.first_name,
        last_name: values.last_name,
        monthly_newsletter_subscription: values.sign_up,
        city: values.city,
        email: values.email,
        contact_num: values.contact_num,
        postal_code: incentivePostalCode,
        make: car_details_data.make,
        year: parseInt(car_details_data.year),
        model: car_details_data.model,
        trim: car_details_data.trim_name,
        price: car_details_data.price,
        vehicle_id: params.trim_id,
        body_style: car_details_data.body_style
      };
    } else {
      EmailParams = {
        first_name: values.first_name,
        last_name: values.last_name,
        make: car_details && car_details.data && car_details.data.make,
        model: car_details && car_details.data && car_details.data.model,
        year: parseInt(
          car_details && car_details.data && car_details.data.year
        ),
        receipient_email: values.email,
        dealers: DealerName
      };
      submitParams = {
        dealer_details: this.props.dealerArray,
        first_name: values.first_name,
        last_name: values.last_name,
        monthly_newsletter_subscription: values.sign_up,
        city: values.city,
        email: values.email,
        contact_num: values.contact_num,
        postal_code: incentivePostalCode,
        make: car_details && car_details.data && car_details.data.make,
        year: parseInt(
          car_details && car_details.data && car_details.data.year
        ),
        model: car_details && car_details.data && car_details.data.model,
        trim: car_details && car_details.data && car_details.data.trim_name,
        price: car_details && car_details.data && car_details.data.price,
        vehicle_id: params.trim_id,
        body_style:
          car_details && car_details.data && car_details.data.body_style
      };
    }
    const SubscribeParams = {
      email: values.email,
      first_name: values.first_name,
      last_name: values.last_name
    };
    if (sign_up) {
      this.props.getLead(submitParams, accessToken).then(data => {
        console.log(data, "status-check");
        if (data.status === 200) {
          const { showConfirmationMessage } = this.props;
          showConfirmationMessage(true);
          this.props.getContactConfirm(EmailParams, accessToken);
        } else {
          const { handleSCILeadError } = this.props;
          handleSCILeadError(true);
        }
      });
      this.props.getUserSubscribeMonthly(SubscribeParams).then(data => {
        console.log(data, "subscribe-data");
        if (data.payload.status === 200) {
          const message =
            data.message === "subscribed"
              ? "Email subscribed successfully"
              : data.payload.message.message;
          this.props.showNotification({ message });
        } else if (data.payload.status === 400) {
          const message = data.payload.message.message;
          this.props.showNotification({ message });
        }
      });
    } else {
      this.props.getContactConfirm(EmailParams, accessToken);
      this.props.getLead(submitParams, accessToken).then(data => {
        console.log(data, "status-check");
        if (data.status === 200) {
          const { showConfirmationMessage } = this.props;
          showConfirmationMessage(true);
        } else {
          const { handleSCILeadError } = this.props;
          handleSCILeadError(true);
        }
      });
    }
  };

  render() {
    const { handleSubmit, submitting, closeModal, modalIsOpen } = this.props;
    if (modalIsOpen) {
      return (
        <ResponsiveModal
          onClose={closeModal}
          fullScreenMobile
          closeText="Cancel"
        >
          <ResponsiveModal.Block position="header">
            <h1>Have a Dealer Contact You</h1>
            <h2>
              Submit this form and a dealer representative will be in touch
              shortly.
            </h2>
          </ResponsiveModal.Block>

          <form
            className="leads-form"
            onSubmit={handleSubmit(this.submitUserDetails)}
          >
            <ResponsiveModal.Block position="top">
              <div className="leads-form-inner">
                <DealerFormInput
                  id="name"
                  name="first_name"
                  type="text"
                  label="First Name"
                  validation_msg="Enter first name"
                />
                <DealerFormInput
                  id="last name"
                  name="last_name"
                  type="text"
                  label="Last Name"
                  validation_msg="Enter last name"
                />
                <DealerFormInput
                  id="city"
                  name="city"
                  type="text"
                  label="City"
                />

                <Field
                  component={ReduxTextField}
                  name="email"
                  type="email"
                  validate={[required, email]}
                  label="Email Address"
                />

                <DealerFormInput
                  id="mobile_no"
                  name="contact_num"
                  type="tel"
                  label="Mobile Tel. (If you prefer to be contacted this way)"
                />

                <Field
                  component={ReduxCheckbox}
                  name={"sign_up"}
                  label="Sign me up for the Autolife Newsletter"
                />
              </div>
            </ResponsiveModal.Block>

            <ResponsiveModal.Block position="bottom" grey>
              <Commands>
                <PrimaryButton type="submit" disabled={submitting}>
                  Continue
                </PrimaryButton>
              </Commands>
            </ResponsiveModal.Block>
          </form>
        </ResponsiveModal>
      );
    } else return null;
  }
}

function mapStateToProps(state) {
  const initialValues = get(state, "user.authUser.user.user_details");
  const selector = formValueSelector("UserDetailPopup");

  return {
    dealerData: state.MarketPlace.dealerData,
    user: state.user,
    car_details_data: state.MarketPlace.carDetailData,
    car_details: state.MarketPlace.carDetails,
    sign_up: selector(state, "sign_up"),
    incentivePostalCode: state.MarketPlace.incentivePostalCode,
    initialValues
  };
}

const mapDispatchToProps = {
  getLead,
  getContactConfirm,
  getUserSubscribeMonthly,
  showNotification
};

UserDetailPopup = reduxForm({
  form: "UserDetailPopup",
  enableReinitialize: true
})(UserDetailPopup);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UserDetailPopup));
