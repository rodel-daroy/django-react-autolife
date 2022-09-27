import {
  HOME_PAGE_LOAD,
  GET_VERSION,
  POLL_RESULT,
  EMPTY_HOME_PAGE
} from "../actiontypes/homeActionstypes";
import {
  USER_AUTHENTICATE_FAIL,
  USER_AUTHENTICATE_SUCCESSFUL,
  USER_LOGOUT
} from "redux/actiontypes/userActionstypes";
import get from "lodash/get";
const homeReducers = {};

export default (state = homeReducers, action) => {
  switch (action.type) {
    case HOME_PAGE_LOAD:
      return { ...state, tilesData: action.payload };
    case GET_VERSION:
      return { ...state, version: action.payload };
    case POLL_RESULT: {
      const pollId = get(action.payload, "data.demands.demand[0].result.id");
      if (pollId) {
        return {
          ...state,
          pollResult: Object.assign({}, state.pollResult, {
            [pollId]: action.payload
          })
        };
      }

      return state;
    }

    case USER_LOGOUT:
    case USER_AUTHENTICATE_SUCCESSFUL:
      return {
        ...state,
        tilesData: {}
      };

    default:
      return state;
  }
};
