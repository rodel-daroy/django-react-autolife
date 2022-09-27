import {
  getArticlesApi,
  deleteTemplatesApi
} from "services/autolife";

import * as template from "../actiontypes/CMSTemplateListingViewActionTypes";
import { accessToken } from "../selectors/userSelectors";

export const getTemplateList = query => async (dispatch, getState) => {
  dispatch({
    type: template.GET_CMS_TEMPLATE_LIST_REQUEST,
    payload: query
  });

  try {
    const response = await getArticlesApi(query, accessToken(getState()));

    dispatch({
      type: template.GET_CMS_TEMPLATE_LIST_SUCCESSFUL,
      payload: response.data.data
    });
  }
  catch(e) {
    dispatch({
      type: template.GET_CMS_TEMPLATE_LIST_FAIL,
      payload: e
    });
  }
};

export const deleteTemplatesSuccess = response => {
  return {
    type: template.DELETE_CMS_TEMPLATE_SUCCESSFUL,
    payload: response.data
  };
};

export const deleteTemplatesFail = () => {
  return {
    type: template.DELETE_CMS_TEMPLATE_FAIL
  };
};

export const deleteTemplates = id => (dispatch, getState) => {
  dispatch({
    type: template.DELETE_CMS_TEMPLATE_REQUEST
  });
  return deleteTemplatesApi(accessToken(getState()), id)
    .then(resp => dispatch(deleteTemplatesSuccess(resp.data)))
    .catch(error => dispatch(deleteTemplatesFail(error)));
};
