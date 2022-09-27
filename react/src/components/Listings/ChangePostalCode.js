import React, { Component } from "react";
import PropTypes from "prop-types";
import PostalCodeField from "./PostalCodeField";

export default class ChangePostalCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newPostalTab: false,
      postalCode: props.postalCode
    };
  }

  // componentWillReceiveProps(nextProps) {
  //   this.setState({
  //     postalCode: nextProps.postalCode
  //   });
  // }

  changePostalCode = () => {
    const { onBeginChange } = this.props;

    if (onBeginChange) onBeginChange();

    this.setState({
      newPostalTab: true
    });
  };

  handleSubmit = postalCode => {
    const { onSubmit } = this.props;

    this.setState({
      newPostalTab: false,
      postalCode: postalCode
    });

    if (onSubmit) onSubmit(postalCode);
  };

  handleCancel = () => {
    this.setState({
      newPostalTab: false
    });
  };

  render() {
    const { postalCode, newPostalTab } = this.state;
    const { className } = this.props;

    if (!newPostalTab && postalCode) {
      return (
        <div className="postal-code-section">
          <div className="current-postal-code">
            <span className="icon icon-location" />{" "}
            {(postalCode || "").toUpperCase()}{" "}
            <a
              className="btn btn-link primary-link"
              onClick={this.changePostalCode}
            >
              Change
            </a>
          </div>
        </div>
      );
    } else {
      return (
        <div className="postal-code-section">
          <PostalCodeField
            showCancel={postalCode && postalCode.length > 0}
            onSubmit={this.handleSubmit}
            value={postalCode}
            onCancel={this.handleCancel}
            className={className}
          />
        </div>
      );
    }
  }
}

ChangePostalCode.propTypes = {
  onSubmit: PropTypes.func,
  postalCode: PropTypes.any,
  onBeginChange: PropTypes.func
};
