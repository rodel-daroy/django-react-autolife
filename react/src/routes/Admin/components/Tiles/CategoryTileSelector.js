import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import TileCategoryDropdown from './TileCategoryDropdown';
import TileSelectView from 'components/Tiles/TileSelectView';
import { connect } from 'react-redux';
import { lookupCategoryTiles } from 'redux/actions/tileActions';
import { getTiles } from 'components/containers/helpers';
import usePrevious from 'hooks/usePrevious';
import LoadingOverlay from 'components/common/LoadingOverlay';

const CategoryTileSelector = ({ 
	lookupCategoryTiles, 
	tiles: { loading, result: tiles }, 
	onChange, 
	categoryId, 
	tileId
}) => {
	const [category, setCategory] = useState(categoryId);

	const handleCategoryChange = useCallback(categoryId => {
		setCategory(categoryId);
		if(categoryId)
			lookupCategoryTiles(categoryId);
	}, [lookupCategoryTiles]);

	const prevCategoryId = usePrevious(categoryId);
	useEffect(() => {
		if(categoryId && categoryId != prevCategoryId)
			handleCategoryChange(categoryId);
	}, [categoryId, prevCategoryId, handleCategoryChange]);

	const handleTileChange = index => onChange(index, tiles[index]);

	const selectedIndex = tileId ? tiles.findIndex(tile => tile.id === tileId) : null;

	return (
		<div>
			<TileCategoryDropdown 
				value={category} 
				onChange={handleCategoryChange} />

			{category && (
				<TileSelectView onChange={handleTileChange} index={selectedIndex}>
					{getTiles(tiles || [], false)}
				</TileSelectView>
			)}

			{loading && <LoadingOverlay color="darkblue" />}
		</div>
	);
};

CategoryTileSelector.propTypes = {
	categoryId: PropTypes.string,
	tileId: PropTypes.string,
	onChange: PropTypes.func.isRequired,

	lookupCategoryTiles: PropTypes.func.isRequired,
	tiles: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	tiles: state.tiles.lookupCategoryTiles
});
 
export default connect(mapStateToProps, { lookupCategoryTiles })(CategoryTileSelector);