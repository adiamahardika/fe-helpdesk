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
  START_TICKET,
  START_TICKET_REJECT,
  START_TICKET_FULFILLED,
  CLOSE_TICKET,
  CLOSE_TICKET_REJECT,
  CLOSE_TICKET_FULFILLED,
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
        loading: true,
      };
    case READ_TICKET_REJECT:
      return {
        ...state,
        response_code_ticket: action.payload.status.responseCode,
        message_ticket: action.payload.status.description[0],
        loading: false,
      };
    case READ_TICKET_FULFILLED:
      return {
        ...state,
        list_ticket: action.payload.content,
        response_code_ticket: action.payload.status.responseCode,
        message_ticket: action.payload.status.description[0],
        active_page_ticket: action.payload.page,
        total_pages_ticket: action.payload.totalPages,
        loading: false,
      };
    case CREATE_TICKET:
      return {
        ...state,
        loading: true,
      };
    case CREATE_TICKET_REJECT:
      return {
        ...state,
        response_code_ticket: action.payload.status.responseCode,
        message_ticket: action.payload.status.description[0],
        loading: false,
      };
    case CREATE_TICKET_FULFILLED:
      return {
        ...state,
        response_code_ticket: action.payload.status.responseCode,
        message_ticket: action.payload.status.description[0],
        loading: false,
      };

    case READ_DETAIL_TICKET:
      return {
        ...state,
        lading: true,
      };
    case READ_DETAIL_TICKET_REJECT:
      return {
        ...state,
        response_code_ticket: action.payload.status.responseCode,
        message_ticket: action.payload.status.description[0],
        loading: false,
      };
    case READ_DETAIL_TICKET_FULFILLED:
      return {
        ...state,
        detail_ticket: action.payload.listDetailTicket,
        list_reply_ticket: action.payload.listReplyTicket,
        response_code_ticket: action.payload.status.responseCode,
        message_ticket: action.payload.status.description[0],
        loading: false,
      };

    case UPDATE_TICKET:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_TICKET_REJECT:
      return {
        ...state,
        response_code_ticket: action.payload.status.responseCode,
        message_ticket: action.payload.status.description[0],
        loading: false,
      };
    case UPDATE_TICKET_FULFILLED:
      return {
        ...state,
        detail_ticket: action.payload.listDetailTicket,
        list_reply_ticket: action.payload.listReplyTicket,
        response_code_ticket: action.payload.status.responseCode,
        message_ticket: action.payload.status.description[0],
        loading: false,
      };

    case REPLY_TICKET:
      return {
        ...state,
        loading: true,
      };
    case REPLY_TICKET_REJECT:
      return {
        ...state,
        response_code_ticket: action.payload.status.responseCode,
        message_ticket: action.payload.status.description[0],
        loading: false,
      };
    case REPLY_TICKET_FULFILLED:
      return {
        ...state,
        detail_ticket: action.payload.listDetailTicket,
        list_reply_ticket: action.payload.listReplyTicket,
        response_code_ticket: action.payload.status.responseCode,
        message_ticket: action.payload.status.description[0],
        loading: false,
      };
    case START_TICKET:
      return {
        ...state,
        loading: true,
      };
    case START_TICKET_REJECT:
      return {
        ...state,
        response_code_ticket: action.payload.status.responseCode,
        message_ticket: action.payload.status.description[0],
        loading: false,
      };
    case START_TICKET_FULFILLED:
      return {
        ...state,
        detail_ticket: action.payload.listDetailTicket,
        list_reply_ticket: action.payload.listReplyTicket,
        response_code_ticket: action.payload.status.responseCode,
        message_ticket: action.payload.status.description[0],
        loading: false,
      };
    case CLOSE_TICKET:
      return {
        ...state,
        loading: true,
      };
    case CLOSE_TICKET_REJECT:
      return {
        ...state,
        response_code_ticket: action.payload.status.responseCode,
        message_ticket: action.payload.status.description[0],
        loading: false,
      };
    case CLOSE_TICKET_FULFILLED:
      return {
        ...state,
        detail_ticket: action.payload.listDetailTicket,
        list_reply_ticket: action.payload.listReplyTicket,
        response_code_ticket: action.payload.status.responseCode,
        message_ticket: action.payload.status.description[0],
        loading: false,
      };
    default:
      return state;
  }
};

export default Ticket;
