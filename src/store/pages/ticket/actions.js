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
  UPDATE_TICKET,
  UPDATE_TICKET_REJECT,
  UPDATE_TICKET_FULFILLED,
  REPLY_TICKET,
  REPLY_TICKET_REJECT,
  REPLY_TICKET_FULFILLED,
} from "./actionTypes";

export const readTicket = (value) => {
  const data = {
    body: value,
    url: `/v1/ticket/get`,
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
    url: `/v1/ticket/get-detail/${value}`,
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

export const updateTicket = (value) => {
  const data = {
    body: value,
    url: `/api/ticketing/edit-ticket`,
    detail_url: `/api/ticketing/detail-ticket/${value.kodeTicket}`,
  };
  return {
    type: UPDATE_TICKET,
    payload: data,
  };
};

export const updateTicketReject = (payload) => {
  return {
    type: UPDATE_TICKET_REJECT,
    payload: payload,
  };
};

export const updateTicketFulfilled = (data) => {
  return {
    type: UPDATE_TICKET_FULFILLED,
    payload: data,
  };
};

export const replyTicket = (value) => {
  const data = {
    body: value,
    url: `/api/ticketing/reply-ticketing`,
    detail_url: `/api/ticketing/detail-ticket/${value.kodeTicket}`,
  };
  return {
    type: REPLY_TICKET,
    payload: data,
  };
};

export const replyTicketReject = (payload) => {
  return {
    type: REPLY_TICKET_REJECT,
    payload: payload,
  };
};

export const replyTicketFulfilled = (data) => {
  return {
    type: REPLY_TICKET_FULFILLED,
    payload: data,
  };
};
