import React, { Component } from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { ReduxRadioButtonGroup } from "components/Forms/RadioButtonGroup";
import { ReduxTextField } from "components/Forms/TextField";
import {
  yesNoOptions,
  datePurchasedLeasedOptions,
  primaryUseOptions,
  newUsedOptions,
  ownLeaseOptions,
  coverageOptions,
  dateDropdown
} from "./../InsuranceOptions";
import { ReduxDropdownField } from "components/Forms/DropdownField";
import {
  required,
  isNumber
} from "utils/validations";
import CoverageTable from "./../CoverageTable/";
import FormFooter from "./../FormFooter/";
import uniqWith from "lodash/uniqWith";
import isEqual from "lodash/isEqual";
import {
  getMakeList,
  getYearList,
  getModelList
} from "redux/actions/insuranceActions";
import DateField from "../DateField";
import ALField from "components/Forms/Field";
import AnimationContainer from "components/Animation/AnimationContainer";
import Animate from "components/Animation/Animate";
import get from "lodash/get";
import FormSection from "components/Forms/FormSection";
import LabelWithInfo from "components/Forms/LabelWithInfo";
import ErrorSummary from "components/Forms/ErrorSummary";
import { showInfoModal } from "redux/actions/infoModalActions";
import { PhoneLink } from "components/Decorators/WithPhoneLink";
import {
  INSURANCE_PHONE_TEXT,
  INSURANCE_PHONE
} from "config/constants";
import { minValue } from "utils/validations/index";

const isNotBusinessUse = value => {
  if (
    (primaryUseOptions.find(option => option.value == value) || {})
      .showBusinessModal
  )
    return "Please select a use that isn't 'Business' or 'Commercial'";
  else return undefined;
};

class Section2Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submitCount: 0,
      selectedYears: this.getSelectedYears(props.years),
      selectedMakes: this.getSelectedMakes(props.makes),
      filteredModels: this.getFilteredModels(props.models)
    };
  }

  componentDidMount() {
    const { getYearList } = this.props;
    getYearList();
  }

  dropDownChange = (model, value) => {
    console.log(value, "modelvalue");
    const { change, getMakeList, getModelList } = this.props;
    if (model === "year") getMakeList(value.value);
    else if (model === "make") getModelList(value.value);
    change("model", null);
  };

  doSubmit = e => {
    const { handleSubmit, clickNext } = this.props;

    this.setState({
      submitCount: this.state.submitCount + 1
    });

    return handleSubmit(clickNext)(e);
  };

  handlePrimaryUseChange = (e, newValue, prevValue) => {
    console.log(newValue, "new");
    console.log(primaryUseOptions, "pri");
    const option = primaryUseOptions.find(
      option => option.value === newValue.value
    );
    console.log(option, "option");
    if (option.showBusinessModal)
      this.props.showInfoModal(
        null,
        <div>
          <p>For business or commercial insurance please call HUB:</p>
          <h2>
            <PhoneLink
              className="btn btn-link primary-link phone-link"
              phone={INSURANCE_PHONE}
              phoneWords={INSURANCE_PHONE_TEXT}
            >
              <span className="icon icon-phone" />
              {INSURANCE_PHONE_TEXT}
            </PhoneLink>
          </h2>
        </div>
      );
  };

  getSelectedYears = years => {
    return years && years.data
      ? years.data.map(item => ({ value: item.name, label: item.name }))
      : [];
  };

  getSelectedMakes = makes => {
    console.log(makes, "makes");
    return makes && makes.data
      ? makes.data.map(item => ({ value: item.name, label: item.name }))
      : [];
  };

  getFilteredModels = models => {
    const selectedModels =
      models && models.data
        ? models.data.map(item => ({ value: item.name, label: item.name }))
        : [];
    return uniqWith(selectedModels, isEqual);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.years !== this.props.years)
      this.setState({
        selectedYears: this.getSelectedYears(nextProps.years)
      });

    if (nextProps.makes !== this.props.makes)
      this.setState({
        selectedMakes: this.getSelectedMakes(nextProps.makes)
      });

    if (nextProps.models !== this.props.models)
      this.setState({
        filteredModels: this.getFilteredModels(nextProps.models)
      });
  }

  render() {
    const {
      vehicleIndex,
      currentVehicle,
      clickNext,
      makes,
      years,
      models,
      invalid,
      pristine,
      submitting,
      handleSubmit,
      primaryUse,
      form,
      errorSummaryRef
    } = this.props;
    const {
      submitCount,
      selectedYears,
      selectedMakes,
      filteredModels
    } = this.state;

    const coverage = this.props.coverage || 0;
    console.log(this.props.coverage, "coverage");
    return (
      <AnimationContainer>
        {currentVehicle == vehicleIndex && (
          <form noValidate onSubmit={this.doSubmit}>
            <ErrorSummary
              ref={errorSummaryRef}
              form={form}
              submitCount={submitCount}
            />

            <FormSection first title={<h3>Vehicle 0{vehicleIndex + 1}</h3>}>
              <FormSection>
                <Animate>
                  <ALField
                    name="vehicle"
                    label={
                      <LabelWithInfo
                        title="Vehicle"
                        content="Please input your vehicle information following the format 'YEAR MAKE MODEL'. We need you to select your vehicle from the suggestions that appear as you type."
                      >
                        Select your vehicle
                      </LabelWithInfo>
                    }
                    inputComponent={props => (
                      <div className="vehicle-field">
                        <Field
                          className="vehicle-field-year"
                          name="vehicle_year"
                          onChange={(event, value) => {
                            this.dropDownChange("year", value);
                          }}
                          component={ReduxDropdownField}
                          placeholder="Year"
                          options={selectedYears}
                          validate={[required]}
                          shortLabel="Vehicle make"
                          parentField="vehicle"
                        />
                        <Field
                          className="vehicle-field-make"
                          name="vehicle_make"
                          onChange={(event, value) => {
                            this.dropDownChange("make", value);
                          }}
                          component={ReduxDropdownField}
                          placeholder="Make"
                          options={selectedMakes}
                          validate={[required]}
                          shortLabel="Vehicle model"
                          parentField="vehicle"
                        />
                        <Field
                          className="vehicle-field-model"
                          name="vehicle_model"
                          component={ReduxDropdownField}
                          placeholder="Model"
                          options={filteredModels}
                          validate={[required]}
                          shortLabel="Vehicle year"
                          parentField="vehicle"
                        />
                      </div>
                    )}
                  />
                </Animate>

                <Animate>
                  <Field
                    name="VIN"
                    disabled={submitting}
                    component={ReduxTextField}
                    label="VIN (optional)"
                  />
                </Animate>
              </FormSection>

              <FormSection>
                <Animate>
                  <DateField
                    name="purchaseDate"
                    label={
                      <LabelWithInfo
                        title="Date purchased / leased"
                        content="Certain insurance coverage's are only available for vehicles that were purchased new, within a certain time frame."
                      >
                        Date purchased / leased
                      </LabelWithInfo>
                    }
                    shortLabel="purchased / leased"
                    dayField="purchase_day"
                    monthField="purchase_month"
                    yearField="purchase_year"
                    options={dateDropdown}
                  />
                </Animate>

                <Animate>
                  <Field
                    name="purchaseprice"
                    disabled={submitting}
                    component={ReduxTextField}
                    label={
                      <LabelWithInfo
                        title="Purchase price"
                        content="The purchase price can be found on your bill of sale or lease agreement. If this is a vehicle that you have owned for some time, please enter the price you paid for the vehicle at the time of purchase."
                      >
                        Purchase price
                      </LabelWithInfo>
                    }
                    shortLabel="Purchase price"
                    prefix="$"
                    type="number"
                    validate={[required, isNumber, minValue(0)]}
                    size="short"
                  />
                </Animate>
              </FormSection>

              <FormSection>
                <Animate>
                  <Field
                    label="Primary use of the vehicle"
                    shortLabel="Primary use of vehicle"
                    name="primaryUse"
                    validate={[required, isNotBusinessUse]}
                    component={ReduxDropdownField}
                    options={primaryUseOptions}
                    onChange={this.handlePrimaryUseChange}
                    searchable={false}
                    className="primary-use-field"
                  />
                </Animate>
                {console.log(primaryUse, "primaryUse")}
                {primaryUse && primaryUse.value == "3" && (
                  <FormSection nested>
                    <AnimationContainer>
                      <Animate>
                        <Field
                          name="workSchool"
                          type="text"
                          disabled={submitting}
                          component={ReduxTextField}
                          label={
                            <LabelWithInfo
                              title="How you get to work / school"
                              content="For insurance underwriting purposes it is important to clarify how many km's your vehicle is being used per year. This figure is important when assessing the risk accurately."
                            >
                              How you get to work / school
                            </LabelWithInfo>
                          }
                          shortLabel="How you get to work / school"
                          validate={[required]}
                          size="short"
                          last
                        />
                      </Animate>
                    </AnimationContainer>
                  </FormSection>
                )}

                {primaryUse && primaryUse.value == "1" && (
                  <FormSection nested>
                    <AnimationContainer>
                      <Animate>
                        <Field
                          name="distanceDaily"
                          type="number"
                          disabled={submitting}
                          component={ReduxTextField}
                          label={
                            <LabelWithInfo
                              title="Kilometres driven one way"
                              content="For insurance underwriting purposes it is important to clarify how many km's your vehicle is being used per day. This figure is important when assessing the risk accurately."
                            >
                              Kilometres driven one way to work / school
                            </LabelWithInfo>
                          }
                          shortLabel="Kilometres driven one way"
                          suffix="km"
                          validate={[required, isNumber, minValue(0)]}
                          size="short"
                          last
                        />
                      </Animate>
                    </AnimationContainer>
                  </FormSection>
                )}
              </FormSection>
              <FormSection>
                <Animate>
                  <Field
                    name="drivenAnnually"
                    type="number"
                    disabled={submitting}
                    component={ReduxTextField}
                    label={
                      <LabelWithInfo
                        title="Kilometers driven annually"
                        content="For insurance underwriting purposes it is important to clarify how many km's your vehicle is being used per year. This figure is important when assessing the risk accurately."
                      >
                        Kilometers driven annually
                      </LabelWithInfo>
                    }
                    shortLabel="Kilometers driven annually"
                    suffix="km"
                    validate={[required, isNumber, minValue(0)]}
                    size="short"
                    last
                  />
                </Animate>
              </FormSection>

              <FormSection>
                <Animate>
                  <Field
                    name="ownOrLease"
                    label="Vehicle owned or leased"
                    shortLabel="Vehicle owned or leased"
                    component={ReduxRadioButtonGroup}
                    options={ownLeaseOptions}
                    validate={[required]}
                  />
                </Animate>

                <Animate>
                  <Field
                    name="newOrUsed"
                    label={
                      <LabelWithInfo
                        title="Vehicle new or used"
                        content="Certain insurance coverage's are only available for vehicles that were purchased new, within a certain time frame."
                      >
                        Vehicle new or used
                      </LabelWithInfo>
                    }
                    shortLabel="Vehicle new or used"
                    component={ReduxRadioButtonGroup}
                    options={newUsedOptions}
                    validate={[required]}
                  />
                </Animate>

                <Animate>
                  <Field
                    name="winterTires"
                    label={
                      <LabelWithInfo
                        title="Equipped with winter tires during winter"
                        content="Some insurance companies offer a discount if you install winter tires on your vehicle during the months of November through April. However, only tires labelled as a 'winter tire', as approved by Transport Canada, may qualify for this discount."
                      >
                        Is the vehicle equipped with 4 winter tires during the
                        winter months?
                      </LabelWithInfo>
                    }
                    shortLabel="Equipped with winter tires during winter"
                    component={ReduxRadioButtonGroup}
                    options={yesNoOptions}
                    validate={[required]}
                  />
                </Animate>
              </FormSection>
            </FormSection>

            <Animate>
              <FormSection title={<h3>Coverage</h3>}>
                <FormSection>
                  <Field
                    name="coverage"
                    label={
                      <LabelWithInfo
                        title="Select the coverage"
                        content="Certain insurance coverage's are only available for vehicles that were purchased new, within a certain time frame."
                      >
                        Select the coverage that is best for you
                      </LabelWithInfo>
                    }
                    shortLabel="Select the coverage"
                    component={ReduxRadioButtonGroup}
                    options={coverageOptions}
                    validate={[required]}
                  />

                  <CoverageTable coverageSelected={coverage} />
                </FormSection>
              </FormSection>
            </Animate>

            <Animate last>
              <FormFooter {...this.props} />
            </Animate>
          </form>
        )}
      </AnimationContainer>
    );
  }
}

const InsuranceSection2Form = reduxForm({
  // fields: ['firstname', 'lastname'],
  // validateEntireForm, // <--- validation function given to redux-form
  initialValues: {
    // newOrUsed: yesNoOptions[0].value,
    coverage: coverageOptions[1].value
  },
  destroyOnUnmount: false // <------ preserve form data
  // forceUnregisterOnUnmount: true // <------ unregister fields on unmount
})(Section2Form);

const FormWrapper = connect((state, ownProps) => ({
  form: `insuranceSection2-Vehicle${ownProps.vehicleIndex}-Form`
}))(InsuranceSection2Form);

function mapStateToProps(state, ownProps) {
  const formName = `insuranceSection2-Vehicle${ownProps.vehicleIndex}-Form`;
  const formValues = get(state, `form['${formName}'].values`, {});

  return {
    coverage: formValues.coverage,
    primaryUse: formValues.primaryUse,
    makes: state.insurance.makes,
    models: state.insurance.models,
    years: state.insurance.years
  };
}
const mapDispatchToProps = {
  getMakeList,
  getYearList,
  getModelList,
  showInfoModal
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormWrapper);
