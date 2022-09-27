import React, { Component } from "react";
import PropTypes from "prop-types";
import TextField, { textFieldProps } from "./TextField";
import without from "lodash/without";
import omit from "lodash/omit";
import { COLORS } from "../../utils/style";
import { makeReduxField } from "./";
import { calculatePasswordStrength } from "../../utils/validations";

export const passwordFieldProps = {
  steps: PropTypes.object.isRequired,
  hideMeter: PropTypes.bool,

  ...(textFieldProps || {})
};

export default class PasswordField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reveal: false,
      strength: 0,
      showControls: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value } = this.props;
    const { showControls } = this.state;

    if (nextProps.value !== value) {
      const shouldShowControls = nextProps.value && nextProps.value.length > 0;

      if (shouldShowControls !== showControls)
        this.setState({
          showControls: shouldShowControls,
          reveal: false
        });
    }
  }

  getStepKeys() {
    const { steps } = this.props;
    return Object.keys(steps)
      .map(k => parseFloat(k))
      .sort((a, b) => a - b);
  }

  getStep(strength) {
    const { steps } = this.props;
    const keys = this.getStepKeys();

    for (let i = 0; i < keys.length - 1; ++i) {
      if (strength >= keys[i] && strength < keys[i + 1]) {
        let step = { ...steps[keys[i]] };

        return step;
      }
    }

    return steps[keys[keys.length - 1]];
  }

  handleChange = value => {
    const { onChange } = this.props;

    this.setState({
      strength: calculatePasswordStrength(value)
    });

    if (onChange) onChange(value);
  };

  handleToggleReveal = () => {
    this.setState({
      reveal: !this.state.reveal
    });
  };

  render() {
    const { className, inputClassName, hideMeter, dark } = this.props;
    const { strength, reveal, showControls } = this.state;

    const passwordPropTypes = without(
      Object.keys(passwordFieldProps),
      ...Object.keys(textFieldProps)
    );
    const childProps = omit(this.props, passwordPropTypes);

    const step = this.getStep(strength);

    return (
      <TextField
        {...childProps}
        type={reveal ? "text" : "password"}
        className={`${className || ""} password-field ${
          showControls ? "show-controls" : ""
        }`}
        inputClassName={`${inputClassName || ""} password`}
        onChange={this.handleChange}
        button={
          showControls ? (
            <button
              type="button"
              className={`btn btn-link password-reveal ${dark ? "dark" : ""}`}
              onClick={this.handleToggleReveal}
              aria-label={`${reveal ? "Hide" : "Reveal"} password`}
              title={`${reveal ? "Hide" : "Reveal"} password`}
            >
              <span className={`icon icon-${reveal ? "hide" : "reveal"}`} />
            </button>
          ) : null
        }
      >
        {showControls && !hideMeter && (
          <div className="password-strength">
            <div className="password-strength-bar">
              <div
                className="password-strength-fill"
                style={{
                  width: `${Math.max(10, strength)}%`,
                  backgroundColor: step.color
                }}
              />
            </div>

            <div
              className="password-strength-label"
              style={{ color: step.color }}
            >
              {step.label}
            </div>
          </div>
        )}
      </TextField>
    );
  }
}

PasswordField.propTypes = {
  steps: PropTypes.object.isRequired,
  hideMeter: PropTypes.bool,

  ...(textFieldProps || {})
};

PasswordField.defaultProps = {
  steps: {
    0: {
      label: "Very weak",
      color: COLORS.BRAND_RED
    },
    10: {
      label: "Weak",
      color: COLORS.BRAND_ORANGE
    },
    30: {
      label: "Medium",
      color: COLORS.BRAND_YELLOW
    },
    50: {
      label: "Strong",
      color: COLORS.BRAND_GREEN
    },
    70: {
      label: "Very strong",
      color: COLORS.BRAND_GREEN
    },
    100: {
      label: "Very strong",
      color: COLORS.BRAND_GREEN
    }
  },

  ...(TextField.defaultProps || {})
};

const ReduxPasswordField = makeReduxField(PasswordField);

export { ReduxPasswordField };
