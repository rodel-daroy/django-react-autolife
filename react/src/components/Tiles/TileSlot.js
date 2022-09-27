import React from 'react';
import PropTypes from 'prop-types';

const TileSlot = ({ size, children, rowOffset, grow, mediaSize }) => {
	let tile = React.Children.only(children);
	tile = React.cloneElement(tile, { rowIndex: Math.floor(rowOffset) });

	return (
		<div className={`tile-slot size-${size} ${grow ? 'grow' : ''} ${mediaSize}`}>
			{tile}
		</div>
	);
};

TileSlot.propTypes = {
	size: PropTypes.oneOf([1, 2]).isRequired,
	rowOffset: PropTypes.number,
	children: PropTypes.node.isRequired,
	grow: PropTypes.bool,
	mediaSize: PropTypes.string
};

TileSlot.defaultProps = {
	size: 1
};

export default TileSlot;

export const TILE_SIZES = {
	'sm': {
		1: 1,
		2: 1
	},
	'md': {
		1: .5,
		2: 1
	},
	'lg': {
		1: .25,
		2: .5
	}
};
