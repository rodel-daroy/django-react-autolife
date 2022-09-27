import {
  getSavedTemplateDataApi,
  getArticleDataApi
} from "../../services/autolife";

import { setCurrentRating } from "./articlesActions";
import * as template from "../actiontypes/templatePreviewActionTypes";

export const getSavedTemplateDataSuccess = response => {
  return {
    type: template.GET_CMS_TEMPLATE_PREVIEW_SUCCESSFUL,
    payload: response.data
  };
};

export const getSavedTemplateDataFail = error => {
  return {
    type: template.GET_CMS_TEMPLATE_PREVIEW_FAIL
  };
};

const getCurrentRating = previewData => {
  previewData = previewData || {};

  if (previewData.is_liked) return 1;
  else if (previewData.is_disliked) return -1;
  else return null;
};

export const getSavedTemplateData = (token, id) => {
  return dispatch => {
    dispatch({
      type: template.GET_CMS_TEMPLATE_PREVIEW_REQUEST
    });
    return getSavedTemplateDataApi(token, id)
      .then(resp => {
        dispatch(getSavedTemplateDataSuccess(resp.data));
        dispatch(
          setCurrentRating(resp.data.article_id, getCurrentRating(resp.data))
        );
      })
      .catch(error => dispatch(getSavedTemplateDataFail(error)));
  };
};
export const getArticleDataSuccess = response => {
  return {
    type: template.GET_CONTENT_INFO_SUCCESSFUL,
    payload: response.data
  };
};

export const getArticleDataFail = error => {
  return {
    type: template.GET_CONTENT_INFO_FAIL
  };
};

export const getArticleData = (token, id) => {
  return dispatch => {
    dispatch({
      type: template.GET_CONTENT_INFO_REQUEST
    });
    return getArticleDataApi(token, id)
      .then(resp => {
        dispatch(getArticleDataSuccess(resp.data));
        dispatch(
          setCurrentRating(resp.data.data.id, getCurrentRating(resp.data.data))
        );
      })
      .catch(error => dispatch(getArticleDataFail(error)));
  };
};
