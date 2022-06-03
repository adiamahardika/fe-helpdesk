import { all, call, fork, put, takeLatest } from "redux-saga/effects";

import { READ_GRAPARI } from "./actionTypes";
import { readGrapariReject, readGrapariFulfilled } from "./actions";
import { postMethod } from "../../method";
import general_constant from "../../../helpers/general_constant.json";

function* readGrapari({ payload: data }) {
  const response = yield call(postMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(readGrapariFulfilled(response));
  } else {
    yield put(readGrapariReject(response));
  }
}

export function* watchReadGrapari() {
  yield takeLatest(READ_GRAPARI, readGrapari);
}

function* GrapariSaga() {
  yield all([fork(watchReadGrapari)]);
}

export default GrapariSaga;
