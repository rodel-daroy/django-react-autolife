import React, { Component } from "react";
import PropTypes from "prop-types";
import { AnimationOptionsPropTypes } from "./";
import { getContext } from "recompose";
import { isStatic } from "../../utils";

class Animate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...this.getOptionsState(props.options),

      entering: this.isActive(props),
      leaving: false,

      entered: false,
      left: false
    };
  }

  isActive(props = this.props) {
    const { active, activeContainer } = props;
    return active && activeContainer;
  }

  getOptionsState(options) {
    const offset = options.offset();

    return {
      options,
      offset,
      delayIn: options.delayIn(offset),
      delayOut: options.delayOut(offset)
    };
  }

  componentDidMount() {
    if (this.isActive()) this.enter();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.options !== this.props.options)
      this.setState(this.getOptionsState(nextProps.options));

    if (this.isActive() != this.isActive(nextProps)) {
      if (this.isActive(nextProps))
        this.setState({
          entering: true,
          leaving: false,
          entered: false,
          left: false
        });
      else
        this.setState({
          entering: false,
          leaving: true,
          entered: false,
          left: false
        });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.isActive() != this.isActive(prevProps)) {
      if (this.isActive()) this.enter();
      else this.leave();
    }
  }

  componentWillUnmount() {
    if (this._timeline) this._timeline.kill();
  }

  handleComplete = () => {
    const { last, onComplete } = this.props;
    const { entering, leaving } = this.state;

    this.setState({
      entering: false,
      leaving: false,
      entered: entering,
      left: leaving
    });

    if (last && onComplete) onComplete(leaving);
  };

  setTimelineProps(timeline, leaving) {
    const { onStart } = this.props;
    const { delayIn, delayOut, offset } = this.state;

    timeline.delay(leaving ? delayOut : delayIn);
    timeline.eventCallback("onComplete", this.handleComplete);

    if (offset === 0 && onStart)
      timeline.eventCallback("onStart", () => onStart(leaving));

    if (isStatic()) timeline.seek("+=0");

    return timeline;
  }

  enter() {
    const {
      options: { enter }
    } = this.state;

    if (this._timeline) this._timeline.kill();

    this._timeline = enter(this._container);
    this.setTimelineProps(this._timeline, false);
  }

  leave() {
    const {
      options: { leave }
    } = this.state;

    if (this._timeline) this._timeline.kill();

    this._timeline = leave(this._container);
    this.setTimelineProps(this._timeline, true);
  }

  render() {
    const { className, completed, children, style } = this.props;
    const { leaving, left } = this.state;

    if (this.isActive() || leaving || (left && !completed))
      return (
        <div
          ref={ref => (this._container = ref)}
          className={`animate ${className || ""}`}
          style={style}
        >
          {children}
        </div>
      );
    else return null;
  }
}

Animate.propTypes = {
  active: PropTypes.bool,
  last: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object
};

Animate.defaultProps = {
  active: true
};

const contextTypes = {
  options: PropTypes.shape(AnimationOptionsPropTypes),
  activeContainer: PropTypes.bool,
  onStart: PropTypes.func,
  onComplete: PropTypes.func,
  started: PropTypes.bool,
  completed: PropTypes.bool
};

export default getContext(contextTypes)(Animate);
