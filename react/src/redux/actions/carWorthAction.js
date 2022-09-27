import {
  getYearApi,
  getMakeApi,
  getcarWorthModelApi,
  getcarWorthTrimApi,
  getcarWorthStyleApi,
  postTradeInValueStepTwoApi,
  getYearAvgPriceApi,
  getMakeAvgPriceApi,
  getModelAvgPriceApi,
  getTrimAvgPriceApi,
  getStyleAvgPriceApi,
  postAvgAskingResultsApi,
  getMakeFutureValueApi,
  getModelFutureValueApi,
  getYearFutureValueApi,
  getTrimFutureValueApi,
  getStyleFutureValueApi,
  postFutureValueResultsApi
} from '../../services/autolife';

import * as carWorth from '../actiontypes/carWorthActionTypes';

export const getYear = query => dispatch => {
  return getYearApi(query).then(resp =>
    dispatch({
      type: carWorth.GET_CAR_WORTH_YEAR,
      payload: resp.data
    })
  );
};

export const getYearAvgPrice = query => dispatch => {
  return getYearAvgPriceApi(query).then(resp =>
    dispatch({
      type: carWorth.GET_CAR_WORTH_AVG_PRICE_YEAR,
      payload: resp.data
    })
  );
};

export const getMakeAvgPrice = query => dispatch => {
  dispatch({ type: carWorth.GET_CAR_WORTH_AVG_PRICE_MAKE_REQUEST });

  return getMakeAvgPriceApi(query).then(resp =>
    dispatch({
      type: carWorth.GET_CAR_WORTH_AVG_PRICE_MAKE,
      payload: resp.data
    })
  );
};

export const getModelAvgPrice = (year, make) => dispatch => {
  dispatch({ type: carWorth.GET_CAR_WORTH_AVG_PRICE_MODEL_REQUEST });

  return getModelAvgPriceApi(year, make).then(resp =>
    dispatch({
      type: carWorth.GET_CAR_WORTH_AVG_PRICE_MODEL,
      payload: resp.data
    })
  );
};

export const getTrimAvgPrice = (year, make, model) => {
  return dispatch => {
    return getTrimAvgPriceApi(year, make, model).then(resp =>
      dispatch({
        type: carWorth.GET_CAR_WORTH_AVG_PRICE_TRIM,
        payload: resp.data
      })
    );
  };
};

export const getStyleAvgPrice = (year, make, model, trim) => dispatch => {
  return getStyleAvgPriceApi(year, make, model, trim).then(resp =>
    dispatch({
      type: carWorth.GET_CAR_WORTH_AVG_PRICE_STYLE,
      payload: resp.data
    })
  );
};

export const getYearFutureValue = query => dispatch => {
  return getYearFutureValueApi(query).then(resp =>
    dispatch({
      type: carWorth.GET_CAR_WORTH_FUTURE_VALUE_YEAR,
      payload: resp.data
    })
  );
};

export const getMakeFutureValue = query => dispatch => {
  return getMakeFutureValueApi(query).then(resp =>
    dispatch({
      type: carWorth.GET_CAR_WORTH_FUTURE_VALUE_MAKE,
      payload: resp.data
    })
  );
};

export const getModelFutureValue = (year, make) => dispatch => {
  return getModelFutureValueApi(year, make).then(resp =>
    dispatch({
      type: carWorth.GET_CAR_WORTH_FUTURE_VALUE_MODEL,
      payload: resp.data
    })
  );
};

export const getTrimFutureValue = (year, make, model) => dispatch => {
  return getTrimFutureValueApi(year, make, model).then(resp =>
    dispatch({
      type: carWorth.GET_CAR_WORTH_FUTURE_VALUE_TRIM,
      payload: resp.data
    })
  );
};

export const getStyleFutureValue = (year, make, model, trim) => dispatch => {
  return getStyleFutureValueApi(year, make, model, trim).then(resp =>
    dispatch({
      type: carWorth.GET_CAR_WORTH_FUTURE_VALUE_STYLE,
      payload: resp.data
    })
  );
};

export const getMake = query => dispatch => {
  return getMakeApi(query).then(resp =>
    dispatch({
      type: carWorth.GET_CAR_WORTH_MAKE,
      payload: resp.data
    })
  );
};

export const getModel = (year, make) => dispatch => {
  return getcarWorthModelApi(year, make).then(resp =>
    dispatch({
      type: carWorth.GET_CAR_WORTH_MODEL,
      payload: resp.data
    })
  );
};

export const postTradeInValueStepTwo = (params, token) => dispatch => {
  return postTradeInValueStepTwoApi(params, token).then(resp =>
    dispatch({
      type: carWorth.TRADE_IN_VALUE_STEP_TWO,
      payload: resp.data
    })
  );
};

export const postAvgPriceResult = (params, token) => dispatch => {
  return postAvgAskingResultsApi(params, token).then(resp =>
    dispatch({
      type: carWorth.POST_AVG_PRICE_RESULT,
      payload: resp.data
    })
  );
};

export const postFutureValueResults = (params, token) => dispatch => {
  return postFutureValueResultsApi(params, token).then(resp =>
    dispatch({
      type: carWorth.POST_FUTURE_VALUE_RESULT,
      payload: resp.data
    })
  );
};

export const getTrim = (year, make, model) => dispatch => {
  return getcarWorthTrimApi(year, make, model).then(resp =>
    dispatch({
      type: carWorth.GET_CAR_WORTH_TRIM,
      payload: resp.data
    })
  );
};

export const getStyle = (year, make, model, trim, body_style) => dispatch => {
  return getcarWorthStyleApi(year, make, model, trim, body_style).then(resp => {
    dispatch({
      type: carWorth.GET_CAR_WORTH_STYLE,
      payload: resp.data
    });
    return resp.data;
  });
};
