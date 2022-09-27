import React, { Component } from "react";
import PropTypes from "prop-types";
import { getScrollParent } from "../../utils";

class CommandBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sticky: false
    };
  }

  componentDidMount() {
    const scrollParent = getScrollParent(this._container);

    scrollParent.addEventListener("scroll", this.handleScroll);
    scrollParent.addEventListener("resize", this.handleScroll);
  }

  componentWillUnmount() {
    const scrollParent = getScrollParent(this._container);

    scrollParent.removeEventListener("scroll", this.handleScroll);
    scrollParent.removeEventListener("resize", this.handleScroll);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.active && this.props.active) this.handleScroll();
  }

  handleScroll = e => {
    if (this._container) {
      const scrollParent = getScrollParent(this._container);

      const scrollTop = scrollParent.scrollTop;
      const clientHeight = scrollParent.clientHeight;
      const offsetTop = this._container.offsetTop;
      const offsetHeight = this._container.offsetHeight;

      const containerBottom = offsetTop + offsetHeight;
      const scrollBottom = scrollTop + clientHeight;

      const sticky = scrollBottom < containerBottom;
      if (this.state.sticky !== sticky) this.setState({ sticky });
    }
  };

  render() {
    const { active, children, className } = this.props;
    const { sticky } = this.state;

    return (
      <nav
        ref={ref => (this._container = ref)}
        className={`command-bar ${active ? "active" : ""} ${
          sticky ? "sticky" : ""
        }`}
      >
        <div className="command-bar-inner">
          <div className="command-bar-content">{children}</div>
        </div>
      </nav>
    );
  }
}

CommandBar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  active: PropTypes.bool
};

export default CommandBar;
