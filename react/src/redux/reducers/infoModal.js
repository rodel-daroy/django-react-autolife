import { SHOW_INFO_MODAL, CLOSE_INFO_MODAL } from '../actions/infoModalActions';

const initialState = {
    title: 'title',
    content: '',
    isOpen: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_INFO_MODAL:
      return { ...state, ...action.payload, isOpen:true }
    case CLOSE_INFO_MODAL:
    case 'LOCATION_CHANGE': // close if user goes to another route
     return { ...state, title:'', content:'', isOpen:false }
    default:
      return state
  }
}

