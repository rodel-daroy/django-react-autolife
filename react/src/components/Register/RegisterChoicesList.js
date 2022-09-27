import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Swipeable from 'react-swipeable'
import Paginator from '../Navigation/Paginator'
import AlphaPaginator from '../Navigation/AlphaPaginator'
import Stepper from '../Navigation/Stepper'
import ToggleButton from '../Forms/ToggleButton'
import PagedList from '../common/PagedList'
import sortBy from 'lodash/sortBy'
import uniq from 'lodash/uniq'
import omit from 'lodash/omit'

export const registerPropsList = {
	choices: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string,
		image: PropTypes.string,
		checked: PropTypes.bool,
		subHeading: PropTypes.string,
	})),
	alpha: PropTypes.bool,
	onChange: PropTypes.func,
	dark: PropTypes.bool,
	choiceComponent: PropTypes.any.isRequired,
	columnSize: PropTypes.number.isRequired,
	visibleColumns: PropTypes.number.isRequired,
	navStyle: PropTypes.oneOf(['paginator', 'stepper']).isRequired,
	className: PropTypes.string
}


class RegisterChoicesList extends Component {
	constructor(props) {
		super(props)

		this.state = {
			activeColumn: 0
		}
	}

	getChoices() {
		const { alpha } = this.props
		let { choices } = this.props

		if(alpha)
			choices = sortBy(choices, ['name'])

		return choices
	}

	handleChange(i, e) {
		const { onChange } = this.props

		if(onChange) {
			onChange(i, e.target.checked)
		}
	}

	handlePreviousPage = () => {
		const { visibleColumns } = this.props

		let { activeColumn } = this.state
		activeColumn -= visibleColumns
		activeColumn = Math.max(0, activeColumn)

		this.setState({
			activeColumn
		})
	}

	handleNextPage = () => {
		const { visibleColumns, columnSize, choices } = this.props
		const columnCount = Math.ceil(choices.length / columnSize)

		let { activeColumn } = this.state
		activeColumn += visibleColumns
		activeColumn = Math.min(columnCount - 1, activeColumn)

		this.setState({
			activeColumn
		})
	}

	handleChangePage = page => {
		const { visibleColumns } = this.props

		this.setState({
			activeColumn: page * visibleColumns
		})
	}

	handleChangeLetter(choices, letter) {
		const { columnSize, visibleColumns } = this.props

		const index = choices.findIndex(item => item.name[0].toLowerCase() === letter)
		const columnIndex = Math.floor(index / columnSize)

		this.setState({
			activeColumn: columnIndex,

			highlight: choices[index]
		})
	}

	renderList(choices) {
		const { alpha, dark, columnSize, visibleColumns } = this.props
		const { activeColumn, highlight } = this.state
		const ChoiceComponent = this.props.choiceComponent

		return (
			<Swipeable onSwipedLeft={this.handleNextPage} onSwipedRight={this.handlePreviousPage} trackMouse>
				<PagedList activeColumn={activeColumn} visibleColumns={visibleColumns} columnSize={columnSize} className="register-choices">
					{choices.map((choice, i) => (
						<ChoiceComponent
							choice={choice}

							key={i}
							dark={dark}
							onChange={this.handleChange.bind(this, choice)}
							pulse={choice === highlight} />
					))}
				</PagedList>
			</Swipeable>
		)
	}

	renderNav(choices) {
		const { alpha, dark, navStyle, visibleColumns, columnSize } = this.props
		const pageSize = visibleColumns * columnSize
		const pageCount = Math.ceil(choices.length / pageSize)

		if(choices.length <= pageSize)
			return null

		const { activeColumn } = this.state

		const first = activeColumn === 0
		const last = (activeColumn + visibleColumns) >= (choices.length / columnSize)

		const stepper = <Stepper dark={dark} orientation="horizontal" first={first} last={last} onPrevious={this.handlePreviousPage} onNext={this.handleNextPage} />

		if(navStyle === 'stepper')
			return stepper
		else {
			if(alpha) {
				const letters = uniq(choices.map(choice => choice.name[0].toLowerCase()).sort())

				// find letter that starts in the active column
				let startIndex = Math.max(0, activeColumn * columnSize - 1)
				let endIndex = Math.min(choices.length - 1, (activeColumn + 1) * columnSize)

				let selectedLetter = choices[startIndex].name[0].toLowerCase()

				for(let i = startIndex + 1; i <= endIndex; ++i) {
					const letter = choices[i].name[0].toLowerCase()

					if(letter !== selectedLetter) {
						selectedLetter = letter
						break
					}
				}

				return (
					<div className="register-choices-footer">
						<AlphaPaginator dark={dark} enabledLetters={letters} selectedLetter={selectedLetter} onChange={this.handleChangeLetter.bind(this, choices)} />
						{stepper}
					</div>
				)
			}
			else {
				const selectedPage = Math.floor(activeColumn / visibleColumns)

				return (
					<div className="register-choices-footer">
						{pageCount > 2 && (
							<Paginator dark={dark} pageCount={pageCount} selectedPage={selectedPage} onChange={this.handleChangePage} />
						)}
						{stepper}
					</div>
				)
			}
		}
	}

	render() {
		const { navStyle, className } = this.props
		const choices = this.getChoices()
		const navClassName = navStyle === 'paginator' ? 'nav-strip' : 'pull-right'

		return (
			<div className={className || ''}>
				{this.renderList(choices)}

				<nav className={navClassName}>
					{this.renderNav(choices)}
				</nav>
			</div>
		)
	}
}

RegisterChoicesList.propTypes = {
	choices: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string,
		image: PropTypes.string,
		checked: PropTypes.bool,
		subHeading: PropTypes.string,
	})),
	alpha: PropTypes.bool,
	onChange: PropTypes.func,
	dark: PropTypes.bool,
	choiceComponent: PropTypes.any.isRequired,
	columnSize: PropTypes.number.isRequired,
	visibleColumns: PropTypes.number.isRequired,
	navStyle: PropTypes.oneOf(['paginator', 'stepper']).isRequired,
	className: PropTypes.string
}

RegisterChoicesList.defaultProps = {
	choiceComponent: props => (
		<ToggleButton
			{...omit(props, ['choice'])}

			caption={props.choice.name}
			image={props.choice.image}
			checked={!!props.choice.checked}
			subHeading={props.choice.subHeading}
		/>
	),
	columnSize: 3,
	visibleColumns: 3,
	navStyle: 'paginator'
}

export default RegisterChoicesList