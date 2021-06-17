import { all, call, fork, put, takeLatest } from "redux-saga/effects";

import { READ_PERMISSION } from "./actionTypes";
import { readPermissionReject, readPermissionFulfilled } from "./actions";
import { readPermissionMethod } from "./method";
import general_constant from "../../../helpers/general_constant.json";

function* readPermission() {
  const data = yield call(readPermissionMethod);
  if (data.responseCode === general_constant.success_response_code) {
    yield put(readPermissionFulfilled(data));
  } else {
    yield put(readPermissionReject(data));
  }
}

export function* watchReadPermission() {
  yield takeLatest(READ_PERMISSION, readPermission);
}

function* PermissionSaga() {
  yield all([fork(watchReadPermission)]);
}

export default PermissionSaga;
