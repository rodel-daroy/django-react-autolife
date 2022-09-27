import * as userContainerAction from "../actiontypes/userContainerActionTypes";
import { urlSearchToObj, objToUrlSearch } from "utils/url";
import omit from "lodash/omit";

export const USER_PATHS = {
  [userContainerAction.PATH_SIGNIN]: "signin",
  [userContainerAction.UNAUTHORIZED]: "unauthorized",
  [userContainerAction.PATH_SIGNOUT]: "signout",
  [userContainerAction.PATH_FORGOT_PASSWORD]: "forgot-password",
  [userContainerAction.PATH_VERIFY_PASSWORD]: "verify",
  [userContainerAction.PATH_RESET_PASSWORD_PASSWORD]: "reset-password",
  [userContainerAction.PATH_SIMPLE_REGISTER]: "register"
};

const actionCreator = type => () => dispatch => {
  return dispatch({
    type,
    payload: USER_PATHS[type]
  });
};

export const modalSignIn = actionCreator(userContainerAction.PATH_SIGNIN);
export const unAuthorized = actionCreator(userContainerAction.UNAUTHORIZED);
export const modalSignOut = actionCreator(userContainerAction.PATH_SIGNOUT);
export const modalForgetPassword = actionCreator(userContainerAction.PATH_FORGOT_PASSWORD);
export const modalVerifyPassword = actionCreator(userContainerAction.PATH_VERIFY_PASSWORD);
export const modalResetPassword = actionCreator(userContainerAction.PATH_RESET_PASSWORD_PASSWORD);

export const closeModal = () => dispatch => {
  dispatch({
    type: userContainerAction.CLOSE_MODAL,
    payload: null
  });
};

export const modalSimpleRegister = actionCreator(userContainerAction.PATH_SIMPLE_REGISTER);

export const dispatchLocationAction = history => dispatch => {
  const { location } = history;

  const searchObj = urlSearchToObj(location.search);
  const searchKeys = Object.keys(searchObj);

  const entries = Object.entries(USER_PATHS);

  for(const searchKey of searchKeys) {
    const entry = entries.find(entry => entry[1] === searchKey);
    if(entry) {
      history.replace({
        ...location,
        search: objToUrlSearch(omit(searchObj, Object.values(USER_PATHS)))
      });

      dispatch({
        type: entry[0],
        payload: entry[1]
      });

      return true;
    }
  }

  return false;
};
