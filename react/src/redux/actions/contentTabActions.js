import * as contentDetail from "../actiontypes/contentTabActionTypes";
import { getPartnerListApi, getAssetsApi } from "../../services/autolife";

export const getPartnerListSuccess = list => {
  return {
    type: contentDetail.PARTNER_LIST_REQUESTED_SUCCESSFUL,
    payload: list.data
  };
};

export const getPartnerListFail = () => {
  return {
    type: contentDetail.PARTNER_LIST_REQUESTED_FAIL
  };
};

export const getPartnerList = token => {
  return dispatch => {
    dispatch({
      type: contentDetail.PARTNER_LIST
    });
    return getPartnerListApi(token)
      .then(resp => dispatch(getPartnerListSuccess(resp.data)))
      .catch(error => dispatch(getPartnerListFail(error)));
  };
};

export const getTemplateListSuccess = list => {
  return {
    type: contentDetail.TEMPLATE_LIST_REQUESTED_SUCCESSFUL,
    payload: list.data
  };
};

export const getTemplateListFail = () => {
  return {
    type: contentDetail.TEMPLATE_LIST_REQUESTED_FAIL
  };
};

export const getTemplateList = () => {
  return dispatch => {
    dispatch({
      type: contentDetail.TEMPLATE_LIST
    });
    return dispatch(
      getTemplateListSuccess({
        data: [
          { name: "Editorial Template", id: "Editorial Template" },
          {
            name: "Vehicle Editorial Template",
            id: "Vehicle Editorial Template"
          }
        ]
      })
    );

    // return getTemplateListApi()
    //   .then(resp => dispatch(getTemplateListSuccess(resp.data)))
    //   .catch(error => dispatch(getTemplateListFail(error)))
  };
};
var formatData = rowData => {
  var data = {};
  for (var i = 0; i < rowData.length; i++) {
    data[rowData[i].id] = rowData[i];
  }
  return data;
};
export const getAssetNameListSuccess = list => {
  const data = formatData(list.data);
  return {
    type: contentDetail.ASSET_LIST_REQUESTED_SUCCESSFUL,
    payload: {
      data: list.data,
      formatData: data
    }
  };
};

export const getAssetNameListFail = error => {
  return {
    type: contentDetail.ASSET_LIST_REQUESTED_FAIL
  };
};

export const getAssetNameList = token => {
  return dispatch => {
    dispatch({
      type: contentDetail.ASSET_LIST
    });
    return getAssetsApi(token)
      .then(resp => dispatch(getAssetNameListSuccess(resp.data)))
      .catch(error => dispatch(getAssetNameListFail(error)));
  };
};

export const getTemplateLocationListSuccess = list => {
  return {
    type: contentDetail.TEMPLATE_LOCATION_LIST_REQUESTED_SUCCESSFUL,
    payload: list.data
  };
};

export const getTemplateLocationListFail = error => {
  return {
    type: contentDetail.TEMPLATE_LOCATION_LIST_REQUESTED_FAIL
  };
};

export const getTemplateLocationList = () => {
  return dispatch => {
    dispatch({
      type: contentDetail.TEMPLATE_LOCATION_LIST
    });
    return dispatch(
      getTemplateLocationListSuccess({
        data: [
          { name: "Autoshow", id: 1 },
          { name: "promotions", id: 2 },
          { name: "CMS", id: 3 },
          { name: "Other Entry", id: 4 }
        ]
      })
    );

    // return getTemplateLocationListApi()
    //   .then(resp => dispatch(getTemplateLocationListSuccess(resp.data)))
    //   .catch(error => dispatch(getTemplateLocationListFail(error)))
  };
};
