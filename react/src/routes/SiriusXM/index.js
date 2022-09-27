import asyncComponent from "utils/asyncComponent";

export default asyncComponent(() => 
  import(/* webpackChunkName: 'sirius-xm' */ "./view")
);
