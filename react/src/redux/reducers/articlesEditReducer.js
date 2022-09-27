import { 
  UPDATE_ARTICLE_REQUEST, 
  UPDATE_ARTICLE, 
  UPDATE_ARTICLE_FAIL, 
  LOAD_ARTICLE_REQUEST, 
  LOAD_ARTICLE, 
  LOAD_ARTICLE_FAIL, 
  CREATE_ARTICLE, 
  CREATE_ARTICLE_REQUEST, 
  CREATE_ARTICLE_FAIL, 
  LOAD_ARTICLE_LIST_REQUEST, 
  LOAD_ARTICLE_LIST, 
  LOAD_ARTICLE_LIST_FAIL, 
  LOOKUP_ARTICLES, 
  LOOKUP_ARTICLES_REQUEST, 
  LOOKUP_ARTICLES_FAIL, 
  LOOKUP_SPONSORS,
  LOOKUP_SPONSORS_REQUEST,
  LOOKUP_SPONSORS_FAIL
} from "redux/actiontypes/articlesEditActionTypes";
import { combineReducers } from "redux";
import { getFilterKey } from "redux/selectors/articlesEditSelectors";

const request = (state, action) => ({
  ...state,
  loading: true
});

const complete = (state, action) => ({
  ...state,
  loading: false,
  result: action.result
});

const fail = (state, action) => ({
  ...state,
  loading: false
});

const article = (state = {}, action) => {
  const { type } = action;

  switch(type) {
    case UPDATE_ARTICLE_REQUEST: return request(state, action);
    case UPDATE_ARTICLE: return complete(state, action);
    case UPDATE_ARTICLE_FAIL: return fail(state, action);

    case LOAD_ARTICLE_REQUEST: return request(state, action);
    case LOAD_ARTICLE: return complete(state, action);
    case LOAD_ARTICLE_FAIL: return fail(state, action);

    case CREATE_ARTICLE_REQUEST: return request(state, action);
    case CREATE_ARTICLE: return complete(state, action);
    case CREATE_ARTICLE_FAIL: return fail(state, action);

    default:
        return state;
  }
};

const articleListInitialState = {
  list: {}
};

const articleList = (state = articleListInitialState, action) => {
  const { type, payload, result } = action || {};
  const { filter } = payload || {};
  
  const key = getFilterKey(filter);
  const list = state.list || {};

  switch(type) {
    case LOAD_ARTICLE_LIST_REQUEST: {
      return {
        ...state,

        list: {
          ...list,

          [key]: {
            loading: true
          }
        }
      };
    }

    case LOAD_ARTICLE_LIST: {
      return {
        ...state,
        
        list: {
          ...list,

          [key]: {
            loading: false,
            ...result
          }
        }
      };
    }
    case LOAD_ARTICLE_LIST_FAIL: {
      return {
        ...state,

        list: {
          ...list,

          [key]: {
            loading: false
          }
        }
      };
    }

    default: 
      return state;
  }
};

const lookup = (state = {}, action) => {
  const { type, result } = action;

  switch(type) {
    case LOOKUP_ARTICLES_REQUEST: {
      return {
        ...state,
        loading: true
      };
    }

    case LOOKUP_ARTICLES: {
      const newResult = [...(state.result || [])];
      for(const newArticle of result) {
        const currentIndex = newResult.findIndex(a => a.id === newArticle.id);

        if(currentIndex > -1)
          newResult[currentIndex] = newArticle;
        else
          newResult.push(newArticle);
      }

      return {
        ...state,
        loading: false,
        result: newResult
      };
    }

    case LOOKUP_ARTICLES_FAIL: {
      return {
        ...state,
        loading: false
      };
    }

    default:
      return state;
  }
};

const sponsors = (state = {}, action) => {
  switch(action.type) {
    case LOOKUP_SPONSORS_REQUEST:
    case LOOKUP_SPONSORS_FAIL: {
      return {
        ...state,
        loading: true
      };
    }

    case LOOKUP_SPONSORS: {
      return {
        ...state,
        loading: false,
        result: action.result
      };
    }

    default: 
      return state;
  }
};

export default combineReducers({
  article,
  articleList,
  lookup,
  sponsors
});