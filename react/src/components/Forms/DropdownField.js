import React, { Component } from "react";
import PropTypes from "prop-types";
import omit from "lodash/omit";
import Select, { Async } from "react-select";
import { makeReduxField } from "./";
import Field from "./Field";

class DropdownFieldInner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lastValue: props.value
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value } = this.props;

    if (value !== nextProps.value) {
      this.setState({
        lastValue: nextProps.value
      });
    }
  }

  handleChange = value => {
    const { onChange } = this.props;

    if (onChange) {
      this.setState({
        lastValue: value
      });

      onChange(value);
    }
  };

  handleBlur = e => {
    const { onBlur } = this.props;
    const { lastValue } = this.state;

    if (onBlur) {
      onBlur(lastValue);
    }
  };

  renderArrow = ({ onMouseDown, isOpen }) => (
    <span onMouseDown={onMouseDown} className="icon icon-angle-down" />
  );

  renderOption = (option, i, inputValue) => <div>{option.label}</div>;

  render() {
    const {
      options,
      value,
      noBorder,
      disabled,
      size,
      searchable,
      loadOptions
    } = this.props;

    const Component = loadOptions ? Async : Select;

    return (
      <div
        className={`custom-dropdown ${size} ${noBorder ? "no-border" : ""} ${
          disabled ? "disabled" : ""
        }`}
      >
        <div className="custom-dropdown-inner">
          <Component
            {...omit(this.props, ["noBorder", "className"])}
            clearable={false}
            searchable={searchable}
            arrowRenderer={this.renderArrow}
            optionRenderer={this.renderOption}
            options={!loadOptions && options}
            loadOptions={loadOptions}
            filterOptions={loadOptions ? (options => options) : undefined}
            value={value}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            /* simpleValue */
            onBlurResetsInput
            onCloseResetsInput
          />
        </div>
      </div>
    );
  }
}

const inputComponent = props => <DropdownFieldInner {...props} />;

const DropdownField = props => (
  <Field {...props} inputComponent={inputComponent} />
);

DropdownField.propTypes = {
  ...omit(Select.propTypes, ["options"]),

  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.any.isRequired,
      value: PropTypes.any
    })
  ),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  noBorder: PropTypes.bool,
  placeholder: PropTypes.string,
  searchable: PropTypes.bool,
  loadOptions: PropTypes.func,

  ...omit(Field.propTypes || {}, ["inputComponent"])
};

DropdownField.defaultProps = {
  size: "large",
  placeholder: "Select",

  ...(Field.defaultProps || {})
};

const ReduxDropdownField = makeReduxField(DropdownField);

export default DropdownField;
export { ReduxDropdownField };
