import React, { Component } from 'react'
import PropTypes from 'prop-types'

const IncentivesSection = ({ children }) => (
	<section className="incentives-section content-strip">
		<div className="incentives-section-inner">
			<div className="incentive-image"></div>

			{children}
		</div>
	</section>
)

export default IncentivesSection