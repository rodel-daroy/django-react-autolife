import React from "react";
import { Field, reduxForm, initialize } from "redux-form";
import { ReduxTextField } from "../../Forms/TextField";

const required = message => value => (value ? undefined : message);

const DealerFormInput = props => {
  const { id, name, type, label, validation_msg } = props;

  return (
    <Field
      component={ReduxTextField}
      id={id}
      name={name}
      type={type}
      validate={[required(validation_msg)]}
      label={label}
    />
  );
};

export default DealerFormInput;
