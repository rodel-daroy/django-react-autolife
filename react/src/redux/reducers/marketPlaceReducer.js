import * as marketPlace from "../actiontypes/marketPlacetypes";

const initialState = {
  makes: null,
  model: null,
  loading: false,
  leadData: null,
  contactData: null,
  searchData: null,
  carDetails: {},
  carSpecs: null,
  otherCars: null,
  dealerData: null,
  incentiveData: null,
  browseData: null,
  saveData: null,
  unSaveData: null,
  categoriesData: null,
  categoriesDetail: null,
  subCategoriesDetail: null,
  carDetailData: null,
  similarVehicle: null,
  incentivePostalCode: (
    localStorage.getItem("incentivePostalCode") || ""
  ).toUpperCase(),
  insurancePostalCode: (
    localStorage.getItem("insurancePostalCode") || ""
  ).toUpperCase(),
  carWorthPostalCode: (
    localStorage.getItem("carWorthPostalCode") || ""
  ).toUpperCase(),
  loadingCarDetail: false,
  loadingBrowseCarDetail: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case marketPlace.MAKE_FILTER_REQUEST:
      return {
        ...state,
        makes: null,
        loading: true
      };
    case marketPlace.MAKE_FILTER:
      return {
        ...state,
        makes: action.payload,
        loading: false
      };
    case marketPlace.GET_SIMILAR_VEHILCE:
      return {
        ...state,
        similarVehicle: action.payload,
        loading: false
      };
    case marketPlace.GET_ALL_VEHICLE_DATA:
      return {
        ...state,
        categoriesData: action.payload,
        loading: false
      };
    case marketPlace.CAR_SPECS_DETAILS:
      return {
        ...state,
        carSpecs: action.payload,
        loading: false
      };
    case marketPlace.MODEL_FILTER_REQUEST:
      return {
        ...state,
        model: null,
        loading: true
      };
    case marketPlace.MODEL_FILTER:
      return {
        ...state,
        model: action.payload,
        loading: false
      };
    case marketPlace.SEARCH_FILTER_REQUESTED:
      return {
        ...state,
        searchData: action.payload,
        loading: false
      };
    case marketPlace.LEAD_REQUESTED:
      return {
        ...state,
        leadData: action.payload,
        loading: false
      };
    case marketPlace.CONTACT_CONFIRM:
      return {
        ...state,
        contactData: action.payload,
        loading: false
      };
    case marketPlace.BROWSE_CAR:
      return {
        ...state,
        browseData: action.payload,
        loading: false
      };
    case marketPlace.SAVE_VEHICLE:
      return {
        ...state,
        saveData: action.payload,
        loading: false
      };
    case marketPlace.UNSAVE_VEHICLE:
      return {
        ...state,
        unSaveData: action.payload,
        loading: false
      };
    case marketPlace.FIND_DEALER_INFO:
      return {
        ...state,
        dealerData: action.payload,
        loading: false
      };
    case marketPlace.SHOPPING_OTHER_CAR:
      return {
        ...state,
        otherCars: action.payload,
        loading: false
      };
    case marketPlace.GET_INCENTIVE:
      return {
        ...state,
        incentiveData: action.payload,
        loading: false
      };
    case marketPlace.CAR_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        loadingCarDetail: action.query != state.carDetailQuery,
        carDetailQuery: action.query
      };
    case marketPlace.CAR_DETAILS:
      return {
        ...state,
        carDetails: action.payload,
        loading: false,
        loadingCarDetail: false
      };
    case marketPlace.EMPTY_CAR_DETAILS:
      return {
        carDetails: null
      };
    case marketPlace.BROWSE_CATEGORY:
      return {
        ...state,
        categoriesData: action.payload
      };
    case marketPlace.CATEGORY_DETAIL:
      return {
        ...state,
        categoriesDetail: action.payload,
        loading: false
      };
    case marketPlace.SUB_CATEGORY_DETAIL:
      return {
        ...state,
        subCategoriesDetail: action.payload,
        loading: false
      };
    case marketPlace.BROWSE_CAR_DETAIL_REQUEST:
      return {
        ...state,

        loading: true,
        loadingBrowseCarDetail: state.browseCarDetailQuery != action.query,
        browseCarDetailQuery: action.query
      };
    case marketPlace.BROWSE_CAR_DETAIL:
      return {
        ...state,
        carDetailData: action.payload,
        loading: false,
        loadingBrowseCarDetail: false
      };
    case marketPlace.SET_INCENTIVE_POSTAL_CODE:
      return {
        ...state,
        incentivePostalCode: action.payload
      };
    case marketPlace.SET_CAR_WORTH_POSTAL_CODE:
      return {
        ...state,
        carWorthPostalCode: action.payload
      };
    case marketPlace.SET_INSURANCE_POSTAL_CODE:
      return {
        ...state,
        insurancePostalCode: action.payload
      };
    case marketPlace.EMPTY_INCENTIVE_DATA:
      return {
        ...state,
        incentiveData: null
      };
    case marketPlace.GET_BRANDS:
      return {
        ...state,
        brands: action.payload
      };
    case marketPlace.CAR_COLORS:
      return {
        ...state,
        carColors: action.payload
      };

    default:
      return state;
  }
};
