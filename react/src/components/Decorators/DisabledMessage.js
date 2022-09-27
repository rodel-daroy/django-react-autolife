import React, { Component } from 'react'
import { connect } from 'react-redux'
import { showInfoModal } from '../../redux/actions/infoModalActions';

const DisabledMessage = (defaultMessage = null) => WrappedComponent => {
	const WrapperComponent = ({ disabled, disabledMessage, className, showInfoModal, ...otherProps }) => {
		if(disabled) {
			const handleClick = e => {
				showInfoModal('', disabledMessage || defaultMessage)

				e.preventDefault()
				return false
			}

			return (
				<WrappedComponent
					{...otherProps}
					className={`${className || ''} disabled`}
					onClick={handleClick} />
			)
		}
		else
			return (
				<WrappedComponent
					{...otherProps}
					className={className} />
			)
	}

	WrapperComponent.displayName = `DisabledMessage(${WrappedComponent.displayName || WrappedComponent.name})`

	return connect(null, { showInfoModal })(WrapperComponent)
}

export default DisabledMessage