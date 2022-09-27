import React, { Component } from "react";
import PropTypes from "prop-types";
import Slider, { Handle } from "rc-slider";
import omit from "lodash/omit";
import { TimelineMax } from "gsap";

const MAX = 120;
const PADDING = 20;

export default class RegisterSlider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0
    };

    this._hint = [];
  }

  componentWillUnmount() {
    if (this._hintTimeline) this._hintTimeline.kill();
  }

  componentWillMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentDidMount() {
    const { value } = this.props;

    if (value > -1) this.updateLayout();
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    const { currentStop } = this.state;

    if (typeof value === "number" && currentStop !== value && value % 1 === 0) {
      this.setState({
        value: this.getMark(value, nextProps.stops),
        currentStop: value
      });
    }
  }

  updateLayout = () => {
    if (this._hintTimeline) this._hintTimeline.kill();

    const timeline = new TimelineMax();

    timeline.to(this._hint, 0.5, { opacity: 0 });

    this._hintTimeline = timeline;
  }

  handleChange = (value) => {
    const { onChange } = this.props;
    const stop = this.getStop(value);

    this.setState({
      value,
      currentStop: stop
    });

    if (onChange) {
      onChange(stop);
    }

    this.updateLayout();
  }

  handleAfterChange = (value) => {
    const { stops, onChange } = this.props;

    let stop = this.getStop(value);
    stop = Math.max(Math.min(Math.round(stop), stops.length - 1), 0);

    this.setState({
      value: this.getMark(stop),
      stopValue: stop
    });

    if (onChange) onChange(stop);
  }

  getInterval(stops = this.props.stops) {
    return (MAX - PADDING * 2) / (stops.length - 1);
  }

  getMark(stop, stops = this.props.stops) {
    return PADDING + stop * this.getInterval(stops);
  }

  getStop(mark, stops = this.props.stops) {
    return (parseInt(mark) - PADDING) / this.getInterval(stops);
  }

  getMarks() {
    const { stops } = this.props;

    if (stops.length > 0) {
      if (stops.length > 1) {
        let result = {};
        for (let i = 0; i < stops.length; ++i) {
          const mark = this.getMark(i);
          result[mark] = stops[i];
        }

        return result;
      } else {
        return {
          [MAX / 2]: stops[0]
        };
      }
    } else return {};
  }

  render() {
    const { stops, hint } = this.props;
    const { value } = this.state;
    const marks = this.getMarks();

    const selected = this.getStop(value);
    const handle = props => {
      const { value, className } = props;
      const { hint } = this.props;

      const isMark = Object.keys(marks).findIndex(mark => mark == value) !== -1;

      return (
        <Handle
          className={`${className} ${isMark ? "selected" : ""}`}
          {...omit(props, ["className"])}
        >
          <div className="register-slider-check"></div>

          <div
            ref={ref => this._hint.push(ref)}
            className="handle-hint hidden-xs hidden-sm hidden-md"
          >
            {hint}
          </div>
        </Handle>
      );
    };

    return (
      <div className="register-slider">
        <div
          ref={ref => this._hint.push(ref)}
          className="register-slider-hint hidden-lg"
        >
          {hint}
        </div>

        <div className="register-slider-labels hidden-lg">
          {stops.map((stop, i) => {
            const isSelected = selected === i;

            return (
              <div
                key={i}
                className={`register-slider-label ${isSelected
                  ? "selected"
                  : ""}`}
              >
                {stop}
              </div>
            );
          })}
        </div>

        <Slider
          value={value}
          min={0}
          max={120}
          marks={marks}
          onChange={this.handleChange}
          onAfterChange={this.handleAfterChange}
          handle={handle}
        />
      </div>
    );
  }
}

RegisterSlider.propTypes = {
  stops: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  hint: PropTypes.node,
  value: PropTypes.number
};

RegisterSlider.defaultProps = {
  stops: ["It's my baby", "Gets me from A to B", "What car?"],
  hint: (
    <div>
      Slide&nbsp;Me{" "}
      <span className="icon icon-arrow-right" style={{ fontSize: 7 }} />
    </div>
  )
};
