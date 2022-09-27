import {
  getCarManufacturerApi,
  getCarMakeApi,
  getCarModelApi,
  getCarYearsApi
} from "../../services/autolife";

import * as CMSCar from "../actiontypes/CMSCarBandSectionActionTypes";

let formatData = rowData => {
  let data = {};
  for (let i = 0; i < rowData.length; i++) {
    data[rowData[i].id] = rowData[i];
  }
  return data;
};
export const getCarManufacturerListSuccess = list => {
  const data = formatData(list.data);
  return {
    type: CMSCar.MANUFACTURER_LIST_REQUESTED_SUCCESSFUL,
    payload: {
      data: list.data,
      formatData: data
    }
  };
};

export const getCarManufacturerListFail = error => ({
  type: CMSCar.MANUFACTURER_LIST_REQUESTED_FAIL
});

export const getCarManufacturerList = token => dispatch => {
  dispatch({
    type: CMSCar.MANUFACTURER_LIST
  });
  return getCarManufacturerApi(token)
    .then(resp => dispatch(getCarManufacturerListSuccess(resp.data)))
    .catch(error => dispatch(getCarManufacturerListFail(error)));
};

export const getCarMakeListSuccess = list => {
  const data = formatData(list.data);
  return {
    type: CMSCar.MAKE_LIST_REQUESTED_SUCCESSFUL,
    payload: {
      data: list.data,
      formatData: data
    }
  };
};

export const getCarMakeListFail = error => ({
  type: CMSCar.MAKE_LIST_REQUESTED_FAIL
});

export const getCarMakeList = (params, token) => dispatch => {
  dispatch({
    type: CMSCar.MAKE_LIST
  });
  if (params === "") {
    dispatch(getCarMakeListSuccess({ data: [] }));
  } else {
    return getCarMakeApi(params, token)
      .then(resp => dispatch(getCarMakeListSuccess(resp.data)))
      .catch(error => dispatch(getCarMakeListFail(error)));
  }
};

export const getCarModelListSuccess = list => {
  const data = formatData(list.data);
  return {
    type: CMSCar.MODEL_LIST_REQUESTED_SUCCESSFUL,
    payload: {
      data: list.data,
      formatData: data
    }
  };
};

export const getCarModelListFail = error => ({
  type: CMSCar.MODEL_LIST_REQUESTED_FAIL
});

export const getCarModelList = (params, token) => dispatch => {
  dispatch({
    type: CMSCar.MODEL_LIST
  });
  if (params === "") {
    dispatch(getCarModelListSuccess({ data: [] }));
  } else {
    return getCarModelApi(params, token)
      .then(resp => dispatch(getCarModelListSuccess(resp.data)))
      .catch(error => dispatch(getCarModelListFail(error)));
  }
};
// getCarYearsApi
export const getCarModelYearListSuccess = list => {
  const data = formatData(list.data);
  return {
    type: CMSCar.YEAR_LIST_REQUESTED_SUCCESSFUL,
    payload: {
      data: list.data,
      formatData: data
    }
  };
};

export const getCarModelYearListFail = error => ({
  type: CMSCar.YEAR_LIST_REQUESTED_FAIL
});

export const getCarModelYearList = (params, token) => dispatch => {
  dispatch({
    type: CMSCar.YEAR_LIST
  });
  if (params === "") {
    dispatch(getCarModelYearListSuccess({ data: [] }));
  } else {
    return getCarYearsApi(params, token)
      .then(resp => dispatch(getCarModelYearListSuccess(resp.data)))
      .catch(error => dispatch(getCarModelYearListFail(error)));
  }
};
