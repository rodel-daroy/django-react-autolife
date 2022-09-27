import React, { Component } from "react";
import PropTypes from "prop-types";
import { TweenMax, TimelineMax } from "gsap";
import debounce from "lodash/debounce";
import { Waypoint } from "react-waypoint";
import pick from "lodash/pick";
// import TileAction, { TileActionPropTypes, VideoPropTypes } from "./TileAction";
import TileAction, { TileActionPropTypes, VideoPropTypes } from "./TileAction";
import { resizeImageUrl, isStatic } from "../../utils";
import ObjectFit from "../../components/common/ObjectFit";
import { SCREEN_XS_MAX } from "../../utils/style";

const DEFAULT_BACKGROUND_WIDTH = 960;
const TILE_HEIGHT = 350;

const START_DELAY = 2;
const DELAY = 1;

let started = false;
class Tile extends Component {
  constructor(props) {
    super(props);

    this._mobile = window.matchMedia(`(max-width: ${SCREEN_XS_MAX}px)`);

    this.state = {
      hover: false,
      entered: false,
      active: false,
      animate: !isStatic() && (props.animate || !props.initialPageLoaded),
      resizedImageUrl: this.getResizedImageUrl(this._mobile, props.imageUrl)
    };

    this.debounceHandleResize = debounce(this.handleResize, 200);
  }

  componentDidMount() {
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("resize", this.debounceHandleResize);

    this._mobile.addListener(this.handleMedia);

    this.handleMedia(this._mobile);
  }

  componentWillUnmount() {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("resize", this.debounceHandleResize);

    this._mobile.removeListener(this.handleMedia);

    TweenMax.killTweensOf(this._background);
    if (this._timeline) {
      this._timeline.kill();
      delete this._timeline;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.imageUrl !== this.props.imageUrl)
      this.handleMedia(this._mobile, nextProps);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.imageUrl !== this.props.imageUrl ||
      prevProps.videoWallpaper !== this.props.videoWallpaper
    )
      this.handleResize();
  }

  getResizedImageUrl = (mediaQuery, imageUrl) => {
    if (mediaQuery.matches)
      return resizeImageUrl(imageUrl, SCREEN_XS_MAX, TILE_HEIGHT);
    else return resizeImageUrl(imageUrl, DEFAULT_BACKGROUND_WIDTH, TILE_HEIGHT);
  };

  handleMedia = (e, props = this.props) => {
    const { imageUrl } = props;

    const resizedImageUrl = this.getResizedImageUrl(e, imageUrl);
    if (resizedImageUrl !== this.state.resizedImageUrl)
      this.setState({ resizedImageUrl });
  };

  handleResize = () => {
    if (this._background) {
      TweenMax.killTweensOf(this._background);
      TweenMax.set(this._background, { clearProps: "transform" });
    }
  };

  handleMouseMove = e => {
    const { hover, active } = this.state;

    if (!this._mobile.matches && hover && active && this._background) {
      const factor = -0.05;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const posX = e.clientX;
      const posY = e.clientY;

      const offsetX = (posX / width - 0.5) * factor * 100;
      const offsetY = (posY / height - 0.5) * factor * 100;

      TweenMax.killTweensOf(this._background);
      TweenMax.to(this._background, 0.2, {
        xPercent: offsetX,
        yPercent: offsetY
      });
    }
  };

  handleMouseEnter = e => {
    this.setState({
      hover: true
    });
  };

  handleMouseLeave = e => {
    this.setState({
      hover: false
    });
  };

  reveal = () => {
    if (this._timeline) {
      this._timeline.kill();
    }

    const timeline = new TimelineMax();
    this._timeline = timeline;

    timeline.eventCallback("onComplete", () => {
      this.setState({
        active: true
      });
    });

    timeline.set(this._maskBackground, { height: "100%" }, 0);
    timeline.to(
      this._maskBackground,
      1,
      { height: "0%", display: "none" },
      DELAY
    );

    timeline.timeScale(2);

    if (!started) {
      timeline.delay(START_DELAY);
      timeline.call(() => (started = true), null, null, START_DELAY);
    }

    this.setState({
      entered: true
    });
  };

  handleWaypointEnter = () => {
    const { entered, animate } = this.state;

    if (!entered && animate && this._tile) {
      this.reveal();
    } else
      this.setState({
        active: true
      });
  };

  render() {
    const { hover, active, animate, resizedImageUrl } = this.state;
    const { videoWallpaper } = this.props;
    const children = React.Children.toArray(this.props.children);
    return (
      <Waypoint onEnter={this.handleWaypointEnter}>
        <article
          className={`tile ${active ? "active" : ""}`}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onFocus={this.handleMouseEnter}
          onBlur={this.handleMouseLeave}
        >
          <TileAction
            {...pick(
              this.props,
              Object.keys(TileActionPropTypes, VideoPropTypes)
            )}
          >
            <div ref={ref => (this._tile = ref)} className="tile-outer">
              <div
                ref={ref => (this._background = ref)}
                className="tile-background"
              >
                {!videoWallpaper && (
                  <div
                    className="tile-background-image"
                    style={{ backgroundImage: `url('${resizedImageUrl}')` }}
                  />
                )}

                {videoWallpaper && (
                  <ObjectFit>
                    <video
                      ref={ref => (this._video = ref)}
                      preload="auto"
                      poster={null}
                      loop
                      muted
                      autoPlay
                      playsInline
                    >
                      <source
                        src={videoWallpaper.src}
                        type={videoWallpaper.type}
                      />
                    </video>
                  </ObjectFit>
                )}
              </div>

              <div className="tile-inner">
                {children.map((child, i) => {
                  const ChildType = child.type;

                  return (
                    <ChildType
                      key={i}
                      ref={child.ref}
                      {...child.props}
                      hover={hover}
                    />
                  );
                })}
              </div>
            </div>
          </TileAction>

          {animate && (
            <div
              ref={ref => (this._maskBackground = ref)}
              className="tile-mask-background"
            />
          )}
        </article>
      </Waypoint>
    );
  }
}

Tile.propTypes = {
  imageUrl: PropTypes.string,
  videoWallpaper: PropTypes.shape(VideoPropTypes),
  animate: PropTypes.bool,
  rowIndex: PropTypes.number,
  ...TileActionPropTypes
};

// const mapStateToProps = state => ({
//   initialPageLoaded: state.layout.initialPageLoaded
// });

export default Tile;
