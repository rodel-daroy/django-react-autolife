import * as template from "../actiontypes/CMSTemplateListingViewActionTypes";

const initialState = {
  templateList: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case template.GET_CMS_TEMPLATE_LIST_REQUEST:
      return {
        ...state,
        loading: true
      };
    case template.GET_CMS_TEMPLATE_LIST_SUCCESSFUL:
      return {
        ...state,
        templateList: action.payload,
        loading: false
      };
    case template.GET_CMS_TEMPLATE_LIST_FAIL:
      return {
        ...state,
        loading: false
      };
    case template.DELETE_CMS_TEMPLATE_REQUEST:
      return {
        ...state,
        loading: true
      };
    case template.DELETE_CMS_TEMPLATE_SUCCESSFUL:
      return {
        ...state,
        loading: false
      };
    case template.DELETE_CMS_TEMPLATE_FAIL:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
};
