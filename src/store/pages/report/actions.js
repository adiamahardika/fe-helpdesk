import {
  READ_REPORT,
  READ_REPORT_REJECT,
  READ_REPORT_FULFILLED,
  READ_COUNT_REPORT_ACTIVITY,
  READ_COUNT_REPORT_ACTIVITY_REJECT,
  READ_COUNT_REPORT_ACTIVITY_FULFILLED,
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

export const readCountReportActivity = (value) => {
  const data = {
    body: value,
    url: `/v1/report/get-count-activity`,
  };
  return {
    type: READ_COUNT_REPORT_ACTIVITY,
    payload: data,
  };
};

export const readCountReportActivityReject = (payload) => {
  return {
    type: READ_COUNT_REPORT_ACTIVITY_REJECT,
    payload: payload,
  };
};

export const readCountReportActivityFulfilled = (data) => {
  return {
    type: READ_COUNT_REPORT_ACTIVITY_FULFILLED,
    payload: data,
  };
};
