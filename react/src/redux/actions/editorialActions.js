import {
  getSavedTemplateDataApi,
  getArticleDataApi
} from "../../services/autolife";

import * as editorial from "../actiontypes/editorialActionTypes";

import { setCurrentRating } from "./articlesActions";

const getCurrentRating = previewData => {
  previewData = previewData || {};

  if (previewData.is_liked) return 1;
  else if (previewData.is_disliked) return -1;
  else return null;
};

export const getSavedTemplateData = (token, id) => dispatch => {
  return getSavedTemplateDataApi(token, id).then(resp => {
    dispatch({
      type: editorial.GET_CMS_TEMPLATE_PREVIEW,
      payload: resp.data
    });
  });
};

export const getArticleData = (token, id) => dispatch => {
  dispatch({
    type: editorial.GET_CONTENT_INFO_REQUEST
  });

  return getArticleDataApi(token, id).then(resp => {
    dispatch({
      type: editorial.GET_CONTENT_INFO,
      payload: resp.data
    });
    dispatch(
      setCurrentRating(resp.data.data.id, getCurrentRating(resp.data.data))
    );
  });
};
