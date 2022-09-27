import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { ReduxRelatedArticlesSelectorField } from './RelatedArticlesSelectorField';
import './ArticleRelatedArticlesSection.scss';

const ArticleRelatedArticlesSection = () => {
  return (
    <section className="article-related-articles-section">
      <div className="article-related-articles-section-sidebar">
        <Field
          title="Sidebar articles"
          name="secondary_navigation"
          component={ReduxRelatedArticlesSelectorField} />
      </div>
      <div className="article-related-articles-section-bottom">
        <Field
          title="Bottom related articles"
          name="related_articles"
          component={ReduxRelatedArticlesSelectorField} />
      </div>
    </section>
  );
};

ArticleRelatedArticlesSection.propTypes = {
  form: PropTypes.string.isRequired
};
 
export default ArticleRelatedArticlesSection;