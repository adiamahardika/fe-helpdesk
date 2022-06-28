import {
  READ_SUB_CATEGORY,
  READ_SUB_CATEGORY_REJECT,
  READ_SUB_CATEGORY_FULFILLED,
} from "./actionTypes";

export const readSubCategory = (value) => {
  const data = {
    url: `/v1/sub-category/get`,
    body: value,
  };
  return {
    type: READ_SUB_CATEGORY,
    payload: data,
  };
};

export const readSubCategoryReject = (payload) => {
  return {
    type: READ_SUB_CATEGORY_REJECT,
    payload: payload,
  };
};

export const readSubCategoryFulfilled = (data) => {
  return {
    type: READ_SUB_CATEGORY_FULFILLED,
    payload: data,
  };
};
