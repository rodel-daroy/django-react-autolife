import React, { Component } from "react";
import { connect } from "react-redux";
import { showNotification } from "redux/actions/notificationAction";
import { getUserSubscribeMonthly } from "redux/actions/userActions";
import ShareLinks from "./ShareLinks";
import { email } from "utils/validations";

class MonthlyDigest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validate: true
    };
  }

  handleSubscribe = e => {
    e.preventDefault();
    const emailAddress = this._input.value;
    const { getUserSubscribeMonthly, user, showNotification } = this.props;
    const authUser = user.user;
    const firstName = authUser
      ? authUser.user_details
        ? authUser.user_details.first_name
        : ""
      : "firstname";
    const lastName = authUser
      ? authUser.user_details
        ? authUser.user_details.last_name
        : ""
      : "firstname";
    const submitParams = {
      email: emailAddress,
      first_name: firstName,
      last_name: lastName
    };
    const validateEmail = email(emailAddress);
    if (!validateEmail && emailAddress) {
      this.setState({ validate: true });
      getUserSubscribeMonthly(submitParams).then(data => {
        console.log(data, "subscribe-data");
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
    } else this.setState({ validate: false });
  };

  handleEmail = e => {
    const validateEmail = email(e.target.value);
    if (!validateEmail) this.setState({ validate: true });
  };

  render() {
    const { validate } = this.state;
    return (
      <div className="footer-column contact-column">
        <h1>Get a monthly news digest</h1>
        <div className="div_combine">
          <form onSubmit={this.handleSubscribe}>
            <div className="contact-text-field">
              <input
                ref={ref => (this._input = ref)}
                placeholder="Enter your email"
                type="text"
                onChange={this.handleEmail}
              />
            </div>
            <input type="submit" value="Join us" />
          </form>
          {!validate && (
            <p style={{ color: "#ed222c" }}>
              {" "}
              Please enter valid email address{" "}
            </p>
          )}
        </div>
        <ShareLinks />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.authUser
});

const mapDispatchToProps = {
  getUserSubscribeMonthly,
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MonthlyDigest);
