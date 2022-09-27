import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeHeaderLayoutAction, changeFooterLayoutAction } from 'redux/actions/layoutActions';
import { HEADER_LAYOUT_TYPES, FOOTER_LAYOUT_TYPES } from 'config/constants';
import ArticleMetaTags from 'components/common/ArticleMetaTags';
import NotificationBox from './components/NotificationBox';
import './style.scss';

class ShoppingPlaceholder extends Component {
	constructor(props) {
		super(props);

		props.changeHeaderLayout(HEADER_LAYOUT_TYPES.NOT_FOUND);
		props.changeFooterLayout(FOOTER_LAYOUT_TYPES.SOFTREGISTRATION);
	}

	componentWillUnmount() {
		this.props.changeHeaderLayout(HEADER_LAYOUT_TYPES.DEFAULT);
		this.props.changeFooterLayout(FOOTER_LAYOUT_TYPES.DEFAULT);
	}

	render() {
		return (
			<article className="shopping-placeholder page-width">
	  			<ArticleMetaTags title="Coming Soon" />
	  	
	    		<div className="text-container text-center offset-header">
	      			<h1>Coming soon</h1>
							<h2>We are building a faster, easier and more convenient shopping experience.</h2>

							<NotificationBox />
	    		</div>
			</article>
		);
	}
}

const mapDispatchToProps = {
	changeHeaderLayout: changeHeaderLayoutAction,
	changeFooterLayout: changeFooterLayoutAction
};

export default connect(null, mapDispatchToProps)(ShoppingPlaceholder);
