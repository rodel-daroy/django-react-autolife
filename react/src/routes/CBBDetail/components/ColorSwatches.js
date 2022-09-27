import React from 'react';
import PropTypes from 'prop-types';
import './ColorSwatches.scss';

const ColorSwatches = ({ colors, value, onChange }) => {
	const handleClick = color => () => {
		if(onChange)
			onChange(color);
	};

	return (
		<div className="color-swatches" role="radiogroup">
			{colors.map((color, i) => {
				const selected = value === color.id;

				return (
					<button 
						key={i} 
						type="button" 
						role="radio"
						aria-checked={selected}
						aria-label={color.name}
						title={color.name}
						className={`color-swatches-swatch ${selected ? 'selected' : ''}`}
						style={{ backgroundColor: color.color }}
						onClick={handleClick(color)}>

						{selected && <span className="icon icon-checkmark"></span>}
					</button>
				);
			})}
		</div>
	);
};

ColorSwatches.propTypes = {
	colors: PropTypes.arrayOf(PropTypes.shape({
		color: PropTypes.string.isRequired,
		name: PropTypes.string,
		id: PropTypes.any.isRequired
	})),
	value: PropTypes.any,
	onChange: PropTypes.func
};

ColorSwatches.defaultProps = {
	colors: []
};
 
export default ColorSwatches;