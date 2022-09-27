import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { TimelineMax } from "gsap";
import ResizeSensor from "css-element-queries/src/ResizeSensor";
import { Link } from "react-router-dom";
import debounce from "lodash/debounce";
import omit from "lodash/omit";
import { isAbsoluteUrl } from "../../utils";

const OFFSET_STROKE = 1.5;
const BORDER_RADIUS = 5;

class PrimaryButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 10,
      height: 10
    };

    this.updateSize = this.updateSize.bind(this);
    this.debounceUpdateSize = debounce(this.updateSize, 200);
  }

  updateSize = () => {
    if (this._button) {
      const width = this._button.clientWidth;
      const height = this._button.clientHeight;

      if (width !== this.state.width || height !== this.state.height) {
        this.setState({
          width,
          height
        });
      }
    }
  };

  componentDidMount() {
    const { dark } = this.props;

    this.updateSize();
    this.updateLayout();

    if (dark) this.createResizeSensor();

    // this prevents a weird Safari render bug which causes the wrong border color to be displayed
    if (this._background) {
      this._background.style.borderColor = "transparent";

      setTimeout(() => {
        if (this._background) this._background.style.borderColor = "";
      });
    }
  }

  componentWillUnmount() {
    this.removeResizeSensor();

    if (this._timeline) this._timeline.kill();
  }

  createResizeSensor = () => {
    this._resizeSensor = new ResizeSensor(this._button, this.updateSize);

    window.addEventListener("resize", this.debounceUpdateSize);
  };

  removeResizeSensor = () => {
    if (this._resizeSensor) this._resizeSensor.detach();

    window.removeEventListener("resize", this.debounceUpdateSize);
  };

  componentDidUpdate(prevProps, prevState) {
    const { dark } = this.props;

    if (!!dark !== !!prevProps.dark) {
      if (dark) this.createResizeSensor();
      else this.removeResizeSensor();
    }

    if (
      this.state.width !== prevState.width ||
      this.state.height !== prevState.height ||
      !!dark !== !!prevProps.dark
    ) {
      this.updateLayout();
    }
  }

  updateLayout = () => {
    this.initializeRect(this._rect);
    this.initializeRect(this._rectHover);
  };

  initializeRect = rect => {
    if (rect) {
      const width = this._button.clientWidth - OFFSET_STROKE * 2;
      const height = this._button.clientHeight - OFFSET_STROKE * 2;

      rect.cornerLength = Math.PI * BORDER_RADIUS * 2;
      rect.horizontalLength = width - BORDER_RADIUS * 2;
      rect.verticalLength = height - BORDER_RADIUS * 2;
      rect.totalLength =
        rect.cornerLength + rect.horizontalLength * 2 + rect.verticalLength * 2;

      rect.setAttribute("stroke-dasharray", rect.totalLength);
    }
  };

  renderBorder = () => {
    const { width, height } = this.state;
    const { dark } = this.props;

    if (dark)
      return (
        <svg className="button-border" viewBox={`0 0 ${width} ${height}`}>
          <rect
            ref={ref => (this._rect = ref)}
            x={OFFSET_STROKE}
            y={OFFSET_STROKE}
            width={Math.max(0, width - OFFSET_STROKE * 2)}
            height={Math.max(0, height - OFFSET_STROKE * 2)}
            rx={BORDER_RADIUS}
            ry={BORDER_RADIUS}
          />

          {dark && (
            <rect
              className="hover-border"
              ref={ref => (this._rectHover = ref)}
              x={OFFSET_STROKE}
              y={OFFSET_STROKE}
              width={Math.max(0, width - OFFSET_STROKE * 2)}
              height={Math.max(0, height - OFFSET_STROKE * 2)}
              rx={BORDER_RADIUS}
              ry={BORDER_RADIUS}
            />
          )}
        </svg>
      );
    else return null;
  };

  renderBackground = () => {
    if (!this.props.dark) {
      const { width, height } = this.state;

      const backSize =
        Math.sqrt(Math.pow(width, 2) / 2) + Math.sqrt(Math.pow(height, 2) / 2);

      const backHeight = backSize;
      const backWidth = backSize * 2;

      const left = -width;
      const top = height;

      return (
        <div
          ref={ref => (this._background = ref)}
          className="button-background"
        >
          <div
            className="button-background-inner"
            style={{ width: backWidth, height: backHeight, top, left }}
          />
        </div>
      );
    } else return null;
  };

  handleMouseEnter = () => {
    if (this._timeline) this._timeline.kill();

    if (this.props.dark) {
      const timeline = new TimelineMax();

      timeline.fromTo(
        this._rectHover,
        0.5,
        { strokeDashoffset: this._rectHover.totalLength },
        { strokeDashoffset: 0 }
      );

      this._timeline = timeline;
    }
  };

  handleMouseLeave = () => {
    if (this._timeline) this._timeline.kill();

    if (this.props.dark) {
      const timeline = new TimelineMax();

      timeline.to(this._rectHover, 0.5, {
        strokeDashoffset: this._rectHover.totalLength
      });

      this._timeline = timeline;
    }
  };

  renderContent = () => {
    const { caption } = this.props;

    let hasLeftIcon, hasRightIcon;

    let children;
    if (caption) children = [caption];
    else {
      children = React.Children.toArray(this.props.children);

      for (let i = 0; i < children.length; ++i) {
        if (children[i].type === PrimaryButton.Icon) {
          let left = i === 0;

          if (left) hasLeftIcon = true;
          else hasRightIcon = true;

          children[i] = (
            <div key={i} className={left ? "left-icon" : "right-icon"}>
              {children[i]}
            </div>
          );
        }
      }
    }

    return (
      <div
        className={`button-caption ${hasLeftIcon ? "has-left-icon" : ""} ${
          hasRightIcon ? "has-right-icon" : ""
        }`}
      >
        {children}
      </div>
    );
  };

  renderButton = () => {
    const {
      onClick,
      className,
      disabled,
      dark,
      component,
      size,
      link
    } = this.props;

    const buttonProps = {
      onClick,
      className,
      disabled,
      dark,
      component,
      size,
      link
    };

    let Component;
    if (component) Component = component;
    else {
      if (link) Component = "a";
      else Component = "button";
    }

    return (
      <Component
        ref={ref => (this._button = ref)}
        disabled={disabled}
        className={`btn primary-button ${dark ? "dark" : "light"} ${
          disabled ? "disabled" : ""
        } ${size} ${className || ""}`}
        onClick={onClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        type={"button"}
        href={link}
        {...omit(this.props, Object.keys(buttonProps))}
      >
        {this.renderBackground()}
        {this.renderBorder()}
        {this.renderContent()}
      </Component>
    );
  };

  renderLink = () => {
    const { onClick, link, className, disabled, dark, size } = this.props;

    const linkProps = {
      onClick,
      link,
      className,
      disabled,
      dark,
      size
    };

    return (
      <Link
        ref={ref => (this._button = ReactDOM.findDOMNode(ref))}
        to={link}
        disabled={disabled}
        className={`btn primary-button ${dark ? "dark" : "light"} ${
          disabled ? "disabled" : ""
        } ${size} ${className || ""}`}
        onClick={onClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        {...omit(this.props, Object.keys(linkProps))}
      >
        {this.renderBackground()}
        {this.renderBorder()}
        {this.renderContent()}
      </Link>
    );
  };

  render() {
    const { link, component } = this.props;

    if (component) {
      return this.renderButton();
    } else {
      if (link && !isAbsoluteUrl(link)) return this.renderLink();
      else return this.renderButton();
    }
  }
}

PrimaryButton.propTypes = {
  onClick: PropTypes.func,
  caption: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  link: PropTypes.any,
  disabled: PropTypes.bool,
  dark: PropTypes.bool,
  component: PropTypes.any,
  size: PropTypes.oneOf(["large", "medium", "small"]).isRequired
};

PrimaryButton.defaultProps = {
  onClick: () => {},
  size: "large"
};

PrimaryButton.Icon = props => <span className={`icon ${props.className}`} />;

PrimaryButton.Icon.propTypes = {
  className: PropTypes.string
};

export default PrimaryButton;
