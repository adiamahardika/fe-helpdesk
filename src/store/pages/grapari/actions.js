import {
  READ_GRAPARI,
  READ_GRAPARI_REJECT,
  READ_GRAPARI_FULFILLED,
} from "./actionTypes";

export const readGrapari = (value) => {
  const data = {
    url: `/v1/grapari/get`,
    body: value,
  };
  return {
    type: READ_GRAPARI,
    payload: data,
  };
};

export const readGrapariReject = (payload) => {
  return {
    type: READ_GRAPARI_REJECT,
    payload: payload,
  };
};

export const readGrapariFulfilled = (data) => {
  return {
    type: READ_GRAPARI_FULFILLED,
    payload: data,
  };
};
