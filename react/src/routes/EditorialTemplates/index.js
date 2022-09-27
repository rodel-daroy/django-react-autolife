import asyncComponent from "utils/asyncComponent";

export default asyncComponent(() =>
  import(/* webpackChunkName: 'articles' */ "./components/CMSPageView")
);