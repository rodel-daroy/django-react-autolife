import React, { Component } from "react";
import { Field, reduxForm, formValueSelector } from "redux-form";
import { connect } from "react-redux";
import { ReduxDropdownField } from "../../../../components/Forms/DropdownField";
import { ReduxTextField } from "../../../../components/Forms/TextField";
import {
  getTrimAvgPrice,
  getStyleAvgPrice,
  getStyle
} from "../../../../redux/actions/carWorthAction";
import { setCarWorthPostalCode } from "../../../../redux/actions/marketPlaceActions";
import { showInfoModal } from "../../../../redux/actions/infoModalActions";
import {
  required,
  postalCanada,
  isNumber
} from "../../../../utils/validations";
import FormFooter from "./FormFooter";
import { ReduxCheckbox } from "../../../../components/Forms/Checkbox";

class AveragePriceStepTwoForm extends Component {
  componentDidMount() {
    const { year, make, model } = this.props;
    this.props.getTrimAvgPrice(year, make, model);

    this.props.initialize();
  }

  continueNextStep = values => {
    const { style } = this.props;
    let options = [];
    let addOns = [];
    let deducts = [];
    for (let key of Object.keys(values.options || {})) {
      if (values.options[key]) {
        const code = key.split("-")[1];

        const singleOption = style.data.find(s => s.option_code === code);
        if (singleOption) {
          options.push(code);

          if (singleOption.add_or_deduct === "add") addOns.push(singleOption);
          else deducts.push(singleOption);
        }
      }
    }

    values.option = options.join(",");
    values.addOns = addOns;
    values.deducts = deducts;

    //console.log('values', values);

    this.props.onContinueNextStep(values);
  };

  trimDropdown = (event, value) => {
    const { year, make, model } = this.props;
    this.props.getStyleAvgPrice(year, make, model, value.value);
  };

  componentWillReceiveProps(nextProps) {
    const { trim, bodystyle, year, make, model } = nextProps;
    if (bodystyle !== this.props.bodystyle) {
      console.log(bodystyle, "bStyle");
      this.props.getStyle(
        year,
        make,
        model,
        trim && trim.value,
        bodystyle && bodystyle.value
      );
    }
  }

  render() {
    const {
      handleSubmit,
      trimData,
      styleData,
      showMileage,
      showEstimatedMileage,
      submitting,
      showModal,
      showPostal = true,
      showDeducts = true,
      showAddOns = true,
      style
    } = this.props;
    const styles = ((styleData && styleData.data) || []).map(item => ({
      value: item.name,
      label: item.name
    }));
    console.log(styles, "style");
    const trims = ((trimData && trimData.data) || []).map(item => ({
      value: item.name,
      label: item.name
    }));
    console.log(style && style.data, "style1");
    const addOns = ((style && style.data) || []).filter(option => {
      console.log(option, "opti");
      return option.add_or_deduct === "add";
    });
    console.log(addOns, "addOns1");
    const deducts = ((style && style.data) || []).filter(
      option => option.add_or_deduct === "deduct"
    );

    return (
      <form
        noValidate
        onSubmit={handleSubmit(values => {
          this.continueNextStep(values);
        })}
      >
        <h3>
          Some optional equipment can add or deduct from your vehicle value
        </h3>
        <div
          className="form-group"
          style={{ marginTop: "80px", marginBottom: "20px" }}
        >
          <Field
            name="trim"
            disabled={submitting}
            component={ReduxDropdownField}
            placeholder="Select a Trim"
            onChange={(event, value) => {
              this.trimDropdown(event, value);
            }}
            options={trims}
            validate={[required]}
          />
        </div>
        <div className="form-group">
          <Field
            name="bodystyle"
            disabled={submitting}
            component={ReduxDropdownField}
            placeholder="Select a Style"
            options={styles}
            validate={[required]}
          />
        </div>
        {showAddOns && addOns.length > 0 && (
          <div className="page-section">
            <div className="page-section-header">
              <h3>Add Ons</h3>
            </div>

            <div className="page-section-content">
              {console.log(addOns, "addON")}
              {addOns &&
                addOns.map(addOn => (
                  <Field
                    key={addOn.option_code}
                    name={`options['option-${addOn.option_code}']`}
                    component={ReduxCheckbox}
                    label={addOn.name}
                  />
                ))}
            </div>
          </div>
        )}
        {showDeducts && deducts.length > 0 && (
          <div className="page-section">
            <div className="page-section-header">
              <h3>Deducts</h3>
            </div>

            <div className="page-section-content">
              {deducts.map(deduct => (
                <Field
                  key={deduct.option_code}
                  name={`options['option-${deduct.option_code}']`}
                  component={ReduxCheckbox}
                  label={deduct.name}
                />
              ))}
            </div>
          </div>
        )}
        {showMileage && (
          <div className="page-section">
            <div className="page-section-header">
              <h3>Mileage</h3>
            </div>

            <div className="page-section-content">
              <Field
                component={ReduxTextField}
                placeholder="Enter here"
                label="Current Kilometers"
                id="current_kilometers"
                name="current_kilometers"
                type="text"
                validate={[required, isNumber]}
              />
            </div>
          </div>
        )}
        {showEstimatedMileage && (
          <div className="page-section">
            <div className="page-section-header">
              <h3>Estimated Mileage</h3>
            </div>
            <div className="page-section">
              <Field
                label="Annual Kilometers"
                component={ReduxTextField}
                placeholder="Enter here"
                id="annual_kilometers"
                name="annual_kilometers"
                type="text"
                validate={[required, isNumber]}
              />
            </div>
          </div>
        )}
        {showPostal && (
          <div className="page-section">
            <div className="page-section-header">
              <h3>Your Province</h3>
            </div>
            <div className="page-section-content">
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
                    "",
                    <p>
                      Values can vary by location. <br />
                      Providing your postal code helps us to calculate the most
                      accurate values.
                    </p>
                  );
                }}
              >
                Why we ask for Postal code?
              </button>
            </div>
          </div>
        )}
        <FormFooter {...this.props} />
      </form>
    );
  }
}

const selector = formValueSelector("AveragePriceStepTwo");

const mapStateToProps = state => ({
  trimData: state.carWorth.avgPriceTrimData,
  styleData: state.carWorth.avgPriceStyleData,
  carWorthPostalCode: state.MarketPlace.carWorthPostalCode,
  formState: state.form.AveragePriceStepTwo,
  trim: selector(state, "trim"),
  bodystyle: selector(state, "bodystyle"),
  style: state.carWorth.styleData
});

const AveragePriceStepTwo = reduxForm({
  form: "AveragePriceStepTwo",
  destroyOnUnmount: false
})(AveragePriceStepTwoForm);

const mapDispatchToProps = {
  getTrimAvgPrice,
  getStyleAvgPrice,
  setCarWorthPostalCode,
  showModal: showInfoModal,
  getStyle
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AveragePriceStepTwo);
