import React from "react";
import PropTypes from "prop-types";
import omit from "lodash/omit";
import { makeReduxField } from "./";
import Field, { fieldPropTypes } from "./Field";

export const textFieldProps = {
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  size: PropTypes.oneOf(["short"]),

  ...omit(Field.propTypes || {}, ["inputComponent"])
};

const TextField = ({
  inputComponent,
  className,
  prefix,
  suffix,
  size,
  ...otherProps
}) => {
  const input = ({
    id,
    type,
    inputClassName,
    placeholder,
    inputComponent,
    labelId,
    state,
    onChange,
    ...otherProps
  }) => {
    const handleChange = e => {
      const value = e.target.value;
      if(onChange)
        onChange(value);
    };

    const control = size => (
      <input
        {...omit(otherProps, Object.keys(fieldPropTypes))}
        id={id}
        type={type}
        className={`form-control text-field-inner ${size ||
          ""} ${inputClassName || ""}`}
        placeholder={placeholder}
        aria-invalid={state === "error"}
        onChange={handleChange}
      />
    );

    if (!prefix && !suffix) return control(size);
    else
      return (
        <div className={`input-group text-field-inner ${size || ""}`}>
          {prefix && <div className="input-group-addon">{prefix}</div>}

          {control()}

          {suffix && <div className="input-group-addon">{suffix}</div>}
        </div>
      );
  };

  return (
    <Field
      {...otherProps}
      className={`text-field ${className || ""}`}
      inputComponent={input}
    />
  );
};

TextField.propTypes = {
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  size: PropTypes.oneOf(["short"]),

  ...omit(Field.propTypes || {}, ["inputComponent"])
};

export default TextField;

const ReduxTextField = makeReduxField(TextField);

export { ReduxTextField };
