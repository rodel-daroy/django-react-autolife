import React from 'react'
import PropTypes from 'prop-types'
import InfoButton from './InfoButton'

const LabelWithInfo = ({ children, className, infoPosition, ...otherProps }) => (
	<span className={`label-with-info ${className || ''}`}>
		{infoPosition === 'left' && <span className="label-with-info-inner"><InfoButton {...otherProps} />&nbsp;</span>}
		{children}
		{infoPosition === 'right' && <span className="label-with-info-inner">&nbsp;<InfoButton {...otherProps} /></span>}
	</span>
)

LabelWithInfo.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node,
	infoPosition: PropTypes.oneOf(['right', 'left']).isRequired,

	...InfoButton.propTypes
}

LabelWithInfo.defaultProps = {
	infoPosition: 'right'
}

export default LabelWithInfo