import React, { Component } from "react";
import PropTypes from "prop-types";
import omit from "lodash/omit";
import { makeReduxField, FieldPropTypes } from "./";

let id = 0;

export const checkboxProps = {
  children: PropTypes.node,
  ...FieldPropTypes
};

class Checkbox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: `checkbox-${id++}`
    };
  }

  // these events are handled to ensure redux-form stores the value as boolean
  handleChange = e => {
    const { onChange } = this.props;

    const value = e.target.checked;
    if(onChange)
      onChange(value);
  }

  handleBlur = e => {
    const { onBlur } = this.props;

    if(onBlur)
      onBlur();
  }

  render() {
    const { label, children, state, helpText } = this.props;
    const { id } = this.state;
    const actualId = this.props.id || id;

    const innerProps = omit(this.props, Object.keys(checkboxProps));

    const stateClass = state ? `has-${state}` : null;

    return (
      <div className={`custom-checkbox checkbox ${stateClass || ""}`}>
        <input
          {...innerProps}
          id={actualId}
          type="checkbox"
          aria-invalid={state === "error"}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
        />

        <label htmlFor={actualId}>
          <div className="checkbox-box">
            <span
              className="icon icon-checkmark"
              style={{ cursor: "pointer" }}
            />
          </div>

          <div className="checkbox-label">{label}</div>
        </label>

        {children && <div className="checkbox-content">{children}</div>}

        {helpText && <div className="help-block">{helpText}</div>}
      </div>
    );
  }
}

Checkbox.propTypes = {
  children: PropTypes.node,
  ...FieldPropTypes
};

const makeReduxCheckbox = WrappedComponent => {
  const ReduxField = makeReduxField(WrappedComponent);

  const component = props => (
    <ReduxField {...props} checked={props.input.value} />
  );

  component.propTypes = {
    ...ReduxField.propTypes
  };

  component.defaultProps = {
    ...ReduxField.defaultProps
  };

  return component;
};

const ReduxCheckbox = makeReduxCheckbox(Checkbox);

export default Checkbox;
export { ReduxCheckbox };
