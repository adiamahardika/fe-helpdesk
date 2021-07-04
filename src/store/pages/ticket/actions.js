import {
  READ_TICKET,
  READ_TICKET_REJECT,
  READ_TICKET_FULFILLED,
  CREATE_TICKET,
  CREATE_TICKET_REJECT,
  CREATE_TICKET_FULFILLED,
  READ_DETAIL_TICKET,
  READ_DETAIL_TICKET_REJECT,
  READ_DETAIL_TICKET_FULFILLED,
} from "./actionTypes";

export const readTicket = (value) => {
  const data = {
    body: value,
    url: `/api/ticketing/list-ticket`,
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

export const createTicket = (value) => {
  const data = {
    body: value,
    url: `/api/ticketing/add-ticket`,
  };
  return {
    type: CREATE_TICKET,
    payload: data,
  };
};

export const createTicketReject = (payload) => {
  return {
    type: CREATE_TICKET_REJECT,
    payload: payload,
  };
};

export const createTicketFulfilled = (data) => {
  return {
    type: CREATE_TICKET_FULFILLED,
    payload: data,
  };
};

export const readDetailTicket = (value) => {
  const data = {
    url: `/api/ticketing/detail-ticket/${value}`,
  };
  return {
    type: READ_DETAIL_TICKET,
    payload: data,
  };
};

export const readDetailTicketReject = (payload) => {
  return {
    type: READ_DETAIL_TICKET_REJECT,
    payload: payload,
  };
};

export const readDetailTicketFulfilled = (data) => {
  return {
    type: READ_DETAIL_TICKET_FULFILLED,
    payload: data,
  };
};
