import {
  getTrendsDataApi,
  getAllTrendsDataApi,
  getUserRelatedDataApi,
  articleLikedApi,
  articleDislikedApi
} from "../../services/autolife";
import { push } from "react-router-redux";

import * as articles from "../actiontypes/articlesActionTypes";

export const getTrendsData = token => {
  return dispatch => {
    return getTrendsDataApi(token).then(resp => {
      dispatch({
        type: articles.TRENDS_ARTICLE,
        payload: resp.data.data
      });
    });
  };
};

export const getUserRelatedData = token => {
  return dispatch => {
    return getUserRelatedDataApi(token).then(resp => {
      dispatch({
        type: articles.TRENDS_USER_ARTICLE,
        payload: resp.data.data
      });
    });
  };
};

export const articleLiked = (token, id) => dispatch => {
  if (token !== undefined) {
    return articleLikedApi(token, id).then(resp => {
      dispatch({
        type: articles.TRENDS_LIKE_ARTICLE,
        payload: resp.data
      });
      return resp.data;
    });
  } else {
    dispatch(push("/?signin"));
  }
};

export const articleDisliked = (token, id) => dispatch => {
  if (token !== undefined) {
    return articleDislikedApi(token, id).then(resp => {
      dispatch({
        type: articles.TRENDS_DISLIKE_ARTICLE,
        payload: resp.data
      });
      return resp.data;
    });
  } else {
    dispatch(push("/?signin"));
  }
};

export const getAllTrendsData = (token, query, bool) => dispatch => {
  return getAllTrendsDataApi(token, query, bool).then(resp => {
    dispatch({
      type: articles.TRENDS_ALL_ARTICLE,
      payload: resp.data.data
    });
  });
};

export const userNotLoggedData = token => {
  return dispatch => {
    dispatch({
      type: articles.TRENDS_USER_NOT_LOGGED_ARTICLE
    });
  };
};

export const setCurrentRating = (articleId, rating) => {
  return {
    type: articles.TRENDS_SET_CURRENT_RATING,
    payload: { [articleId]: rating }
  };
};
