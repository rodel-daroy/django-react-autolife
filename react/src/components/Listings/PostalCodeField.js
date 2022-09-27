import React from "react";
import PropTypes from "prop-types";
import TextField from "../Forms/TextField";
import PrimaryButton from "../Forms/PrimaryButton";

function checkPostalCodeValidation(value) {
  const regEx = new RegExp(
    /^\s*[a-ceghj-npr-tvxy]\d[a-ceghj-npr-tv-z](\s)?\d[a-ceghj-npr-tv-z]\d\s*$/i
  );
  if (regEx.test(value)) {
    return true;
  }
  return false;
}

export default class PostalCodeField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMsg: false,
      required: false,
      postalCodeValue: this.props.value
    };
  }

  handlePostalCode = e => {
    this.setState({
      postalCodeValue: e.target.value,
      required: false
    });

    const errorMsg = !this.checkForValidPostalCode(e.target.value);
    if (errorMsg !== this.state.errorMsg) {
      this.setState({
        errorMsg: errorMsg
      });
    }
  };

  submitSearch = e => {
    e.preventDefault();

    const { onSubmit } = this.props;
    const { postalCodeValue } = this.state;

    if (postalCodeValue != undefined) {
      const errorMsg = !this.checkForValidPostalCode(postalCodeValue);
      if (errorMsg) {
        this.setState({
          errorMsg: true
        });
      } else {
        if (onSubmit) onSubmit(postalCodeValue);
      }
    } else {
      this.setState({
        required: true
      });
    }
  };

  checkForValidPostalCode(value) {
    const valid = checkPostalCodeValidation(value);
    return valid;
  }

  handleKeyPress = e => {
    if (e.key === "Enter") {
      this.submitSearch(e);
    }
  };

  render() {
    const { showCancel, onCancel, className } = this.props;
    const { errorMsg, required, postalCodeValue } = this.state;

    return (
      <div className="postal-code-field" onKeyPress={this.handleKeyPress}>
        <TextField
          label="Enter a Postal Code"
          placeholder="Postal Code"
          state={errorMsg ? "error" : null}
          helpText={errorMsg ? "Please enter valid postal code" : null}
          value={postalCodeValue}
          onChange={this.handlePostalCode}
          inputClassName={className}
          button={
            <div>
              <PrimaryButton onClick={this.submitSearch}>
                Search <span className="icon icon-angle-right" />
              </PrimaryButton>

              {showCancel && (
                <button
                  className="btn btn-link"
                  type="button"
                  onClick={onCancel}
                >
                  <span className="icon icon-x" /> Cancel
                </button>
              )}
            </div>
          }
        />
      </div>
    );
  }
}

PostalCodeField.propTypes = {
  showCancel: PropTypes.bool,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  value: PropTypes.string
};
