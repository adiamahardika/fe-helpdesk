import {
  all,
  call,
  fork,
  takeEvery,
  put,
  takeLatest,
} from "redux-saga/effects";

import {
  CREATE_EMAIL_NOTIF,
  READ_EMAIL_NOTIF,
  READ_DETAIL_EMAIL_NOTIF,
  UPDATE_EMAIL_NOTIF,
  DELETE_EMAIL_NOTIF,
} from "./actionTypes";
import {
  createEmailNotifReject,
  createEmailNotifFulfilled,
  readEmailNotifReject,
  readEmailNotifFulfilled,
  readDetailEmailNotifReject,
  readDetailEmailNotifFulfilled,
  updateEmailNotifReject,
  updateEmailNotifFulfilled,
  deleteEmailNotifReject,
  deleteEmailNotifFulfilled,
} from "./actions";
import { postMethod, getMethod, putMethod, deleteMethod } from "../../method";
import general_constant from "../../../helpers/general_constant.json";

function* readEmailNotif({ payload: data }) {
  const response = yield call(getMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(readEmailNotifFulfilled(response));
  } else {
    yield put(readEmailNotifReject(response));
  }
}
function* readDetailEmailNotif({ payload: data }) {
  const response = yield call(getMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(readDetailEmailNotifFulfilled(response));
  } else {
    yield put(readDetailEmailNotifReject(response));
  }
}
function* createEmailNotif({ payload: data }) {
  const response = yield call(postMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(createEmailNotifFulfilled(response));
  } else {
    yield put(createEmailNotifReject(response));
  }
}
function* updateEmailNotif({ payload: data }) {
  const response = yield call(putMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(updateEmailNotifFulfilled(response));
  } else {
    yield put(updateEmailNotifReject(response));
  }
}
function* deleteEmailNotif({ payload: data }) {
  const response = yield call(deleteMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(deleteEmailNotifFulfilled(response));
  } else {
    yield put(deleteEmailNotifReject(response));
  }
}

export function* watchReadEmailNotif() {
  yield takeLatest(READ_EMAIL_NOTIF, readEmailNotif);
}
export function* watchReadDetailEmailNotif() {
  yield takeLatest(READ_DETAIL_EMAIL_NOTIF, readDetailEmailNotif);
}
export function* watchCreateEmailNotif() {
  yield takeEvery(CREATE_EMAIL_NOTIF, createEmailNotif);
}
export function* watchUpdateEmailNotif() {
  yield takeEvery(UPDATE_EMAIL_NOTIF, updateEmailNotif);
}
export function* watchDeleteEmailNotif() {
  yield takeEvery(DELETE_EMAIL_NOTIF, deleteEmailNotif);
}

function* EmailNotifSaga() {
  yield all([
    fork(watchReadEmailNotif),
    fork(watchReadDetailEmailNotif),
    fork(watchCreateEmailNotif),
    fork(watchUpdateEmailNotif),
    fork(watchDeleteEmailNotif),
  ]);
}

export default EmailNotifSaga;
