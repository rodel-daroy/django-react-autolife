import React from "react";
import ALField from "../../../../components/Forms/Field";
import { Field } from "redux-form";
import { ReduxDropdownField } from "../../../../components/Forms/DropdownField";
import { required } from "../../../../utils/validations";

const DateField = ({
  name,
  label,
  shortLabel,
  dayField,
  monthField,
  yearField,
  options: { days, months, years },
  className,
  last
}) => (
  <ALField
    name={name}
    label={label}
    className={className}
    last={last}
    inputComponent={({ id, ...otherProps }) => (
      <span className="date-field">
        <Field
          id={id}
          className="date-field-day"
          name={dayField}
          component={ReduxDropdownField}
          placeholder="Day"
          options={days}
          validate={[required]}
          parentField={name}
          shortLabel={`Day ${shortLabel || label}`}
        />
        <Field
          className="date-field-month"
          name={monthField}
          component={ReduxDropdownField}
          placeholder="Month"
          options={months}
          validate={[required]}
          parentField={name}
          shortLabel={`Month ${shortLabel || label}`}
        />
        <Field
          className="date-field-year"
          name={yearField}
          component={ReduxDropdownField}
          placeholder="Year"
          options={years}
          validate={[required]}
          parentField={name}
          shortLabel={`Year ${shortLabel || label}`}
        />
      </span>
    )}
  />
);

export default DateField;
