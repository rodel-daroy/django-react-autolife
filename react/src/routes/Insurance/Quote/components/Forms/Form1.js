import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import {
  required,
  minLength,
  maxLength,
  postalCanada
} from "utils/validations";
import { ReduxTextField } from "components/Forms/TextField";
import { connect } from "react-redux";
import { ReduxRadioButtonGroup } from "components/Forms/RadioButtonGroup";
import { ReduxDropdownField } from "components/Forms/DropdownField";
import {
  yesNoOptions,
  genderOptions,
  severityConviction,
  birthDayOptions,
  maritalOptions,
  licenseClassOptions,
  licenseObtainedOptions,
  lapseOptions,
  cancelReasonOptions,
  claimTypeOptions,
  licenseGClassOptions,
  ticketsRecievedOptions,
  claimsOptions,
  yearsInsuredOptions,
  policiesCancelledOptions,
  criminalSeverity,
  majorSeverity,
  minorSeverity,
  retiredOptions,
  dateDropdown,
  licenseSuspendDateDropdwon,
  licenseDate,
  suspensionOptions
} from "./../InsuranceOptions";
import FormFooter from "./../FormFooter/";
import LabelWithInfo from "components/Forms/LabelWithInfo";
import DateField from "../DateField";
import AnimationContainer from "components/Animation/AnimationContainer";
import Animate from "components/Animation/Animate";
import { AnimationOptions } from "components/Animation";
import get from "lodash/get";
import ALField from "components/Forms/Field";
import FormSection from "components/Forms/FormSection";
import ErrorSummary from "components/Forms/ErrorSummary";
import moment from "moment";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

class Section1Form extends Component {
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
      driverIndex,
      currentDriver,
      clickNext,
      error,
      invalid,
      pristine,
      submitting,
      handleSubmit,
      ticketsToInsure,
      claimsInvolved,
      cancelPolicy,
      licenseClass,
      licenseSuspend,
      suspendedDuration,
      driverInsured,
      driverListedInsured,
      licenseYear,
      licenseMonth,
      licenseDay,
      severity_conviction,
      form,
      errorSummaryRef
    } = this.props;
    const { submitCount } = this.state;

    let selectedDate = moment(0);
    if (licenseYear && licenseMonth && licenseDay) {
      console.log(licenseYear, "ly");
      console.log(licenseMonth, "lm");
      console.log(licenseDay, "ld");
      selectedDate = moment({
        year: licenseYear.value,
        month: parseInt(licenseMonth.value) - 1,
        day: licenseDay.value
      });
    }
    const licenseOptions = selectedDate.isAfter(licenseDate)
      ? licenseClassOptions
      : licenseGClassOptions;

    return (
      <AnimationContainer>
        {currentDriver == driverIndex && (
          <form noValidate onSubmit={this.doSubmit}>
            <ErrorSummary
              ref={errorSummaryRef}
              form={form}
              submitCount={submitCount}
            />

            <FormSection first title={<h3>Driver 0{driverIndex + 1}</h3>}>
              <FormSection>
                <Animate>
                  <Field
                    name="firstname"
                    label={
                      <LabelWithInfo title="" content="Your given name">
                        First name
                      </LabelWithInfo>
                    }
                    shortLabel="First name"
                    type="text"
                    disabled={submitting}
                    component={ReduxTextField}
                    autoFocus
                    validate={required}
                  />
                </Animate>

                <Animate>
                  <Field
                    name="lastname"
                    type="text"
                    disabled={submitting}
                    component={ReduxTextField}
                    label={
                      <LabelWithInfo
                        title=""
                        content="A surname, family name, or last name"
                      >
                        Last name
                      </LabelWithInfo>
                    }
                    shortLabel="Last name"
                    validate={[required]}
                  />
                </Animate>
              </FormSection>

              <FormSection>
                <Animate>
                  <DateField
                    name="birthdate"
                    label={
                      <LabelWithInfo
                        title="Date of birth"
                        content="Insurance rates vary depending on the driver's age. Some insurance companies also offer age discounts."
                      >
                        Date of birth
                      </LabelWithInfo>
                    }
                    shortLabel="of birth"
                    dayField="birth_day"
                    monthField="birth_month"
                    yearField="birth_year"
                    options={birthDayOptions}
                  />
                </Animate>

                <Animate>
                  <Field
                    label={
                      <LabelWithInfo
                        title="Gender"
                        content="Statistics show that gender has a direct impact on the risk for driving accidents, therefore gender affects insurance premiums"
                      >
                        Gender
                      </LabelWithInfo>
                    }
                    shortLabel="Gender"
                    name="gender"
                    className="gender"
                    component={ReduxRadioButtonGroup}
                    options={genderOptions}
                    validate={[required]}
                  />
                </Animate>
              </FormSection>

              <FormSection>
                <Animate>
                  <Field
                    label={
                      <LabelWithInfo
                        title="Marital status"
                        content="Marital status can affect your insurance premium."
                      >
                        Marital status
                      </LabelWithInfo>
                    }
                    shortLabel="Marital status"
                    name="maritalstatus"
                    component={ReduxDropdownField}
                    options={maritalOptions}
                    validate={[required]}
                    searchable={false}
                  />
                </Animate>

                <Animate>
                  <Field
                    label={
                      <LabelWithInfo
                        title="Retired"
                        content="Drivers who are 'Retired' may qualify for a retiree discount."
                      >
                        Are you currently retired?
                      </LabelWithInfo>
                    }
                    shortLabel="Retired"
                    name="retired"
                    component={ReduxRadioButtonGroup}
                    options={retiredOptions}
                  />
                </Animate>
              </FormSection>
            </FormSection>

            <Animate>
              <FormSection title={<h3>License information</h3>}>
                <FormSection>
                  <Field
                    name="licenseOutsideCanada"
                    label="Have you previously held a valid driver's licence outside of Canada?"
                    shortLabel="Driver's license outside Canada"
                    component={ReduxRadioButtonGroup}
                    options={yesNoOptions}
                    validate={[required]}
                  />
                </FormSection>

                <FormSection>
                  <Field
                    name="driverTesting"
                    label={
                      <LabelWithInfo
                        title="Driver's training certificate"
                        content="Some insurance companies may offer a discount for an approved driver's training course."
                      >
                        Does this driver have a driver's training certificate
                        (within the last 3 years)?
                      </LabelWithInfo>
                    }
                    shortLabel="Driver's training certificate"
                    component={ReduxRadioButtonGroup}
                    options={yesNoOptions}
                    validate={[required]}
                  />
                </FormSection>

                <FormSection>
                  <DateField
                    name="licenseDate"
                    label={
                      <LabelWithInfo
                        title="Date current class license obtained"
                        content="Insurance companies consider driving experience when calculating insurance premiums."
                      >
                        Date current class license obtained
                      </LabelWithInfo>
                    }
                    shortLabel="current class license obtained"
                    dayField="license_day"
                    monthField="license_month"
                    yearField="license_year"
                    options={dateDropdown}
                    showDaySection={false}
                  />

                  <Field
                    name="license_class"
                    component={ReduxDropdownField}
                    label="Current license class"
                    shortLabel="Current license class"
                    options={licenseOptions}
                    validate={[required]}
                  />

                  {licenseClass &&
                    licenseClass.value == "G2" &&
                    selectedDate.isAfter(licenseDate) && (
                      <FormSection nested>
                        <AnimationContainer>
                          <Animate>
                            <DateField
                              name="licenseDateG1"
                              label="Date G1 class license obtained"
                              shortLabel="G1 class license obtained"
                              dayField="license_day_G1"
                              monthField="license_month_G1"
                              yearField="license_year_G1"
                              options={dateDropdown}
                              last
                            />
                          </Animate>
                        </AnimationContainer>
                      </FormSection>
                    )}
                  {console.log(licenseClass, "licenseClass")}
                  {licenseClass &&
                    licenseClass.value == "G" &&
                    selectedDate.isAfter(licenseDate) && (
                      <FormSection nested>
                        <AnimationContainer>
                          <Animate>
                            <DateField
                              name="licenseDateG1"
                              label="Date G1 class license obtained"
                              shortLabel="G1 class license obtained"
                              dayField="license_day_G1"
                              monthField="license_month_G1"
                              yearField="license_year_G1"
                              options={dateDropdown}
                            />
                          </Animate>

                          <Animate>
                            <DateField
                              name="licenseDateG2"
                              label="Date G2 class license obtained"
                              shortLabel="G2 class license obtained"
                              dayField="license_day_G2"
                              monthField="license_month_G2"
                              yearField="license_year_G2"
                              options={dateDropdown}
                              last
                            />
                          </Animate>
                        </AnimationContainer>
                      </FormSection>
                    )}
                </FormSection>
              </FormSection>
            </Animate>

            <Animate>
              <FormSection title={<h3>Driving history</h3>}>
                <FormSection>
                  <Field
                    name="tickets"
                    label={
                      <LabelWithInfo
                        title="Tickets received in last 3 years"
                        content="The number and type of the traffic tickets may affect the estimated premium. DO NOT include parking tickets. Keep in mind that all requested information must be disclosed to result in an accurate estimate."
                      >
                        How many tickets has the driver received in the last 3
                        years?
                      </LabelWithInfo>
                    }
                    shortLabel="Tickets received in last 3 years"
                    component={ReduxDropdownField}
                    options={ticketsRecievedOptions}
                    validate={[required]}
                  />
                  {console.log(ticketsToInsure, "insurre")}
                  {ticketsToInsure && (
                    <AnimationContainer options={new AnimationOptions()}>
                      {[...Array(Number(ticketsToInsure.value))].map((e, i) => (
                        <Animate key={i}>
                          <FormSection nested>
                            <Field
                              label="Severity of the conviction"
                              name={`severity_conviction[${i}]`}
                              component={ReduxDropdownField}
                              options={severityConviction}
                              validate={[required]}
                            />

                            {severity_conviction &&
                              severity_conviction[i] == "minor" && (
                                <AnimationContainer>
                                  <Animate>
                                    <Field
                                      label="Select the type of conviction"
                                      shortLabel="Type of conviction"
                                      name={`conviction_type[${i}]`}
                                      component={ReduxDropdownField}
                                      options={minorSeverity}
                                      validate={[required]}
                                    />
                                  </Animate>
                                </AnimationContainer>
                              )}

                            {severity_conviction &&
                              severity_conviction[i] == "major" && (
                                <AnimationContainer>
                                  <Animate>
                                    <Field
                                      label="Select the type of conviction"
                                      shortLabel="Type of conviction"
                                      name={`conviction_type[${i}]`}
                                      component={ReduxDropdownField}
                                      options={majorSeverity}
                                      validate={[required]}
                                    />
                                  </Animate>
                                </AnimationContainer>
                              )}

                            {severity_conviction &&
                              severity_conviction[i] == "criminal" && (
                                <AnimationContainer>
                                  <Animate>
                                    <Field
                                      label="Select the type of conviction"
                                      shortLabel="Type of conviction"
                                      name={`conviction_type[${i}]`}
                                      component={ReduxDropdownField}
                                      options={criminalSeverity}
                                      validate={[required]}
                                    />
                                  </Animate>
                                </AnimationContainer>
                              )}

                            <DateField
                              name={`convictionDate[${i}]`}
                              label="Select the date of the conviction"
                              shortLabel="of conviction"
                              dayField={`conviction_day[${i}]`}
                              monthField={`conviction_month[${i}]`}
                              yearField={`conviction_year[${i}]`}
                              options={dateDropdown}
                              last
                            />
                          </FormSection>
                        </Animate>
                      ))}
                    </AnimationContainer>
                  )}
                </FormSection>

                <FormSection>
                  <Field
                    label={
                      <LabelWithInfo
                        title="Claims/accidents within the last 10 years"
                        content="Enter the total number of claims, including accidents, vandalism, theft, or glass repair. The number and type of the claims may affect the estimated premium. Keep in mind that all requested information must be disclosed to result in an accurate estimate."
                      >
                        <span>
                          Claims/Accidents involved in within the last 10 years
                          <br />
                          (Regardless of whether the driver was at fault or not)
                        </span>
                      </LabelWithInfo>
                    }
                    shortLabel="Claims/accidents within the last 10 years"
                    name="claims"
                    validate={[required]}
                    component={ReduxDropdownField}
                    options={claimsOptions}
                    validate={[required]}
                  />

                  {claimsInvolved && (
                    <AnimationContainer options={new AnimationOptions()}>
                      {[...Array(Number(claimsInvolved.value))].map((e, i) => (
                        <Animate key={i}>
                          <FormSection nested>
                            <Field
                              label="Select the type of accident/claim"
                              shortLabel="Type of accident/claim"
                              name={`claim_type[${i}]`}
                              component={ReduxDropdownField}
                              options={claimTypeOptions}
                              validate={[required]}
                            />

                            <DateField
                              name={`claimDate[${i}]`}
                              label="Date of the accident/claim"
                              shortLabel="of accident/claim"
                              dayField={`claim_day[${i}]`}
                              monthField={`claim_month[${i}]`}
                              yearField={`claim_year[${i}]`}
                              options={dateDropdown}
                              last
                            />
                          </FormSection>
                        </Animate>
                      ))}
                    </AnimationContainer>
                  )}
                </FormSection>

                <FormSection>
                  <Field
                    name="licenseCancelled"
                    component={ReduxRadioButtonGroup}
                    label={
                      <LabelWithInfo
                        title="License cancelled"
                        content="Select 'Yes' if this driver's licence has been cancelled for any reason in the last 3 years. A cancellation may affect your insurance rates."
                      >
                        License cancelled in the last 3 years?
                      </LabelWithInfo>
                    }
                    shortLabel="License cancelled"
                    options={yesNoOptions}
                    validate={[required]}
                  />

                  <Field
                    name="licenseSuspend"
                    component={ReduxRadioButtonGroup}
                    label={
                      <LabelWithInfo
                        title="License suspended"
                        content="Select 'Yes' if this driver's licence has been suspended for any reason in the last 6 years. A suspension may affect your insurance rates."
                      >
                        Has this driver had his/her driver's license suspended
                        in the last 6 years?
                      </LabelWithInfo>
                    }
                    shortLabel="License suspended"
                    options={yesNoOptions}
                    validate={[required]}
                  />

                  {licenseSuspend == "Y" && (
                    <FormSection nested>
                      <AnimationContainer>
                        <Animate>
                          <Field
                            label="Number of times driver's license was suspended in last 6 years"
                            name="suspendedDuration"
                            validate={[required]}
                            component={ReduxDropdownField}
                            options={policiesCancelledOptions}
                            validate={[required]}
                          />
                        </Animate>
                      </AnimationContainer>

                      {suspendedDuration > 0 &&
                        [...Array(Number(suspendedDuration.value))].map(
                          (e, i) => (
                            <FormSection nested key={i}>
                              <AnimationContainer>
                                <ALField
                                  label={
                                    <LabelWithInfo
                                      title="Period of suspension"
                                      content="The duration of your license suspension may affect the premium you are quoted."
                                    >
                                      Period of time their driver's license was
                                      suspended
                                    </LabelWithInfo>
                                  }
                                  inputComponent={({ ...props }) => (
                                    <div className="suspension-period">
                                      <Animate>
                                        <DateField
                                          name={`suspensionStart[${i}]`}
                                          className="suspension-period-start"
                                          label="Start date"
                                          shortLabel="of suspension period start"
                                          dayField={`suspend_start_day[${i}]`}
                                          monthField={`suspend_start_month[${i}]`}
                                          yearField={`suspend_start_year[${i}]`}
                                          options={licenseSuspendDateDropdwon}
                                        />
                                      </Animate>

                                      <Animate>
                                        <DateField
                                          name={`suspensionEnd[${i}]`}
                                          className="suspension-period-end"
                                          label="End date"
                                          shortLabel="of suspension period end"
                                          dayField={`suspend_end_day[${i}]`}
                                          monthField={`suspend_end_month[${i}]`}
                                          yearField={`suspend_end_year[${i}]`}
                                          options={licenseSuspendDateDropdwon}
                                        />
                                      </Animate>
                                    </div>
                                  )}
                                />

                                <Animate>
                                  <Field
                                    label="Reason for suspension"
                                    name={`suspension_reason[${i}]`}
                                    validate={[required]}
                                    component={ReduxDropdownField}
                                    options={suspensionOptions}
                                    validate={[required]}
                                  />
                                </Animate>
                              </AnimationContainer>
                            </FormSection>
                          )
                        )}
                    </FormSection>
                  )}

                  <Field
                    name="driverInsured"
                    component={ReduxRadioButtonGroup}
                    label={
                      <LabelWithInfo
                        title="Driver insured"
                        content="Continuous insurance must be taken into consideration when an insurance rate is calculated. A lapse in insurance may cause rates to change."
                      >
                        Is this driver currently listed on an auto insurance
                        policy in Canada or the United States?
                      </LabelWithInfo>
                    }
                    shortLabel="Driver insured"
                    options={yesNoOptions}
                    validate={[required]}
                  />

                  {driverInsured == "Y" && (
                    <FormSection nested>
                      <AnimationContainer>
                        <Animate>
                          <Field
                            label={
                              <LabelWithInfo
                                title="Years listed as driver on policy"
                                content="Continuous insurance must be taken into consideration when an insurance rate is calculated. A lapse in insurance may cause rates to change"
                              >
                                How many years have you been continuously listed
                                as a driver on an auto insurance policy?
                              </LabelWithInfo>
                            }
                            shortLabel="Years listed as driver on policy"
                            name="continuousPolicy"
                            validate={[required]}
                            component={ReduxDropdownField}
                            options={yearsInsuredOptions(6)}
                            validate={[required]}
                          />
                        </Animate>

                        <Animate>
                          <Field
                            label={
                              <LabelWithInfo
                                title="Years with current insurance company"
                                content="Some insurance companies may offer additional discounts for drivers that have been insured continuously for many years with the same insurance company."
                              >
                                How many years have you been insured with your
                                current insurance company?
                              </LabelWithInfo>
                            }
                            shortLabel="Years with current insurance company"
                            name="currentInsurancePolicy"
                            validate={[required]}
                            component={ReduxDropdownField}
                            options={yearsInsuredOptions(5)}
                            validate={[required]}
                            last
                          />
                        </Animate>
                      </AnimationContainer>
                    </FormSection>
                  )}

                  {driverInsured == "N" && (
                    <FormSection nested>
                      <AnimationContainer>
                        <Animate>
                          <Field
                            name="driverListedInsured"
                            component={ReduxRadioButtonGroup}
                            label={
                              <LabelWithInfo
                                title="Driver ever been listed on policy"
                                content="When calculating insurance rates, insurance experience must be taken into account. If there is no insurance experience then there is no driving record that can be rated for. If it is the case that a driver may be rated as a new driver."
                              >
                                Has this driver ever been listed on an insurance
                                policy at any time in Canada or the United
                                States?
                              </LabelWithInfo>
                            }
                            shortLabel="Driver ever been listed on policy"
                            options={yesNoOptions}
                            validate={[required]}
                            last={driverListedInsured != "Y"}
                          />
                        </Animate>
                      </AnimationContainer>

                      {driverListedInsured == "Y" && (
                        <div>
                          <AnimationContainer>
                            <Animate>
                              <Field
                                label={
                                  <LabelWithInfo
                                    title="Reason for lapse in insurance"
                                    content="For underwriting purposes certain lapse's in insurance may be handled differently. Please be as clear as possible when outlining the details for your insurance lapse"
                                  >
                                    What was the reason for the lapse in
                                    insurance coverage?
                                  </LabelWithInfo>
                                }
                                shortLabel="Reason for lapse in insurance"
                                name="insuranceLapse"
                                validate={[required]}
                                component={ReduxDropdownField}
                                options={lapseOptions}
                                validate={[required]}
                              />
                            </Animate>

                            <Animate>
                              <Field
                                label={
                                  <LabelWithInfo
                                    title="Policies cancelled"
                                    content="Certain cancellations from an insurance company may affect your insurance rate."
                                  >
                                    Policies that were cancelled by an insurance
                                    company in the past 3 years?
                                  </LabelWithInfo>
                                }
                                shortLabel="Policies cancelled"
                                name="policiesCancelled"
                                validate={[required]}
                                component={ReduxDropdownField}
                                options={policiesCancelledOptions}
                                validate={[required]}
                                last={!cancelPolicy}
                              />
                            </Animate>
                          </AnimationContainer>

                          {cancelPolicy && (
                            <AnimationContainer
                              options={new AnimationOptions()}
                            >
                              {[...Array(Number(cancelPolicy.value))].map(
                                (e, i) => (
                                  <Animate key={i}>
                                    <FormSection
                                      nested
                                      key={i}
                                      last={i === Number(cancelPolicy) - 1}
                                    >
                                      <Field
                                        label="Reason for cancellation"
                                        name={`policesCancel[${i}]`}
                                        validate={[required]}
                                        component={ReduxDropdownField}
                                        options={cancelReasonOptions}
                                        validate={[required]}
                                      />

                                      <DateField
                                        name={`policyCancelDate[${i}]`}
                                        label="Cancellation date"
                                        shortLabel="of cancellation"
                                        dayField={`policy_cancel_day[${i}]`}
                                        monthField={`policy_cancel_month[${i}]`}
                                        yearField={`policy_cancel_year[${i}]`}
                                        options={dateDropdown}
                                        last
                                      />
                                    </FormSection>
                                  </Animate>
                                )
                              )}
                            </AnimationContainer>
                          )}
                        </div>
                      )}
                    </FormSection>
                  )}
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

const InsuranceSection1Form = reduxForm({
  initialValues: {
    licenseCancelled: yesNoOptions[0].value,
    licenseSuspend: yesNoOptions[0].value,
    driverInsured: yesNoOptions[0].value,
    driverListedInsured: yesNoOptions[0].value,
    retired: retiredOptions[0].value
    //gender: genderOptions[0].value
  },
  destroyOnUnmount: false // <------ preserve form data
})(Section1Form);

const FormWrapper = connect((state, ownProps) => ({
  form: `insuranceSection1-Driver${ownProps.driverIndex}-Form`
}))(InsuranceSection1Form);

export default connect((state, ownProps) => {
  const formName = `insuranceSection1-Driver${ownProps.driverIndex}-Form`;
  const formValues = get(state, `form['${formName}'].values`, {});

  return {
    ticketsToInsure: formValues.tickets,
    claimsInvolved: formValues.claims,
    cancelPolicy: formValues.policiesCancelled,
    licenseClass: formValues.license_class,
    licenseSuspend: formValues.licenseSuspend,
    suspendedDuration: formValues.suspendedDuration,
    driverInsured: formValues.driverInsured,
    driverListedInsured: formValues.driverListedInsured,
    licenseYear: formValues.license_year,
    licenseMonth: formValues.license_month,
    licenseDay: formValues.license_day,
    severity_conviction: formValues.severity_conviction
  };
})(FormWrapper);
