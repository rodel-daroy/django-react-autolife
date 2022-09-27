import { 
	LOAD_CATEGORIES,
	LOAD_CATEGORY_TILES,
	MOVE_CATEGORY_TILE,
	INSERT_CATEGORY_TILE,
	REMOVE_CATEGORY_TILE,
	LOAD_UNUSED_TILES,
	INSERT_NEW_CATEGORY_TILE,
	UPDATE_CATEGORY_TILE,
	LOOKUP_CATEGORY_TILES,
	DELETE_CATEGORY_TILE,
	LOAD_CATEGORIES_REQUEST,
	LOAD_CATEGORY_TILES_REQUEST,
	MOVE_CATEGORY_TILE_REQUEST,
	INSERT_CATEGORY_TILE_REQUEST,
	REMOVE_CATEGORY_TILE_REQUEST,
	INSERT_NEW_CATEGORY_TILE_REQUEST,
	UPDATE_CATEGORY_TILE_REQUEST,
	DELETE_CATEGORY_TILE_REQUEST,
	LOAD_UNUSED_TILES_REQUEST,
	LOOKUP_CATEGORY_TILES_REQUEST
} from '../actiontypes/tileActionTypes';
import { combineReducers } from 'redux';
import castArray from 'lodash/castArray';

const initialState = {
	loading: false,
	result: null
};

const requestReducer = (requestActionType, actionType) => (state = initialState, action) => {
	requestActionType = castArray(requestActionType);
	actionType = castArray(actionType);

	if(requestActionType.includes(action.type))
		return {
			...state,

			loading: true
		};

	if(actionType.includes(action.type))
		return {
			...state,

			loading: false,
			result: action.payload
		};

	return state;
};

export default combineReducers({
	categories: requestReducer(LOAD_CATEGORIES_REQUEST, LOAD_CATEGORIES),
	categoryTiles: requestReducer([
		LOAD_CATEGORY_TILES_REQUEST,
		MOVE_CATEGORY_TILE_REQUEST,
		INSERT_CATEGORY_TILE_REQUEST,
		REMOVE_CATEGORY_TILE_REQUEST,
		INSERT_NEW_CATEGORY_TILE_REQUEST,
		UPDATE_CATEGORY_TILE_REQUEST,
		DELETE_CATEGORY_TILE_REQUEST
	], [
		LOAD_CATEGORY_TILES,
		MOVE_CATEGORY_TILE,
		INSERT_CATEGORY_TILE,
		REMOVE_CATEGORY_TILE,
		INSERT_NEW_CATEGORY_TILE,
		UPDATE_CATEGORY_TILE,
		DELETE_CATEGORY_TILE
	]),
	unusedTiles: requestReducer(LOAD_UNUSED_TILES_REQUEST, LOAD_UNUSED_TILES),
	lookupCategoryTiles: requestReducer(LOOKUP_CATEGORY_TILES_REQUEST, LOOKUP_CATEGORY_TILES)
});