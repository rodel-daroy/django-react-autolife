import React, { Component } from "react";
import PropTypes from "prop-types";
import Animate from "../Animation/Animate";
import Swipeable from "react-swipeable";

export default class RegisterRadioGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      offset: props.offset || 0
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.offset !== this.props.offset) {
      this.setState({
        offset: this.props.offset
      });
    }
  }

  handleSwipedLeft = (e) => {
    const { children } = this.props;

    let newOffset = this.state.offset + 1;
    if (newOffset > React.Children.count(children) - 1)
      newOffset = React.Children.count(children) - 1;

    this.setState({
      offset: newOffset
    });
  }

  handleSwipedRight = (e) => {
    let newOffset = this.state.offset - 1;
    if (newOffset < 0) newOffset = 0;

    this.setState({
      offset: newOffset
    });
  }

  render() {
    const { active } = this.props;
    const children = React.Children.toArray(this.props.children);

    let className;
    if (children.length % 3 >= 0) className = "col-3";
    else {
      if (children.length % 2 === 0) className = "col-2";
    }

    const { offset } = this.state;
    const offsetPercent = offset / children.length * 100;

    const childWidth = 1 / children.length * 100;

    return (
      <Swipeable
        onSwipedLeft={this.handleSwipedLeft}
        onSwipedRight={this.handleSwipedRight}
        trackMouse
      >
        <div className="register-radio-group">
          <div
            className={`register-radio-group-inner ${className}`}
            style={{
              width: `${children.length * 100}%`,
              transform: `translateX(-${offsetPercent}%)`
            }}
          >
            {children.map((child, i) =>
              <Animate
                key={i}
                active={active}
                className="register-radio-group-item"
                style={{ width: `${childWidth}%` }}>

                {child}
              </Animate>
            )}
          </div>
        </div>
      </Swipeable>
    );
  }
}

RegisterRadioGroup.propTypes = {
  children: PropTypes.node,
  animateOptions: PropTypes.object,
  active: PropTypes.bool,
  offset: PropTypes.number
};
