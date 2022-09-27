import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { integer } from 'airbnb-prop-types';
import Dropzone from 'react-dropzone';
import PrimaryButton from 'components/Forms/PrimaryButton';
import './Upload.scss';

class Upload extends Component {
	state = {}

	componentDidUpdate(prevProps) {
		const { value } = this.props;

		if(value && prevProps.value !== value) {
			this.setState({
				value
			});
		}
	}

	handleDrop = accepted => {
		const { onChange, onFocus, onBlur } = this.props;

		let value = Array.from(accepted);
		if(value.length === 0)
			value = null;

		this.setState({
			value
		});

		if(onFocus)
			onFocus();

		if(onChange)
			onChange(value);

		if(onBlur)
			onBlur();
	}

	handleDownloadClick = e => {
		e.stopPropagation();
	}

	renderChildren() {
		const { value } = this.state;
		const { url } = this.props;

		if(!value && url)
			return (
				<a className="upload-text" href={url} target="_blank" rel="noopener noreferrer" onClick={this.handleDownloadClick}>
					View file
				</a>
			);
		else {
			let file;
			if(value instanceof Array && value.length > 0)
				file = value[0];
			else
				file = value;

			if(file)
				return <span className="upload-text">{file.name}</span>;
			else
				return null;
		}
	}

	render() {
		/* eslint-disable no-unused-vars */
		const { id, accept, multiple, maxSize, minSize, className, onChange, disabled, ...otherProps } = this.props;
		/* eslint-enable */

		return (
			<Dropzone 
				{...otherProps} 

				id={id}
				className={className || ''} 
				accept={accept}
				multiple={multiple}
				maxSize={maxSize} 
				minSize={minSize} 
				onDrop={this.handleDrop}
				disabled={disabled}>

				{this.renderChildren()}

				<PrimaryButton component="div" className="upload-button" size="small" tabIndex={-1}>Upload</PrimaryButton>
			</Dropzone>
		);
	}
}

Upload.propTypes = {
	id: PropTypes.string,
	className: PropTypes.string,
	accept: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
	multiple: PropTypes.bool,
	maxSize: integer(),
	minSize: integer(),
	onChange: PropTypes.func,
	onBlur: PropTypes.func,
	onFocus: PropTypes.func,
	value: PropTypes.arrayOf(PropTypes.instanceOf(File)),
	disabled: PropTypes.bool,
	url: PropTypes.string
};

export default Upload;