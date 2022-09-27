import React, { Component } from "react";
import PropTypes from "prop-types";
import ArticlesAllBanner from "./ArticlesAllBanner";
import ArticleMetaTags from "components/common/ArticleMetaTags";
import Breadcrumbs from "components/Navigation/Breadcrumbs";
import { connect } from "react-redux";
import { getMappingIds } from "redux/actions/articlesBrowseActions";
import { getUserInformation } from "redux/actions/profileActions";
import get from "lodash/get";
import ArticleGroupAllView from "./ArticleGroupAllView";
import { expandAllGroups, isCurrentGroup } from "./groups";
import reloadForUser from "components/Decorators/reloadForUser";

class ArticlesAllView extends Component {
  componentDidMount() {
    const { getMappingIds, getUserInformation, accessToken } = this.props;

    getMappingIds(accessToken);
    if (accessToken) getUserInformation(accessToken);
  }

  componentDidUpdate(prevProps) {
    const { accessToken, mappingIds, interests, history } = this.props;

    let mappingsLoaded;
    if (accessToken)
      mappingsLoaded =
        !!mappingIds &&
        !!interests &&
        (mappingIds !== prevProps.mappingIds ||
          interests !== prevProps.interests);
    else mappingsLoaded = !!mappingIds && mappingIds !== prevProps.mappingIds;

    if (mappingsLoaded) {
      // if group doesn't exist
      if (this.getCurrentIndex() === -1) history.push("/articles");
    }
  }

  getCurrentIndex() {
    const { groups, location, match } = this.props;

    return groups.findIndex(g => isCurrentGroup(g, location, match));
  }

  render() {
    const { groups } = this.props;

    const currentIndex = this.getCurrentIndex();
    const currentGroup = groups[currentIndex];

    const nextIndex = currentIndex < groups.length - 1 ? currentIndex + 1 : 0;
    const previousIndex =
      currentIndex > 0 ? currentIndex - 1 : groups.length - 1;

    const nextGroup = groups[nextIndex];
    const previousGroup = groups[previousIndex];

    return (
      <div className="allNewsPage">
        <ArticleMetaTags title="Articles" />

        <div className="page-width">
          <ArticlesAllBanner
            loading={false}
            title={currentGroup ? currentGroup.title : null}
            nextLink={nextGroup ? nextGroup.link : ""}
            previousLink={previousGroup ? previousGroup.link : ""}
          />

          <div className="content-container">
            <div className="text-container">
              <Breadcrumbs>
                <Breadcrumbs.Crumb name="Articles" link="/articles" />
                {currentGroup && (
                  <Breadcrumbs.Crumb
                    className="trends-breadcrumb"
                    name={currentGroup.title}
                  />
                )}
              </Breadcrumbs>
            </div>

            <div className="text-container">
              {currentGroup && (
                <ArticleGroupAllView
                  mappingId={currentGroup.mappingId}
                  userRelated={currentGroup.userRelated}
                  score={currentGroup.score}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ArticlesAllView.propTypes = {
  getMappingIds: PropTypes.func.isRequired,
  accessToken: PropTypes.string,
  groups: PropTypes.array,
  mappingIds: PropTypes.object,
  interests: PropTypes.array,
  getUserInformation: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const accessToken = get(state, "user.authUser.accessToken");
  const mappingIds = get(state, "articlesBrowse.mappingIds.mapping_ids");
  const interests = get(
    state,
    "profile.userInfo.lifestyle.subjects_that_interests"
  );
  const scoreMappingIds =
    get(state, "articlesBrowse.mappingIds.score_user_related_mapping_ids") ||
    {};
  const groups = expandAllGroups(
    mappingIds || {},
    !!accessToken,
    interests,
    scoreMappingIds
  );

  return {
    accessToken,
    groups,
    mappingIds,
    interests,
    scoreMappingIds
  };
};

export default reloadForUser(
  connect(
    mapStateToProps,
    { getMappingIds, getUserInformation }
  )(ArticlesAllView)
);
