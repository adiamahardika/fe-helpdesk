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

const INIT_STATE = {
  response_code_ticket: null,
  list_ticket: null,
  option_ticket: [],
  detail_ticket: null,
  list_reply_ticket: null,
  message_ticket: null,
  active_page_ticket: null,
  total_pages_ticket: null,
  loading: false,
};

const Ticket = (state = INIT_STATE, action) => {
  switch (action.type) {
    case READ_TICKET:
      return {
        ...state,
        lading: true,
      };
    case READ_TICKET_REJECT:
      return {
        ...state,
        response_code_ticket: action.payload.responseCode,
        message_ticket: action.payload.description,
        loading: true,
      };
    case READ_TICKET_FULFILLED:
      return {
        ...state,
        list_ticket: action.payload.content,
        response_code_ticket: action.payload.responseCode,
        message_ticket: action.payload.description,
        active_page_ticket: action.payload.page,
        total_pages_ticket: action.payload.totalPages,
        loading: true,
      };
    case CREATE_TICKET:
      return {
        ...state,
        loading: true,
      };
    case CREATE_TICKET_REJECT:
      return {
        ...state,
        response_code_ticket: action.payload.responseCode,
        message_ticket: action.payload.description,
        loading: true,
      };
    case CREATE_TICKET_FULFILLED:
      return {
        ...state,
        response_code_ticket: action.payload.responseCode,
        message_ticket: action.payload.description,
        loading: true,
      };

    case READ_DETAIL_TICKET:
      return {
        ...state,
        lading: true,
      };
    case READ_DETAIL_TICKET_REJECT:
      return {
        ...state,
        response_code_ticket: action.payload.responseCode,
        message_ticket: action.payload.description,
        loading: true,
      };
    case READ_DETAIL_TICKET_FULFILLED:
      return {
        ...state,
        detail_ticket: action.payload.listDetailTicket,
        list_reply_ticket: action.payload.listReplyTicket,
        response_code_ticket: action.payload.responseCode,
        message_ticket: action.payload.description,
        loading: true,
      };
    default:
      return state;
  }
};

export default Ticket;
