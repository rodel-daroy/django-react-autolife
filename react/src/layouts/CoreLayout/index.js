import React, { Component } from "react";
import PropTypes from "prop-types";
import "styles/main.scss";
import Notifications from "components/Notifications";
import UserContainer from "components/containers/UserContainer";
import InfoModal from "components/Modals/InfoModal/index";
import { connect } from "react-redux";
import ParallaxCarousel from "components/common/ParallaxCarousel";
import ArticleMetaTags from "components/common/ArticleMetaTags";
import { showNotification } from "redux/actions/notificationAction";
import { mediaQueryString } from "utils/style";
import { toast } from "react-toastify";
import Spinner from "components/common/Spinner";
import Header from "components/Header/Header";
import Footer from "components/Footer/Footer";
import { logoutUser } from "../../redux/actions/userActions";
import { ScrollContainer } from "react-router-scroll-4";
import {
  timeTo12HrFormat,
  timeToMinutes,
  userLoggedInSession
} from "utils/format";
import { modalSignIn } from "../../redux/actions/userContainerActions";
import { refreshUserToken } from "redux/actions/userActions";
import ErrorContainer from "components/common/ErrorContainer";

const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error"
};

const DEFAULT_NOTIFICATION = {
  position: "top-right",
  autoClose: 8000,
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: true,
  pauseOnHover: true,
  type: NOTIFICATION_TYPES.SUCCESS
};

class CoreLayout extends Component {
  componentDidMount() {
    const authToken = this.props.user.authUser.accessToken;
    const expirationTime =
      this.props.user &&
      this.props.user.authUser &&
      this.props.user.authUser.user &&
      this.props.user.authUser.user.token_expires_in;
    const sessionTime = this.props.user.sessionTime;
    const loggedInTime = timeTo12HrFormat(sessionTime);
    const loggedTimeInMinutes = timeToMinutes(loggedInTime);
    const currentTime = timeTo12HrFormat(new Date().toLocaleTimeString());
    const currentTimeInMin = timeToMinutes(currentTime);
    const checkLogInSession = userLoggedInSession(
      currentTimeInMin,
      loggedTimeInMinutes,
      expirationTime
    );
    const params = { token: authToken };
    if (checkLogInSession) {
      this.props.logoutUser();
      localStorage.clear();
      // this.props.modalSignIn();
    } else if (authToken) {
      this.props.refreshUserToken(params);
    }
    this._addToHomescreen = setTimeout(this.showAddToHomescreen, 5000);
  }

  componentWillUnmount() {
    clearTimeout(this._addToHomescreen);
  }

  showAddToHomescreen = () => {
    const alreadyShown = !!document.cookie
      .split(";")
      .find(c => c.indexOf("shownAddToHomescreen=") !== -1);
    const mobile = window.matchMedia(mediaQueryString("xs")).matches;

    if (mobile && !alreadyShown) {
      document.cookie = "shownAddToHomescreen=true;max-age=31536000";

      this.props.showNotification({
        type: "SUCCESS",
        message: (
          <div>
            <p>Add this web app to your home screen:</p>
            <p>
              Tap Share &gt; Add to Home Screen,
              <br /> or your browser options &gt; Add to Home Screen
            </p>
          </div>
        ),
        autoClose: false
      });
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.children !== this.props.children ||
      nextProps.parallax !== this.props.parallax ||
      nextProps.notification !== this.props.notification
    );
  }

  componentWillReceiveProps(nextProps) {
    const { scrolling } = nextProps;
    if (scrolling !== this.props.scrolling) {
      if (scrolling) this.enableScrolling();
      else this.disableScrolling();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.notification &&
      this.props.notification !== prevProps.notification
    ) {
      this.showNotification(this.props.notification);
    }
  }

  showNotification = notification => {
    const { message, position, autoClose, type, onClose } = notification;
    const func = type ? toast[NOTIFICATION_TYPES[type]] : toast.success;

    func(message, {
      autoClose: autoClose != null ? autoClose : DEFAULT_NOTIFICATION.autoClose,
      position: toast.POSITION[position || DEFAULT_NOTIFICATION.position],
      onClose,
      className: `react-toast ${(type || "SUCCESS").toLowerCase()}`
    });
  };

  enableScrolling = () => {
    this._scrollContainer.classList.remove("no-scroll");
  };

  disableScrolling = () => {
    this._scrollContainer.classList.add("no-scroll");
  };

  getScrollContainer = () => {
    return this._scrollContainer || document.querySelector(".layout-inner");
  };

  shouldUpdateScroll = (prevRouterProps, routerProps) => {
    const { state: { suppressScroll } = {} } = routerProps.location;
    return !suppressScroll;
  };

  render() {
    const { children, parallax } = this.props;

    return (
      <div className="layout">
        <ArticleMetaTags title="AutoLife" noSuffix />

        <Spinner />
        <Header scrollContainer={this.getScrollContainer}>
          <Notifications />
        </Header>

        {parallax && <ParallaxCarousel {...parallax} />}

        <ScrollContainer
          scrollKey="layout-inner"
          shouldUpdateScroll={this.shouldUpdateScroll}
        >
          <div
            ref={ref => (this._scrollContainer = ref)}
            className="layout-inner"
          >
            <div
              id="mobile-modal-container"
              className="responsive-modal-mobile-container"
            />
            <div className="page_content_wrapper">{children}</div>
            <Footer />
            <UserContainer />
            <InfoModal />

            <ErrorContainer />
          </div>
        </ScrollContainer>
      </div>
    );
  }
}

CoreLayout.propTypes = {
  children: PropTypes.element.isRequired
};

const mapDispatchToProps = {
  showNotification,
  modalSignIn,
  logoutUser,
  refreshUserToken
};

const mapStateToProps = state => ({
  scrolling: state.layout.scrolling,
  parallax: state.layout.parallax,
  notification: state.notification.notification,
  user: state.user
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoreLayout);
