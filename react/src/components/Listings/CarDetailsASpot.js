import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Swipeable from 'react-swipeable';
import { PageStepperSmall } from '../Navigation/PageStepper';
import SafeImage from '../common/SafeImage';
import ResponsiveModal from '../common/ResponsiveModal';
import ObjectFit from '../common/ObjectFit';
import { bodyStyle, defaultSedanImg } from '../../config/constants';
import axios from 'axios';
const RIGHT = '-1';
const LEFT = '+1';

class CarDetailsASpot extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      imageIdx: 0,
      imagesArray: [],
      fullScreen: false,
      error: false
    };

    this._images = [];
  }

  checkImage = path => {
    new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(console.log(path));
      img.onerror = () => resolve(console.log('error'));
      img.src = path;
    });
  };

  componentDidMount() {
    const { images } = this.props;
    const newImage = images || [];
    Promise.all(
      newImage.map(async imgSrc => {
        await this.checkImage(imgSrc);
        this.setState({
          imagesArray: newImage
        });
      })
    );
  }

  componentWillReceiveProps(nextProps) {
    this.componentDidMount();
    this.setState({
      imageIdx: nextProps.count
    });
  }

  updateLayout = () => {
    const { imageIdx = 0, imageWidth = 0, imageHeight = 0 } = this.state;
    const image = this._images[imageIdx];

    if (
      image &&
      (image.naturalWidth !== imageWidth || image.naturalHeight !== imageHeight)
    ) {
      if (image.naturalWidth && image.naturalHeight)
        this.setState({
          imageWidth: image.naturalWidth,
          imageHeight: image.naturalHeight
        });
    }
  };

  componentDidUpdate() {
    this.updateLayout();
  }

  onSwiped = direction => {
    const { imageIdx = 0, imagesArray } = this.state;

    const change = direction === RIGHT ? RIGHT : LEFT;
    const adjustedIdx = imageIdx + Number(change);
    let newIdx;
    if (adjustedIdx >= imagesArray.length) {
      newIdx = 0;
    } else if (adjustedIdx < 0) {
      newIdx = imagesArray.length - 1;
    } else {
      newIdx = adjustedIdx;
    }
    this.setState({ imageIdx: newIdx });
  };

  handleSwipeLeft = () => {
    this.onSwiped(LEFT);
  };

  handleSwipeRight = () => {
    this.onSwiped(RIGHT);
  };

  handleChangeIndex = index => {
    this.setState({
      imageIdx: index
    });
  };

  handleFullScreen = () => {
    this.setState({
      fullScreen: true
    });
  };

  handleModalClose = () => {
    this.setState({
      fullScreen: false
    });
  };

  handleError = () => {
    this.setState({
      error: true
    });
  };

  renderImages = modal => {
    const { imageIdx = 0, imagesArray, error } = this.state;
    const { carDetails } = this.props;
    let { style } = this.props;
    let imageUrl = defaultSedanImg;
    const defaultBodyStyleImage = bodyStyle[carDetails.body_style];
    if (defaultBodyStyleImage) {
      imageUrl = defaultBodyStyleImage;
    }
    if (error)
      style = Object.assign({}, style, { backgroundImage: `url(${imageUrl})` });

    const img = (
      <SafeImage
        src={imagesArray[imageIdx]}
        imageRef={ref => (this._images[imageIdx] = ref)}
        onLoad={this.updateLayout}
        onError={this.handleError}
      />
    );

    return (
      <div className="car-a-spot-image" style={style}>
        {modal && img}
        {!modal && (
          <ObjectFit fit="contain" tag="img">
            {img}
          </ObjectFit>
        )}
      </div>
    );
  };

  renderCarousel(modal) {
    const { imagesArray, imageIdx = 0, error } = this.state;

    return (
      <div className="car-a-spot-carousel">
        <Swipeable
          className="car-a-spot-inner"
          trackMouse
          preventDefaultTouchmoveEvent
          onSwipedLeft={this.handleSwipeLeft}
          onSwipedRight={this.handleSwipeRight}
          onTap={this.handleFullScreen}
        >
          {this.renderImages(modal)}
        </Swipeable>

        <nav className="car-a-spot-nav">
          {imagesArray.length > 1 && !error && (
            <PageStepperSmall
              count={imagesArray ? imagesArray.length : 0}
              index={imageIdx}
              onChange={this.handleChangeIndex}
            />
          )}
        </nav>
      </div>
    );
  }

  renderModal() {
    const { fullScreen, imageWidth = 0, imagesArray, error } = this.state;

    const style = {
      maxWidth: imageWidth > 0 ? imageWidth : null
    };

    if (fullScreen) {
      return (
        imagesArray.length > 0 &&
        !error && (
          <ResponsiveModal
            onClose={this.handleModalClose}
            closePosition="bottom-right"
            closeSize="small"
            fullWidth
          >
            <div className="car-a-spot-modal" style={style}>
              <ResponsiveModal.Block>
                {this.renderCarousel(true)}
              </ResponsiveModal.Block>
            </div>
          </ResponsiveModal>
        )
      );
    } else return null;
  }

  render() {
    return (
      <div className="car-a-spot">
        {this.renderCarousel(false)}

        {this.renderModal()}
      </div>
    );
  }
}

CarDetailsASpot.propTypes = {
  images: PropTypes.array
};

export default CarDetailsASpot;
