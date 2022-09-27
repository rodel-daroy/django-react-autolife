import React from "react";
import { Redirect, Route } from "react-router-dom";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { modalSignIn } from "../redux/actions/userContainerActions";

const AdminRoute = ({ component: Component, modalSignIn, user, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        !isEmpty(user) && user.user.user_details.is_superuser ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
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
)(AdminRoute);
