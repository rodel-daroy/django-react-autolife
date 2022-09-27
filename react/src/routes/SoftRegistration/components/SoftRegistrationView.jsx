import React from 'react';
import RegisterView from '../../../components/Register/RegisterView';

const SoftRegistrationView = props => (
  <RegisterView user={props.user} router={props.router} />
);

export default SoftRegistrationView;
