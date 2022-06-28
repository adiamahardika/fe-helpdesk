import {
  READ_SUB_CATEGORY,
  READ_SUB_CATEGORY_REJECT,
  READ_SUB_CATEGORY_FULFILLED,
} from "./actionTypes";

const INIT_STATE = {
  list_sub_category: null,
  response_code_sub_category: null,
  message_sub_category: null,
  loading: false,
};

const SubCategory = (state = INIT_STATE, action) => {
  switch (action.type) {
    case READ_SUB_CATEGORY:
      return {
        ...state,
        loading: true,
      };
    case READ_SUB_CATEGORY_REJECT:
      return {
        ...state,
        response_code_sub_category: action.payload.status.responseCode,
        message_sub_category: action.payload.status.description[0],
        loading: false,
      };
    case READ_SUB_CATEGORY_FULFILLED:
      return {
        ...state,
        list_sub_category: action.payload.listSubCategory,
        response_code_sub_category: action.payload.status.responseCode,
        message_sub_category: action.payload.status.description[0],
        loading: false,
      };
    default:
      return state;
  }
};

export default SubCategory;
