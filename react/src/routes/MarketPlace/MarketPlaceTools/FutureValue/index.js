export default store => ({
  path: '/market-place/tools/future-value(/:year)(/:make)(/:model)(/:postal_code)(/:trim)(/:body_style)(/:annual_kms)(/:current_kms)',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const view = require('./view').default;
      cb(null, view);
    }, 'futureValue');
  },
});