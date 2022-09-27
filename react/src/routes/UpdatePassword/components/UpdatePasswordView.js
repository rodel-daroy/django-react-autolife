import React from "react";
import PrimaryButton from "components/Forms/PrimaryButton";
import { ReduxPasswordField } from "components/Forms/PasswordField";
import { Field, reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import { updatePassword } from "../../../redux/actions/userActions";
import { setHeaderFooterVisible } from "../../../redux/actions/layoutActions";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { passwordLength, MIN_PASSWORD_LENGTH } from "utils/validations";
import ResponsiveModal from "components/common/ResponsiveModal";
import Logo from "../../../components/common/Logo";
import { required } from "../../../utils/validations";
import ArticleMetaTags from "../../../components/common/ArticleMetaTags";
import { showNotification } from "../../../redux/actions/notificationAction";
import { modalSignIn } from "redux/actions/userContainerActions";

const passwordsMatch = (value, values) => {
  if (values.password === values.confirm_password) {
    return undefined;
  }
  return "Please enter same password";
};

class UpdatePasswordView extends React.Component {
  componentDidMount() {
    const { setHeaderFooterVisible } = this.props;
    setHeaderFooterVisible(false);
  }

  componentWillUnmount() {
    const { setHeaderFooterVisible } = this.props;
    setHeaderFooterVisible(true);
  }

  updatePassword = async values => {
    console.log(values, "testing-reset-password");

    const { location, showNotification } = this.props;
    console.log(
      this.props.location.search.split("=")[1].split("&")[0],
      "testing-reset-password-props"
    );
    const email = location.search.split("=")[1].split("&")[0];
    const token = location.search.split("=")[2];
    const password = values.password;
    const { updatePassword, modalSignIn } = this.props;
    const submitParams = { email, token, password };
    updatePassword(submitParams).then(data => {
      console.log(data);
      if (data.status == 200) {
        this.props.history.push("/");
        showNotification({
          message: data.message
        });
        modalSignIn();
      } else {
        console.log("testing");
        this.props.history.push("/");
        showNotification({
          message: data.message
        });
      }
    });
  };

  render() {
    const { handleSubmit } = this.props;
    return (
      <div className="update-password-container">
        <ArticleMetaTags title="Update password" />

        <ResponsiveModal
          allowClose={false}
          showClose={false}
          className="update-password-modal"
          overlayClassName="update-password-overlay"
        >
          <div className="update-password">
            <div className="update-password-inner">
              <Logo kind="Horizontal-Colour" noLink />

              <h2>Update Password</h2>
              <p>
                Enter a new password. <br />
                Password should be at least {MIN_PASSWORD_LENGTH} characters.
              </p>

              <form
                className="update-password-form"
                onSubmit={handleSubmit(this.updatePassword)}
              >
                <Field
                  label="Password"
                  value="password"
                  component={ReduxPasswordField}
                  validate={[required, passwordLength]}
                  id="password"
                  name="password"
                  autoComplete="new-password"
                />
                <Field
                  label="Confirm Password"
                  value="confirm_password"
                  component={ReduxPasswordField}
                  validate={[required, passwordsMatch]}
                  id="confirm_password"
                  name="confirm_password"
                  autoComplete="new-password"
                  hideMeter
                />
                <PrimaryButton type="submit" className="reset-button">
                  Update Password <span className="icon icon-angle-right" />
                </PrimaryButton>
              </form>
            </div>
          </div>
        </ResponsiveModal>
      </div>
    );
  }
}

const mapDispatchToProps = {
  updatePassword,
  setHeaderFooterVisible,
  showNotification,
  modalSignIn
};

UpdatePasswordView = reduxForm({
  form: "UpdatePasswordView"
})(UpdatePasswordView);

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(UpdatePasswordView)
);
