import * as editorial from "../actiontypes/editorialActionTypes";

const initialState = {
  previewData: {},
  loading: true
};

export default (state = initialState, action) => {
  switch (action.type) {
    case editorial.GET_CONTENT_INFO_REQUEST:
      return {
        ...state,
        loading: true
      };
    case editorial.GET_CMS_TEMPLATE_PREVIEW:
    case editorial.GET_CONTENT_INFO:
      return {
        ...state,
        previewData: action.payload,
        loading: false
      };
    default:
      return state;
  }
};
