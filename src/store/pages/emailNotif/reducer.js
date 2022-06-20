import {
  CREATE_EMAIL_NOTIF,
  CREATE_EMAIL_NOTIF_REJECT,
  CREATE_EMAIL_NOTIF_FULFILLED,
  READ_EMAIL_NOTIF,
  READ_EMAIL_NOTIF_REJECT,
  READ_EMAIL_NOTIF_FULFILLED,
  UPDATE_EMAIL_NOTIF,
  UPDATE_EMAIL_NOTIF_REJECT,
  UPDATE_EMAIL_NOTIF_FULFILLED,
  DELETE_EMAIL_NOTIF,
  DELETE_EMAIL_NOTIF_REJECT,
  DELETE_EMAIL_NOTIF_FULFILLED,
} from "./actionTypes";

const INIT_STATE = {
  response_code_email_notif: null,
  list_email_notif: null,
  option_email_notif: [],
  message_email_notif: null,
  loading: false,
};

const EmailNotif = (state = INIT_STATE, action) => {
  switch (action.type) {
    case READ_EMAIL_NOTIF:
      return {
        ...state,
        lading: true,
      };
    case READ_EMAIL_NOTIF_REJECT:
      return {
        ...state,
        response_code_email_notif: action.payload.status.responseCode,
        message_email_notif: action.payload.status.description[0],
        loading: true,
      };
    case READ_EMAIL_NOTIF_FULFILLED:
      return {
        ...state,
        list_email_notif: action.payload.emailNotif,
        response_code_email_notif: action.payload.status.responseCode,
        message_email_notif: action.payload.status.description[0],
        loading: true,
      };
    case CREATE_EMAIL_NOTIF:
      return {
        ...state,
        loading: true,
      };
    case CREATE_EMAIL_NOTIF_REJECT:
      return {
        ...state,
        response_code_email_notif: action.payload.status.responseCode,
        message_email_notif: action.payload.status.description[0],
        loading: true,
      };
    case CREATE_EMAIL_NOTIF_FULFILLED:
      return {
        ...state,
        response_code_email_notif: action.payload.status.responseCode,
        message_email_notif: action.payload.status.description[0],
        loading: true,
      };
    case UPDATE_EMAIL_NOTIF:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_EMAIL_NOTIF_REJECT:
      return {
        ...state,
        response_code_email_notif: action.payload.status.responseCode,
        message_email_notif: action.payload.status.description[0],
        loading: true,
      };
    case UPDATE_EMAIL_NOTIF_FULFILLED:
      return {
        ...state,
        response_code_email_notif: action.payload.status.responseCode,
        message_email_notif: action.payload.status.description[0],
        lading: false,
      };
    case DELETE_EMAIL_NOTIF:
      return {
        ...state,
        loading: true,
      };
    case DELETE_EMAIL_NOTIF_REJECT:
      return {
        ...state,
        response_code_email_notif: action.payload.status.responseCode,
        message_email_notif: action.payload.status.description[0],
        loading: true,
      };
    case DELETE_EMAIL_NOTIF_FULFILLED:
      return {
        ...state,
        response_code_email_notif: action.payload.status.responseCode,
        message_email_notif: action.payload.status.description[0],
        list_email_notif: action.payload.listEmailNotif,
        loading: true,
      };
    default:
      return state;
  }
};

export default EmailNotif;
