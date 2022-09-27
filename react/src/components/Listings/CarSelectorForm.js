import React, { Component } from "react";
import PropTypes from "prop-types";
import { Field, reduxForm, getFormValues } from "redux-form";
import { connect } from "react-redux";
import { sortListByAlphabetsOrder } from "utils/sort";
import { ReduxDropdownField } from "components/Forms/DropdownField";
import PrimaryButton from "components/Forms/PrimaryButton";
import memoizeOne from "memoize-one";
import { required } from "utils/validations";

class CarSelector extends Component {
  static getYears = memoizeOne((pastYears, futureYears) => {
    let years = [];

    const thisYear = new Date().getFullYear();
    for (let year = (thisYear + futureYears); year >= (thisYear - pastYears); --year) {
      years.push({
        label: year.toFixed(0),
        value: year
      });
    }

    return years;
  })

  get years() {
    const { pastYears, futureYears } = this.props;
    return CarSelector.getYears(pastYears, futureYears);
  }

  get defaultYear() {
    return this.years[0].value;
  }

  componentDidMount() {
    const { 
      current: { year, make } = {}, 
      getMakes, 
      getModels
    } = this.props;

    getMakes({ 
      year: year || this.defaultYear
    });

    if(make)
      getModels({ 
        year: year || this.defaultYear, 
        make 
      });
  }

  componentDidUpdate(prevProps) {
    const { current: { year, make, model } = {}, getMakes, getModels, makes, models, change, untouch } = this.props;
    const { current: { year: prevYear, make: prevMake, model: prevModel } = {} } = prevProps;

    if(year && year !== prevYear)
      getMakes({ year });

    if(make && (year !== prevYear || make !== prevMake))
      getModels({ 
        year: year || this.defaultYear, 
        make 
      });

    if(make && make !== prevMake)
      this._previousMake = make;

    if(this._previousMake && makes !== prevProps.makes) {
      const currentMake = (makes || []).find(make => make.name === make);
      if(!currentMake) {
        const previousMake = (makes || []).find(make => make.name === this._previousMake);

        change("make", previousMake ? previousMake.name : null);
        untouch("make");
      }
    }

    if(model && model !== prevModel)
      this._previousModel = model;

    if(this._previousModel && models !== prevProps.models) {
      const currentModel = (models || []).find(model => model.name === model);
      if(!currentModel) {
        const previousModel = (models || []).find(model => 
          CarSelector.formatModelKey(model.name) === CarSelector.formatModelKey(this._previousModel));

        change("model", previousModel ? previousModel.name : null);
        untouch("model");
      }
    }
  }

  static formatModelKey(model) {
    return model.replace(/ /g, "-").toLowerCase();
  }

  static formatModelName(model) {
    return model.replace(/-/g, " ").toUpperCase();
  }

  render() {
    const {
      handleSubmit,
      submitText,
      title,
      current = {}
    } = this.props;

    const makes = sortListByAlphabetsOrder(this.props.makes || []).map(item => ({
      value: item.name,
      label: item.name
    }));

    const models = sortListByAlphabetsOrder(this.props.models || []).map(item => ({
      value: item.name,
      label: CarSelector.formatModelName(item.name)
    }));

    return (
      <div>
        <form
          noValidate
          className="shop-cars-form"
          onSubmit={handleSubmit}>

          {title && <h1>{title}</h1>}

          <div className="shop-cars-filter">
            <Field
              name="year"
              component={ReduxDropdownField}
              placeholder="Select a Year"
              model="years"
              options={this.years}
              validate={[required]}
              parse={value => (value && typeof value === "object") ? value.value : value}
            />
            <Field
              name="make"
              component={ReduxDropdownField}
              placeholder="Select a make"
              model="makes"
              options={makes}
              disabled={!this.props.makes}
              validate={[required]}
              parse={value => (value && typeof value === "object") ? value.value : value}
            />
            <Field
              name="model"
              component={ReduxDropdownField}
              placeholder="Select a model"
              model="models"
              options={models}
              disabled={!this.props.models || !current.make}
              validate={[required]}
              parse={value => (value && typeof value === "object") ? value.value : value}
            />
            <PrimaryButton type="submit">
              {submitText} <span className="icon icon-angle-right" />
            </PrimaryButton>
          </div>
        </form>
      </div>
    );
  }
}

CarSelector.propTypes = {
  title: PropTypes.string,
  submitText: PropTypes.string,
  form: PropTypes.string,
  pastYears: PropTypes.number,
  futureYears: PropTypes.number,
  getMakes: PropTypes.func.isRequired,
  getModels: PropTypes.func.isRequired,
  makes: PropTypes.array,
  models: PropTypes.array,

  current: PropTypes.object,
  change: PropTypes.func.isRequired,
  untouch: PropTypes.func.isRequired
};

CarSelector.defaultProps = {
  submitText: "Continue",
  pastYears: 14,
  futureYears: 0
};

const mapStateToProps = (state, { form }) => ({
  current: getFormValues(form)(state)
});

const CarSelectorForm = reduxForm({})(CarSelector);

export default connect(mapStateToProps)(CarSelectorForm);
