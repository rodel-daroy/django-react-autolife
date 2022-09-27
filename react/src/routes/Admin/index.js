import asyncComponent from "utils/asyncComponent";

export default asyncComponent(() =>
  import(/* webpackChunkName: 'admin' */ "./components/ContentListView")
);

export const ArticleEditView = asyncComponent(() =>
  import(/* webpackChunkName: 'admin' */ "./components/Articles/ArticleEditView")
);

export const ContentTilesView = asyncComponent(() => 
  import(/* webpackChunkName: 'admin' */ "./components/Tiles/ContentTilesView")
);