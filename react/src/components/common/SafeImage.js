import React, { Component } from "react";
import PropTypes from "prop-types";
import omit from "lodash/omit";

export default class SafeImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false
    };
  }

  handleError = e => {
    const { onError } = this.props;

    this.setState({
      error: true
    });

    if (onError) onError(true);
  };

  render() {
    const { imageRef, className } = this.props;
    const imageProps = {
      imageRef,
      className
    };
    let { style } = this.props;
    const { error } = this.state;

    if (error) style = Object.assign({}, style, { visibility: "hidden" });

    return (
      <img
        {...omit(this.props, Object.keys(imageProps))}
        ref={imageRef}
        style={style}
        onError={this.handleError}
        className={`${className || ""} ${error ? "image-error" : ""}`}
      />
    );
  }
}

SafeImage.propTypes = {
  imageRef: PropTypes.func,
  className: PropTypes.string
};
