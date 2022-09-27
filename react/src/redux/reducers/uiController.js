import { GET_UI_CONTROLLER } from "../actions/uiController";

const initialState = {
  controllers: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_UI_CONTROLLER:
      return {
        ...state,
        controllers: Object.assign({}, state.controllers, {
          [action.payload.name]: action.payload.data
        })
      };
    default:
      return state;
  }
};
