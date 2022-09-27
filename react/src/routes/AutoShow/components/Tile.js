import React from 'react';
import PropTypes from 'prop-types';
import './Tile.scss';

const Tile = ({ children, heading, image, href }) => (
  <a className="auto-show-tile" href={href} target="_blank">
    <img className="auto-show-tile-image" src={image} alt="" />

    <div className="auto-show-tile-content">
      <h3>{heading}</h3>
      <div className="auto-show-tile-children">
        {children}
      </div>
    </div>
  </a>
);

Tile.propTypes = {
  heading: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  image: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired
};

export default Tile;
