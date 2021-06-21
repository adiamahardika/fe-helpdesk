import {
  READ_PERMISSION,
  READ_PERMISSION_REJECT,
  READ_PERMISSION_FULFILLED,
} from "./actionTypes";

export const readPermission = () => {
  const data = {
    url: `/api/permission`,
  };
  return {
    type: READ_PERMISSION,
    payload: data,
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
