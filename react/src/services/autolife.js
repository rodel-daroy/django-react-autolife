import axios from 'axios';
import Config from '../config';
import store from '../redux/store';
import { convertToServerTimeZone } from '../utils/format';
import { logoutUser } from 'redux/actions/userActions';
import { logError } from 'redux/actions/commonActions';
import { configData } from '../routes/CMSPage/config';
import castArray from 'lodash/castArray';

const client = axios.create({
  baseURL: Config.API
});
client.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logoutUser());
      localStorage.clear();
      // store.dispatch(unAuthorized());
    }

    store.dispatch(logError(error));

    return Promise.reject(error.response);
  }
);

const apiKey = '69d0da8b5fbdff7f7e8409f004ffc0e9-us17';

/** Sign up user * */
export const userSignup = params => client.post('/user/register/', params);

/* Logout User */
export const userSignoutApi = token => {
  if (token !== undefined) {
    return client.post('/user/logout/', null, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `AL ${token}`
      }
    });
  }
};

/** Post Polls data * */
export const postPollsDataApi = (id, params) =>
  client.post(`/ui_controllers/polls/${id}/`, params);

export const getSubscribedApi = params => client.post('/subscribe/', params);

export const getSubscribeMonthlyApi = params =>
  client.post('/monthly_news_digest_subscribe/', params);

/** Sign up user * */
export const postContactDataApi = params =>
  client.post('/user/contact/', params);
/** Get Question api * */
export const getQuestionsApi = params =>
  client.post('/soft_registration/next_question/', params);

/** post reset password api * */
export const postResetPasswordApi = params =>
  client.post('/user/forgot_password/', params);

/** post update password api * */
export const postUpdatePasswordApi = params =>
  client.post('/user/reset_password/', params);

/** Get brands api * */
export const getBrandsApi = params => client.get('/vehicles/make/', params);

/** Get brands api * */
export const getSimilarVehicleApi = (query, token) => {
  if (token !== undefined) {
    return client.get(`/vehicles/similar/${query}/`, {
      headers: {
        Authorization: `AL ${token}`
      }
    });
  }
  return client.get(`/vehicles/similar/${query}/`);
};

/** post trade in value api * */
export const postTradeInValueStepTwoApi = (params, token) => {
  if (token !== undefined) {
    return client.post('/marketplace/trade_in_results/', params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `AL ${token}`
      }
    });
  }
  return client.post('/marketplace/trade_in_results/', params);
};

export const verifyUserTokenApi = params =>
  client.post('/user/verify/', params);

export const refreshUserTokenApi = params =>
  client.post('/user/refresh/', params);

/** post avg asking result api * */
export const postAvgAskingResultsApi = (params, token) => {
  if (token !== undefined) {
    return client.post('/marketplace/avg_asking_results/', params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `AL ${token}`
      }
    });
  }
  return client.post('/marketplace/avg_asking_results/', params);
};

/** post avg asking result api * */
export const postFutureValueResultsApi = (params, token) => {
  if (token !== undefined) {
    return client.post('/marketplace/future_value_results/', params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `AL ${token}`
      }
    });
  }
  return client.post('/marketplace/future_value_results/', params);
};

/** Get lifestyle api * */
export const getLifeStyleApi = params => client.get('/tags/lifestyle/', params);

/** Get offers api * */
export const getOffersApi = params =>
  client.get('/marketplace/offers/', params);

export const getVersionNumerApi = () => client.get('/get_version/');

/** Get offers api * */
export const getBrowseDetailApi = (category_id, token) => {
  if (token != undefined) {
    return client.get(`/vehicles/details/${category_id}/`, {
      headers: { Authorization: 'AL ' + token }
    });
  }
  return client.get(`/vehicles/details/${category_id}/`);
};

/** Get news Data api * */
export const getTrendsDataApi = token => {
  if (token != undefined) {
    return client.get('/content_manager/news/', {
      headers: { Authorization: 'AL ' + token }
    });
  }
  return client.get('/content_manager/news/');
};

/** Get news Data api * */
export const getUserRelatedDataApi = token => {
  if (token != undefined) {
    return client.get('/content_manager/user_related/', {
      headers: { Authorization: `AL ${token}` }
    });
  }
};

/** Get news Data api * */
export const getAllTrendsDataApi = (token, id, bool) => {
  if (token != undefined && bool) {
    return client.get('/content_manager/news_section/', {
      params: {
        mapping_id: id,
        user_related: 1
      },
      headers: { Authorization: 'AL ' + token }
    });
  } else if (token != undefined && !bool) {
    return client.get('/content_manager/news_section/', {
      params: {
        mapping_id: id
      },
      headers: { Authorization: 'AL ' + token }
    });
  }

  return client.get('/content_manager/news_section/', {
    params: {
      mapping_id: id
    }
  });
};

export const getSearchApi = serchTerm => {
  return client.get('/content_manager/newsearch', {
    params: {
      keyword: serchTerm
    }
  });
};

/** Post save car api * */
export const saveVehicleApi = (query, token, browse_sec, shop_sec) => {
  const browseParams = { browse_section: 1 };
  const shoppingParams = { shop_section: 1 };
  let submitParams;
  if (browse_sec) {
    submitParams = browseParams;
  } else if (shop_sec) {
    submitParams = shoppingParams;
  }
  if (browse_sec || shop_sec) {
    return client.post('/user/save_car/' + query + '/', submitParams, {
      headers: { Authorization: 'AL ' + token }
    });
  }

  return client.post(
    `/user/save_car/${query}/`,
    {},
    {
      headers: { Authorization: 'AL ' + token }
    }
  );
};

/** Post like article api * */
export const articleLikedApi = (token, query) => {
  if (token != undefined) {
    const params = { content_id: query };
    return client.post('/content_manager/content_like/', params, {
      headers: { Authorization: `AL ${token}` }
    });
  }
};

export const articleDislikedApi = (token, query) => {
  if (token != undefined) {
    const params = { content_id: query };
    return client.post('/content_manager/content_dislike/', params, {
      headers: { Authorization: `AL ${token}` }
    });
  }
};

/** Post un save car api * */
export const unSaveVehicleApi = (query, token, browse_sec, shop_sec) => {
  const browseParams = { browse_section: 1 };
  const shoppingParams = { shop_section: 1 };
  let submitParams;
  if (browse_sec) {
    submitParams = browseParams;
  } else if (shop_sec) {
    submitParams = shoppingParams;
  }
  if (browse_sec || shop_sec) {
    return client.post('/user/remove_saved_cars/' + query + '/', submitParams, {
      headers: { Authorization: 'AL ' + token }
    });
  }
  return client.post(
    `/user/remove_saved_cars/${query}/`,
    {},
    {
      headers: { Authorization: 'AL ' + token }
    }
  );
};
/** Get social login api * */
export const socialLoginApi = params =>
  client.post('/user/social_login/', params);

/** Post Lead api * */
export const getLeadApi = (params, token) => {
  if (token != undefined) {
    return client.post('/marketplace/sci_lead_post/', params, {
      headers: { Authorization: 'AL ' + token }
    });
  }
  return client.post('/marketplace/sci_lead_post/', params);
};
/** Email send Signup for newsLetter*/
export const getContactConfirmApi = (params, token) => {
  if (token != undefined) {
    return client.post('/marketplace/contact_confirm/', params, {
      headers: { Authorization: 'AL ' + token }
    });
  }
  return client.post('/marketplace/contact_confirm/', params);
};

/** get browse car data by categories data* */
export const getBrowseCategoryApi = (id, sub_category_id, token) => {
  if (sub_category_id == undefined && token != undefined) {
    return client.get(`/vehicles/category/${id}/`, {
      headers: { Authorization: `AL ${token}` }
    });
  } else if (token != undefined) {
    return client.get(`/vehicles/category/${id}/`, {
      params: {
        sub_category_id
      },
      headers: { Authorization: `AL ${token}` }
    });
  } else if (token == undefined) {
    return client.get(`/vehicles/category/${id}/`, {
      params: {
        sub_category_id
      }
    });
  }
};

/** get sub categories data* */
export const getSubCategoriesDetailApi = (id, params, token) =>
  client.get(`/vehicles/category/${id}/`);

/** get sub categories data* */
export const getAllVehicleApi = token => {
  if (token != undefined) {
    return client.get('/vehicles/uncategorized/', {
      headers: { Authorization: 'AL ' + token }
    });
  }
  return client.get('/vehicles/uncategorized/');
};

/** get categories detail* */
export const getCategoriesDetailApi = (id, token) => {
  if (id == undefined && token != undefined) {
    return client.get('/vehicles/sub_categories/', {
      headers: { Authorization: 'AL ' + token }
    });
  } else if (token == undefined) {
    return client.get('/vehicles/sub_categories/' + id + '/');
  }
  return client.get(`/vehicles/sub_categories/${id}/`, {
    headers: { Authorization: 'AL ' + token }
  });
};

/** get Incentive api * */
export const getIncentiveApi = params =>
  client.get('/marketplace/unhaggle_incentives/', {
    params: {
      postal_code: params.postal_code,
      uid: params.uid,
      year: params.year
    }
  });

/** Login user api * */
export const postLoginApi = params => client.post('/user/login/', params);

/** insurance api * */
export const getInsuranceQuoteApi = (params, token) => {
  if (token !== undefined) {
    return client.post('/marketplace/get_insurance_quote/', params, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `AL ${token}`
      }
    });
  }
  return client.post('/marketplace/get_insurance_quote/', params);
};

/** post tag data* */
export const postTaggingApi = (params, token) =>
  client.post('/content_manager/tagging/', params, {
    headers: { Authorization: 'AL ' + token }
  });

/** post profile update api* */
export const postUpdateProfileApi = (params, token) =>
  client.post('/user/update/', params, {
    headers: { Authorization: 'AL ' + token }
  });
/** post subject that interst update api* */
export const postUpdateSubjectIntrestApi = (params, token) =>
  client.post('/user/update/interest/', params, {
    headers: { Authorization: 'AL ' + token }
  });

/** post brand update api* */
export const postUpdateBrandApi = (params, token) =>
  client.post('/user/update/brand/', params, {
    headers: { Authorization: 'AL ' + token }
  });

/** post delete car api* */
export const postDeleteCarApi = (id, token) =>
  client.post(
    `/user/remove_saved_cars/${id}/`,
    {},
    {
      headers: { Authorization: 'AL ' + token }
    }
  );

/** post delete car api* */
export const postDeleteCarListApi = (id, token) =>
  client.post(
    `/user/remove_preference/${id}/`,
    {},
    {
      headers: { Authorization: 'AL ' + token }
    }
  );

/** post dealer Info api* */
export const getDealerInfoApi = params =>
  client.post('/marketplace/get_dealers/', params);

/** post delete car api* */
export const postImageUploadApi = (params, token) =>
  client.post('/user/upload/', params, {
    headers: { Authorization: 'AL ' + token }
  });

/**  get Browse car api * */
export const getBrowseCarDetailApi = token =>
  client.get(
    '/vehicles/categories/',
    {},
    {
      headers: { Authorization: 'AL ' + token }
    }
  );

/**  get insurance make api * */
export const getYearListApi = token => client.get('/marketplace/insurance/');

export const getModelListApi = makeId =>
  client.get('/marketplace/insurance/', {
    params: {
      make: makeId
    }
  });

export const getMakeListApi = yearId =>
  client.get('/marketplace/insurance/', {
    params: {
      year: yearId
    }
  });

/**  get year car api * */
export const getYearApi = query => client.get('/marketplace/trade_in/');

export const getMakeApi = query =>
  client.get('/marketplace/trade_in/', {
    params: {
      year: query
    }
  });

export const getcarWorthModelApi = (year, make) =>
  client.get('/marketplace/trade_in/', {
    params: {
      year,
      make
    }
  });
export const getcarWorthTrimApi = (year, make, model) =>
  client.get('/marketplace/trade_in/', {
    params: {
      year,
      make,
      model
    }
  });
export const getcarWorthStyleApi = (year, make, model, trim, body_style) =>
  client.get('/marketplace/trade_in/', {
    params: {
      year,
      make,
      model,
      trim,
      body_style
    }
  });
export const getYearAvgPriceApi = query =>
  client.get('/marketplace/avg_asking/');

export const getMakeAvgPriceApi = query =>
  client.get('/marketplace/avg_asking/', {
    params: {
      year: query
    }
  });

export const getModelAvgPriceApi = (year, make) =>
  client.get('/marketplace/avg_asking/', {
    params: {
      year,
      make
    }
  });
export const getTrimAvgPriceApi = (year, make, model) =>
  client.get('/marketplace/avg_asking/', {
    params: {
      year,
      make,
      model
    }
  });
export const getStyleAvgPriceApi = (year, make, model, trim) =>
  client.get('/marketplace/avg_asking/', {
    params: {
      year,
      make,
      model,
      trim
    }
  });

export const getYearFutureValueApi = query =>
  client.get('/marketplace/future_value/');

export const getMakeFutureValueApi = query =>
  client.get('/marketplace/future_value/', {
    params: {
      year: query
    }
  });

export const getModelFutureValueApi = (year, make) =>
  client.get('/marketplace/future_value/', {
    params: {
      year,
      make
    }
  });
export const getTrimFutureValueApi = (year, make, model) =>
  client.get('/marketplace/future_value/', {
    params: {
      year,
      make,
      model
    }
  });
export const getStyleFutureValueApi = (year, make, model, trim) =>
  client.get('/marketplace/avg_asking/', {
    params: {
      year,
      make,
      model,
      trim
    }
  });

/** post tag data* */
export const postTaggingByIdApi = (id, params, token) =>
  client.post(`/content_manager/tagging/${id}/`, params, {
    headers: { Authorization: 'AL ' + token }
  });

/** post sponsor data* */
export const postNewSponsorApi = (params, token) =>
  client.post('/content_manager/create_sponsor/', params, {
    headers: { Authorization: 'AL ' + token }
  });

/** Delete ad data * */
export const deleteAdDataApi = (id, token) =>
  client.post(
    `/content_manager/delete_ad/${id}/`,
    {},
    {
      headers: { Authorization: 'AL ' + token }
    }
  );

/**  get Profile user api * */
export const getProfileApi = token =>
  client.post(
    '/user/info/',
    {},
    {
      headers: { Authorization: 'AL ' + token }
    }
  );

/**  get Profile user api * */
export const getUserInformationApi = token =>
  client.get('/user/user_content_preferences/', {
    headers: { Authorization: 'AL ' + token }
  });

export const getUiControllerApi = (token, name) => {
  if (token != undefined) {
    return client.get(`/ui_controllers/${name}/`, {
      headers: { Authorization: 'AL ' + token }
    });
  }

  return client.get(`/ui_controllers/${name}/`);
};

/**  get home page tile api * */
export const gethomePageTileApi = token =>
  getUiControllerApi(token, 'new_homepage_default_tiles');

/**  get old password user api * */
export const getOldPasswordApi = (params, token) =>
  client.post('/user/checkpassword/', params, {
    headers: { Authorization: 'AL ' + token }
  });

/** post ad data* */
export const postAdDataApi = (id, params, token) =>
  client.post(`/content_manager/create_ad/${id}/`, params, {
    headers: { Authorization: 'AL ' + token }
  });

/** get delete section * */
export const deleteTemplatesApi = (token, id) =>
  client.get(`/content_manager/delete_content/${id}/`, {
    headers: { Authorization: 'AL ' + token }
  });
/** get content data * */
export const getContentDataApi = (contentId, token) =>
  client.get(`/content_manager/content_by_id/${contentId}/`, {
    headers: { Authorization: 'AL ' + token }
  });
/** get cbb car makes api * */
export const getMakesApi = () => client.get('/marketplace/jatomakes/');
/** get cbb car models api * */
export const getModelApi = query =>
  client.get(`/marketplace/jato_models/${query}/`);

/** get cbb other cars api * */
export const getOtherCarsApi = (query, token) => {
  if (token !== undefined) {
    return client.get(`/marketplace/jato_similar_vehicles/${query}/`, {
      headers: { Authorization: 'AL ' + token }
    });
  }
  return client.get(`/marketplace/jato_similar_vehicles/${query}/`);
};

/** get cbb car search api * */
export const postSearchApi = (values, token) => {
  if (token != undefined) {
    return client.get('/marketplace/jato_search/', {
      params: {
        make: values.make,
        model: values.model,
        year: values.year,
        postal_code: values.postal_code
      },
      headers: { Authorization: 'AL ' + token }
    });
  }
  return client.get('/marketplace/jato_search/', {
    params: {
      make: values.make,
      model: values.model,
      year: values.year,
      postal_code: values.postal_code
    }
  });
};

/** get cbb car specification api * */
export const getCarSpecificationApi = id =>
  client.get(`/marketplace/jato_vehicle_specs/${id}/`);

/** get country list api * */
export const getCountryListApi = token =>
  client.get('/content_manager/countries/', {
    headers: { Authorization: 'AL ' + token }
  });

/** get car details api * */
export const getCarDetailsApi = ({ query, token, color_code }) => {
  if (token != undefined) {
    return client.get(
      `/marketplace/jato_vehicle_details/${query}/?color_code=${color_code}`,
      {
        headers: { Authorization: 'AL ' + token }
      }
    );
  }
  return client.get(
    `/marketplace/jato_vehicle_details/${query}/?color_code=${color_code}`
  );
};

export const getCarColorsApi = evoxId =>
  client.post('/marketplace/evox_vehicle_colors/', { 'evox-id': evoxId });

/** get city list api * */
export const getCityListApi = (query, token) =>
  client.get(`/content_manager/cities/${query}/`, {
    headers: { Authorization: 'AL ' + token }
  });
/** get state list api * */
export const getStateListApi = (query, token) =>
  client.get(`/content_manager/states/${query}/`, {
    headers: { Authorization: 'AL ' + token }
  });

/** get sponsor list api * */
export const getSponsorListApi = token =>
  client.get('/content_manager/sponsors/', {
    headers: { Authorization: 'AL ' + token }
  });

/** get campaign list api * */
export const getCampaignListApi = token =>
  client.get('/content_manager/campaigns/', {
    headers: { Authorization: 'AL ' + token }
  });

/** get tags list api * */
export const getTaggingApi = token =>
  client.get('/content_manager/tags/', {
    headers: { Authorization: 'AL ' + token }
  });

/** get car manufacturer api * */
export const getCarManufacturerApi = token =>
  client.get('/content_manager/manufacturer/', {
    headers: { Authorization: 'AL ' + token }
  });

/** get car make api * */
export const getCarMakeApi = (query, token) =>
  client.get(`/content_manager/make/${query}/`, {
    headers: { Authorization: 'AL ' + token }
  });

/** get car model api * */
export const getCarModelApi = (query, token) =>
  client.get(`/content_manager/model/${query}/`, {
    headers: { Authorization: 'AL ' + token }
  });

/** get car model years api * */
export const getCarYearsApi = (query, token) =>
  client.get('/content_manager/years/', {
    headers: { Authorization: 'AL ' + token }
  });

/** get save template data api * */
export const getSavedTemplateDataApi = (token, query) =>
  client.get(`/content_manager/preview/${query}/`, {
    headers: { Authorization: 'AL ' + token }
  });

/** get save template data api * */
export const getArticleDataApi = (token, query) => {
  if (token != undefined) {
    return client.get('/content_manager/content_by_guid/' + query + '/', {
      headers: { Authorization: 'AL ' + token }
    });
  }

  return client.get(`/content_manager/content_by_guid/${query}/`);
};

export const getArticlesApi = (query, token) =>
  client.post('/content_manager/articles/', query, {
    headers: { Authorization: 'AL ' + token }
  });

/** get template Lisiting api * */
export const getTemplateListApi = token =>
  client.get('/content_manager/template_list/', {
    headers: { Authorization: 'AL ' + token }
  });

/** get template Lisiting api * */
export const getTemplateListStateApi = (token, params) =>
  client.post('/content_manager/template_list/', params, {
    headers: { Authorization: 'AL ' + token }
  });

/** get partners * */
export const getPartnerListApi = token =>
  client.get('/content_manager/partners/', {
    headers: { Authorization: 'AL ' + token }
  });

/** get Publishing state * */
export const getContentOptionsApi = token =>
  client.get('/content_manager/publish_states/', {
    headers: { Authorization: 'AL ' + token }
  });

/** get Assets state * */
export const getAssetsApi = token =>
  client.get('/content_manager/assets_list/', {
    headers: { Authorization: 'AL ' + token }
  });
/** post Publishing tab * */
export const postPublishingApi = (params, token, id) => {
  const newParams = {
    article_publish_date: params.article_publish_date
      ? params.article_publish_date
      : null,
    do_not_publish_until:
      params.do_not_publish_until === ''
        ? null
        : convertToServerTimeZone(params.do_not_publish_until),
    publish_state: params.publish_state,
    unpublishing_on:
      params.unpublishing_on === ''
        ? null
        : convertToServerTimeZone(params.unpublishing_on)
  };
  return client.post(
    '/content_manager/save_publish_state/' + id + '/',
    newParams,
    {
      headers: { Authorization: 'AL ' + token }
    }
  );
};

export const postContentSectionApi = (params, token, id) => {
  const newParams = configData(params);
  return client.post(`/content_manager/save_content/${id}/`, newParams, {
    headers: { Authorization: 'AL ' + token }
  });
};

/** get Publish Article* */
export const getPublishArticleApi = token =>
  client.get('/content_manager/published_content/', {
    headers: { Authorization: 'AL ' + token }
  });

export const getAnalyticsUrlApi = token =>
  client.get('/analytics/dashboard_url/', {
    headers: { Authorization: 'AL ' + token }
  });
/** Featured Article */
export const getFeaturedArticleApi = () => {
  return client.get('/content_manager/featured/');
};

/** Mapping IDS */
export const getMappingIdsApi = token => {
  if (token !== undefined) {
    return client.get('/content_manager/mapping_ids', {
      headers: { Authorization: 'AL ' + token }
    });
  }
  return client.get('/content_manager/mapping_ids');
};

/** UserRelated Articles with index */
export const getUserRelatedArticlesApi = (
  token,
  mappingId,
  startIndex,
  endIndex,
  score
) => {
  return client.get(
    `/content_manager/new_article_section/?mapping_id=${mappingId}&start_index=${startIndex}&end_index=${endIndex}&user_related=1&score_related=${score}`,
    {
      headers: { Authorization: 'AL ' + token }
    }
  );
};
export const getCommonArticlesApi = (
  token,
  mappingId,
  startIndex,
  endIndex
) => {
  console.log(token, 'token');
  if (token) {
    return client.get(
      `/content_manager/new_article_section/?mapping_id=${mappingId}&start_index=${startIndex}&end_index=${endIndex}`,
      {
        headers: { Authorization: 'AL ' + token }
      }
    );
  }
  return client.get(
    `/content_manager/new_article_section/?mapping_id=${mappingId}&start_index=${startIndex}&end_index=${endIndex}`
  );
};
// recall

// export const getRecallList = (year, make, model) =>
//   client.get('/recall/get_list/', {
//     params: { year, make, model }
//   });
export const getRecallList = (year, make, model, token) => {
  if (token !== undefined) {
    return client.get('/recall/get_list/', {
      params: { year, make, model },
      headers: {
        Authorization: 'AL ' + token
      }
    });
  }
  return client.get('/recall/get_list/', { params: { year, make, model } });
};
export const getRecallSummary = id => client.get(`/recall/summary/${id}/`);

const tokenHeader = token => ({
  Authorization: `AL ${token}`
});

export const getAssets = async (token, data) => {
  const result = await client.post('/assets/all/', data, { 
    headers: { ...tokenHeader(token) }
  });

  return result.data;
};

export const createAsset = async (token, { file, ...other }) => {
  const formData = new FormData();
	formData.append('file', castArray(file)[0]);
	
	for(const [key, value] of Object.entries(other))
    formData.append(key, value);
    
  const result = await client.post('/assets/create/', formData, {
    headers: { ...tokenHeader(token) }
  });

  return result.data[0];
};

export const loadPublishedArticles = async (token, { startIndex, count, filter }) => {
  return client.post('/content_manager/all_published_articles/', {
    startIndex,
    count,
    filter
  }, { headers: tokenHeader(token) });
};

export const getTileCategoriesApi = token => client.get('/ui_controllers/all_categories/', {
  headers: { ...tokenHeader(token) }
});

export const getTilesApi = (categoryId, token) => client.post(`/ui_controllers/fetch_tiles/`, { category: categoryId }, {
  headers: { ...tokenHeader(token) }
});

export const createTileApi = (tile, token) => client.post('/ui_controllers/create_tile/', tile, {
  headers: { ...tokenHeader(token) }
});

export const updateTileApi = (id, tile, token) => client.post(`/ui_controllers/update_tile/${id}/`, tile, {
  headers: { ...tokenHeader(token) }
});

export const deleteTileApi = (id, token) => client.post(`/ui_controllers/delete_tile/${id}/`, null, {
  headers: { ...tokenHeader(token) }
});

export const setTileOrderApi = (categoryId, tileIds, token) => client.post('/ui_controllers/set_tiles_order/', {
  category: categoryId,
  tiles: tileIds
}, {
  headers: { ...tokenHeader(token) }
});

export const getUnusedTilesApi = token => client.get('/ui_controllers/unused_tiles/', {
  headers: { ...tokenHeader(token) }
});
