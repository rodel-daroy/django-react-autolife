import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import omit from "lodash/omit";
import { removeTrailingSlash } from "../../utils";

const Breadcrumbs = props => {
  const { children, className } = props;

  return (
    <nav aria-label="Breadcrumb">
      <ol className={`breadcrumbs ${className || ""}`}>
        <li className="home-crumb">
          <Link className="btn btn-link crumb" to="/" aria-label="Home">
            <span className="icon icon-home" />
          </Link>
        </li>

        {children}
      </ol>
    </nav>
  );
};

Breadcrumbs.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

Breadcrumbs.Crumb = withRouter(props => {
  const { link, name, location, className } = props;

  const hasLink =
    link &&
    removeTrailingSlash(location.pathname) !== removeTrailingSlash(link);

  return (
    <li>
      {hasLink && (
        <Link className={`btn btn-link crumb ${className || ""}`} to={link}>
          {name}
        </Link>
      )}
      {!hasLink && (
        <div className={`btn btn-link crumb ${className || ""}`}>{name}</div>
      )}
    </li>
  );
});

Breadcrumbs.Crumb.propTypes = {
  link: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string
};

const RouterBreadcrumbs = withRouter(props => {
  const { routes, lastName } = props;

  if (routes) {
    let children = routes.slice(1).map((route, i) => {
      let link,
        name = route.name;

      if (i < routes.length - 2) link = route.path;
      else name = lastName || route.name;

      return <Breadcrumbs.Crumb key={i} link={link} name={name} />;
    });

    return (
      <Breadcrumbs {...omit(props, ["routes", "lastName"])}>
        {children}
      </Breadcrumbs>
    );
  } else return null;
});

RouterBreadcrumbs.propTypes = {
  routes: PropTypes.array,
  lastName: PropTypes.string,
  ...Breadcrumbs.propTypes
};

export default Breadcrumbs;
export { RouterBreadcrumbs };
