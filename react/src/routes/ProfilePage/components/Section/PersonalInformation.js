import React, { Component } from "react";
import { Field, formValueSelector } from "redux-form";
import { connect } from "react-redux";
import { ReduxTextField } from "../../../../components/Forms/TextField";
import { ReduxPasswordField } from "../../../../components/Forms/PasswordField";
import renderDropzoneInput from "./ProfileImageDropzone";
import { required, isNumber } from "../../../../utils/validations";
import { getOldPassword } from "../../../../redux/actions/profileActions";
import get from "lodash/get";

class PersonalInformation extends Component {
  checkPassword = e => {
    const { getOldPassword } = this.props;
    const params = { password: e.target.value };
    const token = get(this.props, "user.authUser.accessToken");
    getOldPassword(params, token);
  };

  render() {
    const { password } = this.props;
    const socialLoggedIn = get(
      this.props,
      "user.authUser.user.user_details.social_login"
    );
    return (
      <section className="page-section">
        <header className="page-section-header">
          <h3>Personal Information</h3>
        </header>
        <div className="page-section-content">
          <Field
            component={ReduxTextField}
            id="first_name"
            name="personal_information.first_name"
            type="text"
            label="First name"
            validate={required}
          />
          <Field
            component={ReduxTextField}
            id="last_name"
            name="personal_information.last_name"
            type="text"
            label="Last name"
            validate={required}
          />
          <Field
            component={ReduxTextField}
            id="email"
            name="personal_information.email"
            type="email"
            placeholder="bobsmith@gmail.com"
            label="Email"
            readOnly
          />
          <Field
            component={ReduxTextField}
            id="contact"
            name="personal_information.contact"
            type="tel"
            label="Mobile (optional)"
            validate={[isNumber]}
          />
          {!socialLoggedIn && (
            <Field
              component={ReduxPasswordField}
              id="new_password"
              name="personal_information.password"
              label="New password"
              autoComplete="new-password"
            />
          )}
          {password && password.length > 0 && (
            <div>
              <Field
                component={ReduxPasswordField}
                id="confirm_password"
                name="personal_information.confirm_password"
                label="Confirm new password"
                hideMeter
                autoComplete="new-password"
              />
              <Field
                component={ReduxPasswordField}
                id="old_password"
                name="personal_information.old_password"
                label="Old password"
                hideMeter
                autoComplete="off"
                onChange={e => {
                  this.checkPassword(e);
                }}
              />
            </div>
          )}
          <Field
            name="personal_information.avatar_url"
            component={renderDropzoneInput}
          />
        </div>
      </section>
    );
  }
}
const selector = formValueSelector("ProfileView");

const mapStateToProps = state => ({
  password: selector(state, "personal_information.password"),
  user: state.user,
  oldPassword: state.profile.oldPassword
});

const mapDispatchToProps = {
  getOldPassword
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonalInformation);
