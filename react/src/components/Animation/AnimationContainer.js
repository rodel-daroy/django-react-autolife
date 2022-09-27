import React, { Component } from "react";
import { withContext } from "recompose";
import { AnimationOptionsPropTypes, AnimationOptions } from "./";
import PropTypes from "prop-types";
import { combineFuncs } from "../../utils";
const contextTypes = {
  options: PropTypes.shape(AnimationOptionsPropTypes),
  activeContainer: PropTypes.bool,
  onStart: PropTypes.func,
  onComplete: PropTypes.func,
  started: PropTypes.bool,
  completed: PropTypes.bool
};

const mapPropsToContext = ({
  options,
  active = true,
  onStart,
  onComplete,
  started,
  completed
}) => ({
  options,
  activeContainer: active,
  onStart,
  onComplete,
  started,
  completed
});

const AnimationContainerInner = ({ children, className }) => (
  <div className={`animation-container ${className || ""}`}>{children}</div>
);

const AnimationContainerInnerWithContext = withContext(
  contextTypes,
  mapPropsToContext
)(AnimationContainerInner);

class AnimationContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: props.options || new AnimationOptions(),
      started: false,
      completed: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.options !== nextProps.options) {
      this.setState({
        options: nextProps.options || new AnimationOptions()
      });
    }
  }

  handleStart = leaving => {
    const { onEntering, onLeaving } = this.props;

    this.setState({
      started: true,
      completed: false
    });

    if (leaving) {
      if (onLeaving) onLeaving();
    } else if (onEntering) onEntering();
  };

  handleComplete = leaving => {
    const { onEntered, onLeft } = this.props;

    this.setState({
      started: false,
      completed: true
    });

    if (leaving) {
      if (onLeft) onLeft();
    } else if (onEntered) onEntered();
  };

  render() {
    const { onStart, onComplete, ...otherProps } = this.props;
    const { started, completed, options } = this.state;

    return (
      <AnimationContainerInnerWithContext
        {...otherProps}
        options={options}
        onStart={combineFuncs(onStart, this.handleStart)}
        onComplete={combineFuncs(onComplete, this.handleComplete)}
        started={started}
        completed={completed}
      />
    );
  }
}

AnimationContainer.propTypes = {
  children: PropTypes.node,
  options: PropTypes.shape(AnimationOptionsPropTypes),
  active: PropTypes.bool.isRequired,
  onStart: PropTypes.func,
  onComplete: PropTypes.func,
  onEntering: PropTypes.func,
  onLeaving: PropTypes.func,
  onEntered: PropTypes.func,
  onLeft: PropTypes.func
};

AnimationContainer.defaultProps = {
  active: true
};

export default AnimationContainer;
