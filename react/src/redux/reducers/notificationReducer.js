import { SHOW_NOTIFCATION } from "../actions/notificationAction";

const initialState = {
  notification: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_NOTIFCATION:
      return { ...state, notification: action.payload };
    default:
      return state;
  }
};
