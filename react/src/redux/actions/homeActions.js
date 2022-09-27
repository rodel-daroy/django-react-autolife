import {
  HOME_PAGE_LOAD,
  GET_VERSION,
  POLL_RESULT,
  EMPTY_HOME_PAGE
} from "../actiontypes/homeActionstypes";

import {
  gethomePageTileApi,
  getVersionNumerApi,
  postPollsDataApi
} from "../../services/autolife";

export const getHomePageTiles = token => async dispatch => {
  const res = await gethomePageTileApi(token);
  dispatch({
    type: HOME_PAGE_LOAD,
    payload: res.data
  });
  return res.data;
};

export const emptyHomePageTiles = () => dispatch => {
  dispatch({
    type: EMPTY_HOME_PAGE
  });
};

export const getVersionNumber = () => async dispatch => {
  const res = await getVersionNumerApi();
  dispatch({
    type: GET_VERSION,
    payload: res.data
  });
  return res.data;
};

export const postPollsData = (id, params) => async dispatch => {
  console.log(params, "polls params");
  console.log(id, "polls id");
  const res = await postPollsDataApi(id, params);
  dispatch({
    type: POLL_RESULT,
    payload: res.data
  });
  return res.data;
};
