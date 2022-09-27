import React, { Component } from "react";
import PropTypes from "prop-types";
import RadialButton from "../Forms/RadialButton";
import Modal from "react-modal";
import { connect } from "react-redux";
import { toggleScrolling } from "../../redux/actions/layoutActions";

const MAX_PERCENT_WIDTH = 90;

class VideoFrame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      videoWidth: 0,
      videoHeight: 0,
      widthPercent: MAX_PERCENT_WIDTH,
      heightPercent: null
    };
  }

  updateSize({ videoWidth, videoHeight } = this.state) {
    if (videoWidth && videoHeight) {
      const aspectRatio = videoHeight / videoWidth;
      const windowAspectRatio = window.innerHeight / window.innerWidth;

      let { widthPercent, heightPercent } = this.state;

      if (windowAspectRatio < aspectRatio) {
        heightPercent = MAX_PERCENT_WIDTH;
        widthPercent =
          (((heightPercent / 100) * window.innerHeight) /
            aspectRatio /
            window.innerWidth) *
          100;
      } else {
        widthPercent = MAX_PERCENT_WIDTH;
        heightPercent = null;
      }

      this.setState({
        widthPercent,
        heightPercent
      });
    }
  }

  handleResize = e => {
    this.updateSize();
  };

  componentDidMount() {
    this.props.toggleScrolling(false);

    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    this.props.toggleScrolling(true);

    window.removeEventListener("resize", this.handleResize);
  }

  handleLoadedMetadata = e => {
    if (this._video && this._video.videoWidth) {
      const state = {
        videoWidth: this._video.videoWidth,
        videoHeight: this._video.videoHeight
      };

      this.setState(state);

      this.updateSize(state);
    }
  };

  render() {
    const { video, videoType, onClose } = this.props;
    const { videoWidth, videoHeight, widthPercent, heightPercent } = this.state;
    console.log(onClose, "close modal function");
    const paddingTop = `${(videoHeight / videoWidth) * 100}%`;
    const width = widthPercent ? `${widthPercent}vw` : null;
    const height = heightPercent ? `${heightPercent}vh` : null;

    return (
      <Modal
        isOpen
        className={{
          base: "responsive-modal",
          afterOpen: "",
          beforeClose: "closing"
        }}
        overlayClassName={{
          base: "modal-overlay",
          afterOpen: "",
          beforeClose: "closing"
        }}
        onRequestClose={onClose}
      >
        <div className="video-frame">
          <div
            className="video-frame-inner"
            style={{ paddingTop, width, height }}
          >
            <video
              ref={ref => (this._video = ref)}
              autoPlay
              controls
              preload="auto"
              onLoadedMetadata={this.handleLoadedMetadata}
            >
              <source src={video} type={videoType} />
            </video>
          </div>

          <div className="close-video">
            <RadialButton dark size="large" onClick={onClose}>
              <span className="icon icon-x" />
            </RadialButton>
          </div>
        </div>
      </Modal>
    );
  }
}

VideoFrame.propTypes = {
  video: PropTypes.string,
  videoType: PropTypes.string,
  onClose: PropTypes.func
};

const mapDispatchToProps = {
  toggleScrolling
};

export default connect(
  null,
  mapDispatchToProps
)(VideoFrame);
