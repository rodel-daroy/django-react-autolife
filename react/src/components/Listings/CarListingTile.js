import React, { Component } from "react";
import PropTypes from "prop-types";
import CarListingRollover from "./CarListingRollover";
import SafeImage from "components/common/SafeImage";
import { mediaQueryString } from "utils/style";
import onClickOutside from "react-onclickoutside";
import CarName from "./CarName";
import CarPrice from "./CarPrice";
import ObjectFit from "components/common/ObjectFit";
import { bodyStyle, defaultSedanImg } from "config/constants";
import Responsive from "components/content/Responsive";
import { isAbsoluteUrl, resizeImageUrl, cloudFrontImage } from "utils/index";

class CarListingTile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hover: false,
      infoHover: false,
      clickToRollover: false,
      error: false
    };
  }

  componentDidMount() {
    this._mediaQuery = window.matchMedia(mediaQueryString("xs sm"));
    this._mediaQuery.addListener(this.handleMedia);

    this.handleMedia(this._mediaQuery);
  }

  componentWillUnmount() {
    this._mediaQuery.removeListener(this.handleMedia);
  }

  handleMedia = e => {
    this.setState({
      clickToRollover: e.matches
    });
  }

  handleMouseEnter = e => {
    const { clickToRollover } = this.state;

    if (!clickToRollover) this.setState({ hover: true });
  }

  handleMouseLeave = e => {
    const { clickToRollover } = this.state;

    if (!clickToRollover) this.setState({ hover: false });
  }

  handleMouseLeaveCompletely = e => {
    const { clickToRollover } = this.state;

    if (!clickToRollover) {
      this.setState({
        hover: false,
        infoHover: false
      });
    }
  };

  handleTileClick = e => {
    const { clickToRollover } = this.state;
    const { onView, noRollover } = this.props;

    if (!clickToRollover || noRollover) {
      if (onView) onView();
    }
  }

  handleInfoClick = e => {
    const { onView } = this.props;

    e.stopPropagation();
    if(onView) onView();
  }

  handleImageClick = e => {
    const { clickToRollover } = this.state;

    if (clickToRollover) this.setState({ hover: !this.state.hover });
  }

  handleImageKeyPress = e => {
    const { onView } = this.props;

    if (
      (e.target === this._container || e.target.tabIndex < 0) &&
      (e.key === " " || e.key === "Enter")
    ) {
      e.preventDefault();

      if (onView) onView();
    }
  }

  handleClickOutside = e => {
    this.setState({
      hover: false,
      infoHover: false
    });
  }

  handleError = err => {
    this.setState({
      error: err
    });
  }

  renderRollover = () => {
    const { noRollover } = this.props;
    const { hover } = this.state;
    if (!noRollover)
      return (
        <div
          className="car-listing-rollover-outer"
          onMouseLeave={this.handleMouseLeave}
          onClick={this.handleInfoClick}
        >
          <CarListingRollover active={hover} {...this.props} />
        </div>
      );
    else return null;
  }

  renderName() {
    return <CarName {...this.props} />;
  }

  render() {
    const { image, bodyStyleName, imageAspectRatio } = this.props;
    let { style } = this.props;
    const { error } = this.state;
    let imageUrl = defaultSedanImg;
    const defaultBodyStyleImage = bodyStyle[bodyStyleName];
    if (defaultBodyStyleImage) {
      imageUrl = defaultBodyStyleImage;
    }
    if (error || !image)
      style = Object.assign({}, style, { backgroundImage: `url(${imageUrl})` });

    if(imageAspectRatio)
      style = {
        ...style,

        paddingTop: `${imageAspectRatio * 100}%`
      };

    return (
      <div
        ref={ref => (this._container = ref)}
        className={`car-listing-tile ${imageAspectRatio ? 'image-aspect' : ''}`}
        onClick={this.handleTileClick}
        onMouseLeave={this.handleMouseLeaveCompletely}
        onFocus={this.handleMouseEnter}
        onBlur={this.handleMouseLeaveCompletely}
        onKeyPress={this.handleImageKeyPress}
        tabIndex={0}
      >
        <div
          className={`car-listing-image`}
          style={style}
          onMouseEnter={this.handleMouseEnter}
          onClick={this.handleImageClick}
        >
          {image && (
            <Responsive className="car-listing-image-inner">
              {width => {
                const imageUrl = isAbsoluteUrl(image) ? resizeImageUrl(image, width) : cloudFrontImage(image, width);
                const safeImage = <SafeImage src={imageUrl} onError={this.handleError} />;

                return (
                  <ObjectFit fit="contain" tag="img">
                    {safeImage}
                  </ObjectFit>
                );
              }}
            </Responsive>
          )}
        </div>

        <div
          className="btn car-listing-info"
          onMouseEnter={() => this.setState({ infoHover: true })}
          onMouseLeave={() => this.setState({ infoHover: false })}
          onClick={this.handleInfoClick}
        >
          <div className="car-listing-text">
            {this.renderName()}

            <CarPrice {...this.props} tabIndex={-1} />
          </div>
        </div>

        {this.renderRollover()}
      </div>
    );
  }
}

CarListingTile.propTypes = {
  ...CarName.propTypes,
  ...CarPrice.propTypes,

  image: PropTypes.string,
  stats: PropTypes.object,
  onView: PropTypes.func,
  onSave: PropTypes.func,
  onUnsave: PropTypes.func,
  trimId: PropTypes.number,
  noRollover: PropTypes.bool,
  imageAspectRatio: PropTypes.number
};

export default onClickOutside(CarListingTile);
