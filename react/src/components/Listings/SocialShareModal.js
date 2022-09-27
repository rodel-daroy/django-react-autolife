import React from "react";
import { twitterURL } from "config/constants";
import Share from "components/content/Share";

import { socialShare } from "redux/actions/socialShareAction";
import { loadFacebook } from "utils/social";

export default class SocialShareModal extends React.Component {
  componentDidMount() {
    loadFacebook();
  }

  closeModal = () => {
    const { closeModal } = this.props;

    closeModal();
  };

  facebookShare = () => {
    const { closeModal } = this.props;
    // const defaultImage = require("../../styles/img/sc1.jpg");

    socialShare(window.location.href).then(() => {
      window.FB.ui(
        {
          method: "share",
          href: window.location.href
        },
        function(response) {}
      );
    });

    closeModal();
    return false;
  };

  tweeterShare = event => {
    const { url, closeModal } = this.props;
    socialShare(window.location.href).then(() => {
      window.open(
        twitterURL + url,
        "",
        "left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0"
      );
    });
    closeModal();
    return false;
  };

  gmailPlusShare = () => {
    const { closeModal } = this.props;
    closeModal();
  };

  render() {
    return (
      <Share
        onClickFbIcon={this.facebookShare}
        onClickTwitterIcon={this.tweeterShare}
        onClickgmailIcon={this.gmailPlusShare}
      />
    );
  }
}

SocialShareModal.defaultProps = {
  closeModal: () => {}
};
