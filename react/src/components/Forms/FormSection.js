import React from 'react'
import PropTypes from 'prop-types'

const FormSection = ({ children, className, title, first, last, nested, ...props }) => (
	<section {...props} className={`form-section ${first ? 'first' : ''} ${last ? 'last' : ''} ${nested ? 'nested' : ''} ${className || ''}`}>
		{title && (
			<header className="form-section-header">
				{title}
			</header>
		)}

		{children}
	</section>
)

FormSection.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	title: PropTypes.node,
	first: PropTypes.bool,
	nested: PropTypes.bool
}

export default FormSection