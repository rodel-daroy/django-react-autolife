import {
  getCountryListApi,
  getStateListApi,
  getCityListApi,
  getSponsorListApi,
  getCampaignListApi
} from "../../services/autolife";

import * as editorialCms from "../actiontypes/editorialCmsActiontypes";

export const getCountryListSuccess = list => {
  return {
    type: editorialCms.COUNTRY_LIST_REQUESTED_SUCCESSFUL,
    payload: list.data
  };
};

export const getCountryListFail = error => {
  return {
    type: editorialCms.COUNTRY_LIST_REQUESTED_FAIL
  };
};

export const getCountryList = token => {
  return dispatch => {
    dispatch({
      type: editorialCms.COUNTRY_LIST
    });
    return getCountryListApi(token)
      .then(resp => dispatch(getCountryListSuccess(resp.data)))
      .catch(error => dispatch(getCountryListFail(error)));
  };
};

export const getStateListSuccess = list => {
  return {
    type: editorialCms.STATE_LIST_REQUESTED_SUCCESSFUL,
    payload: list.data
  };
};

export const getStateListFail = error => {
  return {
    type: editorialCms.STATE_LIST_REQUESTED_FAIL
  };
};

export const getStateList = (params, token) => {
  return dispatch => {
    dispatch({
      type: editorialCms.STATE_LIST
    });
    return getStateListApi(params, token)
      .then(resp => dispatch(getStateListSuccess(resp.data)))
      .catch(error => dispatch(getStateListFail(error)));
  };
};

export const getCityListSuccess = list => {
  return {
    type: editorialCms.CITY_LIST_REQUESTED_SUCCESSFUL,
    payload: list.data
  };
};

export const getCityListFail = error => {
  return {
    type: editorialCms.CITY_LIST_REQUESTED_FAIL
  };
};

export const getCityList = (params, token) => {
  return dispatch => {
    dispatch({
      type: editorialCms.CITY_LIST
    });
    return getCityListApi(params, token)
      .then(resp => dispatch(getCityListSuccess(resp.data)))
      .catch(error => dispatch(getCityListFail(error)));
  };
};

export const getSponsorListSuccess = list => {
  return {
    type: editorialCms.SPONSOR_LIST_REQUESTED_SUCCESSFUL,
    payload: list.data
  };
};

export const getSponsorListFail = error => {
  return {
    type: editorialCms.SPONSOR_LIST_REQUESTED_FAIL
  };
};

export const getSponsorList = token => {
  return dispatch => {
    dispatch({
      type: editorialCms.SPONSOR_LIST
    });
    return getSponsorListApi(token)
      .then(resp => dispatch(getSponsorListSuccess(resp.data)))
      .catch(error => dispatch(getSponsorListFail(error)));
  };
};

export const getCampaignListSuccess = list => {
  return {
    type: editorialCms.CAMPAIGN_LIST_REQUESTED_SUCCESSFUL,
    payload: list.data
  };
};

export const getCampaignListFail = error => {
  return {
    type: editorialCms.CAMPAIGN_LIST_REQUESTED_FAIL
  };
};

export const getCampaignList = token => {
  return dispatch => {
    dispatch({
      type: editorialCms.CAMPAIGN_LIST
    });
    return getCampaignListApi(token)
      .then(resp => dispatch(getCampaignListSuccess(resp.data)))
      .catch(error => dispatch(getCampaignListFail(error)));
  };
};
