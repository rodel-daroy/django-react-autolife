import React, { Component } from 'react'
import { connect } from 'react-redux'
import { changeHeaderLayoutAction, changeFooterLayoutAction } from 'redux/actions/layoutActions'
import { HEADER_LAYOUT_TYPES, FOOTER_LAYOUT_TYPES } from 'config/constants'
import ArticleMetaTags from 'components/common/ArticleMetaTags'
import PrimaryButton from 'components/Forms/PrimaryButton'
import '../style.scss'

class NotFoundPage extends Component {
	constructor(props) {
		super(props)

		props.changeHeaderLayout(HEADER_LAYOUT_TYPES.NOT_FOUND)
		props.changeFooterLayout(FOOTER_LAYOUT_TYPES.SOFTREGISTRATION)
	}

	componentWillUnmount() {
		this.props.changeHeaderLayout(HEADER_LAYOUT_TYPES.DEFAULT)
		this.props.changeFooterLayout(FOOTER_LAYOUT_TYPES.DEFAULT)
	}

	render() {
		return (
			<article className="not-found-page page-width">
	  			<ArticleMetaTags title="404 Page Not Found" />
	  	
	    		<div className="text-container text-center offset-header">
	      			<h1>Hmmmm… we can’t seem to find the page you’re looking for.</h1>
	      			<div className="text-center">
	      				<PrimaryButton link="/" dark>
	      					Go to Homepage
	      				</PrimaryButton>
	      			</div>
	    		</div>
			</article>
		)
	}
}

const mapDispatchToProps = {
	changeHeaderLayout: changeHeaderLayoutAction,
	changeFooterLayout: changeFooterLayoutAction
}

export default connect(null, mapDispatchToProps)(NotFoundPage)
