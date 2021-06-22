import { all, call, fork, put, takeLatest } from "redux-saga/effects";

import { READ_CATEGORY } from "./actionTypes";
import { readCategoryReject, readCategoryFulfilled } from "./actions";
import { getMethod } from "../../method";
import general_constant from "../../../helpers/general_constant.json";

function* readCategory({ payload: data }) {
  const response = yield call(getMethod, data);
  if (response.responseCode === general_constant.success_response_code) {
    yield put(readCategoryFulfilled(response));
  } else {
    yield put(readCategoryReject(response));
  }
}

export function* watchReadCategory() {
  yield takeLatest(READ_CATEGORY, readCategory);
}

function* CategorySaga() {
  yield all([fork(watchReadCategory)]);
}

export default CategorySaga;
