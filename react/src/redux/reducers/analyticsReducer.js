import * as analytics from '../actiontypes/analyticsActionTypes';

const initialState = {
  analytics: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case analytics.GET_ANALYTICS_URL:
      return {
        ...state,
        analytics: action.payload
      };
    default:
      return state;
  }
};
