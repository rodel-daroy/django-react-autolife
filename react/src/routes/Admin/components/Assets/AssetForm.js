import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, propTypes, Field, formValueSelector } from 'redux-form';
import { required } from 'utils/validations';
import { ReduxTextField } from 'components/Forms/TextField';
import { ReduxUploadField } from 'components/Forms/UploadField';
import PrimaryButton from 'components/Forms/PrimaryButton';
import { connect } from 'react-redux';

const AssetForm = ({ handleSubmit, loading, currentFile, currentName, change }) => {
	useEffect(() => {
		if(currentFile && !currentName)
			change('name', currentFile[0].name);
	}, [currentFile]);

	const onSubmit = e => {
		handleSubmit(e);

		e.preventDefault();
		e.stopPropagation();
	};

	return (
		<form onSubmit={onSubmit}>
			<Field
				name="file"
				label="Image"
				component={ReduxUploadField}
				accept={['image/jpeg', 'image/png']}
				validate={[required]}
				disabled={loading} />

			<Field
				name="name"
				label="Name"
				component={ReduxTextField}
				validate={[required]}
				disabled={loading} />

			<PrimaryButton type="submit" disabled={loading}>
				Save asset
			</PrimaryButton>
		</form>
	);
};

AssetForm.propTypes = {
	...propTypes,

	loading: PropTypes.bool,

	currentFile: PropTypes.any,
	currentName: PropTypes.string
};

const mapStateToProps = (state, { form }) => {
	const select = formValueSelector(form);

	return {
		currentFile: select(state, 'file'),
		currentName: select(state, 'name')
	};
};
 
export default reduxForm({ form: 'assetForm' })(connect(mapStateToProps)(AssetForm));