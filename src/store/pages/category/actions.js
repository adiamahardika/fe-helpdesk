import {
  READ_CATEGORY,
  READ_CATEGORY_REJECT,
  READ_CATEGORY_FULFILLED,
  READ_DETAIL_CATEGORY,
  READ_DETAIL_CATEGORY_REJECT,
  READ_DETAIL_CATEGORY_FULFILLED,
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

// Read Category
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

// Read Detail Category
export const readDetailCategory = (value) => {
  const data = {
    url: `/api/kategori/get-detail/${value}`,
  };
  return {
    type: READ_DETAIL_CATEGORY,
    payload: data,
  };
};

export const readDetailCategoryReject = (payload) => {
  return {
    type: READ_DETAIL_CATEGORY_REJECT,
    payload: payload,
  };
};

export const readDetailCategoryFulfilled = (data) => {
  return {
    type: READ_DETAIL_CATEGORY_FULFILLED,
    payload: data,
  };
};

// Create Category
export const createCategory = (value) => {
  const data = {
    body: value,
    url: `/api/kategori/add`,
  };
  return {
    type: CREATE_CATEGORY,
    payload: data,
  };
};

export const createCategoryReject = (payload) => {
  return {
    type: CREATE_CATEGORY_REJECT,
    payload: payload,
  };
};

export const createCategoryFulfilled = (data) => {
  return {
    type: CREATE_CATEGORY_FULFILLED,
    payload: data,
  };
};

// Update Category
export const updateCategory = (value) => {
  const data = {
    body: value,
    url: `/api/kategori/update`,
  };
  return {
    type: UPDATE_CATEGORY,
    payload: data,
  };
};

export const updateCategoryReject = (payload) => {
  return {
    type: UPDATE_CATEGORY_REJECT,
    payload: payload,
  };
};

export const updateCategoryFulfilled = (data) => {
  return {
    type: UPDATE_CATEGORY_FULFILLED,
    payload: data,
  };
};

// Delete Category
export const deleteCategory = (value) => {
  const data = {
    delete_url: `/api/kategori/delete/${value.id}`,
    read_url: `/api/kategori/get/${value.size}/${value.page_no}/${value.sort_by}/${value.order_by}`,
  };
  return {
    type: DELETE_CATEGORY,
    payload: data,
  };
};

export const deleteCategoryReject = (payload) => {
  return {
    type: DELETE_CATEGORY_REJECT,
    payload: payload,
  };
};

export const deleteCategoryFulfilled = (data) => {
  return {
    type: DELETE_CATEGORY_FULFILLED,
    payload: data,
  };
};
