import {
  READ_CATEGORY,
  READ_CATEGORY_REJECT,
  READ_CATEGORY_FULFILLED,
  CREATE_CATEGORY,
  CREATE_CATEGORY_REJECT,
  CREATE_CATEGORY_FULFILLED,
  UPDATE_CATEGORY,
  UPDATE_CATEGORY_REJECT,
  UPDATE_CATEGORY_FULFILLED,
  DELETE_CATEGORY,
  DELETE_CATEGORY_REJECT,
  DELETE_CATEGORY_FULFILLED,
} from "./actionTypes";

const INIT_STATE = {
  list_category: null,
  active_page_category: null,
  total_pages_category: null,
  message_category: null,
  loading: false,
};

const Category = (state = INIT_STATE, action) => {
  switch (action.type) {
    case READ_CATEGORY:
      return {
        ...state,
        loading: true,
      };
    case READ_CATEGORY_REJECT:
      return {
        ...state,
        message: action.payload.message,
        loading: true,
      };
    case READ_CATEGORY_FULFILLED:
      return {
        ...state,
        list_category: action.payload.content,
        active_page_category: action.payload.page,
        total_pages_category: action.payload.totalPages,
        message_category: action.payload.description,
        loading: false,
      };
    case CREATE_CATEGORY:
      return {
        ...state,
        loading: true,
      };
    case CREATE_CATEGORY_REJECT:
      return {
        ...state,
        response_code_category: action.payload.responseCode,
        message_category: action.payload.description,
        loading: true,
      };
    case CREATE_CATEGORY_FULFILLED:
      return {
        ...state,
        response_code_category: action.payload.responseCode,
        message_category: action.payload.description,
        loading: false,
      };
    case UPDATE_CATEGORY:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_CATEGORY_REJECT:
      return {
        ...state,
        response_code_category: action.payload.responseCode,
        message_category: action.payload.description,
        loading: true,
      };
    case UPDATE_CATEGORY_FULFILLED:
      return {
        ...state,
        response_code_category: action.payload.responseCode,
        message_category: action.payload.description,
        loading: false,
      };
    case DELETE_CATEGORY:
      return {
        ...state,
        loading: true,
      };
    case DELETE_CATEGORY_REJECT:
      return {
        ...state,
        response_code_category: action.payload.responseCode,
        message_category: action.payload.description,
        loading: true,
      };
    case DELETE_CATEGORY_FULFILLED:
      return {
        ...state,
        list_category: action.payload.content,
        response_code_category: action.payload.responseCode,
        message_category: action.payload.description,
        loading: false,
      };
    default:
      return state;
  }
};

export default Category;
