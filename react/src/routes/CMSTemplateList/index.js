import asyncComponent from 'utils/asyncComponent';

export default asyncComponent(() => 
  import(/* webpackChunkName: 'admin' */ "./components/CMSTemplateListingView")
);
