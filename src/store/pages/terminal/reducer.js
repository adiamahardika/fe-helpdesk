import {
  READ_TERMINAL,
  READ_TERMINAL_REJECT,
  READ_TERMINAL_FULFILLED,
} from "./actionTypes";

const INIT_STATE = {
  list_terminal: null,
  option_terminal: [],
  response_code_terminal: null,
  message_terminal: null,
  loading: false,
};

const Terminal = (state = INIT_STATE, action) => {
  switch (action.type) {
    case READ_TERMINAL:
      return {
        ...state,
        option_terminal: [],
        loading: true,
      };
    case READ_TERMINAL_REJECT:
      return {
        ...state,
        response_code_terminal: action.payload.status.responseCode,
        message_terminal: action.payload.status.description[0],
        loading: false,
      };
    case READ_TERMINAL_FULFILLED:
      if (state.option_terminal.length <= 0) {
        action.payload.content.map((value) => {
          return state.option_terminal.push({
            label: value.terminalName + " (" + value.terminalId + ")",
            value: value.terminalId,
          });
        });
      }
      return {
        ...state,
        list_terminal: action.payload.content,
        response_code_terminal: action.payload.status.responseCode,
        message_terminal: action.payload.status.description[0],
        loading: false,
      };
    default:
      return state;
  }
};

export default Terminal;
