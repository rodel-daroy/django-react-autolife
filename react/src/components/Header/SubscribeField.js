import React, { Component } from "react";
import { reduxForm, Field, propTypes } from "redux-form";
import { connect } from "react-redux";
import { ReduxHeaderField } from "components/Forms/HeaderField";
import { showNotification } from "redux/actions/notificationAction";
import { getUserSubscribed } from "redux/actions/userActions";
import { email, required } from "utils/validations";
import omit from "lodash/omit";

class SubscribeField extends Component {
  handleSubscribe = values => {
    const { emailAddress } = values;
    const { showNotification, getUserSubscribed, user } = this.props;
    const authUser = user.user;
    const firstName = authUser
      ? authUser && authUser.user_details
        ? authUser && authUser.user_details.first_name
        : ""
      : "firstname";
    const lastName = authUser
      ? authUser.user_details
        ? authUser.user_details.last_name
        : ""
      : "lastname";
    const submitParams = {
      email: emailAddress,
      first_name: firstName,
      last_name: lastName
    };
    getUserSubscribed(submitParams).then(data => {
      console.log(data, "subscribe");
      if (data.payload.status === 200) {
        const message =
          data.message === "subscribed"
            ? "Email subscribed successfully"
            : data.payload.message.message;
        showNotification({ message });
      } else if (data.payload.status === 400) {
        const message = data.payload.message.message;
        showNotification({ message });
      }
    });
  };

  render() {
    const { handleSubmit } = this.props;

    return (
      <Field
        {...omit(this.props, [...Object.keys(propTypes), "_reduxForm"])}

        name="emailAddress"
        component={ReduxHeaderField}
        iconClassName="icon icon-mail"
        caption="Get newsletter"
        placeholder="Email address"
        onSubmit={handleSubmit(this.handleSubscribe)}
        validate={[required, email]}
      />
    );
  }
}

SubscribeField = reduxForm({
  form: "SubscribeField"
})(SubscribeField);

const mapStateToProps = state => ({
  user: state.user.authUser
});

const mapDispatchToProps = {
  showNotification,
  getUserSubscribed
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscribeField);
