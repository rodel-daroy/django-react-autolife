import React from "react";
import PropTypes from "prop-types";
import Field from "./Field";
import { makeReduxField } from "./";
import { FieldPropTypes } from "./index";

const RadioButtonGroupInner = ({
  options,
  className,
  onChange,
  onBlur,
  onFocus,
  value,
  labelId,
  size
}) => {
  const inputValue = value;

  const checkboxes = options.map(({ label, value }, index) => {
    const handleChange = () => {
      if(onBlur) onBlur(value);
      return onChange(value);
    };

    const checked = value == inputValue;

    return (
      <div
        className={`btn btn-radio ${checked ? "active" : ""}`}
        onClick={handleChange}
        key={`radio-${index}`}
      >
        <input
          type="radio"
          onChange={handleChange}
          value={value}
          checked={checked}
          onFocus={onFocus}
          aria-label={label}
        />
        <div>{label}</div>
      </div>
    );
  });

  return (
    <div className={`autolife-radio-group ${size} ${className || ""}`}>
      <div
        className="btn-group"
        data-toggle="buttons"
        aria-labelledby={labelId}
      >
        {checkboxes}
      </div>
    </div>
  );
};

const RadioButtonGroup = ({ label, options, ...otherProps }) => {
  return (
    <Field
      {...otherProps}
      label={label}
      options={options}
      inputComponent={RadioButtonGroupInner}
    />
  );
};

RadioButtonGroup.propTypes = {
  ...FieldPropTypes,

  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.any,
    value: PropTypes.any
  })),
  size: PropTypes.oneOf(['small', 'medium'])
};

RadioButtonGroup.defaultProps = {
  size: 'medium'
};

const ReduxRadioButtonGroup = makeReduxField(RadioButtonGroup);

export default RadioButtonGroup;
export { ReduxRadioButtonGroup };
