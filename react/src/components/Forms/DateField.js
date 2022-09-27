import React, { Component } from "react";
import Field from "./Field";
import DatePicker from "react-datepicker";
import { makeReduxField } from "./";
import omit from "lodash/omit";
import moment from "moment";
import "./DateField.scss";

class DateFieldInner extends Component {
	state = {
		value: null
	}

	static getDerivedStateFromProps(props) {
		const { value } = props;

		return {
			value: value ? moment(value) : null
		};
	}

	handleChange = value => {
		const { onChange } = this.props;

		onChange(value ? value.toDate() : null);
	}

	handleBlur = () => {
		const { onBlur } = this.props;

		if(onBlur)
			onBlur();
	}

	render() { 
		/* eslint-disable-next-line */
		const { value, ...otherProps } = this.props;
		const { value: actualValue } = this.state;

		return (
			<DatePicker 
				{...otherProps} 
				
				selected={actualValue}
				className="form-control"
				onChange={this.handleChange}
				onBlur={this.handleBlur}
				autoComplete="off"
				dateFormat="YYYY-MM-DD" />
		);
	}
}

DateFieldInner.propTypes = {
	...omit(Field.propTypes || {}, ["inputComponent"])
};

const inputComponent = props => <DateFieldInner {...props} />;

const DateField = ({ className, ...otherProps }) => (
	<Field {...otherProps} className={`custom-date-field ${className || ""}`} inputComponent={inputComponent} />
);

DateField.propTypes = {
	...DateFieldInner.propTypes
};

const ReduxDateField = makeReduxField(DateField);
 
export default DateField;
export { ReduxDateField };