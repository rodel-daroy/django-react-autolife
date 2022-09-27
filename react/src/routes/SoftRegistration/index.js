import asyncComponent from "utils/asyncComponent";

export default asyncComponent(() =>
  import(/* webpackChunkName: 'registration' */ "./components/SoftRegistrationView")
);