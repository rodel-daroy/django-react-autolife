import * as template from "../actiontypes/templatePreviewActionTypes";

const initialState = {
  previewData: {},
  loading: true
};

export default (state = initialState, action) => {
  switch (action.type) {
    case template.GET_CMS_TEMPLATE_PREVIEW_REQUEST:
      return {
        ...state,
        loading: true
      };
    case template.GET_CMS_TEMPLATE_PREVIEW_SUCCESSFUL:
      return {
        ...state,
        previewData: action.payload,
        loading: false
      };
    case template.GET_CMS_TEMPLATE_PREVIEW_FAIL:
      return {
        ...state,
        loading: false
      };
    case template.GET_CONTENT_INFO_REQUEST:
      return {
        ...state,
        loading: true
      };
    case template.GET_CONTENT_INFO_SUCCESSFUL:
      return {
        ...state,
        previewData: action.payload,
        loading: false
      };
    case template.GET_CONTENT_INFO_FAIL:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
};
