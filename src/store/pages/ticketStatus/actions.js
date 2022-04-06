import {
  READ_TICKET_STATUS,
  READ_TICKET_STATUS_REJECT,
  READ_TICKET_STATUS_FULFILLED,
} from "./actionTypes";

export const readTicketStatus = () => {
  const data = {
    url: `/v1/ticket-status/get`,
  };
  return {
    type: READ_TICKET_STATUS,
    payload: data,
  };
};

export const readTicketStatusReject = (payload) => {
  return {
    type: READ_TICKET_STATUS_REJECT,
    payload: payload,
  };
};

export const readTicketStatusFulfilled = (data) => {
  return {
    type: READ_TICKET_STATUS_FULFILLED,
    payload: data,
  };
};
