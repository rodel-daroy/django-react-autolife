import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ContentTileEditView from './ContentTileEditView';
import TileCategoryDropdown from './TileCategoryDropdown';
import { withRouter } from 'react-router';
import './ContentTilesView.scss';

const ContentTilesView = ({ match: { params: { categoryId } }, history }) => {
	const updateUrl = useCallback(categoryId => {
		history.replace(`/tiles/${categoryId || ''}`);
	}, [history]);
	
	const handleCategoryChange = useCallback(categoryId => {
		updateUrl(categoryId);
	}, [updateUrl]);

	return (
		<div className="content-tiles-view page-width">
			<div className="content-container offset-header">
				<div className="text-container">
					<h1>Tiles</h1>

					<div className="content-tiles-view-filter">
						<TileCategoryDropdown 
							value={categoryId} 
							onChange={handleCategoryChange} />
					</div>
				</div>
					
					{categoryId && (
						<ContentTileEditView 
							categoryId={categoryId} />
					)}
			</div>
		</div>
	);
};

ContentTilesView.propTypes = {
	match: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired
};
 
export default withRouter(ContentTilesView);