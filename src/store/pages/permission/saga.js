import { all, call, fork, put, takeLatest } from "redux-saga/effects";

import { READ_PERMISSION } from "./actionTypes";
import { readPermissionReject, readPermissionFulfilled } from "./actions";
import { getMethod } from "../../method";
import general_constant from "../../../helpers/general_constant.json";

function* readPermission({ payload: data }) {
  const response = yield call(getMethod, data);
  if (response.responseCode === general_constant.success_response_code) {
    yield put(readPermissionFulfilled(response));
  } else {
    yield put(readPermissionReject(response));
  }
}

export function* watchReadPermission() {
  yield takeLatest(READ_PERMISSION, readPermission);
}

function* PermissionSaga() {
  yield all([fork(watchReadPermission)]);
}

export default PermissionSaga;
