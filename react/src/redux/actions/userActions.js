import {
  userSignup,
  postLoginApi,
  socialLoginApi,
  getProfileApi,
  postResetPasswordApi,
  postUpdatePasswordApi,
  refreshUserTokenApi,
  getSubscribedApi,
  getSubscribeMonthlyApi,
  verifyUserTokenApi,
  userSignoutApi
} from "services/autolife";
import * as user from "redux/actiontypes/userActionstypes";
import { push } from "react-router-redux";
import { sendEvent } from "utils/analytics";
import get from "lodash/get";
import storage from "redux-persist/lib/storage";


export const logoutUser = token => dispatch => {
  dispatch({
    type: user.USER_LOGOUT
  });
  if (token) return userSignoutApi(token).then(() => dispatch(push("/")));
};

export const userRefresh = () => dispatch => {
  dispatch({
    type: user.USER_REFRESH
  });

  // dispatch(push("/?signin&redirect=/"));
};

export const redirectToHomepage = () => dispatch => {
  dispatch({
    type: user.USER_REDIRECT_HOMEPAGE
  });

  dispatch(push("/"));
  dispatch(confirmationMessage());
};

export const registerUser = params => dispatch => {
  dispatch({
    type: user.USER_SIGNUP_REQUESTED
  });

  return userSignup(params)
    .then(resp => {
      if (resp.data.status === 200) {
        dispatch(userSignupSuccess(resp.data, params));
        // dispatch(push('/'))
        // dispatch (confirmationMessage())
      } else {
        dispatch(userSignupFail(resp.data.message));
      }

      return resp.data;
    })
    .catch(error => dispatch(userSignupFail(error)));
};
export const confirmationMessage = () => ({
  type: user.USER_SIGNUP_COFIRMATION
});

export const resetConfirmation = () => ({
  type: user.USER_RESET_SIGNUP_COFIRMATION
});

export const userSignupSuccess = (data, params) => {
  sendEvent("User", "signup");

  return {
    type: user.USER_SIGNUP_SUCCESSFUL,
    payload: {
      user: data.user,
      accessToken: data.access_token,
      userFormDetail: params
    }
  };
};

export const userSignupFail = err => ({
  type: user.USER_SIGNUP_FAIL,
  payload: err
});

export const getProfileSuccess = (data, token) => {
  if (data.status == 200) {
    return {
      type: user.USER_PROFILE_SUCCESSFUL,
      payload: {
        user: data.data,
        accessToken: token
      }
    };
  }
  return {
    type: user.USER_AUTHENTICATE_FAIL,
    payload: data.message
  };
};
export const getProfile = token => dispatch => {
  dispatch({
    type: user.USER_PROFILE_REQUESTED
  });
  return getProfileApi(token)
    .then(resp => {
      dispatch(getProfileSuccess(resp.data, token));
      return resp.data;
    })
    .catch(error => dispatch(userAuthenticateFail(error)));
};

export const socialLogin = (params, redirect = "/") => dispatch => {
  dispatch({
    type: user.USER_PROFILE_REQUESTED
  });
  return socialLoginApi(params)
    .then(resp => {
      const newUser = get(resp.data, "data.user_details.newuser");
      if(newUser)
        sendEvent("User", "signup");

      dispatch(userAuthenticateSuccess(resp.data));
      if (resp.data.status == 200) {
        dispatch(push(redirect));
      }
      return resp.data;
    })
    .catch(error => dispatch(userAuthenticateFail(error)));
};
export const authenticateUser = (params, redirect = "/") => dispatch => {
  dispatch({
    type: user.USER_AUTHENTICATE_REQUESTED
  });

  return postLoginApi(params)
    .then(resp => {
      dispatch(userAuthenticateSuccess(resp.data));
      if (resp.data.status === 200) {
        dispatch(push(redirect));
      }
      // else if (resp.data.status == 401)
      // dispatch(redirectToHomepage())
      return resp.data;
    })
    .catch(error => dispatch(userAuthenticateFail(error)));
};

export const userAuthenticateSuccess = data => {
  if (data.status === 200) {
    sendEvent("User", "signin");

    return {
      type: user.USER_AUTHENTICATE_SUCCESSFUL,
      payload: {
        user: data.data,
        accessToken: data.data.token
      }
    };
  }
  return {
    type: user.USER_AUTHENTICATE_FAIL,
    payload: data.message
  };
};

export const userAuthenticateFail = () => dispatch => {
  dispatch({
    type: user.USER_AUTHENTICATE_FAIL,
    payload: "Some error has occured"
  });
};

export const verifyUserTokenSuccess = data => {
  if (data.status === 200) {
    return {
      type: user.USER_VERIFY_SUCCESSFUL,
      payload: {
        user: data.data,
        accessToken: data.data.token
      }
    };
  }
  // return {
  //   type: user.USER_VERIFY_FAIL,
  //   payload: data.message
  // };
};

export const verifyUserTokenFail = (err, params) => async dispatch => {
  dispatch({
    type: user.USER_VERIFY_FAIL
  });
};

export const verifyUserToken = (params, redirect = "/") => dispatch => {
  dispatch({
    type: user.USER_VERIFY_REQUESTED
  });
  return verifyUserTokenApi(params)
    .then(resp => {
      dispatch(verifyUserTokenSuccess(resp));

      return resp.data;
    })
    .catch(error => dispatch(verifyUserTokenFail(error, params)));
};

export const refreshUserTokenSuccess = data => {
  if (data.status === 200) {
    return {
      type: user.USER_REFRESH_TOKEN_SUCCESSFUL,
      payload: {
        // user: data.data,
        accessToken: data.data.token
      }
    };
  }
  return {
    type: user.USER_REFRESH_TOKEN_FAIL,
    payload: data.message
  };
};

export const refreshUserTokenFail = () => dispatch => {
  dispatch({
    type: user.USER_REFRESH_TOKEN_FAIL
  });
  return dispatch(userRefresh());
};

export const refreshUserToken = (params, redirect = "/") => dispatch => {
  dispatch({
    type: user.USER_REFRESH_TOKEN_REQUESTED
  });

  return refreshUserTokenApi(params)
    .then(resp => {
      dispatch(refreshUserTokenSuccess(resp.data));
    })
    .catch(error => dispatch(refreshUserTokenFail(error, (redirect = "/"))));
};

export const resetErrorMessage = () => ({
  type: user.USER_VERIFY_REQUESTED
});

export const userAuthenticateAuthFail = () => dispatch => {
  dispatch({
    type: user.USER_AUTHENTICATE_FAIL,
    payload: "Some error has occured"
  });
  return dispatch(push("/"));
};

export const resetPasswordSuccess = response => ({
  type: user.USER_RESET_PASSWORD_SUCCESSFUL,
  payload: response
});

export const resetPasswordFail = error => ({
  type: user.USER_RESET_PASSWORD_FAIL,
  payload: error
});

export const resetPassword = query => dispatch => {
  dispatch({
    type: user.USER_RESET_PASSWORD_REQUESTED
  });
  return postResetPasswordApi(query)
    .then(resp => {
      dispatch(resetPasswordSuccess(resp.data));
      return resp.data;
    })
    .catch(error => dispatch(resetPasswordFail(error)));
};

export const updatePasswordSuccess = question => ({
  type: user.USER_UPDATE_PASSWORD_SUCCESSFUL,
  payload: question.data
});

export const updatePasswordFail = () => ({
  type: user.USER_UPDATE_PASSWORD_FAIL
});

export const updatePassword = params => dispatch => {
  dispatch({
    type: user.USER_UPDATE_PASSWORD_REQUESTED
  });

  return postUpdatePasswordApi(params)
    .then(resp => {
      dispatch(updatePasswordSuccess(resp.data));
      return resp.data;
    })
    .catch(error => dispatch(updatePasswordFail(error)));
};

export const getUserSubscribedSuccess = payload => ({
  type: user.USER_SUBSCRIBE_SUCCESSFUL,
  payload
});

export const getUserSubscribedFail = () => ({
  type: user.USER_SUBSCRIBE_FAIL
});

export const getUserSubscribed = params => dispatch => {
  dispatch({
    type: user.USER_SUBSCRIBE_REQUESTED
  });
  return getSubscribedApi(params)
    .then(resp => dispatch(getUserSubscribedSuccess(resp.data)))
    .catch(error => dispatch(getUserSubscribedFail(error)));
};

export const getUserSubscribeMonthlySuccess = payload => ({
  type: user.USER_SUBSCRIBE_SUCCESSFUL,
  payload
});

export const getUserSubscribeMonthlyFail = () => ({
  type: user.USER_SUBSCRIBE_FAIL
});

export const getUserSubscribeMonthly = params => dispatch => {
  dispatch({
    type: user.USER_SUBSCRIBE_REQUESTED
  });
  return getSubscribeMonthlyApi(params)
    .then(resp => dispatch(getUserSubscribeMonthlySuccess(resp.data)))
    .catch(error => dispatch(getUserSubscribeMonthlyFail(error)));
};

export const emptyUserMessage = () => dispatch => {
  dispatch({
    type: user.USER_ERROR_MESSAGE_EMPTY
  })
  storage.removeItem('persist:user')
}