import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import omit from "lodash/omit";
import VideoFrame from "../common/VideoFrame";

export const VideoPropTypes = {
  src: PropTypes.string,
  type: PropTypes.string
};

export const TileActionPropTypes = {
  to: PropTypes.any,
  href: PropTypes.string,
  target: PropTypes.string,
  onClick: PropTypes.func,
  video: PropTypes.shape(VideoPropTypes)
};

class TileAction extends Component {
  state = {
    playingVideo: false
  };
  togglePlayVideo = () => {
    this.setState({
      playingVideo: !this.state.playingVideo
    });
  };

  render() {
    const {
      to,
      href,
      target,
      onClick,
      children,
      className,
      video
    } = this.props;
    let { playingVideo } = this.state;
    const omitProps = {
      ...TileActionPropTypes,
      children,
      className
    };
    const otherProps = omit(this.props, Object.keys(omitProps));

    const outlineElement = <div className="tile-action-outline" />;
    if (href) {
      return (
        <a
          {...otherProps}
          className={`tile-action ${className || ""}`}
          href={href}
          target={target}
        >
          {outlineElement}
          {children}
        </a>
      );
    } else if (to) {
      return (
        <Link
          {...otherProps}
          className={`tile-action ${className || ""}`}
          to={to}
        >
          {outlineElement}
          {children}
        </Link>
      );
    } else
      return (
        <button
          {...otherProps}
          className={`btn tile-action ${className || ""}`}
          onClick={onClick || this.togglePlayVideo}
        >
          {outlineElement}
          {children}
          {(playingVideo && video !== undefined) || href ? (
            <VideoFrame video={video.src} videoType={video.type} />
          ) : null}
        </button>
      );
  }
}

TileAction.propTypes = {
  ...TileActionPropTypes,

  children: PropTypes.node,
  className: PropTypes.string
};

export default TileAction;
