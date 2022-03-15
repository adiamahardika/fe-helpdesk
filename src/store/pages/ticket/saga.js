import { all, call, fork, put, takeLatest } from "redux-saga/effects";

import {
  READ_TICKET,
  CREATE_TICKET,
  READ_DETAIL_TICKET,
  UPDATE_TICKET,
  REPLY_TICKET,
} from "./actionTypes";
import {
  readTicketReject,
  readTicketFulfilled,
  createTicketReject,
  createTicketFulfilled,
  readDetailTicketReject,
  readDetailTicketFulfilled,
  updateTicketReject,
  updateTicketFulfilled,
  replyTicketReject,
  replyTicketFulfilled,
} from "./actions";
import {
  getMethod,
  postMethod,
  postMethodWithFile,
  putMethod,
} from "../../method";
import general_constant from "../../../helpers/general_constant.json";

function* readTicket({ payload: data }) {
  const response = yield call(postMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(readTicketFulfilled(response));
  } else {
    yield put(readTicketReject(response));
  }
}
function* createTicket({ payload: data }) {
  const response = yield call(postMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(createTicketFulfilled(response));
  } else {
    yield put(createTicketReject(response));
  }
}
function* readDetailTicket({ payload: data }) {
  const response = yield call(getMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(readDetailTicketFulfilled(response));
  } else {
    yield put(readDetailTicketReject(response));
  }
}
function* updateTicket({ payload: data }) {
  const response = yield call(putMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    const detailResponse = yield call(getMethod, { url: data.detail_url });
    yield put(updateTicketFulfilled(detailResponse));
  } else {
    yield put(updateTicketReject(response));
  }
}
function* replyTicket({ payload: data }) {
  console.log("req", data);
  const response = yield call(postMethodWithFile, data);
  console.log("res", response);
  if (response.status.responseCode === general_constant.success_response_code) {
    const detailResponse = yield call(getMethod, { url: data.detail_url });
    yield put(replyTicketFulfilled(detailResponse));
  } else {
    yield put(replyTicketReject(response));
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
export function* watchUpdateTicket() {
  yield takeLatest(UPDATE_TICKET, updateTicket);
}
export function* watchReplyTicket() {
  yield takeLatest(REPLY_TICKET, replyTicket);
}

function* TicketSaga() {
  yield all([
    fork(watchReadTicket),
    fork(watchCreateTicket),
    fork(watchReadDetailTicket),
    fork(watchUpdateTicket),
    fork(watchReplyTicket),
  ]);
}

export default TicketSaga;
