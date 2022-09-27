import React, { Component } from "react";
import PropTypes from "prop-types";

class PlayButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pulse: true
    };
  }

  handleClick = () => {
    const { onClick } = this.props;

    if (this.state.pulse)
      this.setState({
        pulse: false
      });

    if (onClick) onClick();
  };

  render() {
    const { playState, style = {} } = this.props;
    const { pulse } = this.state;

    return (
      <button
        type="button"
        className="btn play-button"
        onClick={this.handleClick}
      >
        {pulse && <div className="play-button-pulse" />}

        <span className={`icon icon-${playState}`} />
      </button>
    );
  }
}

PlayButton.propTypes = {
  onClick: PropTypes.func,
  playState: PropTypes.oneOf(["play", "pause", "stop"]).isRequired
};

PlayButton.defaultProps = {
  playState: "play"
};

export default PlayButton;
