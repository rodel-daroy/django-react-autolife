import React from 'react';
import { childrenOfType } from 'airbnb-prop-types';
import CircleIcon from './CircleIcon';
import './CircleIcons.scss';

const CircleIcons = ({ children }) => (
  <ul className="circle-icons">
    {children}
  </ul>
);

CircleIcons.propTypes = {
  children: childrenOfType(CircleIcon).isRequired
};

export default CircleIcons;
