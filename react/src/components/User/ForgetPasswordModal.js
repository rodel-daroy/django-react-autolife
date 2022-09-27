import React from "react";
import ResponsiveModal from "../common/ResponsiveModal";
import PrimaryButton from "../Forms/PrimaryButton";
import { ReduxTextField } from "../Forms/TextField";
import { Field, reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { resetPassword } from "../../redux/actions/userActions";
import Logo from "../common/Logo";
import {
  closeModal,
  modalResetPassword
} from "../../redux/actions/userContainerActions";

const required = value => (value ? undefined : "Required");
const ValidateEmail = (value, values) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.email)) {
    return undefined;
  }
  return "Please enter a valid email address";
};
class ForgetPasswordModal extends React.Component {
  handleClose = () => {
    this.props.closeModal();
  };

  resetPassword = async values => {
    const { resetPassword, closeModal, modalResetPassword } = this.props;
    await resetPassword(values);
    await closeModal();
    modalResetPassword();
  };

  render() {
    const { handleSubmit } = this.props;
    return (
      <ResponsiveModal
        className="forgot-password-modal"
        onClose={this.handleClose}
        fullScreenMobile
      >
        <form
          className="login-form"
          onSubmit={handleSubmit(this.resetPassword)}
        >
          <ResponsiveModal.Block>
            <div className="forgot-password">
              <div className="forgot-password-inner">
                <Logo kind="Symbol-Colour" noLink />

                <h2>Enter the email address you registered with</h2>
                <Field
                  label="Email"
                  value="email"
                  component={ReduxTextField}
                  validate={[required, ValidateEmail]}
                  id="email"
                  name="email"
                  type="email"
                />
                <PrimaryButton type="submit" className="login-button">
                  Reset Password
                </PrimaryButton>
              </div>
            </div>
          </ResponsiveModal.Block>
        </form>
      </ResponsiveModal>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

const mapDispatchToProps = {
  resetPassword,
  closeModal,
  modalResetPassword
};

ForgetPasswordModal = reduxForm({
  form: "ForgetPasswordModal"
})(ForgetPasswordModal);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ForgetPasswordModal)
);
