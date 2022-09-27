import { 
  UPDATE_ARTICLE_REQUEST, 
  UPDATE_ARTICLE, 
  UPDATE_ARTICLE_FAIL, 
  CREATE_ARTICLE_FAIL, 
  CREATE_ARTICLE, 
  CREATE_ARTICLE_REQUEST, 
  LOAD_ARTICLE_REQUEST,
  LOAD_ARTICLE,
  LOAD_ARTICLE_FAIL,
  LOAD_ARTICLE_LIST_REQUEST,
  LOAD_ARTICLE_LIST,
  LOAD_ARTICLE_LIST_FAIL,
  LOOKUP_ARTICLES_REQUEST,
  LOOKUP_ARTICLES,
  LOOKUP_ARTICLES_FAIL,
  LOOKUP_SPONSORS_REQUEST,
  LOOKUP_SPONSORS_FAIL,
  LOOKUP_SPONSORS
} from "redux/actiontypes/articlesEditActionTypes";
import { 
  postContentSectionApi, 
  postTaggingByIdApi, 
  postPublishingApi, 
  postTaggingApi, 
  getContentDataApi,
  loadPublishedArticles, 
  getSavedTemplateDataApi,
  getSponsorListApi
} from "services/autolife";
import { accessToken } from "redux/selectors/userSelectors";
import get from "lodash/get";
import moment from "moment";

const handleError = api => async (...args) => {
  const response = await api(...args);
  const status = get(response, "data.status", 200);

  if(status !== 200)
    throw new Error(status);
  
  return response;
};

const postContentSection = handleError(postContentSectionApi);
const postTaggingById = handleError(postTaggingByIdApi);
const postTagging = handleError(postTaggingApi);
const postPublishing = handleError(postPublishingApi);
const getContentData = handleError(getContentDataApi);
const getSavedTemplateData = handleError(getSavedTemplateDataApi);
const getSponsorList = handleError(getSponsorListApi);

const newArticle = () => {
  return {
    publishing_state: {
      publish_state: 1,
      do_not_publish_until: null,
      unpublishing_on: null
    },
    template: "Editorial Template",
    template_configuration: {
      spot_A: false,
      spot_B: false,
      author_profile: true,
      rate_of_story: true,
      share_this_story: true,
      related_articles: true,
      secondary_navigation: true,
      Top: true,
      Bottom: true
    },
    article_received_date: null,
    article_publish_date: null
  };
};

const normalizeArticle = article => ({
  ...article,

  content_name: article.content_name || article.headline,
  seo_meta_description: article.synopsis,
  seo_meta_name: article.headline,
  search_keywords: article.seo_keywords,
  article_publish_date: article.article_publish_date || moment().format()
});

const denormalizeArticle = article => ({
  ...article
});

const fetchArticle = async (id, token) => {
  const response = await getContentData(id, token);
  const result = get(response, "data.data");

  if(result)
    return denormalizeArticle(result);

  return null;
};

export const loadArticle = payload => async (dispatch, getState) => {
  const { id } = payload;
  dispatch({ type: LOAD_ARTICLE_REQUEST, payload });

  try {
    const token = accessToken(getState());

    const result = await fetchArticle(id, token);

    dispatch({
      type: LOAD_ARTICLE,
      payload,
      result
    });

    return result;
  }
  catch(error) {
    dispatch({ type: LOAD_ARTICLE_FAIL, payload });
    throw error;
  }
};

export const updateArticle = payload => async (dispatch, getState) => {
  let { id, ...article } = payload;
  
  dispatch({ type: UPDATE_ARTICLE_REQUEST, payload });

  try {
    const token = accessToken(getState());

    article = normalizeArticle(article);

    const taggingParams = {
      tag: article.tag,
      available_in_trends: article.available_in_trends,
      homepage_availability: article.homepage_availability,
      sponsor: article.sponsor
    };
    if(id)
      await postTaggingById(id, taggingParams, token);
    else {
      const response = await postTagging(taggingParams, token);
      id = get(response, "data.data.created");
    }

    const publishingParams = {
      ...article.publishing_state,
      article_publish_date: article.article_publish_date
    };
    await postPublishing(publishingParams, token, id);

    await postContentSection(article, token, id);
    
    const result = await fetchArticle(id, token);

    dispatch({
      type: UPDATE_ARTICLE,
      payload,
      result
    });

    return result;
  }
  catch(error) {
    dispatch({ type: UPDATE_ARTICLE_FAIL });
    throw error;
  }
};

export const createArticle = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: CREATE_ARTICLE_REQUEST
    });

    const result = newArticle();

    dispatch({
      type: CREATE_ARTICLE,
      result
    });

    return result;
  }
  catch(error) {
    dispatch({ type: CREATE_ARTICLE_FAIL });
    throw error;
  }
};

export const loadArticleList = payload => async (dispatch, getState) => {
  try {
    dispatch({
      type: LOAD_ARTICLE_LIST_REQUEST
    });

    const token = accessToken(getState());
    const { data: result } = await loadPublishedArticles(token, payload);

    dispatch({
      type: LOAD_ARTICLE_LIST,
      result,
      payload
    });

    return result;
  }
  catch(error) {
    dispatch({ type: LOAD_ARTICLE_LIST_FAIL });
    throw error;
  }
};

export const lookupArticles = ({ ids }) => async (dispatch, getState) => {
  try {
    dispatch({
      type: LOOKUP_ARTICLES_REQUEST
    });

    const token = accessToken(getState());

    const promises = ids.map(id => getSavedTemplateData(token, id));
    const results = await Promise.all(promises);
    const result = [...results.map(response => response.data.data)];

    dispatch({
      type: LOOKUP_ARTICLES,
      result,
      payload: { ids }
    });
  }
  catch(error) {
    dispatch({ type: LOOKUP_ARTICLES_FAIL });
    throw error;
  }
};

export const lookupSponsors = () => async (dispatch, getState) => {
  try {
    dispatch({ type: LOOKUP_SPONSORS_REQUEST });

    const token = accessToken(getState());

    const response = await getSponsorList(token);
    const result = response.data.data;

    dispatch({
      type: LOOKUP_SPONSORS,
      result
    });
  }
  catch(error) {
    dispatch({ type: LOOKUP_SPONSORS_FAIL });
    throw error;
  }
};