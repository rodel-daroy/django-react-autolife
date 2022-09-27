import React from 'react';
import PropTypes from 'prop-types';
import Spinner from 'components/common/Spinner';
import './EmptyState.scss';

const EmptyState = ({ className, children, inline, ...otherProps }) => {
	if(React.Children.count(children) === 0)
		children = 'Please select an item';

	return (
		<div {...otherProps} className={`empty-state ${inline ? 'inline' : ''} ${className || ''}`}>
			{children}
		</div>
	);
};

EmptyState.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node,
	inline: PropTypes.bool
};

EmptyState.Loading = ({ children, ...otherProps }) => (
	<EmptyState {...otherProps}>
		<div>
			<Spinner />

			{children}
		</div>
	</EmptyState>
);

EmptyState.Loading.propTypes = {
	children: PropTypes.node
};

EmptyState.Loading.displayName = 'EmptyState.Loading';
 
export default EmptyState;