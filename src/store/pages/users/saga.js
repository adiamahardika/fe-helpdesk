import { all, call, fork, put, takeLatest } from "redux-saga/effects";

import {
  CREATE_USER,
  READ_USER,
  READ_USER_DETAIL,
  UPDATE_USER,
  DELETE_USER,
  RESET_PASSWORD,
  UPDATE_USER_PROFILE,
  CHANGE_PASSWORD,
  UPDATE_USER_STATUS,
  READ_USER_MULTIPLE_SELECT,
} from "./actionTypes";
import {
  createUserReject,
  createUserFulfilled,
  readUserReject,
  readUserFulfilled,
  readUserDetailReject,
  readUserDetailFulfilled,
  updateUserReject,
  updateUserFulfilled,
  deleteUserReject,
  deleteUserFulfilled,
  resetPasswordReject,
  resetPasswordFulfilled,
  updateUserProfileFulfilled,
  updateUserProfileReject,
  changePasswordFulfilled,
  changePasswordReject,
  updateUserStatusFulfilled,
  updateUserStatusReject,
  readUserMultipleSelectReject,
  readUserMultipleSelectFulfilled,
} from "./actions";
import { postMethod, getMethod, putMethod, deleteMethod } from "../../method";
import general_constant from "../../../helpers/general_constant.json";

function* readUser({ payload: data }) {
  const response = yield call(getMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(readUserFulfilled(response));
  } else {
    yield put(readUserReject(response));
  }
}
function* readUserDetail({ payload: data }) {
  const response = yield call(getMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(readUserDetailFulfilled(response));
  } else {
    yield put(readUserDetailReject(response));
  }
}
function* createUser({ payload: data }) {
  const response = yield call(postMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(createUserFulfilled(response));
  } else {
    yield put(createUserReject(response));
  }
}
function* updateUser({ payload: data }) {
  const response = yield call(putMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(updateUserFulfilled(response));
  } else {
    yield put(updateUserReject(response));
  }
}
function* updateUserProfile({ payload: data }) {
  const response = yield call(putMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(updateUserProfileFulfilled(response));
  } else {
    yield put(updateUserProfileReject(response));
  }
}
function* deleteUser({ payload: data }) {
  const response = yield call(deleteMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(deleteUserFulfilled(response));
  } else {
    yield put(deleteUserReject(response));
  }
}
function* resetPassword({ payload: data }) {
  const response = yield call(postMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(resetPasswordFulfilled(response));
  } else {
    yield put(resetPasswordReject(response));
  }
}
function* changePassword({ payload: data }) {
  const response = yield call(postMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(changePasswordFulfilled(response));
  } else {
    yield put(changePasswordReject(response));
  }
}
function* updateUserStatus({ payload: data }) {
  const response = yield call(putMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(updateUserStatusFulfilled(response));
  } else {
    yield put(updateUserStatusReject(response));
  }
}
function* readUserMultipleSelect({ payload: data }) {
  const response = yield call(getMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(readUserMultipleSelectFulfilled(response));
  } else {
    yield put(readUserMultipleSelectReject(response));
  }
}

export function* watchReadUser() {
  yield takeLatest(READ_USER, readUser);
}
export function* watchReadUserDetail() {
  yield takeLatest(READ_USER_DETAIL, readUserDetail);
}
export function* watchCreateUser() {
  yield takeLatest(CREATE_USER, createUser);
}
export function* watchUpdateUser() {
  yield takeLatest(UPDATE_USER, updateUser);
}
export function* watchUpdateUserProfile() {
  yield takeLatest(UPDATE_USER_PROFILE, updateUserProfile);
}
export function* watchDeleteUser() {
  yield takeLatest(DELETE_USER, deleteUser);
}
export function* watchResetPassword() {
  yield takeLatest(RESET_PASSWORD, resetPassword);
}
export function* watchChangePassword() {
  yield takeLatest(CHANGE_PASSWORD, changePassword);
}
export function* watchUpdateUserStatus() {
  yield takeLatest(UPDATE_USER_STATUS, updateUserStatus);
}
export function* watchReadUserMultipleSelect() {
  yield takeLatest(READ_USER_MULTIPLE_SELECT, readUserMultipleSelect);
}

function* UserSaga() {
  yield all([
    fork(watchReadUser),
    fork(watchReadUserDetail),
    fork(watchCreateUser),
    fork(watchUpdateUser),
    fork(watchUpdateUserProfile),
    fork(watchDeleteUser),
    fork(watchResetPassword),
    fork(watchChangePassword),
    fork(watchUpdateUserStatus),
    fork(watchReadUserMultipleSelect),
  ]);
}

export default UserSaga;
