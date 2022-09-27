import React from 'react';
import PropTypes from 'prop-types';
import './CircleIcon.scss';

const CircleIcon = ({ image, caption }) => (
  <li className="circle-icon">
    <div className="circle-icon-circle">
      <img src={image} alt="" />
    </div>

    <span className="circle-icon-caption">{caption}</span>
  </li>
);

CircleIcon.propTypes = {
  image: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired
};

export default CircleIcon;
