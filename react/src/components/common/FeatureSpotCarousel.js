import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { childrenOfType } from "airbnb-prop-types";
import Flickity from "flickity";
import ResizeSensor from "css-element-queries/src/ResizeSensor";
import { PageStepper } from "../../components/Navigation/PageStepper";
import isEqual from "lodash/isEqual";
import { connect } from "react-redux";
import FeatureSpot from "./FeatureSpot";

class FeatureSpotCarousel extends Component {
  constructor(props) {
    super(props);

    this._children = [];
    this._childNodes = [];
    this._resizeSensors = [];

    this.state = {
      height: null,
      index: 0,
      initialPageLoaded: props.initialPageLoaded
    };
  }

  createCarousel() {
    const { index } = this.state;
    const { cycleInterval } = this.props;

    const options = {
      cellSelector: ".feature-spot-carousel-item",
      autoPlay: cycleInterval,
      wrapAround: true,
      prevNextButtons: false,
      pageDots: false,
      setGallerySize: false,
      resize: true,
      initialIndex: index,
      accessibility: false
    };

    this._carousel = new Flickity(this._container, options);
    this._carousel.on("select", this.handleSelect);
    this._carousel.on("dragStart", this.handleChanging);
    this._carousel.on("settle", this.handleFinishedChanging);

    for (let i = 0; i < this._childNodes.length; ++i) {
      this._resizeSensors[i] = new ResizeSensor(
        this._childNodes[i],
        this.handleResize
      );
    }

    this.handleResize();
    this.handleSelect(index, false);
  }

  destroyCarousel() {
    for (let i = 0; i < this._children.length; ++i) this._children[i].stop();

    for (const sensor of this._resizeSensors) {
      sensor.detach();
    }

    this._carousel.destroy();
  }

  componentDidMount() {
    this.createCarousel();
  }

  componentWillUnmount() {
    this.destroyCarousel();
  }

  componentWillReceiveProps(nextProps) {
    const { children } = this.props;

    if (nextProps.children !== children) {
      this.destroyCarousel();
    }
  }

  componentDidUpdate(prevProps) {
    const { children } = this.props;
    if (prevProps.children !== children) {
      this._children = this._children.slice(0, React.Children.count(children));
      this._childNodes = this._childNodes.slice(
        0,
        React.Children.count(children)
      );

      this.createCarousel();
    }
  }

  handleSelect = (index, changing = true) => {
    if (this.state.index !== this._carousel.selectedIndex) {
      if (changing) this.handleChanging();

      this.setState({
        index: this._carousel.selectedIndex
      });
    }

    for (let i = 0; i < this._children.length; ++i) {
      if (i === this._carousel.selectedIndex) this._children[i].start();
      else this._children[i].stop();
    }
  };

  handleChange = index => {
    this._carousel.select(index, true);
  };

  handleResize = () => {
    const height = Math.max(...this._childNodes.map(node => node.clientHeight));

    if (height > 0 && this.state.height !== height) {
      this.setState({
        height
      });
    }
  };

  handleChanging = () => {
    if (!this.state.changing)
      this.setState({
        changing: true
      });
  };

  handleFinishedChanging = () => {
    if (this.state.changing)
      this.setState({
        changing: false
      });
  };

  handleChildRef = i => ref => {
    this._children[i] = ref;
    this._childNodes[i] = ref ? ReactDOM.findDOMNode(ref) : null;
  };

  render() {
    const children = React.Children.toArray(this.props.children);
    const { height, index, initialPageLoaded, changing } = this.state;

    const frameClassName = !initialPageLoaded ? "animated fadeIn" : "";

    return (
      <div className="feature-spot-carousel" style={{ height }}>
        <div
          ref={ref => (this._container = ref)}
          className={`feature-spot-carousel-inner ${
            changing ? "changing" : ""
          }`}
        >
          {children.map((child, i) => (
            <div key={i} className="feature-spot-carousel-item">
              {React.cloneElement(child, {
                innerRef: this.handleChildRef(i),
                animate: i === 0
              })}
            </div>
          ))}
        </div>

        <div className={`feature-spot-carousel-frame ${frameClassName}`}>
          <PageStepper
            size="small"
            index={index}
            onChange={this.handleChange}
            count={children.length}
            wrapAround
            dark
          />
        </div>
      </div>
    );
  }
}

FeatureSpotCarousel.propTypes = {
  cycleInterval: PropTypes.number,
  children: childrenOfType(FeatureSpot)
};

FeatureSpotCarousel.defaultProps = {
  cycleInterval: 7000
};

const mapStateToProps = state => ({
  initialPageLoaded: state.layout.initialPageLoaded
});

export default connect(mapStateToProps)(FeatureSpotCarousel);
