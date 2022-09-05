import {
  READ_REPORT,
  READ_REPORT_REJECT,
  READ_REPORT_FULFILLED,
  READ_COUNT_REPORT_BY_STATUS,
  READ_COUNT_REPORT_BY_STATUS_REJECT,
  READ_COUNT_REPORT_BY_STATUS_FULFILLED,
} from "./actionTypes";

const INIT_STATE = {
  response_code_report: null,
  list_report: [],
  list_count_report_by_status: null,
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
        response_code_report: action.payload.status.responseCode,
        message_report: action.payload.status.description[0],
        loading: false,
      };
    case READ_REPORT_FULFILLED:
      return {
        ...state,
        list_report: action.payload.content,
        response_code_report: action.payload.status.responseCode,
        message_report: action.payload.status.description[0],
        loading: false,
      };
    case READ_COUNT_REPORT_BY_STATUS:
      return {
        ...state,
        loading: true,
      };
    case READ_COUNT_REPORT_BY_STATUS_REJECT:
      return {
        ...state,
        response_code_report: action.payload.status.responseCode,
        message_report: action.payload.status.description[0],
        loading: false,
      };
    case READ_COUNT_REPORT_BY_STATUS_FULFILLED:
      return {
        ...state,
        list_count_report_by_status: action.payload.content,
        response_code_report: action.payload.status.responseCode,
        message_report: action.payload.status.description[0],
        loading: false,
      };
    default:
      return state;
  }
};

export default Report;
