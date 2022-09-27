import React from "react";
import PropTypes from "prop-types";

const Commands = props => (
  <nav>
    <ul className={`commands ${props.align || ""} ${props.className || ""}`}>
      {React.Children.toArray(props.children).map((child, i) => (
        <li key={i}>{child}</li>
      ))}
    </ul>
  </nav>
);

Commands.propTypes = {
  children: PropTypes.node,
  align: PropTypes.oneOf(["left", "right"]),
  className: PropTypes.string
};

export default Commands;
