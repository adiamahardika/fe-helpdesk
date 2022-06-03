import { all, call, fork, put, takeLatest } from "redux-saga/effects";

import { READ_TERMINAL } from "./actionTypes";
import { readTerminalReject, readTerminalFulfilled } from "./actions";
import { postMethod } from "../../method";
import general_constant from "../../../helpers/general_constant.json";

function* readTerminal({ payload: data }) {
  const response = yield call(postMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(readTerminalFulfilled(response));
  } else {
    yield put(readTerminalReject(response));
  }
}

export function* watchReadTerminal() {
  yield takeLatest(READ_TERMINAL, readTerminal);
}

function* TerminalSaga() {
  yield all([fork(watchReadTerminal)]);
}

export default TerminalSaga;
