import React, { Component } from "react";
import PropTypes from "prop-types";
import Loader from "./Loader";
import { TimelineMax, Linear } from "gsap";
import { combineFuncs } from "../../utils";

class ProgressLoader extends Component {
  componentDidMount() {
    const { averageDuration } = this.props;

    const timeline = (this._timeline = new TimelineMax());
    timeline.to(this._loader, averageDuration, { percent: 0.9 });
    timeline.to(this._loader, averageDuration, {
      percent: 0.98,
      ease: Linear.easeNone
    });
  }

  componentWillUnmount() {
    if (this._timeline) this._timeline.kill();
  }

  componentDidUpdate(prevProps) {
    const { finished } = this.props;

    if (finished && !prevProps.finished) {
      if (this._timeline) this._timeline.kill();

      const timeline = (this._timeline = new TimelineMax());
      timeline.to(this._loader, 0.75, { percent: 1 });
      timeline.eventCallback("onComplete", this.handleComplete);
    }
  }

  handleComplete = () => {
    const { onFinished } = this.props;

    if (onFinished) onFinished();
  };

  render() {
    let child = React.Children.only(this.props.children);

    child = React.cloneElement(child, {
      ref: combineFuncs(ref => (this._loader = ref), child.ref)
    });

    return child;
  }
}

ProgressLoader.propTypes = {
  averageDuration: PropTypes.number.isRequired,
  finished: PropTypes.bool,
  onFinished: PropTypes.func,
  children: PropTypes.node
};

ProgressLoader.defaultProps = {
  averageDuration: 10,
  children: <Loader />
};

export default ProgressLoader;
