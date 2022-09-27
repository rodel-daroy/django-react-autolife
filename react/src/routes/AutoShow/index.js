import asyncComponent from 'utils/asyncComponent';

export default asyncComponent(() => 
  import(/* webpackChunkName: 'autoshow' */ './view')
);

export const AutoShowWinView = asyncComponent(() =>
  import(/* webpackChunkName: 'autoshow' */ './components/WinView')
);

export const OttawaAutoShow = asyncComponent(() =>
  import(/* webpackChunkName: 'ottawa' */ './components/Ottawa')
);