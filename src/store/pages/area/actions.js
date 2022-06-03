import {
  READ_AREA,
  READ_AREA_REJECT,
  READ_AREA_FULFILLED,
} from "./actionTypes";

export const readArea = (value) => {
  const data = {
    url: `/v1/area/get`,
    body: value,
  };
  return {
    type: READ_AREA,
    payload: data,
  };
};

export const readAreaReject = (payload) => {
  return {
    type: READ_AREA_REJECT,
    payload: payload,
  };
};

export const readAreaFulfilled = (data) => {
  return {
    type: READ_AREA_FULFILLED,
    payload: data,
  };
};
