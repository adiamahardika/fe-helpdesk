import { all, call, fork, put, takeLatest } from "redux-saga/effects";

import { READ_REPORT, READ_COUNT_REPORT_BY_STATUS } from "./actionTypes";
import {
  readReportReject,
  readReportFulfilled,
  readCountReportByStatusReject,
  readCountReportByStatusFulfilled,
} from "./actions";
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
function* readCountReportByStatus({ payload: data }) {
  const response = yield call(postMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(readCountReportByStatusFulfilled(response));
  } else {
    yield put(readCountReportByStatusReject(response));
  }
}

export function* watchReadReport() {
  yield takeLatest(READ_REPORT, readReport);
}
export function* watchReadCountReportByStatus() {
  yield takeLatest(READ_COUNT_REPORT_BY_STATUS, readCountReportByStatus);
}

function* ReportSaga() {
  yield all([fork(watchReadReport), fork(watchReadCountReportByStatus)]);
}

export default ReportSaga;
