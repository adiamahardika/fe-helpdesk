import {
  CREATE_USER,
  CREATE_USER_REJECT,
  CREATE_USER_FULFILLED,
  READ_USER,
  READ_USER_REJECT,
  READ_USER_FULFILLED,
  READ_USER_DETAIL,
  READ_USER_DETAIL_REJECT,
  READ_USER_DETAIL_FULFILLED,
  UPDATE_USER,
  UPDATE_USER_REJECT,
  UPDATE_USER_FULFILLED,
  DELETE_USER,
  DELETE_USER_REJECT,
  DELETE_USER_FULFILLED,
  RESET_PASSWORD,
  RESET_PASSWORD_REJECT,
  RESET_PASSWORD_FULFILLED,
  UPDATE_USER_PROFILE,
  UPDATE_USER_PROFILE_REJECT,
  UPDATE_USER_PROFILE_FULFILLED,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_REJECT,
  CHANGE_PASSWORD_FULFILLED,
  UPDATE_USER_STATUS,
  UPDATE_USER_STATUS_REJECT,
  UPDATE_USER_STATUS_FULFILLED,
  READ_USER_MULTIPLE_SELECT,
  READ_USER_MULTIPLE_SELECT_REJECT,
  READ_USER_MULTIPLE_SELECT_FULFILLED,
} from "./actionTypes";

export const createUser = (value) => {
  let data = {
    body: value,
    url: "/v1/user/add",
  };
  return {
    type: CREATE_USER,
    payload: data,
  };
};

export const createUserReject = (payload) => {
  return {
    type: CREATE_USER_REJECT,
    payload: payload,
  };
};

export const createUserFulfilled = (payload) => {
  return {
    type: CREATE_USER_FULFILLED,
    payload: payload,
  };
};

export const readUser = (value) => {
  let data = {
    url: `/v1/user/get`,
    body: value,
  };
  return {
    type: READ_USER,
    payload: data,
  };
};

export const readUserReject = (payload) => {
  return {
    type: READ_USER_REJECT,
    payload: payload,
  };
};

export const readUserFulfilled = (data) => {
  return {
    type: READ_USER_FULFILLED,
    payload: data,
  };
};

export const readUserDetail = (value) => {
  let data = {
    url: `/v1/user/get-detail/${value}`,
  };
  return {
    type: READ_USER_DETAIL,
    payload: data,
  };
};

export const readUserDetailReject = (payload) => {
  return {
    type: READ_USER_DETAIL_REJECT,
    payload: payload,
  };
};

export const readUserDetailFulfilled = (data) => {
  return {
    type: READ_USER_DETAIL_FULFILLED,
    payload: data,
  };
};

export const updateUser = (value) => {
  let data = {
    body: value,
    url: "/v1/user/update",
  };
  return {
    type: UPDATE_USER,
    payload: data,
  };
};

export const updateUserReject = (payload) => {
  return {
    type: UPDATE_USER_REJECT,
    payload: payload,
  };
};

export const updateUserFulfilled = (payload) => {
  return {
    type: UPDATE_USER_FULFILLED,
    payload: payload,
  };
};

export const updateUserProfile = (value) => {
  let data = {
    body: value,
    url: "/v1/user/update-profile",
  };
  return {
    type: UPDATE_USER_PROFILE,
    payload: data,
  };
};

export const updateUserProfileReject = (payload) => {
  return {
    type: UPDATE_USER_PROFILE_REJECT,
    payload: payload,
  };
};

export const updateUserProfileFulfilled = (payload) => {
  return {
    type: UPDATE_USER_PROFILE_FULFILLED,
    payload: payload,
  };
};

export const deleteUser = (value) => {
  let data = {
    delete_url: `/v1/user/delete/${value.id}`,
    read_url: `/v1/user/get/${value.search}/${value.size}/${value.page_no}`,
  };
  return {
    type: DELETE_USER,
    payload: data,
  };
};

export const deleteUserReject = (payload) => {
  return {
    type: DELETE_USER_REJECT,
    payload: payload,
  };
};

export const deleteUserFulfilled = (payload) => {
  return {
    type: DELETE_USER_FULFILLED,
    payload: payload,
  };
};

export const resetPassword = (value) => {
  let data = {
    body: value,
    url: "/v1/user/reset-pass",
  };
  return {
    type: RESET_PASSWORD,
    payload: data,
  };
};

export const resetPasswordReject = (payload) => {
  return {
    type: RESET_PASSWORD_REJECT,
    payload: payload,
  };
};

export const resetPasswordFulfilled = (payload) => {
  return {
    type: RESET_PASSWORD_FULFILLED,
    payload: payload,
  };
};

export const changePassword = (value) => {
  let data = {
    body: value,
    url: "/v1/user/change-pass",
  };
  return {
    type: CHANGE_PASSWORD,
    payload: data,
  };
};

export const changePasswordReject = (payload) => {
  return {
    type: CHANGE_PASSWORD_REJECT,
    payload: payload,
  };
};

export const changePasswordFulfilled = (payload) => {
  return {
    type: CHANGE_PASSWORD_FULFILLED,
    payload: payload,
  };
};

export const updateUserStatus = (value) => {
  let data = {
    body: value,
    url: "/v1/user/update-status",
  };
  return {
    type: UPDATE_USER_STATUS,
    payload: data,
  };
};

export const updateUserStatusReject = (payload) => {
  return {
    type: UPDATE_USER_STATUS_REJECT,
    payload: payload,
  };
};

export const updateUserStatusFulfilled = (payload) => {
  return {
    type: UPDATE_USER_STATUS_FULFILLED,
    payload: payload,
  };
};

export const readUserMultipleSelect = (value) => {
  let data = {
    url: `/v1/user/get-group-by-role`,
  };
  return {
    type: READ_USER_MULTIPLE_SELECT,
    payload: data,
  };
};

export const readUserMultipleSelectReject = (payload) => {
  return {
    type: READ_USER_MULTIPLE_SELECT_REJECT,
    payload: payload,
  };
};

export const readUserMultipleSelectFulfilled = (data) => {
  return {
    type: READ_USER_MULTIPLE_SELECT_FULFILLED,
    payload: data,
  };
};
