import {injectReducer} from 'store/reducers'

export default (store) => ({
    path: '/cbb-loss-report',
    /*  Async getComponent is only invoked when route matches   */
    getComponent(nextState, cb) {
        /*  Webpack - use 'require.ensure' to create a split point
            and embed an async module loader (jsonp) when bundling   */
        require.ensure([], (require) => {
            /*  Webpack - use require callback to define
                dependencies for bundling   */
            const CBBLossReportContainer = require('./containers/CBBLossReportContainer').default
            /*  Return getComponent   */
            cb(null, CBBLossReportContainer)

            /* Webpack named bundle   */
        }, 'cbb-loss-report')
    }
})
