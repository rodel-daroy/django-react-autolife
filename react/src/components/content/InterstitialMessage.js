import React from "react";
import PropTypes from "prop-types";
import PrimaryButton from "components/Forms/PrimaryButton";
import bm_sub3 from "styles/img/bm_sub3.png";

const InterstitialMessage = props => {
  const { children, image } = props;
  const Component = props.component;

  return (
    <Component className="interstitial-message">
      {!image && (
        <div className="logo-outer">
          <div className="logo" />
        </div>
      )}
      {image && (
        <div className="image" style={{ backgroundImage: `url(${image})` }} />
      )}

      <div className="interstitial-content">{children}</div>
    </Component>
  );
};

InterstitialMessage.propTypes = {
  image: PropTypes.string,
  children: PropTypes.node,
  component: PropTypes.any
};

InterstitialMessage.defaultProps = {
  component: "section"
};

InterstitialMessage.SignUp = props => (
  <InterstitialMessage component="aside">
    <div className="interstitial-signup">
      Like this article?
      <p>Sign up for AutoLife to Receive&nbsp;More.</p>
    </div>
    <div>
      <PrimaryButton link="?register" target="_blank">
        Sign up <span className="icon icon-angle-right" />
      </PrimaryButton>
    </div>
  </InterstitialMessage>
);

InterstitialMessage.NextArticle = props => (
  <InterstitialMessage image={bm_sub3} component="nav">
    <div className="interstitial-next-article">
      <p>Duis aute irure dolor in dolore eu in voluptate velit.</p>
      <PrimaryButton link="/">
        Next article <span className="icon icon-angle-right" />
      </PrimaryButton>
    </div>
  </InterstitialMessage>
);

export default InterstitialMessage;
