import { LOG_ERROR } from '../actiontypes/commonActionTypes';

const ERROR_BUFFER_SIZE = 20;

const initialState = {
  errors: []
};

export default (state = initialState, action) => {
  switch(action.type) {
    case LOG_ERROR: {
      let error = action.payload;
      if(typeof action.payload !== 'object')
        error = {
          message: action.payload
        };

      return {
        ...state,
        errors: [...state.errors.slice(-(ERROR_BUFFER_SIZE - 1)), error]
      };
    }

    default:
      return state;
  }
};