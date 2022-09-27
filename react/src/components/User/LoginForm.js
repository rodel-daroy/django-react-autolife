import React, { Component } from "react";
import Facebook from "components/Social/Facebook";
import Google from "components/Social/Google";
import { connect } from "react-redux";
import { Field, reduxForm, formValueSelector } from "redux-form";
import PrimaryButton from "components/Forms/PrimaryButton";
import loadingGif from "loading.gif";
import { ReduxTextField } from "components/Forms/TextField";
import {
  modalForgetPassword,
  closeModal
} from "redux/actions/userContainerActions";
import { required, email as validateEmail } from "utils/validations";

import { socialLogin, resetErrorMessage } from "redux/actions/userActions";
import { withRouter } from "react-router-dom";
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
  <PrimaryButton {...props} className="facebook social-button">
    <PrimaryButton.Icon className="icon-facebook social-icon" />
    Facebook
  </PrimaryButton>
);

const SigningIn = () => (
  <React.Fragment>
    <img src={loadingGif} alt="loading" width="50" height="50" />
    <React.Fragment>Signing in...</React.Fragment>
  </React.Fragment>
);

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      token: null,
      loadLoginForm: false,
      modalIsOpen: false,
      loadingSocial: false
    };
    this.props.resetErrorMessage();
  }

  socialLoginPost = postData => {
    const { socialLogin } = this.props;
    this.setState({
      loadingSocial: true
    });
    socialLogin(postData).then(resp => {
      this.successLoad(resp);
    });
  };

  successLoad = resp => {
    const { closeModal } = this.props;
    if (resp.status === 200) {
      this.setState({
        loadingSocial: false
      });
      closeModal();
    }
  };

  render() {
    const { user, handleSubmit, loading } = this.props;
    const { errored, errorMessage } = user;
    const { loadingSocial } = this.state;

    return (
      <div className="login">
        <div className="login-inner">
          <form className="login-form" onSubmit={handleSubmit}>
            <h1>Sign in to AutoLife</h1>

            <Field
              label="Email Address"
              value="email"
              component={ReduxTextField}
              validate={[required, validateEmail]}
              id="email"
              name="email"
              type="email"
            />

            <Field
              label="Password"
              value="password"
              component={ReduxTextField}
              validate={required}
              id="password"
              name="password"
              type="password"
            >
              <button
                type="button"
                onClick={this.props.modalForgetPassword}
                className="btn btn-link pull-right primary-link"
              >
                <span className="icon icon-angle-right" /> Forgot Password
              </button>
            </Field>
            <div style={{ display: "inline-block" }}>
              {loading ? (
                <SigningIn />
              ) : (
                <PrimaryButton type="submit" className="login-button">
                  Sign In
                </PrimaryButton>
              )}
            </div>
            {errored && <p className="error_message">{errorMessage}</p>}
          </form>
          <div className="other-sign-in">
            <h2>You can sign in this way too</h2>

            {loadingSocial ? (
              <SigningIn />
            ) : (
              <div className="other-sign-in-inner">
                <Facebook
                  component={FacebookButton}
                  onSuccess={this.socialLoginPost}
                />
                <Google
                  component={GoogleButton}
                  onSuccess={this.socialLoginPost}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const selector = formValueSelector("LoginForm");

function mapStateToProps(state) {
  return {
    user: state.user,
    email: selector(state, "email")
  };
}

const mapDispatchToProps = {
  socialLogin,
  modalForgetPassword,
  resetErrorMessage,
  closeModal
};

LoginForm = reduxForm({
  form: "LoginForm"
})(LoginForm);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LoginForm)
);
