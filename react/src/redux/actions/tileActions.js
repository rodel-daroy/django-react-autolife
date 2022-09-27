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
	INSERT_NEW_CATEGORY_TILE_REQUEST,
	INSERT_CATEGORY_TILE_REQUEST,
	REMOVE_CATEGORY_TILE_REQUEST,
	UPDATE_CATEGORY_TILE_REQUEST,
	DELETE_CATEGORY_TILE_REQUEST,
	LOAD_UNUSED_TILES_REQUEST,
	LOOKUP_CATEGORY_TILES_REQUEST
} from '../actiontypes/tileActionTypes';
import { 
	setTileOrderApi, 
	createTileApi, 
	updateTileApi, 
	deleteTileApi, 
	getTileCategoriesApi, 
	getTilesApi, 
	getUnusedTilesApi
} from 'services/autolife';
import { accessToken } from 'redux/selectors/userSelectors';
import castArray from 'lodash/castArray';
import { isAbsoluteUrl } from 'utils';

export const loadCategories = () => async (dispatch, getState) => {
	dispatch({
		type: LOAD_CATEGORIES_REQUEST
	});

	const response = await getTileCategoriesApi(accessToken(getState()));

	dispatch({
		type: LOAD_CATEGORIES,
		payload: response.data.data
	});
};

export const loadCategoryTiles = categoryId => async (dispatch, getState) => {
	dispatch({
		type: LOAD_CATEGORY_TILES_REQUEST,
		payload: categoryId
	});

	const response = await getTilesApi(categoryId, accessToken(getState()));

	const tiles = response.data.filter(({ active }) => active);

	dispatch({
		type: LOAD_CATEGORY_TILES,
		payload: {
			categoryId,
			tiles
		}
	});
};

const saveCategoryTiles = async (tiles, getState) => {
	const token = accessToken(getState());

	const { categoryId } = getState().tiles.categoryTiles.result;
	const tileIds = tiles.map(tile => tile.id);

	await setTileOrderApi(categoryId, tileIds, token);

	const response = await getTilesApi(categoryId, token);
	return {
		categoryId,
		tiles: response.data
	};
};

export const moveCategoryTile = (sourceIndex, destIndex) => async (dispatch, getState) => {
	dispatch({
		type: MOVE_CATEGORY_TILE_REQUEST,
		payload: {
			sourceIndex,
			destIndex
		}
	});

	const { tiles: result } = getState().tiles.categoryTiles.result;

	const newResult = result.slice();
	const tile = newResult.splice(sourceIndex, 1)[0];

	if(sourceIndex < destIndex)
		--destIndex;

	newResult.splice(destIndex, 0, tile);

	dispatch({
		type: MOVE_CATEGORY_TILE,
		payload: await saveCategoryTiles(newResult, getState)
	});
};

const insert = async (index, tile, getState) => {
	const { tiles: result } = getState().tiles.categoryTiles.result;

	const newResult = result.slice();
	newResult.splice(index, 0, tile);

	return saveCategoryTiles(newResult, getState);
};

export const insertCategoryTile = (index, tile) => async (dispatch, getState) => {
	dispatch({
		type: INSERT_CATEGORY_TILE_REQUEST,
		payload: { index, tile }
	});
	
	const result = await insert(index, tile, getState);

	dispatch({
		type: INSERT_CATEGORY_TILE,
		payload: result
	});
};

export const removeCategoryTile = index => async (dispatch, getState) => {
	dispatch({
		type: REMOVE_CATEGORY_TILE_REQUEST,
		payload: index
	});

	const { tiles: result } = getState().tiles.categoryTiles.result;

	const newResult = result.slice();
	newResult.splice(index, 1);

	dispatch({
		type: REMOVE_CATEGORY_TILE,
		payload: await saveCategoryTiles(newResult, getState)
	});
};

const tileAssetId = tileAsset => {
	if(tileAsset) {
		tileAsset = castArray(tileAsset);
		if(tileAsset)
			return tileAsset[0].asset_id;
	}
};

export const insertNewCategoryTile = (index, tile) => async (dispatch, getState) => {
	dispatch({
		type: INSERT_NEW_CATEGORY_TILE_REQUEST,
		payload: { index, tile }
	});

	tile = {
		...tile,

		id: undefined,
		name: tile.name ? tile.name : tile.tile_headline,
		tile_asset: tileAssetId(tile.tile_asset),
		category: undefined,
		linked_outside: !tile.tile_cta_article && isAbsoluteUrl(tile.tile_cta_link),
		sponsor: (tile.sponsor && typeof tile.sponsor === 'object') ? tile.sponsor.id : tile.sponsor,
		tile_cta_article: (tile.tile_cta_article && typeof tile.tile_cta_article === 'object') ? tile.tile_cta_article.article_id : tile.tile_cta_article
	};

	const response = await createTileApi(tile, accessToken(getState()));
	const newTile = response.data;

	dispatch({
		type: INSERT_NEW_CATEGORY_TILE,
		payload: await insert(index, newTile, getState)
	});
};

export const updateCategoryTile = (index, tile) => async (dispatch, getState) => {
	dispatch({
		type: UPDATE_CATEGORY_TILE_REQUEST,
		payload: { index, tile }
	});

	tile = {
		...tile,

		category: undefined,
		tile_asset: tileAssetId(tile.tile_asset),
		linked_outside: !tile.tile_cta_article && isAbsoluteUrl(tile.tile_cta_link),
		sponsor: (tile.sponsor && typeof tile.sponsor === 'object') ? tile.sponsor.id : tile.sponsor,
		tile_cta_article: (tile.tile_cta_article && typeof tile.tile_cta_article === 'object') ? tile.tile_cta_article.article_id : tile.tile_cta_article,
		campaign: null
	};

	const response = await updateTileApi(tile.id, tile, accessToken(getState()));
	const updatedTile = response.data;

	const { tiles: result } = getState().tiles.categoryTiles.result;
	const newTiles = result.slice();
	newTiles[index] = updatedTile;
	
	dispatch({
		type: UPDATE_CATEGORY_TILE,
		payload: await saveCategoryTiles(newTiles, getState)
	});
};

export const deleteCategoryTile = index => async (dispatch, getState) => {
	dispatch({
		type: DELETE_CATEGORY_TILE_REQUEST,
		payload: index
	});

	const token = accessToken(getState());
	
	const { tiles: result, categoryId } = getState().tiles.categoryTiles.result;

	const { id: tileId } = result[index];
	await deleteTileApi(tileId, token);

	const response = await getTilesApi(categoryId, token);

	dispatch({
		type: DELETE_CATEGORY_TILE,
		payload: {
			categoryId,
			tiles: response.data
		}
	});
};

export const loadUnusedTiles = () => async (dispatch, getState) => {
	dispatch({
		type: LOAD_UNUSED_TILES_REQUEST
	});

	const response = await getUnusedTilesApi(accessToken(getState()));

	dispatch({
		type: LOAD_UNUSED_TILES,
		payload: response.data
	});
};

export const lookupCategoryTiles = categoryId => async (dispatch, getState) => {
	dispatch({
		type: LOOKUP_CATEGORY_TILES_REQUEST,
		payload: categoryId
	});

	const response = await getTilesApi(categoryId, accessToken(getState()));

	dispatch({
		type: LOOKUP_CATEGORY_TILES,
		payload: response.data
	});
};
