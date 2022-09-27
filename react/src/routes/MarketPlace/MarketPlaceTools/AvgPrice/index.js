export default store => ({
  path: '/market-place/tools/average-price(/:year)(/:make)(/:model)(/:postal_code)(/:trim)(/:body_style)',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const view = require('./view').default;
      cb(null, view);
    }, 'marketPlaceTools');
  }
});
