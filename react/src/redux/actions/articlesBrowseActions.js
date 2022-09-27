import {
  getMappingIdsApi,
  getCommonArticlesApi,
  getUserRelatedArticlesApi
} from "services/autolife";
import {
  GET_MAPPING_IDS,
  LOAD_ARTICLES,
  LOAD_USER_ARTICLES,
  LOAD_ARTICLES_REQUEST,
  LOAD_USER_ARTICLES_REQUEST
} from "redux/actiontypes/articlesBrowseActionTypes";

export const getMappingIds = token => async dispatch => {
  const res = await getMappingIdsApi(token);
  dispatch({
    type: GET_MAPPING_IDS,
    payload: res.data
  });
  return res.data;
};

export const loadArticles = ({
  accessToken,
  mappingId,
  startIndex,
  endIndex
}) => async dispatch => {
  dispatch({
    type: LOAD_ARTICLES_REQUEST,
    payload: {
      mappingId,
      startIndex,
      endIndex
    }
  });

  let res = await getCommonArticlesApi(
    accessToken,
    mappingId,
    startIndex,
    endIndex
  );

  dispatch({
    type: LOAD_ARTICLES,
    payload: res.data,
    accessToken
  });
  return res.data;
};

export const loadUserArticles = ({
  accessToken,
  mappingId,
  startIndex,
  endIndex,
  score
}) => async dispatch => {
  dispatch({
    type: LOAD_USER_ARTICLES_REQUEST,
    payload: {
      mappingId,
      startIndex,
      endIndex
    }
  });

  let res = await getUserRelatedArticlesApi(
    accessToken,
    mappingId,
    startIndex,
    endIndex,
    score
  );

  dispatch({
    type: LOAD_USER_ARTICLES,
    payload: res.data,
    accessToken
  });
  return res.data;
};
