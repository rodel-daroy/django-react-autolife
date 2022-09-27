import get from "lodash/get";

export const selectArticles = ({ mappingId, userRelated }, defaultValue = {}) => state =>
  get(state, `articlesBrowse.${userRelated ? 'userArticles' : 'articles'}[${mappingId}]`, defaultValue);

export const selectArticle = ({ mappingId, userRelated }, index = 0) => state => {
  const articles = selectArticles({ mappingId, userRelated })(state);

  return (articles.all || [])[index];
};

export const articlesLoading = ({ mappingId, userRelated }) => state =>
  get(state, `articlesBrowse.${userRelated ? 'userArticles' : 'articles'}[${mappingId}].loading`, false);