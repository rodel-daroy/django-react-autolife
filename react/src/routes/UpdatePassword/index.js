import asyncComponent from "utils/asyncComponent";

export default asyncComponent(() =>
  import(/* webpackChunkName: 'updatepassword' */ "./components/UpdatePasswordView")
);
