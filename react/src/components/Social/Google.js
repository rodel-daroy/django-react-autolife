import React, { Component } from "react";
import PropTypes from "prop-types";
import GoogleLogin from "react-google-login";

class Google extends Component {
  responseGoogle = googleUser => {
    const { onSuccess, onFailure } = this.props;

    if (googleUser && !googleUser.error) {
      const id_token = googleUser.getAuthResponse().access_token;
      const profile = googleUser.getBasicProfile();
      const imageUrl = profile.getImageUrl();
      const email = profile.getEmail();

      const postData = {
        backend: "google",
        token: id_token,
        email
      };
      if (imageUrl) {
        postData.profile_image = imageUrl;
      }

      onSuccess(postData);
    } else {
      if (onFailure) onFailure(googleUser);
    }
  };

  render() {
    const { className, component: Component } = this.props;
    return (
      <GoogleLogin
        className={className}
        clientId="773053033714-iuqdvf24skbpagmkho70qvrgpupul3qk.apps.googleusercontent.com"
        buttonText="Google+"
        onSuccess={this.responseGoogle}
        onFailure={this.responseGoogle}
        render={({ onClick, disabled }) => (
          <Component onClick={onClick} disabled={disabled} />
        )}
      />
    );
  }
}

Google.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func,
  className: PropTypes.string,
  component: PropTypes.any
};

export default Google;
