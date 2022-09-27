import React from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import cloneDeep from "lodash/cloneDeep";
import { ReduxTextField } from "../../../../../components/Forms/TextField";
import {
  required,
  postalCanada,
  email
} from "../../../../../utils/validations";
import { showInfoModal } from "../../../../../redux/actions/infoModalActions";
import FormFooter from "./../../components/FormFooter";

class TradeInValueStepFourForm extends React.Component {
  constructor(props) {
    super(props);
    this.continueNextStep = this.continueNextStep.bind(this);
  }

  componentDidMount() {
    const { initialize, user } = this.props;
    const initialValues = cloneDeep(user);
    const useInfo =
      user.authUser && user.authUser.user
        ? user.authUser.user.user_details
        : "";
    initialValues.personal_information = Object.assign(useInfo);
    // initialize(initialValues);
  }

  continueNextStep(values) {
    this.props.onContinueNextStep(values);
  }

  render() {
    const { handleSubmit, submitting, showModal } = this.props;
    return (
      <form
        noValidate
        onSubmit={handleSubmit(values => {
          this.continueNextStep(values);
        })}
      >
        <h3>Contact Information</h3>
        <div
          className="form-group"
          style={{ marginTop: "80px", marginBottom: "80px" }}
        >
          <Field
            component={ReduxTextField}
            id="name"
            label="First Name"
            validate={[required]}
            name="personal_information.first_name"
            type="text"
            placeholder="First Name"
          />
        </div>
        <div
          className="form-group"
          style={{ marginTop: "80px", marginBottom: "80px" }}
        >
          <Field
            label="Last Name"
            component={ReduxTextField}
            validate={[required]}
            id="last_name"
            name="personal_information.last_name"
            type="text"
            placeholder="Last Name"
          />
        </div>
        <div
          className="form-group"
          style={{ marginTop: "80px", marginBottom: "80px" }}
        >
          <Field
            validate={[required, email]}
            label="Email"
            component={ReduxTextField}
            id="email"
            name="personal_information.email"
            type="text"
            placeholder="Email"
          />
        </div>
        <div
          className="form-group"
          style={{ marginTop: "80px", marginBottom: "80px" }}
        >
          <Field
            name="postalcode"
            style={{ maxWidth: "400px" }}
            type="text"
            disabled={submitting}
            component={ReduxTextField}
            label="Postal Code"
            validate={[required, postalCanada]}
          />
          <button
            type="button"
            className="text-button btn-link"
            onClick={() => {
              showModal(
                "Why we ask for Postal code",
                "Why we ask for Postal code"
              );
            }}
          >
            Why we ask for Postal code?
          </button>
        </div>
        {/* <button type="button" style={{ color: '#131212' }} className="btn btn-link dark skip-button" onClick={this.continueNextStep}>Skip this &gt;</button> */}
        <FormFooter {...this.props} />
      </form>
    );
  }
}

const mapStateToProps = state => ({
  formState: state.form.TradeInValueStepFour,
  user: state.user
});

const TradeInValueStepFour = reduxForm({
  form: "TradeInValueStepFour",
  destroyOnUnmount: false
})(TradeInValueStepFourForm);

const mapDispatchToProps = {
  showModal: showInfoModal
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TradeInValueStepFour);
