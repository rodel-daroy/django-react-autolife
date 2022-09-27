import asyncComponent from "utils/asyncComponent";

export default asyncComponent(() =>
  import(/* webpackChunkName: 'insurance' */ "./Landing/view")
);

export const QuoteIntro = asyncComponent(() =>
  import(/* webpackChunkName: 'insurance' */ "./QuoteIntro/view")
);

export const QuoteForm = asyncComponent(() =>
  import(/* webpackChunkName: 'insurance' */ "./Quote/view")
);
