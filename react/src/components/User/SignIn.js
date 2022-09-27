import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import PrimaryButton from "components/Forms/PrimaryButton";

class SignIn extends Component {
  renderMobile(animationRef) {
    return (
      <div className="main-mobile-nav-inner">
        <PrimaryButton link="?register">
          Sign Up <span className="icon icon-angle-right" />
        </PrimaryButton>

        <p>
          Already a member?{" "}
          <Link to="?signin" className="btn btn-link">
            Sign In <span className="icon icon-angle-right" />
          </Link>
        </p>
      </div>
    );
  }

  render() {
    const { mobile } = this.props;

    let { animationRef } = this.props;
    animationRef = animationRef || ((ref, i) => {});

    return (
      <div className="signin">
        {mobile ? (
          this.renderMobile(animationRef)
        ) : (
          <div className="main-subheader-content">
            <div ref={ref => animationRef(ref, 0)}>
              Join the millions of Canadian drivers like you!
            </div>

            <div className="signin-panel">
              <ul ref={ref => animationRef(ref, 1, 1)} className="nav-links">
                <li>
                  <Link to="?register" className="btn btn-link">
                    <span className="icon icon-angle-right" /> Sign Up
                  </Link>
                </li>
                <li role="separator" />
                <li>
                  <Link to="?signin" className="btn btn-link">
                    <span className="icon icon-angle-right" /> Sign In
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }
}

SignIn.propTypes = {
  animationRef: PropTypes.func,
  mobile: PropTypes.bool
};

export default withRouter(SignIn);
