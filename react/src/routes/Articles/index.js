import asyncComponent from "utils/asyncComponent";

export const ArticleView = asyncComponent(() =>
  import(/* webpackChunkName: 'articles' */ "./components/ArticlesView")
);

export const AllArticlesView = asyncComponent(() =>
  import(/* webpackChunkName: 'articles' */ "./components/ArticlesAllView")
);