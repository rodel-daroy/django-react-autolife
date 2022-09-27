import React from 'react';
import PropTypes from 'prop-types';
import UnusedTileSelector from './UnusedTileSelector';
import TabSet from 'components/Navigation/TabSet';
import TileForm from './TileForm';
import CategoryTileSelector from './CategoryTileSelector';
import './InsertTileView.scss';

const InsertTileView = ({ onSubmit, categoryId }) => {
	const handleUnusedTile = (index, tile) => onSubmit({ tile, newTile: false });
	const handleNewTile = tile => onSubmit({ tile, newTile: true });
	const handleCopyTile = (index, tile) => onSubmit({ tile, newTile: true });

	return (
		<div className="insert-tile-view">
			<TabSet 
				name="insertTileTabs" 
				className="insert-tile-view-tabs"
				tabs={[
					{
						caption: 'Create new tile',
						content: () => (
							<TileForm 
								initialValues={{ 
									columns: 1
								}} 
								onSubmit={handleNewTile} />
						)
					},
					{
						caption: 'Copy existing tile',
						content: () => (
							<CategoryTileSelector 
								onChange={handleCopyTile} 
								categoryId={categoryId} />
						)
					},
					{
						caption: 'Trash',
						content: () => (
							<UnusedTileSelector onChange={handleUnusedTile} />
						)
					}
				]} />
		</div>
	);
};

InsertTileView.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	categoryId: PropTypes.string
};
 
export default InsertTileView;