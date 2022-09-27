import React from "react";
import PropTypes from "prop-types";
import Rate, { ratePropTypes } from "../../../../../../components/content/Rate";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import get from "lodash/get";
import pick from "lodash/pick";
import {
  articleLiked,
  articleDisliked,
  setCurrentRating
} from "../../../../../../redux/actions/articlesActions";
import { modalSignIn } from "../../../../../../redux/actions/userContainerActions";
import { showNotification } from "../../../../../../redux/actions/notificationAction";

const ArticleRate = props => {
  const articleId = props.articleId || props.defaultArticleId;
  const currentRating = props.currentRating[articleId];

  const handleChange = rating => {
    const {
      articleLiked,
      articleDisliked,
      showNotification,
      accessToken,
      setCurrentRating,
      modalSignIn
    } = props;

    if (!accessToken) {
      modalSignIn();
    }

    if (articleId && accessToken) {
      const like = rating === 1 || (!rating && currentRating === 1);

      if (like) {
        articleLiked(accessToken, articleId).then(data => {
          if (data.status === 200) {
            showNotification({
              message: "Article rated successfully"
            });

            if (rating === currentRating) setCurrentRating(articleId, null);
            else setCurrentRating(articleId, 1);
          }
        });
      } else {
        articleDisliked(accessToken, articleId).then(data => {
          if (data.status === 200) {
            showNotification({
              message: "Article rated successfully"
            });

            if (rating === currentRating) setCurrentRating(articleId, null);
            else setCurrentRating(articleId, -1);
          }
        });
      }
    }
  };

  return (
    <Rate
      {...pick(props, Object.keys(ratePropTypes))}
      currentRating={currentRating}
      onChange={handleChange}
    />
  );
};

ArticleRate.propTypes = {
  articleId: PropTypes.any
};

function mapStateToProps(state) {
  return {
    defaultArticleId: get(state, "editorial.previewData.data.id"),
    currentRating: get(state, "trends.currentRating"),
    accessToken: get(state, "user.authUser.accessToken")
  };
}

const mapDispatchToProps = {
  articleLiked,
  articleDisliked,
  showNotification,
  setCurrentRating,
  modalSignIn
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ArticleRate)
);
