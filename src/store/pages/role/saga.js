import {
  all,
  call,
  fork,
  takeEvery,
  put,
  takeLatest,
} from "redux-saga/effects";

import {
  CREATE_ROLE,
  READ_ROLE,
  UPDATE_ROLE,
  DELETE_ROLE,
  READ_DETAIL_ROLE,
} from "./actionTypes";
import {
  createRoleReject,
  createRoleFulfilled,
  readRoleReject,
  readRoleFulfilled,
  readDetailRoleReject,
  readDetailRoleFulfilled,
  updateRoleReject,
  updateRoleFulfilled,
  deleteRoleReject,
  deleteRoleFulfilled,
} from "./actions";
import { postMethod, getMethod, putMethod, deleteMethod } from "../../method";
import general_constant from "../../../helpers/general_constant.json";

function* readRole({ payload: data }) {
  const response = yield call(getMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(readRoleFulfilled(response));
  } else {
    yield put(readRoleReject(response));
  }
}
function* readDetailRole({ payload: data }) {
  const response = yield call(getMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(readDetailRoleFulfilled(response));
  } else {
    yield put(readDetailRoleReject(response));
  }
}
function* createRole({ payload: data }) {
  const response = yield call(postMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(createRoleFulfilled(response));
  } else {
    yield put(createRoleReject(response));
  }
}
function* updateRole({ payload: data }) {
  const response = yield call(putMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(updateRoleFulfilled(response));
  } else {
    yield put(updateRoleReject(response));
  }
}
function* deleteRole({ payload: data }) {
  const response = yield call(deleteMethod, data);
  if (response.status.responseCode === general_constant.success_response_code) {
    yield put(deleteRoleFulfilled(response));
  } else {
    yield put(deleteRoleReject(response));
  }
}

export function* watchReadRole() {
  yield takeLatest(READ_ROLE, readRole);
}
export function* watchReadDetailRole() {
  yield takeLatest(READ_DETAIL_ROLE, readDetailRole);
}
export function* watchCreateRole() {
  yield takeEvery(CREATE_ROLE, createRole);
}
export function* watchUpdateRole() {
  yield takeEvery(UPDATE_ROLE, updateRole);
}
export function* watchDeleteRole() {
  yield takeEvery(DELETE_ROLE, deleteRole);
}

function* RoleSaga() {
  yield all([
    fork(watchReadRole),
    fork(watchReadDetailRole),
    fork(watchCreateRole),
    fork(watchUpdateRole),
    fork(watchDeleteRole),
  ]);
}

export default RoleSaga;
