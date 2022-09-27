import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Animate from '../Animation/Animate'
import PrimaryButton from '../Forms/PrimaryButton'
import pull from 'lodash/pull'
import DisabledMessage from '../Decorators/DisabledMessage'

const RegisterSection = props => {
	const { active } = props
	let children = React.Children.toArray(props.children)

	let header = children.find(child => child.type === RegisterSection.Header)
	let footer = children.find(child => child.type === RegisterSection.Footer)

	pull(children, header, footer)

	return (
		<section className={`register-section ${active ? 'active' : ''}`}>
			<div className="register-section-inner">
				{header}

				{children && (
					<div className="register-section-body">
						{children}
					</div>
				)}

				{footer}
			</div>
		</section>
	)
}

RegisterSection.propTypes = {
	active: PropTypes.bool,
	children: PropTypes.any
}

RegisterSection.Header = props => {
	const { active } = props

	let { children } = props
	if(typeof children === 'string') {
		children = <h1>{children}</h1>
	}

	return (
		<header className="register-section-header">
			<Animate active={active}><div>{children}</div></Animate>
		</header>
	)
}

RegisterSection.Header.propTypes = {
	title: PropTypes.oneOf([PropTypes.string, PropTypes.node]),
	active: PropTypes.bool
}

const ContinueButton = DisabledMessage()(PrimaryButton)

RegisterSection.Footer = props => {
	const { onContinue, active, onSkip, children, canSkip, canContinue, showContinue } = props

	const continueButton = <ContinueButton dark type="button" disabledMessage="Please select an option" className="continue-button" caption="Continue" onClick={onContinue} disabled={!props.isSelected || !canContinue} />
	const skipButton = <button type="button" className="btn btn-link dark skip-button" onClick={onSkip}>Skip this &gt;</button>

	return (
		<footer className="register-section-footer">
			<div>
				{showContinue && (
					<Animate active={active}>
						{continueButton}
					</Animate>
				)}

				{canSkip && (
					<Animate active={active} last>
						{skipButton}
					</Animate>
				)}
			</div>

			<Animate active={active} last={!canSkip}>
				<div>
					{children}
				</div>
			</Animate>
		</footer>
	)
}

RegisterSection.Footer.propTypes = {
	onContinue: PropTypes.func,
	active: PropTypes.bool,
	onSkip: PropTypes.func,
	children: PropTypes.node,
	canSkip: PropTypes.bool,
	canContinue: PropTypes.bool,
	showContinue: PropTypes.bool
}

RegisterSection.Footer.defaultProps = {
	canSkip: true,
	showContinue: true
}

export default RegisterSection
