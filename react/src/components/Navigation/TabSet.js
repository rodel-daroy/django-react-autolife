import React, { Component } from 'react'
import PropTypes from 'prop-types'

let tabId = 0

class TabSet extends Component {
	constructor(props) {
		super(props)

		this.state = {
			id: ++tabId,
			selected: 0
		}
	}

	static getDerivedStateFromProps(props, state) {
		const { selected } = props;

		if(typeof selected === 'number' && selected !== state.selected)
			return {
				selected
			};

		return null;
	}

	handleChange = i => {
		const { onChange } = this.props;

		this.setState({
			selected: i
		})

		if(onChange)
			onChange(i);
	}

	render() {
		const { name, tabs, className } = this.props
		const { id, selected } = this.state

		let tabId = id

		return (
			<div className={`tab-set ${className || ''}`}>
				<div className="tab-set-tabs">
			        {tabs.map((tab, i) => (
			        	<div key={i} className="tab-set-tab">
			        		<input 
			        			id={`tab${tabId}`} 
			        			type="radio" 
			        			name={name} 
										defaultChecked={i === 0}
										checked={i === selected} 
			        			onChange={() => this.handleChange(i)} />

			        		<label htmlFor={`tab${tabId++}`}>{tab.caption}</label>
			        	</div>
		        	))}
		        </div>

		        <div className="tab-set-content">
		        	{tabs[selected].content()}
		        </div>
	      	</div>
      	)
	}
}

TabSet.propTypes = {
	name: PropTypes.string,
	tabs: PropTypes.arrayOf(PropTypes.shape({
		caption: PropTypes.node,
		content: PropTypes.func
	})),
	className: PropTypes.string,
	selected: PropTypes.number,
	onChange: PropTypes.func
}

export default TabSet