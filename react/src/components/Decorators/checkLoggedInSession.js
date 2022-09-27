import React, { Component } from "react";
import get from "lodash/get";
import { connect } from "react-redux";
import {
  timeTo12HrFormat,
  timeToMinutes,
  userLoggedInSession
} from "utils/format";
import { logoutUser } from "../../redux/actions/userActions";
import { modalSignIn } from "../../redux/actions/userContainerActions";
import { refreshUserToken, verifyUserToken } from "redux/actions/userActions";

export default WrappedComponent => {
  class WrapperComponent extends Component {
    componentDidMount() {
      const {
        authToken,
        sessionTime,
        refreshUserToken,
        verifyUserToken
      } = this.props;

      const loggedInTime = timeTo12HrFormat(sessionTime);
      const loggedTimeInMinutes = timeToMinutes(loggedInTime);
      const currentTime = timeTo12HrFormat(new Date().toLocaleTimeString());
      const currentTimeInMin = timeToMinutes(currentTime);
      const checkLogInSession = userLoggedInSession(
        currentTimeInMin,
        loggedTimeInMinutes
      );
      const params = { token: authToken };
      if (checkLogInSession) {
        this.props.logoutUser(authToken);
        localStorage.clear();
        this.props.modalSignIn();
      } else if (authToken) verifyUserToken(params);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    authToken: get(state, "user.authUser.accessToken"),
    sessionTime: get(state, "user.sessionTime")
  });

  return connect(
    mapStateToProps,
    { verifyUserToken, modalSignIn, logoutUser }
  )(WrapperComponent);
};
