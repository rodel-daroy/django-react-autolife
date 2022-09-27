import * as carWorth from "../actiontypes/carWorthActionTypes";

const initialState = {
  yearData: null,
  makeData: null,
  modelData: null,
  loading: false,
  styleData: null,
  trimData: null,
  postTradeData: null,
  avgPriceYearData: null,
  avgPriceMakeData: null,
  avgPriceModelData: null,
  avgPriceTrimData: null,
  avgPriceStyleData: null,
  postAvgPriceData: null,
  futureValTrimData: null,
  futureValMakeData: null,
  futureValModelData: null,
  futureValYearData: null,
  futureValStyleData: null,
  postFutureValData: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case carWorth.GET_CAR_WORTH_YEAR:
      return {
        ...state,
        yearData: action.payload,
        loading: false
      };
    case carWorth.GET_CAR_WORTH_AVG_PRICE_YEAR:
      return {
        ...state,
        avgPriceYearData: action.payload,
        loading: false
      };
    case carWorth.GET_CAR_WORTH_AVG_PRICE_MAKE_REQUEST:
      return {
        ...state,
        avgPriceMakeData: null,
        loading: true
      };
    case carWorth.GET_CAR_WORTH_AVG_PRICE_MAKE:
      return {
        ...state,
        avgPriceMakeData: action.payload,
        loading: false
      };
    case carWorth.GET_CAR_WORTH_AVG_PRICE_MODEL_REQUEST:
      return {
        ...state,
        avgPriceModelData: null,
        loading: true
      };
    case carWorth.GET_CAR_WORTH_AVG_PRICE_MODEL:
      return {
        ...state,
        avgPriceModelData: action.payload,
        loading: false
      };
    case carWorth.GET_CAR_WORTH_AVG_PRICE_TRIM:
      return {
        ...state,
        avgPriceTrimData: action.payload,
        loading: false
      };
    case carWorth.GET_CAR_WORTH_AVG_PRICE_STYLE:
      return {
        ...state,
        avgPriceStyleData: action.payload,
        loading: false
      };
    case carWorth.GET_CAR_WORTH_FUTURE_VALUE_YEAR:
      return { ...state, futureValYearData: action.payload, loading: false };
    case carWorth.GET_CAR_WORTH_FUTURE_VALUE_MAKE:
      return {
        ...state,
        futureValMakeData: action.payload,
        loading: false
      };
    case carWorth.GET_CAR_WORTH_FUTURE_VALUE_MODEL:
      return {
        ...state,
        futureValModelData: action.payload,
        loading: false
      };
    case carWorth.GET_CAR_WORTH_FUTURE_VALUE_TRIM:
      return {
        ...state,
        futureValTrimData: action.payload,
        loading: false
      };
    case carWorth.GET_CAR_WORTH_FUTURE_VALUE_STYLE:
      return {
        ...state,
        futureValStyleData: action.payload,
        loading: false
      };
    case carWorth.GET_CAR_WORTH_MODEL:
      return {
        ...state,
        modelData: action.payload,
        loading: false
      };
    case carWorth.GET_CAR_WORTH_MAKE:
      return {
        ...state,
        makeData: action.payload,
        loading: false
      };
    case carWorth.GET_CAR_WORTH_STYLE:
      return {
        ...state,
        styleData: action.payload,
        loading: false
      };
    case carWorth.GET_CAR_WORTH_TRIM:
      return {
        ...state,
        trimData: action.payload,
        loading: false
      };
    case carWorth.TRADE_IN_VALUE_STEP_TWO:
      return {
        ...state,
        postTradeData: action.payload,
        loading: false
      };
    case carWorth.POST_AVG_PRICE_RESULT:
      return {
        ...state,
        postAvgPriceData: action.payload,
        loading: false
      };
    case carWorth.POST_FUTURE_VALUE_RESULT:
      return {
        ...state,
        postFutureValData: action.payload,
        loading: false
      };
    default:
      return state;
  }
};
