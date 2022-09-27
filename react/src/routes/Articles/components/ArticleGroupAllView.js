import React, { Component } from "react";
import PropTypes from "prop-types";
import ArticleThumbnailContainer from "components/containers/ArticleThumbnailContainer";
import { connect } from "react-redux";
import {
  loadArticles,
  loadUserArticles
} from "redux/actions/articlesBrowseActions";
import { selectArticles } from "redux/selectors/articlesBrowseSelectors";
import get from "lodash/get";
import memoizeOne from "memoize-one";
import { PageStepper } from "components/Navigation/PageStepper";
import ArticleGroupLoader from "./ArticleGroupLoader";
import { withRouter } from "react-router";
import { urlSearchToObj, mergeUrlSearch } from "utils/url";
import "./ArticleGroupAllView.scss";

const PAGE_SIZE = 12;

class ArticleGroupAllView extends Component {
  state = {
    pageIndex: 0
  };

  static getDerivedStateFromProps(props) {
    const { location } = props;

    let { p: pageIndex } = urlSearchToObj(location.search);
    pageIndex = parseInt(pageIndex) || 0;

    return { pageIndex };
  }

  componentDidMount() {
    this.loadPageArticles(this.state.pageIndex);
  }

  componentDidUpdate(prevProps, prevState) {
    const { pageIndex } = this.state;
    const {
      mappingId,
      totalCount,
      articles,
      userRelated,
      accessToken
    } = this.props;

    const newGroup =
      mappingId !== prevProps.mappingId ||
      userRelated !== prevProps.userRelated;

    if (
      newGroup ||
      pageIndex !== prevState.pageIndex ||
      accessToken !== prevProps.accessToken
    )
      this.loadPageArticles(pageIndex);

    if (
      totalCount &&
      (totalCount !== prevProps.totalCount ||
        articles !== prevProps.articles ||
        pageIndex !== prevState.pageIndex)
    ) {
      if (pageIndex * PAGE_SIZE > totalCount) this.gotoPage(0);
    }
  }

  loadPageArticles(pageIndex) {
    const {
      loadArticles,
      loadUserArticles,
      accessToken,
      mappingId,
      userRelated,
      score
    } = this.props;
    const startIndex = pageIndex * PAGE_SIZE;
    const endIndex = (pageIndex + 1) * PAGE_SIZE;

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

  handlePageChange = pageIndex => {
    this.gotoPage(pageIndex);
  };

  static getPageArticles = memoizeOne((articles, pageIndex) => {
    if (articles) {
      const startIndex = pageIndex * PAGE_SIZE;

      return articles
        .slice(startIndex, startIndex + PAGE_SIZE)
        .filter(article => !!article);
    }

    return null;
  });

  gotoPage(pageIndex) {
    const { history, location } = this.props;

    history.replace({
      ...location,
      search: mergeUrlSearch(location.search, { p: pageIndex })
    });
  }

  render() {
    const { articles, mappingId, loading } = this.props;
    const { pageIndex } = this.state;

    const pageArticles = ArticleGroupAllView.getPageArticles(
      articles,
      pageIndex
    );
    const pageCount = Math.ceil((articles || []).length / PAGE_SIZE);

    return (
      <div className="article-group-all">
        {!loading && (
          <React.Fragment>
            {pageArticles && pageArticles.length > 0 && (
              <React.Fragment>
                <ArticleThumbnailContainer
                  key={`${pageIndex}-${mappingId}`}
                  articles={pageArticles}
                />

                {pageCount > 1 && (
                  <PageStepper
                    className="article-group-all-stepper"
                    count={pageCount}
                    index={pageIndex}
                    size="large"
                    onChange={this.handlePageChange}
                    wrapAround={false}
                  />
                )}
              </React.Fragment>
            )}

            {(!pageArticles || pageArticles.length === 0) && (
              <div className="article-group-all-none">
                <h4>No articles found</h4>
              </div>
            )}
          </React.Fragment>
        )}

        {loading && <ArticleGroupLoader />}
      </div>
    );
  }
}

ArticleGroupAllView.propTypes = {
  mappingId: PropTypes.number,
  userRelated: PropTypes.bool,

  loadArticles: PropTypes.func.isRequired,
  loadUserArticles: PropTypes.func.isRequired,
  accessToken: PropTypes.string,
  articles: PropTypes.array,
  totalCount: PropTypes.number,
  loading: PropTypes.bool,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = (state, { mappingId, userRelated }) => {
  const articles = selectArticles({ mappingId, userRelated })(state);

  return {
    accessToken: get(state, "user.authUser.accessToken"),
    articles: articles.all,
    totalCount: articles.total_count,
    loading: articles.loading
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    { loadArticles, loadUserArticles }
  )(ArticleGroupAllView)
);
