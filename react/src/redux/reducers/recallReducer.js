import {
  GET_RECALL_RESULT,
  GET_RECALL
} from "redux/actiontypes/recallActionTypes";

const initialState = {
  loading: false,
  recall: null
};

export default (state = initialState, { type, payload }) => {
  switch(type) {
    case GET_RECALL: {
      return {
        ...state,

        loading: true
      };
    }

    case GET_RECALL_RESULT: {
      return {
        ...state,

        loading: false,
        recall: payload
      };
    }

    default:
      return state;
  }
};