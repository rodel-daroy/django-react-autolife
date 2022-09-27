import * as service from 'services/autolife';
import {
  GET_RECALL,
  GET_RECALL_RESULT
} from 'redux/actiontypes/recallActionTypes';
import get from 'lodash/get';

export const getRecall = (year, make, model, token) => async dispatch => {
  dispatch({ type: GET_RECALL });

  const listResult =
    (await service.getRecallList(year, make, model, token)) || {};
  const list = get(listResult, 'data.data', []);

  for (let i = 0; i < list.length; ++i) {
    const recallNo = list[i]['recall-number'];

    const summaryResult = (await service.getRecallSummary(recallNo)) || {};
    const summary = get(summaryResult, 'data.data', []);

    list[i].summary = summary || [];
  }

  dispatch({
    type: GET_RECALL_RESULT,
    payload: list
  });
};
