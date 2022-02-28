import {
  CREATE_ROLE,
  CREATE_ROLE_REJECT,
  CREATE_ROLE_FULFILLED,
  READ_ROLE,
  READ_ROLE_REJECT,
  READ_ROLE_FULFILLED,
  UPDATE_ROLE,
  UPDATE_ROLE_REJECT,
  UPDATE_ROLE_FULFILLED,
  DELETE_ROLE,
  DELETE_ROLE_REJECT,
  DELETE_ROLE_FULFILLED,
} from "./actionTypes";

export const createRole = (value) => {
  let data = {
    body: value,
    url: "/v1/role/add",
  };
  return {
    type: CREATE_ROLE,
    payload: data,
  };
};

export const createRoleReject = (payload) => {
  return {
    type: CREATE_ROLE_REJECT,
    payload: payload,
  };
};

export const createRoleFulfilled = (payload) => {
  return {
    type: CREATE_ROLE_FULFILLED,
    payload: payload,
  };
};

export const readRole = () => {
  let data = {
    url: "/v1/role/get",
  };
  return {
    type: READ_ROLE,
    payload: data,
  };
};

export const readRoleReject = (payload) => {
  return {
    type: READ_ROLE_REJECT,
    payload: payload,
  };
};

export const readRoleFulfilled = (data) => {
  return {
    type: READ_ROLE_FULFILLED,
    payload: data,
  };
};

export const updateRole = (value) => {
  let data = {
    body: value,
    url: "/v1/role/update",
  };
  return {
    type: UPDATE_ROLE,
    payload: data,
  };
};

export const updateRoleReject = (payload) => {
  return {
    type: UPDATE_ROLE_REJECT,
    payload: payload,
  };
};

export const updateRoleFulfilled = (payload) => {
  return {
    type: UPDATE_ROLE_FULFILLED,
    payload: payload,
  };
};

export const deleteRole = (id) => {
  let data = {
    delete_url: `/v1/role/delete/${id}`,
    read_url: `/v1/role/get`,
  };
  return {
    type: DELETE_ROLE,
    payload: data,
  };
};

export const deleteRoleReject = (payload) => {
  return {
    type: DELETE_ROLE_REJECT,
    payload: payload,
  };
};

export const deleteRoleFulfilled = (payload) => {
  return {
    type: DELETE_ROLE_FULFILLED,
    payload: payload,
  };
};
