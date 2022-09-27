
import * as register from '../actiontypes/RegistrationActionTypes';

const initialState = {
  question: null,
  brands: null,
  lifestyle: null,
  offers: null,
  loading: false,
};


export default (state=initialState, action) => {
  switch(action.type){
    case register.GET_QUEATION:
      return {
        ...state,
        question: action.payload
      }
    case register.GET_BRANDS:
      return {
        ...state,
        brands:action.payload
      }
    case register.GET_OFFERS:
      return {
        ...state,
        offers: action.payload
      }
    case register.GET_LIFESTYLE:
      return {
        ...state,
        lifestyle: action.payload
      }
    default:
      return state;
  }
}