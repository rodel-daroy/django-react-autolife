import * as insurance from "../actiontypes/insuranceActionTypes";

const initialState = {
  insuranceData: null,
  loadingInsuranceData: false,
  makes: null,
  years: null,
  models: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case insurance.GET_INSURANCE_QUOTE_REQUESTED:
      return {
        ...state,
        loadingInsuranceData: true
      };
    case insurance.GET_INSURANCE_QUOTE_SUCCESSFUL:
      return {
        ...state,
        insuranceData: action.payload.data,
        insuranceStatus: action.payload.status,
        loadingInsuranceData: false
      };
    case insurance.GET_INSURANCE_QUOTE_FAIL:
      return {
        ...state,
        loadingInsuranceData: false
      };
    case insurance.GET_YEAR_LIST_REQUESTED:
      return {
        ...state,
        loading: true
      };
    case insurance.GET_YEAR_LIST_FAIL:
      return {
        ...state,
        loading: false
      };
    case insurance.GET_YEAR_LIST_SUCCESSFUL:
      return {
        ...state,
        years: action.payload,
        loading: false
      };
    case insurance.GET_MAKE_LIST_REQUESTED:
      return {
        ...state,
        loading: true
      };
    case insurance.GET_MAKE_LIST_FAIL:
      return {
        ...state,
        loading: false
      };
    case insurance.GET_MAKE_LIST_SUCCESSFUL:
      return {
        ...state,
        makes: action.payload,
        loading: false
      };
    case insurance.GET_MODEL_LIST_REQUESTED:
      return {
        ...state,
        loading: true
      };
    case insurance.GET_MODEL_LIST_SUCCESSFUL:
      return {
        ...state,
        models: action.payload,
        loading: false
      };
    case insurance.GET_MODEL_LIST_FAIL:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
};
