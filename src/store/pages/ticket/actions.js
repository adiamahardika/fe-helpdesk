import {
  READ_TICKET,
  READ_TICKET_REJECT,
  READ_TICKET_FULFILLED,
} from "./actionTypes";

export const readTicket = (value) => {
  const data = {
    ...value,
    url: `/api/ticketing/list-ticket/${value.size}/${value.page_no}`,
  };
  return {
    type: READ_TICKET,
    payload: data,
  };
};

export const readTicketReject = (payload) => {
  return {
    type: READ_TICKET_REJECT,
    payload: payload,
  };
};

export const readTicketFulfilled = (data) => {
  return {
    type: READ_TICKET_FULFILLED,
    payload: data,
  };
};
