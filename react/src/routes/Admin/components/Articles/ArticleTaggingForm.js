import React from "react";
import PropTypes from "prop-types";
import { reduxForm, Field, propTypes, formValueSelector } from "redux-form";
import { connect } from "react-redux";
import { ReduxRangeField } from "components/Forms/RangeField";
import { ReduxCheckbox } from "components/Forms/Checkbox";
import PrimaryButton from "components/Forms/PrimaryButton";
import startCase from "lodash/startCase";
import "./ArticleTaggingForm.scss";

const ArticleTaggingForm = ({ handleSubmit, weights, onCancel }) => {
  const onSubmit = e => {
    handleSubmit(e);

    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <form className="article-tagging-form" onSubmit={onSubmit}>
      <div className="article-tagging-form-weights">
        {(weights || []).map((weight, i) => (
          <div className="article-tagging-form-weight">
            <Field
              name={`weights[${i}].value`}
              label={startCase(weight.label)}
              component={ReduxRangeField}
              min={-10}
              max={10}
              tickInterval={1} />
          </div>
        ))}
      </div>

      <Field
        name="available_in_trends"
        label="Included in articles section"
        component={ReduxCheckbox} />

      <Field
        name="homepage_availability"
        label="Included in home page"
        component={ReduxCheckbox} />

      <PrimaryButton type="submit">
        OK
      </PrimaryButton>
      <button type="button" className="btn btn-link" onClick={onCancel}>
        <span className="icon icon-x"></span> Cancel
      </button>
    </form>
  );
}

ArticleTaggingForm.propTypes = {
  ...propTypes,

  onCancel: PropTypes.func.isRequired,

  weights: PropTypes.array
};

const mapStateToProps = (state, { form }) => {
  const formValue = formValueSelector(form);

  return {
    weights: formValue(state, "weights")
  };
};
 
export default reduxForm({
  form: "articleTagging"
})(connect(mapStateToProps)(ArticleTaggingForm));