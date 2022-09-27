import React from 'react';
import PropTypes from 'prop-types';
import './IconHeading.scss';

const IconHeading = ({ as: Component, children, icon }) => (
  <Component className="icon-heading">
    {icon && <img className="icon-heading-icon" src={icon} alt="" />}
    {children}
  </Component>
);

IconHeading.propTypes = {
  as: PropTypes.any,
  children: PropTypes.node.isRequired,
  icon: PropTypes.string
};

IconHeading.defaultProps = {
  as: 'h2'
};

export default IconHeading;
