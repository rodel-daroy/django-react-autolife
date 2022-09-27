import { LOAD_ASSETS, CREATE_ASSET, CREATE_ASSET_REQUEST, LOAD_ASSETS_REQUEST, LOAD_ASSETS_FAIL, CREATE_ASSET_FAIL } from 'redux/actiontypes/assetActionTypes';
import { getAssets as getAssetsApi, createAsset as createAssetApi } from 'services/autolife';
import { accessToken } from '../selectors/userSelectors';

export const loadAssets = payload => async (dispatch, getState) => {
  dispatch({ type: LOAD_ASSETS_REQUEST, payload });

  try {
    const result = await getAssetsApi(accessToken(getState()), payload);

    dispatch({
      type: LOAD_ASSETS,
      payload,
      result
    });
  }
  catch(error) {
    dispatch({ type: LOAD_ASSETS_FAIL });
    throw error;
  }
};

export const createAsset = payload => async (dispatch, getState) => {
  dispatch({ type: CREATE_ASSET_REQUEST, payload });

  try {
    const result = await createAssetApi(accessToken(getState()), payload);

    dispatch({
      type: CREATE_ASSET,
      payload,
      result
    });

    return result;
  }
  catch(error) {
    dispatch({ type: CREATE_ASSET_FAIL });
    throw error;
  }
};