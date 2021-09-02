import {
  READ_REPORT,
  READ_REPORT_REJECT,
  READ_REPORT_FULFILLED,
} from "./actionTypes";

const INIT_STATE = {
  response_code_report: null,
  list_report: [],
  message_report: null,
  loading: false,
};

const Report = (state = INIT_STATE, action) => {
  switch (action.type) {
    case READ_REPORT:
      return {
        ...state,
        loading: true,
      };
    case READ_REPORT_REJECT:
      return {
        ...state,
        response_code_report: action.payload.responseCode,
        message_report: action.payload.description,
        loading: false,
      };
    case READ_REPORT_FULFILLED:
      return {
        ...state,
        list_report: action.payload.content,
        response_code_report: action.payload.responseCode,
        message_report: action.payload.description,
        loading: false,
      };
    default:
      return state;
  }
};

export default Report;
