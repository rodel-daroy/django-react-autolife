import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import get from "lodash/get";

const RequireSignIn = defaultRoute => WrappedComponent => {
  class WrapperComponent extends Component {
    componentDidMount() {
      const { authorized, router, location } = this.props;

      if (!authorized)
        router.push(
          `${defaultRoute || location.pathname}?signin&redirect=${
            location.pathname
          }`
        );
    }

    render() {
      const { authorized } = this.props;

      if (authorized) return <WrappedComponent {...this.props} />;
      else return null;
    }
  }

  const mapStateToProps = state => ({
    authorized: !!get(state, "user.authUser.accessToken")
  });

  return connect(mapStateToProps)(withRouter(WrapperComponent));
};

export default RequireSignIn;
