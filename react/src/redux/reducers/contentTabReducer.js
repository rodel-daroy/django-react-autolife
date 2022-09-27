import * as contentDetail from "../actiontypes/contentTabActionTypes";

const initialState = {
  partnerList: null,
  templateList: null,
  assetNameList: null,
  templateLocationList: null,
  loading: false,
  FormatAssetNameList: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case contentDetail.ASSET_LIST_REQUESTED_FAIL:
    case contentDetail.PARTNER_LIST_REQUESTED_FAIL:
    case contentDetail.TEMPLATE_LIST_REQUESTED_FAIL:
    case contentDetail.TEMPLATE_LOCATION_LIST_REQUESTED_FAIL:
      return {
        ...state,
        loading: false
      };
    case contentDetail.TEMPLATE_LIST:
    case contentDetail.PARTNER_LIST:
    case contentDetail.ASSET_LIST:
    case contentDetail.TEMPLATE_LOCATION_LIST:
      return {
        ...state,
        loading: true
      };
    case contentDetail.PARTNER_LIST_REQUESTED_SUCCESSFUL:
      return {
        ...state,
        partnerList: action.payload,
        loading: false
      };
    case contentDetail.TEMPLATE_LIST_REQUESTED_SUCCESSFUL:
      return {
        ...state,
        templateList: action.payload,
        loading: false
      };
    case contentDetail.TEMPLATE_LOCATION_LIST_REQUESTED_SUCCESSFUL:
      return {
        ...state,
        templateLocationList: action.payload,
        loading: false
      };
    case contentDetail.ASSET_LIST_REQUESTED_SUCCESSFUL:
      return {
        ...state,
        assetNameList: action.payload.data,
        FormatAssetNameList: action.payload.formatData,
        loading: false
      };
    default:
      return state;
  }
};
