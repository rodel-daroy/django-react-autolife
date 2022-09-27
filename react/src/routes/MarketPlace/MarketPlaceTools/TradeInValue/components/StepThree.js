import React from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { ReduxDropdownField } from "../../../../../components/Forms/DropdownField";
import {
  getYear,
  getMake,
  getModel
} from "../../../../../redux/actions/carWorthAction";
import { purchaseTimeFrame } from "../../../../../config/constants";
import { sortListByAlphabetsOrder } from "../../../../../utils/sort";
import FormFooter from "./../../components/FormFooter";

class TradeInValueStepThreeForm extends React.Component {
  constructor(props) {
    super(props);
    this.continueNextStep = this.continueNextStep.bind(this);
  }

  componentDidMount() {
    this.props.getYear();
  }

  yearDropdown(event, value) {
    this.setState({ year: value });
    this.props.getMake(value);
  }

  makeDropdown(event, value) {
    this.props.getModel(this.state.year, value);
  }

  continueNextStep(values) {
    this.props.onContinueNextStep(values);
  }

  formatModel(model) {
    return model.replace("-", " ").toUpperCase();
  }

  render() {
    const { handleSubmit, yearData, makeData, modelData } = this.props;
    const years = (yearData || []).map(year => ({
      value: year.name,
      label: year.name
    }));
    const makes = sortListByAlphabetsOrder(makeData || []).map(item => ({
      value: item.name,
      label: item.name
    }));
    const models = sortListByAlphabetsOrder(modelData || []).map(item => ({
      value: item.name,
      label: this.formatModel(item.name)
    }));
    const purchaseFrame = (purchaseTimeFrame || []).map(item => ({
      value: item.name,
      label: item.name
    }));

    return (
      <form
        noValidate
        onSubmit={handleSubmit(values => {
          this.continueNextStep(values);
        })}
      >
        <h3>What vehicle do you plan on buying next?</h3>
        <div
          className="form-group"
          style={{ marginTop: "80px", marginBottom: "80px" }}
        >
          <Field
            name="year_name"
            component={ReduxDropdownField}
            placeholder="Year"
            model="year"
            options={years}
            onChange={(event, value) => {
              this.yearDropdown(event, value);
            }}
          />
          <Field
            name="make_name"
            component={ReduxDropdownField}
            placeholder="Make"
            model="make"
            options={makes}
            onChange={(event, value) => {
              this.makeDropdown(event, value);
            }}
          />
        </div>
        <div
          className="form-group"
          style={{ marginTop: "80px", marginBottom: "80px" }}
        >
          <Field
            name="model_name"
            component={ReduxDropdownField}
            placeholder="Model"
            model="model"
            options={models}
          />
          <Field
            name="Purchase_time_frame"
            component={ReduxDropdownField}
            placeholder="Purchase Time Frame"
            model="purchase_time_frame"
            options={purchaseFrame}
          />
        </div>
        {/* <button type="button" style={{ color: '#131212' }} className="btn btn-link dark skip-button" onClick={this.continueNextStep}>Skip this &gt;</button> */}
        <FormFooter {...this.props} />
      </form>
    );
  }
}

const mapStateToProps = state => ({
  yearData: state.carWorth.yearData,
  makeData: state.carWorth.makeData,
  modelData: state.carWorth.modelData,
  formState: state.form.TradeInValueStepThree
});

const TradeInValueStepThree = reduxForm({
  form: "TradeInValueStepThree",
  destroyOnUnmount: false
})(TradeInValueStepThreeForm);

const mapDispatchToProps = {
  getYear,
  getMake,
  getModel
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TradeInValueStepThree);
