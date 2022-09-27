import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PrimaryButton from 'components/Forms/PrimaryButton'
import SortCarsListByPrice from './SortCarsListByPrice'
import Media from 'react-media'
import { mediaQuery } from 'utils/style'
import ShareButton from './ShareButton'
import { getBreadcrumbs, getBackButton } from './'

const ListingHeader = props => {
	const { onSort, url, currentBreadcrumb, breadcrumbs, backLink, hideBackOnDesktop, mobileMenu, mobileTitle } = props

	return (
		<header className="car-listing-header">
			<div className="car-listing-breadcrumbs">
				{getBackButton({ backLink, className: hideBackOnDesktop ? 'hidden-sm hidden-md hidden-lg' : '' })}

				{getBreadcrumbs({ currentBreadcrumb, breadcrumbs, className: 'hidden-xs' })}

				<Media query={mediaQuery('xs')}>
					{matches => matches && mobileTitle && mobileTitle()}
				</Media>
			</div>

			<div className="car-listing-sort">
				<Media query={mediaQuery('xs')}>
					{matches => matches && mobileMenu && mobileMenu()}
				</Media>

				{onSort && (
					<SortCarsListByPrice onChange={onSort} />
				)}

				<ShareButton url={url} />
			</div>
		</header>
	)
}

ListingHeader.props = {
	onSort: PropTypes.func,
	currentBreadcrumb: PropTypes.string,
	breadcrumbs: PropTypes.array,
	backLink: PropTypes.any,
	hideBackOnDesktop: PropTypes.bool,
	mobileTitle: PropTypes.func,
	mobileMenu: PropTypes.func,
	url: PropTypes.string
}

ListingHeader.defaultProps = {
	currentBreadcrumb: 'Shopping Car Listings',
	hideBackOnDesktop: true,
	mobileTitle: () => null,
	mobileMenu: () => null
}

export default ListingHeader