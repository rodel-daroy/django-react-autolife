import { getUiControllerApi } from "../../services/autolife";

export const GET_UI_CONTROLLER = "app/GET_UI_CONTROLLER";

export const getUiController = (token, name) => async dispatch => {
  const res = await getUiControllerApi(token, name);
  dispatch({
    type: GET_UI_CONTROLLER,
    payload: {
      data: res.data.data,
      name
    }
  });
};
