import * as user from "../actiontypes/userActionstypes";

const initialState = {
  authUser: {},
  loading: false,
  errored: false,
  errorMessage: null,
  registerUser: false,
  registerError: false,
  registerMessage: null,
  confirmMsg: false,
  resetData: null,
  updatePassword: null,
  loggedIn: false,
  sessionTime: "",
  subscribeData: null,
  userChangeCount: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case user.USER_LOGOUT:
    case user.USER_REFRESH:
      return {
        ...state,
        authUser: {},
        confirmMsg: false,
        loggedIn: false,
        sessionTime: "",
        userChangeCount: (action.type === user.USER_LOGOUT) ? ((state.userChangeCount || 0) + 1) : state.userChangeCount
      };
    case user.USER_RESET_SIGNUP_COFIRMATION:
    case user.USER_SIGNUP_COFIRMATION:
      return {
        ...state,
        confirmMsg: false
      };
    case user.USER_SIGNUP_SUCCESSFUL:
      return {
        ...state,
        registerUser: true,
        userFormDetail: action.payload.userFormDetail,
        registering: false
      };
    case user.USER_AUTHENTICATE_SUCCESSFUL:
      return {
        ...state,
        authUser: action.payload,
        errorMessage: null,
        errored: false,
        loggedIn: true,
        sessionTime: new Date().toLocaleTimeString(),
        userChangeCount: (state.userChangeCount || 0) + 1
      };
    case user.USER_PROFILE_SUCCESSFUL:
      return {
        ...state,
        authUser: action.payload,
        errorMessage: null,
        errored: false
      };
    case user.USER_SIGNUP_FAIL:
      return {
        ...state,
        registerError: true,
        registerMessage: action.payload,
        registering: false
      };
    case user.USER_SIGNUP_REQUESTED:
      return {
        ...state,
        registerError: false,
        errorMessage: null,
        errored: false,
        registerMessage: null,
        registering: true
      };
    case user.USER_RESET_PASSWORD_SUCCESSFUL:
      return {
        ...state,
        resetData: action.payload
      };
    case user.USER_RESET_PASSWORD_FAIL:
      return {
        ...state
      };
    case user.USER_RESET_PASSWORD_REQUESTED:
      return {
        ...state
      };
    case user.USER_UPDATE_PASSWORD_SUCCESSFUL:
      return {
        ...state,
        updatePassword: action.payload
      };
    case user.USER_UPDATE_PASSWORD_FAIL:
      return {
        ...state
      };
    case user.USER_UPDATE_PASSWORD_REQUESTED:
      return {
        ...state
      };
    case user.USER_AUTHENTICATE_FAIL:
      return {
        ...state,
        errorMessage: action.payload,
        errored: true
      };
    case user.USER_AUTHENTICATE_REQUESTED:
      return {
        ...state,
        errorMessage: null,
        errored: false,
        registerError: false,
        registerMessage: null,
        userFormDetail: null
      };
    case user.USER_REFRESH_TOKEN_SUCCESSFUL:
      return {
        ...state,
        authUser: {
          ...state.authUser,
          accessToken: action.payload.accessToken
        },
        sessionTime: new Date().toLocaleTimeString()
      };
    case user.USER_REFRESH_TOKEN_FAIL:
      return {
        ...state
      };
    case user.USER_REFRESH_TOKEN_REQUESTED:
      return {
        ...state,
        errorMessage: null,
        errored: false,
        registerError: false,
        registerMessage: null,
        userFormDetail: null
      };
    case user.USER_VERIFY_SUCCESSFUL:
      return {
        ...state
      };
    case user.USER_VERIFY_FAIL:
      return {
        ...state,
        authUser: {}
      };
    case user.USER_VERIFY_REQUESTED:
      return {
        ...state
      };
    case user.USER_PROFILE_FAIL:
      return {
        ...state,
        errorMessage: action.payload,
        errored: true
      };
    case user.USER_PROFILE_REQUESTED:
      return {
        ...state,
        errorMessage: null,
        errored: false,
        registerError: false,
        registerMessage: null
      };
    case user.USER_SUBSCRIBE_REQUESTED:
      return {
        ...state,
        loading: true
      };
    case user.USER_SUBSCRIBE_SUCCESSFUL:
      return {
        ...state,
        subscribeData: action.payload,
        loading: false
      };
    case user.USER_SUBSCRIBE_FAIL:
      return {
        ...state,
        loading: false
      };
    case user.USER_ERROR_MESSAGE_EMPTY:
      return {
        ...state,
        _persist: state._persist,
        errorMessage: null,
        errored: false,
      }
    default:
      return state;
  }
};
