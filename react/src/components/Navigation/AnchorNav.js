import React, { Component } from "react";
import PropTypes from "prop-types";
import Sticky from "react-sticky-el";
import Scrollspy from "react-scrollspy";
import { Link, withRouter } from "react-router-dom";

const DEFAULT_TOP = 100;

const AnchorNav = props => {
  const { children, top } = props;

  const anchors = React.Children.toArray(children).map(
    link => link.props.anchor
  );

  return (
    <Sticky
      topOffset={-top}
      scrollElement=".layout-inner"
      stickyStyle={{ marginTop: top }}
    >
      <nav className="side-nav">
        <Scrollspy
          items={anchors}
          componentTag="ol"
          currentClassName="current"
          rootEl=".layout-inner"
        >
          {children}
        </Scrollspy>
      </nav>
    </Sticky>
  );
};

AnchorNav.propTypes = {
  top: PropTypes.number.isRequired
};

AnchorNav.defaultProps = {
  top: DEFAULT_TOP
};

AnchorNav.Link = withRouter(props => (
  <li className={props.className}>
    <Link
      className="btn btn-link"
      to={`${props.location.pathname}#${props.anchor}`}
    >
      {props.name}
    </Link>
  </li>
));

AnchorNav.Link.propTypes = {
  name: PropTypes.string,
  anchor: PropTypes.string,
  className: PropTypes.string
};

export default AnchorNav;
