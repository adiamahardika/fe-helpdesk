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
} from "./actionTypes";

export const createUser = (data) => {
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

export const readUser = (data) => {
  return {
    type: READ_USER,
    payload: data
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

export const readUserDetail = (data) => {
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

export const updateUser = (data) => {
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

export const updateUserProfile = (data) => {
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

export const deleteUser = (data) => {
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

export const resetPassword = (data) => {
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
