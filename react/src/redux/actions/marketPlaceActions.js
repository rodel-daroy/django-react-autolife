import {
  getMakesApi,
  getContactConfirmApi,
  getLeadApi,
  getModelApi,
  postSearchApi,
  getCarDetailsApi,
  getCarSpecificationApi,
  getOtherCarsApi,
  getDealerInfoApi,
  getIncentiveApi,
  getBrowseCarDetailApi,
  saveVehicleApi,
  unSaveVehicleApi,
  getBrowseCategoryApi,
  getCategoriesDetailApi,
  getSubCategoriesDetailApi,
  getBrowseDetailApi,
  getAllVehicleApi,
  getSimilarVehicleApi,
  getBrandsApi,
  getCarColorsApi
} from "services/autolife";

import { push } from 'react-router-redux';

import * as marketPlace from '../actiontypes/marketPlacetypes';

export const getMakes = query => async dispatch => {
  dispatch({ type: marketPlace.MAKE_FILTER_REQUEST });

  const res = await getMakesApi(query);
  dispatch({
    type: marketPlace.MAKE_FILTER,
    payload: res.data
  });
  return res.data;
};

export const emptyData = () => ({
  type: marketPlace.EMPTY_CAR_DETAILS
});

export const getSimilarVehicle = (query, token) => async dispatch => {
  const res = await getSimilarVehicleApi(query, token);
  dispatch({
    type: marketPlace.GET_SIMILAR_VEHILCE,
    payload: res.data
  });
  return res.data;
};

export const getCarSpecification = (trim, model) => async dispatch => {
  const res = await getCarSpecificationApi(trim, model);
  dispatch({
    type: marketPlace.CAR_SPECS_DETAILS,
    payload: res.data
  });
  return res.data;
};

export const getModel = query => async dispatch => {
  dispatch({ type: marketPlace.MODEL_FILTER_REQUEST });
  const res = await getModelApi(
    query && (typeof query === 'object' ? query.value : query)
  );
  dispatch({
    type: marketPlace.MODEL_FILTER,
    payload: res.data
  });
};

export const getAllVehicleData = (bool, token) => dispatch => {
  if (bool) dispatch(push('/market-place/browse-cars/trim_id'));
  return getAllVehicleApi(token).then(resp => {
    dispatch({
      type: marketPlace.GET_ALL_VEHICLE_DATA,
      payload: resp.data
    });
    return resp.data;
  });
};

export const postSearch = (values, token, bool) => dispatch => {
  // if (!bool) {
  //   console.log("enter in bool");
  //   dispatch(
  //     push(
  //       `/shopping/vehicle-search/${values.model}/${values.year}/${values.make}`
  //     )
  //   );
  // }
  return postSearchApi(values, token).then(resp => {
    dispatch({
      type: marketPlace.SEARCH_FILTER_REQUESTED,
      payload: resp.data
    });
    return resp.data;
  });
};

export const getLead = (token, query) => async dispatch => {
  const res = await getLeadApi(token, query);
  dispatch({
    type: marketPlace.LEAD_REQUESTED,
    payload: res.data
  });
  return res.data;
};
export const getContactConfirm = (token, query) => async dispatch => {
  const res = await getContactConfirmApi(token, query);
  dispatch({
    type: marketPlace.CONTACT_CONFIRM,
    payload: res.data
  });
  return res.data;
};

export const findDealerInfo = query => async dispatch => {
  const res = await getDealerInfoApi(query);
  dispatch({
    type: marketPlace.FIND_DEALER_INFO,
    payload: res.data
  });
};

export const getOtherCars = (query, token) => async dispatch => {
  const res = await getOtherCarsApi(query, token);
  dispatch({
    type: marketPlace.SHOPPING_OTHER_CAR,
    payload: res.data
  });
  return res.data;
};

export const getIncentiveData = query => async dispatch => {
  const res = await getIncentiveApi(query);
  dispatch({
    type: marketPlace.GET_INCENTIVE,
    payload: res.data
  });
  return res.data;
};

export const emptyIncentiveData = () => async dispatch => {
  dispatch({
    type: marketPlace.EMPTY_INCENTIVE_DATA
  });
};

export const browseCarData = (query, token) => async dispatch => {
  const res = await getBrowseCarDetailApi(query, token);
  dispatch({
    type: marketPlace.BROWSE_CAR,
    payload: res.data
  });
  return res.data;
};

export const saveVehicle = (
  query,
  token,
  browse_section,
  shop_section
) => async dispatch => {
  const res = await saveVehicleApi(query, token, browse_section, shop_section);
  dispatch({
    type: marketPlace.SAVE_VEHICLE,
    payload: res.data
  });
  return res.data;
};

export const unSaveVehicle = (
  query,
  token,
  browse_section,
  shop_section
) => async dispatch => {
  const res = await unSaveVehicleApi(
    query,
    token,
    browse_section,
    shop_section
  );
  dispatch({
    type: marketPlace.SAVE_VEHICLE,
    payload: res.data
  });
  return res.data;
};

export const getCarDetails = ({
  trim_id,
  body_style_id,
  token,
  redirect,
  color_code = ''
}) => dispatch => {
  dispatch({ type: marketPlace.CAR_DETAILS_REQUEST, query: trim_id });

  return getCarDetailsApi({ query: trim_id, token, color_code }).then(resp => {
    if (redirect) {
      dispatch(
        push('/shopping/vehicle-details/' + trim_id + '/' + body_style_id)
      );
    }
    dispatch({
      type: marketPlace.CAR_DETAILS,
      payload: resp.data
    });
    return resp.data;
  });
};

export const getCarColors = evoxId => async dispatch => {
  dispatch({
    type: marketPlace.CAR_COLORS_REQUEST
  });

  const response = await getCarColorsApi(evoxId);

  dispatch({
    type: marketPlace.CAR_COLORS,
    payload: response.data.data
  });

  return response.data;
};

export const getCBBListing = id => {
  return dispatch => {
    dispatch(push('/cbb-listing/' + id));
  };
};

export const getBrowseCategoryData = (query, id, bool, token) => {
  return dispatch => {
    console.log(bool, 'category bool');
    if (bool) {
      dispatch(push('/market-place/browse-cars/' + query));
    }
    return getBrowseCategoryApi(query, id, token).then(resp => {
      dispatch({
        type: marketPlace.BROWSE_CATEGORY,
        payload: resp.data
      });
      return resp.data;
    });
  };
};

export const getCategoriesDetail = (query, token) => async dispatch => {
  const res = await getCategoriesDetailApi(query, token);
  dispatch({
    type: marketPlace.CATEGORY_DETAIL,
    payload: res.data
  });
  return res.data;
};

export const getSubCategoriesDetail = query => async dispatch => {
  const res = await getSubCategoriesDetailApi(query);
  dispatch({
    type: marketPlace.SUB_CATEGORY_DETAIL,
    payload: res.data
  });
  return res.data;
};

// export const getBrowseCarDetail = (query, bool, token, make, model) => {
//   return dispatch => {
//     if (bool) {
//       dispatch(push(`/market-place/browse-detail/${query}/${make}/${model}`));
//     }
//     return getBrowseDetailApi(query, token).then(resp => {
//       dispatch({
//         type: marketPlace.BROWSE_CAR_DETAIL,
//         payload: resp.data
//       });
//       return resp.data;
//     });
//   };
// };

export const getBrowseCarDetail = (
  query,
  bool,
  token,
  make,
  model
) => async dispatch => {
  dispatch({ type: marketPlace.BROWSE_CAR_DETAIL_REQUEST, query });

  if (bool) {
    dispatch(push(`/market-place/browse-detail/${query}/${make}/${model}`));
  }
  const resp = await getBrowseDetailApi(query, token);
  dispatch({
    type: marketPlace.BROWSE_CAR_DETAIL,
    payload: resp.data.data
  });
  return resp.data.data;
};

// export const getBrowseCarDetail =

export const setIncentivePostalCode = postalCode => {
  postalCode = (postalCode || '').toUpperCase();

  localStorage.setItem('incentivePostalCode', postalCode);

  return {
    type: marketPlace.SET_INCENTIVE_POSTAL_CODE,
    payload: postalCode
  };
};
export const setCarWorthPostalCode = postalCode => {
  postalCode = (postalCode || '').toUpperCase();

  localStorage.setItem('carWorthPostalCode', postalCode);

  return {
    type: marketPlace.SET_CAR_WORTH_POSTAL_CODE,
    payload: postalCode
  };
};

export const setInsurancePostalCode = postalCode => {
  postalCode = (postalCode || '').toUpperCase();

  localStorage.setItem('insurancePostalCode', postalCode);

  return {
    type: marketPlace.SET_INSURANCE_POSTAL_CODE,
    payload: postalCode
  };
};

export const getBrands = () => async dispatch => {
  const resp = await getBrandsApi();
  dispatch({
    type: marketPlace.GET_BRANDS,
    payload: resp.data
  });

  return resp.data;
};
