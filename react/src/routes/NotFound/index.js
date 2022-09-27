import asyncComponent from "utils/asyncComponent";

export default asyncComponent(() => 
  import(/* webpackChunkName: 'not-found' */ "./components/NotFoundPage")
);