import { all, call, fork, put, takeLatest } from "redux-saga/effects";

import { READ_TICKET_STATUS } from "./actionTypes";
import { readTicketStatusReject, readTicketStatusFulfilled } from "./actions";
import { getMethod } from "../../method";
import general_constant from "../../../helpers/general_constant.json";

function* readTicketStatus({ payload: data }) {
  const response = yield call(getMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(readTicketStatusFulfilled(response));
  } else {
    yield put(readTicketStatusReject(response));
  }
}

export function* watchReadTicketStatus() {
  yield takeLatest(READ_TICKET_STATUS, readTicketStatus);
}

function* TicketStatusSaga() {
  yield all([fork(watchReadTicketStatus)]);
}

export default TicketStatusSaga;
