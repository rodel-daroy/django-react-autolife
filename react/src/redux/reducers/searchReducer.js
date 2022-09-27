import * as search from "../actiontypes/searchActionTypes";

const initialState = {
  searchData: null,
  loadingSearchData: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case search.GET_SEARCH_RESULT_REQUESTED:
      return {
        ...state,
        loading: true,
        loadingSearchData: false
      };
    case search.GET_SEARCH_RESULT_SUCCESSFUL:
      return {
        ...state,
        searchData: action.payload,
        loading: false,
        loadingSearchData: true
      };
    case search.GET_SEARCH_RESULT_FAIL:
      return {
        ...state,
        loading: false,
        loadingSearchData: false
      };
    default:
      return state;
  }
};
