import * as infoModal from "../actiontypes/infoModalActionTypes";

const initialState = {
  title: "title",
  content: "",
  isOpen: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case infoModal.SHOW_INFO_MODAL:
      return { ...state, ...action.payload, isOpen: true };
    case infoModal.CLOSE_INFO_MODAL:
    case "LOCATION_CHANGE": // close if user goes to another route
      return { ...state, title: "", content: "", isOpen: false };
    default:
      return state;
  }
};
