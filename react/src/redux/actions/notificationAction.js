export const SHOW_NOTIFCATION = "SHOW_NOTIFICATION";

export const showNotification = payload => dispatch => {
  console.log(payload, "test-action-subscrible");
  dispatch({
    type: SHOW_NOTIFCATION,
    payload
  });
  return payload;
};
