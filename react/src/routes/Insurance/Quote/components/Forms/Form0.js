import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { ReduxTextField } from "components/Forms/TextField";
import { ReduxRadioButtonGroup } from "components/Forms/RadioButtonGroup";
import {
  required,
  email,
  isChecked,
  postalCanada
} from "utils/validations";
import {
  yesNoOptions,
  driversToInsureOptions,
  vehiclesToInsureOptions
} from "./../InsuranceOptions";
import FormFooter from "./../FormFooter/";
import LabelWithInfo from "components/Forms/LabelWithInfo";
import AnimationContainer from "components/Animation/AnimationContainer";
import Animate from "components/Animation/Animate";
import FormSection from "components/Forms/FormSection";
import ErrorSummary from "components/Forms/ErrorSummary";

const validateEntireForm = values => {
  const errors = {};
  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }
  return errors;
};
const confirmEmail = (value, values) => {
  return values.email === values.email_confirm
    ? undefined
    : "Please enter same email";
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const asyncValidate = (values /*, dispatch */) => {
  return sleep(1000).then(() => {
    // simulate server latency
    if (["john", "paul", "george", "ringo"].includes(values.username)) {
      throw { username: "That username is taken" }; // eslint-disable-line
    }
  });
};

class Section0Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submitCount: 0
    };
  }

  doSubmit = e => {
    const { handleSubmit, clickNext } = this.props;
    console.log(this.props, "test submit form");
    this.setState({
      submitCount: this.state.submitCount + 1
    });

    return handleSubmit(clickNext)(e);
  };

  render() {
    const { submitting, form, errorSummaryRef } = this.props;
    const { submitCount } = this.state;

    return (
      <AnimationContainer>
        <form noValidate onSubmit={this.doSubmit}>
          <ErrorSummary
            ref={errorSummaryRef}
            form={form}
            submitCount={submitCount}
          />

          <FormSection first title={<h3>Basic information</h3>}>
            <FormSection>
              <Animate>
                <Field
                  name="email"
                  type="email"
                  disabled={submitting}
                  component={ReduxTextField}
                  label={
                    <LabelWithInfo
                      title="Email address"
                      content="This email will serve as your username when logging into your account to retrieve your quotes and/or policies."
                    >
                      Email address
                    </LabelWithInfo>
                  }
                  shortLabel="Email address"
                  required
                  autoFocus
                  validate={[required, email]}
                />
              </Animate>

              <Animate>
                <Field
                  name="email_confirm"
                  type="email"
                  disabled={submitting}
                  component={ReduxTextField}
                  label="Confirm email address"
                  validate={[required, email, confirmEmail]}
                />
              </Animate>

              <Animate>
                <Field
                  name="postal"
                  type="text"
                  disabled={submitting}
                  component={ReduxTextField}
                  label={
                    <LabelWithInfo
                      title="Postal code"
                      content="Your postal code is used for validation purposes."
                    >
                      Postal code
                    </LabelWithInfo>
                  }
                  shortLabel="Postal code"
                  validate={[required, postalCanada]}
                  size="short"
                />
              </Animate>
            </FormSection>

            <FormSection>
              <Animate>
                <Field
                  name="vehiclesToInsure"
                  component={ReduxRadioButtonGroup}
                  options={vehiclesToInsureOptions}
                  label={
                    <LabelWithInfo
                      title="How many vehicles?"
                      content="If you insure more than one vehicle with the same company, you may be eligible for a multi-vehicle discount."
                    >
                      How many vehicles would you like to insure?
                    </LabelWithInfo>
                  }
                  shortLabel="How many vehicles?"
                />
              </Animate>

              <Animate>
                <Field
                  name="driversToInsure"
                  component={ReduxRadioButtonGroup}
                  options={driversToInsureOptions}
                  label={
                    <LabelWithInfo
                      title="How many drivers?"
                      content="Insurance companies consider the number of drivers and their driving records when generating premiums."
                    >
                      How many drivers would you like to insure?
                    </LabelWithInfo>
                  }
                  shortLabel="How many drivers?"
                />
              </Animate>
            </FormSection>
          </FormSection>

          <Animate last>
            <FormFooter {...this.props} />
          </Animate>
        </form>
      </AnimationContainer>
    );
  }
}

const InsuranceSection0Form = reduxForm({
  form: "insuranceSection0Form",
  // fields: ['firstname', 'lastname', 'username', 'password', 'password_confirmation', 'email'],
  validateEntireForm,
  // asyncValidate,
  // asyncBlurFields: ['username', 'email'],
  initialValues: {
    vehiclesToInsure: "1",
    driversToInsure: "1"
  },
  destroyOnUnmount: false // <------ preserve form data
  // forceUnregisterOnUnmount: true // <------ unregister fields on unmount
})(Section0Form);

export default connect(
  (state, ownProps) => ({
    //formState: state.form.insuranceSection0Form
  }),
  dispatch => ({
    // onShowInfoModal: dispatch(SHOW_INFO_MODAL)
    // onSubmit: data => dispatch(myActionToDoStuff(data))
  })
)(InsuranceSection0Form);
