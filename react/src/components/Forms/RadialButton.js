import React, { Component } from "react";
import PropTypes from "prop-types";
import omit from "lodash/omit";

const RadialButton = props => {
  const { children, className, type, size, component, hover, dark } = props;
  const Component = component;
  const radialButtonProps = {
    children,
    className,
    type,
    size,
    component,
    hover,
    dark
  };
  return (
    <Component
      className={`btn radial-button ${size} ${dark ? "dark" : ""} ${
        hover ? "hover" : ""
      } ${className || ""}`}
      type={component === "button" ? type : null}
      {...omit(props, Object.keys(radialButtonProps))}
    >
      {children}
    </Component>
  );
};

RadialButton.propTypes = {
  component: PropTypes.any,
  className: PropTypes.string,
  children: PropTypes.node,
  type: PropTypes.string,
  size: PropTypes.oneOf(["tiny", "small", "large"]),
  hover: PropTypes.bool,
  dark: PropTypes.bool
};

RadialButton.defaultProps = {
  component: "button",
  type: "button",
  size: "small"
};

export default RadialButton;
