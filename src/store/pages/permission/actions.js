import {
  READ_PERMISSION,
  READ_PERMISSION_REJECT,
  READ_PERMISSION_FULFILLED,
} from "./actionTypes";

export const readPermission = () => {
  return {
    type: READ_PERMISSION,
  };
};

export const readPermissionReject = (payload) => {
  return {
    type: READ_PERMISSION_REJECT,
    payload: payload,
  };
};

export const readPermissionFulfilled = (data) => {
  return {
    type: READ_PERMISSION_FULFILLED,
    payload: data,
  };
};
