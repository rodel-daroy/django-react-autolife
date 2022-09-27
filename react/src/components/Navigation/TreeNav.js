import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Accordion from '../../components/common/Accordion'
import AccordionGroup from '../../components/common/AccordionGroup'
import ExpandIcon from '../../components/common/ExpandIcon'
import ExpandButton from '../../components/Forms/ExpandButton'
import { Link } from 'react-router-dom'
import Media from 'react-media'
import { mediaQuery } from '../../utils/style'

const DEFAULT_TOP = 100

class TreeNav extends Component {
	handleIndexChange = index => {
		const { onExpandCategory, categories } = this.props

		if(index !== -1) {
			if(onExpandCategory && categories && categories.length > index) {
				onExpandCategory(categories[index])
			}
		}
		else {
			if(onExpandCategory) onExpandCategory(null)
		}
	}

	handleChange = (category, subCategory) => {
		const { onChange } = this.props

		if(onChange) onChange(category, subCategory)
	}

	handleCategory = (category, e) => {
		e.stopPropagation()

		this.handleChange(category)
	}

	renderSubCategories(category) {
		const { activeSubCategoryId, activeCategoryId } = this.props

		const subCategories = category.subCategories || []

		return (
			<ul className="tree-nav-subcategories">
				{subCategories.map((subCategory, i) => {
					const active = activeSubCategoryId == subCategory.id && category.id == activeCategoryId

					const Component = subCategory.link ? Link : 'button'

					return (
						<li key={i}>
							<Component to={subCategory.link} className={`btn btn-link ${active ? 'active' : ''}`} onClick={this.handleChange.bind(this, category, subCategory)} role="treeitem">
								{subCategory.name}
							</Component>
						</li>
					)
				})}
			</ul>
		)
	}

	renderIcon = small => ({ open, hover }) => {
		const { dark } = this.props

		if(small)
			return <ExpandButton className="tree-nav-expand" dark={dark} expanded={open} component="div" hover={hover} /> 
		else
			return <ExpandIcon className="tree-nav-expand" expanded={open} />
	}

	renderCategories(small) {
		const { categories, expandedCategoryId, activeCategoryId } = this.props

		let index = -1
		if(categories && expandedCategoryId) {
			index = categories.findIndex(category => category.id == expandedCategoryId)
		}

		return (
			<div>
				<AccordionGroup index={index} onChange={this.handleIndexChange}>
					{(categories || []).map((category, i) => {
						const active = category.id == activeCategoryId

						const Component = category.link ? Link : 'button';

						return (
							<Accordion key={i} aria-label={category.name}>
								<Accordion.Header icon={this.renderIcon(small)}>
									<Component to={category.link} className={`btn btn-link ${active ? 'active' : ''}`} onClick={this.handleCategory.bind(this, category)}>
										{category.name}
									</Component>
								</Accordion.Header>
								<Accordion.Body>
									{this.renderSubCategories(category)}
								</Accordion.Body>
							</Accordion>
						)})
					}
				</AccordionGroup>
			</div>
		)
	}

	renderInner = small => {
		const { children, top, title, dark } = this.props

		return (
			<nav className={`side-nav tree-nav ${small ? 'small' : 'large'} ${dark ? 'dark' : ''}`}>
      			{title && <h3>{title}</h3>}

	        	{this.renderCategories(small)}
      		</nav>
	    )
	}

	render() {
		return (
			<Media query={mediaQuery('xs sm')}>
	      		{this.renderInner}
	      	</Media>
		)
	}
}

const Category = {
	id: PropTypes.any,
	name: PropTypes.string.isRequired,
	link: PropTypes.string
}

TreeNav.props = {
	top: PropTypes.number,
	categories: PropTypes.arrayOf(PropTypes.shape({
		...Category,

		subCategories: PropTypes.arrayOf(PropTypes.shape(Category))
	})),

	onExpandCategory: PropTypes.func,

	expandedCategoryId: PropTypes.any,
	activeCategoryId: PropTypes.any,
	activeSubCategoryId: PropTypes.any,

	onChange: PropTypes.func,

	title: PropTypes.string,
	dark: PropTypes.bool
}

TreeNav.defaultProps = {
	top: DEFAULT_TOP
}

export default TreeNav