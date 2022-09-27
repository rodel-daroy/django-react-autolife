import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import usePrevious from "hooks/usePrevious";
import { lookupArticles } from "redux/actions/articlesEditActions";
import isEqual from "lodash/isEqual";

const useArticleLookup = (articleIds = []) => {
  const dispatch = useDispatch();
  const lookup = useCallback(ids => dispatch(lookupArticles({ ids })), [dispatch, lookupArticles]);

  const [articles, setArticles] = useState([]);

  const prevArticleIds = usePrevious(articleIds);
  useEffect(() => {
    if(!isEqual(prevArticleIds, articleIds))
      lookup(articleIds || []);
  }, [prevArticleIds, articleIds]);

  const { result } = useSelector(state => state.articlesEdit.lookup);
  useEffect(() => {
    const newArticles = [];
    for(const articleId of articleIds) {
      // eslint-disable-next-line eqeqeq
      let resultArticle = (result || []).find(a => a.id == articleId);

      if(!resultArticle)
      // eslint-disable-next-line eqeqeq
        resultArticle = articles.find(a => a.id == articleId);

      if(!resultArticle)
        resultArticle = { id: articleId };

      newArticles.push(resultArticle);
    }
  
    setArticles(newArticles);
  }, [result, articleIds, setArticles]);

  return articles;
};

export default useArticleLookup;