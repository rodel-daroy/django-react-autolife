import React, { Component } from "react";
import PropTypes from "prop-types";
import { TimelineMax } from "gsap";
import { Link, withRouter } from "react-router-dom";
import SubscribeField from "./SubscribeField";
import SearchField from "./SearchField";
import MenuIcon from "../common/MenuIcon";
import MainLinks from "./MainLinks";
import StepIndicator from "../../components/Navigation/StepIndicator";
import { HEADER_LAYOUT_TYPES } from "../../config/constants";
import {
  FacebookButton,
  YoutubeButton,
  InstagramButton,
  TwitterButton
} from "../common/SocialButton";
import { connect } from "react-redux";
import { toggleScrolling } from "../../redux/actions/layoutActions";
import onClickOutside from "react-onclickoutside";
import RadialButton from "components/Forms/RadialButton";

class HeaderMobile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollTop: 0,
      scrolled: false,
      scrolledUp: true,
      menuOpen: null
    };
  }

  componentDidMount() {
    this.props.scrollContainer().addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    this.props.toggleScrolling(true);

    this.props
      .scrollContainer()
      .removeEventListener("scroll", this.handleScroll);

    if (this._timeline) this._timeline.kill();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.setState({
        menuOpen: false
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.scrolledUp !== this.state.scrolledUp ||
      prevState.scrolled !== this.state.scrolled ||
      prevState.menuOpen !== this.state.menuOpen
    ) {
      this.updateScroll();
    }

    if (prevState.menuOpen !== this.state.menuOpen) {
      this.updateMenu();
    }

    if(this.props.changeCount !== prevProps.changeCount)
      this.setState({ menuOpen: false });
  }

  updateScroll() {
    if (this._timeline) {
      this._timeline.kill();
    }

    const timeline = new TimelineMax();

    const { scrolled, scrolledUp, menuOpen } = this.state;

    if (scrolledUp || menuOpen) {
      timeline.to(this._inner, 0.5, { yPercent: 0 });
    } else {
      if (scrolled) timeline.to(this._inner, 0.5, { yPercent: -100 });
    }

    this._timeline = timeline;
  }

  updateMenu() {
    const { menuOpen } = this.state;

    if (menuOpen) this.props.toggleScrolling(false);
    else this.props.toggleScrolling(true);
  }

  get scrollTop() {
    return this.props.scrollContainer().scrollTop;
  }

  handleScroll = e => {
    const scrolled = this.props.scrollContainer().scrollTop > 0;
    const scrolledUp = this.state.scrollTop > this.scrollTop;

    if (
      this.state.scrolled !== scrolled ||
      this.state.scrollTop !== this.scrollTop ||
      this.state.scrolledUp !== scrolledUp
    ) {
      this.setState({
        scrollTop: this.scrollTop,
        scrolled,
        scrolledUp
      });
    }
  };

  handleClickOutside = e => {
    this.setState({
      menuOpen: false
    });
  };

  handleFocus = e => {
    clearTimeout(this._focusTimeout);
  };

  handleBlur = e => {
    if (e.relatedTarget) {
      this._focusTimeout = setTimeout(() => {
        if (this.state.menuOpen)
          this.setState({
            menuOpen: false
          });
      });
    }
  };

  get isMinimal() {
    const { headerLayoutType } = this.props;

    return (
      headerLayoutType === HEADER_LAYOUT_TYPES.SOFTREGISTRATION ||
      headerLayoutType === HEADER_LAYOUT_TYPES.NOT_FOUND
    );
  }

  render() {
    const { children, user, title, content, headerStepper } = this.props;
    const { menuOpen, scrolledUp, scrolled } = this.state;

    const sticky = menuOpen || scrolledUp;

    let navClass = "";
    if (typeof menuOpen === "boolean") navClass = menuOpen ? "open" : "closed";

    return (
      <header
        className={`main-header-mobile ${this.isMinimal ? "minimal" : ""} ${
          sticky ? "sticky" : ""
        } ${scrolled || menuOpen ? "scrolled" : ""}`}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      >
        <div
          ref={ref => (this._inner = ref)}
          className="main-header-mobile-inner"
        >
          <div className="logo">
            <Link to={`/`} className="logo-inner">
              <div className="logo-image" />
            </Link>
          </div>

          {this.isMinimal && (
            <div className="main-header-mobile-title">
              {title}

              <RadialButton dark component={Link} to="/">
                <span className="icon icon-x" />
              </RadialButton>
            </div>
          )}

          <div className="main-header-mobile-children">
            {headerStepper && headerStepper.show && (
              <StepIndicator
                start={headerStepper.start}
                end={headerStepper.end}
                current={headerStepper.current}
                minimal
                orientation="horizontal"
                className={`${
                  headerStepper.style
                    ? "step-indicator-" + headerStepper.style
                    : ""
                }`}
              />
            )}

            {children}
          </div>
        </div>

        {!this.isMinimal && (
          <button
            type="button"
            className="btn menu-button"
            onClick={() => this.setState({ menuOpen: !this.state.menuOpen })}
          >
            <MenuIcon expanded={menuOpen} />
          </button>
        )}

        {!this.isMinimal && (
          <nav
            ref={ref => (this._nav = ref)}
            className={`main-mobile-nav ${navClass}`}
          >
            <div className="main-mobile-nav-content">
              <div className="main-mobile-nav-top">
                <div className="main-mobile-nav-inner">
                  <SearchField black fullWidth />
                </div>
              </div>

              <div className="main-mobile-nav-middle">
                <div className="main-mobile-nav-inner">
                  <MainLinks user={user} />
                </div>
              </div>

              <div className="main-mobile-nav-middle">{content}</div>

              <div className="main-mobile-nav-bottom">
                <div className="main-mobile-nav-inner">
                  <SubscribeField showCaption fullWidth />

                  <ul className="share-list">
                    <li>
                      <FacebookButton />
                    </li>
                    <li>
                      <YoutubeButton />
                    </li>
                    <li>
                      <InstagramButton />
                    </li>
                    <li>
                      <TwitterButton />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </nav>
        )}
      </header>
    );
  }
}

HeaderMobile.propTypes = {
  children: PropTypes.node,
  user: PropTypes.object,
  title: PropTypes.string,
  content: PropTypes.node,
  menuStepper: PropTypes.object,

  changeCount: PropTypes.any
};

const mapStateToProps = state => ({
  changeCount: state.userContainer.changeCount
});

const mapDispatchToProps = {
  toggleScrolling
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(onClickOutside(HeaderMobile))
);
