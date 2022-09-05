import {
  READ_REPORT,
  READ_REPORT_REJECT,
  READ_REPORT_FULFILLED,
  READ_COUNT_REPORT_BY_STATUS,
  READ_COUNT_REPORT_BY_STATUS_REJECT,
  READ_COUNT_REPORT_BY_STATUS_FULFILLED,
} from "./actionTypes";

export const readReport = (value) => {
  const data = {
    body: value,
    url: `/v1/report/get`,
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

export const readCountReportByStatus = (value) => {
  const data = {
    body: value,
    url: `/v1/report/get-count-by-status`,
  };
  return {
    type: READ_COUNT_REPORT_BY_STATUS,
    payload: data,
  };
};

export const readCountReportByStatusReject = (payload) => {
  return {
    type: READ_COUNT_REPORT_BY_STATUS_REJECT,
    payload: payload,
  };
};

export const readCountReportByStatusFulfilled = (data) => {
  return {
    type: READ_COUNT_REPORT_BY_STATUS_FULFILLED,
    payload: data,
  };
};
