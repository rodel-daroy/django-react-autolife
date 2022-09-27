import asyncComponent from "utils/asyncComponent";

export default asyncComponent(() =>
  import(/* webpackChunkName: 'marketplace' */ "./view")
);

export const BrowseCarDetail = asyncComponent(() =>
  import(/* webpackChunkName: 'marketplace' */ "./MarketPlaceBrowseDetail/components/BrowseDetailView")
);

export const BrowseHome = asyncComponent(() =>
  import(/* webpackChunkName: 'marketplace' */ "./MarketBrowseCar/MarketPlaceBrowseView")
);

export const TradeInValue = asyncComponent(() =>
  import(/* webpackChunkName: 'marketplace' */ "./MarketPlaceTools/TradeInValue/view")
);

export const FutureValue = asyncComponent(() =>
  import(/* webpackChunkName: 'marketplace' */ "./MarketPlaceTools/FutureValue/view")
);

export const AveragePrice = asyncComponent(() =>
  import(/* webpackChunkName: 'marketplace' */ "./MarketPlaceTools/AvgPrice/view")
);

export const Recall = asyncComponent(() => 
  import(/* webpackChunkName: 'recall' */ "./MarketPlaceTools/Recall/view")
);

export const RecallResults = asyncComponent(() =>
  import(/* webpackChunkName: 'recall' */ "./MarketPlaceTools/Recall/components/ResultsView")
);

export const ShopCars = asyncComponent(() =>
  import(/* webpackChunkName: 'marketplace' */ "./ShopForCars/view")
);