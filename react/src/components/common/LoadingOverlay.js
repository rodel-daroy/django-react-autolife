import React from 'react';
import Spinner from './Spinner';
import './LoadingOverlay.scss';

const LoadingOverlay = props => {
	return (
		<div className="loading-overlay">
			<div className="loading-overlay-spinner">
				<Spinner {...props} />
			</div>
		</div>
	);
};
 
export default LoadingOverlay;