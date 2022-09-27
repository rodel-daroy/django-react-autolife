import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadArticleList } from "redux/actions/articlesEditActions";
import { articleList } from "redux/selectors/articlesEditSelectors";

export const DEFAULT_PAGE_SIZE = 20;

const useArticleList = ({ filter, pageSize = DEFAULT_PAGE_SIZE, pageIndex = 0 }) => {
  const [allArticles, setAllArticles] = useState([]);
  const [currentTotalCount, setCurrentTotalCount] = useState(0);

  const dispatch = useDispatch();

  const selector = useCallback(articleList(filter), [filter]);
  const result = useSelector(selector);
  const { articles, totalCount, loading } = result;

  const startIndex = pageIndex * pageSize;

  useEffect(() => {
    setAllArticles([]);
    setCurrentTotalCount(0);
  }, [filter]);

  useEffect(() => {
    dispatch(loadArticleList({
      startIndex,
      count: pageSize,
      filter
    }));
  }, [filter, startIndex, pageSize]);

  useEffect(() => {
    if (!loading && articles && totalCount) {
      setCurrentTotalCount(totalCount);

      const all = allArticles.slice();
      all.length = currentTotalCount;

      for (let i = 0; i < articles.length; ++i)
        all[i + startIndex] = articles[i];

      setAllArticles(all);
    }
  }, [result]);

  const pageCount = Math.floor((currentTotalCount || 0) / (pageSize || 1));

  const currentPage = allArticles.slice(startIndex, startIndex + pageSize);

  return {
    loading,
    totalCount: currentTotalCount,
    pageCount,
    currentPage
  };
};

export default useArticleList;
