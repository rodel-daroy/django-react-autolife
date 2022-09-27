import React, { Component } from "react";
import PropTypes from "prop-types";
import ArticleGroup from "./ArticleGroup";
import ArticleGroupLoader from "./ArticleGroupLoader";
import { connect } from "react-redux";
import {
  loadArticles,
  loadUserArticles
} from "redux/actions/articlesBrowseActions";
import {
  selectArticles,
  articlesLoading
} from "redux/selectors/articlesBrowseSelectors";
import get from "lodash/get";
import { Waypoint } from "react-waypoint";
import memoizeOne from "memoize-one";
import { getScrollContainer } from "utils/style";

class ArticleGroupView extends Component {
  state = {
    visible: false
  };

  getArticles(startIndex, endIndex) {
    const {
      loadArticles,
      loadUserArticles,
      accessToken,
      mappingId,
      userRelated,
      isFeatured,
      score = 0
    } = this.props;

    if (isFeatured) {
      ++startIndex;
      ++endIndex;
    }

    const params = {
      accessToken,
      mappingId,
      startIndex,
      endIndex,
      score
    };

    if (userRelated) loadUserArticles(params);
    else loadArticles(params);
  }

  handleLoad = ({ startIndex, endIndex }) => {
    this.getArticles(startIndex, endIndex + 1);
  };

  handleWaypointEnter = () => {
    const { onLoad } = this.props;

    this.setState({ visible: true });

    if (onLoad) onLoad();
  };

  static getDisplayArticles = memoizeOne(
    (articles, maxArticles, isFeatured) => {
      let displayArticles = articles;

      if (articles) {
        if (isFeatured) displayArticles = articles.slice(1, maxArticles + 1);
        else displayArticles = articles.slice(0, maxArticles);
      }

      return displayArticles;
    }
  );

  render() {
    const {
      mappingId,
      userRelated,
      accessToken,
      loadArticles,
      articles,
      maxArticles,
      isFeatured,
      loading,
      lazyLoad,
      allLink,
      ...otherProps
    } = this.props;
    const { visible } = this.state;

    if (lazyLoad && !visible) {
      return (
        <Waypoint
          onEnter={this.handleWaypointEnter}
          scrollableAncestor={getScrollContainer()}
        >
          <ArticleGroupLoader />
        </Waypoint>
      );
    }

    return (
      <ArticleGroup
        {...otherProps}
        mappingId={mappingId}
        userRelated={userRelated}
        articles={ArticleGroupView.getDisplayArticles(
          articles,
          maxArticles,
          isFeatured
        )}
        onLoad={this.handleLoad}
        totalCount={articles ? articles.length : 0}
        loading={loading}
        allLink={allLink}
      />
    );
  }
}

ArticleGroupView.propTypes = {
  mappingId: PropTypes.any.isRequired,
  userRelated: PropTypes.bool,
  onLoad: PropTypes.func,
  maxArticles: PropTypes.number,
  isFeatured: PropTypes.bool,
  lazyLoad: PropTypes.bool,
  allLink: PropTypes.any,

  accessToken: PropTypes.string,
  loadArticles: PropTypes.func.isRequired,
  loadUserArticles: PropTypes.func.isRequired,
  articles: PropTypes.array,
  loading: PropTypes.bool
};

ArticleGroupView.defaultProps = {
  maxArticles: 49
};

const mapStateToProps = (state, { mappingId, userRelated }) => ({
  accessToken: get(state, "user.authUser.accessToken"),
  articles: selectArticles({ mappingId, userRelated })(state).all,
  loading: articlesLoading({ mappingId, userRelated })(state)
});

export default connect(
  mapStateToProps,
  { loadArticles, loadUserArticles }
)(ArticleGroupView);
