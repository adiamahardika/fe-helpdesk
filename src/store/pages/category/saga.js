import { all, call, fork, put, takeLatest } from "redux-saga/effects";

import {
  READ_CATEGORY,
  READ_DETAIL_CATEGORY,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  CHECK_CATEGORY,
} from "./actionTypes";
import {
  readCategoryReject,
  readCategoryFulfilled,
  readDetailCategoryReject,
  readDetailCategoryFulfilled,
  createCategoryReject,
  createCategoryFulfilled,
  updateCategoryReject,
  updateCategoryFulfilled,
  deleteCategoryReject,
  deleteCategoryFulfilled,
  checkCategoryFulfilled,
} from "./actions";
import { getMethod, postMethod, putMethod, deleteMethod } from "../../method";
import general_constant from "../../../helpers/general_constant.json";

function* readCategory({ payload: data }) {
  const response = yield call(getMethod, data);
  if (response.responseCode === general_constant.success_response_code) {
    yield put(
      readCategoryFulfilled({ ...response, is_check_all: data.is_check_all })
    );
  } else {
    yield put(readCategoryReject(response));
  }
}
function* readDetailCategory({ payload: data }) {
  const response = yield call(getMethod, data);
  if (response.responseCode === general_constant.success_response_code) {
    yield put(readDetailCategoryFulfilled(response));
  } else {
    yield put(readDetailCategoryReject(response));
  }
}
function* createCategory({ payload: data }) {
  const response = yield call(postMethod, data);
  if (response.responseCode === general_constant.success_response_code) {
    yield put(createCategoryFulfilled(response));
  } else {
    yield put(createCategoryReject(response));
  }
}
function* updateCategory({ payload: data }) {
  const response = yield call(putMethod, data);
  if (response.responseCode === general_constant.success_response_code) {
    yield put(updateCategoryFulfilled(response));
  } else {
    yield put(updateCategoryReject(response));
  }
}
function* deleteCategory({ payload: data }) {
  const response = yield call(deleteMethod, data);
  if (response.responseCode === general_constant.success_response_code) {
    yield put(deleteCategoryFulfilled(response));
  } else {
    yield put(deleteCategoryReject(response));
  }
}
function* checkCategories({ payload: index }) {
  yield put(checkCategoryFulfilled(index));
}

export function* watchReadCategory() {
  yield takeLatest(READ_CATEGORY, readCategory);
}
export function* watchReadDetailCategory() {
  yield takeLatest(READ_DETAIL_CATEGORY, readDetailCategory);
}
export function* watchCreateCategory() {
  yield takeLatest(CREATE_CATEGORY, createCategory);
}
export function* watchUpdateCategory() {
  yield takeLatest(UPDATE_CATEGORY, updateCategory);
}
export function* watchDeleteCategory() {
  yield takeLatest(DELETE_CATEGORY, deleteCategory);
}
export function* watchCheckCategories() {
  yield takeLatest(CHECK_CATEGORY, checkCategories);
}

function* CategorySaga() {
  yield all([
    fork(watchReadCategory),
    fork(watchReadDetailCategory),
    fork(watchCreateCategory),
    fork(watchUpdateCategory),
    fork(watchDeleteCategory),
    fork(watchCheckCategories),
  ]);
}

export default CategorySaga;
