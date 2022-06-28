import { all, call, fork, put, takeLatest } from "redux-saga/effects";

import { READ_SUB_CATEGORY } from "./actionTypes";
import { readSubCategoryReject, readSubCategoryFulfilled } from "./actions";
import { getMethod } from "../../method";
import general_constant from "../../../helpers/general_constant.json";

function* readSubCategory({ payload: data }) {
  const response = yield call(getMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(readSubCategoryFulfilled(response));
  } else {
    yield put(readSubCategoryReject(response));
  }
}

export function* watchReadSubCategory() {
  yield takeLatest(READ_SUB_CATEGORY, readSubCategory);
}

function* SubCategorySaga() {
  yield all([fork(watchReadSubCategory)]);
}

export default SubCategorySaga;
