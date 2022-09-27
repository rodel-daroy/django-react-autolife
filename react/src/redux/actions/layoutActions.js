import {
  SET_PARALLAX,
  TOGGLE_SCROLLING,
  CHANGE_FOOTER_LAYOUT,
  CHANGE_HEADER_LAYOUT,
  CHANGE_HEADER_STEPPER,
  SET_HEADER_FOOTER_VISIBLE,
  SET_INITIAL_PAGE_LOADED,
  SHOW_HEADER_STEPPER
} from "../actiontypes/layoutActiontypes";

export const changeHeaderLayoutAction = payload => ({
  type: CHANGE_HEADER_LAYOUT,
  payload
});

export const changeFooterLayoutAction = payload => ({
  type: CHANGE_FOOTER_LAYOUT,
  payload
});

export const changeHeaderStepperAction = payload => ({
  type: CHANGE_HEADER_STEPPER,
  payload
});

export const showHeaderStepperAction = payload => ({
  type: SHOW_HEADER_STEPPER,
  payload
});

export const setInitialPageLoadedAction = () => ({
  type: SET_INITIAL_PAGE_LOADED
});

export const setHeaderFooterVisible = payload => ({
  type: SET_HEADER_FOOTER_VISIBLE,
  payload
});

export const toggleScrolling = payload => async dispatch => {
  dispatch({
    type: TOGGLE_SCROLLING,
    payload
  });
};

export const setParallax = payload => async dispatch => {
  dispatch({
    type: SET_PARALLAX,
    payload
  });
};
