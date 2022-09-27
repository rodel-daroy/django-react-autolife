import React, { Component } from "react";
import PropTypes from "prop-types";
import kebabCase from "lodash/kebabCase";
import PrimaryButton from "../Forms/PrimaryButton";

const ASpotBody = props => (
  <div
    className={`a-spot-body ${
      props.label || props.rate ? "topline" : "no-topline"
    }`}
  >
    <div className="a-spot-body-topline">
      {props.label && (
        <div className={`label label-${kebabCase(props.label)}`}>
          {props.label}
        </div>
      )}
      {props.rate}
    </div>
    <div className="a-spot-body-title">
      <h1>{props.heading}</h1>
      {props.synopsis && (
        <h2 className="a-spot-body-synopsis">{props.synopsis}</h2>
      )}

      {props.link && (
        <div className="a-spot-body-link">
          <PrimaryButton
            className="first last"
            dark
            link={props.link}
            target={props.target}
          >
            {props.linkLabel}
          </PrimaryButton>
        </div>
      )}
    </div>
  </div>
);

ASpotBody.propTypes = {
  label: PropTypes.string,
  rate: PropTypes.node,
  heading: PropTypes.node,
  synopsis: PropTypes.node,
  link: PropTypes.any,
  linkLabel: PropTypes.node.isRequired,
  target: PropTypes.string
};

ASpotBody.defaultProps = {
  linkLabel: (
    <span>
      Read more <span className="icon icon-angle-right" />
    </span>
  )
};

export default ASpotBody;
