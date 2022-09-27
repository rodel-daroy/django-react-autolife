import * as contact from "../actiontypes/contactActionTypes";

const initialState = {
  contactFormData: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case contact.POST_CONTACT_FORM_DATA:
      return {
        ...state,
        contactFormData: action.payload,
        loading: false
      };
    default:
      return state;
  }
};
