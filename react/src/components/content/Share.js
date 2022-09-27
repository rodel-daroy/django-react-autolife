import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  FacebookButton,
  TwitterButton,
  EmailButton
} from "../common/SocialButton";

const Share = props => {
  const url = window.location.href;
  const { onClickFbIcon, onClickTwitterIcon, onClickgmailIcon } = props;
  return (
    <div className="share">
      <div className="h6">Share</div>
      <ul className="share-list">
        <li>
          <FacebookButton onClick={onClickFbIcon} />
        </li>
        <li>
          <TwitterButton onClick={onClickTwitterIcon} />
        </li>
        <li>
          <EmailButton
            onClick={onClickgmailIcon}
            component="a"
            href={`mailto:?subject=AutoLife: It's About What Moves You.&body=${url}`}
          />
        </li>
      </ul>
    </div>
  );
};

Share.propTypes = {};

export default Share;
