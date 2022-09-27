import React from "react";
import PropTypes from "prop-types";
import { reduxForm, Field, propTypes, formValueSelector } from "redux-form";
import PrimaryButton from "components/Forms/PrimaryButton";
import { ReduxDateField } from "components/Forms/DateField";
import { ReduxDropdownField } from "components/Forms/DropdownField";
import { PUBLISH_STATES, PUBLISHED_STATE } from "./helpers";
import moment from "moment";
import get from "lodash/get";
import FormSection from "components/Forms/FormSection";
import FormRow from "components/Forms/FormRow";
import { connect } from "react-redux";
import "./ArticlePublishingForm.scss";

const PUBLISH_OPTIONS = Object.entries(PUBLISH_STATES).map(([value, label]) => ({ value: parseInt(value), label }));

const validateFrom = (value, allValues) => {
  const to = get(allValues, "publishing_state.unpublishing_on");

	if(value && to) {
		if(moment(value).isSameOrAfter(to))
			return "Should be before available until";
	}

	return undefined;
};

const validateTo = (value, allValues) => {
  const from = get(allValues, "publishing_state.do_not_publish_until");

	if(value && from) {
		if(moment(value).isSameOrBefore(from))
			return "Should be after available from";
	}

	return undefined;
};

const ArticlePublishingForm = ({ handleSubmit, onCancel, publishing_state }) => {
  const onSubmit = e => {
    handleSubmit(e);

    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <form className="article-publishing-form" onSubmit={onSubmit}>
      <div className="article-publishing-form-inner">
        <FormSection>
          <Field
            name="publishing_state.publish_state"
            label="Publish state"
            component={ReduxDropdownField}
            options={PUBLISH_OPTIONS}
            parse={({ value }) => value} />

          {publishing_state.publish_state === PUBLISHED_STATE && (
            <FormRow>
              <Field
                name="publishing_state.do_not_publish_until"
                label="Available from"
                component={ReduxDateField}
                validate={[validateFrom]}
                placeholderText="publish date" />
              <Field
                name="publishing_state.unpublishing_on"
                label="Available until"
                component={ReduxDateField}
                validate={[validateTo]}
                placeholderText="unpublished" />
            </FormRow>
          )}
        </FormSection>

        <FormSection>
          <Field
            name="article_received_date"
            label="Article received"
            component={ReduxDateField} />
        </FormSection>
      </div>

      <PrimaryButton type="submit">
        OK
      </PrimaryButton>
      <button type="button" className="btn btn-link" onClick={onCancel}>
        <span className="icon icon-x"></span> Cancel
      </button>
    </form>
  );
};

ArticlePublishingForm.propTypes = {
  ...propTypes,

  onCancel: PropTypes.func.isRequired,

  publishing_state: PropTypes.object
};

const mapStateToProps = (state, { form }) => {
  const formValue = formValueSelector(form);

  return {
    publishing_state: formValue(state, "publishing_state")
  };
};
 
export default reduxForm({
  form: "articlePublishing"
})(connect(mapStateToProps)(ArticlePublishingForm));