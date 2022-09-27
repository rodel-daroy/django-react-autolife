import React from 'react';
import PropTypes from 'prop-types';

const Boxout = ({ as: Component, children, className, ...otherProps }) => (
  <Component {...otherProps} className={`boxout ${className || ''}`}>
    {children}
  </Component>
);

Boxout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  as: PropTypes.any
};

Boxout.defaultProps = {
  as: 'section'
};

export default Boxout;
