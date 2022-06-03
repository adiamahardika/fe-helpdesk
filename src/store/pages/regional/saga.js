import { all, call, fork, put, takeLatest } from "redux-saga/effects";

import { READ_REGIONAL } from "./actionTypes";
import { readRegionalReject, readRegionalFulfilled } from "./actions";
import { postMethod } from "../../method";
import general_constant from "../../../helpers/general_constant.json";

function* readRegional({ payload: data }) {
  const response = yield call(postMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(readRegionalFulfilled(response));
  } else {
    yield put(readRegionalReject(response));
  }
}

export function* watchReadRegional() {
  yield takeLatest(READ_REGIONAL, readRegional);
}

function* RegionalSaga() {
  yield all([fork(watchReadRegional)]);
}

export default RegionalSaga;
