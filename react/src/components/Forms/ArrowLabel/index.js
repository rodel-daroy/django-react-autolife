import React from 'react';
import './style.scss';

export default props => (
  <div {...props} className={`ArrowLabel ArrowLabel-${props.color}`}>
    <div className="ArrowLabel-inner">{props.children}</div>
  </div>
);
