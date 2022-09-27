import * as userController from "../actiontypes/userContainerActionTypes";
const initialState = {
  path: "",
  changeCount: 0
};
export default (state = initialState, action) => {
  switch (action.type) {
    case userController.PATH_SIGNIN:
    case userController.PATH_FORGOT_PASSWORD:
    case userController.PATH_SIGNOUT:
    case userController.PATH_RESET_PASSWORD_PASSWORD:
    case userController.PATH_VERIFY_PASSWORD:
    case userController.UNAUTHORIZED:
    case userController.PATH_SIMPLE_REGISTER:
      return {
        ...state,
        path: action.payload,
        changeCount: state.changeCount + 1
      };
    case userController.CLOSE_MODAL:
      return {
        ...state,
        path: action.payload,
        errorMessage: null,
        errored: false,
      };
    default:
      return state;
  }
};
