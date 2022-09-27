import React, { Component } from "react";
import PropTypes from "prop-types";
import { makeReduxField } from "./";
import Field, { fieldPropTypes } from "./Field";
import omit from "lodash/omit";

const TextAreaField = ({
  inputComponent,
  className,
  prefix,
  suffix,
  size,
  ...otherProps
}) => {
  const TextArea = ({
    inputClassName,
    inputComponent,
    state,
    id,
    labelId,
    ...otherProps
  }) => (
    <textarea
      {...omit(otherProps, Object.keys(fieldPropTypes))}

      id={id}
      className={`form-control ${inputClassName || ""}`}
      aria-invalid={state === "error"}
    />
  );

  return (
    <Field
      {...otherProps}
      className={`textarea-field ${className || ""}`}
      inputComponent={TextArea}
    />
  );
};

export default TextAreaField;

const ReduxTextAreaField = makeReduxField(TextAreaField);

export { ReduxTextAreaField };
