import * as profile from "../actiontypes/profileActionTypes";

const initialState = {
  userInfo: {},
  imageData: {},
  updateSubjectInterest: {},
  updateBrand: {},
  loading: false,
  updating: false,
  oldPassword: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case profile.UPDATE_PROFILE_REQUEST:
    case profile.UPDATE_SUBJECT_INTEREST_REQUEST:
    case profile.UPDATE_BRAND_REQUEST:
    case profile.POST_DELETE_CAR_LIST_REQUEST:
    case profile.POST_IMAGE_UPLOAD_REQUEST:
      return {
        ...state,
        loading: true,
        updating: true
      };
    case profile.GET_USER_INFO_REQUEST:
    case profile.GET_OLD_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true
      };
    case profile.POST_DELETE_CAR_REQUEST:
      return {
        ...state,
        loading: true,
        userInfo: action.payload,
        updating: true
      };
    case profile.UPDATE_PROFILE_FAIL:
    case profile.UPDATE_SUBJECT_INTEREST_FAIL:
    case profile.UPDATE_BRAND_FAIL:
    case profile.POST_DELETE_CAR_LIST_FAIL:
    case profile.POST_IMAGE_UPLOAD_FAIL:
    case profile.POST_DELETE_CAR_FAIL:
      return {
        ...state,
        loading: false,
        updating: false
      };
    case profile.GET_USER_INFO_FAIL:
    case profile.GET_OLD_PASSWORD_FAIL:
      return {
        ...state,
        loading: false
      };
    case profile.UPDATE_PROFILE_SUCCESSFUL:
      return {
        ...state,
        loading: false,
        updating: false
      };
    case profile.UPDATE_SUBJECT_INTEREST_SUCCESSFUL:
      return {
        ...state,
        updateSubjectInterest: action.payload,
        loading: false,
        updating: false
      };
    case profile.UPDATE_BRAND_SUCCESSFUL:
      return {
        ...state,
        updateBrand: action.payload,
        loading: false,
        updating: false
      };
    case profile.GET_USER_INFO_SUCCESSFUL:
      return {
        ...state,
        userInfo: action.payload,
        loading: false
      };
    case profile.GET_OLD_PASSWORD_SUCCESSFUL:
      return {
        ...state,
        oldPassword: action.payload,
        loading: false
      };
    case profile.POST_DELETE_CAR_SUCCESSFUL:
      return {
        ...state,
        userInfo: action.payload,
        loading: false,
        updating: false
      };
    case profile.POST_DELETE_CAR_LIST_SUCCESSFUL:
      return {
        ...state,
        userInfo: action.payload,
        loading: false,
        updating: false
      };
    case profile.POST_IMAGE_UPLOAD_SUCCESSFUL:
      return {
        ...state,
        imageData: action.payload,
        loading: false,
        updating: false
      };
    default:
      return state;
  }
};
