import React from 'react';
import PropTypes from 'prop-types';
import instagram from '../../styles/img/social/buttons-instagram.svg';
import facebook from '../../styles/img/social/buttons-facebook.svg';
import youtube from '../../styles/img/social/buttons-youtube.svg';
import twitter from '../../styles/img/social/buttons-twitter.svg';
import email from '../../styles/img/social/buttons-email.svg';
import {
  FACEBOOK_URL,
  YOUTUBE_URL,
  INSTAGRAM_URL,
  TWITTER_URL
} from '../../config/constants';

const SocialButton = props => {
  const { name, image, link, onClick, component, ...otherProps } = props;
  if (!onClick) {
    const Component = component || 'a';
    console.log(link, 'otherProps');
    return (
      <Component
        {...otherProps}
        href={link}
        target="_blank"
        className="btn social-icon-button"
      >
        <img src={image} alt={name} title={name} />
      </Component>
    );
  } else {
    const Component = component || 'button';
    return (
      <Component
        {...otherProps}
        type="button"
        className="btn social-icon-button"
        onClick={onClick}
      >
        <img src={image} alt={name} title={name} />
      </Component>
    );
  }
};

SocialButton.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  link: PropTypes.string,
  onClick: PropTypes.func,
  component: PropTypes.any
};

SocialButton.defaultProps = {
  link: '#'
};

const FacebookButton = ({ link, onClick, ...otherProps }) => (
  <SocialButton
    {...otherProps}
    name="Facebook"
    image={facebook}
    link={FACEBOOK_URL}
    onClick={onClick}
  />
);

const YoutubeButton = ({ link, onClick, ...otherProps }) => (
  <SocialButton
    {...otherProps}
    name="Youtube"
    image={youtube}
    link={YOUTUBE_URL}
    onClick={onClick}
  />
);

const InstagramButton = ({ link, onClick, ...otherProps }) => (
  <SocialButton
    {...otherProps}
    name="Instagram"
    image={instagram}
    link={INSTAGRAM_URL}
    onClick={onClick}
  />
);

const TwitterButton = ({ link, onClick, ...otherProps }) => (
  <SocialButton
    {...otherProps}
    name="Twitter"
    image={twitter}
    link={TWITTER_URL}
    onClick={onClick}
  />
);

const EmailButton = ({ link, onClick, ...otherProps }) => (
  <SocialButton
    {...otherProps}
    name="Email"
    image={email}
    link={link}
    target={'_blank'}
    onClick={onClick}
  />
);

const SocialButtons = props => (
  <ul className="social-icon-buttons">
    <li>
      <FacebookButton />
    </li>
    <li>
      <YoutubeButton />
    </li>
    <li>
      <InstagramButton />
    </li>
    <li>
      <TwitterButton />
    </li>
    <li>
      <EmailButton />
    </li>
  </ul>
);

export default SocialButton;
export {
  FacebookButton,
  YoutubeButton,
  InstagramButton,
  TwitterButton,
  EmailButton,
  SocialButtons
};
