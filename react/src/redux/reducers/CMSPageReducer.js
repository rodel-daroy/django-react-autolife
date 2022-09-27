import * as cms from "../actiontypes/CMSPageActionTypes";

const initialState = {
  tagging: [],
  loading: false,
  submitData: [],
  contentPublishOptions: [],
  campaigns: [],
  contentData: [],
  successMsg: false,
  contentData: {},
  publishArticles: [],
  adData: [],
  sponsorData: [],
  submitTag: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case cms.GET_Publish_Article_FAIL:
    case cms.POST_CMS_PAGE_TAG_FAIL:
    case cms.POST_SPONSOR_FAIL:
    case cms.POST_AD_FAIL:
    case cms.GET_CONTENT_OPTIONS_FAIL:
    case cms.POST_CMS_PAGE_PUBLISH_SETTINGS_FAIL:
    case cms.POST_CMS_PAGE_TAG_BY_ID_FAIL:
    case cms.GET_CONTENT_GET_FAIL:
    case cms.GET_CMS_PAGE_FAIL:
      return {
        ...state,
        loading: false
      };
    case cms.GET_Publish_Article_SUCCESSFUL:
      return {
        ...state,
        publishArticles: action.payload,
        loading: false
      };
    case cms.GET_Publish_Article_REQUEST:
    case cms.POST_SPONSOR_REQUEST:
    case cms.POST_AD_REQUEST:
    case cms.GET_CONTENT_OPTIONS_REQUEST:
    case cms.POST_CMS_PAGE_TAG_BY_ID_REQUEST:
    case cms.POST_CMS_PAGE_TAG_REQUEST:
    case cms.GET_CONTENT_GET_REQUEST:
    case cms.GET_CMS_PAGE_REQUEST:
      return {
        ...state,
        loading: true
      };
    case cms.GET_CONTENT_GET_SUCCESSFUL:
      return {
        ...state,
        contentData: action.payload,
        loading: false
      };
    case cms.GET_CMS_PAGE_SUCCESSFUL:
      return {
        ...state,
        tagging: action.payload,
        loading: false
      };
    case cms.POST_CMS_PAGE_CONTENT_SECTION_SUCCESSFUL:
      return {
        ...state,
        successMsg: true,
        loading: false
      };
    case cms.POST_SPONSOR_SUCCESSFULL:
      return {
        ...state,
        sponsorData: action.payload,
        loading: false
      };
    case cms.POST_AD_SUCCESSFULL:
      return {
        ...state,
        adData: action.payload,
        loading: false
      };
    case cms.GET_CONTENT_OPTIONS_SUCCESSFUL:
      return {
        ...state,
        contentPublishOptions: action.payload,
        loading: false
      };
    case cms.POST_CMS_PAGE_PUBLISH_SETTINGS_REQUEST:
      return {
        ...state,
        loading: true
      };
    case cms.POST_CMS_PAGE_PUBLISH_SETTINGS_SUCCESSFUL:
      return {
        ...state,
        submitData: action.payload,
        loading: false
      };
      return {
        ...state,
        loading: true
      };
    case cms.POST_CMS_PAGE_TAG_BY_ID_SUCCESSFUL:
      return {
        ...state,
        submitTag: action.payload,
        loading: false
      };
    case cms.POST_CMS_PAGE_TAG_SUCCESSFUL:
      return {
        ...state,
        submitData: action.payload,
        loading: false
      };
    default:
      return state;
  }
};
