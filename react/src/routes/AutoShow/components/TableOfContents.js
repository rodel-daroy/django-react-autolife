import React from 'react';
import PropTypes from 'prop-types';
import { childrenOfType } from 'airbnb-prop-types';
import './TableOfContents.scss';

const TableOfContents = ({ children }) => (
  <ol className="toc">
    {children}
  </ol>
);

TableOfContents.Item = ({ name, value }) => (
  <li>
    <span className="toc-name">{name}</span>
    <span className="toc-value">{value}</span>
  </li>
);

TableOfContents.propTypes = {
  children: childrenOfType(TableOfContents.Item).isRequired
};

TableOfContents.Item.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

export default TableOfContents;
