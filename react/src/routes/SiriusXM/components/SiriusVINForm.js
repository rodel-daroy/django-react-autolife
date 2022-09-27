import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, propTypes } from 'redux-form';
import { required } from 'utils/validations';
import { ReduxTextField } from 'components/Forms/TextField';

const SiriusVINForm = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <Field
      name="vin"
      component={ReduxTextField}
      validate={[required]}
      placeholder="Enter your RadioID/ESN or VIN" />
  </form>
);

SiriusVINForm.propTypes = {
  ...propTypes
};

export default reduxForm({
  form: 'siriusVIN'
})(SiriusVINForm);
