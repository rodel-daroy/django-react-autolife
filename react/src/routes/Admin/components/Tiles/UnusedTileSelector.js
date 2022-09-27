import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { integer } from 'airbnb-prop-types';
import { connect } from 'react-redux';
import { loadUnusedTiles } from 'redux/actions/tileActions';
import EmptyState from 'components/Layout/EmptyState';
import TileSelectView from 'components/Tiles/TileSelectView';
import { getTiles } from 'components/containers/helpers';
import Spinner from 'components/common/Spinner';
import './UnusedTileSelector.scss';

const UnusedTileSelector = ({ 
	index, 
	onChange, 
	loadUnusedTiles, 
	unusedTiles: { result: tiles, loading }
}) => {
	useEffect(() => {
		loadUnusedTiles();
	}, [loadUnusedTiles]);

	const handleChange = index => {
		if(onChange) {
			const tile = tiles[index];
			const mappedIndex = tiles.indexOf(t => t.id === tile.id);

			onChange(mappedIndex, tile);
		}
	};

	return (
		<div className="unused-tile-selector">
			{(tiles && tiles.length > 0) && (
				<TileSelectView index={index} onChange={handleChange}>
					{getTiles(tiles, false)}
				</TileSelectView>
			)}

			{!loading && (!tiles || tiles.length === 0) && (
				<EmptyState>
					No unused tiles found
				</EmptyState>
			)}

			{loading && <Spinner color="lightgrey" scale={.5} />}
		</div>
	);
};

UnusedTileSelector.propTypes = {
	index: integer(),
	onChange: PropTypes.func,

	unusedTiles: PropTypes.object.isRequired,
	loadUnusedTiles: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	unusedTiles: state.tiles.unusedTiles
});
 
export default connect(mapStateToProps, { loadUnusedTiles })(UnusedTileSelector);