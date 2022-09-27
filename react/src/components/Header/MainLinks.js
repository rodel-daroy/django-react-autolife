import React, { Component } from "react";
import { Link } from "react-router-dom";
import { isAbsoluteUrl } from "../../utils";
import { mainLinks } from "../../config/constants";
import isEmpty from "lodash/isEmpty";

export default class MainLinks extends Component {
  render() {
    let { animationRef } = this.props;
    animationRef = animationRef || ((ref, index) => {});
    const loginUser = this.props.user;
    console.log(loginUser, "testtttting User");
    const isAdmin = isEmpty(loginUser)
      ? false
      : loginUser &&
        loginUser &&
        loginUser.user &&
        loginUser.user.user_details &&
        loginUser.user.user_details.is_superuser;
    return (
      <ul className="nav-links main-links">
        {mainLinks.map((link, i) => {
          let component = (
            <Link to={link.route} className="btn btn-link">
              {link.label}
            </Link>
          );
          if (isAbsoluteUrl(link.route)) {
            component = (
              <a href={link.route} className="btn btn-link">
                {link.label}
              </a>
            );
          }

          return (
            <li key={i} ref={ref => animationRef(ref, 10 + i)}>
              {component}
            </li>
          );
        })}

        {isAdmin ? (
          <li
            key={mainLinks.length}
            ref={ref => animationRef(ref, mainLinks.length + 10)}
          >
            <Link to="/admin" className="btn btn-link">
              Admin
            </Link>
          </li>
        ) : null}
      </ul>
    );
  }
}
