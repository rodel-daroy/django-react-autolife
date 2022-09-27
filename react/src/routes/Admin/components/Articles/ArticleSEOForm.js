import React from "react";
import PropTypes from "prop-types";
import { reduxForm, Field, propTypes } from "redux-form";
import { ReduxTextAreaField } from "components/Forms/TextAreaField";
import PrimaryButton from "components/Forms/PrimaryButton";
import { required } from "utils/validations";

const ArticleSEOForm = ({ handleSubmit, onCancel }) => {
  const onSubmit = e => {
    handleSubmit(e);

    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <form className="article-seo-form" onSubmit={onSubmit}>
      <Field
        name="seo_keywords"
        label="Keywords"
        component={ReduxTextAreaField}
        validate={[required]} />

      <PrimaryButton type="submit">
        OK
      </PrimaryButton>
      <button type="button" className="btn btn-link" onClick={onCancel}>
        <span className="icon icon-x"></span> Cancel
      </button>
    </form>
  );
};

ArticleSEOForm.propTypes = {
  ...propTypes,

  onCancel: PropTypes.func.isRequired
};
 
export default reduxForm({
  form: "articleSEO"
})(ArticleSEOForm);