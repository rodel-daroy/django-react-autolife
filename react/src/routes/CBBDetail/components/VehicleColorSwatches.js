import React from 'react';
import ColorSwatches from './ColorSwatches';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { withRouter } from 'react-router';

const VehicleColorSwatches = ({ carColors: { evox_id, colors } = {}, currentEvoxId, history, match: { params } }) => {
	const handleChange = ({ id: color_code }) => {
		history.replace(`/shopping/vehicle-details/${params.trim_id}/${params.body_style_id}/${color_code}`);
	};

	// eslint-disable-next-line eqeqeq
	if(evox_id == currentEvoxId) {
		const swatchColors = colors.map(color => ({
			color: `#${color.rgb1}`,
			name: color.title,
			id: color.code
		}));

		return (
			<ColorSwatches colors={swatchColors} value={params.color_code} onChange={handleChange} />
		);
	}

	return null;
};

const mapStateToProps = state => ({
	carColors: state.MarketPlace.carColors,
	currentEvoxId: get(state.MarketPlace, "carDetails.data.evox_id")
});
 
export default withRouter(connect(mapStateToProps)(VehicleColorSwatches));