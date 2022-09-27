import React, { Component } from "react";
import PropTypes from "prop-types";
import ResponsiveModal from "components/common/ResponsiveModal";
import SimpleRegisterForm from "./SimpleRegisterForm";
import { connect } from "react-redux";
import {
  closeModal,
  modalVerifyPassword
} from "redux/actions/userContainerActions";
import { registerUser, socialLogin } from "redux/actions/userActions";
import PrimaryButton from "components/Forms/PrimaryButton";
import Google from "components/Social/Google";
import Facebook from "components/Social/Facebook";
import omit from "lodash/omit";

const GoogleButton = props => (
  <PrimaryButton
    className={`social-button ${props.className || ""}`}
    {...omit(props, ["className"])}
  >
    <PrimaryButton.Icon className="icon-google social-icon" />
    Google
  </PrimaryButton>
);

const FacebookButton = props => (
  <PrimaryButton
    {...props}
    type="button"
    className="facebook social-button first"
  >
    <PrimaryButton.Icon className="icon-facebook social-icon" />
    Facebook
  </PrimaryButton>
);

class SimpleRegisterModal extends Component {
  state = {
    submitted: false
  };

  handleClose = () => {
    this.props.closeModal();
  };

  handleSubmit = async ({ email, password }) => {
    const { registerUser, modalVerifyPassword } = this.props;

    this.setState({ submitted: true });

    const params = {
      email,
      password,
      first_name: email,
      last_name: ""
    };

    const result = await registerUser(params);
    if (result.status === 200) modalVerifyPassword();
  };

  handleSocialSuccess = async postData => {
    const { socialLogin, closeModal } = this.props;

    const response = await socialLogin(postData);
    if (response.status === 200) closeModal();
  };

  render() {
    const { registering, registerError, registerMessage } = this.props;
    const { submitted } = this.state;

    return (
      <ResponsiveModal
        fullScreenMobile
        onClose={this.handleClose}
        className="simple-register-modal"
      >
        <ResponsiveModal.Block position="left">
          <h1>Sign up</h1>
        </ResponsiveModal.Block>
        <ResponsiveModal.Block>
          <SimpleRegisterForm
            onSubmit={this.handleSubmit}
            loading={registering}
          />

          {submitted && registerError && (
            <p className="error_message">{registerMessage}</p>
          )}

          <div className="other-sign-in">
            <h2>Or sign up this way</h2>

            <Facebook
              component={FacebookButton}
              onSuccess={this.handleSocialSuccess}
            />

            <Google component={GoogleButton} onSuccess={this.handleSocialSuccess} />
          </div>
        </ResponsiveModal.Block>
      </ResponsiveModal>
    );
  }
}

SimpleRegisterModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  registerUser: PropTypes.func.isRequired,
  modalVerifyPassword: PropTypes.func.isRequired,
  socialLogin: PropTypes.func.isRequired,
  registering: PropTypes.bool,
  registerMessage: PropTypes.string,
  registerError: PropTypes.bool
};

const mapStateToProps = state => ({
  registering: state.user.registering,
  registerMessage: state.user.registerMessage,
  registerError: state.user.registerError
});

export default connect(
  mapStateToProps,
  { closeModal, registerUser, modalVerifyPassword, socialLogin }
)(SimpleRegisterModal);
