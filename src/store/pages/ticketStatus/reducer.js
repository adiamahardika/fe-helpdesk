import {
  READ_TICKET_STATUS,
  READ_TICKET_STATUS_REJECT,
  READ_TICKET_STATUS_FULFILLED,
} from "./actionTypes";

const INIT_STATE = {
  list_ticket_status: null,
  message: null,
  loading: false,
};

const TicketStatus = (state = INIT_STATE, action) => {
  switch (action.type) {
    case READ_TICKET_STATUS:
      return {
        ...state,
        loading: true,
      };
    case READ_TICKET_STATUS_REJECT:
      return {
        ...state,
        message: action.payload.message,
        loading: true,
      };
    case READ_TICKET_STATUS_FULFILLED:
      return {
        ...state,
        list_ticket_status: action.payload.result,
        loading: false,
      };
    default:
      return state;
  }
};

export default TicketStatus;
