import React, { Component } from 'react'
import PropTypes from 'prop-types'

const Sponsor = props => (
	<div className={`sponsor ${props.orientation} ${props.className || ''}`}>
		<div className="sponsor-inner">
			<p>Brought<br /> to&nbsp;you&nbsp;by</p>
			{props.image && <img alt={props.name} src={props.image} />}
			{!props.image && <div className="sponsor-name">{props.name}</div>}
		</div>
	</div>
)

Sponsor.propTypes = {
	name: PropTypes.string,
	image: PropTypes.string,
	className: PropTypes.string,
	orientation: PropTypes.oneOf(['horizontal', 'vertical']).isRequired
}

Sponsor.defaultProps = {
	orientation: 'horizontal'
}

export default Sponsor
