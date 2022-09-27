import * as articles from "../actiontypes/articlesActionTypes";
import { get } from "react-router-redux";

const initialState = {
  trendsData: null,
  userRelatedData: null,
  trendsAllData: null,
  likedData: null,
  disLikedData: null,
  loading: false,
  currentRating: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case articles.TRENDS_ARTICLE:
      const articleId = action.payload.featured.articles.content_id;
      const liked = action.payload.featured.articles.is_liked;
      const disliked = action.payload.featured.articles.is_disliked;

      let rating = null;
      if (liked) rating = 1;
      else if (disliked) rating = -1;
      return {
        ...state,
        trendsData: action.payload,
        loading: false,
        currentRating: Object.assign({}, state.currentRating, {
          [articleId]: rating
        })
      };
    case articles.TRENDS_USER_ARTICLE:
      return {
        ...state,
        userRelatedData: action.payload,
        loading: false
      };
    case articles.TRENDS_USER_NOT_LOGGED_ARTICLE:
      return {
        ...state,
        userRelatedData: null,
        loading: false
      };
    case articles.TRENDS_LIKE_ARTICLE:
      return {
        ...state,
        likedData: action.payload,
        loading: false
      };
    case articles.TRENDS_DISLIKE_ARTICLE:
      return {
        ...state,
        disLikedData: action.payload,
        loading: false
      };
    case articles.TRENDS_ALL_ARTICLE:
      return {
        ...state,
        trendsAllData: action.payload,
        loading: false
      };
    case articles.TRENDS_SET_CURRENT_RATING:
      return {
        ...state,
        currentRating: Object.assign({}, state.currentRating, action.payload)
      };
    default:
      return state;
  }
};
