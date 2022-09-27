import {
  getInsuranceQuoteApi,
  getYearListApi,
  getModelListApi,
  getMakeListApi
} from '../../services/autolife';
import * as insurance from '../actiontypes/insuranceActionTypes';

// export const getInsuranceQuote = params => async dispatch => {
//   const res = await getInsuranceQuoteApi(params);
//   dispatch({
//     type: insurance.GET_INSURANCE_QUOTE,
//     payload: res.data
//   });
//   return res.data;
// };

export const getInsuranceQuoteSuccess = question => ({
  type: insurance.GET_INSURANCE_QUOTE_SUCCESSFUL,
  payload: question
});

export const getInsuranceQuoteFail = () => ({
  type: insurance.GET_INSURANCE_QUOTE_FAIL
});

export const getInsuranceQuote = (params, token) => dispatch => {
  dispatch({
    type: insurance.GET_INSURANCE_QUOTE_REQUESTED
  });
  return getInsuranceQuoteApi(params, token)
    .then(resp => dispatch(getInsuranceQuoteSuccess(resp.data)))
    .catch(error => dispatch(getInsuranceQuoteFail(error)));
};

export const getYearListSuccess = payload => ({
  type: insurance.GET_YEAR_LIST_SUCCESSFUL,
  payload
});

export const getYearListFail = () => ({
  type: insurance.GET_YEAR_LIST_FAIL
});

export const getYearList = params => dispatch => {
  dispatch({
    type: insurance.GET_YEAR_LIST_REQUESTED
  });
  return getYearListApi(params)
    .then(resp => dispatch(getYearListSuccess(resp.data)))
    .catch(error => dispatch(getYearListFail(error)));
};

export const getModelListSuccess = payload => ({
  type: insurance.GET_MODEL_LIST_SUCCESSFUL,
  payload
});

export const getModelListFail = () => ({
  type: insurance.GET_MODEL_LIST_FAIL
});

export const getModelList = params => dispatch => {
  dispatch({
    type: insurance.GET_MODEL_LIST_REQUESTED
  });
  return getModelListApi(params)
    .then(resp => dispatch(getModelListSuccess(resp.data)))
    .catch(error => dispatch(getModelListFail(error)));
};

export const getMakeListSuccess = payload => ({
  type: insurance.GET_MAKE_LIST_SUCCESSFUL,
  payload
});

export const getMakeListFail = () => ({
  type: insurance.GET_MAKE_LIST_FAIL
});

export const getMakeList = (type, params) => dispatch => {
  dispatch({
    type: insurance.GET_MAKE_LIST_REQUESTED
  });
  return getMakeListApi(type, params)
    .then(resp => dispatch(getMakeListSuccess(resp.data)))
    .catch(error => dispatch(getMakeListFail(error)));
};
