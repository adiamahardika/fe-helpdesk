import { all, call, fork, put, takeLatest } from "redux-saga/effects";

import { READ_AREA } from "./actionTypes";
import { readAreaReject, readAreaFulfilled } from "./actions";
import { postMethod } from "../../method";
import general_constant from "../../../helpers/general_constant.json";

function* readArea({ payload: data }) {
  const response = yield call(postMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(readAreaFulfilled(response));
  } else {
    yield put(readAreaReject(response));
  }
}

export function* watchReadArea() {
  yield takeLatest(READ_AREA, readArea);
}

function* AreaSaga() {
  yield all([fork(watchReadArea)]);
}

export default AreaSaga;
