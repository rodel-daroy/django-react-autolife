import React, { Component } from "react";
import PropTypes from "prop-types";
import ResizeSensor from "css-element-queries/src/ResizeSensor";
import { SCREEN_MD_MAX, SCREEN_XS_MAX } from "utils/style";
import sortBy from "lodash/sortBy";
import isEqual from "lodash/isEqual";

const DEFAULT_BREAKPOINTS = [
  SCREEN_XS_MAX,
  SCREEN_MD_MAX,
  1920
];

class Responsive extends Component {
  state = {
    mounted: false
  }

  componentDidMount() {
    this._resizeSensor = new ResizeSensor(this._container, this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    this._resizeSensor.detach();
  }

  handleResize = () => {
    if(!this.state.mounted)
      this.setState({ mounted: true });

    this.updateLayout();
  }

  updateLayout(currentBreakWidth = this.state.breakWidth) {
    const width = this._container.clientWidth;
    const breakpoints = [0, ...sortBy(this.props.breakpoints)];

    let breakWidth;
    for(let i = 1; i < breakpoints.length; ++i) {
      if(width > breakpoints[i - 1] && width <= breakpoints[i]) {
        breakWidth = breakpoints[i];
        break;
      }
    }

    if(!currentBreakWidth || currentBreakWidth < (breakWidth || Number.MAX_VALUE))
      if(this.state.breakWidth !== breakWidth)
        this.setState({ breakWidth });
  }

  componentDidUpdate(prevProps) {
    const { breakpoints } = this.props;

    if(!isEqual(breakpoints, prevProps.breakpoints))
      this.updateLayout(null);
  }

  render() {
    const { children, breakpoints, as: Component, ...otherProps } = this.props;
    const { mounted, breakWidth } = this.state;

    return (
      <Component {...otherProps} ref={ref => this._container = ref}>
        {mounted && children(breakWidth)}
      </Component>
    );
  }
}

Responsive.propTypes = {
  children: PropTypes.func.isRequired,
  breakpoints: PropTypes.array,
  as: PropTypes.any
};

Responsive.defaultProps = {
  breakpoints: DEFAULT_BREAKPOINTS,
  as: 'div'
};
 
export default Responsive;