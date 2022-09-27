import {
  postUpdateProfileApi,
  postUpdateBrandApi,
  postUpdateSubjectIntrestApi,
  getUserInformationApi,
  getOldPasswordApi,
  postDeleteCarApi,
  postDeleteCarListApi,
  postImageUploadApi
} from "../../services/autolife";

import * as profile from "../actiontypes/profileActionTypes";

export const updateProfileSuccess = profilePage => {
  return {
    type: profile.UPDATE_PROFILE_SUCCESSFUL,
    payload: profilePage.data
  };
};

export const updateProfileFail = error => {
  return {
    type: profile.UPDATE_PROFILE_FAIL
  };
};
export const updateProfile = (values, token) => {
  return dispatch => {
    dispatch({
      type: profile.UPDATE_PROFILE_REQUEST
    });
    return postUpdateProfileApi(values, token)
      .then(resp => dispatch(updateProfileSuccess(resp.data)))
      .catch(error => dispatch(updateProfileFail(error)));
  };
};

export const updateSubjectInterestSuccess = profilePage => {
  return {
    type: profile.UPDATE_SUBJECT_INTEREST_SUCCESSFUL,
    payload: profilePage.data
  };
};

export const updateSubjectInterestFail = error => {
  return {
    type: profile.UPDATE_SUBJECT_INTEREST_FAIL
  };
};

export const updateSubjectInterest = (values, token) => {
  return dispatch => {
    dispatch({
      type: profile.UPDATE_SUBJECT_INTEREST_REQUEST
    });
    return postUpdateSubjectIntrestApi(values, token)
      .then(resp => dispatch(updateSubjectInterestSuccess(resp.data)))
      .catch(error => dispatch(updateSubjectInterestFail(error)));
  };
};

export const updateBrandSuccess = profilePage => {
  return {
    type: profile.UPDATE_BRAND_SUCCESSFUL,
    payload: profilePage.data
  };
};

export const updateBrandFail = error => {
  return {
    type: profile.UPDATE_BRAND_FAIL
  };
};

export const updateBrand = (values, token) => {
  return dispatch => {
    dispatch({
      type: profile.UPDATE_BRAND_REQUEST
    });
    return postUpdateBrandApi(values, token)
      .then(resp => dispatch(updateSubjectInterestSuccess(resp.data)))
      .catch(error => dispatch(updateSubjectInterestFail(error)));
  };
};

export const getUserInformationSuccess = profilePage => {
  return {
    type: profile.GET_USER_INFO_SUCCESSFUL,
    payload: profilePage.data
  };
};

export const getUserInformationFail = error => {
  return {
    type: profile.GET_USER_INFO_FAIL
  };
};
export const getUserInformation = token => {
  return dispatch => {
    dispatch({
      type: profile.GET_USER_INFO_REQUEST
    });
    return getUserInformationApi(token)
      .then(resp => dispatch(getUserInformationSuccess(resp.data)))
      .catch(error => dispatch(getUserInformationFail(error)));
  };
};

export const getOldPasswordSuccess = profilePage => {
  return {
    type: profile.GET_OLD_PASSWORD_SUCCESSFUL,
    payload: profilePage.status
  };
};

export const getOldPasswordFail = error => {
  return {
    type: profile.GET_OLD_PASSWORD_FAIL
  };
};
export const getOldPassword = (value, token) => {
  return dispatch => {
    dispatch({
      type: profile.GET_OLD_PASSWORD_REQUEST
    });
    return getOldPasswordApi(value, token)
      .then(resp => dispatch(getOldPasswordSuccess(resp.data)))
      .catch(error => dispatch(getOldPasswordFail(error)));
  };
};

export const deleteCarSuccess = profilePage => {
  return {
    type: profile.POST_DELETE_CAR_SUCCESSFUL,
    payload: profilePage.data
  };
};

export const deleteCarFail = error => {
  return {
    type: profile.POST_DELETE_CAR_FAIL
  };
};

export const deleteSavedCar = (id, token) => {
  return dispatch => {
    dispatch({
      type: profile.POST_DELETE_CAR_REQUEST
    });
    return postDeleteCarApi(id, token)
      .then(resp => dispatch(deleteCarSuccess(resp.data)))
      .catch(error => dispatch(deleteCarFail(error)));
  };
};

export const deleteCarListSuccess = profilePage => {
  return {
    type: profile.POST_DELETE_CAR_LIST_SUCCESSFUL,
    payload: profilePage.data
  };
};

export const deleteCarListFail = error => {
  return {
    type: profile.POST_DELETE_CAR_LIST_FAIL
  };
};
export const deleteCarList = (id, token) => {
  return dispatch => {
    dispatch({
      type: profile.POST_DELETE_CAR_LIST_REQUEST
    });
    return postDeleteCarListApi(id, token)
      .then(resp => dispatch(deleteCarListSuccess(resp.data)))
      .catch(error => dispatch(deleteCarListFail(error)));
  };
};

export const postImageUploadSuccess = profilePage => {
  return {
    type: profile.POST_IMAGE_UPLOAD_SUCCESSFUL,
    payload: profilePage.url
  };
};

export const postImageUploadFail = error => {
  return {
    type: profile.POST_IMAGE_UPLOAD_FAIL
  };
};
export const postImageUpload = (values, token) => {
  return dispatch => {
    dispatch({
      type: profile.POST_IMAGE_UPLOAD_REQUEST
    });
    return postImageUploadApi(values, token)
      .then(resp => dispatch(postImageUploadSuccess(resp.data)))
      .catch(error => dispatch(postImageUploadFail(error)));
  };
};
