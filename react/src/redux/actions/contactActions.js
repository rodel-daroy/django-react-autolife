import { postContactDataApi } from "../../services/autolife";
import * as contact from "../actiontypes/contactActionTypes";

export const postContactFormData = params => dispatch => {
  return postContactDataApi(params).then(resp => {
    dispatch({
      type: contact.POST_CONTACT_FORM_DATA,
      payload: resp.data
    });
  });
};
