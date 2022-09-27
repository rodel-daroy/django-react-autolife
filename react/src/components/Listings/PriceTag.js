import React, { Component } from "react";
import PropTypes from "prop-types";
import holeImage from "../../styles/img/listings/tag-hole.svg";

const PriceTag = props => {
  const { children, component, className } = props;

  const Component = component;

  return (
    <Component className={`price-tag ${className || ""}`}>
      <div className="price-tag-inner">
        <div className="price-tag-text">
          <img className="price-tag-hole" src={holeImage} />

          {children}
        </div>
      </div>
    </Component>
  );
};

PriceTag.propTypes = {
  children: PropTypes.node,
  component: PropTypes.any.isRequired,
  className: PropTypes.string
};

PriceTag.defaultProps = {
  component: "h2"
};

export default PriceTag;
