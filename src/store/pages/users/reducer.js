import {
  CREATE_USER,
  CREATE_USER_REJECT,
  CREATE_USER_FULFILLED,
  READ_USER,
  READ_USER_REJECT,
  READ_USER_FULFILLED,
  READ_USER_DETAIL,
  READ_USER_DETAIL_REJECT,
  READ_USER_DETAIL_FULFILLED,
  UPDATE_USER,
  UPDATE_USER_REJECT,
  UPDATE_USER_FULFILLED,
  DELETE_USER,
  DELETE_USER_REJECT,
  DELETE_USER_FULFILLED,
  RESET_PASSWORD,
  RESET_PASSWORD_REJECT,
  RESET_PASSWORD_FULFILLED,
  UPDATE_USER_PROFILE,
  UPDATE_USER_PROFILE_REJECT,
  UPDATE_USER_PROFILE_FULFILLED,
} from "./actionTypes";

const INIT_STATE = {
  response_code_user: null,
  list_user: null,
  user_detail: null,
  message_user: null,
  active_page_user: null,
  total_pages_user: null,
  loading: false,
};

const User = (state = INIT_STATE, action) => {
  switch (action.type) {
    case READ_USER:
      return {
        ...state,
        loading: true,
      };
    case READ_USER_REJECT:
      return {
        ...state,
        response_code_user: action.payload.responseCode,
        message_user: action.payload.description,
        loading: false,
      };
    case READ_USER_FULFILLED:
      return {
        ...state,
        list_user: action.payload.listUser,
        response_code_user: action.payload.responseCode,
        message_user: action.payload.description,
        active_page_user: action.payload.page,
        total_pages_user: action.payload.totalPages,
        loading: false,
      };
    case READ_USER_DETAIL:
      return {
        ...state,
        loading: true,
      };
    case READ_USER_DETAIL_REJECT:
      return {
        ...state,
        response_code_user: action.payload.responseCode,
        message_user: action.payload.description,
        loading: false,
      };
    case READ_USER_DETAIL_FULFILLED:
      return {
        ...state,
        user_detail: action.payload.listUser,
        response_code_user: action.payload.responseCode,
        message_user: action.payload.description,
        loading: false,
      };
    case CREATE_USER:
      return {
        ...state,
        loading: true,
      };
    case CREATE_USER_REJECT:
      return {
        ...state,
        response_code_user: action.payload.responseCode,
        message_user: action.payload.description,
        loading: false,
      };
    case CREATE_USER_FULFILLED:
      return {
        ...state,
        response_code_user: action.payload.responseCode,
        message_user: action.payload.description,
        loading: false,
      };
    case UPDATE_USER:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_USER_REJECT:
      return {
        ...state,
        response_code_user: action.payload.responseCode,
        message_user: action.payload.description,
        loading: false,
      };
    case UPDATE_USER_FULFILLED:
      return {
        ...state,
        response_code_user: action.payload.responseCode,
        message_user: action.payload.description,
        loading: false,
      };
    case UPDATE_USER_PROFILE:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_USER_PROFILE_REJECT:
      return {
        ...state,
        response_code_user: action.payload.responseCode,
        message_user: action.payload.description,
        loading: false,
      };
    case UPDATE_USER_PROFILE_FULFILLED:
      return {
        ...state,
        response_code_user: action.payload.responseCode,
        message_user: action.payload.description,
        loading: false,
      };
    case DELETE_USER:
      return {
        ...state,
        loading: true,
      };
    case DELETE_USER_REJECT:
      return {
        ...state,
        response_code_user: action.payload.responseCode,
        message_user: action.payload.description,
        loading: false,
      };
    case DELETE_USER_FULFILLED:
      return {
        ...state,
        list_user: action.payload.listUser,
        response_code_user: action.payload.responseCode,
        message_user: action.payload.description,
        loading: false,
      };
    case RESET_PASSWORD:
      return {
        ...state,
        loading: true,
      };
    case RESET_PASSWORD_REJECT:
      return {
        ...state,
        response_code_user: action.payload.responseCode,
        message_user: action.payload.description,
        loading: false,
      };
    case RESET_PASSWORD_FULFILLED:
      return {
        ...state,
        response_code_user: action.payload.responseCode,
        message_user: action.payload.description,
        loading: false,
      };
    default:
      return state;
  }
};

export default User;
