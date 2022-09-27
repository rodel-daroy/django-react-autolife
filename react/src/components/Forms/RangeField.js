import React from "react";
import PropTypes from "prop-types";
import Field from "./Field";
import omit from "lodash/omit";
import range from "lodash/range";
import { makeReduxField } from "./";
import "./RangeField.scss";

const RangeField = ({
  inputComponent,
  className,

  ...otherProps
}) => {
  const input = ({
    id,
    inputClassName,
    placeholder,
    inputComponent,
    labelId,
    state,
    onChange,
    tickInterval,
    min,
    max,
    value,

    ...otherProps
  }) => {
    const handleChange = e => {
      const value = parseInt(e.target.value);
      if(onChange)
        onChange(value);
    };

    return (
      <React.Fragment>
        <input 
          {...otherProps} 
          id={id}
          type="range" 
          value={value}
          onChange={handleChange} 
          min={min} 
          max={max} 
          list={`${id}-ticks`}></input>

        {tickInterval != null && (
          <datalist id={`${id}-ticks`}>
            {range(min, max, tickInterval).map(tick => (
              <option key={tick} value={tick} />
            ))}
          </datalist>
        )}

        <input 
          className="range-field-number form-control"
          type="number" 
          min={min} 
          max={max} 
          value={value}
          onChange={handleChange}></input>
      </React.Fragment>
    );
  };

  return (
    <Field 
      {...otherProps} 
      className={`range-field ${className ||""}`}
      inputComponent={input} />
  );
};

RangeField.propTypes = {
  ...omit(Field.propTypes || {}, ["inputComponent"]),

  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  tickInterval: PropTypes.number
};
 
export default RangeField;
export const ReduxRangeField = makeReduxField(RangeField);