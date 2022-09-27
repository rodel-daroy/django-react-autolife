import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

const Attribution = props => {
	const { author, date, url,byline_link } = props
	let authorTag = author || url
	if(byline_link)
		authorTag = <a className="btn btn-link" href={byline_link} target="_blank">{author || url}</a>

	return (
		<ul className="attribution">
			<li className="author">{authorTag}</li>
			<li className="date">{moment(date).format('MMMM D, YYYY')}</li>
		</ul>
	)
}

Attribution.propTypes = {
	author: PropTypes.string,
	url: PropTypes.string,
	date: PropTypes.any
}

export default Attribution
