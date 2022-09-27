import get from "lodash/get";

export const getFilterKey = (filter = null) => JSON.stringify(filter);

export const articleList = (filter = null) => state => {
  const key = getFilterKey(filter);
  
  return get(state, `articlesEdit.articleList.list['${key}']`, {});
};