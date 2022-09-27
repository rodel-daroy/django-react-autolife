import React, { Component } from 'react'
import PropTypes from 'prop-types'
import OverlayMenu from '../../components/common/OverlayMenu'
import ExpandButton from '../../components/Forms/ExpandButton'
import CategoryFilter from '../../components/Listings/CategoryFilter'

class BrowseOverlayMenuButton extends Component {
	constructor(props) {
		super(props)

		this.state = {
			showMenu: false
		}
	}

	handleToggle = () => {
		this.setState({
			showMenu: !this.state.showMenu
		})
	}

	render() {
		const { categorySlug, make } = this.props
		const { showMenu } = this.state

		return (
			<div>
				<button type="button" className="btn btn-link categories-menu-button" onClick={this.handleToggle}>
					See All Categories <ExpandButton component="div" />
				</button>

				{showMenu && (
					<OverlayMenu className="browse-categories-menu" onClose={this.handleToggle}>
						<CategoryFilter 
							dark 
							onChange={this.handleToggle} 
							categorySlug={categorySlug}
                        	make={make} />
					</OverlayMenu>
				)}
			</div>
		)
	}
}

BrowseOverlayMenuButton.propTypes = {
	categorySlug: PropTypes.string,
	make: PropTypes.string
}

export default BrowseOverlayMenuButton