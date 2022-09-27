import * as infoModal from "../actiontypes/infoModalActionTypes";

export const showInfoModal = (title, content) => ({
  type: infoModal.SHOW_INFO_MODAL,
  payload: { title, content }
});
export const closeInfoModal = payload => ({
  type: infoModal.CLOSE_INFO_MODAL,
  payload
});
