import React from "react";
import PropTypes from "prop-types";
import { reduxForm, Field, propTypes } from "redux-form";
import { ReduxTextField } from "components/Forms/TextField";
import { email, required } from "utils/validations";
import { ReduxPasswordField } from "components/Forms/PasswordField";
import PrimaryButton from "components/Forms/PrimaryButton";

const SimpleRegisterForm = ({ handleSubmit, loading, dirty }) => (
  <form className="simple-register-form" onSubmit={handleSubmit}>
    <Field
      name="email"
      label="Enter email address"
      component={ReduxTextField}
      validate={[required, email]}
      disabled={loading} />

    <div className={`simple-register-form-passwords ${dirty ? "dirty" : ""}`}>
      <Field
        name="password"
        label="Password"
        component={ReduxPasswordField}
        validate={[required]}
        autoComplete="new-password"
        disabled={loading} />
    </div>

    <PrimaryButton className="first" type="submit" disabled={loading}>
      Register
    </PrimaryButton>
  </form>
);

SimpleRegisterForm.propTypes = {
  ...propTypes,

  loading: PropTypes.bool
};
 
export default reduxForm({
  form: "SimpleRegisterForm"
})(SimpleRegisterForm);