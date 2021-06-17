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
} from "./actionTypes";
import {
  createRoleReject,
  createRoleFulfilled,
  readRoleReject,
  readRoleFulfilled,
  updateRoleReject,
  updateRoleFulfilled,
  deleteRoleReject,
  deleteRoleFulfilled,
} from "./actions";
import {
  createRoleMethod,
  readRoleMethod,
  updateRoleMethod,
  deleteRoleMethod,
} from "./method";
import general_constant from "../../../helpers/general_constant.json";

function* readRole() {
  const data = yield call(readRoleMethod);
  if (data.responseCode === general_constant.success_response_code) {
    yield put(readRoleFulfilled(data));
  } else {
    yield put(readRoleReject(data));
  }
}
function* createRole({ payload: data }) {
  const response = yield call(createRoleMethod, data);
  if (response.responseCode === general_constant.success_response_code) {
    yield put(createRoleFulfilled(response));
  } else {
    yield put(createRoleReject(response));
  }
}
function* updateRole({ payload: data }) {
  const response = yield call(updateRoleMethod, data);
  if (response.responseCode === general_constant.success_response_code) {
    yield put(updateRoleFulfilled(response));
  } else {
    yield put(updateRoleReject(response));
  }
}
function* deleteRole({ payload: id }) {
  const response = yield call(deleteRoleMethod, id);
  if (response.responseCode === general_constant.success_response_code) {
    yield put(deleteRoleFulfilled(response));
  } else {
    yield put(deleteRoleReject(response));
  }
}

export function* watchReadRole() {
  yield takeLatest(READ_ROLE, readRole);
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
    fork(watchCreateRole),
    fork(watchUpdateRole),
    fork(watchDeleteRole),
  ]);
}

export default RoleSaga;
