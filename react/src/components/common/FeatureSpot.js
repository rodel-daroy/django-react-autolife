import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TransitionGroup from "react-transition-group/TransitionGroup";
import { TweenMax, TimelineMax } from "gsap";
import ImageCarousel from "./ImageCarousel";
import {
  PageStepper,
  PageStepperSmall
} from "components/Navigation/PageStepper";
import VideoFrame from "components/common/VideoFrame";
import { resizeImageUrl, isStatic, firstChild } from "utils";
import Media from "react-media";
import { mediaQuery, SCREEN_XS_MAX } from "utils/style";
import ObjectFit from "components/common/ObjectFit";
import ResizeSensor from "css-element-queries/src/ResizeSensor";
import { dispatchEvent } from "utils/compatibility";
import { Image, normalizeImages } from "components/content";
import { setInitialPageLoadedAction } from "redux/actions/layoutActions";

const BODY_PADDING = 150;
let DEFAULT_MIN_HEIGHT;

class FeatureSpotInner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      carouselIndex: 0,
      containerHeight: null,
      playingVideo: false,
      bodyHeight: 0
    };

    this.handleResize = this.handleResize.bind(this);
  }

  componentWillLeave(cb) {
    if (this._timeline) this._timeline.kill();

    clearInterval(this._resizeInterval);

    cb();
  }

  componentDidMount() {
    const {
      spot,
      animate,
      short,
      initialPageLoaded,
      setInitialPageLoadedAction
    } = this.props;

    setInitialPageLoadedAction();
    DEFAULT_MIN_HEIGHT = document.body.clientWidth > 1024 ? 500 : 250;

    const targetHeight = short
      ? "60vh"
      : document.body.clientWidth > 1024
      ? "80vh"
      : "50vh";

    if (animate && !isStatic() && !initialPageLoaded) {
      const timeline = new TimelineMax();

      switch (spot) {
        case "A": {
          timeline.set(this._container, { height: "100vh", opacity: 0 }, 0);
          timeline.set(this._background, { scale: 1.75 }, 0);
          timeline.set([this._body, this._frameContent], { opacity: 0 }, 0);

          timeline.to(
            this._background,
            2,
            { scale: 1, clearProps: "transform" },
            0
          );
          timeline.to(this._container, 0.5, { height: targetHeight }, 1);
          timeline.to(this._container, 0.25, { opacity: 1 }, 1);
          timeline.to(
            [this._body, this._frameContent],
            1,
            { opacity: 1, clearProps: "transform" },
            4
          );

          if (this._carouselNav) {
            timeline.set(this._carouselNav, { scale: 1.5 }, 0);
            timeline.to(
              this._carouselNav,
              1,
              { scale: 1, clearProps: "transform" },
              4
            );
          }

          break;
        }

        case "B": {
          break;
        }

        default:
          break;
      }

      // this is a hack to ensure waypoints below the a-spot are triggered when they enter the viewport on account of the a-spot shrinking
      this._resizeInterval = setInterval(() => {
        dispatchEvent("resize", window);
      }, 100);

      this._timeline = timeline;

      timeline.eventCallback("onComplete", () => {
        clearInterval(this._resizeInterval);
        delete this._resizeInterval;
      });
    } else {
      if (spot === "A") TweenMax.set(this._container, { height: targetHeight });
    }
    window.addEventListener("resize", this.handleResize);

    this._bodyResizeSensor = new ResizeSensor(
      this._body,
      this.handleResizeBody
    );
    this.handleResizeBody();

    setTimeout(() => this.start());
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);

    if (this._bodyResizeSensor) this._bodyResizeSensor.detach();
  }

  start() {
    if (this._video && this._video.paused) this._video.play();
  }

  stop() {
    if (this._video && !this._video.paused) this._video.pause();
  }

  handleResize() {
    this.updateLayout();
  }

  handleCarouselIndexChange = carouselIndex => {
    this.setState({
      carouselIndex
    });
  };

  updateSize(contentWidth, contentHeight) {
    const containerWidth = this._background.clientWidth;
    const scale = containerWidth / contentWidth;

    const containerHeight = scale * contentHeight;

    if (
      !isNaN(containerHeight) &&
      this.state.containerHeight !== containerHeight
    )
      this.setState({ containerHeight });
  }

  updateLayout = () => {
    const { spot } = this.props;

    if (spot === "B" && this._background) {
      if (this._video) {
        this.updateSize(this._video.videoWidth, this._video.videoHeight);
      } else {
        if (this._image) {
          this.updateSize(this._image.naturalWidth, this._image.naturalHeight);
        }
      }
    }
  };

  handleResizeBody = () => {
    this.setState({
      bodyHeight: this._body.clientHeight
    });
  };

  renderInner = mobile => {
    const {
      video,
      videoType,
      kind,
      children,
      scrim,
      spot,
      fullVideo,
      fullVideoType,
      muteVideo,
      frameContent
    } = this.props;
    const {
      carouselIndex,
      containerHeight,
      playingVideo,
      bodyHeight
    } = this.state;
    const images = normalizeImages(this.props.images);
    const isCarousel = kind === "image" && images.length > 1;

    const minBodyHeight = Math.max(
      bodyHeight + BODY_PADDING,
      DEFAULT_MIN_HEIGHT
    );

    let innerStyle = {
      minHeight: containerHeight || minBodyHeight || undefined
    };

    const imageSize = {
      width: mobile ? SCREEN_XS_MAX : 1920,
      height: mobile ? 600 : 900
    };

    const firstImage = images[0] || {};
    const videoImage = images && images[0] && images[0].url;
    return (
      <div>
        <div
          className={`feature-spot-inner ${spot.toLowerCase()}-spot`}
          ref={ref => (this._container = ref)}
          style={innerStyle}
        >
          <div
            ref={ref => (this._background = ref)}
            className="feature-spot-background"
          >
            {kind === "image" && !isCarousel && images && (
              <ObjectFit>
                <img
                  role="presentation"
                  className="animated fadeIn"
                  ref={ref => (this._image = ref)}
                  src={resizeImageUrl(
                    firstImage.url,
                    imageSize.width,
                    imageSize.height
                  )}
                  alt={firstImage.alt || ""}
                  onLoad={this.updateLayout}
                />
              </ObjectFit>
            )}
            {isCarousel && (
              <ImageCarousel
                images={images}
                index={carouselIndex}
                fill={spot === "A"}
                onChange={carouselIndex => this.setState({ carouselIndex })}
              />
            )}
            {kind === "video" && (
              <button onClick={() => this.setState({ playingVideo: true })}>
                <ObjectFit>
                  <video
                    role="presentation"
                    key={video || videoImage}
                    ref={ref => (this._video = ref)}
                    autoPlay
                    playsInline
                    preload="auto"
                    loop
                    muted={muteVideo}
                    onLoadedMetadata={this.updateLayout}
                  >
                    <source src={video || videoImage} type={videoType} />
                  </video>
                </ObjectFit>
              </button>
            )}
          </div>

          <div className={`feature-spot-body ${scrim || ""}`}>
            <div
              ref={ref => (this._frameContent = ref)}
              className="feature-spot-frame-content"
            >
              {frameContent}

              {spot === "A" && isCarousel && (
                <div className="hidden-xs hidden-sm">
                  <PageStepper
                    dark
                    index={carouselIndex}
                    count={images.length}
                    onChange={this.handleCarouselIndexChange}
                  />
                </div>
              )}
            </div>
            <div
              ref={ref => (this._body = ref)}
              className="feature-spot-body-inner"
            >
              <div className="text-container">
                {/* {kind === "video" && fullVideo && (
                  <PlayButton
                    style={{ display: "none" }}
                    onClick={() => this.setState({ playingVideo: true })}
                  />
                )} */}

                {children}

                <br />
              </div>
            </div>
          </div>
        </div>

        {spot === "B" && isCarousel && (
          <PageStepperSmall
            index={carouselIndex}
            count={images.length}
            onChange={this.handleCarouselIndexChange}
          />
        )}
        {spot === "A" && isCarousel && (
          <div className="hidden-md hidden-lg">
            <PageStepperSmall
              index={carouselIndex}
              count={images.length}
              onChange={this.handleCarouselIndexChange}
            />
          </div>
        )}
        {playingVideo && (
          <VideoFrame
            video={fullVideo || video}
            videoType={fullVideoType}
            onClose={() => this.setState({ playingVideo: false })}
          />
        )}
      </div>
    );
  };

  render() {
    return <Media query={mediaQuery("xs")}>{this.renderInner}</Media>;
  }
}

const FeatureSpot = ({ innerRef, ...otherProps }) => (
  <section
    className={`feature-spot ${otherProps.spot.toLowerCase()}-spot ${otherProps.className ||
      ""}`}
  >
    <TransitionGroup component={firstChild}>
      <FeatureSpotInner {...otherProps} ref={innerRef} />
    </TransitionGroup>
  </section>
);

FeatureSpot.propTypes = {
  video: PropTypes.string,
  videoType: PropTypes.string,
  images: PropTypes.oneOfType([
    PropTypes.string,
    Image,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(Image)
  ]),
  kind: PropTypes.oneOf(["video", "image"]).isRequired,
  children: PropTypes.node,
  scrim: PropTypes.oneOf(["blue", "gradient"]),
  spot: PropTypes.oneOf(["A", "B"]).isRequired,
  animate: PropTypes.bool,
  short: PropTypes.bool,
  fullVideo: PropTypes.string,
  fullVideoType: PropTypes.string,
  muteVideo: PropTypes.bool,
  className: PropTypes.string,
  frameContent: PropTypes.node,
  innerRef: PropTypes.func
};

FeatureSpot.defaultProps = {
  videoType: "video/mp4",
  kind: "video",
  spot: "A",
  animate: true,
  fullVideoType: "video/mp4",
  muteVideo: true,
  scrim: "gradient"
};

function mapStateToProps(state) {
  return {
    initialPageLoaded: state.layout.initialPageLoaded
  };
}

const mapDispatchToProps = {
  setInitialPageLoadedAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeatureSpot);
