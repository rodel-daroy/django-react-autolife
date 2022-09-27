import { 
	LOAD_ASSETS, 
	CREATE_ASSET, 
	LOAD_ASSETS_REQUEST, 
	CREATE_ASSET_REQUEST, 
	CREATE_ASSET_FAIL,
	LOAD_ASSETS_FAIL
} from 'redux/actiontypes/assetActionTypes';
import { combineReducers } from 'redux';

const assets = (state = {}, action) => {
	const { type, payload, result } = action;

	switch(type) {
		case LOAD_ASSETS_REQUEST: {
			return {
				...state,

				loading: true
			};
		}

		case LOAD_ASSETS: {
			if(result && payload) {
				const { startIndex } = payload;
				const { assets, total_count } = result;

				const all = [...(state.all || [])];
				all.length = total_count;

				for(let i = 0; i < assets.length; ++i)
					all[i + startIndex] = assets[i];

				return {
					...state,
					loading: false,
					all
				};
			}
			else
				return {
					...state,
					loading: false
				};
		}

		case LOAD_ASSETS_FAIL: {
			return {
				...state,
				loading: false
			};
		}

		default:
			return state;
	}
};

const createAsset = (state = {}, action) => {
	const { type, result } = action;

	switch(type) {
		case CREATE_ASSET_REQUEST: {
			return {
				...state,
				loading: true
			};
		}

		case CREATE_ASSET: {
			return {
				...state,
				loading: false,
				result
			}
		}

		case CREATE_ASSET_FAIL: {
			return {
				...state,
				loading: false
			};
		}

		default:
			return state;
	}
};

export default combineReducers({
	assets,
	createAsset
});