import React from 'react';
import PropTypes from 'prop-types';
import { integer } from 'airbnb-prop-types';
import RadialButton from 'components/Forms/RadialButton';
import { useDrop } from 'react-dnd';
import './TileEditDropzone.scss';

const TileEditDropzone = ({ onInsert, className, index }) => {
	const [{ isOver, canDrop }, dropRef] = useDrop({
		accept: 'tile',

		canDrop: item => {
			const { index: sourceIndex } = item || {};
			return index !== sourceIndex && index !== (sourceIndex + 1);
		},

		drop: () => ({ index }),

		collect: monitor => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop()
		})
	});

	return (
		<div ref={dropRef} className={`tile-edit-dropzone ${isOver ? 'is-over' : ''} ${canDrop ? 'can-drop' : ''} ${className || ''}`}>
			<div className="tile-edit-dropzone-inner">
				<RadialButton 
					className="tile-edit-dropzone-insert" 
					size="large" 
					onClick={() => onInsert(index)} 
					aria-label="Insert" 
					title="Insert">

					<span className="icon icon-plus"></span>
				</RadialButton>
			</div>
		</div>
	);
};

TileEditDropzone.propTypes = {
	index: integer().isRequired,
	onInsert: PropTypes.func.isRequired,
	className: PropTypes.string
};
 
export default TileEditDropzone;