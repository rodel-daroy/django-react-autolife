import * as CMSCar from "../actiontypes/CMSCarBandSectionActionTypes";

const initialState = {
  manufactureList: null,
  modelList: null,
  makeList: null,
  modelYearList: null,
  FormatManufactureList: {},
  FormatModelList: {},
  FormatModelYearList: {},
  FormatMakeList: {},
  loading: false
};
/** get car manufacturer list action* */
export default (state = initialState, action) => {
  switch (action.type) {
    case CMSCar.MANUFACTURER_LIST:
      return {
        ...state,
        loading: true
      };
    case CMSCar.MANUFACTURER_LIST_REQUESTED_SUCCESSFUL:
      return {
        ...state,
        manufactureList: action.payload.data,
        FormatManufactureList: action.payload.formatData,
        makeList: null,
        FormatMakeList: {},
        modelList: null,
        FormatModelList: {},
        modelYearList: null,
        FormatModelYearList: {},
        loading: false
      };
    case CMSCar.MANUFACTURER_LIST_REQUESTED_FAIL:
      return {
        ...state,
        loading: false
      };

    /** get car make list action* */

    case CMSCar.MAKE_LIST:
      return {
        ...state,
        loading: true
      };
    case CMSCar.MAKE_LIST_REQUESTED_SUCCESSFUL:
      return {
        ...state,
        makeList: action.payload.data,
        FormatMakeList: action.payload.formatData,
        modelList: null,
        FormatModelList: {},
        modelYearList: null,
        FormatModelYearList: {},
        loading: false
      };
    case CMSCar.MAKE_LIST_REQUESTED_FAIL:
      return {
        ...state,
        loading: false
      };

    /** get car model list action* */

    case CMSCar.MODEL_LIST:
      return {
        ...state,
        loading: true
      };
    case CMSCar.MODEL_LIST_REQUESTED_SUCCESSFUL:
      return {
        ...state,
        modelList: action.payload.data,
        FormatModelList: action.payload.formatData,
        loading: false,
        modelYearList: null,
        FormatModelYearList: {}
      };
    case CMSCar.MODEL_LIST_REQUESTED_FAIL:
      return {
        ...state,
        loading: false
      };
    /** get car model year list action* */
    case CMSCar.YEAR_LIST:
      return {
        ...state,
        loading: true
      };
    case CMSCar.YEAR_LIST_REQUESTED_SUCCESSFUL:
      return {
        ...state,
        modelYearList: action.payload.data,
        FormatModelYearList: action.payload.formatData,
        loading: false
      };
    case CMSCar.YEAR_LIST_REQUESTED_FAIL:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
};
