import React, { Component } from "react";
import PropTypes from "prop-types";
import ResponsiveModal from "../common/ResponsiveModal";
import SocialShareModal from "./SocialShareModal";

class ShareButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socialShareBtn: false
    };
  }

  toggleModalState = () => {
    this.setState({
      socialShareBtn: !this.state.socialShareBtn
    });
  };

  handleClose = () => {
    this.setState({
      socialShareBtn: false
    });
  };

  render() {
    const { url, imageUrl, text, className } = this.props;
    const { socialShareBtn } = this.state;

    return (
      <button
        type="button"
        className={`btn btn-link share-button ${className || ""}`}
        onClick={this.toggleModalState}
      >
        Share <span className="icon icon-share" />
        {socialShareBtn && (
          <ResponsiveModal onClose={this.handleClose}>
            <ResponsiveModal.Block position="header">
              <SocialShareModal url={url} imageUrl={imageUrl} text={text} />
            </ResponsiveModal.Block>
          </ResponsiveModal>
        )}
      </button>
    );
  }
}

ShareButton.propTypes = {
  url: PropTypes.string,
  className: PropTypes.string
};

export default ShareButton;
