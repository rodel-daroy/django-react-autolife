import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ image, children, className }) => (
  <section className={`card ${className || ''}`}>
    <div className="card-inner">
      {image && (
        <div className="card-image" style={{ backgroundImage: `url('${image}')` }}>
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  </section>
);

Card.propTypes = {
  image: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Card;
