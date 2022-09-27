import React, { Component } from 'react'
import PropTypes from 'prop-types'

const AdBanner = ({ zoneId, className }) => {
	const adHtml = window.OA_output ? window.OA_output[zoneId] : null

	if(adHtml)
		return (
			<div className={`ad-banner ${className || ''}`} dangerouslySetInnerHTML={{ __html: adHtml }}>
			</div>
		)
	else
		return null
}

AdBanner.propTypes = {
	zoneId: PropTypes.any.isRequired,
	className: PropTypes.string
}

export default AdBanner