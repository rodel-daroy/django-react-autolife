import React, { Component } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import { loadFacebook } from "utils/social";

const facebookLogin = options => {
  return new Promise((resolve, reject) => {
    window.FB.login(response => {
      if(response.authResponse)
        resolve(response);
      else
        reject(response);
    }, options);
  });
};

const facebookLoginStatus = () => {
  return new Promise((resolve, reject) => {
    window.FB.getLoginStatus(response => {
      if(response.status === "connected")
        resolve(response);
      else
        reject(response);
    });
  });
};

const facebookApi = (...args) => {
  return new Promise((resolve, reject) => {
    window.FB.api(...args, response => {
      if(response && !response.error)
        resolve(response);
      else
        reject(response);
    });
  });
};

const openFacebookLogin = async () => {
  await facebookLogin({ scope: "email" });

  const status = await facebookLoginStatus();
  const accessToken = status.authResponse.accessToken;

  const me = await facebookApi("/me?fields=picture,name,email");
  const picture = get(me, "picture.data.url");
  const email = get(me, "email") || "";
  const uid = get(me, "id");

  const postData = {
    backend: "facebook",
    token: accessToken,
    email,
    uid
  };
  if (picture) {
    postData.profile_image = picture;
  }

  return postData;
};

class Facebook extends Component {
  componentDidMount() {
    loadFacebook();
  }

  handleClick = async () => {
    const { onSuccess, onFailure } = this.props;

    try {
      const postData = await openFacebookLogin();
      onSuccess(postData);
    }
    catch(error) {
      if(onFailure)
        onFailure(error);
    }
  }

  render() {
    const Component =
      this.props.component ||
      (props => (
        <a {...props}>
          <span className="icon icon-facebook" />
        </a>
      ));

    return (
      <Component className="facebook-button" onClick={this.handleClick} />
    );
  }
}

Facebook.propTypes = {
  component: PropTypes.any,
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func
};

export default Facebook;
