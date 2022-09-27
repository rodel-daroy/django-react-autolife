import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TileEditView from 'components/Tiles/TileEditView';
import { connect } from 'react-redux';
import { 
	loadCategoryTiles, 
	moveCategoryTile, 
	insertCategoryTile, 
	removeCategoryTile, 
	insertNewCategoryTile,
	updateCategoryTile,
	deleteCategoryTile
} from 'redux/actions/tileActions';
import { getTiles } from 'components/containers/helpers';
import EmptyState from 'components/Layout/EmptyState';
import ResponsiveModal from 'components/common/ResponsiveModal';
import InsertTileView from './InsertTileView';
import EditTileView from './EditTileView';
import RemoveTileModal from './RemoveTileModal';
import LoadingOverlay from 'components/common/LoadingOverlay';
import './ContentTileEditView.scss';

const ContentTileEditView = ({ 
	categoryId, 
	loadCategoryTiles, 
	tiles: { loading, result }, 
	moveCategoryTile, 
	insertCategoryTile, 
	removeCategoryTile,
	insertNewCategoryTile,
	updateCategoryTile,
	deleteCategoryTile
}) => {
	const { tiles } = result || {};

	const [insertState, setInsertState] = useState();
	const [editState, setEditState] = useState({});

	const [removeTile, setRemoveTile] = useState();

	useEffect(() => {
		loadCategoryTiles(categoryId);
	}, [categoryId, loadCategoryTiles]);

	if(!tiles && loading)
		return <EmptyState.Loading />;

	const handleInsert = index => setInsertState({ index });

	const handleInsertSubmit = ({ tile, newTile }) => {
		setInsertState(null);

		if(newTile)
			insertNewCategoryTile(insertState.index, tile);
		else
			insertCategoryTile(insertState.index, tile);
	};

	const handleMove = (sourceIndex, destIndex) => {
		moveCategoryTile(sourceIndex, destIndex);
	};

	const handleDelete = index => {
		const handleCancel = () => setRemoveTile(null);
		
		const handleRemove = () => {
			removeCategoryTile(index);
			setRemoveTile(null);
		};

		const handleDeleteTile = () => {
			deleteCategoryTile(index);
			setRemoveTile(null);
		};

		setRemoveTile({
			onRemove: handleRemove,
			onDelete: handleDeleteTile,
			onCancel: handleCancel
		});
	};

	const handleEdit = index => setEditState({ index, tile: tiles[index] });

	const handleEditSubmit = tile => {
		updateCategoryTile(editState.index, tile);

		setEditState({});
	};

	return (
		<div className="content-tile-edit-view">
			<TileEditView 
				onInsert={handleInsert}
				onMove={handleMove}
				onEdit={handleEdit}
				onDelete={handleDelete}>

				{getTiles(tiles || [], false)}
			</TileEditView>

			{loading && <LoadingOverlay color="darkblue" />}

			{!!insertState && (
				<ResponsiveModal 
					className="content-tile-edit-view-modal" 
					onClose={() => setInsertState(null)}>

					<ResponsiveModal.Block 
						position="left"
						className="content-tile-edit-view-insert">

						<h2>Insert tile</h2>
						
						<InsertTileView 
							onSubmit={handleInsertSubmit} 
							categoryId={categoryId} />
					</ResponsiveModal.Block>
				</ResponsiveModal>
			)}

			{!!editState.tile && (
				<ResponsiveModal 
					className="content-tile-edit-view-modal" 
					onClose={() => setEditState({})}>

					<ResponsiveModal.Block position="left">
						<h2>Edit tile</h2>

						<EditTileView 
							tile={editState.tile}
							onSubmit={handleEditSubmit} 
							onCancel={() => setEditState({})} />
					</ResponsiveModal.Block>
				</ResponsiveModal>
			)}

			{removeTile && (
				<RemoveTileModal {...removeTile} />
			)}
		</div>
	);
};

ContentTileEditView.propTypes = {
	categoryId: PropTypes.string.isRequired,

	loadCategoryTiles: PropTypes.func.isRequired,
	tiles: PropTypes.object.isRequired,
	moveCategoryTile: PropTypes.func.isRequired,
	insertCategoryTile: PropTypes.func.isRequired,
	removeCategoryTile: PropTypes.func.isRequired,
	insertNewCategoryTile: PropTypes.func.isRequired,
	updateCategoryTile: PropTypes.func.isRequired,
	deleteCategoryTile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	tiles: state.tiles.categoryTiles
});
 
export default connect(mapStateToProps, { 
	loadCategoryTiles, 
	moveCategoryTile, 
	insertCategoryTile, 
	removeCategoryTile,
	insertNewCategoryTile,
	updateCategoryTile,
	deleteCategoryTile
})(ContentTileEditView);