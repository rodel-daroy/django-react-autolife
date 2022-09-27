import React, { Component } from 'react';
import { getProfile } from "redux/actions/userActions";
import get from "lodash/get";
import { withRouter } from "react-router";
import { connect } from "react-redux";

export default (redirect = "/") => WrappedComponent => {
  class WrapperComponent extends Component {
    componentDidMount() {
      const { authToken, history, getProfile } = this.props;

      if (!authToken) {
        history.replace(`/?signin&redirect=${redirect}`);
      } else {
        getProfile(authToken);
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  const mapStateToProps = state => ({
    authToken: get(state, "user.authUser.accessToken")
  });

  return withRouter(connect(mapStateToProps, { getProfile })(WrapperComponent));
};