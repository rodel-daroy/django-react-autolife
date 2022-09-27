import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import homeReducers from "./homeReducers";
import layoutReducer from "./layoutReducer";
import notificationReducer from "./notificationReducer";
import userReducer from "./userReducer";
import uiController from "./uiController";
import marketPlace from "./marketPlaceReducer";
import articlesReducer from "./articleReducer";
import editorialReducer from "./editorialReducer";
import insuranceReducer from "./insuranceReducer";
import infoModalReducer from "./infoModalReducer";
import Registration from "./registrationReducer";
import carWorth from "./carWorthreducer";
import metaDataReducer from "./metaReducer";
import searchReducer from "./searchReducer";
import CMSTemplateListReducer from "./CMSTemplateListingViewReducer";
import CMSPageReducer from "./CMSPageReducer";
import ContentDetailReducer from "./contentTabReducer";
import CMSCarBrandSectionReducer from "./CMSCarBrandSectionReducer";
import editorialCmsReducer from "./editorialCmsReducer";
import profileReducer from "./profileReducer";
import userContainerReducer from "./userContainerReducer";
import recallReducer from "./recallReducer";
import articlesBrowseReducer from "./articlesBrowseReducer";
import assetReducer from "./assetReducer";
import articlesEditReducer from "./articlesEditReducer";
import tileReducer from "./tileReducer";
import analyticsReducer from "./analyticsReducer";
import commonReducer from "./commonReducer";

export default combineReducers({
  home: homeReducers,
  layout: layoutReducer,
  notification: notificationReducer,
  user: userReducer,
  uiController,
  articlesBrowse: articlesBrowseReducer,
  MarketPlace: marketPlace,
  trends: articlesReducer,
  editorial: editorialReducer,
  form: formReducer,
  insurance: insuranceReducer,
  infoModal: infoModalReducer,
  question: Registration,
  carWorth,
  userContainer: userContainerReducer,
  metadata: metaDataReducer,
  search: searchReducer,
  templates: CMSTemplateListReducer,
  page: CMSPageReducer,
  CMSDetail: editorialCmsReducer,
  CMSContentDetails: ContentDetailReducer,
  carBrandDetail: CMSCarBrandSectionReducer,
  profile: profileReducer,
  recall: recallReducer,
  assets: assetReducer,
  articlesEdit: articlesEditReducer,
  tiles: tileReducer,
  analyticsReducer,
  common: commonReducer
});
