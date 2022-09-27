import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ArticlesCheckList from "./ArticlesCheckList";
import AllArticlesCheckList from "./AllArticlesCheckList";
import ArticlePanel from "./ArticlePanel";
import usePrevious from "hooks/usePrevious";
import "./RelatedArticlesSelector.scss";

const RelatedArticlesSelector = ({ articles, title, onChange }) => {
  const [current, setCurrent] = useState(articles);

  const prevArticles = usePrevious(articles);
  useEffect(() => {
    if(articles !== prevArticles)
      setCurrent(articles || []);
  }, [articles, prevArticles, setCurrent]);

  const handleToggleArticle = (id, article) => {
    let newCurrent;
    // eslint-disable-next-line eqeqeq
    if(!current.find(a => a.id == id))
      newCurrent = [...current, article];
    else
      newCurrent = current.slice().filter(a => a.id !== id);

    setCurrent(newCurrent);

    if(onChange)
      onChange(newCurrent);
  };

  const selected = (current || []).map(a => a.id);

  return (
    <ArticlePanel title={title}>
      <div className="related-articles-selector">
        <div className="related-articles-selector-current">
          <div className="related-articles-selector-list">
            {(current || []).length > 0 && (
              <ArticlesCheckList 
                articles={current} 
                selected={selected}
                onSelect={handleToggleArticle} />
            )}

            {(current || []).length === 0 && (
              <p>
                Please select some articles
                <span className="hidden-sm hidden-xs icon icon-arrow-right"></span>
                <span className="hidden-md hidden-lg icon icon-arrow-down"></span>
              </p>
            )}
          </div>
        </div>

        <div className="related-articles-selector-all">
          <h5>Select articles</h5>

          <div className="related-articles-selector-list">
            <AllArticlesCheckList 
              selected={selected} 
              onSelect={handleToggleArticle}
              pageSize={10} />
          </div>
        </div>
      </div>
    </ArticlePanel>
  );
};

RelatedArticlesSelector.propTypes = {
  articles: PropTypes.array,
  title: PropTypes.node,
  onChange: PropTypes.func
};

RelatedArticlesSelector.defaultProps = {
  title: 'Related articles'
};
 
export default RelatedArticlesSelector;