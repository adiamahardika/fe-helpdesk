import {
  CREATE_EMAIL_NOTIF,
  CREATE_EMAIL_NOTIF_REJECT,
  CREATE_EMAIL_NOTIF_FULFILLED,
  READ_EMAIL_NOTIF,
  READ_EMAIL_NOTIF_REJECT,
  READ_EMAIL_NOTIF_FULFILLED,
  UPDATE_EMAIL_NOTIF,
  UPDATE_EMAIL_NOTIF_REJECT,
  UPDATE_EMAIL_NOTIF_FULFILLED,
  DELETE_EMAIL_NOTIF,
  DELETE_EMAIL_NOTIF_REJECT,
  DELETE_EMAIL_NOTIF_FULFILLED,
} from "./actionTypes";

export const createEmailNotif = (value) => {
  let data = {
    body: value,
    url: "/v1/email-notif/add",
  };
  return {
    type: CREATE_EMAIL_NOTIF,
    payload: data,
  };
};

export const createEmailNotifReject = (payload) => {
  return {
    type: CREATE_EMAIL_NOTIF_REJECT,
    payload: payload,
  };
};

export const createEmailNotifFulfilled = (payload) => {
  return {
    type: CREATE_EMAIL_NOTIF_FULFILLED,
    payload: payload,
  };
};

export const readEmailNotif = () => {
  let data = {
    url: "/v1/email-notif/get",
  };
  return {
    type: READ_EMAIL_NOTIF,
    payload: data,
  };
};

export const readEmailNotifReject = (payload) => {
  return {
    type: READ_EMAIL_NOTIF_REJECT,
    payload: payload,
  };
};

export const readEmailNotifFulfilled = (data) => {
  return {
    type: READ_EMAIL_NOTIF_FULFILLED,
    payload: data,
  };
};

export const updateEmailNotif = (value) => {
  let data = {
    body: value,
    url: "/v1/email-notif/update",
  };
  return {
    type: UPDATE_EMAIL_NOTIF,
    payload: data,
  };
};

export const updateEmailNotifReject = (payload) => {
  return {
    type: UPDATE_EMAIL_NOTIF_REJECT,
    payload: payload,
  };
};

export const updateEmailNotifFulfilled = (payload) => {
  return {
    type: UPDATE_EMAIL_NOTIF_FULFILLED,
    payload: payload,
  };
};

export const deleteEmailNotif = (id) => {
  let data = {
    delete_url: `/v1/email-notif/delete/${id}`,
    read_url: `/v1/email-notif/get`,
  };
  return {
    type: DELETE_EMAIL_NOTIF,
    payload: data,
  };
};

export const deleteEmailNotifReject = (payload) => {
  return {
    type: DELETE_EMAIL_NOTIF_REJECT,
    payload: payload,
  };
};

export const deleteEmailNotifFulfilled = (payload) => {
  return {
    type: DELETE_EMAIL_NOTIF_FULFILLED,
    payload: payload,
  };
};
