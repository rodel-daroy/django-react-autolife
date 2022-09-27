import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Waypoint } from 'react-waypoint'

import './style.scss'

class Youtube extends Component {
	constructor(props) {
		super(props)

		this.state = {
			entered: false
		}
	}

	handleEnter = () => {
		this.setState({
			entered: true
		})
	}

	render() {
		const { videoId, aspectRatio } = this.props
		const { entered } = this.state

		const paddingTop = `${aspectRatio * 100}%`

		// React v15 doesn't support the allow attribute
		const iframe = `<iframe 
			src="https://www.youtube.com/embed/${videoId}?rel=0"
			frameborder="0" 
			allow="autoplay; encrypted-media" 
			allowfullscreen></iframe>`

		return (
			<Waypoint onEnter={this.handleEnter}>
				<div className="video-youtube">
					{entered && (
						<div className="video-youtube-inner" style={{ paddingTop }} dangerouslySetInnerHTML={{ __html: iframe }}>
						</div>
					)}
				</div>
			</Waypoint>
		)
	}
}

Youtube.propTypes = {
	videoId: PropTypes.string.isRequired,
	aspectRatio: PropTypes.number.isRequired
}

Youtube.defaultProps = {
	aspectRatio: .5625
}

export default Youtube