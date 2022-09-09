import { all, call, fork, put, takeLatest } from "redux-saga/effects";

import {
  READ_REPORT,
  READ_COUNT_REPORT_ACTIVITY,
  READ_COUNT_REPORT_STATUS,
} from "./actionTypes";
import {
  readReportReject,
  readReportFulfilled,
  readCountReportActivityReject,
  readCountReportActivityFulfilled,
  readCountReportStatusReject,
  readCountReportStatusFulfilled,
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
function* readCountReportActivity({ payload: data }) {
  const response = yield call(postMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(readCountReportActivityFulfilled(response));
  } else {
    yield put(readCountReportActivityReject(response));
  }
}
function* readCountReportStatus({ payload: data }) {
  const response = yield call(postMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(readCountReportStatusFulfilled(response));
  } else {
    yield put(readCountReportStatusReject(response));
  }
}

export function* watchReadReport() {
  yield takeLatest(READ_REPORT, readReport);
}
export function* watchReadCountReportActivity() {
  yield takeLatest(READ_COUNT_REPORT_ACTIVITY, readCountReportActivity);
}
export function* watchReadCountReportStatus() {
  yield takeLatest(READ_COUNT_REPORT_STATUS, readCountReportStatus);
}

function* ReportSaga() {
  yield all([
    fork(watchReadReport),
    fork(watchReadCountReportActivity),
    fork(watchReadCountReportStatus),
  ]);
}

export default ReportSaga;
