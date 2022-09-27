import React, { Component } from "react";
import PropTypes from "prop-types";
import omit from "lodash/omit";
import WithMetadata, {
  getMetadata
} from "../../components/Decorators/WithMetadata";

const FieldPropTypes = {
  label: PropTypes.node,
  state: PropTypes.oneOf(["success", "error", "warning"]),
  helpText: PropTypes.string,
  autofilled: PropTypes.bool,
  dark: PropTypes.bool,
  hideLabel: PropTypes.bool
};

const getReduxMetadataKey = (form, name) => `${form}.${name}`;

const withReduxMetadata = WrappedComponent => {
  const propsToKey = ({ input: { name }, meta: { form } }) =>
    getReduxMetadataKey(form, name);

  const mapPropsToState = ({ shortLabel, label, parentField }) => ({
    shortLabel: shortLabel || label,
    parentField
  });

  return WithMetadata(propsToKey, mapPropsToState)(WrappedComponent);
};

const getReduxMetadata = (form, name) =>
  getMetadata(getReduxMetadataKey(form, name));

const makeReduxField = WrappedComponent => {
  const component = props => {
    const { input, meta } = props;
    const fieldProps = {
      ...input
    };
    const innerProps = omit(props, [
      "meta",
      "input",
      "shortLabel",
      "parentField",
      ...Object.keys(fieldProps)
    ]);

    let { state } = props;
    if (meta.touched || meta.submitFailed) {
      if (meta.error) state = "error";
      if (meta.warning) state = "warning";
    }

    let { helpText } = props;
    if (meta.touched || meta.submitFailed)
      helpText = meta.error || meta.warning || helpText;

    let { autofilled } = props;
    autofilled = autofilled || meta.autofilled;

    return (
      <WrappedComponent
        {...innerProps}
        {...fieldProps}
        state={state}
        helpText={helpText}
        autofilled={autofilled}
      />
    );
  };

  component.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    ...WrappedComponent.propTypes
  };

  component.defaultProps = {
    ...WrappedComponent.defaultProps
  };

  component.displayName = `Redux${WrappedComponent.name}`;

  return withReduxMetadata(component);
};

export {
  makeReduxField,
  FieldPropTypes,
  withReduxMetadata,
  getReduxMetadata,
  getReduxMetadataKey
};
