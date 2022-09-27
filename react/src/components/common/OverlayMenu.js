import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import RadialButton from '../../components/Forms/RadialButton'
import ExpandIcon from '../../components/common/ExpandIcon'
import { connect } from 'react-redux'
import { toggleScrolling } from '../../redux/actions/layoutActions'

class OverlayMenu extends Component {
	componentDidMount() {
		this.props.toggleScrolling(false)
	}

	componentWillUnmount() {
		this.props.toggleScrolling(true)
	}

	renderMenu() {
		const { children, onClose, canClose, className } = this.props

		return (
			<div className={`overlay-menu ${className || ''}`}>
				<div className="overlay-menu-inner">
					{canClose && (
						<nav className="overlay-menu-nav">
							<button type="button" className="btn btn-link dark" onClick={onClose}>
								Close <RadialButton dark component="div"><ExpandIcon expanded /></RadialButton>
							</button>
						</nav>
					)}

					{children}
				</div>
			</div>
		)
	}

	render() {
		return (
			<Modal
		        isOpen
		        className={{
		          base: 'overlay-menu',
		          afterOpen: '',
		          beforeClose: 'closing'
		        }}
		        overlayClassName={{
		          base: 'menu-modal-overlay',
		          afterOpen: '',
		          beforeClose: 'closing'
		        }}
		        onRequestClose={null}
		        closeTimeoutMS={500}>

				{this.renderMenu()}
			</Modal>
		)
	}
}

OverlayMenu.propTypes = {
	toggle: PropTypes.func,
	children: PropTypes.node,
	onClose: PropTypes.func,
	canClose: PropTypes.bool,
	className: PropTypes.string
}

OverlayMenu.defaultProps = {
	canClose: true
}

export default connect(null, { toggleScrolling })(OverlayMenu)