import {
  all,
  call,
  fork,
  takeEvery,
  put,
  takeLatest,
} from "redux-saga/effects";

import { READ_TICKET, CREATE_TICKET, READ_DETAIL_TICKET } from "./actionTypes";
import {
  readTicketReject,
  readTicketFulfilled,
  createTicketReject,
  createTicketFulfilled,
  readDetailTicketReject,
  readDetailTicketFulfilled,
} from "./actions";
import { getMethod, postMethod } from "../../method";
import general_constant from "../../../helpers/general_constant.json";

function* readTicket({ payload: data }) {
  const response = yield call(postMethod, data);
  if (response.responseCode === general_constant.success_response_code) {
    yield put(readTicketFulfilled(response));
  } else {
    yield put(readTicketReject(response));
  }
}
function* createTicket({ payload: data }) {
  const response = yield call(postMethod, data);
  if (response.responseCode === general_constant.success_response_code) {
    yield put(createTicketFulfilled(response));
  } else {
    yield put(createTicketReject(response));
  }
}
function* readDetailTicket({ payload: data }) {
  const response = yield call(getMethod, data);
  if (response.responseCode === general_constant.success_response_code) {
    yield put(readDetailTicketFulfilled(response));
  } else {
    yield put(readDetailTicketReject(response));
  }
}

export function* watchReadTicket() {
  yield takeLatest(READ_TICKET, readTicket);
}
export function* watchCreateTicket() {
  yield takeLatest(CREATE_TICKET, createTicket);
}
export function* watchReadDetailTicket() {
  yield takeLatest(READ_DETAIL_TICKET, readDetailTicket);
}

function* TicketSaga() {
  yield all([
    fork(watchReadTicket),
    fork(watchCreateTicket),
    fork(watchReadDetailTicket),
  ]);
}

export default TicketSaga;
