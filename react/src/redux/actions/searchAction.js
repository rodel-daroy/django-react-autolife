import { getSearchApi } from "../../services/autolife";

import * as search from "../actiontypes/searchActionTypes";

export const getSearchResultSuccess = question => ({
  type: search.GET_SEARCH_RESULT_SUCCESSFUL,
  payload: question.data
});

export const getSearchResultFail = () => ({
  type: search.GET_SEARCH_RESULT_FAIL
});

export const getSearchResult = token => dispatch => {
  dispatch({
    type: search.GET_SEARCH_RESULT_REQUESTED
  });
  return getSearchApi(token)
    .then(resp => dispatch(getSearchResultSuccess(resp.data)))
    .catch(error => dispatch(getSearchResultFail(error)));
};
