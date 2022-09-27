import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import SignInModal from "components/User/SignInModal";
import SignOutModal from "components/User/SignOutModal";
import ForgetPasswordModal from "components/User/ForgetPasswordModal";
import UpdatePasswordLinkPage from "components/User/UpdatePasswordLinkPage";
import VerifyEmailModal from "components/User/VerifyEmailModal";
import Unauthorized from "components/common/Unauthorized";
import {
  closeModal,
  dispatchLocationAction
} from "redux/actions/userContainerActions";
import SimpleRegisterModal from "components/Register/SimpleRegisterModal";
import { withExperiment } from "utils/analytics";
import { urlSearchToObj } from "utils/url";

class UserContainer extends Component {
  componentDidMount() {
    this.props.dispatchLocationAction(this.props.history);
  }

  componentDidUpdate(prevProps) {
    const {
      location,
      closeModal,
      dispatchLocationAction,
      history,
      variant
    } = this.props;

    if (location.pathname !== prevProps.location.pathname) closeModal();

    if (
      variant === "0" &&
      Object.keys(urlSearchToObj(location.search)).includes("register")
    )
      history.replace("/softregistration");
    else {
      if (location.search !== prevProps.location.search)
        dispatchLocationAction(history);
    }
  }

  render() {
    switch (this.props.path) {
      case "verify":
        return <VerifyEmailModal />;
      case "signin":
        return <SignInModal />;
      case "signout":
        return <SignOutModal />;
      case "forgot-password":
        return <ForgetPasswordModal />;
      case "reset-password":
        return <UpdatePasswordLinkPage />;
      case "unauthorized":
        return <Unauthorized />;
      case "register":
        return <SimpleRegisterModal />;
      default:
        return null;
    }
  }
}

UserContainer.propTypes = {
  path: PropTypes.string,
  location: PropTypes.object,
  closeModal: PropTypes.func.isRequired,
  dispatchLocationAction: PropTypes.func.isRequired,
  variant: PropTypes.any
};

const mapStateToProps = state => ({
  path: state.userContainer.path
});

export default withExperiment("uINMjc59QUah5RnQeNEeNw", "1")(
  withRouter(
    connect(
      mapStateToProps,
      { closeModal, dispatchLocationAction }
    )(UserContainer)
  )
);
