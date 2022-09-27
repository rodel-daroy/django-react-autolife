import { 
    SET_PARALLAX,
    TOGGLE_SCROLLING,
    CHANGE_FOOTER_LAYOUT,
    CHANGE_HEADER_LAYOUT,
    CHANGE_HEADER_STEPPER,
    SET_HEADER_FOOTER_VISIBLE,
    SET_INITIAL_PAGE_LOADED,
    SHOW_HEADER_STEPPER
 } from '../actiontypes/layoutActiontypes';
 
 import { HEADER_LAYOUT_TYPES, FOOTER_LAYOUT_TYPES } from '../../config/constants'

const layoutState = {
    headerLayout: HEADER_LAYOUT_TYPES.DEFAULT,
    footerLayout: FOOTER_LAYOUT_TYPES.DEFAULT,
    headerStepper: {
        show: false,
        start: 1,
        end: 6,
        current: 0
    },
    scrolling: true,
    parallax: null,
    initialPageLoaded :false,
    headerFooterVisible : true
};


export default (state=layoutState, action) => {
    switch(action.type){
        case SET_PARALLAX:
            return {
                ...state,
                parallax: action.payload
            }
        case TOGGLE_SCROLLING:
            return {
                ...state,
                scrolling: action.payload
            }
        case CHANGE_HEADER_STEPPER:
            const { start, end, current, style = ''} = action.payload;
            return {
                ...state,
                headerStepper: {...state.headerStepper, start, end, current, style}
            };
        case CHANGE_HEADER_LAYOUT:
            return {...state, headerLayout: action.payload};
        case CHANGE_FOOTER_LAYOUT:
            return {...state, footerLayout: action.payload}
        case SHOW_HEADER_STEPPER: 
            return {...state, headerStepper: {...state.headerStepper, show: action.payload}};
        case 'LOCATION_CHANGE':
            return {...state,headerLayout: HEADER_LAYOUT_TYPES.DEFAULT, footerLayout:FOOTER_LAYOUT_TYPES.DEFAULT};
        case SET_INITIAL_PAGE_LOADED:
            return {
                ...state,
                initialPageLoaded: true
            };
        case SET_HEADER_FOOTER_VISIBLE:
            return {
                ...state,
                headerFooterVisible: action.payload
            }
        default:
            return state;
    }
}