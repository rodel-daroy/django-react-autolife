import React, { Component } from "react";
import { connect } from "react-redux";
import FeatureSpot from "components/common/FeatureSpot";
import TileContainer from "components/containers/TileContainer";
import restaurants from "assets/demo/18_best_ontario_restaurants.jpg";
import {
  getHomePageTiles,
  getVersionNumber,
  emptyHomePageTiles
} from "redux/actions/homeActions";
import isEmpty from "lodash/isEmpty";
import ArticleMetaTags from "components/common/ArticleMetaTags";
import { showNotification } from "redux/actions/notificationAction";
import ASpotBody from "components/common/ASpotBody";
import FeatureSpotCarouselContainer from "components/containers/FeatureSpotCarouselContainer";
import { accessToken } from "redux/selectors/userSelectors";
import reloadForUser from "components/Decorators/reloadForUser";

class HomePageView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialPageLoaded: props.initialPageLoaded
    };
  }

  resetPasswordNotification = async () => {
    const url = window.location.href;
    const queryString = url ? url.split("?")[1] : "";
    const splittedQueryString = queryString ? queryString.split("=") : "";
    const message =
      splittedQueryString[0] == "message" &&
      splittedQueryString[1].replace(/%20/g, " ");
    console.log(message, "messsagess");
    if (splittedQueryString[0] == "message") {
      await this.props.showNotification({
        message
      });
      this.props.history.push("/");
    }
  };

  async componentDidMount() {
    const {
      getVersionNumber,
      history,
      location
    } = this.props;
    localStorage.setItem("autolifeCookie", true);
    const getAutolifeCookie = localStorage.getItem("autolifeCookie");
    const getVersion = localStorage.getItem("versionNumber");
    if (getAutolifeCookie) {
      getVersionNumber().then(data => {
        if (data.enabled && getVersion) {
          if (data.frontend_version !== getVersion) {
            history.push(
              `${location.pathname}?refresh=${new Date().getTime()}`
            );
          }
        }
      });
    } else {
      getVersionNumber().then(data => {
        localStorage.setItem("versionNumber", data.frontend_version);
      });
    }

    this.loadContent();

    this.resetPasswordNotification();
  }

  loadContent() {
    const { accessToken, getHomePageTiles } = this.props;

    return getHomePageTiles(accessToken);
  }

  renderFeaturedArticleAssets = () => {
    const {
      tilesData: {
        data: { featured }
      }
    } = this.props;

    if (featured.length === 0) {
      return (
        <FeatureSpot scrim="blue" images={restaurants} kind="image">
          <ASpotBody
            heading="18 best Ontario restaurants that are worth getting out of the city"
            link="/content/18-best-ontario-restaurants-that-are-worth-getting-out-of-the-city"
          />
        </FeatureSpot>
      );
    }
    return <FeatureSpotCarouselContainer data={featured} />;
  };

  renderFeaturedArticleSection = () => {
    const {
      tilesData: {
        data: { others }
      }
    } = this.props;
    // const { initialPageLoaded } = this.state;

    return (
      <div>
        {this.renderFeaturedArticleAssets()}
        <TileContainer tilesData={others} />
        {/* animate={!initialPageLoaded} */}
      </div>
    );
  };

  render() {
    const { tilesData } = this.props;
    if (!isEmpty(tilesData)) {
      return (
        <React.Fragment>
          <div className="home-page page-container page-width">
            <ArticleMetaTags title="Home" />
            {this.renderFeaturedArticleSection()}
          </div>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = state => ({
  user: state.user,
  accessToken: accessToken(state),
  cookieVersionDate: state.user.cookieDate,
  tilesData: state.home.tilesData,
  version: state.home.version
});

const mapDispatchToProps = dispatch => ({
  getHomePageTiles: token => dispatch(getHomePageTiles(token)),
  getVersionNumber: () => dispatch(getVersionNumber()),
  showNotification: data => dispatch(showNotification(data)),
  emptyHomePageTiles: () => dispatch(emptyHomePageTiles())
});

export default reloadForUser(connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePageView));
