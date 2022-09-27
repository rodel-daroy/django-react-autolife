import React from 'react';
import { childrenOfType } from 'airbnb-prop-types';
import Tile from './Tile';
import './TileContainer.scss';

const TileContainer = ({ children }) => (
  <section className="auto-show-tile-container">
    {children}
  </section>
);

TileContainer.propTypes = {
  children: childrenOfType(Tile).isRequired
};

export default TileContainer;
