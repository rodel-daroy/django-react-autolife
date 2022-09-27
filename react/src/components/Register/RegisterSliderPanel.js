import React, { Component } from "react";
import PropTypes from 'prop-types'
import RegisterSlider from "./RegisterSlider";
import QuestionImage from "../../styles/img/register/slider/question_img.jpg";
import { TimelineMax } from "gsap";
import fill from "lodash/fill";
import { resizeImageUrl } from '../../utils';

export default class RegisterSliderPanel extends Component {
  constructor(props) {
    super(props);

    this._images = [];
    this._lastStop = -1;
  }

  componentDidMount() {
    const { value } = this.props;
    this.updateImages(value || 0);
  }

  componentDidUpdate (prevProps) {
    const { value, stops } = this.props;

    if(stops !== prevProps.stops)
      this.updateImages(value || 0);
  }

  componentWillUnmount() {
    if (this._timeline) {
      this._timeline.kill();

      delete this._timeline;
    }
  }

  handleChange = (stop) => {
    const { onChange } = this.props;

    this.updateImages(stop+1);

    if (onChange) {
      let newStop;

      if (stop >= 0 && stop % 1 === 0) newStop = stop;
      else newStop = -1;

      if (newStop !== this._lastStop) {
        if (newStop !== -1) {
          onChange(newStop);
        }

        this._lastStop = newStop;
      }
    }
  }

  updateImages = (stop = 1) => {

    const { stops } = this.props;
    const newStops = [{id: 1, image: QuestionImage, text: 'Load image' }]
    Array.prototype.push.apply(newStops,stops)
    const imageOpacity = fill(new Array(newStops.length), 1);
    if (newStops <= 1) {
      fill(imageOpacity, 0, 1);
    } else {
      const nextStop = Math.ceil(stop + 0.001);
      if (nextStop < newStops.length) {
        const opacity = stop % 1;
        imageOpacity[nextStop] = opacity;

        if (nextStop < newStops.length - 1) fill(imageOpacity, 0, nextStop + 1);
      }
    }

    if (this._timeline) {
      this._timeline.kill();

      delete this._timeline;
    }

    const timeline = new TimelineMax();

    for (let i = 0; i < imageOpacity.length; ++i) {
      timeline.to(this._images[i], 0.05, { opacity: imageOpacity[i] }, 0);

      if (imageOpacity[i] === 0)
        timeline.to(this._images[i], 0.05, { visibility: "hidden" }, 0);
      else timeline.set(this._images[i], { visibility: "" }, 0);
    }

    this._timeline = timeline;
  }


  render() {
    const { stops, value } = this.props;
    console.log(stops,'stops')
      const newStops = [{id: 1, image: QuestionImage, text: 'Load image' }]
      Array.prototype.push.apply(newStops,stops)
    return (
      <div className="register-slider-panel">
        <div className="register-image-outer">
          {newStops.map((stop, i) =>
            <div
              key={i}
              ref={ref => (this._images[i] = ref)}
              className="register-image"
              style={{ backgroundImage: `url(${resizeImageUrl(stop.image, 960, 450)})` }}
            />
          )}
        </div>

        <RegisterSlider
          value={value}
          stops={stops.map(stop => stop.text)}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

RegisterSliderPanel.propTypes = {
  stops: PropTypes.arrayOf(
    PropTypes.shape({
      caption: PropTypes.string,
      image: PropTypes.string.isRequired
    })
  ).isRequired,
  value: PropTypes.number,

  onChange: PropTypes.func
};
