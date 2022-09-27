import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import RelatedArticlesSelector from "./RelatedArticlesSelector";
import useArticleLookup from "./useArticleLookup";
import { makeReduxField } from "components/Forms";

const RelatedArticlesSelectorField = ({ value, onChange, title }) => {
  const articles = useArticleLookup(value);
  const mappedArticles = useMemo(() => {
    return articles.map(a => ({
      id: a.id,
      slug: a.slug,
      heading: a.headline,
      subHeading: a.subheading,
      synopsis: a.synopsis,
      date: a.article_publish_date
    }));
  }, [articles]);

  const handleChange = useCallback(articles => {
    if(onChange) {
      const ids = articles.map(a => a.id);
      onChange(ids);
    }
  }, [onChange]);

  return (
    <RelatedArticlesSelector
      title={title}
      articles={mappedArticles}
      onChange={handleChange} />
  );
};

RelatedArticlesSelectorField.propTypes = {
  value: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func,
  title: PropTypes.node
};
 
export default RelatedArticlesSelectorField;
export const ReduxRelatedArticlesSelectorField = makeReduxField(RelatedArticlesSelectorField);