import { getAnalyticsUrlApi } from './../../services/autolife';
import * as analytics from '../actiontypes/analyticsActionTypes';

export const getAnalyticsUrl = token => async dispatch => {
  const res = await getAnalyticsUrlApi(token);
  console.log(res.data, 'analytics-data');
  dispatch({
    type: analytics.GET_ANALYTICS_URL,
    payload: res.data
  });
  return res.data.url;
};
