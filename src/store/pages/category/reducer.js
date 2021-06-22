import {
  READ_CATEGORY,
  READ_CATEGORY_REJECT,
  READ_CATEGORY_FULFILLED,
} from "./actionTypes";

const INIT_STATE = {
  list_category: null,
  active_page_category: null,
  total_pages_category: null,
  message: null,
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
        loading: false,
      };
    default:
      return state;
  }
};

export default Category;
