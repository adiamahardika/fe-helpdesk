import {
  READ_REGIONAL,
  READ_REGIONAL_REJECT,
  READ_REGIONAL_FULFILLED,
} from "./actionTypes";

export const readRegional = (value) => {
  const data = {
    url: `/v1/regional/get`,
    body: value,
  };
  return {
    type: READ_REGIONAL,
    payload: data,
  };
};

export const readRegionalReject = (payload) => {
  return {
    type: READ_REGIONAL_REJECT,
    payload: payload,
  };
};

export const readRegionalFulfilled = (data) => {
  return {
    type: READ_REGIONAL_FULFILLED,
    payload: data,
  };
};
