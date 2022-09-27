import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getFormSyncErrors, hasSubmitFailed } from "redux-form";
import map from "lodash/map";
import get from "lodash/get";
import pickBy from "lodash/pickBy";
import pick from "lodash/pick";
import { flattenObject } from "../../utils";
import { withRouter } from "react-router-dom";
import { focusField } from "./Field";
import { getReduxMetadata } from "./";

class ErrorSummary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: this.transformErrors(props)
    };
  }

  transformErrors({ errors, registeredFields }) {
    let flatErrors = flattenObject(errors) || {};
    flatErrors = pick(
      flatErrors,
      map(registeredFields, field => (field.count ? field.name : null))
    );

    return flatErrors;
  }

  componentWillReceiveProps(nextProps) {
    const { errors, submitCount, registeredFields } = this.props;

    if (submitCount < nextProps.submitCount) {
      this.setState({
        errors: pickBy(this.transformErrors(nextProps), error => !!error)
      });
    } else {
      if (
        errors !== nextProps.errors ||
        registeredFields !== nextProps.registeredFields
      ) {
        const transformedErrors = this.transformErrors(nextProps);

        let mergedErrors = {};
        for (const key of Object.keys(this.state.errors || {}))
          mergedErrors[key] = transformedErrors[key];

        this.setState({
          errors: mergedErrors
        });
      }
    }
  }

  render() {
    const { form, className, submitFailed } = this.props;
    const { errors } = this.state;

    if (!submitFailed) return null;

    const children = map(errors, (error, field) => (
      <ErrorSummary.Field name={field} key={field} form={form}>
        {error}
      </ErrorSummary.Field>
    ));

    const errorCount = Object.keys(errors).length;

    if (errorCount > 0)
      return (
        <div
          className={`error-summary ${className || ""}`}
          tabIndex={0}
          role="alert"
          aria-live="assertive"
        >
          <div className="error-summary-title">
            Please correct {errorCount} issue(s) before continuing:
          </div>

          <ul className="error-summary-inner">{children}</ul>
        </div>
      );
    else return null;
  }
}

ErrorSummary.propTypes = {
  form: PropTypes.string.isRequired,
  className: PropTypes.string,
  submitCount: PropTypes.number
};

const mapStateToProps = (state, ownProps) => ({
  errors: getFormSyncErrors(ownProps.form)(state),
  submitFailed: hasSubmitFailed(ownProps.form)(state),
  registeredFields: get(state, `form.${ownProps.form}.registeredFields`, {})
});

ErrorSummary.Field = class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: React.Children.count(props.children) > 0,

      name: props.name,
      label: props.label,
      shortLabel: props.shortLabel,
      parentField: props.parentField
    };
  }

  handleClick = e => {
    const { parentField, name } = this.state;
    setTimeout(() => focusField(parentField || name));

    e.stopPropagation();
  };

  render() {
    const {
      location: { pathname }
    } = this.props;
    const children = React.Children.toArray(this.props.children);

    const { name, label, shortLabel, parentField, visible } = this.state;

    if (visible || children.length > 0) {
      const hasErrors = children.length > 0;

      return (
        <li className={`${hasErrors ? "" : "no-errors"}`}>
          <div className="error-summary-label">
            <div className="error-summary-icon">
              <span className={`icon icon-${hasErrors ? "x" : "checkmark"}`} />
            </div>

            <a
              className="btn btn-link primary-link"
              href={`${pathname}#${parentField || name}`}
              onClick={this.handleClick}
              disabled={!hasErrors}
            >
              {shortLabel || label || name} >
            </a>
          </div>

          <ul className="error-summary-field">
            {children.map((child, i) => (
              <li key={i}>{child}</li>
            ))}
          </ul>
        </li>
      );
    } else return null;
  }
};

ErrorSummary.Field.displayName = "ErrorSummary.Field";

const mapStateToFieldProps = (state, ownProps) => ({
  ...(getReduxMetadata(ownProps.form, ownProps.name)(state) || {})
});

ErrorSummary.Field = withRouter(
  connect(mapStateToFieldProps)(ErrorSummary.Field)
);

ErrorSummary.Field.propTypes = {
  name: PropTypes.string.isRequired,
  form: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(ErrorSummary);
