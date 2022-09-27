import {
  GET_MAPPING_IDS,
  LOAD_ARTICLES,
  LOAD_USER_ARTICLES,
  LOAD_ARTICLES_REQUEST,
  LOAD_USER_ARTICLES_REQUEST
} from "redux/actiontypes/articlesBrowseActionTypes";
import {
  USER_AUTHENTICATE_FAIL,
  USER_AUTHENTICATE_SUCCESSFUL,
  USER_LOGOUT
} from "redux/actiontypes/userActionstypes";
import isEqual from "lodash/isEqual";

const initialState = {
  articles: {},
  userArticles: {}
};

const loadArticlesRequestReducer = (state = {}, action) => {
  const { payload } = action;
  const mappingId = payload.mappingId;

  return {
    ...state,

    [mappingId]: {
      ...state[mappingId],

      loading: true
    }
  };
};

const loadArticlesReducer = (state = {}, action) => {
  const { payload } = action;
  const mappingId = payload.data.mapping_id;

  const current = state[mappingId];
  const { start_index, end_index, total_count = 0 } = payload.data;

  let section = {
    ...current,
    ...payload.data,

    loading: false,
    all:
      current && current.all
        ? [...current.all]
        : new Array(total_count).fill(undefined)
  };

  for (let i = 0; i < end_index - start_index; ++i) {
    const destIndex = start_index + i;

    if (
      destIndex < total_count &&
      !isEqual(section.all[destIndex], section.articles[i])
    )
      section.all[destIndex] = section.articles[i];
  }

  return {
    ...state,
    [mappingId]: section
  };
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_MAPPING_IDS: {
      return {
        ...state,
        mappingIds: payload.data
      };
    }

    case LOAD_ARTICLES_REQUEST:
      return {
        ...state,
        articles: loadArticlesRequestReducer(state.articles, action)
      };
    case LOAD_ARTICLES:
      return {
        ...state,
        articles: loadArticlesReducer(state.articles, action)
      };

    case LOAD_USER_ARTICLES_REQUEST:
      return {
        ...state,
        userArticles: loadArticlesRequestReducer(state.userArticles, action)
      };
    case LOAD_USER_ARTICLES:
      return {
        ...state,
        userArticles: loadArticlesReducer(state.userArticles, action)
      };

    case USER_LOGOUT:
    case USER_AUTHENTICATE_SUCCESSFUL:
    case USER_AUTHENTICATE_FAIL: {
      return {
        ...state,
        articles: {},
        userArticles: {},
        mappingIds: {}
      };
    }

    default:
      return state;
  }
};
