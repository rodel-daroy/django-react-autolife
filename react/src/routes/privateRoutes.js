import React from "react";
import { Redirect, Route } from "react-router-dom";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { modalSignIn } from "../redux/actions/userContainerActions";

const PrivateRoute = ({ component: Component, modalSignIn, user, ...rest }) => {
  console.log(user, "route-user");
  return (
    <Route
      {...rest}
      render={props =>
        !isEmpty(user) ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

const mapStateToProps = state => ({
  user: state.user.authUser
});

const mapDispatchToProps = {
  modalSignIn
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PrivateRoute);
