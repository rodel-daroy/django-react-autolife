import React, { Component } from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { datePurchasedLeasedOptions } from "./../InsuranceOptions";
import { ReduxDropdownField } from "components/Forms/DropdownField";
import { required } from "utils/validations";
import FormFooter from "./../FormFooter/";
import filter from "lodash/filter";
import AnimationContainer from "components/Animation/AnimationContainer";
import Animate from "components/Animation/Animate";
import FormSection from "components/Forms/FormSection";
import LabelWithInfo from "components/Forms/LabelWithInfo";
import ErrorSummary from "components/Forms/ErrorSummary";

class Section3Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submitCount: 0
    };
  }

  doSubmit = e => {
    const { handleSubmit, clickNext } = this.props;

    this.setState({
      submitCount: this.state.submitCount + 1
    });

    return handleSubmit(clickNext)(e);
  };

  render() {
    const {
      clickNext,
      error,
      vehicles,
      invalid,
      makes,
      models,
      years,
      pristine,
      submitting,
      handleSubmit,
      drivers,
      form,
      errorSummaryRef
    } = this.props;
    const { submitCount } = this.state;

    let driverOptions = [];
    let makeArray = [];
    let modelArray = [];
    let yearArray = [];
    for (let index = 0; index < drivers.length; index++) {
      const driver = drivers[index];
      driverOptions.push({
        label: `${driver.firstname} ${driver.lastname}`,
        value: index
      });
    }
    return (
      <AnimationContainer>
        <form noValidate onSubmit={this.doSubmit}>
          <ErrorSummary
            ref={errorSummaryRef}
            form={form}
            submitCount={submitCount}
          />

          <FormSection
            first
            title={
              <h3>
                Please select the primary
                <br />
                operator of each vehicle
              </h3>
            }
          >
            {console.log(vehicles)}
            {vehicles.map((e, i) => (
              <Animate key={i}>
                <Field
                  label={
                    <LabelWithInfo
                      title=""
                      content="Please select the primary driver of each vehicle. This should be the driver who operates the vehicle most often."
                    >
                      {`${e.vehicle_year} ${e.vehicle_make} ${
                        e.vehicle_model
                      } ${e.VIN ? `[VIN: ${e.VIN}]` : ""}`}
                    </LabelWithInfo>
                  }
                  shortLabel="Driver for vehicle"
                  name={`driverForVehicle-${i}`}
                  component={ReduxDropdownField}
                  placeholder="Driver name"
                  options={driverOptions}
                />
              </Animate>
            ))}
          </FormSection>

          <Animate last>
            <FormFooter {...this.props} />
          </Animate>
        </form>
      </AnimationContainer>
    );
  }
}

const InsuranceSection3Form = reduxForm({
  form: "insuranceSection3Form",
  destroyOnUnmount: false
})(Section3Form);

export default connect((state, ownProps) => ({
  //formState: state.form.insuranceSection3Form,
  //formStateSection0: state.form.insuranceSection0Form,
  makes: state.insurance.makes,
  models: state.insurance.models,
  years: state.insurance.years
}))(InsuranceSection3Form);
