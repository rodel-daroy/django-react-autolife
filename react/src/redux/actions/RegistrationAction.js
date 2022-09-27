import {
  getQuestionsApi,
  getBrandsApi,
  getLifeStyleApi,
  getOffersApi
}
 from '../../services/autolife';

 import * as registration from '../actiontypes/RegistrationActionTypes';


export const getQuestions = params => {
  return dispatch => {
    return getQuestionsApi(params)
    .then(resp => {
      dispatch({
        type: registration.GET_QUEATION,
        payload: resp.data
      });
      return resp.data
    });
  };
};

export const getBrands = params => {
  return dispatch => {
    return getBrandsApi(params)
    .then(resp => {
      dispatch({
        type: registration.GET_BRANDS,
        payload: resp.data
      });
      return resp.data
    });
  };
};


export const getLifeStyle = params => {
  return dispatch => {
    return getLifeStyleApi(params)
    .then(resp => {
      dispatch({
        type: registration.GET_LIFESTYLE,
        payload: resp.data
      });
      return resp.data
    });
  };
};

export const getOffers = params => {
  return dispatch => {
    return getOffersApi(params)
    .then(resp => {
      dispatch({
        type: registration.GET_OFFERS,
        payload: resp.data
      });
      return resp.data
    });
  };
};