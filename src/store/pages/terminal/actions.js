import {
  READ_TERMINAL,
  READ_TERMINAL_REJECT,
  READ_TERMINAL_FULFILLED,
} from "./actionTypes";

export const readTerminal = (value) => {
  const data = {
    url: `/v1/terminal/get`,
    body: value,
  };
  return {
    type: READ_TERMINAL,
    payload: data,
  };
};

export const readTerminalReject = (payload) => {
  return {
    type: READ_TERMINAL_REJECT,
    payload: payload,
  };
};

export const readTerminalFulfilled = (data) => {
  return {
    type: READ_TERMINAL_FULFILLED,
    payload: data,
  };
};
