import {
  getTaggingApi,
  postTaggingApi,
  postPublishingApi,
  postContentSectionApi,
  getContentDataApi,
  getContentOptionsApi,
  postAdDataApi,
  deleteAdDataApi,
  postNewSponsorApi,
  postTaggingByIdApi,
  getPublishArticleApi
} from '../../services/autolife';
import { push } from 'react-router-redux';
import { toast } from 'react-toastify';
import * as cmsPage from '../actiontypes/CMSPageActionTypes';

/**
 * Post tags
 */
export const postTagDataSuccess = response => {
  return {
    type: cmsPage.POST_CMS_PAGE_TAG_SUCCESSFUL,
    payload: response.data
  };
};

export const postTagDataFail = error => {
  return {
    type: cmsPage.POST_CMS_PAGE_TAG_FAIL
  };
};

export const postTagData = (data, token) => {
  return dispatch => {
    dispatch({
      type: cmsPage.POST_CMS_PAGE_TAG_REQUEST
    });
    return postTaggingApi(data, token)
      .then(resp => {
        dispatch(postTagDataSuccess(resp.data));
        return resp.data;
      })
      .catch(error => dispatch(postTagDataFail(error)));
  };
};

/**
 * Post tags
 */
export const postTagDatabyIdSuccess = response => {
  return {
    type: cmsPage.POST_CMS_PAGE_TAG_BY_ID_SUCCESSFUL,
    payload: response.data
  };
};

export const postTagDatabyIdFail = error => {
  return {
    type: cmsPage.POST_CMS_PAGE_TAG_BY_ID_FAIL
  };
};

export const postTagDataById = (id, data, token) => {
  return dispatch => {
    dispatch({
      type: cmsPage.POST_CMS_PAGE_TAG_BY_ID_REQUEST
    });
    return postTaggingByIdApi(id, data, token)
      .then(resp => {
        dispatch(postTagDatabyIdSuccess(resp.data));
        return resp.data;
      })
      .catch(error => dispatch(postTagDatabyIdFail(error)));
  };
};

/**
 * delete ads
 */
export const postAdDetete = (id, token) => {
  return dispatch => {
    dispatch({
      type: cmsPage.POST_AD_REQUEST
    });
    return deleteAdDataApi(id, token)
      .then(resp => {
        dispatch(postAdDataSuccess(resp.data));
        return resp.data;
      })
      .catch(error => dispatch(postAdDataFail(error)));
  };
};

/**
 * Post Ad
 */

export const postAdDataSuccess = response => {
  return {
    type: cmsPage.POST_AD_SUCCESSFULL,
    payload: response.data
  };
};

export const postAdDataFail = error => {
  return {
    type: cmsPage.POST_AD_FAIL
  };
};

export const postAdData = (id, data, token) => {
  return dispatch => {
    dispatch({
      type: cmsPage.POST_AD_REQUEST
    });
    return postAdDataApi(id, data, token)
      .then(resp => {
        dispatch(postAdDataSuccess(resp.data));
        return resp.data;
      })
      .catch(error => dispatch(postAdDataFail(error)));
  };
};

/**
 * Post Sponsor
 */

export const postSponsorDataSuccess = response => {
  return {
    type: cmsPage.POST_SPONSOR_SUCCESSFULL,
    payload: response.data
  };
};

export const postSponsorDataFail = error => {
  return {
    type: cmsPage.POST_SPONSOR_FAIL
  };
};

export const postNewSponsor = (data, token) => {
  return dispatch => {
    dispatch({
      type: cmsPage.POST_SPONSOR_REQUEST
    });
    return postNewSponsorApi(data, token)
      .then(resp => {
        dispatch(postSponsorDataSuccess(resp.data));
        return resp.data;
      })
      .catch(error => dispatch(postSponsorDataFail(error)));
  };
};

/**
 * Post publish settings
 */
export const postPublishSettingsSuccess = response => {
  return {
    type: cmsPage.POST_CMS_PAGE_PUBLISH_SETTINGS_SUCCESSFUL,
    payload: response.data
  };
};

export const postPublishSettingsFail = error => {
  return {
    type: cmsPage.POST_CMS_PAGE_PUBLISH_SETTINGS_FAIL
  };
};

export const postPublishSettings = (data, token, id) => {
  return dispatch => {
    dispatch({
      type: cmsPage.POST_CMS_PAGE_PUBLISH_SETTINGS_REQUEST
    });
    return postPublishingApi(data, token, id)
      .then(resp => dispatch(postPublishSettingsSuccess(resp.data)))
      .catch(error => dispatch(postPublishSettingsFail(error)));
  };
};

export const getContentOptionsSucess = data => {
  return {
    type: cmsPage.GET_CONTENT_OPTIONS_SUCCESSFUL,
    payload: data.data
  };
};

export const getContentOptionsFail = error => {
  return {
    type: cmsPage.GET_CONTENT_OPTIONS_FAIL
  };
};
export const getPublishingState = token => {
  return dispatch => {
    dispatch({
      type: cmsPage.GET_CONTENT_OPTIONS_REQUEST
    });
    return getContentOptionsApi(token)
      .then(resp => dispatch(getContentOptionsSucess(resp.data)))
      .catch(error => dispatch(getContentOptionsFail(error)));
  };
};

/* post content section */
export const postContentSectionSuccess = response => {
  return {
    type: cmsPage.POST_CMS_PAGE_CONTENT_SECTION_SUCCESSFUL,
    payload: response.data
  };
};

export const postContentSectionFail = error => {
  return {
    type: cmsPage.POST_CMS_PAGE_CONTENT_SECTION_FAIL,
    error: error.data
  };
};

export const postContentSection = (data, token, id, selectedBtn) => {
  return dispatch => {
    dispatch({
      type: cmsPage.POST_CMS_PAGE_CONTENT_SECTION_REQUEST
    });
    return postContentSectionApi(data, token, id)
      .then(resp => {
        if (selectedBtn === 'Update') {
          toast.success('A content article has been created successfully', {
            position: toast.POSITION.BOTTOM_RIGHT
          });
        } else {
          dispatch(push('content/preview/' + id));
        }

        dispatch(postContentSectionSuccess(resp.data));
      })
      .catch(error => {
        toast.error(error.data.data.error, {
          position: toast.POSITION.BOTTOM_RIGHT
        });

        dispatch(postContentSectionFail(error));
      });
  };
};

export const getTaggingSuccess = resp => {
  return {
    type: cmsPage.GET_CMS_PAGE_SUCCESSFUL,
    payload: resp.data
  };
};

export const getTaggingFail = error => {
  return {
    type: cmsPage.GET_CMS_PAGE_FAIL
  };
};
export const getTagging = token => {
  return dispatch => {
    dispatch({
      type: cmsPage.GET_CMS_PAGE_REQUEST
    });
    return getTaggingApi(token)
      .then(resp => dispatch(getTaggingSuccess(resp.data)))
      .catch(error => dispatch(getTaggingFail(error)));
  };
};
/** getContentDataApi
 * @returns {function(*)}
 */
export const getContentDataApiSuccess = data => {
  return {
    type: cmsPage.GET_CONTENT_GET_SUCCESSFUL,
    payload: data.data
  };
};

export const getContentDataApiFail = error => {
  return {
    type: cmsPage.GET_CONTENT_GET_FAIL
  };
};
export const getContentData = (contentId, token) => {
  return dispatch => {
    dispatch({
      type: cmsPage.GET_CONTENT_GET_REQUEST
    });
    return getContentDataApi(contentId, token)
      .then(resp => dispatch(getContentDataApiSuccess(resp.data)))
      .catch(error => dispatch(getContentDataApiFail(error)));
  };
};
/** getPublishArticleApi
 * @returns {function(*)}
 */
export const getPublishArticleApiSuccess = data => {
  return {
    type: cmsPage.GET_Publish_Article_SUCCESSFUL,
    payload: data.data
  };
};

export const getPublishArticleApiFail = error => {
  return {
    type: cmsPage.GET_Publish_Article_FAIL
  };
};
export const getPublishArticle = (contentId, token) => {
  return dispatch => {
    dispatch({
      type: cmsPage.GET_Publish_Article_REQUEST
    });
    return getPublishArticleApi(contentId, token)
      .then(resp => dispatch(getPublishArticleApiSuccess(resp.data)))
      .catch(error => dispatch(getPublishArticleApiFail(error)));
  };
};

// export const publishContentOptions = () => {
//   return dispatch => {
//     dispatch({
//       type: cmsPage.GET_CONTENT_OPTIONS,
//       payload: [
//         { id: "unpublished", name: "Unpublished" },
//         { id: "drafted", name: "Drafted" },
//         { id: "Published", name: "Published" }
//       ]
//     });
//   };
// };
export const redirectEdit = data => {
  console.log(data.data.created, 'action-data');
  return dispatch => {
    dispatch(push(`page/${data.data.created}`));
  };
};
