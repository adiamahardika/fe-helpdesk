import { all, call, fork, put, takeLatest } from "redux-saga/effects";

import { READ_REPORT } from "./actionTypes";
import { readReportReject, readReportFulfilled } from "./actions";
import { postMethod } from "../../method";
import general_constant from "../../../helpers/general_constant.json";

function* readReport({ payload: data }) {
  const response = yield call(postMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(readReportFulfilled(response));
  } else {
    yield put(readReportReject(response));
  }
}

export function* watchReadReport() {
  yield takeLatest(READ_REPORT, readReport);
}

function* ReportSaga() {
  yield all([fork(watchReadReport)]);
}

export default ReportSaga;
