import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import get from "lodash/get";
import Breadcrumbs from "components/Navigation/Breadcrumbs";
import ArticlesBanner from "./ArticlesBanner";
import ArticleMetaTags from "components/common/ArticleMetaTags";
import ArticleGroupView from "./ArticleGroupView";
import {
  getMappingIds,
  loadArticles
} from "redux/actions/articlesBrowseActions";
import { getUserInformation } from "redux/actions/profileActions";
import { selectArticle } from "redux/selectors/articlesBrowseSelectors";
import {
  getFeaturedMappingId,
  expandCommonGroups,
  expandUserGroups,
  expandInterestGroups,
  expandScoreGroups
} from "./groups";
import reloadForUser from "components/Decorators/reloadForUser";
import "./style.scss";

class ArticlesView extends Component {
  componentDidMount() {
    const {
      accessToken,
      getMappingIds,
      getUserInformation,
      featuredArticleMappingId
    } = this.props;

    getMappingIds(accessToken);
    if (accessToken) getUserInformation(accessToken);

    if (accessToken && featuredArticleMappingId) this.loadFeaturedArticle();
  }

  componentDidUpdate(prevProps) {
    const { accessToken, featuredArticleMappingId } = this.props;

    if (
      accessToken &&
      featuredArticleMappingId &&
      featuredArticleMappingId !== prevProps.featuredArticleMappingId
    )
      this.loadFeaturedArticle();
  }

  loadFeaturedArticle() {
    const { accessToken, loadArticles, featuredArticleMappingId } = this.props;

    loadArticles({
      accessToken,
      mappingId: featuredArticleMappingId,
      startIndex: 0,
      endIndex: 1
    });
  }

  render() {
    const {
      featuredArticle,
      accessToken,
      commonGroups,
      userGroups,
      interestGroups,
      scoreGroups
    } = this.props;

    return (
      <div className="newsPage">
        <ArticleMetaTags title="Articles" />

        <div className="page-width">
          <ArticlesBanner featured={featuredArticle} />

          <div className="content-container">
            <div className="text-container">
              <Breadcrumbs>
                <Breadcrumbs.Crumb link="/articles" name="Articles" />
              </Breadcrumbs>
            </div>
            <div
              key={accessToken || "article-groups"}
              className="trends-container"
            >
              {commonGroups.map(g => (
                <ArticleGroupView
                  key={g.mappingId}
                  mappingId={g.mappingId}
                  title={g.title}
                  isFeatured={accessToken && g.isFeatured}
                  allLink={g.link}
                />
              ))}

              {accessToken && (
                <React.Fragment>
                  {userGroups.map(g => (
                    <ArticleGroupView
                      key={g.mappingId}
                      mappingId={g.mappingId}
                      title={g.title}
                      allLink={g.link}
                    />
                  ))}

                  {interestGroups.map(g => (
                    <ArticleGroupView
                      key={g.mappingId}
                      mappingId={g.mappingId}
                      title={g.title}
                      userRelated
                      canEdit
                      allLink={g.link}
                      lazyLoad
                    />
                  ))}
                  {scoreGroups.map(g => (
                    <ArticleGroupView
                      key={g.mappingId}
                      mappingId={g.mappingId}
                      title={g.title}
                      userRelated
                      canEdit
                      score={g.score}
                      allLink={g.link}
                      lazyLoad
                    />
                  ))}
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ArticlesView.propTypes = {
  accessToken: PropTypes.string,
  featuredArticleMappingId: PropTypes.any,
  featuredArticle: PropTypes.object,
  commonGroups: PropTypes.array,
  userGroups: PropTypes.array,
  interestGroups: PropTypes.array,
  scoreGroups: PropTypes.array,
  getMappingIds: PropTypes.func.isRequired,
  getUserInformation: PropTypes.func.isRequired,
  loadArticles: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const mappingIds = get(state, "articlesBrowse.mappingIds.mapping_ids") || {};
  const interests = get(
    state,
    "profile.userInfo.lifestyle.subjects_that_interests"
  );
  const scoreMappingIds =
    get(state, "articlesBrowse.mappingIds.score_user_related_mapping_ids") ||
    {};

  const featuredArticleMappingId = getFeaturedMappingId(mappingIds);

  return {
    accessToken: get(state, "user.authUser.accessToken"),

    featuredArticleMappingId: featuredArticleMappingId,
    featuredArticle: selectArticle({
      mappingId: featuredArticleMappingId
    })(state),

    commonGroups: expandCommonGroups(mappingIds),
    userGroups: expandUserGroups(mappingIds),
    interestGroups: expandInterestGroups(interests),
    scoreGroups: expandScoreGroups(scoreMappingIds)
  };
};

const mapDispatchToProps = {
  getMappingIds,
  getUserInformation,
  loadArticles
};

export default reloadForUser(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ArticlesView)
);
