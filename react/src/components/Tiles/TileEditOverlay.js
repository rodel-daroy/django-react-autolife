import React from 'react';
import { integer } from 'airbnb-prop-types';
import PropTypes from 'prop-types';
import RadialButton from 'components/Forms/RadialButton';
import { useDrag } from 'react-dnd';
import './TileEditOverlay.scss';

const TileEditOverlay = ({ children, onEdit, onDelete, onMove, index }) => {
	const [, dragRef, previewRef] = useDrag({
		item: {
			index,
			type: 'tile',
			onMove
		},
	
		end: ({ onMove }, monitor) => {
			if(!monitor.didDrop())
				return;
	
			const { index: destIndex } = monitor.getDropResult();
	
			onMove(destIndex);
		}
	});

	return (
		<div ref={dragRef} className="tile-edit-overlay">
			<div ref={previewRef} className="tile-edit-overlay-preview">
				{children}
			</div>

			<div className="tile-edit-overlay-controls">
				<div className="tile-edit-overlay-handle">
					<span className="icon icon-ellipsis"></span>
				</div>
				
				<div className="tile-edit-overlay-commands">
					<RadialButton onClick={() => onEdit(index)} aria-label="Edit" title="Edit">
						<span className="icon icon-edit"></span>
					</RadialButton>
					<RadialButton onClick={() => onDelete(index)} aria-label="Delete" title="Delete">
						<span className="icon icon-delete"></span>
					</RadialButton>
				</div>
			</div>
		</div>
	);
};

TileEditOverlay.propTypes = {
	index: integer().isRequired,
	children: PropTypes.node.isRequired,

	onEdit: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	onMove: PropTypes.func.isRequired
};
 
export default TileEditOverlay;