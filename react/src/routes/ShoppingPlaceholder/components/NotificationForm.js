import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { ReduxTextField } from 'components/Forms/TextField';
import { required, email } from 'utils/validations';
import PrimaryButton from 'components/Forms/PrimaryButton';

const NotificationForm = ({ handleSubmit }) => (
	<form onSubmit={handleSubmit}>
		<Field
			name="email"
			label="Email"
			type="email"
			component={ReduxTextField}
			validate={[required, email]} />

		<PrimaryButton type="submit">
			Submit
		</PrimaryButton>
	</form>
);
 
export default reduxForm({
	form: 'notificationForm'
})(NotificationForm);