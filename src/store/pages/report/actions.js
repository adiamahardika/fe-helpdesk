import {
  READ_REPORT,
  READ_REPORT_REJECT,
  READ_REPORT_FULFILLED,
} from "./actionTypes";

export const readReport = (value) => {
  const data = {
    body: value,
    url: `/api/report/list-ticket`,
  };
  return {
    type: READ_REPORT,
    payload: data,
  };
};

export const readReportReject = (payload) => {
  return {
    type: READ_REPORT_REJECT,
    payload: payload,
  };
};

export const readReportFulfilled = (data) => {
  return {
    type: READ_REPORT_FULFILLED,
    payload: data,
  };
};
