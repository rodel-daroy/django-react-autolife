import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DropdownField from 'components/Forms/DropdownField';
import { connect } from 'react-redux';
import { loadArticleList } from 'redux/actions/articlesEditActions';
import omit from 'lodash/omit';
import { makeReduxField } from 'components/Forms';
import './ArticleField.scss';

export const getArticleOption = ({ id, heading, slug }) => ({
	value: id,
	label: (
		<div className="article-field-option">
			<div className="article-field-option-heading">{heading}</div>
			<div className="article-field-option-slug">/content/{slug || ''}</div>
		</div>
	),
	slug: slug
});

let ArticleField = 
	class ArticleField extends Component {
		loadArticles = async search => {
			const { loadArticleList } = this.props;

			const { articles } = await loadArticleList({ 
				startIndex: 0, 
				count: 50, 
				filter: search
			});

			return {
				options: articles.map(article => getArticleOption({
					id: article.content_id,
					heading: article.heading,
					slug: article.slug
				}))
			};
		}

		handleChange = option => {
			const { onChange } = this.props;
			if(onChange)
				onChange(option);
		}

		render() {
			// eslint-disable-next-line no-unused-vars
			const { loadArticleList, className, ...otherProps } = this.props;

			return (
				<DropdownField 
					{...otherProps} 
					className={`article-field ${className || ''}`}
					loadOptions={this.loadArticles}
					searchable
					onChange={this.handleChange} />
			);
		}
	};

ArticleField.propTypes = {
	loadArticleList: PropTypes.func.isRequired,

	// eslint-disable-next-line react/forbid-foreign-prop-types
	...omit(DropdownField.propTypes, ['options']),
};

ArticleField.defaultProps = {
	...DropdownField.defaultProps
};

ArticleField = connect(null, { loadArticleList })(ArticleField);

export default ArticleField;
export const ReduxArticleField = makeReduxField(ArticleField);
