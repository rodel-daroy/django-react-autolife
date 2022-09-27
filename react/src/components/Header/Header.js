import React, { Component } from "react";
import PropTypes from "prop-types";
import { HEADER_LAYOUT_TYPES } from "../../config/constants";
import { connect } from "react-redux";
import HeaderMobile from "./HeaderMobile";
import { Link } from "react-router-dom";
import * as Types from "./SubHeaders";
import Navbar from "./Navbar";
import classNames from "classnames";
import { TimelineMax, Back } from "gsap";
import kebabCase from "lodash/kebabCase";
// import { mediaQuery } from "utils/style";
import Media from "react-media";
import { isStatic } from "../../utils";
import RadialButton from "components/Forms/RadialButton";

// this needs to match the $mobile-nav-max-width Sass variable
const MOBILE_NAV_MAX_WIDTH = 1170;

const HeaderContent = props => {
  const { user, headerLayoutType, params, animationRef, mobile } = props;
  let content = null;
  if (headerLayoutType === HEADER_LAYOUT_TYPES.DEFAULT) {
    if (Object.keys(user).length !== 0 && user.constructor === Object) {
      content = (
        <Types.Profile
          animationRef={animationRef}
          params={params}
          mobile={mobile}
        />
      );
    } else {
      content = <Types.Default animationRef={animationRef} mobile={mobile} />;
    }
  } else if (headerLayoutType === HEADER_LAYOUT_TYPES.SOFTREGISTRATION) {
    content = (
      <Types.SoftRegistration animationRef={animationRef} mobile={mobile} />
    );
  } else if (headerLayoutType === HEADER_LAYOUT_TYPES.NOT_FOUND) {
    content = <Types.NotFound animationRef={animationRef} mobile={mobile} />;
  }
  return content;
};

let headerAppeared = false;

class HeaderDesktop extends Component {
  constructor(props) {
    super(props);
    this.state = { scrolled: false };

    this._animationRefs = [];
    this._animationDelays = [];
  }

  handleScroll = e => {
    const { scrolling, scrollContainer } = this.props;

    if (scrolling) {
      const scrolled = scrollContainer().scrollTop > 0;

      if (scrolled !== this.state.scrolled) this.setState({ scrolled });
    }
  };

  componentDidMount() {
    const { scrollContainer } = this.props;
    scrollContainer().addEventListener("scroll", this.handleScroll);
    if (this.isMinimal)
      document.documentElement.classList.add("minimal-header");

    this.show(headerAppeared || isStatic());
  }

  componentWillUnmount() {
    const { scrollContainer } = this.props;

    scrollContainer().removeEventListener("scroll", this.handleScroll);

    document.documentElement.classList.remove("minimal-header");

    if (this._appearTimeline) {
      this._appearTimeline.kill();
      delete this._appearTimeline;
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.scrolled && this._appearTimeline) {
      this._appearTimeline.seek("+=0");
      this._appearTimeline.kill();

      delete this._appearTimeline;
    }
  }

  componentDidUpdate() {
    if (this.isMinimal)
      document &&
        document.documentElement &&
        document.documentElement.classList.add("minimal-header");
    else
      document &&
        document.documentElement &&
        document.documentElement.classList.remove("minimal-header");
  }

  show = immediate => {
    if (this._appearTimeline) this._appearTimeline.kill();

    headerAppeared = true;

    const timeline = new TimelineMax();
    const delayedTimeline = new TimelineMax();

    if (!this.isMinimal) {
      timeline.set(this._logo, { yPercent: -100 }, 0);
      delayedTimeline.to(
        this._logo,
        1,
        { yPercent: 0, clearProps: "transform", ease: Back.easeOut },
        1
      );

      timeline.set(this._subheader, { scaleY: 0 }, 0);
      delayedTimeline.to(
        this._subheader,
        0.5,
        { scaleY: 1, clearProps: "transform" },
        0
      );
    } else {
      timeline.set(this._container, { yPercent: -100 }, 0);
      delayedTimeline.to(
        this._container,
        0.5,
        { yPercent: 0, clearProps: "transform" },
        0
      );
    }

    if (this._navbar) {
      timeline.set(this._navbar, { scaleY: 0 }, 0);
      delayedTimeline.to(
        this._navbar,
        0.5,
        { scaleY: 1, clearProps: "transform" },
        0.5
      );
    }

    let delay = 1.5;
    for (let i = 0; i < this._animationRefs.length; ++i) {
      const animateRef = this._animationRefs[i];
      const animateDelay = this._animationDelays[i];

      if (animateRef) {
        delay += 0.15 + animateDelay * 0.15;

        if (i >= 10) {
          timeline.set(animateRef, { yPercent: 200 }, 0);
          delayedTimeline.to(
            animateRef,
            0.5,
            { yPercent: 0, clearProps: "transform" },
            delay
          );
        }

        timeline.set(animateRef, { opacity: 0 }, 0);
        delayedTimeline.to(animateRef, 1, { opacity: 1 }, delay + 0.25);
      }
    }

    timeline.timeScale(2);
    timeline.add(delayedTimeline, 2);

    if (immediate) timeline.seek("+=0", false);

    this._appearTimeline = timeline;
  };

  animationRef = (ref, index, delay) => {
    this._animationRefs[index] = ref;
    this._animationDelays[index] = delay || 0;
  };

  get isMinimal() {
    const { headerLayoutType } = this.props;

    return (
      headerLayoutType === HEADER_LAYOUT_TYPES.SOFTREGISTRATION ||
      headerLayoutType === HEADER_LAYOUT_TYPES.NOT_FOUND
    );
  }

  handleCloseEnter = () => this.setState({ closeHover: true });

  handleCloseLeave = () => this.setState({ closeHover: false });

  render() {
    const { user, headerLayoutType, children, scrollContainer } = this.props;
    const { scrolled } = this.state;
    return (
      <header
        ref={ref => (this._container = ref)}
        className={classNames(
          `main-header page-width ${kebabCase(headerLayoutType)}`,
          {
            full: !this.isMinimal,
            minimal: this.isMinimal,
            scrolled: scrolled
          }
        )}
      >
        <div className="main-header-inner">
          <div ref={ref => (this._logo = ref)} className="logo">
            <Link to={`/`} className="logo-inner" aria-label="Home">
              <div className="logo-image" />
            </Link>

            <div className="bottom-zigzag" />
          </div>

          <div className="main-header-content">
            <div
              ref={ref => (this._subheader = ref)}
              className="main-subheader"
            >
              <HeaderContent {...this.props} animationRef={this.animationRef} />

              {this.isMinimal && (
                <Link
                  className="btn-link primary-link"
                  to="/"
                  onMouseEnter={this.handleCloseEnter}
                  onMouseLeave={this.handleCloseLeave}
                >
                  Back to Home
                  <RadialButton
                    dark
                    component="span"
                    hover={this.state.closeHover}
                  >
                    <span className="icon icon-x" />
                  </RadialButton>
                </Link>
              )}
            </div>

            {headerLayoutType === HEADER_LAYOUT_TYPES.DEFAULT && (
              <div ref={ref => (this._navbar = ref)} className="main-navbar">
                <Navbar
                  scrollContainer={scrollContainer}
                  animationRef={this.animationRef}
                  user={user}
                />
              </div>
            )}
          </div>
        </div>

        <div className="main-header-children">{children}</div>
      </header>
    );
  }
}

const Header = props => {
  if (props.headerFooterVisible)
    return (
      <div className="main-header-container">
        <Media query={{ minWidth: MOBILE_NAV_MAX_WIDTH + 1 }}>
          {matches =>
            matches ? (
              <HeaderDesktop {...props} />
            ) : (
              <HeaderMobile
                {...props}
                content={<HeaderContent {...props} mobile />}
              />
            )
          }
        </Media>
      </div>
    );
  else return null;
};

Header.propTypes = {
  headerLayoutType: PropTypes.string.isRequired,
  scrollContainer: PropTypes.func.isRequired
};

Header.defaultProps = {
  headerLayoutType: HEADER_LAYOUT_TYPES.DEFAULT
};

function mapStateToProps(state) {
  return {
    user: state.user.authUser,
    headerLayoutType: state.layout.headerLayout,
    headerStepper: state.layout.headerStepper,
    headerFooterVisible: state.layout.headerFooterVisible,
    scrolling: state.layout.scrolling
  };
}

export default connect(mapStateToProps)(Header);
