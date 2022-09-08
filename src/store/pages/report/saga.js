import { all, call, fork, put, takeLatest } from "redux-saga/effects";

import { READ_REPORT, READ_COUNT_REPORT_ACTIVITY } from "./actionTypes";
import {
  readReportReject,
  readReportFulfilled,
  readCountReportActivityReject,
  readCountReportActivityFulfilled,
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

export function* watchReadReport() {
  yield takeLatest(READ_REPORT, readReport);
}
export function* watchReadCountReportActivity() {
  yield takeLatest(READ_COUNT_REPORT_ACTIVITY, readCountReportActivity);
}

function* ReportSaga() {
  yield all([fork(watchReadReport), fork(watchReadCountReportActivity)]);
}

export default ReportSaga;
