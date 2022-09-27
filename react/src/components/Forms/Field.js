import React, { Component } from "react";
import PropTypes from "prop-types";
import { FieldPropTypes } from "./";
import omit from "lodash/omit";
import { scrollTo } from "../../utils";

let id = 0;

export const fieldPropTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  button: PropTypes.element,
  inputButton: PropTypes.element,
  inputComponent: PropTypes.func.isRequired,
  last: PropTypes.bool,
  dark: PropTypes.bool,
  autofill: PropTypes.bool,

  ...FieldPropTypes
};

class Field extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: `field-${id++}`,
      focused: false
    };
  }
  handleFocus = () => {
    this.setState({
      focused: true
    });
  };

  handleBlur = () => {
    this.setState({
      focused: false
    });
  };

  render() {
    const {
      name,
      label,
      children,
      className,
      state,
      helpText,
      button,
      inputComponent,
      last,
      dark,
      autofill,
      hideLabel
    } = this.props;
    const stateClass = state ? `has-${state}` : null;
    const { id, focused } = this.state;

    const actualId = this.props.id || id;
    const labelId = `${actualId}-label`;

    const input = inputComponent({
      ...omit(this.props, ["children"]),
      id: actualId,
      labelId
    });

    return (
      <div
        className={`form-group ${stateClass || ""}
          ${last ? "last" : ""}
          ${focused ? "focused" : ""}
          ${dark ? "dark" : ""}
          ${autofill ? "autofill" : ""}
          ${className || ""}`}
        aria-invalid={state === "error"}
      >
        <div className="anchor absolute" id={name} />

        {label && !hideLabel && (
          <label htmlFor={actualId} id={labelId}>
            {label}
          </label>
        )}

        <div
          className="form-group-line"
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        >
          {input}

          {button && <div className="form-group-line-button">{button}</div>}
        </div>

        <div className="form-group-children">
          {helpText && <div className="help-block">{helpText}</div>}
          {children}
        </div>
      </div>
    );
  }
}

Field.propTypes = {
  ...fieldPropTypes
};

export default Field;

const getFieldParent = field => {
  if (field.classList.contains("form-group")) return field;
  else return field.parentNode;
};

const focus = field => {
  const label = getFieldParent(field).querySelector("label");

  if (label && label.control) {
    if (label.control instanceof HTMLInputElement) label.control.select();
    else label.control.focus();
  }
};

export const focusField = name => {
  const field = document.getElementById(name);
  if (field) focus(field);
};

export const highlightField = name => {
  const field = document.getElementById(name);

  scrollTo(field);
  focus(field);
};
