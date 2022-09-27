import * as editorialCms from "../actiontypes/editorialCmsActiontypes";

const initialState = {
  countryList: [],
  stateList: [],
  cityList: [],
  loading: false,
  sponsorList: [],
  campaignList: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case editorialCms.CAMPAIGN_LIST_REQUESTED_FAIL:
    case editorialCms.SPONSOR_LIST_REQUESTED_FAIL:
    case editorialCms.CITY_LIST_REQUESTED_FAIL:
    case editorialCms.STATE_LIST_REQUESTED_FAIL:
    case editorialCms.COUNTRY_LIST_REQUESTED_FAIL:
      return {
        ...state,
        loading: false
      };
    case editorialCms.CAMPAIGN_LIST:
    case editorialCms.SPONSOR_LIST:
    case editorialCms.CITY_LIST:
    case editorialCms.STATE_LIST:
    case editorialCms.COUNTRY_LIST:
      return {
        ...state,
        loading: true
      };
    case editorialCms.CAMPAIGN_LIST_REQUESTED_SUCCESSFUL:
      return {
        ...state,
        campaignList: action.payload,
        loading: false
      };
    case editorialCms.SPONSOR_LIST_REQUESTED_SUCCESSFUL:
      return {
        ...state,
        sponsorList: action.payload,
        loading: false
      };
    case editorialCms.CITY_LIST_REQUESTED_SUCCESSFUL:
      return {
        ...state,
        cityList: action.payload,
        loading: false
      };
    case editorialCms.STATE_LIST_REQUESTED_SUCCESSFUL:
      return {
        ...state,
        stateList: action.payload,
        loading: false
      };
    case editorialCms.COUNTRY_LIST_REQUESTED_SUCCESSFUL:
      return {
        ...state,
        countryList: action.payload,
        loading: false
      };
    default:
      return state;
  }
};
