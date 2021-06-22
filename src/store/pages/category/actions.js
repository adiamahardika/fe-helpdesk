import {
  READ_CATEGORY,
  READ_CATEGORY_REJECT,
  READ_CATEGORY_FULFILLED,
} from "./actionTypes";

export const readCategory = (value) => {
  const data = {
    url: `/api/kategori/get/${value.size}/${value.page_no}/${value.sort_by}/${value.order_by}`,
  };
  return {
    type: READ_CATEGORY,
    payload: data,
  };
};

export const readCategoryReject = (payload) => {
  return {
    type: READ_CATEGORY_REJECT,
    payload: payload,
  };
};

export const readCategoryFulfilled = (data) => {
  return {
    type: READ_CATEGORY_FULFILLED,
    payload: data,
  };
};
